"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useToast } from "../providers/ToastProvider";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import { CloseRounded, PersonOutlineRounded, EmailOutlined, LockOutlined } from "@mui/icons-material";
import GoogleIcon from "../ui/GoogleIcon";

export default function RegisterForm({ onClose, onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { showToast } = useToast();

  async function handleGoogleSignUp() {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      showToast("Failed to initiate Google sign up", "error");
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      showToast("Account created successfully! Signing in...", "success");
      
      // Auto sign in with the new credentials
      const signInResult = await signIn("credentials", {
        username: payload.username,
        password: payload.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        if (onClose) onClose();
        window.location.href = "/dashboard";
      } else {
        showToast("Account created. Please log in with your credentials.", "success");
        if (onSwitchToLogin) onSwitchToLogin();
        else if (onClose) onClose();
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-[85%] max-w-md z-20 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Create Account
          </h2>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Join Helix and start organizing your work.
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
          >
            <CloseRounded fontSize="small" />
          </button>
        )}
      </div>

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={googleLoading || loading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--border-color)] bg-white/5 py-3 px-4 text-sm font-semibold text-[var(--text-primary)] transition duration-200 hover:bg-white/10 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
      >
        {googleLoading ? (
          <>
            <CircularProgress size={18} color="inherit" />
            <span>Connecting to Google...</span>
          </>
        ) : (
          <>
            <GoogleIcon className="h-5 w-5" />
            <span>Sign up with Google</span>
          </>
        )}
      </button>

      {/* Divider */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="w-full border-t border-[var(--border-color)]"></div>
        <span className="absolute bg-[var(--bg-card)] px-3 text-xs uppercase tracking-wider text-[var(--text-secondary)]">
          or register with email
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
            Username
          </label>

          <div className="relative">
            <PersonOutlineRounded
              sx={{ fontSize: 20 }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            />
            <input
              type="text"
              name="username"
              required
              autoComplete="off"
              placeholder="Pick a username"
              className="w-full rounded-xl border border-[var(--border-color)] bg-transparent py-3 pl-10 pr-4 outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
            Email
          </label>

          <div className="relative">
            <EmailOutlined
              sx={{ fontSize: 20 }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            />
            <input
              type="email"
              name="email"
              required
              autoComplete="off"
              placeholder="Enter your email"
              className="w-full rounded-xl border border-[var(--border-color)] bg-transparent py-3 pl-10 pr-4 outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
            Password
          </label>

          <div className="relative">
            <LockOutlined
              sx={{ fontSize: 20 }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              autoComplete="off"
              minLength={6}
              placeholder="At least 6 characters"
              className="w-full rounded-xl border border-[var(--border-color)] bg-transparent py-3 pl-10 pr-12 outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
            >
              {showPassword ? (
                <VisibilityOffIcon fontSize="small" />
              ) : (
                <VisibilityIcon fontSize="small" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-lg shadow-violet-600/20 active:scale-[0.99]"
        >
          {loading ? (
            <>
              <CircularProgress size={18} color="inherit" />
              <span>Creating Account...</span>
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {onSwitchToLogin && (
        <p className="mt-5 text-center text-xs text-[var(--text-secondary)]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-violet-400 hover:text-violet-300 transition underline underline-offset-2 cursor-pointer"
          >
            Sign In
          </button>
        </p>
      )}
    </div>
  );
}

