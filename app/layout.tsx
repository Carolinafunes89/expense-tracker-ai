import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ExpenseProvider } from "@/context/ExpenseProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { AppShell } from "@/components/AppShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "A modern personal expense tracking app.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <ToastProvider>
          <ExpenseProvider>
            <AppShell>{children}</AppShell>
          </ExpenseProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
