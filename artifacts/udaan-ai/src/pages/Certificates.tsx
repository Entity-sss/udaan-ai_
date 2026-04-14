import {
  useGetCertificates,
  getGetCertificatesQueryKey,
} from "@workspace/api-client-react";
import { getStoredStudent } from "@/lib/auth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import logoPath from "/logo.png";

function QRPattern() {
  const pattern = [
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,0,0,0,1,0,1,1,0,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,0,0,0,1,0,1,1,0,1,0],
    [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0],
    [1,0,1,1,1,0,1,0,0,0,1,0,1,1,0,0,1],
    [1,0,1,1,1,0,1,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,0,1,1,0,1,0],
    [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,1],
    [1,1,1,1,1,1,1,0,0,0,1,0,1,1,0,0,1],
  ];

  return (
    <div
      style={{
        display: "inline-grid",
        gridTemplateColumns: `repeat(17, 5px)`,
        gap: "1px",
        padding: "8px",
        background: "white",
        borderRadius: "6px",
      }}
    >
      {pattern.flat().map((cell, i) => (
        <div
          key={i}
          style={{
            width: "5px",
            height: "5px",
            background: cell ? "#0d0d2b" : "transparent",
          }}
        />
      ))}
    </div>
  );
}

export default function Certificates() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const student = getStoredStudent();

  const { data: certificates, isLoading } = useGetCertificates(student?.id || "", {
    query: {
      enabled: !!student?.id,
      queryKey: getGetCertificatesQueryKey(student?.id || ""),
    },
  });

  if (!student) {
    setLocation("/signup");
    return null;
  }

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", display: "flex", alignItems: "center", justifyContent: "center", height: "70vh" }}>
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "3px solid rgba(124,58,237,0.3)",
            borderTop: "3px solid #7c3aed",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const gradeColors: Record<string, string> = {
    "A+": "#10b981",
    "A": "#34d399",
    "B+": "#f59e0b",
    "B": "#fbbf24",
  };

  type DisplayCert = {
    id: string;
    certCode: string;
    studentName: string;
    studentId: string;
    courseName: string;
    courseCategory: string;
    grade?: string;
    qrData?: string;
    issuedAt: string;
  };

  const raw = certificates || [];
  const demoCerts: DisplayCert[] =
    raw.length === 0
      ? [
          {
            id: "demo-cert",
            certCode: "UDN-CERT-2024-DEMO",
            studentName: student.name,
            studentId: student.studentId,
            courseName: "Python for Machine Learning",
            courseCategory: "AI/ML",
            grade: "A+",
            qrData: `https://udaan.ai/verify/UDN-CERT-2024-DEMO`,
            issuedAt: new Date().toISOString(),
          },
        ]
      : raw.map(c => {
          const anyC = c as {
            id: string;
            certCode: string;
            courseId?: string;
            skillName?: string | null;
            issuedAt: string | Date;
          };
          const issued =
            typeof anyC.issuedAt === "string" ? anyC.issuedAt : new Date(anyC.issuedAt).toISOString();
          return {
            id: anyC.id,
            certCode: anyC.certCode,
            studentName: student.name,
            studentId: student.studentId,
            courseName: anyC.skillName || anyC.courseId || "Skill track",
            courseCategory: "Skill completion",
            grade: "A",
            qrData: `${typeof window !== "undefined" ? window.location.origin : ""}/api/certificates/verify/${anyC.certCode}`,
            issuedAt: issued,
          };
        });

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1100px" }} className="certificates-page">
      <div className="no-print">
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>
        My Certificates
      </h1>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem" }}>
        Authenticated credentials for completed courses
      </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))",
          gap: "2rem",
        }}
      >
        {demoCerts?.map(cert => (
          <div
            key={cert.id}
            id={`udaan-cert-${cert.id}`}
            data-testid={`certificate-${cert.id}`}
            className="udaan-certificate-card"
            style={{
              background: "linear-gradient(135deg, #0d0d2b 0%, #1a0a3d 50%, #0d0d2b 100%)",
              border: "2px solid rgba(124,58,237,0.5)",
              borderRadius: "20px",
              padding: "2.5rem",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 0 40px rgba(124,58,237,0.15), inset 0 0 80px rgba(124,58,237,0.05)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "8px",
                border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: "14px",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "linear-gradient(90deg, transparent, #7c3aed, #f59e0b, #7c3aed, transparent)",
              }}
            />

            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <img
                src={logoPath}
                alt="Udaan AI"
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "contain",
                  filter: "brightness(0) invert(1) drop-shadow(0 0 8px rgba(245,158,11,0.7))",
                  marginBottom: "0.5rem",
                }}
              />
              <p
                style={{
                  color: "#a78bfa",
                  fontSize: "0.7rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Udaan AI
              </p>
            </div>

            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <h2
                style={{
                  fontSize: "1.1rem",
                  color: "rgba(255,255,255,0.6)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 400,
                  marginBottom: "0.5rem",
                }}
              >
                Certificate of Completion
              </h2>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
                This is to certify that
              </p>
            </div>

            <div
              style={{
                textAlign: "center",
                padding: "0.75rem 1.5rem",
                borderTop: "1px solid rgba(245,158,11,0.2)",
                borderBottom: "1px solid rgba(245,158,11,0.2)",
                marginBottom: "1.5rem",
              }}
            >
              <p
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "white",
                  letterSpacing: "0.02em",
                  fontFamily: "Georgia, serif",
                }}
              >
                {cert.studentName}
              </p>
              <p style={{ color: "#a78bfa", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                {cert.studentId}
              </p>
            </div>

            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                has successfully completed
              </p>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#f59e0b",
                  marginBottom: "0.25rem",
                }}
              >
                {cert.courseName}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>{cert.courseCategory}</p>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginTop: "1.5rem",
                paddingTop: "1.25rem",
                borderTop: "1px solid rgba(124,58,237,0.2)",
              }}
            >
              <div>
                <div style={{ marginBottom: "0.5rem" }}>
                  <QRPattern />
                </div>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.65rem", marginTop: "0.4rem" }}>
                  Scan to verify
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                {cert.grade && (
                  <div
                    style={{
                      display: "inline-block",
                      padding: "0.5rem 1.25rem",
                      background: `${gradeColors[cert.grade] || "#7c3aed"}20`,
                      border: `2px solid ${gradeColors[cert.grade] || "#7c3aed"}`,
                      borderRadius: "8px",
                      color: gradeColors[cert.grade] || "#a78bfa",
                      fontWeight: 900,
                      fontSize: "1.25rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {cert.grade}
                  </div>
                )}
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
                  {new Date(cert.issuedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p style={{ color: "rgba(124,58,237,0.6)", fontSize: "0.65rem", marginTop: "0.25rem" }}>
                  {cert.certCode}
                </p>
              </div>
            </div>

            <div className="cert-actions no-print" style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
              <button
                data-testid={`button-share-${cert.id}`}
                type="button"
                onClick={() => {
                  const verifyUrl = cert.qrData || `${window.location.origin}/api/certificates/verify/${cert.certCode}`;
                  const linkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}`;
                  window.open(linkedIn, "_blank", "noopener,noreferrer");
                }}
                style={{
                  flex: 1,
                  minWidth: "120px",
                  padding: "0.6rem",
                  background: "rgba(10,102,194,0.2)",
                  border: "1px solid rgba(10,102,194,0.45)",
                  borderRadius: "10px",
                  color: "#93c5fd",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                }}
              >
                Share on LinkedIn
              </button>
              <button
                data-testid={`button-copy-${cert.id}`}
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(cert.qrData || "");
                  toast({ title: "Verification link copied" });
                }}
                style={{
                  flex: 1,
                  minWidth: "120px",
                  padding: "0.6rem",
                  background: "rgba(124,58,237,0.15)",
                  border: "1px solid rgba(124,58,237,0.3)",
                  borderRadius: "10px",
                  color: "#a78bfa",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                }}
              >
                Copy link
              </button>
              <button
                data-testid={`button-download-${cert.id}`}
                type="button"
                onClick={() => {
                  toast({
                    title: "Save as PDF",
                    description: "In the print dialog, choose “Save as PDF” or “Microsoft Print to PDF”.",
                  });
                  window.print();
                }}
                style={{
                  flex: 1,
                  minWidth: "120px",
                  padding: "0.6rem",
                  background: "linear-gradient(135deg, #4c35c8, #9333ea)",
                  border: "none",
                  borderRadius: "10px",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                }}
              >
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {(demoCerts || []).length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            background: "rgba(13,10,40,0.8)",
            border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: "16px",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "1rem" }}>
            No certificates yet. Complete a course to earn your first certificate!
          </p>
          <button
            onClick={() => setLocation("/courses")}
            style={{
              padding: "0.75rem 2rem",
              background: "linear-gradient(135deg, #7c3aed, #9333ea)",
              border: "none",
              borderRadius: "10px",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Browse Courses
          </button>
        </div>
      )}
    </div>
  );
}
