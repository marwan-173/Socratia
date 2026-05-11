import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./components/pages/HomePage";
import SignInPage from "./components/pages/SignInPage";
import SignUpPage from "./components/pages/signup/SignUpPage";
import ForgetPasswordPage from "./components/pages/forgetPassword/ForgetPasswordPage";
import WorkspacePage from "./components/pages/workspace/WorkspacePage";
import SocraticSessionPage from "./components/pages/socratic/SocraticSessionPage";
import ComparisonPage from "./components/pages/comparison/ComparisonSessionPage";
import AdminUsersPage from "./components/pages/admin/AdminUsersPage";
import UserLayout from "./components/pages/user/UserLayout";
import UserProfilePage from "./components/pages/user/UserProfilePage";
import UserSecurityPage from "./components/pages/user/UserSecurityPage";
import NotFoundPage from "./components/pages/NotFoundPage";

function getNavbarVariant(pathname, isAuth) {
  if (isAuth) return "app";
  if (pathname === "/signin") return "signin";
  if (pathname === "/signup") return "signup";
  return "home";
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = !!localStorage.getItem("socratia_token");
  const variant = getNavbarVariant(location.pathname, isAuthenticated);

  return (
    <div className="min-h-screen">
      <Navbar variant={variant} />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              onStart={() => {
                const isAuthenticated =
                  !!localStorage.getItem("socratia_token");
                navigate(isAuthenticated ? "/workspace" : "/signin");
              }}
            />
          }
        />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
        <Route path="/socratic-session" element={<SocraticSessionPage />} />
        <Route path="/comparison" element={<ComparisonPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        {/* User Panel */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="security" element={<UserSecurityPage />} />
        </Route>
        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
