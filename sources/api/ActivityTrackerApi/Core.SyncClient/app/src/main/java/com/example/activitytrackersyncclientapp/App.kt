package com.example.activitytrackersyncclientapp

import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.activitytrackersyncclientapp.screens.DashboardScreen
import com.example.activitytrackersyncclientapp.screens.LoginScreen
import com.example.activitytrackersyncclientapp.screens.WelcomeScreen

@Composable
fun App() {

    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = Screen.Welcome.route
    ) {

        composable(Screen.Welcome.route) {
                WelcomeScreen(LocalContext.current, navController)
        }

        composable(Screen.Login.route) {
            LoginScreen(LocalContext.current, navController)
        }

        composable(Screen.Dashboard.route) {
            DashboardScreen(LocalContext.current)
        }
    }
}