"use client";
import React from 'react';
import AppShell from '../../src/components/AppShell';
import { Typography, Box } from '@mui/material';

export default function Page() {
  return (
    <AppShell>
      <Box p={2}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Typography>설정 기능이 여기에 표시됩니다.</Typography>
      </Box>
    </AppShell>
  );
}