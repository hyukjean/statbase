"use client";
import React from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Slider,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface Asset {
  name: string;
  weight: number;
}

export default function IndexBuilder() {
  const [query, setQuery] = React.useState('');
  const [assets, setAssets] = React.useState<Asset[]>([]);
  const handleAdd = () => {
    if (!query.trim()) return;
    setAssets([...assets, { name: query.trim(), weight: 1 }]);
    setQuery('');
  };
  const handleRemove = (name: string) => {
    setAssets(assets.filter((a) => a.name !== name));
  };
  const handleWeightChange = (name: string, newValue: number) => {
    setAssets(assets.map((a) => (a.name === name ? { ...a, weight: newValue } : a)));
  };
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        커스텀 인덱스 빌더
      </Typography>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="자산 이름 또는 티커를 입력하세요..."
        />
        <IconButton onClick={handleAdd} aria-label="add">
          <AddIcon />
        </IconButton>
      </Box>
      <List dense>
        {assets.map((asset) => (
          <ListItem key={asset.name} sx={{ alignItems: 'flex-start' }}>
            <ListItemText
              primary={asset.name}
              secondary={
                <Slider
                  min={0}
                  max={10}
                  step={0.5}
                  value={asset.weight}
                  onChange={(e, value) => handleWeightChange(asset.name, value as number)}
                  valueLabelDisplay="auto"
                />
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleRemove(asset.name)} aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Button variant="contained" sx={{ mt: 2 }}>
        인덱스 생성
      </Button>
    </Box>
  );
}