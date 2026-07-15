export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Qasim Hassan · Lahore, Pakistan</p>
        <p>Built with Next.js + Vercel</p>
        <div className="flex gap-4">
          {/* TODO: placeholder — swap for real GitHub profile */}
          <a
            href="https://github.com/qasimhassan"
            className="link-underline transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/qasim-hassan-02871a171"
            className="link-underline transition-colors hover:text-foreground"
          >
            LinkedIn
          </a>
          {/* TODO: placeholder — swap for real Upwork profile */}
          <a
            href="https://www.upwork.com/freelancers/~qasimhassan"
            className="link-underline transition-colors hover:text-foreground"
          >
            Upwork
          </a>
        </div>
      </div>
    </footer>
  );
}
