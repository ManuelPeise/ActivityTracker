package com.example.activitytrackersyncclientapp.network
import com.example.activitytrackersyncclientapp.models.RefreshRequest
import com.example.activitytrackersyncclientapp.services.TokenManager
import kotlinx.coroutines.runBlocking
import okhttp3.Authenticator
import okhttp3.Request
import okhttp3.Response
import okhttp3.Route

class TokenAuthenticator(private val tokenManager: TokenManager,
                         private val authApi: AuthApi
): Authenticator {

    @Synchronized
    override fun authenticate(
        route: Route?,
        response: Response
    ): Request? {

        if (responseCount(response) >= 2) {
            return null
        }

        val refreshToken = tokenManager.getRefreshToken()
            ?: return null

        val refreshResponse = runBlocking {
            authApi.refresh(RefreshRequest(refreshToken))
        }

        tokenManager.saveTokens(
            refreshResponse.jwt,
            refreshResponse.refreshToken
        )

        return response.request.newBuilder()
            .header(
                "Authorization",
                "Bearer ${refreshResponse.jwt}"
            )
            .build()
    }

    private fun responseCount(response: Response): Int {
        var result = 1
        var current = response.priorResponse

        while (current != null) {
            result++
            current = current.priorResponse
        }

        return result
    }
}