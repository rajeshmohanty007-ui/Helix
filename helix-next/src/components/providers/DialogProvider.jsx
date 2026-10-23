"use client";

import { createContext, useContext, useState, useRef } from "react";
import { createPortal } from "react-dom";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

const DialogContext = createContext();

export function DialogProvider({ children }) {
  const [state, setState] = useState(null); // { title, message, type, confirmText, cancelText, isPrompt, expectedValue, resolve }
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");

  const showAlert = (message, title = "Alert") => {
    return new Promise((resolve) => {
      setState({
        title,
        message,
        type: "alert",
        confirmText: "OK",
        resolve,
      });
    });
  };

  const showConfirm = (message, title = "Confirm", type = "warning", confirmText = "Confirm", cancelText = "Cancel") => {
    return new Promise((resolve) => {
      setState({
        title,
        message,
        type,
        confirmText,
        cancelText,
        resolve,
      });
    });
  };

  const showPrompt = (message, expectedValue, title = "Verification Required") => {
    return new Promise((resolve) => {
      setInputValue("");
      setInputError("");
      setState({
        title,
        message,
        type: "prompt",
        confirmText: "Confirm",
        cancelText: "Cancel",
        isPrompt: true,
        expectedValue,
        resolve,
      });
    });
  };

  const handleClose = (value) => {
    if (!state) return;
    state.resolve(value);
    setState(null);
  };

  const handleConfirm = () => {
    if (state?.isPrompt) {
      if (inputValue !== state.expectedValue) {
        setInputError("Entered value does not match.");
        return;
      }
      handleClose(inputValue);
    } else {
      handleClose(true);
    }
  };

  const getIcon = () => {
    if (!state) return null;
    switch (state.type) {
      case "warning":
        return <WarningRoundedIcon className="text-yellow-500" sx={{ fontSize: 32 }} />;
      case "danger":
        return <ErrorOutlineRoundedIcon className="text-red-500" sx={{ fontSize: 32 }} />;
      case "prompt":
        return <HelpOutlineRoundedIcon className="text-[var(--accent)]" sx={{ fontSize: 32 }} />;
      default:
        return <InfoRoundedIcon className="text-sky-500" sx={{ fontSize: 32 }} />;
    }
  };

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
      {children}

      {state &&
        createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div
              className="absolute inset-0"
              onClick={() => {
                if (state.type !== "prompt") {
                  handleClose(false);
                }
              }}
            />
            <div className="relative w-full max-w-md rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-[var(--text-primary)]">
              
              {/* Header Icon + Title */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--bg-hover)]">
                  {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] truncate">
                    {state.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-secondary)] whitespace-pre-line leading-relaxed">
                    {state.message}
                  </p>
                </div>
              </div>

              {/* Prompt Input Field */}
              {state.isPrompt && (
                <div className="mt-4">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      setInputError("");
                    }}
                    placeholder={`Type "${state.expectedValue}" to confirm`}
                    className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-[var(--accent)] text-[var(--text-primary)]"
                  />
                  {inputError && (
                    <p className="mt-2 text-xs text-red-500">
                      {inputError}
                    </p>
                  )}
                </div>
              )}

              {/* Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                {state.cancelText && (
                  <button
                    onClick={() => handleClose(false)}
                    className="rounded-xl border border-[var(--border-color)] bg-transparent px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)] cursor-pointer"
                  >
                    {state.cancelText}
                  </button>
                )}
                <button
                  onClick={handleConfirm}
                  className={`rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90 cursor-pointer shadow-sm ${
                    state.type === "danger"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-[var(--accent)]"
                  }`}
                >
                  {state.confirmText}
                </button>
              </div>

            </div>
          </div>,
          document.body
        )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  return useContext(DialogContext);
}
