import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { getStoredStudent } from "@/lib/auth";

interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  grade: string;
}
interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  points: string;
}
interface Project {
  id: string;
  title: string;
  tech: string;
  desc: string;
  link: string;
}
interface ResumeData {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: string[];
  achievements: string;
}

const PLATFORM_SKILLS: Record<string, string[]> = {
  Python: ["Python", "NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
  JavaScript: ["JavaScript", "TypeScript", "Node.js", "React.js", "Express.js"],
  "Data Structures": ["Data Structures & Algorithms", "Problem Solving", "Competitive Programming"],
  "ML/AI": ["Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP"],
  "Web Dev": ["HTML5", "CSS3", "React.js", "REST APIs", "Git & GitHub"],
  "Full Stack": ["React.js", "Node.js", "PostgreSQL", "Docker", "TypeScript"],
};

const PLATFORM_CERTS = [
  "Python for Data Science – Udaan AI",
  "JavaScript Full Stack Mastery – Udaan AI",
  "Machine Learning Fundamentals – Udaan AI",
  "Data Structures & Algorithms – Udaan AI",
  "Web Development Bootcamp – Udaan AI",
];

function uid() { return Math.random().toString(36).slice(2, 9); }

const STORAGE_KEY = "udaan_resume";

function loadResume(student: ReturnType<typeof getStoredStudent>): ResumeData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    name: student?.name || "",
    role: "Software Engineer",
    email: "",
    phone: "",
    location: "India",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: `Motivated and detail-oriented ${student?.name || "student"} passionate about building impactful tech solutions. Continuously upskilling through structured learning on the Udaan AI platform, targeting a career in software development.`,
    skills: ["JavaScript", "Python", "React.js", "Node.js", "Git & GitHub", "REST APIs"],
    education: [
      { id: uid(), degree: "B.Tech in Computer Science", institution: "Your University", year: "2022 – 2026", grade: "8.5 CGPA" },
    ],
    experience: [],
    projects: [
      { id: uid(), title: "Personal Portfolio Website", tech: "React, CSS, GitHub Pages", desc: "Built a responsive personal portfolio showcasing projects and skills.", link: "" },
    ],
    certifications: ["Python for Data Science – Udaan AI", "Web Development Bootcamp – Udaan AI"],
    achievements: "• Completed Udaan AI's AI Skill Assessment with top 15% score\n• Maintained a 21-day learning streak on Udaan AI platform",
  };
}

function saveResume(data: ResumeData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.875rem",
  background: "rgba(124,58,237,0.06)",
  border: "1px solid rgba(124,58,237,0.2)",
  borderRadius: "8px",
  color: "white",
  fontSize: "0.875rem",
  fontFamily: "'Space Grotesk', sans-serif",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "rgba(255,255,255,0.5)",
  fontSize: "0.7rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: "0.3rem",
};

const sectionHeadStyle: React.CSSProperties = {
  color: "white",
  fontWeight: 800,
  fontSize: "0.95rem",
  marginBottom: "1rem",
  paddingBottom: "0.5rem",
  borderBottom: "1px solid rgba(124,58,237,0.2)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const cardStyle: React.CSSProperties = {
  background: "rgba(13,10,40,0.85)",
  border: "1px solid rgba(124,58,237,0.2)",
  borderRadius: "16px",
  padding: "1.25rem",
  marginBottom: "1rem",
};

const btnSmall: React.CSSProperties = {
  padding: "0.3rem 0.7rem",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontSize: "0.75rem",
  fontWeight: 700,
  fontFamily: "'Space Grotesk', sans-serif",
};

const SECTIONS = ["Personal", "Skills", "Education", "Experience", "Projects", "Certifications", "Achievements"];

export default function ResumeBuilder() {
  const [, setLocation] = useLocation();
  const student = getStoredStudent();
  const [data, setData] = useState<ResumeData>(() => loadResume(student));
  const [activeSection, setActiveSection] = useState("Personal");
  const [newSkill, setNewSkill] = useState("");
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveResume(data);
  }, [data]);

  function set<K extends keyof ResumeData>(key: K, val: ResumeData[K]) {
    setData(prev => ({ ...prev, [key]: val }));
  }

  function addSkillsFromCourse(category: string) {
    const toAdd = PLATFORM_SKILLS[category] || [];
    setData(prev => ({ ...prev, skills: Array.from(new Set([...prev.skills, ...toAdd])) }));
  }

  function removeSkill(s: string) {
    setData(prev => ({ ...prev, skills: prev.skills.filter(x => x !== s) }));
  }

  function addSkill() {
    if (!newSkill.trim()) return;
    setData(prev => ({ ...prev, skills: Array.from(new Set([...prev.skills, newSkill.trim()])) }));
    setNewSkill("");
  }

  function addEducation() {
    setData(prev => ({ ...prev, education: [...prev.education, { id: uid(), degree: "", institution: "", year: "", grade: "" }] }));
  }
  function updateEducation(id: string, field: keyof Education, val: string) {
    setData(prev => ({ ...prev, education: prev.education.map(e => e.id === id ? { ...e, [field]: val } : e) }));
  }
  function removeEducation(id: string) {
    setData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  }

  function addExperience() {
    setData(prev => ({ ...prev, experience: [...prev.experience, { id: uid(), role: "", company: "", duration: "", points: "" }] }));
  }
  function updateExperience(id: string, field: keyof Experience, val: string) {
    setData(prev => ({ ...prev, experience: prev.experience.map(e => e.id === id ? { ...e, [field]: val } : e) }));
  }
  function removeExperience(id: string) {
    setData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  }

  function addProject() {
    setData(prev => ({ ...prev, projects: [...prev.projects, { id: uid(), title: "", tech: "", desc: "", link: "" }] }));
  }
  function updateProject(id: string, field: keyof Project, val: string) {
    setData(prev => ({ ...prev, projects: prev.projects.map(p => p.id === id ? { ...p, [field]: val } : p) }));
  }
  function removeProject(id: string) {
    setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  }

  function toggleCert(cert: string) {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert],
    }));
  }

  function handleSave() {
    saveResume(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handlePrint() {
    window.print();
  }

  function autoFillFromPlatform() {
    const allSkills = Object.values(PLATFORM_SKILLS).flat();
    setData(prev => ({
      ...prev,
      name: student?.name || prev.name,
      skills: Array.from(new Set([...prev.skills, ...allSkills.slice(0, 8)])),
      certifications: Array.from(new Set([...prev.certifications, ...PLATFORM_CERTS.slice(0, 3)])),
      summary: `Passionate ${prev.role || "Software Engineer"} and continuous learner with hands-on experience in modern tech stacks. Completed multiple certified courses on the Udaan AI platform covering Python, JavaScript, Machine Learning, and Web Development. Eager to contribute to dynamic engineering teams and solve real-world problems.`,
    }));
  }

  async function enhanceText(type: "summary" | "experience" | "projects", text: string, updater: (newText: string) => void, id?: string) {
    if (!text.trim()) return;
    const loadingKey = id ? `${type}-${id}` : type;
    setIsEnhancing(loadingKey);
    try {
      const res = await fetch("/api/resume/enhance", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, text }),
      });
      if (res.ok) {
        const { enhancedText } = await res.json();
        updater(enhancedText);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(null);
    }
  }

  const editorPanel = (
    <div style={{ flex: "0 0 340px", minWidth: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {SECTIONS.map(s => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            style={{
              ...btnSmall,
              background: activeSection === s ? "rgba(124,58,237,0.35)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${activeSection === s ? "rgba(124,58,237,0.7)" : "rgba(255,255,255,0.1)"}`,
              color: activeSection === s ? "#c084fc" : "rgba(255,255,255,0.55)",
              padding: "0.35rem 0.75rem",
            }}
          >{s}</button>
        ))}
      </div>

      <div style={cardStyle}>
        {activeSection === "Personal" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={sectionHeadStyle}>Personal Info</div>
            {[
              { label: "Full Name", key: "name" as const, placeholder: "Rahul Sharma" },
              { label: "Target Role", key: "role" as const, placeholder: "Frontend Developer" },
              { label: "Email", key: "email" as const, placeholder: "rahul@email.com" },
              { label: "Phone", key: "phone" as const, placeholder: "+91 98765 43210" },
              { label: "Location", key: "location" as const, placeholder: "Bangalore, India" },
              { label: "LinkedIn URL", key: "linkedin" as const, placeholder: "linkedin.com/in/rahul" },
              { label: "GitHub URL", key: "github" as const, placeholder: "github.com/rahul" },
              { label: "Portfolio URL", key: "portfolio" as const, placeholder: "rahul.dev" },
            ].map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input
                  style={inputStyle}
                  value={(data[f.key] as string) || ""}
                  placeholder={f.placeholder}
                  onChange={e => set(f.key, e.target.value)}
                  onFocus={e => (e.target.style.borderColor = "rgba(124,58,237,0.6)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(124,58,237,0.2)")}
                />
              </div>
            ))}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <label style={labelStyle}>Professional Summary</label>
                <button
                  onClick={() => enhanceText("summary", data.summary, t => set("summary", t))}
                  disabled={isEnhancing === "summary"}
                  style={{ ...btnSmall, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#c084fc", margin: "0 0 0.3rem" }}
                >
                  {isEnhancing === "summary" ? "Enhancing..." : "✨ AI Enhance"}
                </button>
              </div>
              <textarea
                rows={4}
                value={data.summary}
                onChange={e => set("summary", e.target.value)}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={e => (e.target.style.borderColor = "rgba(124,58,237,0.6)")}
                onBlur={e => (e.target.style.borderColor = "rgba(124,58,237,0.2)")}
              />
            </div>
          </div>
        )}

        {activeSection === "Skills" && (
          <div>
            <div style={sectionHeadStyle}>Skills</div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", marginBottom: "0.875rem" }}>
              Auto-add from your Udaan AI courses:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
              {Object.keys(PLATFORM_SKILLS).map(cat => (
                <button
                  key={cat}
                  onClick={() => addSkillsFromCourse(cat)}
                  style={{ ...btnSmall, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.35)", color: "#a78bfa" }}
                >+ {cat}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={newSkill}
                placeholder="Add custom skill..."
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addSkill()}
                onFocus={e => (e.target.style.borderColor = "rgba(124,58,237,0.6)")}
                onBlur={e => (e.target.style.borderColor = "rgba(124,58,237,0.2)")}
              />
              <button onClick={addSkill} style={{ ...btnSmall, background: "rgba(124,58,237,0.3)", border: "1px solid rgba(124,58,237,0.5)", color: "#c084fc", padding: "0.6rem 0.875rem" }}>Add</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {data.skills.map(s => (
                <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.3rem 0.625rem", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "20px", color: "#c084fc", fontSize: "0.8rem" }}>
                  {s}
                  <span onClick={() => removeSkill(s)} style={{ cursor: "pointer", color: "#ef4444", fontWeight: 700, fontSize: "0.9rem", lineHeight: 1 }}>×</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {activeSection === "Education" && (
          <div>
            <div style={sectionHeadStyle}>
              Education
              <button onClick={addEducation} style={{ ...btnSmall, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", color: "#34d399" }}>+ Add</button>
            </div>
            {data.education.map(e => (
              <div key={e.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "0.875rem", marginBottom: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  { label: "Degree / Course", key: "degree" as const, placeholder: "B.Tech Computer Science" },
                  { label: "Institution", key: "institution" as const, placeholder: "IIT Delhi" },
                  { label: "Year", key: "year" as const, placeholder: "2022 – 2026" },
                  { label: "Grade / CGPA", key: "grade" as const, placeholder: "8.5 CGPA" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <input style={inputStyle} value={e[f.key]} placeholder={f.placeholder} onChange={ev => updateEducation(e.id, f.key, ev.target.value)} onFocus={ev => (ev.target.style.borderColor = "rgba(124,58,237,0.6)")} onBlur={ev => (ev.target.style.borderColor = "rgba(124,58,237,0.2)")} />
                  </div>
                ))}
                <button onClick={() => removeEducation(e.id)} style={{ ...btnSmall, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", alignSelf: "flex-start" }}>Remove</button>
              </div>
            ))}
          </div>
        )}

        {activeSection === "Experience" && (
          <div>
            <div style={sectionHeadStyle}>
              Work Experience
              <button onClick={addExperience} style={{ ...btnSmall, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", color: "#34d399" }}>+ Add</button>
            </div>
            {data.experience.length === 0 && (
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", textAlign: "center", padding: "1rem 0" }}>No experience added yet. Add internships, part-time, or freelance work.</p>
            )}
            {data.experience.map(ex => (
              <div key={ex.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "0.875rem", marginBottom: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  { label: "Role / Title", key: "role" as const, placeholder: "Frontend Developer Intern" },
                  { label: "Company", key: "company" as const, placeholder: "TechCorp Pvt. Ltd." },
                  { label: "Duration", key: "duration" as const, placeholder: "Jun 2024 – Aug 2024" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <input style={inputStyle} value={ex[f.key]} placeholder={f.placeholder} onChange={ev => updateExperience(ex.id, f.key, ev.target.value)} onFocus={ev => (ev.target.style.borderColor = "rgba(124,58,237,0.6)")} onBlur={ev => (ev.target.style.borderColor = "rgba(124,58,237,0.2)")} />
                  </div>
                ))}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <label style={labelStyle}>Key Responsibilities (one per line)</label>
                    <button
                      onClick={() => enhanceText("experience", ex.points, t => updateExperience(ex.id, "points", t), ex.id)}
                      disabled={isEnhancing === `experience-${ex.id}`}
                      style={{ ...btnSmall, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#c084fc", margin: "0 0 0.3rem" }}
                    >
                      {isEnhancing === `experience-${ex.id}` ? "Enhancing..." : "✨ AI Enhance"}
                    </button>
                  </div>
                  <textarea rows={3} style={{ ...inputStyle, resize: "vertical" }} value={ex.points} placeholder={"• Built responsive UI components\n• Integrated REST APIs"} onChange={ev => updateExperience(ex.id, "points", ev.target.value)} onFocus={ev => (ev.target.style.borderColor = "rgba(124,58,237,0.6)")} onBlur={ev => (ev.target.style.borderColor = "rgba(124,58,237,0.2)")} />
                </div>
                <button onClick={() => removeExperience(ex.id)} style={{ ...btnSmall, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", alignSelf: "flex-start" }}>Remove</button>
              </div>
            ))}
          </div>
        )}

        {activeSection === "Projects" && (
          <div>
            <div style={sectionHeadStyle}>
              Projects
              <button onClick={addProject} style={{ ...btnSmall, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", color: "#34d399" }}>+ Add</button>
            </div>
            {data.projects.map(p => (
              <div key={p.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "0.875rem", marginBottom: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  { label: "Project Title", key: "title" as const, placeholder: "E-Commerce Platform" },
                  { label: "Tech Stack", key: "tech" as const, placeholder: "React, Node.js, PostgreSQL" },
                  { label: "GitHub / Demo Link", key: "link" as const, placeholder: "github.com/user/project" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <input style={inputStyle} value={p[f.key]} placeholder={f.placeholder} onChange={ev => updateProject(p.id, f.key, ev.target.value)} onFocus={ev => (ev.target.style.borderColor = "rgba(124,58,237,0.6)")} onBlur={ev => (ev.target.style.borderColor = "rgba(124,58,237,0.2)")} />
                  </div>
                ))}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <label style={labelStyle}>Description</label>
                    <button
                      onClick={() => enhanceText("projects", p.desc, t => updateProject(p.id, "desc", t), p.id)}
                      disabled={isEnhancing === `projects-${p.id}`}
                      style={{ ...btnSmall, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#c084fc", margin: "0 0 0.3rem" }}
                    >
                      {isEnhancing === `projects-${p.id}` ? "Enhancing..." : "✨ AI Enhance"}
                    </button>
                  </div>
                  <textarea rows={2} style={{ ...inputStyle, resize: "vertical" }} value={p.desc} placeholder="Brief description of what you built and what impact it had." onChange={ev => updateProject(p.id, "desc", ev.target.value)} onFocus={ev => (ev.target.style.borderColor = "rgba(124,58,237,0.6)")} onBlur={ev => (ev.target.style.borderColor = "rgba(124,58,237,0.2)")} />
                </div>
                <button onClick={() => removeProject(p.id)} style={{ ...btnSmall, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", alignSelf: "flex-start" }}>Remove</button>
              </div>
            ))}
          </div>
        )}

        {activeSection === "Certifications" && (
          <div>
            <div style={sectionHeadStyle}>Certifications</div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", marginBottom: "0.875rem" }}>Toggle your Udaan AI platform certifications:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
              {PLATFORM_CERTS.map(cert => {
                const checked = data.certifications.includes(cert);
                return (
                  <label key={cert} style={{ display: "flex", alignItems: "center", gap: "0.625rem", cursor: "pointer", padding: "0.5rem 0.75rem", borderRadius: "8px", background: checked ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${checked ? "rgba(124,58,237,0.35)" : "rgba(255,255,255,0.07)"}` }}>
                    <input type="checkbox" checked={checked} onChange={() => toggleCert(cert)} style={{ accentColor: "#7c3aed", width: "15px", height: "15px" }} />
                    <span style={{ color: checked ? "#c084fc" : "rgba(255,255,255,0.55)", fontSize: "0.85rem" }}>{cert}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {activeSection === "Achievements" && (
          <div>
            <div style={sectionHeadStyle}>Achievements & Extras</div>
            <label style={labelStyle}>Achievements, awards, volunteer work (one per line with •)</label>
            <textarea
              rows={8}
              value={data.achievements}
              onChange={e => set("achievements", e.target.value)}
              style={{ ...inputStyle, resize: "vertical" }}
              placeholder={"• Won college hackathon 2024\n• Maintained 21-day streak on Udaan AI\n• Top 10% in AI Skill Assessment"}
              onFocus={e => (e.target.style.borderColor = "rgba(124,58,237,0.6)")}
              onBlur={e => (e.target.style.borderColor = "rgba(124,58,237,0.2)")}
            />
          </div>
        )}
      </div>
    </div>
  );

  const previewPanel = (
    <div ref={printRef} style={{ flex: 1, minWidth: 0 }}>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #resume-print-area, #resume-print-area * { visibility: visible !important; }
          #resume-print-area { position: fixed !important; top: 0; left: 0; width: 100vw !important; background: white !important; padding: 2cm !important; }
        }
      `}</style>
      <div
        id="resume-print-area"
        style={{ background: "white", borderRadius: "12px", padding: "2rem", color: "#1a1a2e", minHeight: "800px", fontFamily: "'Space Grotesk', Arial, sans-serif", boxShadow: "0 4px 40px rgba(0,0,0,0.4)" }}
      >
        <div style={{ borderBottom: "3px solid #7c3aed", paddingBottom: "1rem", marginBottom: "1rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#1a1a2e", margin: 0, lineHeight: 1.1 }}>{data.name || "Your Name"}</h1>
          <p style={{ color: "#7c3aed", fontWeight: 700, fontSize: "1rem", margin: "0.25rem 0 0.5rem" }}>{data.role || "Software Engineer"}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1.25rem", fontSize: "0.78rem", color: "#555" }}>
            {data.email && <span>✉ {data.email}</span>}
            {data.phone && <span>📞 {data.phone}</span>}
            {data.location && <span>📍 {data.location}</span>}
            {data.linkedin && <span>🔗 {data.linkedin}</span>}
            {data.github && <span>⌨ {data.github}</span>}
            {data.portfolio && <span>🌐 {data.portfolio}</span>}
          </div>
        </div>

        {data.summary && (
          <div style={{ marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "0.8rem", fontWeight: 800, color: "#7c3aed", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 0.35rem" }}>Professional Summary</h2>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "#333", margin: 0 }}>{data.summary}</p>
          </div>
        )}

        {data.skills.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "0.8rem", fontWeight: 800, color: "#7c3aed", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 0.5rem" }}>Technical Skills</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
              {data.skills.map(s => (
                <span key={s} style={{ padding: "0.2rem 0.6rem", background: "#f3eeff", border: "1px solid #d8b4fe", borderRadius: "4px", fontSize: "0.8rem", color: "#5b21b6", fontWeight: 600 }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "0.8rem", fontWeight: 800, color: "#7c3aed", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 0.5rem" }}>Education</h2>
            {data.education.map(e => (
              <div key={e.id} style={{ marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "0.9rem" }}>{e.degree || "Degree"}</span>
                  <span style={{ color: "#888", fontSize: "0.8rem" }}>{e.year}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#555", fontSize: "0.83rem" }}>{e.institution}</span>
                  {e.grade && <span style={{ color: "#7c3aed", fontWeight: 600, fontSize: "0.8rem" }}>{e.grade}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.experience.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "0.8rem", fontWeight: 800, color: "#7c3aed", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 0.5rem" }}>Work Experience</h2>
            {data.experience.map(ex => (
              <div key={ex.id} style={{ marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "0.9rem" }}>{ex.role || "Role"}</span>
                  <span style={{ color: "#888", fontSize: "0.8rem" }}>{ex.duration}</span>
                </div>
                <p style={{ color: "#555", fontSize: "0.83rem", margin: "0.1rem 0 0.3rem" }}>{ex.company}</p>
                {ex.points && <div style={{ fontSize: "0.82rem", color: "#333", lineHeight: 1.6, whiteSpace: "pre-line", paddingLeft: "0.25rem" }}>{ex.points}</div>}
              </div>
            ))}
          </div>
        )}

        {data.projects.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "0.8rem", fontWeight: 800, color: "#7c3aed", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 0.5rem" }}>Projects</h2>
            {data.projects.map(p => (
              <div key={p.id} style={{ marginBottom: "0.6rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "0.88rem" }}>{p.title || "Project"}</span>
                  {p.link && <span style={{ color: "#7c3aed", fontSize: "0.75rem" }}>{p.link}</span>}
                </div>
                {p.tech && <p style={{ color: "#7c3aed", fontSize: "0.78rem", fontWeight: 600, margin: "0.1rem 0" }}>Tech: {p.tech}</p>}
                {p.desc && <p style={{ color: "#333", fontSize: "0.82rem", margin: 0, lineHeight: 1.5 }}>{p.desc}</p>}
              </div>
            ))}
          </div>
        )}

        {data.certifications.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "0.8rem", fontWeight: 800, color: "#7c3aed", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 0.5rem" }}>Certifications</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              {data.certifications.map(c => (
                <div key={c} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.83rem", color: "#333" }}>
                  <span style={{ color: "#7c3aed", fontWeight: 700 }}>●</span> {c}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.achievements && (
          <div>
            <h2 style={{ fontSize: "0.8rem", fontWeight: 800, color: "#7c3aed", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 0.35rem" }}>Achievements</h2>
            <div style={{ fontSize: "0.83rem", color: "#333", lineHeight: 1.7, whiteSpace: "pre-line" }}>{data.achievements}</div>
          </div>
        )}

        <div style={{ marginTop: "1.5rem", borderTop: "1px solid #e5d4ff", paddingTop: "0.5rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.65rem", color: "#aaa", margin: 0 }}>Generated via Udaan AI · Turn your now into your next</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1200px" }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>

      <div className="no-print">
        <button
          onClick={() => setLocation("/dashboard")}
          style={{ padding: "0.4rem 0.875rem", borderRadius: "8px", border: "1px solid rgba(124,58,237,0.3)", background: "transparent", color: "#a78bfa", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.8rem", marginBottom: "1.25rem" }}
        >
          ← Dashboard
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "white", margin: "0 0 0.25rem" }}>Resume Builder</h1>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.875rem" }}>Auto-updated with your Udaan AI progress · Changes save automatically</p>
          </div>
          <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
            <button
              onClick={autoFillFromPlatform}
              style={{ padding: "0.625rem 1rem", borderRadius: "9px", border: "1px solid rgba(16,185,129,0.4)", background: "rgba(16,185,129,0.12)", color: "#34d399", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.82rem" }}
            >
              ⚡ Auto-fill from Platform
            </button>
            <button
              onClick={handleSave}
              style={{ padding: "0.625rem 1rem", borderRadius: "9px", border: "1px solid rgba(124,58,237,0.4)", background: saved ? "rgba(16,185,129,0.2)" : "rgba(124,58,237,0.2)", color: saved ? "#34d399" : "#c084fc", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.82rem", transition: "all 0.3s" }}
            >
              {saved ? "✓ Saved!" : "💾 Save"}
            </button>
            <button
              onClick={handlePrint}
              style={{ padding: "0.625rem 1rem", borderRadius: "9px", border: "none", background: "linear-gradient(135deg, #7c3aed, #9333ea)", color: "white", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.82rem", boxShadow: "0 0 14px rgba(124,58,237,0.4)" }}
            >
              🖨 Print / Export PDF
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              style={{ padding: "0.625rem 1rem", borderRadius: "9px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.82rem" }}
            >
              {showPreview ? "◀ Hide Preview" : "▶ Show Preview"}
            </button>
          </div>
        </div>

        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "10px", padding: "0.75rem 1rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "1.1rem" }}>🤖</span>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.84rem", margin: 0 }}>
            <strong style={{ color: "#fbbf24" }}>Auto-update enabled:</strong> Your name and profile are synced from your Udaan AI account. Click <strong style={{ color: "#fbbf24" }}>Auto-fill from Platform</strong> to pull in all your skills and certificates earned.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", flexWrap: showPreview ? "nowrap" : "wrap" }}>
        <div className="no-print" style={{ flex: "0 0 340px", minWidth: 0 }}>
          {editorPanel}
        </div>
        {showPreview && previewPanel}
        {!showPreview && (
          <div style={{ flex: 1 }}>
            {previewPanel}
          </div>
        )}
      </div>
    </div>
  );
}
