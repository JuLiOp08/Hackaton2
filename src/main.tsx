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
import AddExpense from "./pages/AddExpense.tsx";
import DeleteExpense from "./pages/DeleteExpense.tsx";
import ExpenseCategories from "./pages/ExpenseCategories.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TokenProvider>
      <BrowserRouter>
        <Navbar />
        <div className="pt-16">
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
            <Route
              path="/expenses/detail/:year/:month/:categoryId"
              element={
                <ProtectedRoute>
                  <AddExpense />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <DeleteExpense />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses_category"
              element={
                <ProtectedRoute>
                  <ExpenseCategories />
                </ProtectedRoute>
              }
              />
            <Route
              path="/add-expense"
              element={
                <ProtectedRoute>
                  <AddExpense />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delete-expense"
              element={
                <ProtectedRoute>
                  <DeleteExpense />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </TokenProvider>
  </StrictMode>
);