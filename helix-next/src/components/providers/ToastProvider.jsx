"use client"

import { createContext, useContext, useState } from "react"
import Toast from "../ui/Toast"

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = (
    message,
    type = "info",
    duration = 3500
  ) => {
    setToast({
      message,
      type,
      duration,
    })
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <Toast
          {...toast}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}