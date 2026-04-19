"use client";

import { useState } from "react";
import {
  Box, Typography, Button, Container, TextField,
  ToggleButtonGroup, ToggleButton, Alert,
} from "@mui/material";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGame, CHARACTERS } from "@/context/GameContext";
import type { PlayerRole, AgeGroup } from "@/context/GameContext";
import PageTransition from "@/components/common/PageTransition";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PersonIcon from "@mui/icons-material/Person";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import CloseIcon from "@mui/icons-material/Close";

export default function SetupPage() {
  const router = useRouter();
  const { players, addPlayer, removePlayer, setTurnOrder, setGamePhase, timeLimit, setTimeLimit } = useGame();
  const [name, setName] = useState("");
  const [role, setRole] = useState<PlayerRole>("parent");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("ประถม");
  const [selectedChar, setSelectedChar] = useState(CHARACTERS[0].id);
  const [error, setError] = useState("");

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) { setError("กรุณาใส่ชื่อผู้เล่น"); return; }
    if (players.length >= 5) { setError("ผู้เล่นเต็มแล้ว (สูงสุด 5 คน)"); return; }
    addPlayer(trimmed, role, ageGroup, selectedChar);
    setName("");
    setError("");
  };

  const handleNext = () => {
    if (players.length < 2) { setError("ต้องมีผู้เล่นอย่างน้อย 2 คน"); return; }
    setTurnOrder(players.map((p) => p.id));
    setGamePhase("ordering");
    router.push("/order");
  };

  return (
    <PageTransition>
      <Container maxWidth="sm" sx={{ py: 4, minHeight: "100vh" }}>
        {/* Back button */}
        <Box sx={{ mb: 1 }}>
          <Button
            onClick={() => router.back()}
            startIcon={<ArrowBackRoundedIcon />}
            sx={{
              color: "#1B7B7E", textTransform: "none", fontWeight: 500,
              borderRadius: 3, px: 1.5, py: 0.75,
              "&:hover": { backgroundColor: "#1B7B7E18" },
            }}
          >
            ย้อนกลับ
          </Button>
        </Box>

        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight={600} sx={{ color: "#1B7B7E", mb: 1 }}>
            ตั้งค่าผู้เล่น
          </Typography>
          <Typography variant="body1" color="text.secondary">
            เพิ่มผู้เล่น 2–5 คน พร้อมเลือกตัวละครและบทบาท
          </Typography>
        </Box>

        {/* Add player card */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{ backgroundColor: "white", borderRadius: 2, p: 3, mb: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
        >
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            เพิ่มผู้เล่น ({players.length}/5)
          </Typography>

          {/* Character picker */}
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>เลือกตัวละคร</Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 2, justifyContent: "center" }}>
            {CHARACTERS.map((char) => {
              const isSelected = selectedChar === char.id;
              return (
                <Box
                  key={char.id}
                  component={motion.div}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedChar(char.id)}
                  sx={{
                    position: "relative",
                    width: 100,
                    height: 100,
                    borderRadius: 2,
                    overflow: "visible",
                    cursor: "pointer",
                    border: `3px solid ${isSelected ? char.baseColor : "transparent"}`,
                    backgroundColor: isSelected ? char.baseColor + "18" : "transparent",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transition: "all 0.2s",
                  }}
                >
                  <Image src={char.image} alt={char.name} width={70} height={80} style={{ objectFit: "contain" }} />
                  <Typography variant="caption" fontWeight={600} sx={{ color: char.baseColor, mt: 0.25, fontSize: "0.65rem" }}>
                    {char.name}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* Name */}
          <TextField
            fullWidth
            placeholder="ชื่อผู้เล่น"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 20 }}
          />

          {/* Role toggle */}
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>บทบาท</Typography>
          <ToggleButtonGroup
            value={role} exclusive
            onChange={(_, val) => val && setRole(val)}
            fullWidth sx={{ mb: 2 }}
          >
            <ToggleButton value="parent" sx={{ borderRadius: "12px !important", mr: 1, textTransform: "none", fontWeight: 500, "&.Mui-selected": { backgroundColor: "#E8F5E9", color: "#2E7D32", borderColor: "#4CAF50" } }}>
              <PersonIcon sx={{ mr: 0.5 }} /> ผู้ปกครอง
            </ToggleButton>
            <ToggleButton value="child" sx={{ borderRadius: "12px !important", textTransform: "none", fontWeight: 500, "&.Mui-selected": { backgroundColor: "#FFF3E0", color: "#E65100", borderColor: "#FF9800" } }}>
              <ChildCareIcon sx={{ mr: 0.5 }} /> ลูก
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Age Group toggle */}
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>ช่วงวัย</Typography>
          <ToggleButtonGroup
            value={ageGroup} exclusive
            onChange={(_, val) => val && setAgeGroup(val)}
            fullWidth sx={{ mb: 3 }}
          >
            <ToggleButton value="ประถม" sx={{ borderRadius: "12px !important", mr: 1, fontWeight: 500 }}>
              ประถม
            </ToggleButton>
            <ToggleButton value="ม.ต้น" sx={{ borderRadius: "12px !important", mr: 1, fontWeight: 500 }}>
              ม.ต้น
            </ToggleButton>
            <ToggleButton value="ม.ปลาย" sx={{ borderRadius: "12px !important", mr: 1, fontWeight: 500 }}>
              ม.ปลาย
            </ToggleButton>
            <ToggleButton value="ทั่วไป" sx={{ borderRadius: "12px !important", fontWeight: 500 }}>
              ทั่วไป
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained" color="secondary" fullWidth
            onClick={handleAdd} startIcon={<PersonAddAltRoundedIcon />}
            disabled={players.length >= 5} sx={{ py: 1.5 }}
          >
            เพิ่มผู้เล่น
          </Button>
        </Box>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <Alert severity="warning" sx={{ mb: 2, borderRadius: 3 }} onClose={() => setError("")}>{error}</Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player list */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 4 }}>
          <AnimatePresence mode="popLayout">
            {players.map((player, i) => {
              const char = CHARACTERS.find((c) => c.id === player.characterId);
              return (
                <Box
                  key={player.id}
                  component={motion.div}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  sx={{
                    display: "flex", alignItems: "center", gap: 2, p: 2,
                    borderRadius: 3, backgroundColor: "white",
                    border: `2px solid ${char?.baseColor ?? "#ddd"}22`,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Character image */}
                  <Box sx={{ width: 52, height: 64, flexShrink: 0, position: "relative" }}>
                    {char && <Image src={char.image} alt={char.name} fill style={{ objectFit: "contain" }} />}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={600} sx={{ color: char?.baseColor }}>{player.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {char?.name} · {player.role === "parent" ? "ผู้ปกครอง" : "ลูก"} ({player.ageGroup})
                    </Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 700, color: "#CCC", mr: 0.5 }}>#{i + 1}</Typography>
                  <Box
                    component={motion.div} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => removePlayer(player.id)}
                    sx={{ cursor: "pointer", color: "#CCC", "&:hover": { color: "#F44336" }, p: 0.5 }}
                  >
                    <CloseIcon fontSize="small" />
                  </Box>
                </Box>
              );
            })}
          </AnimatePresence>

          {players.length === 0 && (
            <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
              <Typography variant="h3" sx={{ mb: 1 }}>👥</Typography>
              <Typography>ยังไม่มีผู้เล่น</Typography>
            </Box>
          )}
        </Box>

        {/* Settings: Game Timer */}
        {players.length >= 2 && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ backgroundColor: "white", borderRadius: 2, p: 3, mb: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
          >
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              ตั้งเวลาการเล่น
            </Typography>
            <ToggleButtonGroup
              color="primary"
              value={timeLimit}
              exclusive
              onChange={(_, val) => val && setTimeLimit(val)}
              fullWidth
            >
              <ToggleButton value={45} sx={{ py: 1.5, fontWeight: 600 }}>45 นาที</ToggleButton>
              <ToggleButton value={60} sx={{ py: 1.5, fontWeight: 600 }}>60 นาที</ToggleButton>
              <ToggleButton value={90} sx={{ py: 1.5, fontWeight: 600 }}>90 นาที</ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5, textAlign: "center" }}>
              *แนะนำ 60 นาทีสำหรับผู้เล่น 3 คนขึ้นไป
            </Typography>
          </Box>
        )}

        {players.length >= 2 && (
          <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            sx={{ position: "sticky", bottom: 16, zIndex: 10 }}>
            <Button variant="contained" color="primary" fullWidth size="large"
              onClick={handleNext} endIcon={<ArrowForwardRoundedIcon />} sx={{ py: 2, fontSize: "1.1rem" }}>
              ถัดไป – เลือกลำดับ
            </Button>
          </Box>
        )}
      </Container>
    </PageTransition>
  );
}
