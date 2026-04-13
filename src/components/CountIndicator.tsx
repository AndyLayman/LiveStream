"use client";

interface CountIndicatorProps {
  balls: number;
  strikes: number;
  outs: number;
}

export default function CountIndicator({
  balls,
  strikes,
  outs,
}: CountIndicatorProps) {
  const dotSize = "0.8em";

  return (
    <div
      className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 shadow-2xl"
      style={{ borderRadius: "0.5em", padding: "0.5em 1em" }}
    >
      <div className="font-semibold" style={{ display: "flex", gap: "1.5em", fontSize: "0.7em" }}>
        {/* Balls */}
        <div className="flex items-center" style={{ gap: "0.4em" }}>
          <span className="text-gray-400 uppercase tracking-wider">B</span>
          <div style={{ display: "flex", gap: "0.25em" }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`rounded-full border ${
                  i < balls
                    ? "bg-green-500 border-green-400"
                    : "bg-gray-700 border-gray-600"
                }`}
                style={{ width: dotSize, height: dotSize }}
              />
            ))}
          </div>
        </div>

        {/* Strikes */}
        <div className="flex items-center" style={{ gap: "0.4em" }}>
          <span className="text-gray-400 uppercase tracking-wider">S</span>
          <div style={{ display: "flex", gap: "0.25em" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`rounded-full border ${
                  i < strikes
                    ? "bg-red-500 border-red-400"
                    : "bg-gray-700 border-gray-600"
                }`}
                style={{ width: dotSize, height: dotSize }}
              />
            ))}
          </div>
        </div>

        {/* Outs */}
        <div className="flex items-center" style={{ gap: "0.4em" }}>
          <span className="text-gray-400 uppercase tracking-wider">O</span>
          <div style={{ display: "flex", gap: "0.25em" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`rounded-full border ${
                  i < outs
                    ? "bg-yellow-500 border-yellow-400"
                    : "bg-gray-700 border-gray-600"
                }`}
                style={{ width: dotSize, height: dotSize }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
