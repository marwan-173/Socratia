export default function ForgetPasswordSteps({
  step,
  email,
  setEmail,
  verificationCode,
  setVerificationCode,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
}) {
  const inputStyle = {
    backgroundColor: "var(--bg-main)",
    borderColor: "var(--border-main)",
    color: "var(--text-main)",
  };

  return (
    <>
      {step === "email" && (
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="name@example.com"
            style={inputStyle}
            className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none"
          />
        </div>
      )}

      {step === "verify" && (
        <div>
          <label className="text-sm font-medium">Verification Code</label>
          <input
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            type="text"
            required
            placeholder="000000"
            style={inputStyle}
            className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none"
          />
        </div>
      )}

      {step === "reset" && (
        <>
          <div>
            <label className="text-sm font-medium">New Password</label>
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              required
              placeholder="••••••••"
              style={inputStyle}
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              required
              placeholder="••••••••"
              style={inputStyle}
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none"
            />
          </div>
        </>
      )}
    </>
  );
}
