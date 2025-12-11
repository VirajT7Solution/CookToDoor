// src/components/ForgotPasswordForm.jsx
import React, { useState } from "react";
import { forgotPasswordApi, resendOtpApi, resetPasswordApi } from "../api/authApi";

export default function ForgotPasswordForm({ onBack }) {
  const [step, setStep] = useState("email"); // email | otp | reset
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    
    if (!usernameOrEmail.trim()) {
      setError("Username or email is required");
      return;
    }

    // Determine if input is email or username
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail.trim());
    let userUsername = null;
    let userEmail = null;

    if (isEmail) {
      userEmail = usernameOrEmail.trim();
    } else {
      userUsername = usernameOrEmail.trim();
    }

    // Store for later use
    setUsername(userUsername);
    setEmail(userEmail);

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await forgotPasswordApi(userUsername, userEmail);
      setMessage(res.data.message || "OTP has been sent to your email");
      setStep("otp");
      startResendCooldown();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    setError("");
    try {
      const res = await resendOtpApi(username, email);
      setMessage(res.data.message || "OTP has been resent to your email");
      startResendCooldown();
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }
    setError("");
    setStep("reset");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await resetPasswordApi(username, email, otp, newPassword, confirmPassword);
      setMessage(res.data.message || "Password has been reset successfully");
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-slate-900">
        Reset Password
      </h2>

      {step === "email" && (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600">Username or Email</label>
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Enter your username or email address"
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}
          {message && <p className="text-xs text-green-600">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full py-2 text-slate-600 hover:text-slate-800 text-sm"
          >
            Back to Login
          </button>
        </form>
      )}

      {step === "otp" && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600">
              Enter OTP (sent to {email || username || "your email"})
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="mt-1 w-full px-3 py-2 border rounded-lg text-sm text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="000000"
            />
            <p className="text-xs text-slate-500 mt-1">
              Check your email for the 6-digit OTP code
            </p>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}
          {message && <p className="text-xs text-green-600">{message}</p>}

          <button
            onClick={handleVerifyOtp}
            disabled={otp.length !== 6}
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            Verify OTP
          </button>

          <div className="text-center">
            <button
              onClick={handleResendOtp}
              disabled={loading || resendCooldown > 0}
              className="text-sm text-sky-600 hover:text-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0
                ? `Resend OTP in ${resendCooldown}s`
                : "Resend OTP"}
            </button>
          </div>

          <button
            onClick={onBack}
            className="w-full py-2 text-slate-600 hover:text-slate-800 text-sm"
          >
            Back to Login
          </button>
        </div>
      )}

      {step === "reset" && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Enter new password (min 8 characters)"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Confirm new password"
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}
          {message && <p className="text-xs text-green-600">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <button
            type="button"
            onClick={() => setStep("otp")}
            className="w-full py-2 text-slate-600 hover:text-slate-800 text-sm"
          >
            Back to OTP
          </button>
        </form>
      )}
    </div>
  );
}

