"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "../providers/ToastProvider"

import CloseIcon from "@mui/icons-material/Close"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import { PersonOutlineRounded } from "@mui/icons-material"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import CircularProgress from "@mui/material/CircularProgress"

export default function LoginForm({ onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    try {
      const result = await signIn("credentials", {
        ...payload,
        redirect: false,
      });

      if (result?.error) {
        showToast("Invalid username or password", "error");
        return;
      }

      showToast("Welcome back!", "success");
      if (onClose) onClose();
      router.push("/dashboard");
    } catch (err) {
      showToast("An error occurred during sign in", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="w-[80%] max-w-4xl rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-lg" onSubmit={handleSubmit}>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Welcome Back
          </h2>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Sign in to continue to Helix.
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)]"
          >
            <CloseIcon fontSize="small" />
          </button>
        )}
      </div>

      <div className="space-y-4">
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
              placeholder="Enter your username"
              className="w-full rounded-xl border border-[var(--border-color)] bg-transparent py-3 pl-10 pr-4 outline-none transition focus:border-[var(--accent)] text-[var(--text-secondary)]"
            />
          </div>
        </div>

        {/* Password */}

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
            Password
          </label>

          <div className="relative">
            <LockOutlinedIcon
              sx={{ fontSize: 20 }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="Enter your password"
              className="w-full rounded-xl border border-[var(--border-color)] bg-transparent py-3 pl-10 pr-12 outline-none transition focus:border-[var(--accent)] text-[var(--text-secondary)]"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            >
              {showPassword ? (
                <VisibilityOffIcon fontSize="small" />
              ) : (
                <VisibilityIcon fontSize="small" />
              )}
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? (
          <>
            <CircularProgress size={18} color="inherit" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  )
}