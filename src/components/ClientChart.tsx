"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const ChartView = dynamic(() => import('./ChartView'));

interface ClientChartProps {
  data: { date: string; SPY?: number; BTC?: number }[];
}

export default function ClientChart({ data }: ClientChartProps) {
  return (
    <ChartView
      data={data}
      xKey="date"
      lines={[{ key: 'SPY', name: 'SPY' }, { key: 'BTC', name: 'Bitcoin' }]}
      title="SPY vs Bitcoin (최근 30일)"
      yAxisLabel="Price (USD)"
    />
  );
}
