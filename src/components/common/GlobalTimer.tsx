"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useGame } from "@/context/GameContext";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";

export default function GlobalTimer({ onTimeUp }: { onTimeUp: () => void }) {
  const { gameStartTime, timeLimit } = useGame();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!gameStartTime) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - gameStartTime;
      const totalMs = timeLimit * 60 * 1000;
      const remaining = Math.max(0, totalMs - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onTimeUp();
      }
    }, 1000);

    // Immediate calculation
    const elapsed = Date.now() - gameStartTime;
    setTimeLeft(Math.max(0, timeLimit * 60 * 1000 - elapsed));

    return () => clearInterval(interval);
  }, [gameStartTime, timeLimit, onTimeUp]);

  if (timeLeft === null) return null;

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const isUrgent = timeLeft < 5 * 60000; // Less than 5 bounds

  return (
    <Box sx={{
      display: "flex", alignItems: "center", gap: 0.75,
      px: 2, py: 0.5, borderRadius: 3,
      backgroundColor: isUrgent ? "#FFEBEE" : "white",
      color: isUrgent ? "#D32F2F" : "#1B7B7E",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      border: `1px solid ${isUrgent ? "#FFCDD2" : "#E0F2F1"}`
    }}>
      <AccessTimeFilledIcon fontSize="small" />
      <Typography variant="body2" fontWeight={600} sx={{ fontVariantNumeric: "tabular-nums" }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Typography>
    </Box>
  );
}
