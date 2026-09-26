"use client";

import { usePathname } from "next/navigation";

/** The home page renders its own shell, so global chrome is skipped there. */
export default function HideOnHome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return pathname === "/" ? null : <>{children}</>;
}
