"use client";

import { useState } from "react";
import { useToast } from "../providers/ToastProvider";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import { CloseRounded } from "@mui/icons-material";

export default function RegisterForm({ onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

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

      showToast("Account created successfully!", "success");
      e.target.reset();
      if (onClose) onClose();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[80%] max-w-4xl z-20 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-lg"
    >
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
            className="rounded-lg p-1 text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)]"
          >
            <CloseRounded fontSize="small" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
            Username
          </label>

          <input
            type="text"
            name="username"
            required
            autoComplete="off"
            placeholder="Enter your username"
            className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-4 py-3 outline-none transition focus:border-[var(--accent)] text-[var(--text-secondary)]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
            Email
          </label>

          <input
            type="email"
            name="email"
            required
            autoComplete="off"
            placeholder="Enter your email address"
            className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-4 py-3 outline-none transition focus:border-[var(--accent)] text-[var(--text-secondary)]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              autoComplete="off"
              minLength={6}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-4 py-3 pr-12 outline-none transition focus:border-[var(--accent)] text-[var(--text-secondary)]"
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
            Creating...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}
