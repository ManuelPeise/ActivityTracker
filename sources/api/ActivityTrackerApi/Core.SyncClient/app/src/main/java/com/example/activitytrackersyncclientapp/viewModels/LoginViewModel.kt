package com.example.activitytrackersyncclientapp.viewModels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.activitytrackersyncclientapp.Screen
import com.example.activitytrackersyncclientapp.models.ApiRequest
import com.example.activitytrackersyncclientapp.models.AuthenticationRequest
import com.example.activitytrackersyncclientapp.models.TokenResponse
import com.example.activitytrackersyncclientapp.network.ApiService
import com.example.activitytrackersyncclientapp.services.TokenManager
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

class LoginViewModel(private  val apiService: ApiService,
                     private val tokenManager: TokenManager) : ViewModel() {

    private val _uiState = MutableStateFlow(LoginState())

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
            if (_uiState.value.email.isBlank() || _uiState.value.password.isBlank()) {
                _uiState.update { it.copy(error = "Email and password cannot be empty!") }
                return@launch
            }
            _uiState.update { it.copy(isLoading = true, error = null) }

            try {
                val tokenResponse = apiService.sendRequest<AuthenticationRequest, TokenResponse>(
                    ApiRequest(
                        url = "authentication/authenticateUser",
                        method = "POST",
                        data = AuthenticationRequest(
                            emailAddress = _uiState.value.email,
                            password = _uiState.value.password,
                            clientType = "sync-client"
                        )
                    )
                )

                if (tokenResponse.data != null && tokenResponse.data.jwt.isNotEmpty() && tokenResponse.data.refreshToken.isNotEmpty()) {
                    tokenManager.saveTokens(tokenResponse.data.jwt, tokenResponse.data.refreshToken)
                    _uiState.update { it.copy(isLoading = false, error = null) }
                    _navigationEvent.emit(Screen.Dashboard.route)
                    return@launch
                }

                _uiState.update { it.copy(isLoading = false, error = tokenResponse.message.ifBlank { "Login failed" }) }
            } catch (_: Exception) {
                _uiState.update { it.copy(isLoading = false, error = "Login failed, please try again.") }
            }
        }
    }

    fun onNavigateToWelcomeScreen() {
        viewModelScope.launch {
            _navigationEvent.emit(Screen.Welcome.route)
        }
    }
}