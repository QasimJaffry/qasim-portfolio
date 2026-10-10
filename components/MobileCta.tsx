"use client";

import { useEffect, useState } from "react";
import { mailtoHref } from "@/lib/site";

/**
 * Phones only: once the intro has scrolled away, a slim "Start a project" bar stays within
 * reach, and steps aside when the contact section is on screen.
 */
export default function MobileCta() {
  const [pastIntro, setPastIntro] = useState(false);
  const [atContact, setAtContact] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastIntro(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const contact = document.getElementById("contact");
    let observer: IntersectionObserver | undefined;
    if (contact) {
      observer = new IntersectionObserver(([entry]) => setAtContact(entry.isIntersecting), {
        threshold: 0.1,
      });
      observer.observe(contact);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  const show = pastIntro && !atContact;

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-4 bottom-4 z-40 transition-[transform,opacity] duration-300 lg:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <a
        href={mailtoHref()}
        tabIndex={show ? 0 : -1}
        className="btn-primary w-full justify-center py-3.5 ring-1 ring-black/30"
      >
        Start a project
      </a>
    </div>
  );
}
