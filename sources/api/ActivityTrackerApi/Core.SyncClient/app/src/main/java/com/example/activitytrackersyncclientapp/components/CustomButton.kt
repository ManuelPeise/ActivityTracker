package com.example.activitytrackersyncclientapp.components

import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun CustomButton(
    label: String,
    onPress: () -> Unit,
    modifier: Modifier = Modifier,
    disabled: Boolean = false,
    hasLoadingState: Boolean = false,
    isLoading: Boolean = false
) {
    Button(
        onClick = {
            onPress()
        },
        enabled = !disabled,
        modifier = modifier.fillMaxWidth(),
        contentPadding = PaddingValues(vertical = 12.dp),
        shape = MaterialTheme.shapes.medium
    )   {
        if (hasLoadingState && isLoading) {
            CircularProgressIndicator(
                color = MaterialTheme.colorScheme.onPrimary,
                strokeWidth = 2.dp,
                modifier = Modifier.padding(horizontal = 8.dp).width(16.dp).height(16.dp)
            )
        } else {
            Text(label, style = MaterialTheme.typography.labelLarge, modifier = Modifier.padding(horizontal = 8.dp))
            }
        }
    }

