"use client";

import { useState } from "react";
import { mailtoHref } from "@/lib/site";

type Scope = { title: string; description: string };

/**
 * The services as one sentence of display type. Picking a phrase draws its underline
 * and swaps in what it covers. Phrases are inline spans (not buttons) so the sentence wraps
 * like normal text on narrow screens.
 */
export default function ServicesPicker({ scopes }: { scopes: Scope[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <p className="hd max-w-6xl text-[clamp(1.7rem,6.4vw,4.3rem)] leading-[1.2] text-foreground/45 sm:leading-[1.18]">
        I take on{" "}
        {scopes.map((scope, i) => {
          const on = i === active;
          const last = i === scopes.length - 1;
          return (
            <span key={scope.title}>
              {last && "and "}
              <span
                role="button"
                tabIndex={0}
                aria-pressed={on}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(i);
                  }
                }}
                className={`cursor-pointer bg-no-repeat pb-[0.04em] transition-[color,background-size] duration-500 ease-out ${
                  on ? "text-accent" : "text-foreground hover:text-accent/80"
                }`}
                style={{
                  backgroundImage: "linear-gradient(currentColor, currentColor)",
                  backgroundPosition: "0 100%",
                  backgroundSize: on ? "100% 3px" : "0% 3px",
                  WebkitBoxDecorationBreak: "clone",
                  boxDecorationBreak: "clone",
                }}
              >
                {scope.title}
              </span>
              {last ? "." : ", "}
            </span>
          );
        })}
      </p>

      <div className="mt-12 grid items-start gap-8 md:grid-cols-[1fr_auto]">
        <div aria-live="polite" className="min-h-[7.5rem]">
          <p key={active} className="swap max-w-xl text-xl leading-[1.55] text-muted">
            {scopes[active].description}
          </p>
        </div>
        <a href={mailtoHref("Project inquiry")} className="btn-primary w-full justify-center md:w-auto">
          Start a conversation
        </a>
      </div>
    </div>
  );
}
