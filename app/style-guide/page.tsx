"use client";
import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Stack, Button, Chip, Divider } from '@mui/material';
import theme, { SERIES_COLORS } from '../../src/theme/theme';

const COLOR_BLOCKS: Array<{ label: string; color: string }> = [
  { label: 'Primary', color: theme.palette.primary.main },
  { label: 'Secondary', color: theme.palette.secondary.main },
  { label: 'Success', color: theme.palette.success.main },
  { label: 'Error', color: theme.palette.error.main },
  { label: 'Warning', color: theme.palette.warning.main },
  { label: 'Info', color: theme.palette.info.main },
  { label: 'Neutral', color: theme.palette.text.primary },
  { label: 'Neutral Variant', color: theme.palette.text.secondary },
  { label: 'Outline', color: theme.palette.divider },
  { label: 'Equity Primary (SPY)', color: SERIES_COLORS.equityPrimary },
  { label: 'Equity Alt (QQQ)', color: SERIES_COLORS.equityAlt },
  { label: 'Crypto (BTC)', color: SERIES_COLORS.crypto },
  { label: 'Rate (DGS10)', color: SERIES_COLORS.rate },
  { label: 'Index Composite', color: SERIES_COLORS.indexComposite },
];

type Variant = 'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'subtitle1'|'body1'|'body2';
const TYPO_SCALE: Array<{ variant: Variant; sample: string; desc?: string }> = [
  { variant: 'h1', sample: 'H1 헤드라인 – Macro Overview' },
  { variant: 'h2', sample: 'H2 섹션 타이틀 – Market Summary' },
  { variant: 'h3', sample: 'H3 서브 섹션 – Trend' },
  { variant: 'h4', sample: 'H4 카드 타이틀' },
  { variant: 'h5', sample: 'H5 강조 텍스트' },
  { variant: 'h6', sample: 'H6 보조 헤드라인' },
  { variant: 'subtitle1', sample: 'Subtitle1 설명 텍스트' },
  { variant: 'body1', sample: 'Body1 본문: 시계열 데이터 및 지표 설명 문자열.' },
  { variant: 'body2', sample: 'Body2 본문 (보조): 부가 설명 또는 라벨.' },
];

export default function StyleGuidePage() {
  return (
    <Box>
      <Typography variant="h2" gutterBottom>Style Guide</Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Material Design 3 토큰 + 컴포넌트 사용 규칙 예시. 실 서비스 UI 개발 시 이 페이지의 토큰을 기준으로 구성요소를 선택하고 재사용합니다.
      </Typography>

      <Divider sx={{ my: 4 }}>Color Palette</Divider>
      <Grid container spacing={2}>
        {COLOR_BLOCKS.map(c => (
          <Grid item xs={6} sm={4} md={3} key={c.label}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ width: '100%', height: 56, borderRadius: 1, mb: 1, bgcolor: c.color }} />
                <Typography variant="body2" fontWeight={600}>{c.label}</Typography>
                <Typography variant="caption" color="text.secondary">{c.color}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }}>Typography</Divider>
      <Stack spacing={1}>
        {TYPO_SCALE.map(t => (
          <Typography key={t.variant} variant={t.variant}>{t.sample}</Typography>
        ))}
      </Stack>

      <Divider sx={{ my: 4 }}>Components</Divider>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" gutterBottom>Buttons</Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button variant="contained">Primary</Button>
                <Button variant="outlined">Outlined</Button>
                <Button variant="text">Text</Button>
                <Button variant="contained" color="secondary">Secondary</Button>
                <Button variant="contained" color="success">Success</Button>
                <Button variant="contained" color="error">Error</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" gutterBottom>Chips (Status)</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label="Up" color="success" />
                  <Chip label="Down" color="error" />
                  <Chip label="Neutral" variant="outlined" />
                  <Chip label="New" color="info" />
                  <Chip label="Beta" color="warning" />
                </Stack>
              </CardContent>
            </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }}>Spacing & Layout</Divider>
      <Typography variant="body2" gutterBottom>
        기본 spacing 단위는 theme.spacing(1)=8px. 주요 컴포넌트 패딩: 카드 (24px), 섹션 간격: 32~40px.
      </Typography>
      <Typography variant="body2" gutterBottom>
        Radius: 기본 12px (카드 16px), 인터랙티브 pill (Button) 999px 라운드.
      </Typography>

      <Divider sx={{ my: 4 }}>Usage 규칙</Divider>
      <ul style={{ paddingLeft: '1.2rem' }}>
        <li>Primary는 주요 CTA (예: 리포트 생성) 에만 사용.</li>
        <li>Secondary는 보조 강한 액션 또는 강조 배너.</li>
        <li>가변 데이터(상승/하락)는 success/error 팔레트 사용.</li>
        <li>시계열 Chart 색상: SPY → equityPrimary, QQQ → equityAlt, BTC → crypto, FRED 금리/매크로 → rate, Composite Index → indexComposite.</li>
        <li>다크 모드는 추후 Palette.mode 토글로 확장 (본 토큰 재활용).</li>
      </ul>
    </Box>
  );
}
