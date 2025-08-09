"use client";
import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface Props {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ placeholder = '검색', onSearch }: Props) {
  const [value, setValue] = React.useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value);
  };
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <TextField
        fullWidth
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        variant="outlined"
        size="small"
      />
      <IconButton type="submit" sx={{ ml: 1 }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Box>
  );
}