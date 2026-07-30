package com.example.activitytrackersyncclientapp.network

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import android.util.Log

data class ApiResponse<TResponse>(
    val success: Boolean,
    val message: String,
    val data: TResponse? = null
)

object ApiService  {
    val client = OkHttpClient.Builder()
        .build()

    val baseUrl: String = runCatching {
        Class.forName("com.example.activitytrackersyncclientapp.BuildConfig")
            .getField("API_BASE_URL")
            .get(null) as String
    }.getOrDefault("")


    val mediaType =
        "application/json".toMediaType()

    suspend inline fun <reified TResponse> sendGetRequest(
        url: String
    ): ApiResponse<TResponse> {

        return withContext(Dispatchers.IO) {
            val requestUrl = baseUrl + url

            val request = Request.Builder()
                .url(requestUrl)
                .headers(okhttp3.Headers.Builder()
                    .add("Content-Type", "application/json")
                    .build()
                )
                .get()
                .build()

            val response = client.newCall(request)
                .execute()

            if (response.code == 200) {
                val body = response.body?.string() ?: ""
                Log.e("ApiService ~ 54", "Response body: $body")

                val responseModel = Json.decodeFromString<TResponse>(body)

                ApiResponse<TResponse>(
                    success = true,
                    message = "Success",
                    data = responseModel
                )

            } else {

                ApiResponse<TResponse>(
                    success = false,
                    message = response.message,
                    data = null
                )
            }
        }
    }

    suspend inline fun <reified TResponse, reified TRequest> sendPostRequest(
        url: String,
        body: TRequest
    ): ApiResponse<TResponse> {

        return withContext(Dispatchers.IO) {

            val jsonBody =
                Json.encodeToString(body)

            val requestBody =
                jsonBody.toRequestBody(mediaType)

            val requestUrl = baseUrl + url

            val request = Request.Builder()
                .url(requestUrl)
                .headers(okhttp3.Headers.Builder()
                    .add("Content-Type", "application/json")
                    .build()
                )
                .post(requestBody)
                .build()

            val response =
                client.newCall(request)
                    .execute()

            if (response.code == 200) {

                val body = response.body?.string() ?: ""
                Log.e("ApiService ~ 106", "Response body: $body")

                val responseModel = Json.decodeFromString<TResponse>(body)

                ApiResponse<TResponse>(
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
}