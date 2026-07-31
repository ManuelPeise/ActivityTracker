package com.example.activitytrackersyncclientapp.viewModels

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.activitytrackersyncclientapp.services.HealthConnectService
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import androidx.activity.result.contract.ActivityResultContract
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.StepsRecord
import java.time.Instant
import java.time.ZoneId
import kotlin.math.roundToInt

data class DashboardDataModel(
    val isLoading: Boolean = false,
    val error: String? = null,
    val heartRate: Double? = null,
    val steps: Long? = null,
    val sleepHours: Double? = null,
    val permissionsGranted: Boolean = false
)

class DashboardViewModel(context: Context) : ViewModel() {

    private val _uiState = MutableStateFlow(DashboardDataModel())
    val uiState: StateFlow<DashboardDataModel> = _uiState

    private val healthConnectService = HealthConnectService(context)
    val readPermissions: Set<String>
        get() = healthConnectService.readPermissions

    fun permissionRequestActivityContract(): ActivityResultContract<Set<String>, Set<String>> {
        return healthConnectService.requestPermissionActivityContract()
    }

    fun onPermissionRequestResult(grantedPermissions: Set<String>) {
        val granted = grantedPermissions.containsAll(readPermissions)
        _uiState.value = _uiState.value.copy(permissionsGranted = granted, error = null)
        checkHealthConnectPermissions()
    }

    fun checkHealthConnectPermissions() {
        viewModelScope.launch {
            val isAvailable = healthConnectService.isHealthConnectAvailable()

            if (isAvailable) {
                val permissionsGranted = healthConnectService.hasAllPermissions()
                _uiState.value = _uiState.value.copy(permissionsGranted = permissionsGranted, error = null)
            } else {
                _uiState.value = _uiState.value.copy(error = "Health Connect is not available on this device.")
            }
        }
    }

    fun initializeData() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            val now: Instant = healthConnectService.getEndTime()
            val startTime: Instant = healthConnectService.getStartTime()
            val start: Instant = now.minusSeconds(startTime.atZone(ZoneId.systemDefault()).hour * 60 * 60L) // 24 hours ago

            try {
                val heartRate = healthConnectService.readRecords<HeartRateRecord>(start, now)
                val steps = healthConnectService.readRecords<StepsRecord>(start, now)

                val calculatedHeartRate = heartRate.map { it.samples.sumOf { it -> it.beatsPerMinute } }.average() ?: 0.0
                val totalSteps = steps.sumOf { it.count }

                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    heartRate = calculatedHeartRate.roundToInt().toDouble(),
                    steps = totalSteps,
                    sleepHours = 0.0,
                    error = null
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = "Failed to fetch data: ${e.message}"
                )
            }
        }
    }



}

