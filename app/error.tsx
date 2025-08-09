"use client";
import React from 'react';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ padding: '2rem' }} role="alert">
      <p>문제가 발생했습니다: {error.message}</p>
      <button
        onClick={() => {
          // Attempt to recover by trying to re-render the segment.
          reset();
        }}
      >
        다시 시도
      </button>
    </div>
  );
}