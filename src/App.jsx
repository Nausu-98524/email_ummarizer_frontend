import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PublicRoute from "./components/auth/PublicRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import NotFoundPage from "./components/common/NotFoundPage";
import MailboxConfiguration from "./pages/MailboxConfiguration";
import BulkEmailManagment from "./pages/BulkEmailManagment";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Route */}
        {/* <Route path="/*" element={<NotFoundPage />} /> */}

        <Route
          path="/*"
          element={
            <PublicRoute>
              <NotFoundPage />
            </PublicRoute>
          }
        />
        <Route
          path="/Login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/*" element={<NotFoundPage />} />
            <Route path="/EmailDashboard" element={<Dashboard />} />
            <Route
              path="/MailboxConfiguration"
              element={<MailboxConfiguration />}
            />
            <Route
              path="/BulkEmailManagement"
              element={<BulkEmailManagment />}
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
