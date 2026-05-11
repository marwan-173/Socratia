import { useState } from "react";
import useTheme from "../../../../hooks/useTheme.js";
import { apiFetch } from "../../../../lib/api.js";
import ForgetPasswordLayout from "./ForgetPasswordLayout.jsx";
import ForgetPasswordSteps from "./ForgetPasswordSteps.jsx";
import ForgetPasswordActions from "./ForgetPasswordActions.jsx";
import ForgetPasswordLinks from "./ForgetPasswordLinks.jsx";

export default function ForgetPasswordForm({ onSuccess }) {
  const { theme } = useTheme();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (step === "email") {
        // Step 1: Send email to get verification code
        await apiFetch("/auth/forget-password", {
          method: "POST",
          body: { email },
        });

        setMessage(
          "Verification code sent (check server console for mock code)"
        );
        setStep("verify");
      } else if (step === "verify") {
        // DEV MODE: skip verification
        setStep("reset");
      } else {
        // Step 3: Reset password
        if (newPassword !== confirmPassword) {
          throw new Error("Passwords do not match");
        }

        await apiFetch("/auth/reset-password", {
          method: "POST",
          body: {
            email,
            code: verificationCode,
            newPassword,
            confirmPassword,
          },
        });

        setMessage("Password reset successfully!");
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgetPasswordLayout theme={theme}>
      <h1 className="text-2xl font-bold">Reset Your Password</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ForgetPasswordSteps
          step={step}
          email={email}
          setEmail={setEmail}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
        />

        {error && <div>{error}</div>}
        {message && <div>{message}</div>}

        <ForgetPasswordActions step={step} loading={loading} theme={theme} />
      </form>

      <ForgetPasswordLinks />
    </ForgetPasswordLayout>
  );
}
