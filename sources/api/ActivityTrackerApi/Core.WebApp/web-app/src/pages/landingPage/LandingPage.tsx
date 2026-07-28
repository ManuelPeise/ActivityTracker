import React from "react";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import PageContainer from "../../components/wrappers/PageContainer";
import useStyles from "../../hooks/useStyles";

const highlights = [
  { title: "Today", value: "4h 20m", subtitle: "Tracked activity time" },
  { title: "Tasks", value: "12", subtitle: "Open tasks" },
  { title: "Streak", value: "8 days", subtitle: "Consistent tracking" },
];

const LandingPage: React.FC = () => {
  const { theme } = useStyles();

  return (
    <PageContainer showUserInfo={true} alignRoot="flex-start" alignItems="flex-start">
      <Stack spacing={2.5} sx={{ width: "100%" }}>
        <Box>
          <Typography
            sx={{
              fontSize: "1.6rem",
              fontWeight: theme.fonts.weightBold,
              color: theme.palette.textPrimary,
            }}
          >
            Welcome back
          </Typography>
          <Typography sx={{ color: theme.palette.textSecondary, mt: 0.5 }}>
            Here is a quick overview of your activity today.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          {highlights.map((item) => (
            <Card
              key={item.title}
              sx={{
                borderRadius: theme.borders.radiusLarge,
                boxShadow: theme.shadows.card,
                background: "linear-gradient(135deg, #ffffff 0%, #eef2ff 100%)",
              }}
            >
              <CardContent>
                <Stack spacing={1}>
                  <Chip label={item.title} size="small" sx={{ width: "fit-content" }} />
                  <Typography sx={{ fontSize: "1.4rem", fontWeight: theme.fonts.weightBold }}>
                    {item.value}
                  </Typography>
                  <Typography sx={{ color: theme.palette.textSecondary }}>
                    {item.subtitle}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Stack>
    </PageContainer>
  );
};

export default LandingPage;
