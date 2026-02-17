
import React, { useState } from "react";
import { findMoringaBuyers } from "./services/geminiService";

const COUNTRIES = [
  "Netherlands", "Germany", "USA", "South Korea", "Japan",
  "UAE", "Australia", "France", "UK", "Canada", "Singapore", "Brazil"
];

function Badge({ label, color = "#2d5016", bg = "#edf7e4" }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
      background: bg, color, padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap", display: "inline-block"
    }}>
      {label}
    </span>
  );
}

function BuyerCard({ buyer, index }) {
  const [copied, setCopied] = useState(false);
  const tier = {
    High: { bg: "#edf7e4", text: "#1a5c0a", dot: "#34a853" },
    Medium: { bg: "#fff8e1", text: "#7a5c00", dot: "#f9a825" },
    Low: { bg: "#fef0f0", text: "#7a1a1a", dot: "#e53935" },
  }[buyer.priority] || { bg: "#f4f4f4", text: "#666", dot: "#aaa" };

  const hasEmail = buyer.email && buyer.email !== "null" && buyer.email !== null;
  const hasPhone = buyer.phone && buyer.phone !== "null" && buyer.phone !== null;
  const hasWebsite = buyer.website && buyer.website !== "null" && buyer.website !== null;
  const hasVol = buyer.annual_import_volume && buyer.annual_import_volume !== "null" && buyer.annual_import_volume !== null;
  const hasMOQ = buyer.min_order && buyer.min_order !== "null" && buyer.min_order !== null;
  const hasTip = buyer.approach_tip && buyer.approach_tip !== "null" && buyer.approach_tip !== null;

  return (
    <div style={{
      background: "#fff", borderRadius: 24, border: "1px solid #ede8df",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)", overflow: "hidden",
      transition: "transform 0.18s,box-shadow 0.18s", display: "flex", flexDirection: "column"
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(0,0,0,0.11)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)"; }}>

      {/* ── Card header ── */}
      <div style={{
        background: "linear-gradient(135deg,#1a3d08 0%,#2d5016 100%)",
        padding: "22px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{
              width: 26, height: 26, borderRadius: 7, background: "#d4b483", color: "#1a3d08",
              display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12, flexShrink: 0
            }}>
              {index + 1}
            </span>
            <span style={{ fontSize: 9, color: "#a8c890", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              {buyer.type || "Importer"}
            </span>
          </div>
          <h3 style={{ color: "#fff", fontWeight: 900, fontSize: 16, margin: "0 0 5px", lineHeight: 1.2 }}>
            {buyer.company}
          </h3>
          <p style={{ color: "#a8c890", fontSize: 11, margin: 0, fontWeight: 500 }}>
            📍 {[buyer.city, buyer.country].filter(Boolean).join(", ")}
          </p>
        </div>
        <div style={{
          background: tier.bg, borderRadius: 12, padding: "6px 11px",
          display: "flex", alignItems: "center", gap: 5, flexShrink: 0
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: tier.dot, display: "inline-block" }} />
          <span style={{ fontSize: 8, fontWeight: 800, color: tier.text, textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
            {buyer.priority}
          </span>
        </div>
      </div>

      {/* ── Card body ── */}
      <div style={{ padding: "20px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Description */}
        <p style={{ fontSize: 12.5, color: "#555", lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
          {buyer.description}
        </p>

        {/* Products */}
        {Array.isArray(buyer.products) && buyer.products.filter(p => p && p !== "null").length > 0 && (
          <div>
            <p style={{
              fontSize: 8, fontWeight: 800, color: "#bbb", textTransform: "uppercase",
              letterSpacing: "0.15em", margin: "0 0 7px"
            }}>Products Imported</p>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {buyer.products.filter(p => p && p !== "null").map((p, i) =>
                <Badge key={i} label={p} bg="#f0f7e8" color="#2d5016" />
              )}
            </div>
          </div>
        )}

        {/* Certifications */}
        {Array.isArray(buyer.certifications) && buyer.certifications.filter(c => c && c !== "null").length > 0 && (
          <div>
            <p style={{
              fontSize: 8, fontWeight: 800, color: "#bbb", textTransform: "uppercase",
              letterSpacing: "0.15em", margin: "0 0 7px"
            }}>Certifications Required</p>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {buyer.certifications.filter(c => c && c !== "null").map((c, i) =>
                <Badge key={i} label={c} bg="#fff8e1" color="#7a5c00" />
              )}
            </div>
          </div>
        )}

        <div style={{ borderTop: "1px solid #f0ece4" }} />

        {/* Contact details grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {hasEmail && (
            <div style={{
              background: "#f5fbf0", border: "1px solid #d8ecc4", borderRadius: 12,
              padding: "10px 14px", gridColumn: "1/-1"
            }}>
              <p style={{
                fontSize: 8, fontWeight: 800, color: "#5a8a2a", textTransform: "uppercase",
                letterSpacing: "0.1em", margin: "0 0 3px"
              }}>✉️ Email</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#1a3d08", margin: 0, wordBreak: "break-all" }}>
                {buyer.email}
              </p>
            </div>
          )}
          {hasPhone && (
            <div style={{ background: "#f9f9f7", borderRadius: 12, padding: "10px 14px" }}>
              <p style={{
                fontSize: 8, fontWeight: 800, color: "#aaa", textTransform: "uppercase",
                letterSpacing: "0.1em", margin: "0 0 3px"
              }}>📞 Phone</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#333", margin: 0 }}>{buyer.phone}</p>
            </div>
          )}
          {hasVol && (
            <div style={{ background: "#f9f9f7", borderRadius: 12, padding: "10px 14px" }}>
              <p style={{
                fontSize: 8, fontWeight: 800, color: "#aaa", textTransform: "uppercase",
                letterSpacing: "0.1em", margin: "0 0 3px"
              }}>📦 Import Volume</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#333", margin: 0 }}>{buyer.annual_import_volume}</p>
            </div>
          )}
          {hasMOQ && (
            <div style={{ background: "#f9f9f7", borderRadius: 12, padding: "10px 14px" }}>
              <p style={{
                fontSize: 8, fontWeight: 800, color: "#aaa", textTransform: "uppercase",
                letterSpacing: "0.1em", margin: "0 0 3px"
              }}>🔢 Min. Order</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#333", margin: 0 }}>{buyer.min_order}</p>
            </div>
          )}
        </div>

        {/* Approach tip */}
        {hasTip && (
          <div style={{ background: "#fffbf0", border: "1px solid #ffe0a0", borderRadius: 12, padding: "12px 14px" }}>
            <p style={{
              fontSize: 8, fontWeight: 800, color: "#b07d00", textTransform: "uppercase",
              letterSpacing: "0.1em", margin: "0 0 5px"
            }}>💡 Approach Tip</p>
            <p style={{ fontSize: 12, color: "#6b4e00", fontWeight: 500, margin: 0, lineHeight: 1.6 }}>
              {buyer.approach_tip}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
          {hasWebsite && (
            <a href={buyer.website.startsWith("http") ? buyer.website : `https://${buyer.website}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                flex: 1, background: "#1a3d08", color: "#d4b483", padding: "12px 0", borderRadius: 12,
                fontWeight: 800, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em",
                textDecoration: "none", textAlign: "center", display: "block"
              }}>
              🌐 Website
            </a>
          )}
          {hasEmail && (
            <button onClick={() => { navigator.clipboard.writeText(buyer.email); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              style={{
                flex: 1, background: copied ? "#edf7e4" : "#f4f4f0", color: copied ? "#2d5016" : "#555",
                padding: "12px 0", borderRadius: 12, border: "1px solid",
                borderColor: copied ? "#b4d89a" : "#e0dbd2", fontWeight: 800, fontSize: 10,
                textTransform: "uppercase", letterSpacing: "0.12em", cursor: "pointer", transition: "all 0.2s"
              }}>
              {copied ? "✓ Copied!" : "📋 Copy Email"}
            </button>
          )}
          {!hasWebsite && !hasEmail && (
            <div style={{
              flex: 1, background: "#f9f9f7", borderRadius: 12, padding: "12px 0",
              textAlign: "center", fontSize: 10, color: "#bbb", fontWeight: 600
            }}>
              Contact via LinkedIn or trade directories
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MarketOverview({ overview, country }) {
  if (!overview) return null;
  return (
    <div style={{
      background: "linear-gradient(135deg,#1a3d08,#2a5c10)", borderRadius: 28,
      padding: "32px 36px", marginBottom: 28, color: "#fff"
    }}>
      <p style={{
        fontSize: 9, fontWeight: 800, color: "#a8c890", letterSpacing: "0.2em",
        textTransform: "uppercase", margin: "0 0 10px"
      }}>🌍 Market Intelligence — {country}</p>
      {overview.summary && (
        <p style={{ fontSize: 14, color: "#d0e8c0", lineHeight: 1.75, margin: "0 0 20px", fontWeight: 500 }}>
          {overview.summary}
        </p>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: overview.regulations ? 14 : 0 }}>
        {[["Market Size", overview.market_size], ["Growth Rate", overview.growth_rate], ["Best Entry", overview.top_entry]].map(([label, value]) =>
          value && value !== "null" && (
            <div key={label} style={{ background: "rgba(255,255,255,0.09)", borderRadius: 14, padding: "14px 16px" }}>
              <p style={{
                fontSize: 8, color: "#a8c890", fontWeight: 800, textTransform: "uppercase",
                letterSpacing: "0.12em", margin: "0 0 5px"
              }}>{label}</p>
              <p style={{ fontSize: 13, fontWeight: 900, color: "#d4b483", margin: 0, lineHeight: 1.3 }}>{value}</p>
            </div>
          )
        )}
      </div>
      {overview.regulations && overview.regulations !== "null" && (
        <div style={{ background: "rgba(0,0,0,0.18)", borderRadius: 14, padding: "14px 18px" }}>
          <p style={{
            fontSize: 8, color: "#a8c890", fontWeight: 800, textTransform: "uppercase",
            letterSpacing: "0.12em", margin: "0 0 5px"
          }}>📋 Import Regulations</p>
          <p style={{ fontSize: 12, color: "#d0e8c0", margin: 0, lineHeight: 1.7 }}>{overview.regulations}</p>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [country, setCountry] = useState("Netherlands");
  const [isLoading, setIsLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [buyers, setBuyers] = useState([]);
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!country.trim() || isLoading) return;
    setIsLoading(true);
    setBuyers([]);
    setOverview(null);
    setError(null);

    try {
      setLoadMsg("🔍 Searching live trade databases with Gemini 2.0...");
      const data = await findMoringaBuyers(country);
      
      if (!data.buyers || data.buyers.length === 0) {
        throw new Error("No buyer data found for this country.");
      }

      setBuyers(data.buyers);
      setOverview(data.overview || null);

    } catch (err: any) {
      setError(err.message || "Discovery failed.");
    } finally {
      setIsLoading(false);
      setLoadMsg("");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf8", fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin  { to{transform:rotate(360deg)} }
        @keyframes fadeUp{ from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ── Header ── */}
      <header style={{
        background: "rgba(255,255,255,0.93)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid #ede8df", position: "sticky", top: 0, zIndex: 50, padding: "0 40px"
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center",
          justifyContent: "space-between", height: 68
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 42, height: 42, background: "#1a3d08", borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#d4b483", fontWeight: 900, fontSize: 20
            }}>A</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#1a1a1a", lineHeight: 1.2 }}>Andhra Agro</div>
              <div style={{
                fontSize: 8, fontWeight: 700, color: "#5a8a2a", letterSpacing: "0.2em",
                textTransform: "uppercase"
               }}>Premium Moringa Export</div>
            </div>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, fontSize: 9, color: "#aaa",
            fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em"
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%", background: "#4caf50",
              animation: "pulse 2s infinite", display: "inline-block"
            }} />
            Gemini 2.0 Live Search
          </div>
          <button style={{
            background: "#1a3d08", color: "#fff", padding: "9px 22px", borderRadius: 40,
            border: "none", fontSize: 9, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.15em", cursor: "pointer"
          }}>Inquiry</button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ padding: "72px 40px 56px", background: "#fff", borderBottom: "1px solid #ede8df" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", display: "grid",
          gridTemplateColumns: "1fr 420px", gap: 60, alignItems: "center"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ height: 1, width: 28, background: "#2d5016", display: "block" }} />
              <span style={{
                fontSize: 9, fontWeight: 700, color: "#2d5016", letterSpacing: "0.2em",
                textTransform: "uppercase"
              }}>Direct from Vijayawada</span>
            </div>
            <h1 style={{
              fontSize: 68, fontWeight: 900, color: "#1a1a1a", lineHeight: 0.93,
              letterSpacing: "-0.04em", margin: "0 0 24px"
            }}>
              Global <span style={{ color: "#2d5016" }}>Moringa</span><br />
              <span style={{ color: "#d8d4cc" }}>Intelligence.</span>
            </h1>
            <p style={{ fontSize: 16, color: "#888", lineHeight: 1.7, maxWidth: 460, margin: "0 0 32px" }}>
              Free Trade AI discovery tool for Andhra exporters. Find bulk buyers with real-time data scraping powered by Google Gemini.
            </p>
            <a href="#finder" style={{
              display: "inline-block", background: "#1a3d08", color: "#fff",
              padding: "15px 34px", borderRadius: 16, fontWeight: 700, fontSize: 10,
              textTransform: "uppercase", letterSpacing: "0.15em", textDecoration: "none",
              boxShadow: "0 8px 28px rgba(26,61,8,0.3)"
            }}>
              Start Buyer Discovery ↓
            </a>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", inset: -14, background: "#f0f9e8",
              borderRadius: 44, transform: "rotate(-2deg)"
            }} />
            <img src="https://images.unsplash.com/photo-1598346762291-aee88549193f?auto=format&fit=crop&q=80&w=800"
              alt="Moringa leaves"
              style={{
                position: "relative", width: "100%", height: 380, objectFit: "cover",
                borderRadius: 36, boxShadow: "0 20px 56px rgba(0,0,0,0.13)", border: "4px solid #fff"
              }} />
          </div>
        </div>
      </section>

      {/* ── Finder ── */}
      <section id="finder" style={{ padding: "72px 40px", background: "#f8f7f4" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontSize: 48, fontWeight: 900, color: "#1a1a1a",
              letterSpacing: "-0.03em", margin: "0 0 12px"
            }}>
              Target <span style={{ color: "#2d5016" }}>Any Country.</span>
            </h2>
            <p style={{ fontSize: 15, color: "#999", fontWeight: 500, margin: 0 }}>
              Using Gemini 2.0 to scrap real business directories and import records.
            </p>
          </div>

          {/* Country chips */}
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}>
            {COUNTRIES.map(c => (
              <button key={c} onClick={() => setCountry(c)}
                style={{
                  padding: "7px 15px", borderRadius: 20, border: "1.5px solid",
                  borderColor: country === c ? "#2d5016" : "#ddd",
                  background: country === c ? "#2d5016" : "#fff",
                  color: country === c ? "#fff" : "#666",
                  fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.15s"
                }}>
                {c}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div style={{
            background: "#fff", borderRadius: 22, boxShadow: "0 4px 28px rgba(0,0,0,0.07)",
            border: "1px solid #ede8df", marginBottom: 40, display: "flex", gap: 8, padding: 8
          }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 18px", gap: 12 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input type="text" value={country} onChange={e => setCountry(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Type any country name..."
                style={{
                  flex: 1, border: "none", outline: "none", fontSize: 16, fontWeight: 700,
                  color: "#1a1a1a", background: "transparent", padding: "13px 0"
                }} />
            </div>
            <button onClick={handleSearch} disabled={isLoading}
              style={{
                background: isLoading ? "#4a7a18" : "#1a3d08", color: "#d4b483",
                padding: "13px 40px", borderRadius: 16, border: "none", fontWeight: 800,
                fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em",
                cursor: isLoading ? "default" : "pointer", minWidth: 190,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "background 0.2s"
              }}>
              {isLoading
                ? <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>Scraping Market...</>
                : "Locate Buyers"
              }
            </button>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div style={{ textAlign: "center", padding: "56px 0" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%", background: "#edf7e4",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px", fontSize: 26
              }}>🌿</div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#2d5016", margin: "0 0 6px" }}>{loadMsg}</p>
              <p style={{ fontSize: 12, color: "#bbb", margin: 0 }}>Google AI is processing trade records...</p>
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div style={{
              background: "#fff5f5", border: "1px solid #fcc", borderRadius: 18,
              padding: "20px 24px", display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 24
            }}>
              <div style={{
                width: 34, height: 34, background: "#fee", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#c33", fontWeight: 900, fontSize: 15, flexShrink: 0
              }}>!</div>
              <div>
                <p style={{ color: "#c33", fontWeight: 700, fontSize: 13, margin: "0 0 6px" }}>{error}</p>
                <button onClick={handleSearch}
                  style={{
                    fontSize: 11, color: "#c33", background: "#fee", border: "none",
                    borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontWeight: 700
                  }}>
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          {!isLoading && buyers.length > 0 && (
            <div style={{ animation: "fadeUp 0.5s ease both" }}>

              {/* Stats bar */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 24, flexWrap: "wrap", gap: 12
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%", background: "#4caf50",
                    display: "inline-block", animation: "pulse 2s infinite"
                  }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#333" }}>
                    Found <strong style={{ color: "#2d5016" }}>{buyers.length} buyers</strong> in {country}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 7 }}>
                  {buyers.filter(b => b.priority === "High").length > 0 &&
                    <Badge label={`${buyers.filter(b => b.priority === "High").length} High Priority`} bg="#edf7e4" color="#1a5c0a" />}
                </div>
              </div>

              {/* Market overview */}
              <MarketOverview overview={overview} country={country} />

              {/* Buyer cards */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))",
                gap: 22, marginBottom: 28
               }}>
                {buyers.map((b, i) => <BuyerCard key={i} buyer={b} index={i} />)}
              </div>

              {/* Export note */}
              <div style={{
                background: "#fff", border: "1px dashed #c4d8a4", borderRadius: 18,
                padding: "20px 24px", display: "flex", gap: 14, alignItems: "flex-start"
              }}>
                <span style={{ fontSize: 20 }}>📦</span>
                <div>
                  <p style={{
                    fontSize: 10, fontWeight: 800, color: "#2d5016", textTransform: "uppercase",
                    letterSpacing: "0.12em", margin: "0 0 5px"
                  }}>Export Readiness Reminder</p>
                  <p style={{ fontSize: 12.5, color: "#777", margin: 0, lineHeight: 1.7 }}>
                    Before approaching buyers in <strong>{country}</strong>, have ready:&nbsp;
                    <strong>Phytosanitary Certificate (APEDA)</strong>,&nbsp;
                    <strong>FSSAI Export License</strong>, and product lab reports.
                    European buyers typically also require <strong>ISO 22000 or BRC certification</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && buyers.length === 0 && !error && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🌿</div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#ccc", marginBottom: 6 }}>Ready to find buyers</p>
              <p style={{ fontSize: 12, color: "#ddd" }}>
                Select a country above and click "Locate Buyers"
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Products ── */}
      <section style={{ padding: "72px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
            <div>
              <h2 style={{
                fontSize: 40, fontWeight: 900, color: "#1a1a1a", letterSpacing: "-0.03em",
                fontStyle: "italic", margin: "0 0 10px"
              }}>Andhra's Green Gold.</h2>
              <p style={{ fontSize: 14, color: "#aaa", fontWeight: 500 }}>From the nutrient-rich soils of the Krishna River basin.</p>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, color: "#ccc", textTransform: "uppercase", letterSpacing: "0.3em" }}>Export Grade A+++</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28 }}>
            {[
              { name: "Super-Fine Powder", img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=700", use: "Supplements / Smoothies" },
              { name: "Dehydrated Leaves", img: "https://images.unsplash.com/photo-1515471204579-f30b05004e2d?auto=format&fit=crop&q=80&w=700", use: "Tea Infusions" },
              { name: "Virgin Seed Oil", img: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&q=80&w=700", use: "Cosmeceuticals" },
            ].map((p, i) => (
              <div key={i} style={{
                aspectRatio: "4/5", borderRadius: 36, overflow: "hidden",
                position: "relative", boxShadow: "0 10px 36px rgba(0,0,0,0.11)"
              }}>
                <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", bottom: 16, left: 14, right: 14 }}>
                  <div style={{
                    background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)",
                    borderRadius: 16, padding: "12px 16px"
                  }}>
                    <p style={{
                      fontSize: 8, fontWeight: 800, color: "#2d5016", textTransform: "uppercase",
                      letterSpacing: "0.15em", margin: "0 0 3px"
                    }}>{p.use}</p>
                    <h3 style={{ fontSize: 17, fontWeight: 900, color: "#1a1a1a", margin: 0 }}>{p.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#111", padding: "56px 40px", textAlign: "center", color: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            width: 52, height: 52, background: "#1a3d08", borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#d4b483", fontWeight: 900, fontSize: 26, margin: "0 auto 18px"
          }}>A</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.03em", fontStyle: "italic", margin: "0 0 16px" }}>
            Andhra Agro Export Co.
          </h2>
          <div style={{
            display: "flex", justifyContent: "center", gap: 16, marginBottom: 24,
            fontSize: 9, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.2em"
          }}>
            <span>Vijayawada Office</span><span>|</span>
            <span>Vizag Logistics Hub</span><span>|</span>
            <span style={{ color: "#d4b483" }}>trade@andhra-agro.com</span>
          </div>
          <p style={{ fontSize: 8, color: "#333", textTransform: "uppercase", letterSpacing: "0.4em" }}>
            © {new Date().getFullYear()} Modernizing Global Superfood Trade
          </p>
        </div>
      </footer>
    </div>
  );
}
