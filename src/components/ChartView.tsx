"use client";
import React from 'react';
import { Box, Typography } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useTheme } from '@mui/material/styles';

interface LineDefinition {
  /**
   * Key of the data object to use for this line.
   */
  key: string;
  /**
   * Optional name to display in the legend. Defaults to the key.
   */
  name?: string;
}

type DataPoint = Record<string, number | string | null | undefined>;

interface ChartViewProps {
  /**
   * Array of objects containing xKey and line keys; each object represents a datapoint.
   */
  data: DataPoint[];
  /**
   * Definition of each line to draw.
   */
  lines: LineDefinition[];
  /**
   * Key name of the property in each data object to use for the x-axis.
   */
  xKey: string;
  /** Optional chart title */
  title?: string;
  /** Label for the y-axis */
  yAxisLabel?: string;
}

/**
 * ChartView renders a multi-line chart using Recharts.  It does not specify colors
 * explicitly to adhere to the project guideline of avoiding colour styling; the
 * chart will use default colours assigned by Recharts.  Pass in an array of
 * data objects and definitions of which keys to plot.
 */
export default function ChartView({ data, lines, xKey, title, yAxisLabel }: ChartViewProps) {
  const theme = useTheme();
  interface ExtendedPalette { series?: { equityPrimary?: string; equityAlt?: string; crypto?: string; indexComposite?: string } }
  const ep = theme.palette as unknown as ExtendedPalette;
  const colorMap: Record<string, string> = {
    SPY: ep.series?.equityPrimary || theme.palette.primary.main,
    QQQ: ep.series?.equityAlt || theme.palette.secondary.main,
    BTC: ep.series?.crypto || '#F7931A',
    Composite: ep.series?.indexComposite || theme.palette.info.main,
  };
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, minHeight: 300 }} role="region" aria-label={title || '차트'}>
      {title && (
        <Typography variant="subtitle1" gutterBottom>
          {title}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fontSize: 12 } : undefined}
          />
          <Tooltip />
          <Legend />
          {lines.map((line) => {
            const stroke = colorMap[line.key] || theme.palette.primary.main;
            return (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.name ?? line.key}
                stroke={stroke}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}