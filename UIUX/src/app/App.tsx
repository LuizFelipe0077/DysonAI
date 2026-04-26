import { IPhoneFrame } from "./components/IPhoneFrame";
import { ChatApp } from "./components/ChatApp";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 30% 20%, rgba(124,58,237,0.18) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(6,182,212,0.15) 0%, transparent 50%), linear-gradient(135deg, #06040f 0%, #090818 40%, #04101a 100%)",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      {/* Background grid pattern */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* Floating orbs */}
      <div
        style={{
          position: "fixed",
          top: "15%",
          left: "10%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(124,58,237,0.08)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "20%",
          right: "8%",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "rgba(6,182,212,0.08)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Label above phone */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        {/* App label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 30,
            padding: "8px 18px",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#06B6D4",
              boxShadow: "0 0 8px #06B6D4",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 13,
              letterSpacing: "0.05em",
            }}
          >
            DysonAI • Protótipo iPhone 17
          </span>
          <div
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.3))",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: 10,
              padding: "2px 8px",
              color: "#7C3AED",
              fontSize: 11,
            }}
          >
            Alta Fidelidade
          </div>
        </div>

        <IPhoneFrame>
          <ChatApp />
        </IPhoneFrame>

        {/* Reflection effect below phone */}
        <div
          style={{
            width: 280,
            height: 60,
            background: "linear-gradient(180deg, rgba(124,58,237,0.08) 0%, transparent 100%)",
            filter: "blur(20px)",
            borderRadius: "50%",
            marginTop: -30,
          }}
        />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}