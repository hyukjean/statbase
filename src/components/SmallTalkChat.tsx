"use client";
import React from 'react';
import { Box, TextField, IconButton, Paper, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';

interface Message {
  from: 'user' | 'ai';
  text: string;
}

export default function SmallTalkChat() {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, { from: 'user', text: message }]);
    setMessage('');
    // TODO: call AI small talk API here
    setMessages((msgs) => [...msgs, { from: 'ai', text: 'AI 답변 예시입니다.' }]);
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
      {!open && (
        <IconButton color="primary" onClick={() => setOpen(true)}>
          <ChatIcon />
        </IconButton>
      )}
      {open && (
        <Paper sx={{ width: 300, height: 400, display: 'flex', flexDirection: 'column', p: 1 }}>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 1 }}>
            {messages.map((msg, idx) => (
              <Box key={idx} sx={{ mb: 0.5, textAlign: msg.from === 'user' ? 'right' : 'left' }}>
                <Typography
                  variant="body2"
                  sx={{
                    p: 0.5,
                    bgcolor: msg.from === 'user' ? 'primary.main' : 'grey.300',
                    color: msg.from === 'user' ? 'primary.contrastText' : 'text.primary',
                    borderRadius: 1,
                    display: 'inline-block',
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex' }}>
            <TextField
              fullWidth
              size="small"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
            />
            <IconButton onClick={handleSend} aria-label="send">
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </Box>
  );
}