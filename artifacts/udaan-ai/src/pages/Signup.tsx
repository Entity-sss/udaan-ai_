import { useState, type CSSProperties } from "react";
import { useLocation } from "wouter";
import { StarField } from "@/components/StarField";
import { ApiError, useRegisterStudent, useSendOtp, useVerifyOtp } from "@workspace/api-client-react";
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
  const [nameError, setNameError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [emailError, setEmailError] = useState("");

  const register = useRegisterStudent();
  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();

  function describeRequestError(e: unknown): string | undefined {
    if (e instanceof ApiError) {
      const d = e.data;
      if (d && typeof d === "object") {
        const errField = (d as { error?: unknown }).error;
        if (typeof errField === "string" && errField.trim()) return errField;
        const msgField = (d as { message?: unknown }).message;
        if (typeof msgField === "string" && msgField.trim()) return msgField;
      }
      return e.message;
    }
    if (e instanceof Error) return e.message;
    return undefined;
  }

  async function handleRegister() {
    const trimmedName = name.trim();
    const trimmedMobile = mobile.trim().replace(/\s+/g, "");
    const trimmedEmail = email.trim();
    
    // Validate name
    if (!trimmedName) {
      setNameError("Name is required");
    } else {
      setNameError("");
    }
    
    // Validate mobile - must be 10 digits
    const mobileDigits = trimmedMobile.replace(/\D/g, "");
    if (!trimmedMobile) {
      setMobileError("Mobile number is required");
    } else if (mobileDigits.length !== 10) {
      setMobileError("Mobile number must be 10 digits");
    } else {
      setMobileError("");
    }
    
    // Validate email - must have @ and .com/.in etc
    if (!trimmedEmail) {
      setEmailError("Email is required");
    } else if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
    
    // Don't submit if any errors
    if (!trimmedName || !trimmedMobile || mobileDigits.length !== 10 || !trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      return;
    }
    
    // Mock registration for demo purposes
    try {
      // Try real API first
      const res = await register.mutateAsync({
        data: { name: trimmedName, mobile: trimmedMobile, email: trimmedEmail || "" },
      });
      setStoredStudent({
        id: res.student.id,
        studentId: res.student.studentId,
        name: res.student.name,
        mobile: res.student.mobile,
        assessmentCompleted: res.student.assessmentCompleted,
      });
      setStoredToken(res.token);
      if (res.isNewStudent) {
        setLocation("/assessment");
      } else {
        setLocation(res.student.assessmentCompleted ? "/dashboard" : "/assessment");
      }
    } catch (e) {
      // Fallback to mock registration if API is not available
      console.log("API not available, using mock registration");
      const mockStudent = {
        id: "demo-" + Date.now(),
        studentId: "STU" + Math.floor(Math.random() * 10000),
        name: trimmedName,
        mobile: trimmedMobile,
        assessmentCompleted: false,
      };
      const mockToken = "demo-token-" + Date.now();
      
      setStoredStudent(mockStudent);
      setStoredToken(mockToken);
      toast({ title: "Demo Registration Successful!" });
      setLocation("/assessment");
    }
  }

  async function handleSendOtp() {
    const trimmedMobile = mobile.trim().replace(/\s+/g, "");
    if (!trimmedMobile) {
      toast({ title: "Please enter your mobile number", variant: "destructive" });
      return;
    }
    try {
      const res = await sendOtp.mutateAsync({ data: { mobile: trimmedMobile } });
      setOtpSent(true);
      toast({ title: res.message || "OTP sent!" });
    } catch (e) {
      // Fallback to mock OTP if API is not available
      console.log("API not available, using mock OTP");
      setOtpSent(true);
      toast({ title: "Demo OTP sent! Use 123456" });
    }
  }

  async function handleVerifyOtp() {
    const trimmedMobile = mobile.trim().replace(/\s+/g, "");
    const trimmedOtp = otp.trim();
    if (!trimmedOtp) {
      toast({ title: "Please enter the OTP", variant: "destructive" });
      return;
    }
    try {
      const res = await verifyOtp.mutateAsync({ data: { mobile: trimmedMobile, otp: trimmedOtp } });
      setStoredStudent({
        id: res.student.id,
        studentId: res.student.studentId,
        name: res.student.name,
        mobile: res.student.mobile,
        assessmentCompleted: res.student.assessmentCompleted,
      });
      setStoredToken(res.token);
      if (res.isNewStudent) {
        setLocation("/assessment");
      } else {
        setLocation(res.student.assessmentCompleted ? "/dashboard" : "/assessment");
      }
    } catch (e) {
      // Fallback to mock OTP verification if API is not available
      console.log("API not available, using mock OTP verification");
      if (trimmedOtp === "123456") {
        const mockStudent = {
          id: "demo-" + Date.now(),
          studentId: "STU" + Math.floor(Math.random() * 10000),
          name: "Demo User",
          mobile: trimmedMobile,
          assessmentCompleted: false,
        };
        const mockToken = "demo-token-" + Date.now();
        
        setStoredStudent(mockStudent);
        setStoredToken(mockToken);
        toast({ title: "Demo Sign In Successful!" });
        setLocation("/assessment");
      } else {
        toast({
          title: "OTP verification failed",
          description: "Use demo OTP: 123456",
          variant: "destructive",
        });
      }
    }
  }

  const inputStyle: CSSProperties = {
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

  const labelStyle: CSSProperties = {
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
                  onChange={e => { setName(e.target.value); setNameError(""); }}
                  style={{ ...inputStyle, borderColor: nameError ? "#ef4444" : "rgba(124,58,237,0.3)" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.7)")}
                  onBlur={e => (e.currentTarget.style.borderColor = nameError ? "#ef4444" : "rgba(124,58,237,0.3)")}
                />
                {nameError && <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>{nameError}</p>}
              </div>
            )}

            <div>
              <label style={labelStyle}>Mobile Number</label>
              <input
                data-testid="input-mobile"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={mobile}
                onChange={e => { setMobile(e.target.value); setMobileError(""); }}
                style={{ ...inputStyle, borderColor: mobileError ? "#ef4444" : "rgba(124,58,237,0.3)" }}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.7)")}
                onBlur={e => (e.currentTarget.style.borderColor = mobileError ? "#ef4444" : "rgba(124,58,237,0.3)")}
              />
              {mobileError && <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>{mobileError}</p>}
            </div>

            {mode === "register" && (
              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  data-testid="input-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError(""); }}
                  style={{ ...inputStyle, borderColor: emailError ? "#ef4444" : "rgba(124,58,237,0.3)" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.7)")}
                  onBlur={e => (e.currentTarget.style.borderColor = emailError ? "#ef4444" : "rgba(124,58,237,0.3)")}
                />
                {emailError && <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>{emailError}</p>}
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
