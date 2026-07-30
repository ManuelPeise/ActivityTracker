package com.example.activitytrackersyncclientapp.viewModels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.activitytrackersyncclientapp.Screen
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class LoginState(
    val email: String = "",
    val password: String = "",
    val isLoading: Boolean = false,
    val error: String? = null
)

class LoginViewModel : ViewModel() {

    private val _uiState = MutableStateFlow(LoginState())
    private val _authenticationService = com.example.activitytrackersyncclientapp.services.AuthenticationService()

    val uiState: StateFlow<LoginState> = _uiState

    private val _navigationEvent = MutableSharedFlow<String>()
    val navigationEvent: SharedFlow<String> = _navigationEvent

    fun onEmailChanged(email: String) {
        _uiState.update { it.copy(email = email) }
    }

    fun onPasswordChanged(password: String) {
        _uiState.update { it.copy(password = password) }
    }

    fun onLogin() {
        viewModelScope.launch {
            if(_uiState.value.email.isBlank() || _uiState.value.password.isBlank()) {
                _uiState.update { it.copy(error = "Email and password cannot be empty!") }
                return@launch
            }
            _uiState.update { it.copy(isLoading = true, error = null) }

            val tokenResponse = _authenticationService.handleLogin(_uiState.value.email, _uiState.value.password, "sync-client")

            if(tokenResponse != null && tokenResponse.jwt.isNotEmpty() && tokenResponse.refreshToken.isNotEmpty()) {

                _authenticationService.handleSaveTokens(tokenResponse.jwt, tokenResponse.refreshToken)
                _uiState.update { it.copy(isLoading = false, error = null) }
                _navigationEvent.emit(Screen.Dashboard.route)
            }else{
                _uiState.update { it.copy(isLoading = false, error = "Login failed") }
            }

            _uiState.update { it.copy(isLoading = false, error = "Login failed, please try again.") }
        }
    }

    fun onNavigateToWelcomeScreen() {
        viewModelScope.launch {
            _navigationEvent.emit(Screen.Welcome.route)
        }
    }
}