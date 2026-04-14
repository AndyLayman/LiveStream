"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { SoundHigh, SoundOff } from "iconoir-react/regular";

interface YouTubeEmbedProps {
  videoId: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export default function YouTubeEmbed({ videoId }: YouTubeEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const [muted, setMuted] = useState(true);

  const initPlayer = useCallback(() => {
    if (!containerRef.current || playerRef.current) return;

    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId,
      width: "100%",
      height: "100%",
      playerVars: {
        autoplay: 1,
        mute: 1,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        fs: 0,
        disablekb: 1,
        playsinline: 1,
      },
    });
  }, [videoId]);

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    // Load the API script once
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
    }

    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      initPlayer();
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [initPlayer]);

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (muted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(100);
    } else {
      playerRef.current.mute();
    }
    setMuted(!muted);
  };

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute inset-0" style={{ pointerEvents: "all" }} />
      <button
        onClick={toggleMute}
        className="absolute z-50"
        style={{
          bottom: "1em",
          left: "1em",
          fontSize: "1.2cqw",
          width: "2.5em",
          height: "2.5em",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-full)",
          color: "var(--text)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform var(--duration-fast) var(--ease-spring)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
        title={muted ? "Unmute" : "Mute"}
      >
        {muted ? (
          <SoundOff width="1.2em" height="1.2em" />
        ) : (
          <SoundHigh width="1.2em" height="1.2em" />
        )}
      </button>
    </div>
  );
}
