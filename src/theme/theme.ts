import { createTheme } from '@mui/material/styles';
import { koKR } from '@mui/material/locale';

declare module '@mui/material/styles' {
  interface Palette {
    brand: typeof BRAND;
    series: typeof SERIES_COLORS;
  }
  interface PaletteOptions {
    brand?: typeof BRAND;
    series?: typeof SERIES_COLORS;
  }
}

/**
 * Material Design 3 기반 커스텀 테마 토큰.
 * - Brand / Semantic / Surface / State / Chart 색상 정의
 * - Typography scale (KR 가독성 최적화)
 * - Shape & Elevation
 * - Density & Spacing 기본 규칙 문서화 (spacing * n)
 */
const BRAND = {
  primary: '#1B4DFF',
  secondary: '#FF6B2C',
  accent: '#14B8A6',
  neutral: '#1E293B',
  neutralVariant: '#475569',
  outline: '#CBD5E1',
};

// 차트/데이터 시각화용 색상 (순서 안정성 유지)
export const SERIES_COLORS = {
  equityPrimary: '#0B5FFF', // SPY
  equityAlt: '#7B2CBF', // QQQ
  crypto: '#F7931A', // BTC
  rate: '#0891B2', // DGS10 (예시)
  indexComposite: '#6366F1',
};

const theme = createTheme(
  {
  palette: {
      mode: 'light',
      primary: { main: BRAND.primary, contrastText: '#FFFFFF' },
      secondary: { main: BRAND.secondary, contrastText: '#FFFFFF' },
      success: { main: '#16A34A' },
      error: { main: '#DC2626' },
      warning: { main: '#F59E0B' },
      info: { main: '#0284C7' },
      background: { default: '#F8FAFC', paper: '#FFFFFF' },
      divider: BRAND.outline,
      text: {
        primary: BRAND.neutral,
        secondary: BRAND.neutralVariant,
      },
      // 커스텀 팔레트 확장 (TS 보강 없이 any 사용) — StyleGuide 등에서 사용
      brand: BRAND,
      series: SERIES_COLORS,
  },
    typography: {
      fontFamily: ['"Noto Sans KR"', 'Roboto', 'sans-serif'].join(','),
      h1: { fontSize: '3.25rem', fontWeight: 600, letterSpacing: '-0.02em' },
      h2: { fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.01em' },
      h3: { fontSize: '2rem', fontWeight: 600 },
      h4: { fontSize: '1.6rem', fontWeight: 600 },
      h5: { fontSize: '1.25rem', fontWeight: 600 },
      h6: { fontSize: '1.05rem', fontWeight: 600 },
      subtitle1: { fontSize: '1rem', fontWeight: 500 },
      body1: { fontSize: '0.95rem', lineHeight: 1.55 },
      body2: { fontSize: '0.85rem', lineHeight: 1.5 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      '0px 1px 2px rgba(0,0,0,0.06)',
      '0px 1px 3px rgba(0,0,0,0.08),0px 1px 2px rgba(0,0,0,0.04)',
      '0px 2px 4px rgba(0,0,0,0.08),0px 2px 3px rgba(0,0,0,0.04)',
      '0px 3px 6px rgba(0,0,0,0.1),0px 2px 4px rgba(0,0,0,0.06)',
      '0px 4px 8px rgba(0,0,0,0.12),0px 3px 6px rgba(0,0,0,0.08)',
      '0px 6px 12px rgba(0,0,0,0.14),0px 4px 8px rgba(0,0,0,0.1)',
      '0px 8px 16px rgba(0,0,0,0.16),0px 6px 12px rgba(0,0,0,0.12)',
      '0px 10px 20px rgba(0,0,0,0.18),0px 8px 16px rgba(0,0,0,0.12)',
      '0px 12px 24px rgba(0,0,0,0.2),0px 10px 20px rgba(0,0,0,0.14)',
      '0px 14px 28px rgba(0,0,0,0.22),0px 12px 24px rgba(0,0,0,0.16)',
      '0px 16px 32px rgba(0,0,0,0.24),0px 14px 28px rgba(0,0,0,0.18)',
      '0px 18px 36px rgba(0,0,0,0.26),0px 16px 32px rgba(0,0,0,0.2)',
      '0px 20px 40px rgba(0,0,0,0.28),0px 18px 36px rgba(0,0,0,0.22)',
      '0px 22px 44px rgba(0,0,0,0.3),0px 20px 40px rgba(0,0,0,0.24)',
      '0px 24px 48px rgba(0,0,0,0.32),0px 22px 44px rgba(0,0,0,0.26)',
      '0px 26px 52px rgba(0,0,0,0.34),0px 24px 48px rgba(0,0,0,0.28)',
      '0px 28px 56px rgba(0,0,0,0.36),0px 26px 52px rgba(0,0,0,0.3)',
      '0px 30px 60px rgba(0,0,0,0.38),0px 28px 56px rgba(0,0,0,0.32)',
      '0px 32px 64px rgba(0,0,0,0.4),0px 30px 60px rgba(0,0,0,0.34)',
      '0px 34px 68px rgba(0,0,0,0.42),0px 32px 64px rgba(0,0,0,0.36)',
      '0px 36px 72px rgba(0,0,0,0.44),0px 34px 68px rgba(0,0,0,0.38)',
      '0px 38px 76px rgba(0,0,0,0.46),0px 36px 72px rgba(0,0,0,0.4)',
      '0px 40px 80px rgba(0,0,0,0.48),0px 38px 76px rgba(0,0,0,0.42)',
  '0px 42px 84px rgba(0,0,0,0.5),0px 40px 80px rgba(0,0,0,0.44)',
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            paddingInline: '1.1rem',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: '1px solid ' + BRAND.outline,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(27,77,255,0.9)' },
        },
      },
    },
  },
  koKR,
);

export default theme;