"use client";

export default function ResumePrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn-primary mt-8 sm:mt-14">
      Print / Save PDF
    </button>
  );
}
