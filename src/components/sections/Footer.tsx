export default function Footer() {
  return (
    <footer className="border-t border-border bg-white px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <span className="font-display text-lg font-semibold tracking-tight">820</span>
        <nav className="flex flex-wrap gap-6">
          <a href="#world" className="label text-black/50 hover:text-violet">
            Services
          </a>
          <a href="#work" className="label text-black/50 hover:text-violet">
            Work
          </a>
          <a href="#about" className="label text-black/50 hover:text-violet">
            About
          </a>
          <a href="#contact" className="label text-black/50 hover:text-violet">
            Contact
          </a>
        </nav>
        <div className="flex flex-col items-start gap-1 text-left md:items-end md:text-right">
          <span className="label text-black/40">Beirut — Lebanon</span>
          <span className="label text-black/40">© {new Date().getFullYear()} 820 Agency</span>
        </div>
      </div>
    </footer>
  );
}
