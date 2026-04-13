"use client";

interface InningTrackerProps {
  currentInning: number;
  isTopInning: boolean;
  totalInnings?: number;
}

export default function InningTracker({
  currentInning,
  isTopInning,
  totalInnings = 9,
}: InningTrackerProps) {
  return (
    <div
      className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 shadow-2xl"
      style={{ borderRadius: "0.5em", padding: "0.5em 1em" }}
    >
      <div className="flex items-center" style={{ gap: "0.8em" }}>
        {/* Inning arrow */}
        <div className="flex flex-col items-center" style={{ gap: "0.1em", marginRight: "0.2em" }}>
          <span
            className={isTopInning ? "text-white" : "text-gray-600"}
            style={{ fontSize: "0.55em", lineHeight: 1 }}
          >
            &#9650;
          </span>
          <span className="font-bold text-white" style={{ fontSize: "1.2em", lineHeight: 1 }}>
            {currentInning}
          </span>
          <span
            className={!isTopInning ? "text-white" : "text-gray-600"}
            style={{ fontSize: "0.55em", lineHeight: 1 }}
          >
            &#9660;
          </span>
        </div>

        {/* Inning dots */}
        <div style={{ display: "flex", gap: "0.3em" }}>
          {Array.from({ length: totalInnings }, (_, i) => i + 1).map(
            (inning) => (
              <div
                key={inning}
                className={`rounded-full ${
                  inning < currentInning
                    ? "bg-blue-500"
                    : inning === currentInning
                      ? "bg-white"
                      : "bg-gray-600"
                }`}
                style={{ width: "0.5em", height: "0.5em" }}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
