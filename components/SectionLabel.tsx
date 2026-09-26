export default function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
      <span className="text-accent">{`// ${n}`}</span> {children}
    </p>
  );
}
