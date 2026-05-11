export default function ForgetPasswordActions({ step, loading, theme }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: "100%",
        backgroundColor:
          theme === "dark" ? "rgb(59, 130, 246)" : "rgb(37, 99, 235)",
        borderRadius: "0.75rem",
        border: "none",
        color: "white",
        padding: "0.75rem 1rem",
        fontWeight: "600",
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading
        ? "Processing..."
        : step === "email"
          ? "Send Code"
          : step === "verify"
            ? "Verify Code"
            : "Reset Password"}
    </button>
  );
}
