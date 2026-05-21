// app/wiki/layout.tsx — Wiki Brain layout (matches automation-demos design system)
export default function WikiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {children}
      </div>
    </div>
  )
}