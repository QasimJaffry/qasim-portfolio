type ArchNode = { id: string; label: string; x: number; y: number; w?: number };
type ArchEdge = { from: string; to: string };

const diagrams: Record<
  string,
  { title: string; caption: string; nodes: ArchNode[]; edges: ArchEdge[] }
> = {
  agenticly: {
    title: "Architecture",
    caption:
      "Separate Expo and Vite clients share Firebase auth/data and one entitlement truth; a teammate-owned FastAPI + LangGraph service runs the research agent loop; RevenueCat and Stripe normalize into the same access model on the clients I owned.",
    nodes: [
      { id: "expo", label: "Expo / RN", x: 40, y: 28 },
      { id: "web", label: "React + Vite", x: 220, y: 28 },
      { id: "fb", label: "Firebase", x: 130, y: 110 },
      { id: "api", label: "Research API (team)", x: 310, y: 110, w: 160 },
      { id: "rc", label: "RevenueCat", x: 40, y: 200 },
      { id: "stripe", label: "Stripe", x: 200, y: 200 },
      { id: "data", label: "Market data APIs", x: 360, y: 200, w: 130 },
    ],
    edges: [
      { from: "expo", to: "fb" },
      { from: "web", to: "fb" },
      { from: "expo", to: "api" },
      { from: "web", to: "api" },
      { from: "expo", to: "rc" },
      { from: "web", to: "stripe" },
      { from: "rc", to: "fb" },
      { from: "stripe", to: "fb" },
      { from: "api", to: "data" },
    ],
  },
  "dealflow-ai": {
    title: "Architecture",
    caption:
      "Next.js product surface over a deal pipeline — intake, scoring, and AI-assisted review sitting on shared auth and data, with clear separation between UI workflows and model calls.",
    nodes: [
      { id: "ui", label: "Next.js app", x: 160, y: 24, w: 120 },
      { id: "auth", label: "Auth + DB", x: 40, y: 120 },
      { id: "ai", label: "LLM / agents", x: 200, y: 120, w: 120 },
      { id: "pipeline", label: "Deal pipeline", x: 360, y: 120, w: 120 },
      { id: "out", label: "Score · brief · CRM hooks", x: 180, y: 210, w: 160 },
    ],
    edges: [
      { from: "ui", to: "auth" },
      { from: "ui", to: "ai" },
      { from: "ui", to: "pipeline" },
      { from: "ai", to: "out" },
      { from: "pipeline", to: "out" },
      { from: "auth", to: "out" },
    ],
  },
};

function centerOf(n: ArchNode) {
  const w = n.w ?? 110;
  return { cx: n.x + w / 2, cy: n.y + 18 };
}

export default function ArchitectureDiagram({ slug }: { slug: string }) {
  const diagram = diagrams[slug];
  if (!diagram) return null;

  const byId = Object.fromEntries(diagram.nodes.map((n) => [n.id, n]));

  return (
    <figure className="mt-10 border-t border-border/80 pt-8 sm:mt-12">
      <figcaption className="eyebrow">{diagram.title}</figcaption>
      <div className="mt-4 overflow-x-auto rounded-2xl bg-surface/80 p-4 sm:p-5">
        <svg
          viewBox="0 0 520 260"
          className="mx-auto h-auto w-full min-w-[320px] max-w-xl text-foreground"
          role="img"
          aria-label={`${slug} system architecture`}
        >
          {diagram.edges.map((e) => {
            const a = byId[e.from];
            const b = byId[e.to];
            if (!a || !b) return null;
            const p1 = centerOf(a);
            const p2 = centerOf(b);
            return (
              <line
                key={`${e.from}-${e.to}`}
                x1={p1.cx}
                y1={p1.cy}
                x2={p2.cx}
                y2={p2.cy}
                stroke="currentColor"
                strokeOpacity={0.22}
                strokeWidth={1.5}
              />
            );
          })}
          {diagram.nodes.map((n) => {
            const w = n.w ?? 110;
            return (
              <g key={n.id}>
                <rect
                  x={n.x}
                  y={n.y}
                  width={w}
                  height={36}
                  rx={10}
                  fill="var(--background)"
                  stroke="var(--accent)"
                  strokeOpacity={0.8}
                  strokeWidth={1.25}
                />
                <text
                  x={n.x + w / 2}
                  y={n.y + 23}
                  textAnchor="middle"
                  fontSize={11}
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  fill="var(--foreground)"
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{diagram.caption}</p>
    </figure>
  );
}
