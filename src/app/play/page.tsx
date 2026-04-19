"use client";

import { useState, useCallback } from "react";
import {
  Box, Typography, Button, Container,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip,
} from "@mui/material";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGame, CHARACTERS } from "@/context/GameContext";
import { getQuestionByCode, getAllQuestionCodes } from "@/data/questions";
import type { Question } from "@/data/questions";
import CountdownTimer from "@/components/common/CountdownTimer";
import GlobalTimer from "@/components/common/GlobalTimer";
import QuestionCard from "@/components/common/QuestionCard";
import PageTransition from "@/components/common/PageTransition";
import StopCircleRoundedIcon from "@mui/icons-material/StopCircleRounded";
import StyleTwoToneIcon from '@mui/icons-material/StyleTwoTone';
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import PersonIcon from "@mui/icons-material/Person";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import RecordVoiceOverRoundedIcon from "@mui/icons-material/RecordVoiceOverRounded";

type PlayState = "turn" | "input" | "question" | "result" | "share";

export default function PlayPage() {
  const router = useRouter();
  const {
    players, turnOrder, currentTurnIndex,
    nextTurn, prevTurn, getCurrentPlayer, recordAnswer, finishGame,
    usePassToken,
  } = useGame();

  const [playState, setPlayState] = useState<PlayState>("turn");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [selectedNumberStr, setSelectedNumberStr] = useState<string>("");
  const [inputError, setInputError] = useState("");
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPassTokenModal, setShowPassTokenModal] = useState(false);

  const currentPlayer = getCurrentPlayer();
  const totalTurns = turnOrder.length;
  const char = CHARACTERS.find((c) => c.id === currentPlayer?.characterId);

  // Calculate prefix based on player's ageGroup and role
  const getCardPrefix = () => {
    if (!currentPlayer) return "U";
    const groupMap: Record<string, string> = {
      "ประถม": "P",
      "ม.ต้น": "M",
      "ม.ปลาย": "L",
      "ทั่วไป": "U"
    };
    const prefix = groupMap[currentPlayer.ageGroup] || "U";
    
    if (currentPlayer.role === "child") {
      return prefix;
    } else {
      return `${prefix}${prefix}`; // PP, MM, LL, UU
    }
  };
  const cardPrefix = getCardPrefix();

  const handleCodeSubmit = () => {
    if (!selectedNumberStr) { setInputError("กรุณาใส่หมายเลขการ์ด"); return; }
    const inputCode = selectedNumberStr.padStart(2, "0");
    let code = `${cardPrefix}${inputCode}`;
    let question = getQuestionByCode(code);

    // FALLBACK: If parent card (e.g. PP05) not found, try child card (P05)
    if (!question && cardPrefix.length > 1) {
      const childPrefix = cardPrefix.charAt(0);
      const fallbackCode = `${childPrefix}${inputCode}`;
      question = getQuestionByCode(fallbackCode);
      if (question) {
        console.log(`Fallback to child card: ${fallbackCode}`);
      }
    }

    if (!question) { setInputError("ไม่พบรหัส " + code); return; }
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setInputError("");
    setShowPrivacyModal(true);
  };

  const handleAnswer = (choiceIndex: number) => {
    if (selectedAnswer !== null || !currentQuestion || !currentPlayer) return;
    setSelectedAnswer(choiceIndex);
    setTimerRunning(false);
    const earned = currentQuestion.choices[choiceIndex].traits;
    recordAnswer({
      questionCode: currentQuestion.code,
      playerId: currentPlayer.id,
      selectedAnswerIndex: choiceIndex,
      traitPointsEarned: earned,
    });
    setTimeout(() => setPlayState("result"), 1200);
  };

  const handleTimerComplete = useCallback(() => {
    if (selectedAnswer !== null || !currentQuestion || !currentPlayer) return;
    setTimerRunning(false);
    recordAnswer({
      questionCode: currentQuestion.code,
      playerId: currentPlayer.id,
      selectedAnswerIndex: null,
      traitPointsEarned: {},
    });
    setTimeout(() => setPlayState("result"), 600);
  }, [selectedAnswer, currentQuestion, currentPlayer, recordAnswer]);

  const handleFinishTurn = () => {
    setPlayState("turn");
    setSelectedNumberStr("");
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    nextTurn();
  };

  const handleFinishGame = () => {
    finishGame();
    router.push("/summary");
  };

  if (!currentPlayer) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5">ไม่พบข้อมูลเกม</Typography>
        <Button onClick={() => router.push("/")} sx={{ mt: 2 }}>กลับหน้าแรก</Button>
      </Container>
    );
  }

  return (
    <PageTransition>
      <Container maxWidth="sm" sx={{ py: 3, minHeight: "100vh" }}>
        {/* Top bar */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Chip
            label={`เทิร์น ${currentTurnIndex + 1} / ${totalTurns}`}
            sx={{ backgroundColor: "#1B7B7E", color: "white", fontWeight: 600 }}
          />
          <GlobalTimer onTimeUp={handleFinishGame} />
          <Button
            variant="outlined" color="error" size="small"
            startIcon={<StopCircleRoundedIcon />}
            onClick={() => setConfirmFinish(true)}
            sx={{ borderRadius: 4 }}
          >
            จบเกม
          </Button>
        </Box>

        <AnimatePresence mode="wait">
          {/* ─── TURN DISPLAY ─── */}
          {playState === "turn" && (
            <motion.div key="turn" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
              {/* Current player banner */}
              <Box
                component={motion.div}
                animate={{ scale: [1, 1.015, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                sx={{
                  background: `linear-gradient(135deg, ${char?.baseColor ?? "#1B7B7E"}18, ${char?.baseColor ?? "#1B7B7E"}06)`,
                  border: `3px solid ${char?.baseColor ?? "#1B7B7E"}44`,
                  borderRadius: 5, p: 3, textAlign: "center", mb: 3,
                }}
              >
                {/* Character image */}
                <Box component={motion.div} animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
                  sx={{ width: 120, height: 150, mx: "auto", mb: 1, position: "relative" }}>
                  {char && <Image src={char.image} alt={char.name} fill style={{ objectFit: "contain" }} />}
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>ตาของ</Typography>
                <Typography variant="h4" fontWeight={700} sx={{ color: char?.baseColor ?? "#1B7B7E", mb: 0.5 }}>
                  {currentPlayer.name}
                </Typography>
                <Chip
                  icon={currentPlayer.role === "parent" ? <PersonIcon /> : <ChildCareIcon />}
                  label={currentPlayer.role === "parent" ? "ผู้ปกครอง" : "ลูก"}
                  size="small"
                  sx={{ backgroundColor: "white", border: `1px solid ${char?.baseColor ?? "#1B7B7E"}44` }}
                />
              </Box>

              {/* Action buttons */}
              <Button variant="contained" color="primary" fullWidth size="large"
                startIcon={<StyleTwoToneIcon />} onClick={() => setPlayState("input")}
                sx={{ py: 2, mb: 2, fontSize: "1.1rem" }}>
                เล่นการ์ด
              </Button>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="outlined" onClick={prevTurn} startIcon={<UndoRoundedIcon />}
                  sx={{ flex: 1, py: 1.5, borderRadius: 4 }}>
                  ย้อนกลับ
                </Button>
                <Button variant="contained" color="success"
                  startIcon={<CheckCircleRoundedIcon />}
                  onClick={() => nextTurn()}
                  sx={{ flex: 2, py: 1.5, borderRadius: 4, background: "linear-gradient(135deg, #4CAF50, #81C784)", boxShadow: "0 4px 15px rgba(76,175,80,0.3)" }}>
                  จบเทิร์น
                </Button>
              </Box>

              {/* Mini player list */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>ผู้เล่นทั้งหมด</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {turnOrder.map((id, i) => {
                    const p = players.find((pl) => pl.id === id);
                    if (!p) return null;
                    const pChar = CHARACTERS.find((c) => c.id === p.characterId);
                    const isActive = i === currentTurnIndex;
                    return (
                      <Box key={p.id}
                        component={motion.div}
                        animate={isActive ? { scale: 1.02 } : { scale: 1 }}
                        sx={{
                          display: "flex", alignItems: "center", gap: 1.5, p: 1.5,
                          borderRadius: 3, backgroundColor: "white",
                          border: `2px solid ${isActive ? (pChar?.baseColor ?? "#1B7B7E") : "transparent"}`,
                          boxShadow: isActive ? `0 4px 15px ${pChar?.baseColor ?? "#1B7B7E"}22` : "none",
                        }}>
                        <Box sx={{ width: 36, height: 44, position: "relative", flexShrink: 0 }}>
                          {pChar && <Image src={pChar.image} alt={pChar.name} fill style={{ objectFit: "contain" }} />}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight={isActive ? 700 : 400}
                            sx={{ color: isActive ? pChar?.baseColor : "text.primary" }}>
                            {p.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ตอบแล้ว {p.stats.questionsAnswered} ข้อ · 🗝️ {p.stats.passTokens} Pass
                          </Typography>
                        </Box>
                        {isActive && <Chip label="ตาเล่น" size="small" sx={{ backgroundColor: pChar?.baseColor + "22", color: pChar?.baseColor, fontWeight: 600 }} />}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </motion.div>
          )}

          {/* ─── CARD CODE CHIP SELECTOR ─── */}
          {playState === "input" && (
            <motion.div key="input" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.3 }}>
              <Box sx={{ backgroundColor: "white", borderRadius: 4, p: 3, boxShadow: "0 8px 30px rgba(0,0,0,0.08)", textAlign: "center" }}>
                {/* Character */}
                <Box sx={{ width: 72, height: 90, mx: "auto", mb: 1.5, position: "relative" }}>
                  {char && <Image src={char.image} alt={char.name} fill style={{ objectFit: "contain" }} />}
                </Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, color: "#1B7B7E" }}>เลือกรหัสการ์ด</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>เลือกตัวอักษร แล้วเลือกเลข</Typography>

                {/* ── Numpad ── */}
                  <Box component={motion.div} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Typography variant="caption" fontWeight={700} sx={{ color: "#718096", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", mb: 1.5 }}>
                      พิมพ์รหัสการ์ดบนโต๊ะของตนเอง
                    </Typography>
                    
                    {/* Display current typed number */}
                    <Box sx={{ mb: 2, height: 48, display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <Typography fontWeight={700} sx={{
                        fontSize: "2rem", letterSpacing: "0.15em",
                        color: selectedNumberStr ? "#2D3748" : "#CBD5E0",
                        borderBottom: selectedNumberStr ? "2px solid #1B7B7E" : "1px dashed #CBD5E0",
                        minWidth: 80, pb: 0.5
                      }}>
                        {selectedNumberStr || "_ _"}
                      </Typography>
                    </Box>

                    {/* 3x4 Numpad */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1.5, mb: 2.5, maxWidth: 240, mx: "auto" }}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                        <Box
                          key={n}
                          component={motion.div}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (selectedNumberStr.length >= 2) return;
                            setSelectedNumberStr(prev => prev + n.toString());
                            setInputError("");
                          }}
                          sx={{
                            py: 1.5, borderRadius: 3, cursor: "pointer",
                            backgroundColor: "#F7FAFC",
                            border: "1px solid #E2E8F0",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                            display: "flex", justifyContent: "center", alignItems: "center",
                          }}
                        >
                          <Typography fontWeight={700} sx={{ color: "#4A5568", fontSize: "1.25rem" }}>
                            {n}
                          </Typography>
                        </Box>
                      ))}

                      {/* Empty bottom-left (or could be clear all) */}
                      <Box sx={{ visibility: "hidden" }} />

                      {/* 0 */}
                      <Box
                        component={motion.div}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (selectedNumberStr.length >= 2) return;
                          setSelectedNumberStr(prev => prev + "0");
                          setInputError("");
                        }}
                        sx={{
                          py: 1.5, borderRadius: 3, cursor: "pointer",
                          backgroundColor: "#F7FAFC",
                          border: "1px solid #E2E8F0",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                          display: "flex", justifyContent: "center", alignItems: "center",
                        }}
                      >
                        <Typography fontWeight={700} sx={{ color: "#4A5568", fontSize: "1.25rem" }}>0</Typography>
                      </Box>

                      {/* Delete */}
                      <Box
                        component={motion.div}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedNumberStr(prev => prev.slice(0, -1));
                          setInputError("");
                        }}
                        sx={{
                          py: 1.5, borderRadius: 3, cursor: "pointer",
                          backgroundColor: "#FEFCBF",
                          border: "1px solid #F6E05E",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                          display: "flex", justifyContent: "center", alignItems: "center",
                        }}
                      >
                        <Typography fontWeight={700} sx={{ color: "#D69E2E", fontSize: "1.1rem" }}>
                          ⌫
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                {/* ── Preview ── */}
                {selectedNumberStr && (
                  <Box component={motion.div} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2.5, py: 1,
                      borderRadius: 3, mb: 2, mt: 2,
                      background: "linear-gradient(135deg, #1B7B7E18, #5BB8A818)",
                      border: "1.5px solid #1B7B7E44",
                    }}
                  >
                    <Typography sx={{ fontSize: "1rem" }}>🃏</Typography>
                    <Typography fontWeight={700} sx={{ color: "#1B7B7E", fontSize: "1.1rem", letterSpacing: "0.08em" }}>
                      {cardPrefix}{selectedNumberStr.padStart(2, "0")}
                    </Typography>
                  </Box>
                )}

                {inputError && (
                  <Typography variant="caption" sx={{ color: "#F44336", display: "block", mb: 1.5 }}>{inputError}</Typography>
                )}

                {/* ── Actions ── */}
                <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                  <Button variant="outlined" onClick={() => { setPlayState("turn"); setSelectedNumberStr(""); setInputError(""); }}
                    sx={{ flex: 1, py: 1.5, borderRadius: 3 }}>ยกเลิก</Button>
                  <Button variant="contained" color="primary" onClick={handleCodeSubmit}
                    disabled={!selectedNumberStr}
                    sx={{ flex: 2, py: 1.5, borderRadius: 3, fontSize: "1rem", fontWeight: 700, color: "white" }}>ยืนยัน</Button>
                </Box>
              </Box>
            </motion.div>
          )}


          {/* ─── QUESTION + TIMER ─── */}
          {(playState === "question" || playState === "result" || playState === "share") && currentQuestion && (
            <motion.div key="question" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <CountdownTimer
                  key={timerKey} seconds={30} onComplete={handleTimerComplete}
                  isRunning={timerRunning} size={120}
                />
              </Box>

              <QuestionCard
                question={currentQuestion} onAnswer={handleAnswer}
                selectedAnswer={selectedAnswer} disabled={!timerRunning}
              />

              {/* After answer */}
              {(playState === "result" || playState === "share") && (
                <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} sx={{ mt: 3 }}>
                  <Box sx={{ textAlign: "center", p: 2.5, borderRadius: 3, backgroundColor: "#E8F5FE", mb: 2 }}>
                    <Typography variant="h6" fontWeight={600} color="#1B7B7E">
                      {selectedAnswer === null ? "⏰ หมดเวลา!" : "✨ บันทึกคำตอบแล้ว!"}
                    </Typography>
                  </Box>

                  {playState === "result" && selectedAnswer !== null && (
                    <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<RecordVoiceOverRoundedIcon />}
                        onClick={() => setShowShareModal(true)}
                        sx={{
                          py: 1.5,
                          background: "linear-gradient(135deg, #4CAF50, #81C784)",
                          boxShadow: "0 4px 15px rgba(76,175,80,0.3)",
                        }}
                      >
                        แชร์เหตุผล
                      </Button>
                      <Button
                        variant="contained"
                        fullWidth
                        disabled={currentPlayer.stats.passTokens <= 0}
                        startIcon={<VpnKeyRoundedIcon />}
                        onClick={() => setShowPassTokenModal(true)}
                        sx={{
                          py: 1.5,
                          background: "linear-gradient(135deg, #E8A030, #F4C47C)",
                          boxShadow: "0 4px 15px rgba(232,160,48,0.3)",
                          color: "white",
                        }}
                      >
                        ใช้ Pass Token ({currentPlayer.stats.passTokens})
                      </Button>
                    </Box>
                  )}


                  {(playState === "share" || selectedAnswer === null) && (
                    <Button variant="contained" color="success" fullWidth
                      startIcon={<CheckCircleRoundedIcon />} onClick={handleFinishTurn}
                      sx={{ mt: 1, py: 1.5, background: "linear-gradient(135deg, #1B7B7E, #5BB8A8)" }}>
                      จบเทิร์น
                    </Button>
                  )}
                </Box>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Finish game dialog */}
        <Dialog open={confirmFinish} onClose={() => setConfirmFinish(false)} PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
          <DialogTitle sx={{ fontWeight: 600 }}>จบเกม?</DialogTitle>
          <DialogContent>
            <Typography>คุณต้องการจบเกมและดูสรุปผลความสัมพันธ์หรือไม่?</Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={() => setConfirmFinish(false)} sx={{ borderRadius: 3 }}>ยกเลิก</Button>
            <Button variant="contained" color="error" onClick={handleFinishGame} sx={{ borderRadius: 3 }}>จบเกม</Button>
          </DialogActions>
        </Dialog>

        {/* ─── PRIVACY CONFIRM MODAL ─── */}
        <Dialog
          open={showPrivacyModal}
          onClose={() => { setShowPrivacyModal(false); setCurrentQuestion(null); }}
          PaperProps={{ sx: { borderRadius: 2, p: 0, overflow: "hidden", maxWidth: 400 } }}
        >
          <Box sx={{
            textAlign: "center", p: 4,
            background: "linear-gradient(145deg, #FFF8E1, #FFFDE7)",
          }}>
            <Box sx={{ fontSize: "4rem", mb: 1 }}>📱</Box>
            <Box sx={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 52, height: 52, borderRadius: "50%",
              backgroundColor: "#FFF3E0", border: "2px solid #FFB74D", mb: 2,
            }}>
              <Typography sx={{ fontSize: "1.6rem" }}>🔒</Typography>
            </Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: "#E65100", mb: 1 }}>
              เตรียมตัวก่อนเริ่ม!
            </Typography>
            <Typography variant="body1" sx={{ color: "#5D4037", lineHeight: 1.8, mb: 2, fontWeight: 500 }}>
              กรุณายกมือถือโดยไม่ให้ใครเห็น<br />คำถามก่อนเริ่มตอบคำถาม
            </Typography>
            {currentQuestion && (
              <Box sx={{
                display: "inline-flex", alignItems: "center", gap: 1,
                backgroundColor: "#FFF3E0", borderRadius: 3, px: 2.5, py: 0.75, mb: 2,
                border: "1px solid #FFCC80",
              }}>
                <Typography variant="body2" fontWeight={600} sx={{ color: "#E65100" }}>
                  🃏 การ์ด {currentQuestion.code}
                </Typography>
                <Typography variant="caption" sx={{ color: "#8D6E63" }}>
                  ({currentQuestion.ageGroup})
                </Typography>
              </Box>
            )}
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <Button fullWidth variant="outlined" onClick={() => { setShowPrivacyModal(false); setCurrentQuestion(null); }}
                sx={{ py: 1.5, borderRadius: 3, borderColor: "#BDBDBD", color: "#757575", fontWeight: 600 }}>
                ← ย้อนกลับ
              </Button>
              <Button fullWidth variant="contained" onClick={() => {
                setShowPrivacyModal(false);
                setTimerKey((k) => k + 1);
                setTimerRunning(true);
                setPlayState("question");
              }} sx={{
                py: 1.5, borderRadius: 3,
                background: "linear-gradient(135deg, #FF9800, #F57C00)",
                fontWeight: 700, boxShadow: "0 4px 14px rgba(255,152,0,0.35)",
                "&:hover": { background: "linear-gradient(135deg, #F57C00, #EF6C00)" },
              }}>
                ✅ ตกลง
              </Button>
            </Box>
          </Box>
        </Dialog>

        {/* ─── SHARE CONFIRM MODAL ─── */}
        <Dialog
          open={showShareModal}
          onClose={() => setShowShareModal(false)}
          PaperProps={{ sx: { borderRadius: 4, p: 0, overflow: "hidden", maxWidth: 400 } }}
        >
          <Box sx={{
            textAlign: "center", p: 4,
            background: "linear-gradient(145deg, #E8F5E9, #F1F8E9)",
          }}>
            <Box sx={{ fontSize: "3.5rem", mb: 1 }}>🗣️</Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: "#2E7D32", mb: 1 }}>
              แชร์คำตอบของคุณ
            </Typography>

            {/* Selected Answer Display */}
            {currentQuestion && selectedAnswer !== null && (
              <Box sx={{
                my: 2.5, p: 2,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                borderRadius: 3,
                border: "2px solid #A5D6A7",
                boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                backdropFilter: "blur(4px)"
              }}>
                <Typography variant="caption" sx={{ color: "#2E7D32", fontWeight: 700, display: "block", mb: 0.5, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  คำตอบที่คุณเลือก
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ color: "#1B5E20" }}>
                  {currentQuestion.choices[selectedAnswer].text}
                </Typography>
              </Box>
            )}

            <Typography variant="body1" sx={{ color: "#33691E", lineHeight: 1.6, mb: 3, fontWeight: 500 }}>
              แชร์คำตอบนี้กับผู้เล่นคนอื่น ๆ
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button fullWidth variant="outlined" onClick={() => setShowShareModal(false)}
                sx={{ py: 1.5, borderRadius: 3, borderColor: "#A5D6A7", color: "#2E7D32", fontWeight: 600 }}>
                ← ย้อนกลับ
              </Button>
              <Button fullWidth variant="contained" onClick={() => { setShowShareModal(false); setPlayState("share"); }}
                sx={{
                  py: 1.5, borderRadius: 3,
                  background: "linear-gradient(135deg, #4CAF50, #66BB6A)",
                  fontWeight: 700, boxShadow: "0 4px 14px rgba(76,175,80,0.35)",
                  "&:hover": { background: "linear-gradient(135deg, #388E3C, #4CAF50)" },
                }}>
                ✅ ตกลง
              </Button>
            </Box>
          </Box>
        </Dialog>

        {/* ─── PASS TOKEN CONFIRM MODAL ─── */}
        <Dialog
          open={showPassTokenModal}
          onClose={() => setShowPassTokenModal(false)}
          PaperProps={{ sx: { borderRadius: 2, p: 0, overflow: "hidden", maxWidth: 400 } }}
        >
          <Box sx={{
            textAlign: "center", p: 4,
            background: "linear-gradient(145deg, #FFF8E1, #FFF3E0)",
          }}>
            <Box sx={{ fontSize: "3.5rem", mb: 1 }}>🗝️</Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: "#E65100", mb: 1 }}>
              ใช้ Pass Token?
            </Typography>
            <Typography variant="body1" sx={{ color: "#5D4037", lineHeight: 1.8, mb: 1, fontWeight: 500 }}>
              ข้ามการแชร์เหตุผลและจบเทิร์นทันที
            </Typography>
            <Box sx={{
              backgroundColor: "white",
              borderRadius: 2,
              p: 1.5,
              mb: 2.5,
              border: "1px dashed #E8A030"
            }}>
              <Typography variant="body2" sx={{ color: "#8D6E63", fontWeight: 500 }}>
                หากมี Pass Token เหลือ สามารถใช้ 2 เหรียญเพื่อข้ามการแชร์เหตุผลได้
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button fullWidth variant="outlined" onClick={() => setShowPassTokenModal(false)}
                sx={{ py: 1.5, borderRadius: 3, borderColor: "#BDBDBD", color: "#757575", fontWeight: 600 }}>
                ← ย้อนกลับ
              </Button>
              <Button fullWidth variant="contained" onClick={() => {
                setShowPassTokenModal(false);
                if (currentPlayer) { usePassToken(currentPlayer.id); }
                handleFinishTurn();
              }} sx={{
                py: 1.5, borderRadius: 3,
                background: "linear-gradient(135deg, #E8A030, #F4C47C)",
                fontWeight: 700, boxShadow: "0 4px 14px rgba(232,160,48,0.35)",
                color: "white",
                "&:hover": { background: "linear-gradient(135deg, #D4972E, #E8A030)" },
              }}>
                ✅ ใช้ Token
              </Button>
            </Box>
          </Box>
        </Dialog>
      </Container>
    </PageTransition>
  );
}
