"use client";

import { useState, useCallback } from "react";
import {
  Box, Typography, Button, Container, TextField,
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
  const [questionCode, setQuestionCode] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [inputError, setInputError] = useState("");
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPassTokenModal, setShowPassTokenModal] = useState(false);

  const currentPlayer = getCurrentPlayer();
  const totalTurns = turnOrder.length;
  const char = CHARACTERS.find((c) => c.id === currentPlayer?.characterId);

  const handleCodeSubmit = () => {
    const code = questionCode.trim().toUpperCase();
    if (!code) { setInputError("กรุณาใส่รหัสคำถาม"); return; }
    const question = getQuestionByCode(code);
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
    setQuestionCode("");
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

          {/* ─── QUESTION CODE INPUT ─── */}
          {playState === "input" && (
            <motion.div key="input" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.3 }}>
              <Box sx={{ backgroundColor: "white", borderRadius: 4, p: 4, boxShadow: "0 8px 30px rgba(0,0,0,0.08)", textAlign: "center" }}>
                {/* Small character */}
                <Box sx={{ width: 80, height: 100, mx: "auto", mb: 2, position: "relative" }}>
                  {char && <Image src={char.image} alt={char.name} fill style={{ objectFit: "contain" }} />}
                </Box>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 1, color: "#1B7B7E" }}>ใส่รหัสคำถาม</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  ใส่รหัสจากการ์ดคำถาม
                </Typography>
                {(() => { const codes = getAllQuestionCodes(); return (
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block", textAlign: "center" }}>
                    รหัสที่ใช้ได้: {codes[0]} – {codes[codes.length - 1]}
                  </Typography>
                ); })()}
                <TextField
                  fullWidth placeholder={`เช่น ${getAllQuestionCodes()[0]}`}
                  value={questionCode}
                  onChange={(e) => { setQuestionCode(e.target.value); setInputError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleCodeSubmit()}
                  error={!!inputError} helperText={inputError}
                  sx={{ mb: 3, "& input": { textAlign: "center", fontSize: "1.5rem", fontWeight: 600, letterSpacing: "0.1em" } }}
                />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button variant="outlined" onClick={() => setPlayState("turn")} sx={{ flex: 1, py: 1.5 }}>ยกเลิก</Button>
                  <Button variant="contained" color="primary" onClick={handleCodeSubmit} sx={{ flex: 2, py: 1.5, fontSize: "1.1rem" }}>ยืนยัน</Button>
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
          PaperProps={{ sx: { borderRadius: 2, p: 0, overflow: "hidden", maxWidth: 400 } }}
        >
          <Box sx={{
            textAlign: "center", p: 4,
            background: "linear-gradient(145deg, #E8F5E9, #F1F8E9)",
          }}>
            <Box sx={{ fontSize: "3.5rem", mb: 1 }}>🗣️</Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: "#2E7D32", mb: 1 }}>
              แชร์คำตอบของคุณ
            </Typography>
            <Typography variant="body1" sx={{ color: "#33691E", lineHeight: 1.8, mb: 2.5, fontWeight: 500 }}>
              กรุณาเลือกแชร์คำถามและคำตอบ<br />กับผู้เล่น 1 คน
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
            <Typography variant="body2" sx={{ color: "#8D6E63", mb: 2.5 }}>
              คุณมี Pass Token เหลือ {currentPlayer?.stats.passTokens ?? 0} ชิ้น
            </Typography>
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
