import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { DialogProvider } from "@/components/providers/DialogProvider";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
    >
      <body>
        <ThemeProvider>
          <ToastProvider>
            <DialogProvider>
              {children}
            </DialogProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}