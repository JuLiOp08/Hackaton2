import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./styles/index.css";
import Login from "./pages/Login.tsx";
import { TokenProvider } from "./contexts/TokenContext.tsx";
import StudentForm from "./pages/StudentForm.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import GetStudents from "./pages/GetStudents.tsx";
import Signup from "./pages/Signup.tsx";
import IdStudent from "./pages/IdStudent.tsx";
import DeleteStudent from "./pages/DeleteStudent.tsx";
import Navbar from "./components/Navbar";

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
              path="/student_form"
              element={
                <ProtectedRoute>
                  <StudentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/get_students"
              element={
                <ProtectedRoute>
                  <GetStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/id"
              element={
                <ProtectedRoute>
                  <IdStudent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/delete"
              element={
                <ProtectedRoute>
                  <DeleteStudent/>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </TokenProvider>
  </StrictMode>
);
