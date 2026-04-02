"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Step {
  id: string;
  label: string;
  desc: string;
  slug: string;
  section: "setup" | "networking" | "automation";
}

const steps: Step[] = [
  { id: "1", label: "CI/CD → GHCR", desc: "Build & push Docker images", slug: "01-cicd-ghcr", section: "setup" },
  { id: "2", label: "VPS Base Setup", desc: "SSH, updates, firewall", slug: "02-vps-setup", section: "setup" },
  { id: "3", label: "Docker & GHCR", desc: "Install Docker, auth GHCR", slug: "03-docker-ghcr", section: "setup" },
  { id: "4", label: "Run Containers", desc: "Env file, compose, run", slug: "04-run-containers", section: "setup" },
  { id: "5", label: "Nginx Proxy", desc: "Reverse proxy config", slug: "05-nginx", section: "networking" },
  { id: "6", label: "SSL / Certbot", desc: "HTTPS & auto-renewal", slug: "06-ssl", section: "networking" },
  { id: "7", label: "DNS Setup", desc: "Cloudflare, A records", slug: "07-dns", section: "networking" },
  { id: "8", label: "Auto-Deploy", desc: "SSH redeploy on push", slug: "08-auto-deploy", section: "automation" },
  { id: "9", label: "Ops & Maintenance", desc: "Rollback, logs, cleanup", slug: "09-operations", section: "automation" },
];

const sectionMeta = {
  setup: { color: "#34d399", bg: "#059669", darkBg: "#064e3b", label: "Setup", glowColor: "#34d39940" },
  networking: { color: "#a78bfa", bg: "#7c3aed", darkBg: "#4c1d95", label: "Networking", glowColor: "#a78bfa40" },
  automation: { color: "#fbbf24", bg: "#d97706", darkBg: "#78350f", label: "Automation", glowColor: "#fbbf2440" },
};

const NODE_W = 200;
const NODE_H = 62;
const GAP_Y = 22;
const COL_GAP = 60;
const HEADER_H = 36;

function getColumns() {
  const sections: ("setup" | "networking" | "automation")[] = ["setup", "networking", "automation"];
  return sections.map((s) => ({
    section: s,
    meta: sectionMeta[s],
    steps: steps.filter((st) => st.section === s),
  }));
}

export function DeploymentMindmap() {
  const router = useRouter();
  const columns = getColumns();
  const [visible, setVisible] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Layout
  const totalW = columns.length * NODE_W + (columns.length - 1) * COL_GAP;
  const rootW = 220;
  const rootH = 50;
  const rootY = 20;
  const rootCx = totalW / 2;
  const colTopY = rootY + rootH + 60;

  const maxRows = Math.max(...columns.map((c) => c.steps.length));
  const totalH = colTopY + HEADER_H + 10 + maxRows * (NODE_H + GAP_Y) + 30;

  const colXs = columns.map((_, i) => i * (NODE_W + COL_GAP));

  // Flatten all nodes with a global index for stagger delay
  let globalIdx = 0;
  const nodeDelays: Record<string, number> = {};
  columns.forEach((col) => {
    col.steps.forEach((step) => {
      nodeDelays[step.id] = globalIdx++;
    });
  });
  const totalNodes = globalIdx;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        overflowX: "auto",
        borderRadius: 12,
        border: "1px solid #27272a",
        background: "#0a0a0b",
        position: "relative",
      }}
    >
      <svg
        viewBox={`-20 0 ${totalW + 40} ${totalH}`}
        style={{ width: "100%", height: "auto", minHeight: 500, display: "block" }}
      >
        <defs>
          {/* Dot pattern */}
          <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.8" fill="#27272a" />
          </pattern>

          {/* Root gradient with animation */}
          <linearGradient id="rootGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563eb">
              <animate attributeName="stopColor" values="#2563eb;#6366f1;#2563eb" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#4338ca">
              <animate attributeName="stopColor" values="#4338ca;#7c3aed;#4338ca" dur="4s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          {/* Root glow filter */}
          <filter id="rootGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Node glow filters per section */}
          {(["setup", "networking", "automation"] as const).map((s) => (
            <filter key={s} id={`glow-${s}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}

          {/* Animated dash for flowing edges */}
          {(["setup", "networking", "automation"] as const).map((s) => (
            <linearGradient key={`grad-${s}`} id={`edgeGrad-${s}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={sectionMeta[s].color} stopOpacity={0.8} />
              <stop offset="100%" stopColor={sectionMeta[s].color} stopOpacity={0.3} />
            </linearGradient>
          ))}

          {/* Shimmer gradient for root */}
          <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="-1 0"
              to="1 0"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect x="-20" y="0" width={totalW + 40} height={totalH} fill="url(#dots)" />

        {/* === ROOT NODE === */}
        <g
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-15px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          {/* Ambient glow behind root */}
          <ellipse
            cx={rootCx}
            cy={rootY + rootH / 2}
            rx={rootW / 2 + 20}
            ry={rootH / 2 + 15}
            fill="#3b82f6"
            opacity={0.08}
          >
            <animate attributeName="opacity" values="0.06;0.12;0.06" dur="3s" repeatCount="indefinite" />
          </ellipse>

          <rect
            x={rootCx - rootW / 2}
            y={rootY}
            width={rootW}
            height={rootH}
            rx={14}
            fill="url(#rootGrad)"
            stroke="#60a5fa60"
            strokeWidth={1.5}
          />

          {/* Shimmer overlay */}
          <rect
            x={rootCx - rootW / 2}
            y={rootY}
            width={rootW}
            height={rootH}
            rx={14}
            fill="url(#shimmer)"
          />

          <text
            x={rootCx}
            y={rootY + rootH / 2 + 1}
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontSize={15}
            fontWeight={700}
            fontFamily="system-ui, sans-serif"
          >
            VPS Deploy Guide
          </text>
        </g>

        {/* === BRANCH LINES FROM ROOT === */}
        {colXs.map((cx, i) => {
          const col = columns[i];
          const midX = cx + NODE_W / 2;
          const startY = rootY + rootH;
          const endY = colTopY + HEADER_H + 10;
          const midY = startY + (endY - startY) * 0.5;
          const pathD = `M ${rootCx} ${startY} C ${rootCx} ${midY}, ${midX} ${midY}, ${midX} ${endY}`;

          return (
            <g
              key={`root-line-${i}`}
              style={{
                opacity: visible ? 1 : 0,
                transition: `opacity 0.8s ease-out ${0.3 + i * 0.15}s`,
              }}
            >
              {/* Static faint line */}
              <path
                d={pathD}
                fill="none"
                stroke={col.meta.color}
                strokeWidth={2}
                opacity={0.2}
              />
              {/* Animated flowing particle */}
              <circle r="3" fill={col.meta.color} opacity={0.8}>
                <animateMotion dur={`${2 + i * 0.3}s`} repeatCount="indefinite" path={pathD} />
                <animate attributeName="opacity" values="0;0.9;0" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}

        {/* === COLUMNS === */}
        {columns.map((col, ci) => {
          const cx = colXs[ci];
          const midX = cx + NODE_W / 2;

          return (
            <g key={col.section}>
              {/* Section label */}
              <text
                x={midX}
                y={colTopY + HEADER_H / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill={col.meta.color}
                fontSize={10}
                fontWeight={700}
                letterSpacing="0.15em"
                opacity={0.6}
                fontFamily="system-ui, sans-serif"
                style={{
                  opacity: visible ? 0.6 : 0,
                  transition: `opacity 0.5s ease-out ${0.5 + ci * 0.1}s`,
                }}
              >
                {col.meta.label.toUpperCase()}
              </text>

              {/* Step nodes */}
              {col.steps.map((step, si) => {
                const ny = colTopY + HEADER_H + 10 + si * (NODE_H + GAP_Y);
                const delay = 0.3 + nodeDelays[step.id] * 0.08;
                const isHovered = hoveredNode === step.id;

                return (
                  <g
                    key={step.id}
                    style={{
                      cursor: "pointer",
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(12px)",
                      transition: `opacity 0.5s ease-out ${delay}s, transform 0.5s ease-out ${delay}s`,
                    }}
                    onClick={() => router.push(`/docs/${step.slug}`)}
                    onMouseEnter={() => setHoveredNode(step.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Vertical connector to next node */}
                    {si < col.steps.length - 1 && (
                      <g>
                        <line
                          x1={midX}
                          y1={ny + NODE_H}
                          x2={midX}
                          y2={ny + NODE_H + GAP_Y}
                          stroke={col.meta.color}
                          strokeWidth={2}
                          opacity={0.2}
                        />
                        {/* Flowing dot on vertical connector */}
                        <circle r="2" fill={col.meta.color} opacity={0.7}>
                          <animate
                            attributeName="cy"
                            from={ny + NODE_H}
                            to={ny + NODE_H + GAP_Y}
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0;0.8;0"
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                          <animate attributeName="cx" values={`${midX};${midX}`} dur="1.5s" repeatCount="indefinite" />
                        </circle>
                      </g>
                    )}

                    {/* Hover glow */}
                    {isHovered && (
                      <rect
                        x={cx - 4}
                        y={ny - 4}
                        width={NODE_W + 8}
                        height={NODE_H + 8}
                        rx={12}
                        fill="none"
                        stroke={col.meta.color}
                        strokeWidth={1.5}
                        opacity={0.4}
                        filter={`url(#glow-${col.section})`}
                      />
                    )}

                    {/* Node bg */}
                    <rect
                      x={cx}
                      y={ny}
                      width={NODE_W}
                      height={NODE_H}
                      rx={10}
                      fill={col.meta.darkBg}
                      stroke={col.meta.color}
                      strokeWidth={isHovered ? 1.5 : 1}
                      opacity={isHovered ? 1 : 0.9}
                      style={{ transition: "stroke-width 0.2s, opacity 0.2s" }}
                    />

                    {/* Subtle inner highlight on hover */}
                    {isHovered && (
                      <rect
                        x={cx}
                        y={ny}
                        width={NODE_W}
                        height={NODE_H}
                        rx={10}
                        fill="rgba(255,255,255,0.04)"
                      />
                    )}

                    {/* Step number badge */}
                    <circle
                      cx={cx + 22}
                      cy={ny + NODE_H / 2}
                      r={12}
                      fill={col.meta.bg}
                      opacity={isHovered ? 0.7 : 0.5}
                      style={{ transition: "opacity 0.2s" }}
                    />
                    <text
                      x={cx + 22}
                      y={ny + NODE_H / 2 + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      fontSize={11}
                      fontWeight={700}
                      fontFamily="monospace"
                    >
                      {step.id}
                    </text>

                    {/* Label */}
                    <text
                      x={cx + 42}
                      y={ny + 23}
                      fill="white"
                      fontSize={12.5}
                      fontWeight={600}
                      fontFamily="system-ui, sans-serif"
                    >
                      {step.label}
                    </text>

                    {/* Description */}
                    <text
                      x={cx + 42}
                      y={ny + 42}
                      fill={isHovered ? "#d4d4d8" : "#a1a1aa"}
                      fontSize={10}
                      fontFamily="system-ui, sans-serif"
                      style={{ transition: "fill 0.2s" }}
                    >
                      {step.desc}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* === CROSS-BRANCH DASHED CONNECTORS === */}
        {(() => {
          const setupLastY = colTopY + HEADER_H + 10 + 3 * (NODE_H + GAP_Y) + NODE_H / 2;
          const netFirstY = colTopY + HEADER_H + 10 + NODE_H / 2;
          const netLastY = colTopY + HEADER_H + 10 + 2 * (NODE_H + GAP_Y) + NODE_H / 2;
          const autoFirstY = colTopY + HEADER_H + 10 + NODE_H / 2;

          const setupRight = colXs[0] + NODE_W;
          const netLeft = colXs[1];
          const netRight = colXs[1] + NODE_W;
          const autoLeft = colXs[2];

          const path1 = `M ${setupRight} ${setupLastY} C ${setupRight + 30} ${setupLastY}, ${netLeft - 30} ${netFirstY}, ${netLeft} ${netFirstY}`;
          const path2 = `M ${netRight} ${netLastY} C ${netRight + 30} ${netLastY}, ${autoLeft - 30} ${autoFirstY}, ${autoLeft} ${autoFirstY}`;

          return (
            <g
              style={{
                opacity: visible ? 1 : 0,
                transition: `opacity 1s ease-out ${0.3 + totalNodes * 0.08 + 0.2}s`,
              }}
            >
              {/* Path 1: Setup → Networking */}
              <path d={path1} fill="none" stroke="#525252" strokeWidth={1.5} strokeDasharray="6 4" opacity={0.4} />
              <circle r="2.5" fill="#71717a" opacity={0.8}>
                <animateMotion dur="3s" repeatCount="indefinite" path={path1} />
                <animate attributeName="opacity" values="0;0.8;0" dur="3s" repeatCount="indefinite" />
              </circle>
              <text
                x={(setupRight + netLeft) / 2}
                y={Math.min(setupLastY, netFirstY) - 8}
                textAnchor="middle"
                fill="#52525280"
                fontSize={9}
                fontFamily="system-ui, sans-serif"
                fontStyle="italic"
              >
                then
              </text>

              {/* Path 2: Networking → Automation */}
              <path d={path2} fill="none" stroke="#525252" strokeWidth={1.5} strokeDasharray="6 4" opacity={0.4} />
              <circle r="2.5" fill="#71717a" opacity={0.8}>
                <animateMotion dur="3s" repeatCount="indefinite" path={path2} />
                <animate attributeName="opacity" values="0;0.8;0" dur="3s" repeatCount="indefinite" />
              </circle>
              <text
                x={(netRight + autoLeft) / 2}
                y={Math.min(netLastY, autoFirstY) - 8}
                textAnchor="middle"
                fill="#52525280"
                fontSize={9}
                fontFamily="system-ui, sans-serif"
                fontStyle="italic"
              >
                then
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
