import React from 'react';
import ThemeRegistry from '../src/theme/ThemeRegistry';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Statbase – AI Macroeconomic & Market Analysis',
  description: 'Grounded time-series market & macro insights with AI-generated reports.',
  openGraph: {
    title: 'Statbase – AI Macroeconomic & Market Analysis',
    description: 'Grounded time-series market & macro insights with AI-generated reports.',
    type: 'website',
    siteName: 'Statbase'
  },
  twitter: {
    card: 'summary',
    title: 'Statbase – AI Macroeconomic & Market Analysis',
    description: 'Time-series grounded AI market insights.'
  },
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ outline: 'none' }}>
        <ThemeRegistry>{children}</ThemeRegistry>
        <style>{`*:focus-visible{outline:2px solid #1B4DFF;outline-offset:2px;border-radius:4px}`}</style>
      </body>
    </html>
  );
}