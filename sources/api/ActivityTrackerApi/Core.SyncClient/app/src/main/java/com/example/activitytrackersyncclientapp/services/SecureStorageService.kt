package com.example.activitytrackersyncclientapp.services

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.emptyPreferences
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import java.io.IOException

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "auth_storage")

class SecureStorageService(private val context: Context) {

    companion object {
        private val TOKEN_KEY  = stringPreferencesKey("token")

    }

    suspend fun saveTokens(token: TokenResponse) {
        val tokenJson = kotlinx.serialization.json.Json.encodeToString(TokenResponse.serializer(), token)
        context.dataStore.edit { it[TOKEN_KEY] = tokenJson }
    }

    suspend fun getTokens(): TokenResponse? {
        val tokenJson = context.dataStore.data
            .catch { e -> if (e is IOException) emit(emptyPreferences()) else throw e }
            .map { it[TOKEN_KEY] }
            .first()

        return if (tokenJson != null) {
            kotlinx.serialization.json.Json.decodeFromString(TokenResponse.serializer(), tokenJson)
        } else {
            null
        }
    }

    suspend fun clearTokens() {
        context.dataStore.edit {
            it.remove(TOKEN_KEY)
        }
    }
}