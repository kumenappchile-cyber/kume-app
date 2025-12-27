import "./globals.css";

export const metadata = {
  title: "Kümen",
  description: "Tu compañero incansable hacia una vida consciente.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
