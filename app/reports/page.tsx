"use client";
import React from 'react';
import AppShell from '../../src/components/AppShell';
import { Typography, Box } from '@mui/material';

export default function Page() {
  return (
    <AppShell>
      <Box p={2}>
        <Typography variant="h4" gutterBottom>
          Reports
        </Typography>
        <Typography>리포트 목록이 여기에 표시됩니다.</Typography>
      </Box>
    </AppShell>
  );
}