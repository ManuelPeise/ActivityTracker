import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";

const SandBox: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3} sx={{ maxWidth: 760 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Sandbox Form
          </Typography>
          <Typography color="text.secondary">
            Main form with a nested partial address form.
          </Typography>
        </Box>

        <Paper variant="outlined" sx={{ p: 3 }}></Paper>

        <Paper variant="outlined" sx={{ p: 3 }}></Paper>

        <Stack direction="row" spacing={2}></Stack>

        <Paper variant="outlined" sx={{ p: 3 }}></Paper>
      </Stack>
    </Box>
  );
};

export default SandBox;
