import React from 'react';
import ThemeRegistry from '../src/theme/ThemeRegistry';

export const metadata = {
  title: 'Statbase',
  description: 'AI macroeconomic analysis platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}