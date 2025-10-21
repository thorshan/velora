import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  useEffect,
} from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/noto-sans-jp";

// Create context
const ColorModeContext = createContext();

// Hook to use the theme mode context
export const useColorMode = () => useContext(ColorModeContext);

// Provider
export const ColorModeProvider = ({ children }) => {
  // Load saved mode from localStorage (default to 'light')
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("themeMode") || "light";
  });

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  // Toggle between light/dark
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  // Define theme
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode, // 'light' or 'dark'

          primary:
            mode === "light"
              ? {
                  main: "#476EAE",
                }
              : {
                  main: "#6A8ACF",
                },
          secondary:
            mode === "light"
              ? {
                  main: "#FF714B",
                }
              : {
                  main: "#CC5736",
                },
          background:
            mode === "light"
              ? {
                  default: "#fafafa",
                  paper: "#ffffff",
                }
              : {
                  default: "#121212",
                  paper: "#1e1e1e",
                },

          text:
            mode === "light"
              ? {
                  primary: "#333333",
                  secondary: "#555555",
                }
              : {
                  primary: "#ffffff",
                  secondary: "#cccccc",
                },
        },
        typography: {
          fontFamily: '"Noto Sans JP", "Roboto", "Arial", sans-serif',
          h1: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif' },
          h2: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif' },
          h3: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif' },
          h4: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif' },
          h5: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif' },
          h6: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif' },
          button: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif' },
          body1: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif' },
          body2: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif' },
          subtitle1: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif' },
          subtitle2: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif' },
          caption: { fontFamily: '"Noto Sans JP", "Roboto", sans-serif' },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
