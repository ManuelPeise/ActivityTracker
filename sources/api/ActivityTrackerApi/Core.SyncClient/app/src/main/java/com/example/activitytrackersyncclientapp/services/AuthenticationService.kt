package com.example.activitytrackersyncclientapp.services

import android.content.Context
import com.example.activitytrackersyncclientapp.network.ApiService
import kotlinx.serialization.Serializable
import android.util.Log

@Serializable

data class AuthenticationRequest(
    val emailAddress: String,
    val password: String,
    val clientType: String
)
@Serializable
data class TokenResponse(
    val jwt: String,
    val refreshToken: String
)

class AuthenticationService(
    context: Context? = null,
    apiService: ApiService = ApiService
) {

    private val api = apiService
    private val storage = context?.let { SecureStorageService(it) }

    suspend fun handleLogin(email: String, password: String, clientType: String): TokenResponse? {
        try{

            val request = AuthenticationRequest(
                emailAddress = email,
                password = password,
                clientType = clientType
            )

            val response = api.sendPostRequest<TokenResponse, AuthenticationRequest>(
                "authentication/authenticateUser",
                request
            )

            if (!response.success) return null

            val tokenResponse = response.data ?: return null
            storage?.saveTokens(tokenResponse)
            return tokenResponse
        } catch (e: Exception) {
            Log.e("AuthenticationService ~ 51", "Login failed ${e.message}", e)
            return null
        }
    }

    suspend fun handleSaveTokens(accessToken: String, refreshToken: String) {
        storage?.saveTokens(TokenResponse(jwt = accessToken, refreshToken = refreshToken))
    }

    suspend fun handleGetTokens(): TokenResponse? {
        return storage?.getTokens()
    }

    suspend fun handleLogout() {
        storage?.clearTokens()
    }
}