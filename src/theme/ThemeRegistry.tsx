"use client";

import { ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import theme from './theme';

// Create an emotion cache to prepend styles to the head.
const cache = createCache({ key: 'css', prepend: true });

/**
 * ThemeRegistry wraps children with Emotion's CacheProvider and MUI's ThemeProvider.
 * It must be used as a client component within a server layout to provide
 * consistent theming across server/client boundaries.
 */
export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}