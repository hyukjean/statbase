"use client";
import React from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function ReportLayout({ title, children }: Props) {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      {children}
    </Box>
  );
}