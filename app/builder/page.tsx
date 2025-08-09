"use client";
import React from 'react';
import AppShell from '../../src/components/AppShell';
import IndexBuilder from '../../src/components/IndexBuilder';
import { Box } from '@mui/material';

export default function Page() {
  return (
    <AppShell>
      <Box p={2}>
        <IndexBuilder />
      </Box>
    </AppShell>
  );
}