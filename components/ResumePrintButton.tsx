"use client";

export default function ResumePrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn-secondary link-underline mt-8 sm:mt-14">
      Print this page
    </button>
  );
}
