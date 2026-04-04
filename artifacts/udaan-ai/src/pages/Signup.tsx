import { useState } from "react";
import { useLocation } from "wouter";
import { StarField } from "@/components/StarField";
import { useRegisterStudent, useSendOtp, useVerifyOtp } from "@workspace/api-client-react";
import { setStoredStudent, setStoredToken } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import logoPath from "/logo.png";
import { SiGoogle } from "react-icons/si";

type AuthMode = "register" | "otp";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [mode, setMode] = useState<AuthMode>("register");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const register = useRegisterStudent();
  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();

  async function handleRegister() {
    if (!name || !mobile) {
      toast({ title: "Please fill in your name and mobile number", variant: "destructive" });
      return;
    }
    try {
      const res = await register.mutateAsync({ data: { name, mobile, email } });
      setStoredStudent({
        id: res.student.id,
        studentId: res.student.studentId,
        name: res.student.name,
        mobile: res.student.mobile,
        assessmentCompleted: res.student.assessmentCompleted,
      });
      setStoredToken(res.token);
      if (res.student.assessmentCompleted) {
        setLocation("/roadmap");
      } else {
        setLocation("/assessment");
      }
    } catch {
      toast({ title: "Registration failed. Please try again.", variant: "destructive" });
    }
  }

  async function handleSendOtp() {
    if (!mobile) {
      toast({ title: "Please enter your mobile number", variant: "destructive" });
      return;
    }
    try {
      const res = await sendOtp.mutateAsync({ data: { mobile } });
      setOtpSent(true);
      toast({ title: res.message || "OTP sent!" });
    } catch {
      toast({ title: "Failed to send OTP", variant: "destructive" });
    }
  }

  async function handleVerifyOtp() {
    if (!otp) {
      toast({ title: "Please enter the OTP", variant: "destructive" });
      return;
    }
    try {
      const res = await verifyOtp.mutateAsync({ data: { mobile, otp } });
      setStoredStudent({
        id: res.student.id,
        studentId: res.student.studentId,
        name: res.student.name,
        mobile: res.student.mobile,
        assessmentCompleted: res.student.assessmentCompleted,
      });
      setStoredToken(res.token);
      if (res.student.assessmentCompleted) {
        setLocation("/roadmap");
      } else {
        setLocation("/assessment");
      }
    } catch {
      toast({ title: "Invalid OTP. Try again.", variant: "destructive" });
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.875rem 1rem",
    background: "rgba(124,58,237,0.08)",
    border: "1px solid rgba(124,58,237,0.3)",
    borderRadius: "12px",
    color: "white",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "'Space Grotesk', sans-serif",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 500,
    color: "rgba(255,255,255,0.6)",
    marginBottom: "0.4rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #050511 0%, #0d0d2b 40%, #1a0a3d 70%, #050511 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "1rem",
      }}
    >
      <StarField />
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "460px",
        }}
      >
        <div
          style={{
            background: "rgba(13,10,40,0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: "24px",
            padding: "2.5rem",
            boxShadow: "0 0 60px rgba(124,58,237,0.15)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <img
              src={logoPath}
              alt="Udaan AI"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "contain",
                filter: "brightness(0) invert(1) drop-shadow(0 0 8px rgba(245,158,11,0.6))",
                marginBottom: "1rem",
              }}
            />
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #ffffff, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "0.25rem",
              }}
            >
              {mode === "register" ? "Join Udaan AI" : "Sign In with OTP"}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
              {mode === "register" ? "Turn your now into your next" : "Enter your mobile to receive OTP"}
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <button
              onClick={() => setMode("register")}
              style={{
                flex: 1,
                padding: "0.625rem",
                borderRadius: "10px",
                border: mode === "register" ? "1px solid rgba(124,58,237,0.6)" : "1px solid rgba(255,255,255,0.1)",
                background: mode === "register" ? "rgba(124,58,237,0.2)" : "transparent",
                color: mode === "register" ? "#c084fc" : "rgba(255,255,255,0.4)",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 600,
                fontFamily: "'Space Grotesk', sans-serif",
                transition: "all 0.2s",
              }}
            >
              Register
            </button>
            <button
              onClick={() => setMode("otp")}
              style={{
                flex: 1,
                padding: "0.625rem",
                borderRadius: "10px",
                border: mode === "otp" ? "1px solid rgba(124,58,237,0.6)" : "1px solid rgba(255,255,255,0.1)",
                background: mode === "otp" ? "rgba(124,58,237,0.2)" : "transparent",
                color: mode === "otp" ? "#c084fc" : "rgba(255,255,255,0.4)",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 600,
                fontFamily: "'Space Grotesk', sans-serif",
                transition: "all 0.2s",
              }}
            >
              OTP Sign In
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {mode === "register" && (
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  data-testid="input-name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.7)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)")}
                />
              </div>
            )}

            <div>
              <label style={labelStyle}>Mobile Number</label>
              <input
                data-testid="input-mobile"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.7)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)")}
              />
            </div>

            {mode === "register" && (
              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  data-testid="input-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.7)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)")}
                />
              </div>
            )}

            {mode === "otp" && !otpSent && (
              <button
                data-testid="button-send-otp"
                onClick={handleSendOtp}
                disabled={sendOtp.isPending}
                style={{
                  padding: "0.875rem",
                  background: "rgba(124,58,237,0.2)",
                  border: "1px solid rgba(124,58,237,0.4)",
                  borderRadius: "12px",
                  color: "#c084fc",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  fontFamily: "'Space Grotesk', sans-serif",
                  transition: "all 0.2s",
                }}
              >
                {sendOtp.isPending ? "Sending..." : "Send OTP"}
              </button>
            )}

            {mode === "otp" && otpSent && (
              <div>
                <label style={labelStyle}>Enter OTP</label>
                <input
                  data-testid="input-otp"
                  type="text"
                  placeholder="6-digit OTP"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  style={{ ...inputStyle, letterSpacing: "0.3em", textAlign: "center", fontSize: "1.25rem" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.7)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)")}
                />
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "0.4rem" }}>
                  Demo: use 123456 or check the OTP in the message
                </p>
              </div>
            )}

            <button
              data-testid="button-continue"
              onClick={mode === "register" ? handleRegister : otpSent ? handleVerifyOtp : handleSendOtp}
              disabled={register.isPending || verifyOtp.isPending}
              style={{
                padding: "1rem",
                background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                border: "none",
                borderRadius: "12px",
                color: "white",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(124,58,237,0.4)",
                fontFamily: "'Space Grotesk', sans-serif",
                transition: "all 0.2s",
              }}
            >
              {register.isPending || verifyOtp.isPending
                ? "Please wait..."
                : mode === "register"
                  ? "Create Account"
                  : otpSent
                    ? "Verify OTP"
                    : "Continue"}
            </button>

            <div style={{ position: "relative", textAlign: "center" }}>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", margin: "0.5rem 0" }} />
              <span
                style={{
                  position: "absolute",
                  top: "-0.6rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(13,10,40,0.9)",
                  padding: "0 0.75rem",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.8rem",
                }}
              >
                or
              </span>
            </div>

            <button
              data-testid="button-google"
              style={{
                padding: "0.875rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "12px",
                color: "rgba(255,255,255,0.8)",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                fontFamily: "'Space Grotesk', sans-serif",
                transition: "all 0.2s",
              }}
            >
              <SiGoogle size={18} color="#ea4335" />
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
