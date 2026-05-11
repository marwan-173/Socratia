import { NavLink } from "react-router-dom";

export default function HelperText({ variant }) {
  if (variant === "app" || variant === "signin" || variant === "signup")
    return null;

  const helper =
    variant === "signup"
      ? {
          text: "Already have an account? ",
          linkText: "Sign in",
          to: "/signin",
        }
      : {
          text: "Don’t have an account? ",
          linkText: "Sign up",
          to: "/signup",
        };

  return (
    <>
      {/* Desktop */}
      <div className="hidden text-[var(--text-muted)] sm:block">
        {helper.text}
        <NavLink
          to={helper.to}
          className="font-semibold text-blue-300 hover:text-blue-200"
        >
          {helper.linkText}
        </NavLink>
      </div>

      {/* Mobile */}
      <div
        className="border-t px-4 py-2 text-xs sm:hidden"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-main)",
          color: "var(--text-muted)",
        }}
      >
        {helper.text}
        <NavLink to={helper.to} className="font-semibold text-blue-300">
          {helper.linkText}
        </NavLink>
      </div>
    </>
  );
}
