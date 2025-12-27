import Link from "next/link";

export default function DonePage() {
  return (
    <main className="min-h-dvh bg-neutral-950 text-neutral-100 flex items-center justify-center p-5">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
        {/* Espacio */}
        <div className="flex flex-col items-center justify-center text-center space-y-6 py-10">
          <div className="font-serif tracking-wide text-[16px] leading-7 text-neutral-200 whitespace-pre-wrap">
            Vuelve al día.
          </div>

          <div className="text-xs text-neutral-500">
            No hay nada más que hacer aquí.
          </div>
        </div>

        {/* Salida */}
        <div className="mt-6">
          <Link href="/" className="block">
            <button className="w-full rounded-2xl border border-white/20 bg-transparent px-4 py-3 text-sm font-medium text-neutral-200 hover:bg-white/5 transition">
              Salir
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
