package com.example.activitytrackersyncclientapp.viewModels

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.example.activitytrackersyncclientapp.BuildConfig
import com.example.activitytrackersyncclientapp.network.ApiService
import com.example.activitytrackersyncclientapp.network.AuthApi
import com.example.activitytrackersyncclientapp.services.JsonSerializer
import com.example.activitytrackersyncclientapp.services.TokenManager
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class ViewModelFactory(private val context: Context) : ViewModelProvider.Factory {

    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if(modelClass.isAssignableFrom(WelcomeScreenViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return WelcomeScreenViewModel() as T
        }
        else if (modelClass.isAssignableFrom(LoginViewModel::class.java)) {
            val appContext = context.applicationContext
            val tokenManager = TokenManager(appContext)
            val retrofit = Retrofit.Builder()
                .baseUrl(normalizeBaseUrl(BuildConfig.API_BASE_URL))
                .addConverterFactory(GsonConverterFactory.create())
                .build()
            val authApi = retrofit.create(AuthApi::class.java)
            val apiService = ApiService(
                isPrivate = false,
                tokenManager = tokenManager,
                authApi = authApi,
                jsonSerializer = JsonSerializer
            )

            @Suppress("UNCHECKED_CAST")
            return LoginViewModel(apiService, tokenManager) as T
        }
        else if(modelClass.isAssignableFrom(DashboardViewModel::class.java)) {
            val appContext = context.applicationContext
            @Suppress("UNCHECKED_CAST")
            return DashboardViewModel(appContext) as T
        }

        throw IllegalArgumentException("Unknown ViewModel class: ${modelClass.name}")
    }

    private fun normalizeBaseUrl(baseUrl: String): String {
        return if (baseUrl.endsWith("/")) baseUrl else "$baseUrl/"
    }


 }
