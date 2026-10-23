"use client"

import { createPortal } from "react-dom"
import { useEffect, useState } from "react"
import {
  CheckCircle,
  Error,
  Info,
  Warning,
} from "@mui/icons-material"

const icons = {
  success: <CheckCircle fontSize="small" />,
  error: <Error fontSize="small" />,
  warning: <Warning fontSize="small" />,
  info: <Info fontSize="small" />,
}

const styles = {
  success: "border-emerald-500/40",
  error: "border-red-500/40",
  warning: "border-yellow-500/40",
  info: "border-sky-500/40",
}

export default function Toast({
  message,
  type = "info",
  duration = 3500,
  onClose,
}) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)

    requestAnimationFrame(() => {
      setVisible(true)
    })

    const hideTimer = setTimeout(() => {
      setVisible(false)

      setTimeout(() => {
        onClose?.()
      }, 300)
    }, duration)

    return () => clearTimeout(hideTimer)
  }, [duration, onClose])

  if (!mounted) return null

  return createPortal(
    <div className="fixed top-6 right-6 z-[9999] pointer-events-none">
      <div
        className={`
          flex items-center gap-3
          min-w-[280px]
          max-w-[380px]
          rounded-2xl
          border
          bg-(--bg-card)
          backdrop-blur-xl
          px-4 py-3
          shadow-[0_10px_35px_rgba(0,0,0,0.45)]
          text-sm text-(--text-secondary)
          transition-all duration-300 ease-out
          ${
            visible
              ? "translate-x-0 opacity-100"
              : "translate-x-8 opacity-0"
          }
          ${styles[type]}
        `}
      >
        <span className="opacity-90">
          {icons[type]}
        </span>

        <span className="flex-1">
          {message}
        </span>
      </div>
    </div>,
    document.body
  )
}