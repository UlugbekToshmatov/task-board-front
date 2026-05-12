import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import LoginPage from "../pages/auth/LoginPage";
import { loginLoader } from "../pages/auth/authLoaders";
import RegisterPage from "../pages/auth/RegisterPage";
import TasksPage from "../pages/task/TasksPage";
import TaskDetailsPage from "../pages/task/TaskDetailsPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public routes */}
      <Route
        path="/login"
        element={<LoginPage />}
        loader={loginLoader}
      />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/tasks" replace />} />

        <Route path="/tasks">
          <Route index element={<TasksPage />} />
          <Route path=":id" element={<TaskDetailsPage />} />
        </Route>
      </Route>
    </>
  )
);
