package com.example.activitytrackersyncclientapp.network

import com.example.activitytrackersyncclientapp.services.TokenManager
import okhttp3.Interceptor

class AuthInterceptor(tokenStorage: TokenManager): Interceptor {

    val storage = tokenStorage
    override fun intercept(chain: Interceptor.Chain): okhttp3.Response {
        val request = chain.request()
        val accessToken = storage.getAccessToken()

        val authenticatedRequest = request.newBuilder()
            .addHeader("Authorization", "Bearer ${accessToken ?: ""}")
            .build()

        return chain.proceed(authenticatedRequest)
    }

}