import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Flat Threat Map',
  description: 'Real-time threat visualization on a world map',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
