import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import UserProfile from "./components/UserProfile";
import AgileTestDashboard from "./components/AgileTestDashboard";
import TasksView from "./components/KanbanBoard";
import ProtectedRoute from "./components/Routes/ProtectedRoutes";
import { ProjectProvider } from "./contexts/ProjectContext";
import { isAuthenticated } from "./services/api";
import Layout from "./pages/Index";
import { LayoutDashboard } from "lucide-react";
import Dashboard from "./components/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ---------- PUBLIC ROUTES ---------- */}
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage />
              )
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated() ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated() ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <RegisterPage />
              )
            }
          />
          <Route
            path="/forgot-password"
            element={
              isAuthenticated() ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <ForgotPasswordPage />
              )
            }
          />

          {/* ---------- PRIVATE ROUTES ---------- */}
          <Route
            element={
              <ProtectedRoute>
                {/* 👇 Wrap all private routes with ProjectProvider */}
                <ProjectProvider>
                  <Layout /> {/* Sidebar + Outlet */}
                </ProjectProvider>
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks-list" element={<TasksView />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route
              path="/test-agile"
              element={
                <AgileTestDashboard
                  projectId={1}
                  projectName="Test Agile Project"
                />
              }
            />
          </Route>

          {/* ---------- CATCH-ALL ROUTE ---------- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
