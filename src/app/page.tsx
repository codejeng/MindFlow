"use client";

import { Box, Typography, Button, Container } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import FavoriteIcon from "@mui/icons-material/Favorite";

// Floating shape component
function FloatingShape({
  color,
  size,
  x,
  y,
  delay,
}: {
  color: string;
  size: number;
  x: string;
  y: string;
  delay: number;
}) {
  return (
    <Box
      component={motion.div}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 10, -10, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      sx={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size > 60 ? "40%" : "50%",
        background: color,
        left: x,
        top: y,
        opacity: 0.15,
        filter: "blur(2px)",
        pointerEvents: "none",
      }}
    />
  );
}

export default function Home() {
  const router = useRouter();

  return (
    <Container maxWidth="sm" sx={{ position: "relative", minHeight: "100vh" }}>
      {/* Floating background shapes */}
      <FloatingShape color="#8FD4C8" size={120} x="5%" y="10%" delay={0} />
      <FloatingShape color="#F0A0B0" size={80} x="80%" y="15%" delay={1} />
      <FloatingShape color="#B8E4F0" size={100} x="70%" y="60%" delay={2} />
      <FloatingShape color="#F5EBC8" size={90} x="10%" y="70%" delay={1.5} />
      <FloatingShape color="#1B7B7E" size={60} x="85%" y="80%" delay={0.5} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          py: 4,
        }}
      >
        {/* Logo */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Cloud shape behind logo */}
          <Box
            sx={{
              position: "relative",
              display: "inline-block",
              mb: 2,
            }}
          >
            <Box
              component={motion.div}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              sx={{
                background: "linear-gradient(135deg, #8FD4C8 0%, #B8E4F0 50%, #D6F0F8 100%)",
                borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                px: 6,
                py: 5,
                position: "relative",
              }}
            >
              {/* Bird silhouettes */}
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 20,
                  fontSize: "1.5rem",
                  opacity: 0.4,
                }}
              >
                ✈ ✈
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  color: "#1B7B7E",
                  lineHeight: 0.9,
                  letterSpacing: "-0.03em",
                  fontSize: { xs: "3rem", sm: "4rem" },
                }}
              >
                mind
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  color: "#1B7B7E",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  fontSize: { xs: "3rem", sm: "4rem" },
                  mt: -0.5,
                }}
              >
                flow
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="subtitle1"
            sx={{
              color: "#1B7B7E",
              fontWeight: 500,
              letterSpacing: "0.1em",
              fontSize: "1.1rem",
              mb: 1,
            }}
          >
            Board Game
          </Typography>
        </Box>


        {/* Tagline */}
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              fontWeight: 400,
              fontStyle: "italic",
              mb: 1,
            }}
          >
            The Path To Understanding
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#F0A0B0", fontWeight: 500, mb: 4 }}
          >
            ... เส้นทางแห่งความเข้าใจ ...
          </Typography>
        </Box>

        {/* Game info badges */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          sx={{
            display: "flex",
            gap: 2,
            mb: 5,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { icon: "👨‍👩‍👧‍👦", label: "Family" },
            { icon: "👥", label: "2-5" },
            { icon: "🎂", label: "9+" },
            { icon: "⏱", label: "30-45 นาที" },
          ].map((badge) => (
            <Box
              key={badge.label}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                backgroundColor: "white",
                borderRadius: 3,
                px: 2,
                py: 1,
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </Box>
          ))}
        </Box>

        {/* Start button */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="contained"
            size="large"
            color="primary"
            startIcon={<PlayArrowRoundedIcon />}
            onClick={() => router.push("/setup")}
            sx={{
              px: 6,
              py: 2,
              fontSize: "1.2rem",
              borderRadius: 6,
            }}
          >
            เริ่มเกมใหม่
          </Button>
        </Box>

        {/* Footer heart */}
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          sx={{ mt: 6 }}
        >
          <FavoriteIcon
            component={motion.svg}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            sx={{ color: "#F0A0B0", fontSize: 28 }}
          />
        </Box>
      </Box>
    </Container>
  );
}
