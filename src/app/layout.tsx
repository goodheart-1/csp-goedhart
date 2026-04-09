import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://protect.goodheart.earth"),
  title: "Protect ~ Daantje Goedhart",
  description: "Een persoonlijk document van Daantje Goedhart",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔰</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 font-sans">
        {children}
      </body>
    </html>
  );
}
