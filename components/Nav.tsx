"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/work", label: "Work", match: (path: string) => path === "/work" || path.startsWith("/work/") },
  { href: "/about", label: "About", match: (path: string) => path === "/about" },
  { href: "/resume", label: "Resume", match: (path: string) => path === "/resume" },
  {
    href: "/#contact",
    label: "Contact",
    match: (path: string) => path === "/" /* hash checked separately */,
  },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    function handleHash() {
      setHash(window.location.hash);
    }
    handleScroll();
    handleHash();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("hashchange", handleHash);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHash);
    };
  }, []);

  function isActive(link: (typeof links)[number]) {
    if (link.href === "/#contact") {
      return pathname === "/" && hash === "#contact";
    }
    return link.match(pathname);
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "border-border shadow-[0_1px_0_0_var(--border)]" : "border-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-[padding] duration-300 ${
          scrolled ? "py-3" : "py-4"
        }`}
      >
        <Link href="/" className="font-display text-base font-bold tracking-tight text-foreground">
          Qasim Hassan<span className="text-accent">.</span>
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {links.map((link) => {
            const active = isActive(link);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={
                  link.label === "Contact"
                    ? "rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
                    : `text-sm transition-colors ${
                        active
                          ? "font-medium text-foreground"
                          : "text-muted hover:text-foreground"
                      }`
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-8 w-8 items-center justify-center sm:hidden"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 block h-px w-5 bg-foreground transition-transform ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] block h-px w-5 bg-foreground transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] block h-px w-5 bg-foreground transition-transform ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {open && (
        <nav className="border-t border-border sm:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-6 py-4">
            {links.map((link) => {
              const active = isActive(link);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`py-3 text-sm transition-colors ${
                    active
                      ? "font-medium text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
