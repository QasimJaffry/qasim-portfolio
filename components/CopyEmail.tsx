"use client";

import { useState } from "react";

/** Copies the email address and says so, so nobody has to wonder whether it worked. */
export default function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 2200);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="link-underline font-display text-[15px] font-medium"
    >
      <span aria-live="polite">
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed, select the address above" : "Copy email address"}
      </span>
    </button>
  );
}
