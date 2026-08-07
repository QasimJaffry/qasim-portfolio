export type ProcessStep = {
  step: string;
  title: string;
  detail: string;
};

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Discovery",
    detail:
      "A short call or async brief — goal, constraints, stack, and what success looks like. Clear go / no-go.",
  },
  {
    step: "02",
    title: "Scope",
    detail:
      "Written proposal with milestones, ownership, and timeline. Fixed scope when it fits; retainer when it doesn’t.",
  },
  {
    step: "03",
    title: "Build",
    detail:
      "Weekly demos and production-minded iteration. I use AI tools for speed, then review changes like a senior PR before they ship.",
  },
  {
    step: "04",
    title: "Ship & handoff",
    detail:
      "Store releases, docs, and a clean handoff. Stick around briefly for launch bugs when the engagement includes it.",
  },
];
