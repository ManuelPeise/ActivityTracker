package com.example.activitytrackersyncclientapp.models

data class MetricType(
    val id: Int = 0,
    val name: String = "",
    val isGranted: Boolean = false,
    val isActive: Boolean = false
)