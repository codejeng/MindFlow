"use client";

import React, { useState } from "react";
import { Box, Card, Typography, TextField, InputAdornment, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar } from "@mui/material";
import { MessageSquareHeart, TrendingUp, Search, Filter, Star, HeartHandshake } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from "recharts";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const EMOTION_DATA = [
  { name: "Happy", value: 45, color: "#48BB78", emoji: "😊" },
  { name: "Connected", value: 25, color: "#E53E3E", emoji: "🥰" },
  { name: "Relieved", value: 20, color: "#3182CE", emoji: "😮‍💨" },
  { name: "Stressed", value: 10, color: "#DD6B20", emoji: "😔" },
];

const FEEDBACK_LIST = [
  { id: "FB-084", user: "Nong", session: "S-5042", text: "สนุกมากครับ ได้พูดเรื่องที่ปกติต้องเก็บไว้", emotion: "Happy", rating: 5, date: "Today, 14:40" },
  { id: "FB-083", user: "Mom", session: "S-5042", text: "รู้สึกใกล้ชิดลูกมากขึ้น เปิดใจคุยกันดีค่ะ", emotion: "Connected", rating: 5, date: "Today, 14:41" },
  { id: "FB-082", user: "Boy", session: "S-5039", text: "คำถามบางข้อแอบกดยากนิดนึง แต่โอเค", emotion: "Relieved", rating: 4, date: "Yesterday" },
  { id: "FB-081", user: "Dad", session: "S-5038", text: "กดดันไปหน่อย ทำให้อึดอัดเวลาตอบ", emotion: "Stressed", rating: 2, date: "Yesterday" },
];

const WORD_CLOUD = [
  { text: "สนุกมาก", size: "2.5rem", color: "#48BB78", weight: 900 },
  { text: "เปิดใจ", size: "2rem", color: "#E53E3E", weight: 800 },
  { text: "กดดัน", size: "1.2rem", color: "#DD6B20", weight: 600 },
  { text: "เข้าใจกัน", size: "3rem", color: "#3182CE", weight: 900 },
  { text: "คำถามยาก", size: "1.5rem", color: "#718096", weight: 700 },
  { text: "ใกล้ชิด", size: "1.8rem", color: "#1B7B7E", weight: 800 },
  { text: "ลดกำแพง", size: "2.2rem", color: "#D69E2E", weight: 800 },
  { text: "อบอุ่น", size: "2.4rem", color: "#E53E3E", weight: 900 },
  { text: "ลูกร้องไห้", size: "1.4rem", color: "#805AD5", weight: 700 },
  { text: "ดีมาก", size: "1.9rem", color: "#48BB78", weight: 800 },
  { text: "อึดอัด", size: "1.1rem", color: "#F56565", weight: 500 },
];

export default function FeedbackAnalytics() {
  const router = useRouter();

  return (
    <Box sx={{ width: "100%", pb: 8, display: "flex", flexDirection: "column", gap: 4 }}>
      
      {/* 1. Header Banner */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "white", p: 4, borderRadius: "24px", border: "1px solid #EDF2F7", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box sx={{ p: 2, borderRadius: "16px", bgcolor: "#1B7B7E15", color: "#1B7B7E" }}>
            <MessageSquareHeart size={32} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800} color="#2D3748">User Feedback</Typography>
            <Typography variant="body1" color="text.secondary">
              Real-time sentiment analysis and direct clinical feedback from players.
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 4, textAlign: "right" }}>
          <Box>
            <Typography variant="body2" fontWeight={700} color="text.secondary">AVG RATING</Typography>
            <Typography variant="h3" fontWeight={900} color="#F6E05E" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              4.8 <Star size={24} fill="#F6E05E" />
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={700} color="text.secondary">PARTICIPATION</Typography>
            <Typography variant="h3" fontWeight={900} color="#48BB78">
              82%
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 2. Top Analytics Row */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "5fr 7fr" }, gap: 4 }}>
        
        {/* Emotion Pie Chart */}
        <Card sx={{ p: 4, borderRadius: "24px", border: "1px solid #EDF2F7", boxShadow: "none" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" fontWeight={800}>Post-Session Emotions</Typography>
            <HeartHandshake size={20} color="#A0AEC0" />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Distribution of user moods submitted at the end of sessions.</Typography>
          <Box sx={{ height: 250, position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={EMOTION_DATA} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                  {EMOTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", mt: -2 }}>
              <Typography variant="h4" fontWeight={900} color="#2D3748">70%</Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: "#48BB78" }}>Positive</Typography>
            </Box>
          </Box>
        </Card>

        {/* Semantic Word Cloud */}
        <Card sx={{ p: 4, borderRadius: "24px", border: "1px solid #EDF2F7", boxShadow: "none", display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" fontWeight={800}>AI Extracted Keywords</Typography>
            <Chip label="Real-time Semantic Scanning" size="small" icon={<TrendingUp size={14} />} sx={{ bgcolor: "#F0FAFA", color: "#1B7B7E", fontWeight: 800, "& .MuiChip-icon": { color: "inherit" } }} />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Frequently appearing phrases from organic text feedback.</Typography>
          
          <Box sx={{ 
            flex: 1, display: "flex", flexWrap: "wrap", gap: 3, alignItems: "center", justifyContent: "center", 
            p: 4, bgcolor: "#F7FAFC", borderRadius: "20px" 
          }}>
            {WORD_CLOUD.map((word, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.1 }}
                style={{ cursor: "default" }}
              >
                <Typography sx={{ 
                  fontSize: word.size, 
                  fontWeight: word.weight, 
                  color: word.color, 
                  lineHeight: 1,
                  opacity: 0.9,
                  textShadow: "0 2px 10px rgba(0,0,0,0.05)"
                }}>
                  {word.text}
                </Typography>
              </motion.div>
            ))}
          </Box>
        </Card>

      </Box>

      {/* 3. Feedback Log Table */}
      <Card sx={{ borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid #EDF2F7", overflow: "hidden" }}>
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "white", borderBottom: "1px solid #EDF2F7" }}>
          <Typography variant="h6" fontWeight={800}>Recent Submissions</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              size="small" placeholder="Search keywords..."
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search size={18} color="#A0AEC0" /></InputAdornment>,
                sx: { borderRadius: "12px", bgcolor: "#F7FAFC" }
              }}
            />
            <Button variant="outlined" startIcon={<Filter size={18} />} sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700, borderColor: "#E2E8F0", color: "#4A5568" }}>Filter</Button>
          </Box>
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#F7FAFC" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: "#718096" }}>USER</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#718096" }}>RATING</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#718096" }}>POST-EMOTION</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#718096" }}>COMMENT</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#718096", whiteSpace: "nowrap" }}>LINKED SESSION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {FEEDBACK_LIST.map((row) => (
                <TableRow key={row.id} hover sx={{ cursor: "pointer", "&:hover": { bgcolor: "#F0FAFA" } }}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: "#CBD5E0", fontSize: "0.85rem", fontWeight: 700 }}>{row.user.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={800} color="#2D3748">{row.user}</Typography>
                        <Typography variant="caption" color="text.secondary">{row.date}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex" }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < row.rating ? "#F6E05E" : "#EDF2F7"} color={i < row.rating ? "#F6E05E" : "#EDF2F7"} />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {EMOTION_DATA.map(e => e.name === row.emotion && (
                      <Chip key={e.name} label={`${e.emoji} ${e.name}`} size="small" sx={{ fontWeight: 700, bgcolor: e.color + "15", color: e.color }} />
                    ))}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography variant="body2" sx={{ color: "#4A5568", fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      "{row.text}"
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={row.session} size="small" onClick={() => router.push(`/admin/sessions/${row.session}`)} sx={{ fontWeight: 800, bgcolor: "#EDF2F7", color: "#2D3748", "&:hover": { bgcolor: "#E2E8F0" } }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

    </Box>
  );
}
