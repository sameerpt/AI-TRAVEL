import { useState, useEffect } from "react";

const TRAVEL_STYLES = ["Adventure", "Foodie", "Cultural", "Relaxation", "Budget", "Luxury"];

const BACKGROUNDS = [
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80",
  "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1920&q=80",
  "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80",
];

const TIME_CONFIG = {
  Morning: { icon: "🌅", color: "#f59e0b" },
  Afternoon: { icon: "☀️", color: "#ef4444" },
  Evening: { icon: "🌙", color: "#6366f1" },
};

export default function Home() {
  const [destination, setDestination] = useState("");
  const [travelStyle, setTravelStyle] = useState("Adventure");
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bgIndex, setBgIndex] = useState(0);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUNDS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async () => {
    if (!destination.trim()) {
      setError("Please enter a destination.");
      return;
    }
    setLoading(true);
    setError("");
    setItinerary(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/generate-itinerary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, travel_style: travelStyle }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Something went wrong.");
      }
      const data = await res.json();
      setItinerary(data);
      setActiveDay(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #0a0a0a;
          color: #fff;
        }

        .bg-slider {
          position: fixed;
          inset: 0;
          z-index: 0;
        }

        .bg-slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: opacity 1.5s ease;
        }

        .bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.5) 0%,
            rgba(0,0,0,0.3) 40%,
            rgba(0,0,0,0.85) 100%
          );
        }

        .content {
          position: relative;
          z-index: 1;
          min-height: 100vh;
        }

        /* HERO */
        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 2rem;
          text-align: center;
        }

        .badge {
          display: inline-block;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          padding: 0.4rem 1.2rem;
          border-radius: 999px;
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          color: rgba(255,255,255,0.9);
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3rem, 8vw, 7rem);
          font-weight: 900;
          line-height: 1;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #fff 0%, #f0c27f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-sub {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.7);
          max-width: 400px;
          line-height: 1.6;
          margin-bottom: 3rem;
          font-weight: 300;
        }

        /* FORM CARD */
        .form-card {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 24px;
          padding: 2rem;
          width: 100%;
          max-width: 600px;
        }

        .form-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .form-group {
          flex: 1;
          min-width: 180px;
        }

        .form-label {
          display: block;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin-bottom: 0.5rem;
        }

        .form-input, .form-select {
          width: 100%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 0.85rem 1rem;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .form-input::placeholder { color: rgba(255,255,255,0.3); }
        .form-input:focus, .form-select:focus {
          border-color: #f0c27f;
          background: rgba(255,255,255,0.12);
        }

        .form-select option { background: #1a1a2e; color: #fff; }

        .btn-generate {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #f0c27f, #e8825a);
          border: none;
          border-radius: 12px;
          color: #1a0a00;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s, box-shadow 0.2s;
          letter-spacing: 0.03em;
        }

        .btn-generate:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(240,194,127,0.4);
        }

        .btn-generate:disabled { opacity: 0.6; cursor: not-allowed; }

        .error-msg {
          color: #f87171;
          font-size: 0.85rem;
          margin-top: 0.75rem;
          text-align: center;
        }

        /* LOADING */
        .loading-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6rem 2rem;
          text-align: center;
        }

        .globe-spin {
          font-size: 5rem;
          animation: spin 2s linear infinite;
          display: block;
          margin-bottom: 1.5rem;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .loading-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          color: #f0c27f;
          margin-bottom: 0.5rem;
        }

        .loading-sub {
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
        }

        /* ITINERARY SECTION */
        .itinerary-section {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
          padding-bottom: 6rem;
        }

        .itinerary-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .itinerary-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          background: linear-gradient(135deg, #fff, #f0c27f);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .itinerary-meta {
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* DAY TABS */
        .day-tabs {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 2rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .day-tab {
          padding: 0.6rem 1.5rem;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          transition: all 0.2s;
          backdrop-filter: blur(10px);
        }

        .day-tab:hover {
          border-color: #f0c27f;
          color: #f0c27f;
        }

        .day-tab.active {
          background: linear-gradient(135deg, #f0c27f, #e8825a);
          border-color: transparent;
          color: #1a0a00;
          font-weight: 600;
        }

        /* DAY THEME BANNER */
        .day-theme-banner {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 1.5rem 2rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .day-number {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          font-weight: 900;
          color: #f0c27f;
          line-height: 1;
          opacity: 0.4;
        }

        .day-theme-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #fff;
        }

        /* ACTIVITY CARDS */
        .activities-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          gap: 1.5rem;
          transition: transform 0.2s, border-color 0.2s;
          animation: fadeUp 0.4s ease forwards;
          opacity: 0;
        }

        .activity-card:nth-child(1) { animation-delay: 0.1s; }
        .activity-card:nth-child(2) { animation-delay: 0.2s; }
        .activity-card:nth-child(3) { animation-delay: 0.3s; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .activity-card:hover {
          transform: translateY(-3px);
          border-color: rgba(240,194,127,0.3);
        }

        .activity-time-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          min-width: 70px;
        }

        .time-icon {
          font-size: 2rem;
          line-height: 1;
        }

        .time-label {
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          text-align: center;
        }

        .time-line {
          flex: 1;
          width: 1px;
          background: rgba(255,255,255,0.1);
        }

        .activity-body { flex: 1; }

        .activity-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .activity-desc {
          color: rgba(255,255,255,0.6);
          font-size: 0.9rem;
          line-height: 1.7;
          margin-bottom: 0.75rem;
          font-weight: 300;
        }

        .activity-tip {
          display: inline-flex;
          align-items: flex-start;
          gap: 0.5rem;
          background: rgba(240,194,127,0.1);
          border: 1px solid rgba(240,194,127,0.2);
          border-radius: 10px;
          padding: 0.5rem 0.75rem;
        }

        .tip-label {
          color: #f0c27f;
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .tip-text {
          color: rgba(255,255,255,0.6);
          font-size: 0.8rem;
          line-height: 1.5;
        }

        /* RESET BTN */
        .reset-btn {
          display: block;
          margin: 3rem auto 0;
          padding: 0.75rem 2rem;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 999px;
          color: rgba(255,255,255,0.6);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .reset-btn:hover {
          border-color: #f0c27f;
          color: #f0c27f;
        }
      `}</style>

      {/* Animated Background */}
      <div className="bg-slider">
        {BACKGROUNDS.map((bg, i) => (
          <div
            key={i}
            className="bg-slide"
            style={{
              backgroundImage: `url(${bg})`,
              opacity: i === bgIndex ? 1 : 0,
            }}
          />
        ))}
        <div className="bg-overlay" />
      </div>

      <div className="content">
        {/* HERO + FORM */}
        {!itinerary && (
          <div className="hero">
            <span className="badge">✈️ AI-Powered Travel Planning</span>
            <h1 className="hero-title">Your Journey<br />Awaits</h1>
            <p className="hero-sub">
              Tell us where you want to go and how you like to travel —
              we'll craft your perfect 3-day adventure.
            </p>

            <div className="form-card">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Destination</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Paris, Tokyo, Bali..."
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Travel Style</label>
                  <select
                    className="form-select"
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                  >
                    {TRAVEL_STYLES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                className="btn-generate"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? "Planning your trip..." : "Generate My Itinerary →"}
              </button>

              {error && <p className="error-msg">{error}</p>}
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="loading-section">
            <span className="globe-spin">🌍</span>
            <p className="loading-text">Crafting your adventure...</p>
            <p className="loading-sub">Our AI is planning the perfect trip for you</p>
          </div>
        )}

        {/* ITINERARY */}
        {itinerary && !loading && (
          <div className="itinerary-section">
            <div className="itinerary-header">
              <h2 className="itinerary-title">{itinerary.destination}</h2>
              <p className="itinerary-meta">
                {itinerary.travel_style} Experience · 3 Days · 9 Activities
              </p>
            </div>

            {/* Day Tabs */}
            <div className="day-tabs">
              {itinerary.days.map((day, i) => (
                <button
                  key={i}
                  className={`day-tab ${activeDay === i ? "active" : ""}`}
                  onClick={() => setActiveDay(i)}
                >
                  Day {day.day} — {day.theme}
                </button>
              ))}
            </div>

            {/* Active Day */}
            {itinerary.days[activeDay] && (
              <>
                <div className="day-theme-banner">
                  <span className="day-number">0{itinerary.days[activeDay].day}</span>
                  <span className="day-theme-text">{itinerary.days[activeDay].theme}</span>
                </div>

                <div className="activities-grid">
                  {itinerary.days[activeDay].activities.map((activity, idx) => {
                    const config = TIME_CONFIG[activity.time] || { icon: "📍", color: "#fff" };
                    return (
                      <div key={idx} className="activity-card">
                        <div className="activity-time-col">
                          <span className="time-icon">{config.icon}</span>
                          <span className="time-label">{activity.time}</span>
                          {idx < 2 && <div className="time-line" />}
                        </div>
                        <div className="activity-body">
                          <h3 className="activity-title">{activity.title}</h3>
                          <p className="activity-desc">{activity.description}</p>
                          <div className="activity-tip">
                            <span className="tip-label">💡 Tip</span>
                            <span className="tip-text">{activity.tips}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <button
              className="reset-btn"
              onClick={() => { setItinerary(null); setDestination(""); }}
            >
              ← Plan Another Trip
            </button>
          </div>
        )}
      </div>
    </>
  );
}
