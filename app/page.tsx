import AppShell from 'src/components/AppShell';
import SearchBar from 'src/components/SearchBar';
import SummaryCard from 'src/components/SummaryCard';
import { Box, Grid, Typography, Divider, Stack } from '@mui/material';
import { getEquityDisplay, getCryptoDisplay, loadSeriesForChart, getSummariesGeneratedAt } from 'src/lib/data';
import { formatKST } from 'src/lib/format';
import ClientChart from 'src/components/ClientChart';

export default async function Page() {
  const [sp500, nasdaq, btc, chartData, generatedAt] = await Promise.all([
    getEquityDisplay('SPY'),
    getEquityDisplay('QQQ'),
    getCryptoDisplay('bitcoin'),
    loadSeriesForChart(),
    getSummariesGeneratedAt(),
  ]);

  return (
    <AppShell>
      <Box p={2}>
        {/* Hero / Search */}
        <Stack spacing={2} mb={4}>
          <Typography variant="h2" fontSize={{ xs: '1.9rem', md: '2.4rem' }}>시장 개요</Typography>
          <SearchBar placeholder="궁금한 것을 물어보세요..." />
          <Typography variant="caption" color="text.secondary">
            {generatedAt ? `데이터 기준 시각: ${formatKST(generatedAt)}` : '실시간 조회 중…'}
          </Typography>
        </Stack>

        <Divider sx={{ mb: 3 }}>Market Summary</Divider>
        <Grid container spacing={2} mb={4}>
          <Grid item xs={12} md={4}>
            <SummaryCard title="S&P 500 (SPY)" value={sp500.value} change={sp500.change} />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard title="NASDAQ (QQQ)" value={nasdaq.value} change={nasdaq.change} />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard title="비트코인" value={btc.value} change={btc.change} />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }}>30일 가격 추이 (SPY vs BTC)</Divider>
        <ClientChart data={chartData} />
      </Box>
    </AppShell>
  );
}