import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface LibraryNote {
  id: string;
  courseId: string;
  title: string;
  content: string;
  courseName: string;
  courseCategory: string;
  courseDifficulty: string;
  createdAt?: string;
}

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function fetchLibrary(): Promise<LibraryNote[]> {
  const res = await fetch(`${API_BASE}/api/library`);
  if (!res.ok) throw new Error("Failed to fetch library");
  return res.json();
}

const categoryColors: Record<string, { border: string; bg: string; text: string }> = {
  "AI/ML":            { border: "#7c3aed", bg: "rgba(124,58,237,0.12)", text: "#a78bfa" },
  "Web Development":  { border: "#0891b2", bg: "rgba(8,145,178,0.12)",  text: "#67e8f9" },
  "Data Science":     { border: "#9333ea", bg: "rgba(147,51,234,0.12)", text: "#c084fc" },
  "DevOps":           { border: "#f59e0b", bg: "rgba(245,158,11,0.12)", text: "#fbbf24" },
  "Mobile Dev":       { border: "#ec4899", bg: "rgba(236,72,153,0.12)", text: "#f9a8d4" },
  "General":          { border: "#6b7280", bg: "rgba(107,114,128,0.12)", text: "#9ca3af" },
};

const difficultyColors: Record<string, string> = {
  beginner:     "#10b981",
  intermediate: "#f59e0b",
  advanced:     "#ef4444",
};

export default function Library() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [bookmarked, setBookmarked] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem("udaan_bookmarks");
      return new Set(raw ? JSON.parse(raw) : []);
    } catch { return new Set(); }
  });
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: notes = [], isLoading, error } = useQuery({
    queryKey: ["library"],
    queryFn: fetchLibrary,
  });

  const categories = useMemo(() => {
    const cats = Array.from(new Set(notes.map(n => n.courseCategory)));
    return ["All", "Bookmarked", ...cats];
  }, [notes]);

  const filtered = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch =
        !search ||
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase()) ||
        note.courseName.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        (activeCategory === "Bookmarked" && bookmarked.has(note.id)) ||
        note.courseCategory === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [notes, search, activeCategory, bookmarked]);

  function toggleBookmark(id: string) {
    setBookmarked(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast({ title: "Removed from bookmarks" });
      } else {
        next.add(id);
        toast({ title: "Bookmarked!" });
      }
      localStorage.setItem("udaan_bookmarks", JSON.stringify([...next]));
      return next;
    });
  }

  function copyNote(note: LibraryNote) {
    navigator.clipboard?.writeText(`${note.title}\n\n${note.content}`);
    toast({ title: "Note copied to clipboard!" });
  }

  const cardStyle = (cat: string): React.CSSProperties => ({
    background: "rgba(13,10,40,0.85)",
    border: `1px solid ${categoryColors[cat]?.border || "#7c3aed"}33`,
    borderRadius: "16px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.875rem",
    transition: "all 0.25s ease",
    cursor: "pointer",
  });

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", display: "flex", alignItems: "center", justifyContent: "center", height: "70vh" }}>
        <div>
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
          <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center" }}>Loading library...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem" }}>
        <div
          style={{
            background: "rgba(13,10,40,0.8)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "16px",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <p style={{ color: "rgba(239,68,68,0.8)" }}>Failed to load library. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1100px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "white", marginBottom: "0.4rem" }}>
          Notes Library
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>
          All course notes in one place — search, bookmark, and revisit anytime
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: "240px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.9rem",
              pointerEvents: "none",
            }}
          >
            S
          </div>
          <input
            data-testid="input-search-library"
            type="text"
            placeholder="Search notes by title, content or course..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem 0.75rem 2.5rem",
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.25)",
              borderRadius: "12px",
              color: "white",
              fontSize: "0.9rem",
              outline: "none",
              fontFamily: "'Space Grotesk', sans-serif",
              boxSizing: "border-box",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.25)")}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                fontSize: "1rem",
                padding: 0,
              }}
            >
              x
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.4rem" }}>
          {["grid", "list"].map(mode => (
            <button
              key={mode}
              data-testid={`button-view-${mode}`}
              onClick={() => setViewMode(mode as "grid" | "list")}
              style={{
                padding: "0.6rem 0.875rem",
                borderRadius: "10px",
                border: viewMode === mode ? "1px solid rgba(124,58,237,0.5)" : "1px solid rgba(255,255,255,0.1)",
                background: viewMode === mode ? "rgba(124,58,237,0.2)" : "transparent",
                color: viewMode === mode ? "#c084fc" : "rgba(255,255,255,0.4)",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: 600,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {mode === "grid" ? "⊞ Grid" : "≡ List"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        {categories.map(cat => (
          <button
            key={cat}
            data-testid={`filter-category-${cat}`}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "20px",
              border:
                activeCategory === cat
                  ? `1px solid ${categoryColors[cat]?.border || "#7c3aed"}`
                  : "1px solid rgba(255,255,255,0.1)",
              background:
                activeCategory === cat
                  ? categoryColors[cat]?.bg || "rgba(124,58,237,0.15)"
                  : "transparent",
              color:
                activeCategory === cat
                  ? categoryColors[cat]?.text || "#a78bfa"
                  : "rgba(255,255,255,0.45)",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 500,
              fontFamily: "'Space Grotesk', sans-serif",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            {cat === "Bookmarked" && "★ "}
            {cat}
            {cat !== "All" && cat !== "Bookmarked" && (
              <span
                style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "0 0.3rem",
                  borderRadius: "6px",
                  fontSize: "0.7rem",
                }}
              >
                {notes.filter(n => n.courseCategory === cat).length}
              </span>
            )}
            {cat === "Bookmarked" && (
              <span
                style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "0 0.3rem",
                  borderRadius: "6px",
                  fontSize: "0.7rem",
                }}
              >
                {bookmarked.size}
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}>
          {filtered.length} note{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            background: "rgba(13,10,40,0.7)",
            border: "1px solid rgba(124,58,237,0.15)",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              opacity: 0.4,
            }}
          >
            📚
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>
            {search ? "No notes match your search" : "No notes in this category yet"}
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                marginTop: "0.75rem",
                padding: "0.5rem 1.25rem",
                background: "rgba(124,58,237,0.15)",
                border: "1px solid rgba(124,58,237,0.3)",
                borderRadius: "8px",
                color: "#a78bfa",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Clear Search
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {filtered.map(note => {
            const catStyle = categoryColors[note.courseCategory] || categoryColors["General"];
            const isExpanded = expandedNote === note.id;
            return (
              <div
                key={note.id}
                data-testid={`note-card-${note.id}`}
                style={cardStyle(note.courseCategory)}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${catStyle.border}66`;
                  e.currentTarget.style.boxShadow = `0 4px 24px ${catStyle.border}22`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = `${catStyle.border}33`;
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span
                      style={{
                        padding: "0.2rem 0.6rem",
                        borderRadius: "6px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: catStyle.text,
                        background: catStyle.bg,
                        border: `1px solid ${catStyle.border}44`,
                      }}
                    >
                      {note.courseCategory}
                    </span>
                    <span
                      style={{
                        padding: "0.2rem 0.6rem",
                        borderRadius: "6px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: difficultyColors[note.courseDifficulty] || "#a78bfa",
                        background: `${difficultyColors[note.courseDifficulty] || "#7c3aed"}15`,
                        textTransform: "capitalize",
                      }}
                    >
                      {note.courseDifficulty}
                    </span>
                  </div>
                  <button
                    data-testid={`button-bookmark-${note.id}`}
                    onClick={e => { e.stopPropagation(); toggleBookmark(note.id); }}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      color: bookmarked.has(note.id) ? "#f59e0b" : "rgba(255,255,255,0.25)",
                      padding: "0",
                      flexShrink: 0,
                      transition: "color 0.2s",
                    }}
                    title={bookmarked.has(note.id) ? "Remove bookmark" : "Bookmark"}
                  >
                    ★
                  </button>
                </div>

                <div>
                  <h3
                    style={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {note.title}
                  </h3>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "0.85rem",
                      lineHeight: 1.6,
                      display: "-webkit-box",
                      WebkitLineClamp: isExpanded ? 100 : 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {note.content}
                  </p>
                  {note.content.length > 200 && (
                    <button
                      onClick={e => { e.stopPropagation(); setExpandedNote(isExpanded ? null : note.id); }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: catStyle.text,
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        padding: "0.25rem 0",
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {isExpanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>

                <div
                  style={{
                    paddingTop: "0.875rem",
                    borderTop: `1px solid ${catStyle.border}22`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={e => { e.stopPropagation(); setLocation(`/courses/${note.courseId}`); }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "rgba(255,255,255,0.4)",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      padding: 0,
                      fontFamily: "'Space Grotesk', sans-serif",
                      textAlign: "left",
                      maxWidth: "160px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={note.courseName}
                  >
                    {note.courseName}
                  </button>
                  <button
                    data-testid={`button-copy-${note.id}`}
                    onClick={e => { e.stopPropagation(); copyNote(note); }}
                    style={{
                      padding: "0.3rem 0.75rem",
                      background: catStyle.bg,
                      border: `1px solid ${catStyle.border}44`,
                      borderRadius: "8px",
                      color: catStyle.text,
                      cursor: "pointer",
                      fontSize: "0.72rem",
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filtered.map(note => {
            const catStyle = categoryColors[note.courseCategory] || categoryColors["General"];
            const isExpanded = expandedNote === note.id;
            return (
              <div
                key={note.id}
                data-testid={`note-list-${note.id}`}
                style={{
                  background: "rgba(13,10,40,0.85)",
                  border: `1px solid ${catStyle.border}33`,
                  borderRadius: "14px",
                  padding: "1.25rem 1.5rem",
                  borderLeft: `4px solid ${catStyle.border}`,
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(20,14,50,0.9)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(13,10,40,0.85)")}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                      <span
                        style={{
                          padding: "0.15rem 0.5rem",
                          borderRadius: "5px",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: catStyle.text,
                          background: catStyle.bg,
                        }}
                      >
                        {note.courseCategory}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem" }}>
                        {note.courseName}
                      </span>
                    </div>
                    <h3 style={{ color: "white", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.4rem" }}>
                      {note.title}
                    </h3>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.55)",
                        fontSize: "0.85rem",
                        lineHeight: 1.6,
                        display: "-webkit-box",
                        WebkitLineClamp: isExpanded ? 100 : 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {note.content}
                    </p>
                    {note.content.length > 150 && (
                      <button
                        onClick={() => setExpandedNote(isExpanded ? null : note.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: catStyle.text,
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          padding: "0.2rem 0",
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        {isExpanded ? "Collapse" : "Expand"}
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                    <button
                      data-testid={`button-bookmark-list-${note.id}`}
                      onClick={() => toggleBookmark(note.id)}
                      style={{
                        background: "transparent",
                        border: `1px solid ${bookmarked.has(note.id) ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.1)"}`,
                        borderRadius: "8px",
                        color: bookmarked.has(note.id) ? "#f59e0b" : "rgba(255,255,255,0.25)",
                        cursor: "pointer",
                        padding: "0.35rem 0.6rem",
                        fontSize: "0.9rem",
                        transition: "all 0.2s",
                      }}
                    >
                      ★
                    </button>
                    <button
                      onClick={() => setLocation(`/courses/${note.courseId}`)}
                      style={{
                        background: catStyle.bg,
                        border: `1px solid ${catStyle.border}44`,
                        borderRadius: "8px",
                        color: catStyle.text,
                        cursor: "pointer",
                        padding: "0.35rem 0.75rem",
                        fontSize: "0.75rem",
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      View Course
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
