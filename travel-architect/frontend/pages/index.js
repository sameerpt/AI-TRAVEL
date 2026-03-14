import { useState, useEffect } from "react";

const TRAVEL_STYLES = [
  "Adventure",
  "Foodie",
  "Cultural",
  "Relaxation",
  "Budget",
  "Luxury",
];

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
    <div className="min-h-screen font-sans bg-[#0a0a0a] text-white selection:bg-[#f0c27f] selection:text-black">
      <div className="fixed inset-0 z-0">
        {BACKGROUNDS.map((bg, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out"
            style={{
              backgroundImage: `url(${bg})`,
              opacity: i === bgIndex ? 1 : 0,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/85" />
      </div>

      <div className="relative z-10 min-h-screen">
        {!itinerary ? (
          /* HERO Section */
          <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
            <span className="inline-block bg-white/15 backdrop-blur-md border border-white/20 px-5 py-2 rounded-full text-xs tracking-widest uppercase mb-6 text-white/90">
              ✈️ AI-Powered Travel Planning
            </span>
            <h1 className="font-serif text-[clamp(3rem,8vw,7rem)] font-black leading-none mb-4 bg-gradient-to-br from-white to-[#f0c27f] bg-clip-text text-transparent">
              Your Journey
              <br />
              Awaits
            </h1>
            <p className="text-lg text-white/70 max-w-md leading-relaxed mb-12 font-light">
              Tell us where you want to go and how you like to travel — we'll
              craft your perfect 3-day adventure.
            </p>

            <div className="bg-white/5 backdrop-blur-xl border border-white/15 rounded-3xl p-8 w-full max-w-2xl">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-[11px] tracking-widest uppercase text-white/50 mb-2 text-left">
                    Destination
                  </label>
                  <input
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3.5 text-white font-sans text-base outline-none transition-all placeholder:text-white/30 focus:border-[#f0c27f] focus:bg-white/15"
                    type="text"
                    placeholder="Paris, Tokyo, Bali..."
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-[11px] tracking-widest uppercase text-white/50 mb-2 text-left">
                    Travel Style
                  </label>
                  <select
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3.5 text-white font-sans text-base outline-none transition-all focus:border-[#f0c27f] focus:bg-white/15 [&>option]:bg-[#1a1a2e] [&>option]:text-white"
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
                className="w-full p-4 bg-gradient-to-br from-[#f0c27f] to-[#e8825a] border-none rounded-xl text-[#1a0a00] font-sans text-base font-semibold cursor-pointer transition-all tracking-wide hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(240,194,127,0.4)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? "Planning your trip..." : "Generate My Itinerary →"}
              </button>

              {error && (
                <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
              )}
            </div>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-24 px-8 text-center min-h-screen">
            <span className="text-7xl animate-[spin_2s_linear_infinite] block mb-6">
              🌍
            </span>
            <p className="font-serif text-3xl text-[#f0c27f] mb-2">
              Crafting your adventure...
            </p>
            <p className="text-white/50 text-sm">
              Our AI is planning the perfect trip for you
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto p-8 pb-24 min-h-screen">
            <div className="text-center mb-12">
              <h2 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-black bg-gradient-to-br from-white to-[#f0c27f] bg-clip-text text-transparent mb-2">
                {itinerary.destination}
              </h2>
              <p className="text-white/50 text-sm tracking-widest uppercase">
                {itinerary.travel_style} Experience · 3 Days · 9 Activities
              </p>
            </div>

            <div className="flex gap-3 mb-8 justify-center flex-wrap">
              {itinerary.days.map((day, i) => (
                <button
                  key={i}
                  className={`px-6 py-2.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-sm font-sans transition-all duration-200 ${
                    activeDay === i
                      ? "bg-gradient-to-br from-[#f0c27f] to-[#e8825a] border-transparent text-[#1a0a00] font-semibold"
                      : "text-white/60 hover:border-[#f0c27f] hover:text-[#f0c27f]"
                  }`}
                  onClick={() => setActiveDay(i)}
                >
                  Day {day.day} — {day.theme}
                </button>
              ))}
            </div>

            {itinerary.days[activeDay] && (
              <>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 mb-6 flex items-center gap-4">
                  <span className="font-serif text-5xl md:text-6xl font-black text-[#f0c27f]/40 leading-none">
                    0{itinerary.days[activeDay].day}
                  </span>
                  <span className="font-serif text-2xl md:text-3xl font-bold text-white">
                    {itinerary.days[activeDay].theme}
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {itinerary.days[activeDay].activities.map((activity, idx) => {
                    const config = TIME_CONFIG[activity.time] || {
                      icon: "📍",
                      color: "#fff",
                    };
                    return (
                      <div
                        key={idx}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 flex gap-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#f0c27f]/30 animate-[fadeUp_0.4s_ease_forwards] opacity-0"
                        style={{ animationDelay: `${(idx + 1) * 0.1}s` }}
                      >
                        <div className="flex flex-col items-center gap-2 min-w-[70px]">
                          <span className="text-3xl md:text-4xl leading-none">
                            {config.icon}
                          </span>
                          <span className="text-[10px] md:text-xs tracking-widest uppercase text-white/40 text-center">
                            {activity.time}
                          </span>
                          {idx < 2 && (
                            <div className="flex-1 w-px bg-white/10 mt-2" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-2">
                            {activity.title}
                          </h3>
                          <p className="text-white/60 text-sm md:text-base leading-relaxed mb-4 font-light">
                            {activity.description}
                          </p>
                          <div className="inline-flex items-start gap-2 bg-[#f0c27f]/10 border border-[#f0c27f]/20 rounded-xl px-3 py-2">
                            <span className="text-[#f0c27f] text-xs md:text-sm font-semibold whitespace-nowrap">
                              💡 Tip
                            </span>
                            <span className="text-white/60 text-xs md:text-sm leading-relaxed">
                              {activity.tips}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <button
              className="block mx-auto mt-12 px-8 py-3 bg-transparent border border-white/20 rounded-full text-white/60 font-sans text-sm cursor-pointer transition-all hover:border-[#f0c27f] hover:text-[#f0c27f]"
              onClick={() => {
                setItinerary(null);
                setDestination("");
              }}
            >
              ← Plan Another Trip
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap");

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
