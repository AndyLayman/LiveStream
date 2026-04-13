"use client";

interface BasesIndicatorProps {
  first: boolean;
  second: boolean;
  third: boolean;
}

export default function BasesIndicator({
  first,
  second,
  third,
}: BasesIndicatorProps) {
  const baseSize = "1.1em";

  return (
    <div
      className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 shadow-2xl"
      style={{ borderRadius: "0.5em", padding: "0.6em" }}
    >
      <div className="flex flex-col items-center" style={{ gap: "0.15em" }}>
        {/* Second base */}
        <div
          className={`rotate-45 border-2 ${
            second
              ? "bg-yellow-400 border-yellow-300"
              : "bg-gray-700 border-gray-600"
          }`}
          style={{ width: baseSize, height: baseSize }}
        />
        {/* First and Third */}
        <div className="flex" style={{ gap: "1em" }}>
          <div
            className={`rotate-45 border-2 ${
              third
                ? "bg-yellow-400 border-yellow-300"
                : "bg-gray-700 border-gray-600"
            }`}
            style={{ width: baseSize, height: baseSize }}
          />
          <div
            className={`rotate-45 border-2 ${
              first
                ? "bg-yellow-400 border-yellow-300"
                : "bg-gray-700 border-gray-600"
            }`}
            style={{ width: baseSize, height: baseSize }}
          />
        </div>
      </div>
    </div>
  );
}
