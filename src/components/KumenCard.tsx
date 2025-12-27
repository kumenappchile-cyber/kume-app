export default function KumenCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm">
      {children}
    </section>
  );
}
