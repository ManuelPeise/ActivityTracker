package com.example.activitytrackersyncclientapp.network

import com.example.activitytrackersyncclientapp.BuildConfig
import com.example.activitytrackersyncclientapp.models.ApiRequest
import com.example.activitytrackersyncclientapp.models.ApiResponse
import com.example.activitytrackersyncclientapp.models.RefreshRequest
import com.example.activitytrackersyncclientapp.models.TokenResponse
import com.example.activitytrackersyncclientapp.services.JsonSerializer
import com.example.activitytrackersyncclientapp.services.TokenManager
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.RequestBody.Companion.toRequestBody
import retrofit2.http.Body
import retrofit2.http.POST
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

interface AuthApi {
    @POST("token/refreshToken")
    suspend fun refresh(
        @Body request: RefreshRequest
    ): TokenResponse
}

class ApiService(private val isPrivate: Boolean = true,
                 private val tokenManager: TokenManager,
                 private val authApi: AuthApi,
                 val jsonSerializer: JsonSerializer) {

    val baseUrl: String = BuildConfig.API_BASE_URL

    val client = if (isPrivate) {
        OkHttpClient.Builder()
            .addInterceptor(AuthInterceptor(tokenManager))
            .authenticator(
                TokenAuthenticator(tokenManager, authApi)
            )
            .build()
    } else {
        OkHttpClient.Builder().build()
    }

    suspend inline fun <reified TRequest, reified TResponse> sendRequest(request: ApiRequest<TRequest>): ApiResponse<TResponse> =
        withContext(Dispatchers.IO) {

            val requestUrl = baseUrl + request.url

            val requestBuilder = okhttp3.Request.Builder()
            .url(requestUrl)
            .headers(okhttp3.Headers.Builder()
                .add("Content-Type", "application/json")
                .build()
            )

            if(request.method == "GET") {
                requestBuilder.get()
            }

            if(request.method == "POST") {
                val jsonBody = jsonSerializer.toJson<TRequest>(request.data as TRequest)

                val requestBody = jsonBody
                    .toRequestBody("application/json".toMediaType())
                    requestBuilder.post(requestBody)
            }

            val response = client.newCall(requestBuilder.build()).execute()

            if (response.isSuccessful) {
                val body = response.body?.string() ?: ""
                val responseModel = jsonSerializer.toModel<TResponse>(body)

                ApiResponse(
                    success = true,
                    message = "Success",
                    data = responseModel
                )
            } else {
                ApiResponse(
                    success = false,
                    message = response.message,
                    data = null
                )
            }
    }
}