import { useParams } from "wouter";
import { StarField } from "@/components/StarField";
import logoPath from "/logo.png";

function generateCertificateId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "UDN-CERT-";
  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  id += "-";
  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export default function Certificate() {
  const params = useParams<{ skillId: string }>();
  const skillId = params.skillId || "Python";
  const certificateId = generateCertificateId();
  const completionDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  function downloadPDF() {
    // Use window.print() for PDF generation
    window.print();
  }

  function shareLinkedIn() {
    const shareText = `I just completed the ${skillId} course on Udaan AI! 🎉 Check it out: https://udaan-ai.com`;
    const shareUrl = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      "_blank"
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0b1e", position: "relative", padding: "2rem" }}>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #certificate-container, #certificate-container * { visibility: visible !important; }
          #certificate-container { 
            position: fixed !important; 
            top: 0 !important; 
            left: 0 !important; 
            width: 100vw !important; 
            height: 100vh !important; 
            background: #0d0b1e !important; 
            padding: 2rem !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>
      <StarField />
      <div style={{ position: "relative", zIndex: 10, maxWidth: "900px", margin: "0 auto" }}>
        <div className="no-print" style={{ textAlign: "center", marginBottom: "2rem" }}>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid rgba(76,53,200,0.3)",
              borderRadius: "12px",
              background: "transparent",
              color: "#a78bfa",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "white", marginBottom: "0.5rem" }}>
            Your Certificate
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>
            Congratulations on completing the course!
          </p>
        </div>

        <div
          id="certificate-container"
          style={{
            background: "#0d0b1e",
            border: "4px solid #f59e0b",
            borderRadius: "20px",
            padding: "3rem",
            position: "relative",
            boxShadow: "0 20px 60px rgba(245,158,11,0.2)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              right: "20px",
              bottom: "20px",
              border: "2px solid rgba(245,158,11,0.3)",
              borderRadius: "12px",
              pointerEvents: "none",
            }}
          />

          <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <img
              src={logoPath}
              alt="Udaan AI"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "contain",
                filter: "brightness(0) invert(1) drop-shadow(0 0 10px rgba(245,158,11,0.5))",
                marginBottom: "2rem",
              }}
            />

            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: 800,
                color: "#f59e0b",
                marginBottom: "1rem",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              Certificate of Completion
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "1.2rem",
                marginBottom: "1.5rem",
                fontStyle: "italic",
              }}
            >
              This certifies that
            </p>

            <h3
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "#f59e0b",
                marginBottom: "0.5rem",
                textShadow: "0 2px 10px rgba(245,158,11,0.3)",
              }}
            >
              Student Name
            </h3>

            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "1.2rem",
                marginBottom: "1.5rem",
                fontStyle: "italic",
              }}
            >
              has successfully completed
            </p>

            <div
              style={{
                display: "inline-block",
                padding: "1rem 2rem",
                background: "rgba(147,51,234,0.2)",
                border: "2px solid #9333ea",
                borderRadius: "12px",
                marginBottom: "2rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#a78bfa",
                  textTransform: "uppercase",
                }}
              >
                {skillId}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3rem" }}>
              <div style={{ textAlign: "left" }}>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
                  Date
                </p>
                <p style={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>{completionDate}</p>
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 0.5rem",
                    boxShadow: "0 4px 15px rgba(245,158,11,0.3)",
                  }}
                >
                  <span style={{ fontSize: "2rem" }}>🏆</span>
                </div>
                <p style={{ color: "#f59e0b", fontWeight: 700, fontSize: "0.85rem" }}>
                  Udaan AI
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
                  Certificate ID
                </p>
                <p style={{ color: "white", fontWeight: 700, fontSize: "0.9rem" }}>{certificateId}</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem" }}>
          <button
            onClick={downloadPDF}
            style={{
              padding: "1rem 2rem",
              border: "1px solid #f59e0b",
              borderRadius: "12px",
              background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.2))",
              color: "#f59e0b",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "1rem",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(245,158,11,0.3), rgba(217,119,6,0.3))";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.2))";
            }}
          >
            📄 Download as PDF
          </button>

          <button
            onClick={shareLinkedIn}
            style={{
              padding: "1rem 2rem",
              border: "1px solid #0077b5",
              borderRadius: "12px",
              background: "linear-gradient(135deg, rgba(0,119,181,0.2), rgba(0,119,181,0.2))",
              color: "#0077b5",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "1rem",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(0,119,181,0.3), rgba(0,119,181,0.3))";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(0,119,181,0.2), rgba(0,119,181,0.2))";
            }}
          >
            💼 Share on LinkedIn
          </button>
        </div>
      </div>
    </div>
  );
}
