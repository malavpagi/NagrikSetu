function PageShell({ title, subtitle, actions, children }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-glow backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

export default PageShell;
