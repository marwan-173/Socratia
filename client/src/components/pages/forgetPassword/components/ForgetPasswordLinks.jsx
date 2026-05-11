import { NavLink } from "react-router-dom";

export default function ForgetPasswordLinks() {
  return (
    <div className="mt-6 flex items-center justify-between text-sm">
      <NavLink to="/signin" className="hover:opacity-80">
        ← Back to Sign In
      </NavLink>

      <NavLink
        to="/signup"
        className="rounded-xl border px-4 py-2 font-semibold hover:opacity-80"
      >
        Create Account
      </NavLink>
    </div>
  );
}
