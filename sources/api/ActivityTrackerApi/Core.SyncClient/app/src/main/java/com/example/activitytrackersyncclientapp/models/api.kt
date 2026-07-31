package com.example.activitytrackersyncclientapp.models

import kotlinx.serialization.Serializable

data class ApiRequest<TResponse>(
    val url: String,
    val method: String,
    val data: TResponse? = null
)

data class ApiResponse<TResponse>(
    val success: Boolean,
    val message: String,
    val data: TResponse? = null
)

@Serializable
data class AuthenticationRequest(
    val emailAddress: String,
    val password: String,
    val clientType: String
)

@Serializable
data class RefreshRequest(
    val refreshToken: String
)

@Serializable
    data class TokenResponse(
    val jwt: String,
    val refreshToken: String
)