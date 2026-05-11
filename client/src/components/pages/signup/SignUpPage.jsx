import { useNavigate } from "react-router-dom";
import SignUpForm from "./SignUpForm";

export default function SignUpPage() {
  const navigate = useNavigate();
  return <SignUpForm onSuccess={() => navigate("/signin")} />;
}
