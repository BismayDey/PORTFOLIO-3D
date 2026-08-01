import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// Case-study pages are a separate chunk — the 3D-heavy home page should not
// pay for them, and they should not pay for three.js.
const ClientProjectPage = lazy(() => import("./pages/ClientProjectPage.tsx"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/client/:slug" element={<ClientProjectPage />} />
          <Route path="*" element={<App />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>
);
