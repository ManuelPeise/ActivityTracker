package com.example.activitytrackersyncclientapp.viewModels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.activitytrackersyncclientapp.Screen
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class WelcomeScreenState(
    val title: String = "Welcome to the Activity Tracker Sync Client App!"
)

class WelcomeScreenViewModel: ViewModel() {
    private val _uiState = MutableStateFlow(WelcomeScreenState())

    val uiState: StateFlow<WelcomeScreenState> = _uiState

    private val _navigationEvent = MutableSharedFlow<String>()
    val navigationEvent: SharedFlow<String> = _navigationEvent

    fun navigateToLoginScreen() {
        viewModelScope.launch {
            _navigationEvent.emit(Screen.Login.route)
        }
    }
}