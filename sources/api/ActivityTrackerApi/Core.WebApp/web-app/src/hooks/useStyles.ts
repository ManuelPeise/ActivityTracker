const useStyles = () => {
  return {
    theme: {
      background: {
        primary: "#ffffff",
        secondary: "#f0f0f0",
        danger: "#ff0000",
        buttonBlue: "#86b1f1",
      },
      fonts: {
        sizeSmall: "12px",
        sizeMedium: "16px",
        sizeLarge: "20px",
        textDark: "#000000",
        disabled: "#999999",
        textLight: "#ffffff",
        bold: "bold",
      },
      borders: {
        radiusSmall: 4,
        radiusMedium: 8,
        radiusLarge: 12,
      },
      opacity: {
        disabled: 0.5,
        hover: 0.8,
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
