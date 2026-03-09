"use client";

import { Box, Typography, Button, Container } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";

const FEATURES = [
  {
    icon: <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 32, color: "#1B7B7E" }} />,
    title: "Digital Board Game",
    subtitle: "Play and grow together",
    bg: "#F0FAFA",
  },
  {
    icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 32, color: "#E8A030" }} />,
    title: "AI Assessment",
    subtitle: "Smart mental check",
    bg: "#FFFBF0",
  },
  {
    icon: <GroupsOutlinedIcon sx={{ fontSize: 32, color: "#7B68EE" }} />,
    title: "Family Community",
    subtitle: "Connect with others",
    bg: "#F5F0FF",
  },
  {
    icon: <MedicalServicesOutlinedIcon sx={{ fontSize: 32, color: "#5BB8A8" }} />,
    title: "Professional Care",
    subtitle: "Expert advice",
    bg: "#F0FFF8",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #F0F8FA 0%, #E8F4F0 30%, #F5F0FA 70%, #F0F8FA 100%)",
        pb: 6,
      }}
    >
      {/* ─── NAV BAR ─── */}
      <Box
        component="nav"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, sm: 3 },
          py: 1.5,
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Image
            src="/images/logo.png"
            alt="MindFlow Board Game"
            width={100}
            height={100}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
              borderRadius: "16px",
            }}
            priority
          />
        </Box>

        {/* Auth buttons */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            size="small"
            sx={{
              color: "#555",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.8rem",
            }}
          >
            เข้าสู่ระบบ
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              background: "linear-gradient(135deg, #1B7B7E, #5BB8A8)",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 5,
              px: 2,
              fontSize: "0.8rem",
              boxShadow: "0 2px 10px rgba(27,123,126,0.3)",
            }}
          >
            สมัครสมาชิก
          </Button>
        </Box>
      </Box>

      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        {/* ─── HERO BADGE ─── */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ mt: 3, mb: 2 }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              backgroundColor: "#FFF8E1",
              border: "1px solid #FFE082",
              borderRadius: 5,
              px: 2.5,
              py: 0.75,
            }}
          >
            <Typography sx={{ fontSize: "0.85rem" }}>✨</Typography>
            <Typography
              sx={{
                fontSize: "0.85rem",
                fontWeight: 500,
                color: "#B8860B",
              }}
            >
              สุขภาพจิตที่ดีเริ่มที่บ้าน
            </Typography>
          </Box>
        </Box>

        {/* ─── HERO TEXT ─── */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#2D3748",
              lineHeight: 1.4,
              mb: 2,
              fontSize: { xs: "1.6rem", sm: "2rem" },
            }}
          >
            แพลตฟอร์มครบวงจร
            <br />
            สำหรับ
            <Box component="span" sx={{ color: "#1B7B7E" }}>
              สุขภาพจิต
            </Box>
            <br />
            ครอบครัว
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#718096",
              fontWeight: 400,
              lineHeight: 1.7,
              mb: 3,
              px: 2,
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            ผ่านเกม AI และการปรึกษาจากผู้เชี่ยวชาญ เพื่อ
            <br />
            ความเข้าใจที่ลึกซึ้งในครอบครัวคุณ
          </Typography>
        </Box>

        {/* ─── MOCKUP IMAGE ─── */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 380,
            mx: "auto",
            mb: 4,
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
          }}
        >
          <Image
            src="/images/landing.png"
            alt="MindFlow Board Game"
            width={380}
            height={280}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
              borderRadius: "16px",
            }}
            priority
          />
          {/* Caption overlay */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(transparent, rgba(0,0,0,0.5))",
              py: 1.5,
              px: 2,
              borderRadius: "0 0 16px 16px",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "white",
                fontWeight: 500,
                fontStyle: "italic",
                fontSize: "0.8rem",
              }}
            >
              Family Board Game Experience
            </Typography>
          </Box>
        </Box>

        {/* ─── FEATURE CARDS 2x2 ─── */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1.5,
            mb: 4,
            px: 1,
          }}
        >
          {FEATURES.map((feature, i) => (
            <Box
              key={i}
              component={motion.div}
              whileHover={{ y: -4, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.2 }}
              sx={{
                backgroundColor: feature.bg,
                borderRadius: 3,
                p: 2.5,
                textAlign: "center",
                cursor: "default",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                border: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <Box sx={{ mb: 1 }}>{feature.icon}</Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: "#2D3748",
                  mb: 0.25,
                  fontSize: "0.85rem",
                }}
              >
                {feature.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#A0AEC0", fontWeight: 400, fontSize: "0.75rem" }}
              >
                {feature.subtitle}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* ─── CTA BUTTON ─── */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          sx={{ px: 1 }}
        >
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={() => router.push("/setup")}
            sx={{
              py: 2,
              fontSize: "1.15rem",
              fontWeight: 700,
              borderRadius: 4,
              background: "linear-gradient(135deg, #1B7B7E, #5BB8A8)",
              boxShadow: "0 6px 25px rgba(27,123,126,0.3)",
              textTransform: "none",
            }}
          >
            เริ่มใช้งาน
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
