const useStyles = () => {
  return {
    theme: {
      palette: {
        surface: "#ffffff",
        surfaceAlt: "#f8fafc",
        appBackground: "#eef2ff",
        textPrimary: "#0f172a",
        textSecondary: "#475569",
        accent: "#2563eb",
        accentHover: "#1d4ed8",
        divider: "#e2e8f0",
      },
      fonts: {
        sizeSmall: "0.875rem",
        sizeMedium: "1rem",
        sizeLarge: "1.375rem",
        weightMedium: 500,
        weightBold: 700,
      },
      borders: {
        radiusSmall: 1,
        radiusMedium: 2,
        radiusLarge: 3,
      },
      shadows: {
        card: "0 10px 24px rgba(15, 23, 42, 0.08)",
      },
      spacing: {
        sectionX: { xs: 2, sm: 3, md: 4 },
        sectionY: { xs: 2, sm: 3 },
      },
    },
    styles: {
      box: {
        width: "100%",
        marginBottom: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: ".5rem",
      },
    },
  };
};

export default useStyles;
