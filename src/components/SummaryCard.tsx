"use client";
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface Props {
  title: string;
  value: string;
  change: string;
}

export default function SummaryCard({ title, value, change }: Props) {
  const isUp = change.startsWith('+');
  return (
    <Card role="group" aria-label={`${title} 현재가 ${value}, 일일 변동 ${change}`} tabIndex={0}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4">{value}</Typography>
        <Typography color={isUp ? 'success.main' : 'error.main'}>{change}</Typography>
      </CardContent>
    </Card>
  );
}