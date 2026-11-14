"use client";

import { useEffect, useRef, useState } from "react";

/** Buy on the phone, and the web app unlocks too: one entitlement shared by both. */
export function PaymentsDemo() {
  const [step, setStep] = useState<"free" | "syncing" | "pro">("free");

  useEffect(() => {
    if (step !== "syncing") return;
    const id = window.setTimeout(() => setStep("pro"), 900);
    return () => window.clearTimeout(id);
  }, [step]);

  const pro = step === "pro";

  return (
    <div className="mt-8">
      <div className="grid grid-cols-[1fr_auto_1.6fr] items-center gap-3 sm:gap-5">
        <div className="rounded-2xl border border-border bg-background/60 p-4">
          <p className="text-sm text-muted">Phone</p>
          <p className={`mt-1 font-display text-lg font-semibold ${pro ? "text-accent" : "text-foreground"}`}>
            {pro ? "Pro" : "Free plan"}
          </p>
        </div>
        <div aria-hidden className="relative h-px w-10 bg-border sm:w-20">
          <span
            className={`absolute -top-[3px] size-[7px] rounded-full bg-accent transition-[left,opacity] duration-[900ms] ease-in-out ${
              step === "free" ? "left-0 opacity-0" : "left-[calc(100%-7px)] opacity-100"
            }`}
          />
        </div>
        <div className="rounded-2xl border border-border bg-background/60 p-4">
          <p className="text-sm text-muted">Web app</p>
          <p className={`mt-1 font-display text-lg font-semibold ${pro ? "text-accent" : "text-foreground"}`}>
            {pro ? "Pro features unlocked" : step === "syncing" ? "Syncing…" : "Locked"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-5">
        <button
          type="button"
          onClick={() => setStep(pro ? "free" : "syncing")}
          disabled={step === "syncing"}
          className="btn-primary disabled:opacity-60"
        >
          {pro ? "Reset" : "Buy Pro on the phone"}
        </button>
        <p aria-live="polite" className="text-sm text-muted">
          {pro ? "Paid once, Pro on both." : "RevenueCat on mobile, Stripe on web."}
        </p>
      </div>
    </div>
  );
}

const question = "Is Bitcoin up this week?";
const answer =
  "Yes, BTC is up 4.2% over seven days. Most of the move came on Tuesday, when volume ran about 30% above its monthly average.";

/** An answer that streams in word by word, the way a live AI feature should feel. */
export function AiDemo() {
  const [shown, setShown] = useState(0);
  const [running, setRunning] = useState(false);
  const words = useRef(answer.split(" "));

  useEffect(() => {
    if (!running) return;
    if (shown >= words.current.length) {
      setRunning(false);
      return;
    }
    const id = window.setTimeout(() => setShown((n) => n + 1), 70);
    return () => window.clearTimeout(id);
  }, [running, shown]);

  function run() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(words.current.length);
      return;
    }
    setShown(0);
    setRunning(true);
  }

  return (
    <div className="mt-8 flex flex-1 flex-col">
      <p className="mb-3 text-sm text-muted">Example conversation</p>
      <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-[15px] text-accent-foreground">
        {question}
      </p>
      <p aria-live="polite" className="mt-3 min-h-[6.5rem] max-w-[92%] rounded-2xl rounded-bl-md bg-background/60 px-4 py-3 text-[15px] leading-[1.55] text-foreground/85">
        {shown === 0 ? <span className="text-muted">Press ask to see it stream.</span> : words.current.slice(0, shown).join(" ")}
        {running && <span aria-hidden className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-accent" />}
      </p>
      <button type="button" onClick={run} disabled={running} className="btn-secondary link-underline mt-auto w-fit pt-5 disabled:opacity-60">
        {shown > 0 && !running ? "Ask again" : "Ask"}
      </button>
    </div>
  );
}
