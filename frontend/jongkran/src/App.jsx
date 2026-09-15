import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import AppProviders from "./app/AppProviders";
import AppRoutes from "./app/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <Suspense fallback={<main className="min-h-screen" aria-busy="true" />}>
          <AppRoutes />
        </Suspense>
      </AppProviders>
    </BrowserRouter>
  );
}
