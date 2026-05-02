import {
  useGetRoadmap,
  getGetRoadmapQueryKey,
} from "@workspace/api-client-react";
import { getStoredStudent } from "@/lib/auth";
import { useLocation } from "wouter";
import { getConfirmedRoadmapProfile } from "@/lib/assessment-draft";
import { Storage } from "@/lib/storage";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";

const mockProgressData = [
  { week: "W1", progress: 5 },
  { week: "W2", progress: 15 },
  { week: "W3", progress: 28 },
  { week: "W4", progress: 38 },
  { week: "W5", progress: 50 },
  { week: "W6", progress: 63 },
  { week: "W7", progress: 72 },
  { week: "W8", progress: 85 },
];

function formatDuration(timePerDayMinutes: number): string {
  if (timePerDayMinutes <= 30) return "20-24 weeks";
  if (timePerDayMinutes <= 60) return "12-16 weeks";
  if (timePerDayMinutes <= 120) return "8-10 weeks";
  return "4-6 weeks";
}

function estimatePhases(timePerDayMinutes: number): number {
  if (timePerDayMinutes <= 30) return 8;
  if (timePerDayMinutes <= 60) return 6;
  if (timePerDayMinutes <= 120) return 5;
  return 4;
}

// SECTION 2 - JOB OPPORTUNITIES COMPONENT
function JobOpportunities({ skills, track }: { skills: string[]; track: string }) {
  const skillSlugs = skills.map(s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
  const hasSkill = (id: string) => skillSlugs.includes(id) || skills.some(s => s.toLowerCase().includes(id));

  const hasWeb = hasSkill("web") || hasSkill("html") || hasSkill("javascript") || hasSkill("react") || hasSkill("node");
  const hasPython = hasSkill("python");
  const hasML = hasSkill("machine-learning") || hasSkill("ml") || hasSkill("ai");
  const hasMedical = hasSkill("biology") || hasSkill("neet") || hasSkill("mbbs") || hasSkill("medical");
  const hasPharmacy = hasSkill("pharmacy") || hasSkill("pharmacology") || hasSkill("gpat");
  const hasHR = hasSkill("hr") || hasSkill("recruitment") || hasSkill("human-resources");
  const hasDesign = hasSkill("design") || hasSkill("ui") || hasSkill("ux") || hasSkill("figma") || hasSkill("canva") || hasSkill("graphic-design");
  const hasMarketing = hasSkill("digital-marketing") || hasSkill("social-media") || hasSkill("seo") || hasSkill("content-creation") || hasSkill("marketing");
  const hasFinance = hasSkill("accounting") || hasSkill("finance") || hasSkill("tally") || hasSkill("ca") || hasSkill("excel");

  return (
    <div style={{ marginBottom: "3rem" }}>
      <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>
        🎯 Your Career Destination
      </h2>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", marginBottom: "2rem" }}>
        Here's where this roadmap takes you
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {/* Tech Track Jobs */}
        {(hasWeb || hasPython || hasML) && (
          <>
            <JobCard
              title="Junior Web Developer"
              salary="₹2.5 - 5 LPA"
              timeline="After 6-8 months of learning"
              companies={["TCS", "Wipro", "Local IT agencies", "Web development firms"]}
              type="Full Time"
            />
            <JobCard
              title="Frontend Developer"
              salary="₹3 - 6 LPA"
              timeline="After 8-12 months"
              companies={["Startups", "Product companies", "Juspay", "Razorpay", "Groww"]}
              type="Full Time"
            />
            <JobCard
              title="Freelance Web Developer"
              salary="₹10k - 50k/month"
              timeline="After 4-6 months"
              companies={["Upwork", "Fiverr", "Freelancer"]}
              type="Freelance"
            />
            <JobCard
              title="Full Stack Developer"
              salary="₹5 - 10 LPA"
              timeline="After 1-1.5 years"
              companies={["Any tech company", "startups"]}
              type="Full Time"
            />
            <JobCard
              title="Senior Developer (2-3 years)"
              salary="₹10 - 18 LPA"
              timeline="Growth Path"
              companies={["Top product companies"]}
              type="Growth Path"
            />
          </>
        )}

        {/* HR Track Jobs */}
        {hasHR && (
          <>
            <JobCard
              title="HR Executive"
              salary="₹2 - 3.5 LPA"
              timeline="Entry Level"
              companies={["Any mid-large company", "IT firms"]}
              type="Full Time"
            />
            <JobCard
              title="HR Recruiter"
              salary="₹1.8 - 3 LPA"
              timeline="Entry Level"
              companies={["Consulting firms", "TeamLease", "Randstad"]}
              type="Full Time"
            />
            <JobCard
              title="Talent Acquisition"
              salary="₹3 - 5 LPA"
              timeline="After 1-2 years"
              companies={["Large corporates", "MNCs"]}
              type="Full Time"
            />
            <JobCard
              title="HR Manager (2-3 yrs)"
              salary="₹5 - 10 LPA"
              timeline="Growth Path"
              companies={["Senior positions"]}
              type="Growth Path"
            />
            <JobCard
              title="Freelance HR Consultant"
              salary="₹5k - 20k/month"
              timeline="After 6-12 months"
              companies={["Small businesses", "Startups"]}
              type="Freelance"
            />
          </>
        )}

        {/* Marketing Track Jobs */}
        {hasMarketing && (
          <>
            <JobCard
              title="Digital Marketing Executive"
              salary="₹2 - 3.5 LPA"
              timeline="Entry Level"
              companies={["Marketing agencies", "Brands", "Startups"]}
              type="Full Time"
            />
            <JobCard
              title="Social Media Manager"
              salary="₹2 - 4 LPA"
              timeline="After 6-12 months"
              companies={["Digital agencies", "E-commerce"]}
              type="Full Time"
            />
            <JobCard
              title="SEO Executive"
              salary="₹2 - 3.5 LPA"
              timeline="Entry Level"
              companies={["SEO agencies", "Content companies"]}
              type="Full Time"
            />
            <JobCard
              title="Freelance Marketer"
              salary="₹10k - 30k/month"
              timeline="After 4-6 months"
              companies={["Upwork", "Fiverr", "Direct clients"]}
              type="Freelance"
            />
            <JobCard
              title="Marketing Manager (2-3 yrs)"
              salary="₹6 - 12 LPA"
              timeline="Growth Path"
              companies={["Senior positions", "Head of Marketing"]}
              type="Growth Path"
            />
          </>
        )}

        {/* Design Track Jobs */}
        {hasDesign && (
          <>
            <JobCard
              title="Junior UI Designer"
              salary="₹2.5 - 4.5 LPA"
              timeline="Entry Level"
              companies={["Design agencies", "Startups", "Product companies"]}
              type="Full Time"
            />
            <JobCard
              title="Graphic Designer"
              salary="₹2 - 4 LPA"
              timeline="Entry Level"
              companies={["Advertising agencies", "Media houses"]}
              type="Full Time"
            />
            <JobCard
              title="Freelance Designer"
              salary="₹5k - 30k/project"
              timeline="After 4-6 months"
              companies={["Upwork", "Fiverr", "Direct clients"]}
              type="Freelance"
            />
            <JobCard
              title="Senior Designer (2-3 yrs)"
              salary="₹8 - 15 LPA"
              timeline="Growth Path"
              companies={["Senior positions", "Lead Designer"]}
              type="Growth Path"
            />
            <JobCard
              title="Product Designer"
              salary="₹10 - 18 LPA"
              timeline="Growth Path"
              companies={["Top product companies", "Tech giants"]}
              type="Growth Path"
            />
          </>
        )}

        {/* Finance/CA Track Jobs */}
        {hasFinance && (
          <>
            <JobCard
              title="Accountant"
              salary="₹2 - 4 LPA"
              timeline="Entry Level"
              companies={["Small businesses", "Accounting firms"]}
              type="Full Time"
            />
            <JobCard
              title="Finance Analyst"
              salary="₹3 - 5 LPA"
              timeline="After 1-2 years"
              companies={["Corporates", "Banks", "Financial institutions"]}
              type="Full Time"
            />
            <JobCard
              title="Tax Consultant"
              salary="₹2 - 3.5 LPA"
              timeline="Entry Level"
              companies={["Tax firms", "Consulting"]}
              type="Full Time"
            />
            <JobCard
              title="Freelance Accountant"
              salary="₹5k - 20k/month"
              timeline="After 6-12 months"
              companies={["Small businesses", "Individuals"]}
              type="Freelance"
            />
            <JobCard
              title="CA (after qualification)"
              salary="₹7 - 15 LPA"
              timeline="Growth Path"
              companies={["Big 4", "MNCs", "Senior positions"]}
              type="Growth Path"
            />
          </>
        )}

        {/* Medical/NEET Track Jobs */}
        {hasMedical && (
          <>
            <JobCard
              title="MBBS Doctor (5.5 years)"
              salary="₹3 - 8 LPA"
              timeline="After MBBS"
              companies={["Hospitals", "Clinics"]}
              type="Full Time"
            />
            <JobCard
              title="Government Doctor"
              salary="₹3 - 6 LPA"
              timeline="After MBBS"
              companies={["Government hospitals", "PHCs"]}
              type="Full Time"
            />
            <JobCard
              title="Private Hospital"
              salary="₹8 - 20 LPA"
              timeline="After MBBS + Experience"
              companies={["Private hospitals", "Corporate hospitals"]}
              type="Full Time"
            />
            <JobCard
              title="Specialist (MD/MS)"
              salary="₹15 - 50 LPA"
              timeline="After specialization"
              companies={["Top hospitals", "Specialty centers"]}
              type="Growth Path"
            />
            <JobCard
              title="Ayurvedic Doctor (BAMS)"
              salary="₹2 - 6 LPA"
              timeline="After BAMS"
              companies={["Ayurvedic hospitals", "Private practice"]}
              type="Full Time"
            />
          </>
        )}

        {!(hasWeb || hasPython || hasML || hasMedical || hasPharmacy || hasHR || hasDesign || hasMarketing || hasFinance) && (
          <div style={{ gridColumn: "1 / -1", background: "rgba(13,10,40,0.8)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "16px", padding: "2rem", textAlign: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.7)", margin: 0, fontSize: "1rem" }}>
              Complete your assessment to see personalized career guidance for your selected skills.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function JobCard({ title, salary, timeline, companies, type }: { title: string; salary: string; timeline: string; companies: string[]; type: string }) {
  return (
    <div style={{
      background: "rgba(13,10,40,0.85)",
      border: "1px solid rgba(124,58,237,0.25)",
      borderRadius: "16px",
      padding: "1.5rem",
      transition: "all 0.3s ease",
      cursor: "default",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <h3 style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", margin: 0, lineHeight: 1.3 }}>
          {title}
        </h3>
        <span style={{
          background: "rgba(16,185,129,0.15)",
          color: "#34d399",
          fontWeight: 700,
          fontSize: "0.75rem",
          padding: "0.3rem 0.6rem",
          borderRadius: "8px",
          border: "1px solid rgba(16,185,129,0.3)",
          whiteSpace: "nowrap",
        }}>
          {salary}
        </span>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <span style={{
          background: "rgba(124,58,237,0.15)",
          color: "#a78bfa",
          fontWeight: 600,
          fontSize: "0.75rem",
          padding: "0.25rem 0.6rem",
          borderRadius: "6px",
          border: "1px solid rgba(124,58,237,0.3)",
        }}>
          {timeline}
        </span>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", margin: "0 0 0.5rem" }}>Companies:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {companies.map((company, idx) => (
            <span key={idx} style={{
              background: "rgba(124,58,237,0.1)",
              color: "#c4b5fd",
              fontSize: "0.7rem",
              padding: "0.2rem 0.5rem",
              borderRadius: "4px",
              border: "1px solid rgba(124,58,237,0.2)",
            }}>
              {company}
            </span>
          ))}
        </div>
      </div>

      <span style={{
        background: type === "Freelance" ? "rgba(245,158,11,0.15)" : type === "Growth Path" ? "rgba(236,72,153,0.15)" : "rgba(59,130,246,0.15)",
        color: type === "Freelance" ? "#fbbf24" : type === "Growth Path" ? "#f472b6" : "#60a5fa",
        fontWeight: 600,
        fontSize: "0.7rem",
        padding: "0.25rem 0.6rem",
        borderRadius: "6px",
        border: type === "Freelance" ? "1px solid rgba(245,158,11,0.3)" : type === "Growth Path" ? "1px solid rgba(236,72,153,0.3)" : "1px solid rgba(59,130,246,0.3)",
      }}>
        {type}
      </span>
    </div>
  );
}

// SECTION 3 - LEARNING ROADMAP STEPS COMPONENT
function LearningRoadmapSteps({ skills, skillIconMap, setLocation }: { skills: string[]; skillIconMap: Record<string, string>; setLocation: (path: string) => void }) {
  return (
    <div style={{ marginBottom: "3rem" }}>
      <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>
        📚 Your Learning Path
      </h2>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", marginBottom: "2rem" }}>
        Step by step journey to your goal
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {skills.map((skill, index) => (
          <div key={skill} style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 800,
                  fontSize: "1.4rem",
                  boxShadow: "0 0 20px rgba(124,58,237,0.4)",
                  border: "3px solid rgba(124,58,237,0.3)",
                }}
              >
                {skillIconMap[skill] || "✨"}
              </div>
              {index < skills.length - 1 && (
                <div
                  style={{
                    width: "3px",
                    minHeight: "60px",
                    background: "linear-gradient(to bottom, #7c3aed, rgba(124,58,237,0.2))",
                    marginTop: "0.75rem",
                  }}
                />
              )}
            </div>

            <div
              style={{
                flex: 1,
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.25)",
                borderRadius: "16px",
                padding: "1.5rem",
                marginBottom: index < skills.length - 1 ? "1.5rem" : 0,
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      color: "#a78bfa",
                      background: "rgba(124,58,237,0.2)",
                      border: "1px solid rgba(124,58,237,0.4)",
                      borderRadius: "20px",
                      padding: "0.3rem 0.7rem",
                    }}
                  >
                    Step {index + 1}
                  </span>
                  <h4 style={{ color: "white", fontWeight: 700, fontSize: "1.15rem", margin: 0 }}>
                    {skill}
                  </h4>
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: index === 0 ? "#34d399" : index === skills.length - 1 ? "#f472b6" : "#60a5fa",
                    background: index === 0 ? "rgba(52,211,153,0.15)" : index === skills.length - 1 ? "rgba(244,114,182,0.15)" : "rgba(96,165,250,0.15)",
                    border: index === 0 ? "1px solid rgba(52,211,153,0.3)" : index === skills.length - 1 ? "1px solid rgba(244,114,182,0.3)" : "1px solid rgba(96,165,250,0.3)",
                    borderRadius: "20px",
                    padding: "0.25rem 0.6rem",
                  }}
                >
                  {index === 0 ? "Beginner" : index === skills.length - 1 ? "Advanced" : "Intermediate"}
                </span>
              </div>

              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", margin: "0 0 1rem" }}>
                {index === 0 && "Foundation skill - Start here to build your base"}
                {index === skills.length - 1 && index > 0 && "Advanced skill - Build upon previous skills to master the domain"}
                {index > 0 && index < skills.length - 1 && "Intermediate skill - Progress from foundations to advanced concepts"}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
                  ⏱️ Estimated: {index === 0 ? "2-3 weeks" : index === skills.length - 1 ? "4-6 weeks" : "3-4 weeks"}
                </span>
                <button
                  onClick={() => setLocation(`/skill/${skill.toLowerCase().replace(/\s+/g, '-')}/beginner/1`)}
                  style={{
                    padding: "0.5rem 1.25rem",
                    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                    border: "none",
                    borderRadius: "10px",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    fontFamily: "'Space Grotesk', sans-serif",
                    transition: "all 0.3s ease",
                  }}
                >
                  Start Learning
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// SECTION 4 - PROGRESS TRACKER COMPONENT
function ProgressTracker({ confirmedProfile }: { confirmedProfile: any }) {
  const overallProgress = Storage.getOverallProgress();
  const estimatedDuration = confirmedProfile?.timePerDayMinutes ? formatDuration(confirmedProfile.timePerDayMinutes) : "12-16 weeks";

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>
        📊 Your Progress
      </h2>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", marginBottom: "2rem" }}>
        Track your learning journey
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <div style={{
          background: "rgba(13,10,40,0.8)",
          border: "1px solid rgba(124,58,237,0.2)",
          borderRadius: "16px",
          padding: "1.5rem",
          textAlign: "center",
        }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", margin: "0 0 0.5rem" }}>Overall Completion</p>
          <p style={{ color: "#34d399", fontSize: "2.5rem", fontWeight: 800, margin: 0 }}>
            {Math.round((overallProgress.phasesCompleted / 24) * 100)}%
          </p>
        </div>

        <div style={{
          background: "rgba(13,10,40,0.8)",
          border: "1px solid rgba(124,58,237,0.2)",
          borderRadius: "16px",
          padding: "1.5rem",
          textAlign: "center",
        }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", margin: "0 0 0.5rem" }}>Phases Completed</p>
          <p style={{ color: "#a78bfa", fontSize: "2.5rem", fontWeight: 800, margin: 0 }}>
            {overallProgress.phasesCompleted}
          </p>
        </div>

        <div style={{
          background: "rgba(13,10,40,0.8)",
          border: "1px solid rgba(124,58,237,0.2)",
          borderRadius: "16px",
          padding: "1.5rem",
          textAlign: "center",
        }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", margin: "0 0 0.5rem" }}>Total Points</p>
          <p style={{ color: "#fbbf24", fontSize: "2.5rem", fontWeight: 800, margin: 0 }}>
            {overallProgress.totalPoints}
          </p>
        </div>

        <div style={{
          background: "rgba(13,10,40,0.8)",
          border: "1px solid rgba(124,58,237,0.2)",
          borderRadius: "16px",
          padding: "1.5rem",
          textAlign: "center",
        }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", margin: "0 0 0.5rem" }}>Estimated Duration</p>
          <p style={{ color: "#60a5fa", fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
            {estimatedDuration}
          </p>
        </div>
      </div>

      <div style={{
        background: "rgba(13,10,40,0.8)",
        border: "1px solid rgba(124,58,237,0.2)",
        borderRadius: "16px",
        padding: "1.5rem",
      }}>
        <h3 style={{ color: "white", fontWeight: 600, marginBottom: "1rem", fontSize: "1rem" }}>
          Weekly Progress
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={mockProgressData}>
            <defs>
              <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.1)" />
            <XAxis dataKey="week" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "rgba(13,10,40,0.95)",
                border: "1px solid rgba(124,58,237,0.3)",
                borderRadius: "10px",
                color: "white",
              }}
            />
            <Area type="monotone" dataKey="progress" stroke="#7c3aed" strokeWidth={2} fill="url(#progressGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function Roadmap() {
  const [, setLocation] = useLocation();
  const student = getStoredStudent();
  const confirmedProfile = getConfirmedRoadmapProfile();

  const { data: roadmap, isLoading, error } = useGetRoadmap(student?.id || "", {
    query: {
      enabled: !!student?.id,
      queryKey: getGetRoadmapQueryKey(student?.id || ""),
    },
  });

  // Save to localStorage when successfully loaded from database
  useEffect(() => {
    if (roadmap && confirmedProfile) {
      const roadmapData = {
        goal: confirmedProfile.goal || "Get a Job",
        field: confirmedProfile.field || "General Tech",
        skillLevel: confirmedProfile.skillLevel || "beginner",
        timePerDayMinutes: confirmedProfile.timePerDayMinutes || 60,
        interests: confirmedProfile.interests || [],
        extraSkills: confirmedProfile.extraSkills || [],
        timelineWeeks: confirmedProfile.timelineWeeks || 24,
        phases: confirmedProfile.phases || 6,
        track: confirmedProfile.field || confirmedProfile.interests?.[0] || "General Tech",
        generatedAt: Date.now(),
      };
      Storage.saveRoadmap(roadmapData);
    }
  }, [roadmap, confirmedProfile]);

  // Try to get roadmap from localStorage if database fails
  const localRoadmap = error || !roadmap ? (() => {
    const stored = Storage.getRoadmap();
    if (stored) {
      // Convert localStorage format to roadmap format
      return {
        description: `Turn your now into your next — your personalized path to ${stored.goal}`,
        phases: Array.from({ length: stored.phases }, (_, i) => ({
          phase: i + 1,
          title: `Phase ${i + 1}`,
          description: stored.interests?.join(', ') || 'Building foundations',
          status: i === 0 ? 'active' : i === 1 ? 'locked' : 'locked',
          completionPercentage: i === 0 ? 0 : 0,
          courses: stored.interests?.map((skill: string, idx: number) => ({
            id: `${skill.toLowerCase().replace(/\s+/g, '-')}-${idx}`,
            title: skill,
          })) || [],
        })),
      };
    }
    return null;
  })() : null;

  const finalRoadmap = roadmap || localRoadmap;

  // Get all skills from assessment (interests + extraSkills)
  const assessmentSkills = confirmedProfile 
    ? Array.from(new Set([...(confirmedProfile.interests || []), ...(confirmedProfile.extraSkills || [])]))
    : [];

  const skillIconMap: Record<string, string> = {
    "Web Development": "🌐",
    "App Development": "📱",
    "Data Science": "📊",
    "AI/ML": "🤖",
    "Cybersecurity": "🛡️",
    "Design": "🎨",
    "Soft Skills": "💬",
    "Python": "🐍",
    "JavaScript": "⚡",
    "React": "⚛️",
    "Excel": "📗",
    "SQL": "🗃️",
    "Cloud": "☁️",
    "DevOps": "🔧",
  };

  if (!student) {
    setLocation("/signup");
    return null;
  }

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", display: "flex", alignItems: "center", justifyContent: "center", height: "70vh" }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "3px solid rgba(124,58,237,0.3)",
              borderTop: "3px solid #7c3aed",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "rgba(255,255,255,0.6)" }}>Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  if (error || !roadmap) {
    if (!finalRoadmap) {
      return (
        <div style={{ padding: "2rem" }}>
          <div
            style={{
              background: "rgba(13,10,40,0.8)",
              border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: "16px",
              padding: "3rem",
              textAlign: "center",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "1rem" }}>
              No roadmap found. Please complete your assessment first.
            </p>
            <button
              onClick={() => setLocation("/assessment")}
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
              Start Assessment
            </button>
          </div>
        </div>
      );
    }
    // If we have finalRoadmap from localStorage, continue
  }

  if (!finalRoadmap) {
    return (
      <div style={{ padding: "2rem" }}>
        <div
          style={{
            background: "rgba(13,10,40,0.8)",
            border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: "16px",
            padding: "3rem",
            textAlign: "center",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "1rem" }}>
            No roadmap found. Please complete your assessment first.
          </p>
          <button
            onClick={() => setLocation("/assessment")}
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
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    active: "#7c3aed",
    completed: "#10b981",
    locked: "rgba(255,255,255,0.2)",
  };

  const statusBgColors: Record<string, string> = {
    active: "rgba(124,58,237,0.15)",
    completed: "rgba(16,185,129,0.1)",
    locked: "rgba(255,255,255,0.04)",
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(13,10,40,0.8)",
    border: "1px solid rgba(124,58,237,0.2)",
    borderRadius: "16px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  };

  const userTrack = confirmedProfile?.field || confirmedProfile?.interests?.[0] || "General Tech";
  const userName = student?.name || "Student";

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1200px" }}>
      {/* SECTION 1 - HEADER */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>
          Your Personalised Roadmap
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", marginBottom: "0.5rem" }}>
          Personalized based on your goals in <span style={{ color: "#a78bfa", fontWeight: 600 }}>{userTrack}</span>
        </p>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>
          Welcome, <span style={{ color: "#c4b5fd", fontWeight: 600 }}>{userName}</span>
        </p>
      </div>

      {/* SECTION 2 - JOB OPPORTUNITIES (FIRST) */}
      <JobOpportunities skills={assessmentSkills} track={userTrack} />

      {/* SECTION 3 - LEARNING ROADMAP STEPS */}
      {assessmentSkills.length > 0 && (
        <LearningRoadmapSteps skills={assessmentSkills} skillIconMap={skillIconMap} setLocation={setLocation} />
      )}

      {/* SECTION 4 - PROGRESS TRACKER (BOTTOM) */}
      <ProgressTracker confirmedProfile={confirmedProfile} />
    </div>
  );
}
