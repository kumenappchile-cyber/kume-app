export default function KumenShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh w-full bg-neutral-950 text-neutral-100">
      <div className="mx-auto flex min-h-dvh max-w-md items-center justify-center p-5">
        {children}
      </div>
    </main>
  );
}
