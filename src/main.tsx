import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./styles/index.css";
import Login from "./pages/Login.tsx";
import { TokenProvider } from "./contexts/TokenContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Signup from "./pages/Signup.tsx";
import Navbar from "./components/Navbar";
import ExpensesSummary from "./pages/ExpensesSumary.tsx";
import ExpensesDetail from "./pages/ExpensesDetail";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TokenProvider>
      <BrowserRouter>
        <Navbar />
        <div className="pt-16"> {}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/expenses_summary"
              element={
                <ProtectedRoute>
                  <ExpensesSummary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses_detail"
              element={
                <ProtectedRoute>
                  <ExpensesDetail />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </TokenProvider>
  </StrictMode>
);
