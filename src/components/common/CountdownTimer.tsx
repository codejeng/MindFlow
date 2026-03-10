"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  seconds: number;
  onComplete: () => void;
  isRunning: boolean;
  size?: number;
}

export default function CountdownTimer({
  seconds,
  onComplete,
  isRunning,
  size = 160,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  // Use a ref so the interval callback always has the latest onComplete
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  // Reset timer when seconds prop changes (e.g. new question)
  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  // Tick effect – no timeLeft in deps so the interval isn't recreated every second
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]); // ← removed timeLeft; removed onComplete (using ref instead)

  // Fire onComplete AFTER render, not inside a setState updater
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      onCompleteRef.current();
    }
  }, [timeLeft, isRunning]);

  const progress = seconds > 0 ? timeLeft / seconds : 0;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const getColor = useCallback(() => {
    if (progress > 0.5) return "#1B7B7E";
    if (progress > 0.25) return "#E8A838";
    return "#F44336";
  }, [progress]);

  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background ring */}
      <svg
        width={size}
        height={size}
        style={{ position: "absolute", transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </svg>

      {/* Time display */}
      <Box
        component={motion.div}
        animate={
          timeLeft <= 5 && timeLeft > 0
            ? { scale: [1, 1.2, 1] }
            : {}
        }
        transition={{ duration: 0.5, repeat: timeLeft <= 5 ? Infinity : 0 }}
        sx={{ textAlign: "center", zIndex: 1 }}
      >
        <Typography
          variant="h2"
          fontWeight={700}
          sx={{
            color: getColor(),
            lineHeight: 1,
            fontSize: size * 0.3,
          }}
        >
          {timeLeft}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", fontSize: size * 0.08 }}
        >
          วินาที
        </Typography>
      </Box>
    </Box>
  );
}
