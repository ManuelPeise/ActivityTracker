package com.example.activitytrackersyncclientapp.screens

import android.content.Context
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.activitytrackersyncclientapp.components.CustomButton
import com.example.activitytrackersyncclientapp.viewModels.DashboardViewModel
import com.example.activitytrackersyncclientapp.viewModels.ViewModelFactory


@Composable
fun DashboardScreen(context: Context,
                    viewModel: DashboardViewModel = viewModel(factory = ViewModelFactory(context))) {

    val uiState by viewModel.uiState.collectAsState()

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = viewModel.permissionRequestActivityContract(),
        onResult = viewModel::onPermissionRequestResult
    )

    LaunchedEffect(Unit) {
        viewModel.checkHealthConnectPermissions()
    }



    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "Welcome to the Dashboard",
                style = MaterialTheme.typography.headlineSmall,
                color = MaterialTheme.colorScheme.onBackground
            )

            Text(
                text = "Heart Rate: ${uiState.heartRate ?: "N/A"}",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onBackground
            )

            Text(
                text = "Steps: ${uiState.steps ?: "N/A"}",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onBackground
            )

            CustomButton(
                label = "Request Health Connect Permissions",
                disabled = uiState.permissionsGranted,
                onPress = {
                    permissionLauncher.launch(viewModel.readPermissions)
                },
                modifier = Modifier.padding(top = 16.dp)
            )

            CustomButton(
                label = "Load Health Data",
                disabled = !uiState.permissionsGranted,
                onPress = {
                    viewModel.initializeData()
                },
                modifier = Modifier.padding(top = 16.dp)
            )
        }
    }
}