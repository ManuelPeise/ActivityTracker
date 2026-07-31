package com.example.activitytrackersyncclientapp.services

import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

object JsonSerializer {

    @PublishedApi
    internal val json = Json {
        ignoreUnknownKeys = true
        isLenient = true
        encodeDefaults = true
        coerceInputValues = true
    }

    inline fun <reified T> toJson(obj: T): String {
            return json.encodeToString(obj)
    }

    inline fun <reified T> toModel(jsonString: String): T =
        json.decodeFromString(jsonString)
}