import React from "react";

interface IPhoneFrameProps {
  children: React.ReactNode;
}

export function IPhoneFrame({ children }: IPhoneFrameProps) {
  return (
    <div className="relative flex items-center justify-center" style={{ minHeight: "100vh" }}>
      {/* Outer frame */}
      <div
        style={{
          width: 393,
          height: 852,
          borderRadius: 55,
          background: "linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 40%, #111114 100%)",
          boxShadow:
            "0 0 0 1px #3a3a3e, 0 0 0 2px #111, inset 0 0 0 1px rgba(255,255,255,0.08), 0 40px 80px rgba(0,0,0,0.6), 0 20px 40px rgba(0,0,0,0.4)",
          position: "relative",
          flexShrink: 0,
        }}
      >
        {/* Left side buttons - Volume Up */}
        <div
          style={{
            position: "absolute",
            left: -3,
            top: 140,
            width: 4,
            height: 36,
            borderRadius: "2px 0 0 2px",
            background: "linear-gradient(180deg, #3a3a3e, #2a2a2e)",
            boxShadow: "-2px 0 4px rgba(0,0,0,0.5)",
          }}
        />
        {/* Left side buttons - Volume Down */}
        <div
          style={{
            position: "absolute",
            left: -3,
            top: 188,
            width: 4,
            height: 36,
            borderRadius: "2px 0 0 2px",
            background: "linear-gradient(180deg, #3a3a3e, #2a2a2e)",
            boxShadow: "-2px 0 4px rgba(0,0,0,0.5)",
          }}
        />
        {/* Left side buttons - Mute */}
        <div
          style={{
            position: "absolute",
            left: -3,
            top: 100,
            width: 4,
            height: 28,
            borderRadius: "2px 0 0 2px",
            background: "linear-gradient(180deg, #3a3a3e, #2a2a2e)",
            boxShadow: "-2px 0 4px rgba(0,0,0,0.5)",
          }}
        />
        {/* Right side button - Power */}
        <div
          style={{
            position: "absolute",
            right: -3,
            top: 160,
            width: 4,
            height: 72,
            borderRadius: "0 2px 2px 0",
            background: "linear-gradient(180deg, #3a3a3e, #2a2a2e)",
            boxShadow: "2px 0 4px rgba(0,0,0,0.5)",
          }}
        />

        {/* Screen area */}
        <div
          style={{
            position: "absolute",
            inset: 10,
            borderRadius: 46,
            overflow: "hidden",
            background: "#0a0a14",
          }}
        >
          {/* Screen inner border glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 46,
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
              zIndex: 10,
              pointerEvents: "none",
            }}
          />

          {/* Dynamic Island */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              width: 120,
              height: 34,
              background: "#000",
              borderRadius: 20,
              zIndex: 20,
              boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 2px 8px rgba(0,0,0,0.8)",
            }}
          />

          {/* App content */}
          <div style={{ width: "100%", height: "100%", position: "relative", zIndex: 5 }}>
            {children}
          </div>
        </div>

        {/* Bottom home indicator area */}
        <div
          style={{
            position: "absolute",
            bottom: 18,
            left: "50%",
            transform: "translateX(-50%)",
            width: 130,
            height: 5,
            background: "rgba(255,255,255,0.3)",
            borderRadius: 3,
          }}
        />

        {/* USB-C port */}
        <div
          style={{
            position: "absolute",
            bottom: -2,
            left: "50%",
            transform: "translateX(-50%)",
            width: 60,
            height: 6,
            background: "#1a1a1e",
            borderRadius: "0 0 4px 4px",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.8)",
          }}
        />
      </div>
    </div>
  );
}
