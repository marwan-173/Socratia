import { useNavigate } from "react-router-dom";
import ForgetPasswordForm from "./components/ForgetPasswordForm";

export default function ForgetPasswordPage() {
  const navigate = useNavigate();
  return <ForgetPasswordForm onSuccess={() => navigate("/signin")} />;
}
