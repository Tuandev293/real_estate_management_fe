import "./App.css";
import Router from "./router/Router";

import { ThemeProvider } from "@material-tailwind/react";
function App() {
  return (
    <>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </>
  );
}

export default App;
