"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Slide, CircularProgress } from "@mui/material";
import { Heart, Star, Sparkles, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SessionSummary() {
  const router = useRouter();
  const [step, setStep] = useState<"summary" | "feedback" | "thanks">("summary");
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const EMOTIONS = [
    { label: "Happy", emoji: "😊", color: "#48BB78" },
    { label: "Relieved", emoji: "😮‍💨", color: "#3182CE" },
    { label: "Stressed", emoji: "😔", color: "#DD6B20" },
    { label: "Connected", emoji: "🥰", color: "#E53E3E" }
  ];

  const handleFeedbackSubmit = () => {
    setStep("thanks");
    setTimeout(() => {
      router.push("/");
    }, 2500);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", bgcolor: "#1B7B7E", color: "white", p: 4, position: "relative", overflow: "hidden" }}>
      
      {/* Background Graphic */}
      <Box sx={{ position: "absolute", top: -100, right: -100, opacity: 0.1 }}>
        <Sparkles size={400} />
      </Box>

      <Box sx={{ zIndex: 1, textAlign: "center", width: "100%", maxWidth: 600 }}>
        
        <AnimatePresence mode="wait">
          
          {/* STEP 1: SUMMARY */}
          {step === "summary" && (
            <motion.div key="summary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Box sx={{ display: "inline-flex", p: 3, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.1)", mb: 3 }}>
                <Star size={48} color="#F6E05E" fill="#F6E05E" />
              </Box>
              <Typography variant="h3" fontWeight={900} sx={{ mb: 2 }}>Session Complete!</Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 6, fontWeight: 500 }}>
                You've successfully finished Module 1: The Inner Explorer.
              </Typography>

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 6 }}>
                <Box sx={{ p: 3, bgcolor: "rgba(255,255,255,0.1)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <Typography variant="body1" sx={{ opacity: 0.8, mb: 1 }}>Tokens Earned</Typography>
                  <Typography variant="h4" fontWeight={800} color="#F6E05E">+150 🪙</Typography>
                </Box>
                <Box sx={{ p: 3, bgcolor: "rgba(255,255,255,0.1)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <Typography variant="body1" sx={{ opacity: 0.8, mb: 1 }}>Deep Answers</Typography>
                  <Typography variant="h4" fontWeight={800} color="#48BB78">4 💬</Typography>
                </Box>
              </Box>

              <Button onClick={() => setStep("feedback")} variant="contained" fullWidth sx={{ py: 2, borderRadius: "16px", bgcolor: "white", color: "#1B7B7E", fontSize: "1.1rem", fontWeight: 800, "&:hover": { bgcolor: "#F0FAFA" } }}>
                Continue
              </Button>
            </motion.div>
          )}

          {/* STEP 2: INLINE FEEDBACK */}
          {step === "feedback" && (
            <motion.div key="feedback" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>Before you go...</Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 5 }}>
                How are you feeling after this session? Your clinical team uses this to improve future modules.
              </Typography>

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 6 }}>
                {EMOTIONS.map((emo) => (
                  <Box 
                    component={motion.div} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    key={emo.label} onClick={() => setSelectedEmotion(emo.label)}
                    sx={{
                      p: 3, borderRadius: "20px", cursor: "pointer", transition: "all 0.2s",
                      bgcolor: selectedEmotion === emo.label ? "white" : "rgba(255,255,255,0.1)",
                      border: "2px solid", borderColor: selectedEmotion === emo.label ? "white" : "transparent"
                    }}
                  >
                    <Typography variant="h3" sx={{ mb: 1 }}>{emo.emoji}</Typography>
                    <Typography variant="body1" fontWeight={700} sx={{ color: selectedEmotion === emo.label ? "#1B7B7E" : "white" }}>
                      {emo.label}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Button disabled={!selectedEmotion} onClick={handleFeedbackSubmit} variant="contained" fullWidth sx={{ py: 2, borderRadius: "16px", bgcolor: "#48BB78", color: "white", fontSize: "1.1rem", fontWeight: 800, "&:hover": { bgcolor: "#38A169" } }}>
                Submit Feedback
              </Button>
              <Button onClick={() => router.push("/")} sx={{ mt: 2, color: "rgba(255,255,255,0.6)", textTransform: "none", fontWeight: 600 }}>
                Skip
              </Button>
            </motion.div>
          )}

          {/* STEP 3: THANKS ANIMATION */}
          {step === "thanks" && (
            <motion.div key="thanks" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
              <Box sx={{ display: "inline-flex", p: 4, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.2)", mb: 4 }}>
                <Heart size={64} color="#F56565" fill="#F56565" />
              </Box>
              <Typography variant="h3" fontWeight={900} sx={{ mb: 2 }}>Thank You!</Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }}>
                Your insights directly shape the MindFlow experience.
              </Typography>
              <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
                <CircularProgress sx={{ color: "rgba(255,255,255,0.5)" }} />
              </Box>
            </motion.div>
          )}

        </AnimatePresence>

      </Box>
    </Box>
  );
}
