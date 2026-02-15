import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AppContextProvider from "./context/AppContext.jsx";
// 1. استيراد المكتبة
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* 2. تغليف التطبيق بمزود جوجل ووضع الـ Client ID الخاص بكِ */}
    <GoogleOAuthProvider clientId="925476430411-4ja8mobl3qs56m7hgid5tsts0dklbkkl.apps.googleusercontent.com">
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>,
);
