import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import { RouterProvider } from "react-router";
import { appRouter } from "./routes";
// import { AlertProvider } from "./components/blocks/AlertProvider";

function App() {
  return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={appRouter} />
      </ThemeProvider>

  );
}

export default App;
