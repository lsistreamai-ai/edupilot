// app/wiki/layout.tsx — Wiki Brain warm dark layout
export default function WikiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-200">
      <div className="max-w-6xl mx-auto px-6 py-10 sm:px-8 sm:py-14">
        {children}
      </div>
    </div>
  )
}