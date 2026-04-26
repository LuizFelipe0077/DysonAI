import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Sparkles,
  Mic,
  Paperclip,
  Zap,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Wallet,
  TrendingUp,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  Bluetooth,
  Server,
  Settings,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Shield,
  Cpu,
  Network,
  Radio,
  ToggleLeft,
  ToggleRight,
  Wifi,
  WifiOff,
  AlertCircle,
  Plus,
  Search,
  ScanLine,
  Repeat2,
  ChevronDown,
  Menu,
  Trash2,
  MessageSquare,
  Check,
} from "lucide-react";

// ─────────────── TYPES ───────────────
type ModelType = "DysonAI" | "DysonLoc";
type BankTab = "saldo" | "transferencia" | "extrato";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  cost?: number;
  tokens?: number;
}

interface Conversation {
  id: string;
  title: string;
  date: string;
  model: ModelType;
  messageCount: number;
}

// ─────────────── CONSTANTS ───────────────
const DYSONAI_INITIAL: Message[] = [
  {
    id: "init-1",
    role: "assistant",
    content:
      "Olá! Eu sou **Dyson**, uma IA Generativa e estou aqui para te Auxiliar! qual a dúvida de Hoje? 🚀\n\nSeu saldo atual é **247,50 DTC** • DysonTokenCoin.",
    timestamp: "09:41",
    cost: 0,
    tokens: 0,
  },
];

const DYSONLOC_INITIAL: Message[] = [
  {
    id: "loc-init-1",
    role: "assistant",
    content:
      "**DysonLoc** ativo no modo intranet 🔵\n\nConecte seu dispositivo via Bluetooth para iniciar a sessão no **Node local**. Após conectado, posso processar suas consultas com total privacidade na sua rede.",
    timestamp: "09:41",
    cost: 0,
    tokens: 0,
  },
];

const EXTRATO_DATA = [
  { id: 1, type: "out", desc: "Chat DysonAI — Consulta", value: 3.5, date: "Hoje, 09:38", icon: "ai" },
  { id: 2, type: "in", desc: "Recarga via Pix", value: 50, date: "Hoje, 08:10", icon: "wallet" },
  { id: 3, type: "out", desc: "Chat DysonAI — Análise", value: 5.0, date: "Ontem, 22:15", icon: "ai" },
  { id: 4, type: "out", desc: "Geração de Imagem", value: 10, date: "Ontem, 20:00", icon: "ai" },
  { id: 5, type: "in", desc: "Bônus de Indicação", value: 15, date: "21/03, 14:30", icon: "gift" },
  { id: 6, type: "out", desc: "Chat DysonAI — Suporte", value: 1.5, date: "20/03, 11:00", icon: "ai" },
  { id: 7, type: "in", desc: "Recarga Automática", value: 100, date: "18/03, 00:00", icon: "wallet" },
];

const MOCK_CONVERSATIONS: Conversation[] = [
  { id: "c1", title: "Análise Financeira Q1 2026", date: "Hoje, 09:15", model: "DysonAI", messageCount: 12 },
  { id: "c2", title: "Configuração Node Local", date: "Hoje, 08:30", model: "DysonLoc", messageCount: 8 },
  { id: "c3", title: "Otimização de Código Python", date: "Ontem, 22:10", model: "DysonAI", messageCount: 24 },
  { id: "c4", title: "Segurança em Blockchain", date: "Ontem, 18:45", model: "DysonAI", messageCount: 15 },
  { id: "c5", title: "Setup Intranet", date: "21/03, 14:20", model: "DysonLoc", messageCount: 6 },
  { id: "c6", title: "Estratégias de Marketing Digital", date: "20/03, 16:30", model: "DysonAI", messageCount: 18 },
  { id: "c7", title: "Deploy de Aplicação", date: "19/03, 10:00", model: "DysonAI", messageCount: 10 },
];

const AI_RESPONSES = [
  "Entendi! Vou analisar sua pergunta com atenção.\n\n**📌 Análise DysonAI:**\nCom base no contexto apresentado, identifico alguns pontos relevantes:\n\n• **Primeiro aspecto** — requer atenção imediata\n• **Segundo aspecto** — pode ser otimizado\n• **Terceira perspectiva** — traz novas possibilidades\n\nGostaria que eu aprofundasse algum ponto específico?",
  "Ótima pergunta! Aqui está minha análise completa:\n\n**🔍 Visão Dyson:**\nEste tema envolve múltiplas dimensões. Vamos explorar cada uma:\n\n• **Dimensão técnica** — precisão é fundamental\n• **Dimensão prática** — foco na aplicação real\n• **Resultado esperado** — melhora significativa de 40–60%\n\nPosso detalhar qualquer ponto! 🚀",
  "Perfeito! Vou te explicar de forma clara e objetiva:\n\n**💡 Resposta Dyson:**\nO sucesso nessa área depende de três pilares: **planejamento**, **execução** e **análise contínua**.\n\nCada etapa tem seu peso. O mais importante é manter consistência — resultados aparecem com o tempo.\n\nAlguma dúvida adicional? Estou aqui! ✅",
  "Excelente! Aqui vai minha perspectiva:\n\n**🎯 DysonAI Insights:**\nBaseado em milhões de dados analisados, posso afirmar que sua abordagem está no caminho certo.\n\n**Recomendações:**\n• Mantenha foco nos objetivos principais\n• Itere rapidamente e aprenda com os resultados\n• Use dados para embasar decisões\n\nContinue! Você está indo muito bem. 💪",
];

// ─────────────── SUB-COMPONENTS ───────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4 px-4">
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 0 12px rgba(124,58,237,0.4)",
        }}
      >
        <Sparkles size={14} color="white" />
      </div>
      <div
        style={{
          background: "rgba(124,58,237,0.12)",
          border: "1px solid rgba(124,58,237,0.28)",
          borderRadius: "18px 18px 18px 4px",
          padding: "12px 16px",
          display: "flex",
          gap: 5,
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message, showCostPerInput }: { message: Message; showCostPerInput: boolean }) {
  const isUser = message.role === "user";
  const [liked, setLiked] = useState<null | "up" | "down">(null);

  const formatContent = (text: string) =>
    text.split("\n").map((line, i, arr) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j} style={{ color: "#06B6D4", fontWeight: 600 }}>
                {part.slice(2, -2)}
              </strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
          {i < arr.length - 1 && <br />}
        </span>
      );
    });

  return (
    <div className={`flex items-end gap-2 mb-4 px-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && (
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 0 10px rgba(124,58,237,0.35)",
          }}
        >
          <Sparkles size={13} color="white" />
        </div>
      )}
      <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: 4 }}>
        <div
          style={
            isUser
              ? {
                  background: "linear-gradient(135deg, #0891B2, #06B6D4)",
                  borderRadius: "18px 18px 4px 18px",
                  padding: "10px 14px",
                  boxShadow: "0 4px 16px rgba(6,182,212,0.28)",
                }
              : {
                  background: "rgba(124,58,237,0.11)",
                  border: "1px solid rgba(124,58,237,0.22)",
                  borderRadius: "18px 18px 18px 4px",
                  padding: "12px 14px",
                  backdropFilter: "blur(10px)",
                }
          }
        >
          <p style={{ color: isUser ? "#fff" : "rgba(255,255,255,0.9)", fontSize: 13, lineHeight: 1.55, margin: 0 }}>
            {formatContent(message.content)}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            justifyContent: isUser ? "flex-end" : "flex-start",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 10 }}>{message.timestamp}</span>
          {!isUser && showCostPerInput && message.cost !== undefined && message.cost > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                background: "rgba(6,182,212,0.1)",
                border: "1px solid rgba(6,182,212,0.18)",
                borderRadius: 20,
                padding: "2px 7px",
              }}
            >
              <Zap size={9} color="#06B6D4" />
              <span style={{ color: "#06B6D4", fontSize: 10 }}>{message.cost.toFixed(1)} DTC</span>
            </div>
          )}
          {!isUser && (
            <div style={{ display: "flex", gap: 2 }}>
              {[
                { icon: ThumbsUp, action: "up" as const },
                { icon: ThumbsDown, action: "down" as const },
              ].map(({ icon: Icon, action }) => (
                <button
                  key={action}
                  onClick={() => setLiked(liked === action ? null : action)}
                  style={{
                    background: liked === action ? "rgba(6,182,212,0.12)" : "transparent",
                    border: "none",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Icon size={10} color={liked === action ? "#06B6D4" : "rgba(255,255,255,0.25)"} />
                </button>
              ))}
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Copy size={10} color="rgba(255,255,255,0.25)" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────── HISTORY & SETTINGS PANEL ───────────────
function HistoryPanel({
  activeModel,
  showBalance,
  setShowBalance,
  showCostPerInput,
  setShowCostPerInput,
}: {
  activeModel: ModelType;
  showBalance: boolean;
  setShowBalance: (val: boolean) => void;
  showCostPerInput: boolean;
  setShowCostPerInput: (val: boolean) => void;
}) {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedConvIds, setSelectedConvIds] = useState<Set<string>>(new Set());
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  const filteredConvs = conversations.filter((c) => c.model === activeModel);

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedConvIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedConvIds(newSet);
  };

  const selectAll = () => {
    if (selectedConvIds.size === filteredConvs.length) {
      setSelectedConvIds(new Set());
    } else {
      setSelectedConvIds(new Set(filteredConvs.map((c) => c.id)));
    }
  };

  const handleDelete = () => {
    setConversations((prev) => prev.filter((c) => !selectedConvIds.has(c.id)));
    setSelectedConvIds(new Set());
    setIsDeleteMode(false);
    setDeleted(true);
    setTimeout(() => setDeleted(false), 2000);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #0a0a20 0%, #08091c 100%)",
      }}
    >
      {/* Header */}
      <div style={{ padding: "12px 20px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 14 }}>
          <MessageSquare size={13} color="rgba(255,255,255,0.5)" />
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Histórico de Conversas</p>
        </div>
      </div>

      {deleted && (
        <div
          style={{
            margin: "0 20px 12px",
            background: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: 14,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <CheckCircle2 size={16} color="#22c55e" />
          <span style={{ color: "#22c55e", fontSize: 12 }}>
            {selectedConvIds.size} conversação(ões) deletada(s)!
          </span>
        </div>
      )}

      {/* Conversations List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px", scrollbarWidth: "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>HISTÓRICO</p>
          <div style={{ display: "flex", gap: 6 }}>
            {isDeleteMode && (
              <button
                onClick={selectAll}
                style={{
                  background: "rgba(124,58,237,0.1)",
                  border: "1px solid rgba(124,58,237,0.25)",
                  borderRadius: 20,
                  padding: "4px 10px",
                  color: "#a78bfa",
                  fontSize: 10,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Check size={10} />
                {selectedConvIds.size === filteredConvs.length ? "Desmarcar" : "Marcar todos"}
              </button>
            )}
            <button
              onClick={() => {
                setIsDeleteMode(!isDeleteMode);
                setSelectedConvIds(new Set());
              }}
              style={{
                background: isDeleteMode ? "rgba(239,68,68,0.15)" : "rgba(124,58,237,0.1)",
                border: `1px solid ${isDeleteMode ? "rgba(239,68,68,0.3)" : "rgba(124,58,237,0.2)"}`,
                borderRadius: 20,
                padding: "4px 10px",
                color: isDeleteMode ? "#f87171" : "#a78bfa",
                fontSize: 10,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Trash2 size={10} />
              {isDeleteMode ? "Cancelar" : "Deletar"}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredConvs.length === 0 ? (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "rgba(255,255,255,0.3)",
                fontSize: 12,
              }}
            >
              Nenhuma conversação encontrada.
            </div>
          ) : (
            filteredConvs.map((conv) => {
              const isSelected = selectedConvIds.has(conv.id);
              return (
                <div
                  key={conv.id}
                  onClick={() => isDeleteMode && toggleSelect(conv.id)}
                  style={{
                    background: isSelected
                      ? "rgba(239,68,68,0.12)"
                      : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isSelected ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: 14,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: isDeleteMode ? "pointer" : "default",
                    transition: "all 0.2s",
                  }}
                >
                  {isDeleteMode && (
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        border: `2px solid ${isSelected ? "#f87171" : "rgba(255,255,255,0.2)"}`,
                        background: isSelected ? "#f87171" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {isSelected && <Check size={12} color="white" />}
                    </div>
                  )}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      background:
                        conv.model === "DysonAI"
                          ? "linear-gradient(135deg, #7C3AED, #06B6D4)"
                          : "linear-gradient(135deg, #06B6D4, #0891B2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {conv.model === "DysonAI" ? (
                      <Sparkles size={14} color="white" />
                    ) : (
                      <Bluetooth size={14} color="white" />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.85)",
                        fontSize: 12.5,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginBottom: 2,
                      }}
                    >
                      {conv.title}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 10 }}>{conv.date}</span>
                      <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10 }}>•</span>
                      <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 10 }}>
                        {conv.messageCount} msgs
                      </span>
                    </div>
                  </div>
                  {!isDeleteMode && <ChevronRight size={14} color="rgba(255,255,255,0.2)" />}
                </div>
              );
            })
          )}
        </div>

        {isDeleteMode && selectedConvIds.size > 0 && (
          <button
            onClick={handleDelete}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              border: "none",
              borderRadius: 14,
              padding: "14px",
              marginTop: 14,
              color: "#fff",
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 4px 20px rgba(239,68,68,0.3)",
            }}
          >
            <Trash2 size={15} />
            Deletar {selectedConvIds.size} selecionada(s)
          </button>
        )}
      </div>

      {/* Settings Section */}
      <div
        style={{
          padding: "16px 20px 24px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setSettingsExpanded(!settingsExpanded)}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            marginBottom: settingsExpanded ? 12 : 0,
          }}
        >
          <Settings size={14} color="#7C3AED" />
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Configurações</p>
          <ChevronRight
            size={14}
            color="rgba(255,255,255,0.3)"
            style={{
              marginLeft: "auto",
              transform: settingsExpanded ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </button>

        {settingsExpanded && (
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {[
              {
                label: "Visualizar saldo do banco",
                value: showBalance,
                set: setShowBalance,
                show: activeModel === "DysonAI",
              },
              {
                label: "Mostrar consumo por input",
                value: showCostPerInput,
                set: setShowCostPerInput,
                show: activeModel === "DysonAI",
              },
            ]
              .filter((item) => item.show)
              .map(({ label, value, set }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: 12,
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12.5 }}>{label}</span>
                  <button
                    onClick={() => set(!value)}
                    style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    {value ? (
                      <ToggleRight size={26} color="#06B6D4" />
                    ) : (
                      <ToggleLeft size={26} color="rgba(255,255,255,0.2)" />
                    )}
                  </button>
                </div>
              ))}

            {/* Linked account - only for DysonAI */}
            {activeModel === "DysonAI" && (
              <div style={{ paddingTop: 4 }}>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, marginBottom: 10 }}>
                  CONTA VINCULADA
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: "#8a05be",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Wallet size={14} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#fff", fontSize: 12.5 }}>NUBANK S.A.</p>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>Ag: 0001 • CC: ••••4521</p>
                  </div>
                  <ChevronRight size={14} color="rgba(255,255,255,0.2)" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────── BANK PANEL ───────────────
function BankPanel({ balance, showBalance }: { balance: number; showBalance: boolean }) {
  const [tab, setTab] = useState<BankTab>("saldo");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferred, setTransferred] = useState(false);

  const handleTransfer = () => {
    if (transferAmount && transferTo) {
      setTransferred(true);
      setTimeout(() => setTransferred(false), 2500);
      setTransferAmount("");
      setTransferTo("");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #08081e 0%, #0a0818 100%)",
      }}
    >
      {/* Bank Header */}
      <div
        style={{
          padding: "14px 20px 0",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, marginTop: 14 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Wallet size={16} color="white" />
          </div>
          <div>
            <p style={{ color: "#fff", fontSize: 15 }}>Dyson Bank</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>DysonTokenCoin • DTC</p>
          </div>
          <div
            style={{
              marginLeft: "auto",
              background: "rgba(6,182,212,0.1)",
              border: "1px solid rgba(6,182,212,0.2)",
              borderRadius: 20,
              padding: "3px 10px",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22d3ee" }} />
            <span style={{ color: "#06B6D4", fontSize: 11 }}>Online</span>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.05)",
            borderRadius: 14,
            padding: 3,
            gap: 2,
            marginBottom: 16,
          }}
        >
          {(["saldo", "transferencia", "extrato"] as BankTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: "7px 4px",
                borderRadius: 11,
                border: "none",
                background:
                  tab === t
                    ? "linear-gradient(135deg, rgba(124,58,237,0.7), rgba(6,182,212,0.5))"
                    : "transparent",
                color: tab === t ? "#fff" : "rgba(255,255,255,0.4)",
                fontSize: 11.5,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {t === "saldo" ? "Saldo" : t === "transferencia" ? "Transferir" : "Extrato"}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 24px", scrollbarWidth: "none" }}>
        {/* ── SALDO ── */}
        {tab === "saldo" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Balance card */}
            {showBalance && (
              <div
                style={{
                  background: "linear-gradient(135deg, #5B21B6 0%, #0E7490 100%)",
                  borderRadius: 22,
                  padding: 20,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -40,
                    right: -40,
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.06)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: -30,
                    left: -20,
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.04)",
                  }}
                />
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, marginBottom: 6 }}>
                  Saldo disponível
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                  <span style={{ color: "#22d3ee", fontSize: 13 }}>DTC</span>
                  <span style={{ color: "#fff", fontSize: 38, fontWeight: 700, lineHeight: 1 }}>
                    {Math.floor(balance).toLocaleString("pt-BR")}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 22 }}>
                    ,{String(balance.toFixed(2)).split(".")[1]}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 20 }}>
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10 }}>Valor em R$</p>
                    <p style={{ color: "#fff", fontSize: 13 }}>
                      R$ {(balance * 0.2).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10 }}>Gasto hoje</p>
                    <p style={{ color: "#22d3ee", fontSize: 13 }}>5,50 DTC</p>
                  </div>
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10 }}>Limite diário</p>
                    <p style={{ color: "#a78bfa", fontSize: 13 }}>500 DTC</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { icon: TrendingUp, label: "Recarregar", color: "#7C3AED" },
                { icon: Repeat2, label: "Converter", color: "#06B6D4" },
                { icon: Shield, label: "Segurança", color: "#a78bfa" },
                { icon: Zap, label: "Planos Pro", color: "#22d3ee" },
              ].map(({ icon: Icon, label, color }) => (
                <button
                  key={label}
                  style={{
                    background: `rgba(${color === "#7C3AED" ? "124,58,237" : color === "#06B6D4" ? "6,182,212" : color === "#a78bfa" ? "167,139,250" : "34,211,238"},0.1)`,
                    border: `1px solid ${color}30`,
                    borderRadius: 16,
                    padding: "14px 10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                  }}
                >
                  <Icon size={20} color={color} />
                  <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>{label}</span>
                </button>
              ))}
            </div>

            {/* Account info */}
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: "14px 16px",
              }}
            >
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 10 }}>
                CONTA VINCULADA
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Wallet size={16} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#fff", fontSize: 13 }}>NUBANK S.A.</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Ag: 0001 • CC: ••••4521</p>
                </div>
                <ChevronRight size={16} color="rgba(255,255,255,0.25)" />
              </div>
            </div>
          </div>
        )}

        {/* ── TRANSFERÊNCIA ── */}
        {tab === "transferencia" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {transferred && (
              <div
                style={{
                  background: "rgba(34,197,94,0.15)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  borderRadius: 14,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <CheckCircle2 size={18} color="#22c55e" />
                <span style={{ color: "#22c55e", fontSize: 13 }}>Transferência realizada com sucesso!</span>
              </div>
            )}

            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>NOVA TRANSFERÊNCIA</p>

              <div>
                <label style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, display: "block", marginBottom: 6 }}>
                  Destinatário / ID Dyson
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "rgba(124,58,237,0.1)",
                    border: "1px solid rgba(124,58,237,0.25)",
                    borderRadius: 12,
                    padding: "10px 14px",
                  }}
                >
                  <Search size={14} color="rgba(255,255,255,0.3)" />
                  <input
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                    placeholder="@usuario ou ID"
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "rgba(255,255,255,0.85)",
                      fontSize: 13,
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, display: "block", marginBottom: 6 }}>
                  Valor em DTC
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "rgba(6,182,212,0.08)",
                    border: "1px solid rgba(6,182,212,0.22)",
                    borderRadius: 12,
                    padding: "10px 14px",
                  }}
                >
                  <span style={{ color: "#06B6D4", fontSize: 14 }}>DTC</span>
                  <input
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="0,00"
                    type="number"
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "#fff",
                      fontSize: 18,
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, display: "block", marginBottom: 8 }}>
                  Transferência rápida
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["10", "25", "50", "100"].map((v) => (
                    <button
                      key={v}
                      onClick={() => setTransferAmount(v)}
                      style={{
                        flex: 1,
                        background: transferAmount === v ? "rgba(124,58,237,0.35)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${transferAmount === v ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.08)"}`,
                        borderRadius: 10,
                        padding: "8px 4px",
                        color: transferAmount === v ? "#a78bfa" : "rgba(255,255,255,0.5)",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleTransfer}
                style={{
                  width: "100%",
                  background:
                    transferAmount && transferTo
                      ? "linear-gradient(135deg, #7C3AED, #06B6D4)"
                      : "rgba(255,255,255,0.06)",
                  border: "none",
                  borderRadius: 14,
                  padding: "14px",
                  color: transferAmount && transferTo ? "#fff" : "rgba(255,255,255,0.25)",
                  fontSize: 14,
                  cursor: transferAmount && transferTo ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.2s",
                  boxShadow:
                    transferAmount && transferTo ? "0 4px 20px rgba(124,58,237,0.3)" : "none",
                }}
              >
                <Zap size={15} />
                Transferir DTC
              </button>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <AlertCircle size={14} color="rgba(255,255,255,0.3)" />
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                Transferências entre usuários Dyson são instantâneas e sem taxas.
              </span>
            </div>
          </div>
        )}

        {/* ── EXTRATO ── */}
        {tab === "extrato" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>ÚLTIMAS TRANSAÇÕES</p>
              <button
                style={{
                  background: "rgba(124,58,237,0.1)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  borderRadius: 20,
                  padding: "4px 10px",
                  color: "#a78bfa",
                  fontSize: 10,
                  cursor: "pointer",
                }}
              >
                Filtrar
              </button>
            </div>

            {EXTRATO_DATA.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 14,
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    background:
                      item.type === "in"
                        ? "rgba(34,197,94,0.15)"
                        : "rgba(239,68,68,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.type === "in" ? (
                    <ArrowDownLeft size={16} color="#22c55e" />
                  ) : (
                    <ArrowUpRight size={16} color="#f87171" />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      fontSize: 12.5,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.desc}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                    <Clock size={9} color="rgba(255,255,255,0.25)" />
                    <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 10 }}>{item.date}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p
                    style={{
                      color: item.type === "in" ? "#22c55e" : "#f87171",
                      fontSize: 13,
                    }}
                  >
                    {item.type === "in" ? "+" : "-"}
                    {item.value.toFixed(2)} DTC
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────── NODE SETTINGS PANEL ───────────────
function NodePanel() {
  const [btConnected, setBtConnected] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [nodeIP, setNodeIP] = useState("192.168.1.105");
  const [nodePort, setNodePort] = useState("8472");
  const [autoReconnect, setAutoReconnect] = useState(true);
  const [encryptTunnel, setEncryptTunnel] = useState(true);

  const devices = [
    { id: "d1", name: "DysonNode-Alpha", mac: "A4:C1:38:9F:2B:01", signal: 90 },
    { id: "d2", name: "DysonNode-Beta", mac: "A4:C1:38:9F:2B:02", signal: 72 },
    { id: "d3", name: "IntraNet-Gateway", mac: "D8:3B:DA:4C:EE:10", signal: 55 },
  ];

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 2500);
  };

  const handleConnect = (id: string) => {
    setSelectedDevice(id);
    setTimeout(() => setBtConnected(true), 1000);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #060818 0%, #080d18 100%)",
        overflowY: "auto",
        scrollbarWidth: "none",
      }}
    >
      <div style={{ padding: "14px 20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              background: btConnected
                ? "linear-gradient(135deg, #06B6D4, #0891B2)"
                : "rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: btConnected ? "0 0 16px rgba(6,182,212,0.4)" : "none",
              transition: "all 0.3s",
            }}
          >
            <Bluetooth size={16} color={btConnected ? "white" : "rgba(255,255,255,0.4)"} />
          </div>
          <div>
            <p style={{ color: "#fff", fontSize: 15 }}>Dyson Node</p>
            <p style={{ color: btConnected ? "#06B6D4" : "rgba(255,255,255,0.35)", fontSize: 11 }}>
              {btConnected ? `Conectado • ${devices.find((d) => d.id === selectedDevice)?.name}` : "Desconectado"}
            </p>
          </div>
          {btConnected && (
            <div
              style={{
                marginLeft: "auto",
                background: "rgba(6,182,212,0.12)",
                border: "1px solid rgba(6,182,212,0.25)",
                borderRadius: 20,
                padding: "3px 10px",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#06B6D4",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
              <span style={{ color: "#06B6D4", fontSize: 11 }}>Ativo</span>
            </div>
          )}
        </div>

        {/* Node status card */}
        <div
          style={{
            background: btConnected
              ? "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(8,145,178,0.1))"
              : "rgba(255,255,255,0.04)",
            border: `1px solid ${btConnected ? "rgba(6,182,212,0.3)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 18,
            padding: 16,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { icon: Cpu, label: "Processador", value: btConnected ? "ARM Cortex-A72" : "—" },
              { icon: Network, label: "Intranet", value: btConnected ? "192.168.1.x/24" : "—" },
              { icon: Server, label: "Node ID", value: btConnected ? "DYS-4A2F" : "—" },
              { icon: Shield, label: "Criptografia", value: btConnected ? "AES-256" : "—" },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                style={{
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: 12,
                  padding: "10px 12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <Icon size={12} color={btConnected ? "#06B6D4" : "rgba(255,255,255,0.25)"} />
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>{label}</span>
                </div>
                <p style={{ color: btConnected ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.2)", fontSize: 11.5 }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bluetooth scan */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 18,
            padding: "14px 16px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <ScanLine size={14} color="#7C3AED" />
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Dispositivos Bluetooth</p>
            </div>
            <button
              onClick={handleScan}
              style={{
                background: scanning ? "rgba(124,58,237,0.2)" : "rgba(124,58,237,0.1)",
                border: "1px solid rgba(124,58,237,0.3)",
                borderRadius: 20,
                padding: "4px 12px",
                color: "#a78bfa",
                fontSize: 11,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Radio
                size={10}
                color="#a78bfa"
                style={{ animation: scanning ? "spin 1s linear infinite" : "none" }}
              />
              {scanning ? "Buscando..." : "Buscar"}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {devices.map((device) => {
              const isConnected = btConnected && selectedDevice === device.id;
              const isConnecting = selectedDevice === device.id && !btConnected;
              return (
                <div
                  key={device.id}
                  style={{
                    background: isConnected
                      ? "rgba(6,182,212,0.1)"
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isConnected ? "rgba(6,182,212,0.25)" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: 12,
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 10,
                      background: isConnected ? "rgba(6,182,212,0.2)" : "rgba(255,255,255,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Bluetooth size={14} color={isConnected ? "#06B6D4" : "rgba(255,255,255,0.3)"} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: isConnected ? "#06B6D4" : "rgba(255,255,255,0.8)", fontSize: 12.5 }}>
                      {device.name}
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 10 }}>{device.mac}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {/* Signal bars */}
                    <div style={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
                      {[30, 50, 70, 90].map((threshold, i) => (
                        <div
                          key={i}
                          style={{
                            width: 3,
                            height: 4 + i * 2,
                            borderRadius: 1,
                            background:
                              device.signal >= threshold
                                ? isConnected
                                  ? "#06B6D4"
                                  : "#7C3AED"
                                : "rgba(255,255,255,0.1)",
                          }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => !btConnected && handleConnect(device.id)}
                      style={{
                        background: isConnected
                          ? "rgba(239,68,68,0.15)"
                          : "rgba(124,58,237,0.15)",
                        border: `1px solid ${isConnected ? "rgba(239,68,68,0.3)" : "rgba(124,58,237,0.3)"}`,
                        borderRadius: 10,
                        padding: "4px 10px",
                        color: isConnected ? "#f87171" : "#a78bfa",
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                    >
                      {isConnected ? "Desvincular" : isConnecting ? "..." : "Conectar"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Network config */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 18,
            padding: "14px 16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <Settings size={13} color="#7C3AED" />
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Configuração do Node</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <label style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, display: "block", marginBottom: 5 }}>
                IP DO NODE LOCAL
              </label>
              <div
                style={{
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  borderRadius: 10,
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Network size={13} color="#7C3AED" />
                <input
                  value={nodeIP}
                  onChange={(e) => setNodeIP(e.target.value)}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 13,
                    fontFamily: "monospace",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, display: "block", marginBottom: 5 }}>
                PORTA
              </label>
              <div
                style={{
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid rgba(6,182,212,0.2)",
                  borderRadius: 10,
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Server size={13} color="#06B6D4" />
                <input
                  value={nodePort}
                  onChange={(e) => setNodePort(e.target.value)}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 13,
                    fontFamily: "monospace",
                  }}
                />
              </div>
            </div>

            {[
              { label: "Reconexão automática", value: autoReconnect, set: setAutoReconnect },
              { label: "Túnel criptografado", value: encryptTunnel, set: setEncryptTunnel },
            ].map(({ label, value, set }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12.5 }}>{label}</span>
                <button
                  onClick={() => set(!value)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                >
                  {value ? (
                    <ToggleRight size={26} color="#06B6D4" />
                  ) : (
                    <ToggleLeft size={26} color="rgba(255,255,255,0.2)" />
                  )}
                </button>
              </div>
            ))}

            <button
              style={{
                width: "100%",
                background: btConnected
                  ? "linear-gradient(135deg, #0891B2, #06B6D4)"
                  : "rgba(255,255,255,0.06)",
                border: "none",
                borderRadius: 14,
                padding: "13px",
                color: btConnected ? "#fff" : "rgba(255,255,255,0.25)",
                fontSize: 13,
                cursor: btConnected ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: btConnected ? "0 4px 16px rgba(6,182,212,0.25)" : "none",
              }}
            >
              <Wifi size={15} />
              {btConnected ? "Aplicar Configurações" : "Conecte um Node primeiro"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────── MAIN CHAT APP ───────────────
export function ChatApp() {
  const [activeModel, setActiveModel] = useState<ModelType>("DysonAI");
  const [dysonAIMessages, setDysonAIMessages] = useState<Message[]>(DYSONAI_INITIAL);
  const [dysonLocMessages, setDysonLocMessages] = useState<Message[]>(DYSONLOC_INITIAL);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [balance, setBalance] = useState(247.5);
  const [showBalance, setShowBalance] = useState(false);
  const [showCostPerInput, setShowCostPerInput] = useState(false);
  const [currentPanel, setCurrentPanel] = useState(1); // 0=history, 1=chat, 2=bank/node
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [btActive, setBtActive] = useState(false);

  const messages = activeModel === "DysonAI" ? dysonAIMessages : dysonLocMessages;
  const setMessages = activeModel === "DysonAI" ? setDysonAIMessages : setDysonLocMessages;

  // Swipe handling
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, [messages, isTyping]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
      // Swipe left: move to next panel
      if (deltaX < 0) {
        if (currentPanel === 0) setCurrentPanel(1);
        else if (currentPanel === 1) setCurrentPanel(2);
      }
      // Swipe right: move to previous panel
      if (deltaX > 0) {
        if (currentPanel === 2) setCurrentPanel(1);
        else if (currentPanel === 1) setCurrentPanel(0);
      }
    }
  };

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    const cost = parseFloat((Math.random() * 2.5 + 0.5).toFixed(1));
    const tokens = Math.floor(Math.random() * 400 + 100);

    setTimeout(() => {
      let responseContent: string;
      if (!hasInteracted && activeModel === "DysonAI") {
        responseContent =
          "Olá, eu sou **Dyson** uma IA Generativa e Estou aqui para te Auxiliar! qual a dúvida de Hoje? 💡\n\nPode me perguntar sobre qualquer assunto — finanças, tecnologia, ciência, código, criatividade e muito mais!";
        setHasInteracted(true);
      } else {
        responseContent = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        cost,
        tokens,
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (activeModel === "DysonAI") {
        setBalance((prev) => parseFloat((prev - cost).toFixed(2)));
      }
      setIsTyping(false);
    }, 2000);
  };

  const swipeHintColor =
    activeModel === "DysonAI" ? "rgba(6,182,212,0.6)" : "rgba(6,182,212,0.6)";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #09091e 0%, #0c0a1e 50%, #080c1c 100%)",
        borderRadius: 46,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Ambient glows */}
      <div style={{ position: "absolute", top: -60, left: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(124,58,237,0.1)", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 160, right: -30, width: 150, height: 150, borderRadius: "50%", background: "rgba(6,182,212,0.07)", filter: "blur(50px)", pointerEvents: "none" }} />

      {/* ── STATUS BAR ── */}
      <div style={{ paddingTop: 14, paddingBottom: 4, paddingLeft: 24, paddingRight: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, zIndex: 10 }}>
        <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 600 }}>9:41</span>
        <div style={{ width: 120 }} />
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
            {[3, 5, 7, 9].map((h, i) => (
              <div key={i} style={{ width: 3, height: h, borderRadius: 1, background: i < 3 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)" }} />
            ))}
          </div>
          <Wifi size={14} color="rgba(255,255,255,0.85)" />
          <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
            <div style={{ width: 24, height: 12, border: "1px solid rgba(255,255,255,0.5)", borderRadius: 3, padding: 1.5 }}>
              <div style={{ width: "75%", height: "100%", background: "#34d399", borderRadius: 2 }} />
            </div>
            <div style={{ width: 2, height: 5, background: "rgba(255,255,255,0.4)", borderRadius: "0 1px 1px 0" }} />
          </div>
        </div>
      </div>

      {/* ── HEADER ── */}
      <div
        style={{
          padding: "15px 14px 10px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          flexShrink: 0,
          zIndex: 10,
          position: "relative",
        }}
      >
        {/* Model selector + History link (left side) */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 3 }}>
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(124,58,237,0.13)",
              border: "1px solid rgba(124,58,237,0.28)",
              borderRadius: 22,
              padding: "5px 10px 5px 7px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: activeModel === "DysonAI"
                  ? "linear-gradient(135deg, #7C3AED, #06B6D4)"
                  : "linear-gradient(135deg, #06B6D4, #0891B2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {activeModel === "DysonAI" ? (
                <Sparkles size={10} color="white" />
              ) : (
                <Bluetooth size={10} color="white" />
              )}
            </div>
            <span style={{ color: "#fff", fontSize: 12.5 }}>{activeModel}</span>
            <ChevronDown size={11} color="rgba(255,255,255,0.4)" />
          </button>
         
          {showModelDropdown && (
            <>
              <div
                style={{ position: "fixed", inset: 0, zIndex: 45,}}
                onClick={() => setShowModelDropdown(false)}
              />
              <div
                style={{
                  position: "absolute",
                  top: 38,
                  left: 0,
                  background: "#131330",
                  border: "1px solid rgba(124,58,237,0.3)",
                  borderRadius: 16,
                  overflow: "hidden",
                  zIndex: 50,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                  minWidth: 180,
                }}
              >
                {(["DysonAI", "DysonLoc"] as ModelType[]).map((model) => (
                  <button
                    key={model}
                    onClick={() => {
                      setActiveModel(model);
                      setShowModelDropdown(false);
                      setCurrentPanel(1);
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: activeModel === model ? "rgba(124,58,237,0.2)" : "transparent",
                      border: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      color: "rgba(255,255,255,0.85)",
                      fontSize: 13,
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 9,
                        background:
                          model === "DysonAI"
                            ? "linear-gradient(135deg, #7C3AED, #06B6D4)"
                            : "linear-gradient(135deg, #06B6D4, #0891B2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {model === "DysonAI" ? (
                        <Sparkles size={12} color="white" />
                      ) : (
                        <Bluetooth size={12} color="white" />
                      )}
                    </div>
                    <div>
                      <p style={{ color: activeModel === model ? "#a78bfa" : "rgba(255,255,255,0.85)", fontSize: 10 }}>
                        {model}
                      </p>
                      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>
                        {model === "DysonAI" ? "IA Global • Rede" : "IA Local • Intranet"}
                      </p>
                    </div>
                    {activeModel === model && (
                      <div style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: "#7C3AED" }} />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Center logo */}
        <div style={{ display: "inline-block", flexDirection: "column", alignItems: "center", marginTop: 2, padding: "0px 0px 0px 46px" }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 11,
              background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 18px rgba(124,58,237,0.35)",
            }}
          >
            <Sparkles size={16} color="white" />
          </div>
        </div>

        {/* Right side — balance (DysonAI) or Bluetooth (DysonLoc) */}
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6, marginTop: 3 }}>
          {activeModel === "DysonAI" ? (
            showBalance ? (
              <>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", padding: 2 }}
                >
                  <EyeOff size={11} color="rgba(255,255,255,0.25)" />
                </button>
                <button
                  onClick={() => setCurrentPanel(currentPanel === 2 ? 1 : 2)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: currentPanel === 2
                      ? "linear-gradient(135deg, rgba(6,182,212,0.3), rgba(124,58,237,0.3))"
                      : "linear-gradient(135deg, rgba(6,182,212,0.12), rgba(124,58,237,0.12))",
                    border: "1px solid rgba(6,182,212,0.28)",
                    borderRadius: 22,
                    padding: "5px 10px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <Zap size={11} color="#06B6D4" />
                  <span style={{ color: "#06B6D4", fontSize: 12.5, fontWeight: 600 }}>
                    {balance.toFixed(2)} DTC
                  </span>
                  <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.12)" }} />
                  <Wallet size={10} color="rgba(255,255,255,0.4)" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setCurrentPanel(currentPanel === 2 ? 1 : 2)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: currentPanel === 2
                    ? "rgba(124,58,237,0.2)"
                    : "rgba(255,255,255,0.05)",
                  border: `1px solid ${currentPanel === 2 ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.08)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <Wallet size={15} color={currentPanel === 2 ? "#a78bfa" : "rgba(255,255,255,0.5)"} />
              </button>
            )
          ) : (
            <button
              onClick={() => {
                setBtActive(!btActive);
                setCurrentPanel(currentPanel === 2 ? 1 : 2);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: btActive
                  ? "rgba(6,182,212,0.2)"
                  : "rgba(255,255,255,0.06)",
                border: `1px solid ${btActive ? "rgba(6,182,212,0.4)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 22,
                padding: "5px 12px",
                cursor: "pointer",
                transition: "all 0.3s",
                boxShadow: btActive ? "0 0 12px rgba(6,182,212,0.25)" : "none",
              }}
            >
              <Bluetooth size={14} color={btActive ? "#06B6D4" : "rgba(255,255,255,0.4)"} />
              <span style={{ color: btActive ? "#06B6D4" : "rgba(255,255,255,0.4)", fontSize: 12 }}>
                {btActive ? "Conectado" : "Node Local"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ── PANEL INDICATOR ── */}
      <div style={{ display: "flex", justifyContent: "center", gap: 5, paddingTop: 6, paddingBottom: 2, flexShrink: 0, zIndex: 10 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            onClick={() => setCurrentPanel(i as 0 | 1 | 2)}
            style={{
              width: currentPanel === i ? 20 : 6,
              height: 4,
              borderRadius: 2,
              background:
                currentPanel === i
                  ? "linear-gradient(90deg, #7C3AED, #06B6D4)"
                  : "rgba(255,255,255,0.12)",
              transition: "all 0.3s",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      {/* ── SWIPEABLE CONTAINER ── */}
      <div
        style={{ flex: 1, overflow: "hidden", position: "relative" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          style={{
            display: "flex",
            width: "300%",
            height: "100%",
            transform: `translateX(${currentPanel === 0 ? "0%" : currentPanel === 1 ? "-33.333%" : "-66.666%"})`,
            transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* ── PANEL 0: HISTORY ── */}
          <div style={{ width: "33.333%", height: "100%", position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: 6,
                right: 12,
                zIndex: 20,
                display: "flex",
                alignItems: "center",
                gap: 4,
                cursor: "pointer",
              }}
              onClick={() => setCurrentPanel(1)}
            >
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>Chat</span>
              <ChevronRight size={13} color="rgba(255,255,255,0.35)" />
            </div>
            <HistoryPanel
              activeModel={activeModel}
              showBalance={showBalance}
              setShowBalance={setShowBalance}
              showCostPerInput={showCostPerInput}
              setShowCostPerInput={setShowCostPerInput}
            />
          </div>
                
          {/* ── PANEL 1: CHAT ── */}
          <div
            style={{
              width: "33.333%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >

            {/* History link */}
          <button
            onClick={() => setCurrentPanel(currentPanel === 0 ? 1 : 0)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0px 8px",
            }}
          >
            <ChevronLeft size={10} color="rgba(255,255,255,0.25)" />
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 10 }}>Histórico</span>
          </button>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", paddingTop: 4, paddingBottom: 8, scrollbarWidth: "none" }}>
              {/* Date separator */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 24px", marginBottom: 16 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 10 }}>
                  {activeModel === "DysonAI" ? "DysonAI • Hoje" : "DysonLoc • Hoje"}
                </span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
              </div>

              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} showCostPerInput={showCostPerInput} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Swipe hint */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 5,
                padding: "2px 0 4px",
                opacity: 0.55,
              }}
            >
              <ChevronLeft size={11} color={swipeHintColor} />
              <span style={{ color: swipeHintColor, fontSize: 10 }}>
                Histórico
              </span>
              <span style={{ color: swipeHintColor, fontSize: 10 }}>•</span>
              <span style={{ color: swipeHintColor, fontSize: 10 }}>
                {activeModel === "DysonAI" ? "Dyson Bank" : "Node Local"}
              </span>
              <ChevronLeft size={11} color={swipeHintColor} style={{ transform: "rotate(180deg)" }} />
            </div>

            {/* Suggested prompts */}
            {messages.length <= 2 && !isTyping && (
              <div style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 6, display: "flex", gap: 7, overflowX: "auto", scrollbarWidth: "none", flexShrink: 0 }}>
                {(activeModel === "DysonAI"
                  ? ["💡 O que posso perguntar?", "📈 Análise financeira", "🤖 Como funciona o DTC?"]
                  : ["🔵 Conectar Node", "⚙️ Configurar intranet", "🔐 Segurança local"]
                ).map((s) => (
                  <button
                    key={s}
                    onClick={() => setInputValue(s.split(" ").slice(1).join(" "))}
                    style={{
                      flexShrink: 0,
                      background: "rgba(124,58,237,0.1)",
                      border: "1px solid rgba(124,58,237,0.2)",
                      borderRadius: 20,
                      padding: "6px 12px",
                      color: "rgba(255,255,255,0.65)",
                      fontSize: 11.5,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div
              style={{
                padding: "8px 12px 22px",
                flexShrink: 0,
                borderTop: "1px solid rgba(255,255,255,0.04)",
                background: "rgba(9,9,30,0.85)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 7,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(124,58,237,0.22)",
                  borderRadius: 26,
                  padding: "6px 8px 8px 14px",
                }}
              >
                <button style={{ background: "transparent", border: "none", width: 30, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                  <Paperclip size={17} color="rgba(255,255,255,0.25)" />
                </button>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={
                    activeModel === "DysonAI"
                      ? "Pergunte para Dyson..."
                      : "Consultar Node local..."
                  }
                  rows={1}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "rgba(255,255,255,0.88)",
                    fontSize: 13.5,
                    resize: "none",
                    maxHeight: 90,
                    lineHeight: 2.5,
                    paddingTop: 3,
                  }}
                />
                <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
                  {!inputValue && (
                    <button style={{ background: "transparent", border: "none", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <Mic size={17} color="rgba(255,255,255,0.3)" />
                    </button>
                  )}
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isTyping}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background:
                        inputValue.trim() && !isTyping
                          ? "linear-gradient(135deg, #7C3AED, #06B6D4)"
                          : "rgba(255,255,255,0.08)",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: inputValue.trim() && !isTyping ? "pointer" : "default",
                      transition: "all 0.2s",
                      boxShadow: inputValue.trim() && !isTyping ? "0 0 14px rgba(124,58,237,0.38)" : "none",
                    }}
                  >
                    {isTyping ? (
                      <RefreshCw size={14} color="rgba(255,255,255,0.4)" style={{ animation: "spin 1s linear infinite" }} />
                    ) : (
                      <Send size={14} color={inputValue.trim() ? "white" : "rgba(255,255,255,0.25)"} />
                    )}
                  </button>
                </div>
              </div>
              {showCostPerInput && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 6, gap: 4 }}>
                  <Zap size={9} color="rgba(255,255,255,0.15)" />
                  <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10 }}>
                    {activeModel === "DysonAI" ? "~0.5–3 DTC por resposta" : "Processamento local • Grátis"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── PANEL 2: BANK or NODE ── */}
          <div style={{ width: "33.333%", height: "100%", position: "relative"}}>
            {/* Back hint */}
            <div
              style={{
                position: "absolute",
                top: 6,
                left: 12,
                zIndex: 20,
                display: "flex",
                alignItems: "center",
                gap: 4,
                cursor: "pointer",
              }}
              onClick={() => setCurrentPanel(1)}
            >
              <ChevronLeft size={13} color="rgba(255,255,255,0.35)" />
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11}}>Chat</span>
            </div>

            {activeModel === "DysonAI" ? (
              <BankPanel balance={balance} showBalance={showBalance} />
            ) : (
              <NodePanel />
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        textarea::placeholder { color: rgba(255,255,255,0.22); }
        input::placeholder { color: rgba(255,255,255,0.22); }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
