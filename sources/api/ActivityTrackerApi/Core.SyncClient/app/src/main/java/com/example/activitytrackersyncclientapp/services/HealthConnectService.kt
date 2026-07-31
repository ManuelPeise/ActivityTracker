package com.example.activitytrackersyncclientapp.services

import android.content.Context
import androidx.health.connect.client.time.TimeRangeFilter
import androidx.activity.result.contract.ActivityResultContract
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.HealthConnectFeatures
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission.Companion.getReadPermission
import androidx.health.connect.client.records.DistanceRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.records.TotalCaloriesBurnedRecord
import androidx.health.connect.client.records.ActiveCaloriesBurnedRecord
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.RestingHeartRateRecord
import androidx.health.connect.client.records.HeartRateVariabilityRmssdRecord
import androidx.health.connect.client.records.WeightRecord
import androidx.health.connect.client.records.HeightRecord
import androidx.health.connect.client.records.BodyFatRecord
import androidx.health.connect.client.records.LeanBodyMassRecord
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.records.HydrationRecord
import androidx.health.connect.client.records.NutritionRecord
import androidx.health.connect.client.records.BloodPressureRecord
import androidx.health.connect.client.records.BloodGlucoseRecord
import androidx.health.connect.client.records.BodyTemperatureRecord
import androidx.health.connect.client.records.ExerciseSessionRecord
import androidx.health.connect.client.records.Record
import androidx.health.connect.client.request.ReadRecordsRequest
import com.example.activitytrackersyncclientapp.models.HealthConnectProvider
import com.example.activitytrackersyncclientapp.models.MetricType
import kotlin.reflect.KClass
import java.time.Instant
import java.time.LocalTime


class HealthConnectService(context: Context) {
    private companion object {
        private val SUPPORTED_RECORD_TYPES: Set<KClass<out Record>> = setOf(
            StepsRecord::class,
            DistanceRecord::class,
            TotalCaloriesBurnedRecord::class,
            ActiveCaloriesBurnedRecord::class,
            HeartRateRecord::class,
            RestingHeartRateRecord::class,
            HeartRateVariabilityRmssdRecord::class,
            WeightRecord::class,
            HeightRecord::class,
            BodyFatRecord::class,
            LeanBodyMassRecord::class,
            SleepSessionRecord::class,
            HydrationRecord::class,
            NutritionRecord::class,
            BloodPressureRecord::class,
            BloodGlucoseRecord::class,
            BodyTemperatureRecord::class,
            ExerciseSessionRecord::class
        )
    }

    private val appContext = context.applicationContext
    private val healthConnectClient by lazy { HealthConnectClient.getOrCreate(appContext) }

    val readPermissions: Set<String> = SUPPORTED_RECORD_TYPES.mapTo(linkedSetOf(), ::getReadPermission)

    fun getAvailableMetricTypes(): List<MetricType> {
        return SUPPORTED_RECORD_TYPES.filter { recordClass ->
            isFeatureAvailable(recordClass.hashCode())
        }.map { recordClass ->
            MetricType(
                id = recordClass.hashCode(),
                name = recordClass.simpleName ?: "Unknown",
                isGranted = false,
                isActive = false
            )
        }

    }

    suspend fun getAvailableSources(): List<HealthConnectProvider> {
        if (!isHealthConnectAvailable()) {
            return emptyList()
        }

        val start = getStartTime()
        val end = getEndTime()
        val sourcePackages = linkedSetOf<String>()

        SUPPORTED_RECORD_TYPES.forEach { recordClass ->
            runCatching {
                readRecordsForType(start, end, recordClass)
            }.getOrDefault(emptyList()).forEach { record ->
                val packageName = record.metadata.dataOrigin.packageName
                if (!packageName.isBlank()) {
                    sourcePackages.add(packageName)
                }
            }
        }

        return sourcePackages.distinct().map { packageName ->
            HealthConnectProvider(
                id = packageName.hashCode(),
                name = packageName
            )
        }
    }

    fun isHealthConnectAvailable(): Boolean = runCatching {
        HealthConnectClient.getOrCreate(appContext)
    }.isSuccess

    fun getStartTime(): Instant {
        val now: LocalTime = LocalTime.now()
        return Instant.now().minusSeconds(now.hour * 3600L + now.minute * 60L + now.second)
    }

    fun getEndTime(): Instant {
        return Instant.now()
    }

    fun isFeatureAvailable(feature: Int): Boolean =
        healthConnectClient.features.getFeatureStatus(feature) == HealthConnectFeatures.FEATURE_STATUS_AVAILABLE

    suspend fun hasAllPermissions(): Boolean {
        val grantedPermissions = healthConnectClient.permissionController.getGrantedPermissions()
        return grantedPermissions.containsAll(readPermissions)
    }

    fun requestPermissionActivityContract(): ActivityResultContract<Set<String>, Set<String>> {
        return PermissionController.createRequestPermissionResultContract()
    }

    suspend inline fun <reified T : Record> readRecords(start: Instant, end: Instant): List<T> {
        return readRecords(start, end, T::class)
    }

    suspend fun <T : Record> readRecords(start: Instant, end: Instant, recordClass: KClass<T>): List<T> {
        require(!end.isBefore(start)) { "Invalid time range: end must be >= start." }

        val request = ReadRecordsRequest(
            recordType = recordClass,
            timeRangeFilter = TimeRangeFilter.between(start, end)
        )
        val response = healthConnectClient.readRecords(request)

        return response.records
    }

    @Suppress("UNCHECKED_CAST")
    private suspend fun readRecordsForType(
        start: Instant,
        end: Instant,
        recordClass: KClass<out Record>
    ): List<Record> {
        return readRecords(start, end, recordClass as KClass<Record>)
    }
}