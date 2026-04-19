"use client";

import React, { useState } from "react";
import { Box, Typography, Button, IconButton, Modal, TextField, Rating, Snackbar, Alert, Fade } from "@mui/material";
import { MessageSquareHeart, X, Send, HeartHandshake } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FeedbackFAB() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(4);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const EMOTIONS = [
    { label: "Happy", emoji: "😊", color: "#48BB78" },
    { label: "Relieved", emoji: "😮‍💨", color: "#3182CE" },
    { label: "Stressed", emoji: "😔", color: "#DD6B20" },
    { label: "Connected", emoji: "🥰", color: "#E53E3E" }
  ];

  const handleSubmit = () => {
    setOpen(false);
    setTimeout(() => setShowToast(true), 300);
  };

  return (
    <>
      {/* 1. Floating Action Button */}
      <Box 
        component={motion.div}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed", bottom: 40, right: 40, zIndex: 50,
          bgcolor: "#1B7B7E", color: "white", px: 3, py: 1.5,
          borderRadius: "30px", display: "flex", alignItems: "center", gap: 1.5,
          boxShadow: "0 10px 25px rgba(27,123,126,0.4)", cursor: "pointer"
        }}
      >
        <MessageSquareHeart size={20} />
        <Typography variant="body2" fontWeight={700}>Give Feedback</Typography>
      </Box>

      {/* 2. Feedback Modal */}
      <Modal open={open} onClose={() => setOpen(false)} closeAfterTransition>
        <Fade in={open}>
          <Box sx={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 450 }, bgcolor: "white", borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)", p: 0, overflow: "hidden", outline: "none"
          }}>
            {/* Header */}
            <Box sx={{ p: 3, bgcolor: "#F0FAFA", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E2E8F0" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ p: 1, bgcolor: "white", borderRadius: "10px", color: "#1B7B7E" }}><HeartHandshake size={20} /></Box>
                <Typography variant="h6" fontWeight={800} color="#2D3748">Your Voice Matters</Typography>
              </Box>
              <IconButton onClick={() => setOpen(false)} size="small" sx={{ bgcolor: "white", "&:hover": { bgcolor: "#E2E8F0" } }}><X size={18} /></IconButton>
            </Box>

            {/* Body */}
            <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 4 }}>
              
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>How was your MindFlow experience?</Typography>
                <Rating 
                  value={rating} 
                  onChange={(e, newValue) => setRating(newValue)} 
                  size="large"
                  sx={{ color: "#F6E05E", "& .MuiRating-icon": { mx: 0.5 } }} 
                />
              </Box>

              <Box>
                <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 2 }}>How are you feeling right now?</Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                  {EMOTIONS.map(emo => (
                    <Box 
                      key={emo.label} 
                      onClick={() => setEmotion(emo.label)}
                      sx={{ 
                        flex: 1, textAlign: "center", p: 1.5, borderRadius: "16px", cursor: "pointer",
                        border: emotion === emo.label ? `2px solid ${emo.color}` : "2px solid #EDF2F7",
                        bgcolor: emotion === emo.label ? emo.color + "15" : "transparent",
                        transition: "all 0.2s"
                      }}
                    >
                      <Typography variant="h5" sx={{ mb: 0.5 }}>{emo.emoji}</Typography>
                      <Typography variant="caption" fontWeight={700} color={emotion === emo.label ? emo.color : "text.secondary"}>{emo.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>Tell us more (Optional)</Typography>
                <TextField 
                  multiline rows={3} fullWidth placeholder="What did you like? What can we improve?"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#F7FAFC" } }}
                />
              </Box>

            </Box>

            {/* Footer */}
            <Box sx={{ p: 3, pt: 1 }}>
              <Button 
                onClick={handleSubmit} fullWidth variant="contained" 
                endIcon={<Send size={18} />} 
                sx={{ py: 1.5, borderRadius: "14px", bgcolor: "#1B7B7E", fontWeight: 800, textTransform: "none", fontSize: "1rem", "&:hover": { bgcolor: "#145E61" } }}
              >
                Send Feedback
              </Button>
            </Box>

          </Box>
        </Fade>
      </Modal>

      {/* 3. Success Toast Animation */}
      <Snackbar open={showToast} autoHideDuration={4000} onClose={() => setShowToast(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} sx={{ mb: 10 }}>
        <Alert 
          icon={<HeartHandshake size={24} />} 
          onClose={() => setShowToast(false)} 
          sx={{ width: '100%', fontWeight: 700, borderRadius: "16px", bgcolor: "#1B7B7E", color: "white", boxShadow: "0 10px 40px rgba(27,123,126,0.3)", "& .MuiAlert-icon": { color: "white" }, "& .MuiAlert-action": { color: "white" } }}
        >
          Thank you! Your feedback helps us improve MindFlow.
        </Alert>
      </Snackbar>
    </>
  );
}
