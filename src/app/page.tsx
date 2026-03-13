"use client";

import { Box, Typography, Button, Container, Avatar, Menu, MenuItem, CircularProgress } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";

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

const DEMOS = [
  {
    label: "Demo 1",
    color: "#1B7B7E",
    bg: "#F0FAFA",
    image: "/images/realcase3.png",
    what: "สร้างต้นแบบเกมเวอร์ชันแรก ทดลองกับพ่อแม่และลูก ใช้การ์ดคำถามในการสื่อสาร",
    result: "เกมใช้ได้กับคนแปลกหน้า ไม่จำกัดแค่ครอบครัว เหมาะกับบอร์ดเกมคาเฟ่หรือกิจกรรมกลุ่ม",
  },
  {
    label: "Demo 2",
    color: "#7B68EE",
    bg: "#F5F0FF",
    image: "/images/realcase4.png",
    what: "ทดลองเล่นกับเพื่อน ๆ เน้นความสนุก กลไกเกม และ UI เว็บไซต์ เพิ่มองค์ประกอบกราฟิก ระบบสร้างห้อง/เข้าร่วม การ์ดท้าทาย",
    result: "สนุก กติกาเข้าใจง่าย แต่กลไกเงินและเป้าหมายยังไม่ชัด",
  },
  {
    label: "Demo 3",
    color: "#E8A030",
    bg: "#FFFBF0",
    image: "/images/realcase5.png",
    what: "ทดลองในบอร์ดเกมคาเฟ่กับผู้เล่นที่ไม่รู้จักกัน วัดการสื่อสาร ความเข้าใจ และบรรยากาศในกลุ่มสาธารณะ",
    result: "เกมใช้ได้กับคนแปลกหน้า เหมาะกับบอร์ดเกมคาเฟ่หรือกิจกรรมกลุ่ม",
  },
  {
    label: "Demo 4",
    color: "#5BB8A8",
    bg: "#F0FFF8",
    image: "/images/realcase1.png",
    what: "รวมทุกการปรับปรุงมาทดสอบกับครอบครัวอีกครั้ง เวอร์ชันใกล้สมบูรณ์ ทั้งกติกา เว็บไซต์ และฟีเจอร์วิเคราะห์บุคลิกภาพ",
    result: "สนุก เข้าใจง่าย ฟีเจอร์วิเคราะห์บุคลิกภาพชอบมาก",
  },
];

const OBSERVATIONS = [
  {
    emoji: "🪙",
    color: "#E8A030",
    bg: "#FFFBF0",
    title: "ระบบ Coin ส่งเสริมความรู้สึกมีส่วนร่วม",
    desc: "ผู้เล่นรู้สึก \"ได้รับการฟัง\" และ \"มีส่วนร่วม\" ผ่านกลไก coin ที่ให้รางวัลการแสดงความคิดเห็น",
  },
  {
    emoji: "🤝",
    color: "#7B68EE",
    bg: "#F5F0FF",
    title: "การ์ดท้าทายสร้างปฏิสัมพันธ์ในกลุ่ม",
    desc: "บรรยากาศการช่วยกันยับยั้งการ์ดท้าทายสร้างความสนุก ปฏิสัมพันธ์ และความน่ารักภายในกลุ่ม",
  },
  {
    emoji: "💬",
    color: "#1B7B7E",
    bg: "#F0FAFA",
    title: "การ์ดสถานการณ์สร้างอารมณ์ร่วม",
    desc: "ผู้เล่นมีอารมณ์ร่วมกับการ์ดสถานการณ์ได้ดี เกิดการพูดคุยและแสดงความรู้สึกในครอบครัวได้อย่างเป็นธรรมชาติ",
  },
];

export default function Home() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = async () => {
    setAnchorEl(null);
    await signOut();
    router.refresh();
  };

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
          {loading ? (
            <CircularProgress size={24} sx={{ color: "#1B7B7E" }} />
          ) : user ? (
            <>
              <Avatar
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  width: 36, height: 36,
                  background: "linear-gradient(135deg, #1B7B7E, #5BB8A8)",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  "&:hover": { boxShadow: "0 2px 10px rgba(27,123,126,0.3)" },
                }}
              >
                {user.email?.charAt(0).toUpperCase()}
              </Avatar>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  sx: { borderRadius: 3, mt: 1, minWidth: 180, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" },
                }}
              >
                <MenuItem disabled sx={{ opacity: 1 }}>
                  <PersonOutlineRoundedIcon sx={{ mr: 1, fontSize: 18, color: "#999" }} />
                  <Typography variant="body2" noWrap sx={{ maxWidth: 140, color: "#555" }}>
                    {user.email}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: "#E05A7A" }}>
                  <LogoutRoundedIcon sx={{ mr: 1, fontSize: 18 }} />
                  ออกจากระบบ
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                size="small"
                onClick={() => router.push("/login")}
                sx={{
                  color: "#555", textTransform: "none",
                  fontWeight: 500, fontSize: "0.8rem",
                }}
              >
                เข้าสู่ระบบ
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => router.push("/signup")}
                sx={{
                  background: "linear-gradient(135deg, #1B7B7E, #5BB8A8)",
                  textTransform: "none", fontWeight: 600,
                  borderRadius: 5, px: 2, fontSize: "0.8rem",
                  boxShadow: "0 2px 10px rgba(27,123,126,0.3)",
                }}
              >
                สมัครสมาชิก
              </Button>
            </>
          )}
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
              display: "inline-flex", alignItems: "center", gap: 0.75,
              backgroundColor: "#FFF8E1", border: "1px solid #FFE082",
              borderRadius: 5, px: 2.5, py: 0.75,
            }}
          >
            <Typography sx={{ fontSize: "0.85rem" }}>✨</Typography>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 500, color: "#B8860B" }}>
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
              fontWeight: 700, color: "#2D3748", lineHeight: 1.4, mb: 2,
              fontSize: { xs: "1.6rem", sm: "2rem" },
            }}
          >
            แพลตฟอร์มครบวงจร
            <br />
            สำหรับ
            <Box component="span" sx={{ color: "#1B7B7E" }}>สุขภาพจิต</Box>
            <br />
            ครอบครัว
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#718096", fontWeight: 400, lineHeight: 1.7,
              mb: 3, px: 2, fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            ผ่านเกม AI และการปรึกษาจากผู้เชี่ยวชาญ เพื่อ
            <br />
            ความเข้าใจที่ลึกซึ้งในครอบครัวคุณ
          </Typography>

          {/* Tagline quote */}
          <Box
            sx={{
              mx: 2, mb: 3, px: 2.5, py: 1.75,
              borderLeft: "4px solid #1B7B7E",
              borderRadius: "0 12px 12px 0",
              background: "linear-gradient(135deg, #F0FAFA, #F5F0FF)",
            }}
          >
            <Typography
              sx={{
                fontStyle: "italic", fontWeight: 600,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                color: "#2D3748", lineHeight: 1.6,
                "& span": { color: "#1B7B7E" },
              }}
            >
              Mindflow ไม่ใช่แค่{" "}
              <Box component="span" sx={{ color: "#E8A030" }}>"บอร์ดเกม"</Box>
              {" "}แต่เป็น{" "}
              <Box component="span" sx={{ color: "#1B7B7E" }}>"กระแสแห่งความเข้าใจ"</Box>
            </Typography>
          </Box>

        </Box>

        {/* ─── MOCKUP IMAGE ─── */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          sx={{
            position: "relative", width: "100%", maxWidth: 380, mx: "auto", mb: 5,
            borderRadius: 4, overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
          }}
        >
          <Image
            src="/images/landing.png"
            alt="MindFlow Board Game"
            width={380}
            height={280}
            style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "16px" }}
            priority
          />

          <Box
            sx={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "linear-gradient(transparent, rgba(0,0,0,0.5))",
              py: 1.5, px: 2, borderRadius: "0 0 16px 16px",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "white", fontWeight: 500, fontStyle: "italic", fontSize: "0.8rem" }}
            >
              Family Board Game Experience
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={() => router.push("/setup")}
          sx={{
            py: 2, fontSize: "1.15rem", fontWeight: 700,
            borderRadius: 4, mt: 1, mb: 1,
            background: "linear-gradient(135deg, #1B7B7E, #5BB8A8)",
            boxShadow: "0 6px 25px rgba(27,123,126,0.3)",
            textTransform: "none",
          }}
        >
          เริ่มเล่นเกม
        </Button>

        {/* ─── FEATURE CARDS 2x2 ─── */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 4, px: 1 }}
        >
          {FEATURES.map((feature, i) => (
            <Box
              key={i}
              component={motion.div}
              whileHover={{ y: -4, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.2 }}
              sx={{
                backgroundColor: feature.bg, borderRadius: 3, p: 2.5,
                textAlign: "center", cursor: "default",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                border: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <Box sx={{ mb: 1 }}>{feature.icon}</Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "#2D3748", mb: 0.25, fontSize: "0.85rem" }}
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

        </Box>

        {/* ─── HOW TO PLAY ─── */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          sx={{ mt: 5, mb: 2, px: 1 }}
        >
          {/* Section header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Box sx={{ width: 4, height: 24, borderRadius: 2, background: "linear-gradient(180deg,#1B7B7E,#5BB8A8)" }} />
            <Typography variant="h6" fontWeight={700} sx={{ color: "#2D3748", fontSize: "1.05rem" }}>
              วิธีเริ่มเกม
            </Typography>
            <Typography sx={{ fontSize: "1.1rem" }}>🎮</Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#718096", mb: 3, pl: 1.5 }}>
            เล่นง่าย เข้าใจเร็ว ทำตามได้เลย!
          </Typography>

          {/* Steps */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {[
              { step: 1, emoji: "👥", label: "เลือกบทบาท", desc: "เลือกบทบาทผู้เล่น: พ่อแม่ หรือ เด็ก" },
              { step: 2, emoji: "🃏", label: "เลือกประเภทการ์ด", desc: "เลือกประเภทการ์ดตามบทบาทและช่วงวัย" },
              { step: 3, emoji: "📋", label: "วางการ์ด", desc: "วางการ์ดในตำแหน่งบนกระดาน" },
              { step: 4, emoji: "🏠", label: "สร้างห้อง", desc: "สร้างห้องในเว็บไซต์ → กำหนดเวลาเล่น → ผู้เล่นเข้าร่วมห้อง" },
              { step: 5, emoji: "🪙", label: "แจกอุปกรณ์", desc: "แจก coin / token / ตัวหมากให้ผู้เล่นแต่ละคน" },
              { step: 6, emoji: "▶️", label: "เริ่มเล่น", desc: "ระบบสุ่มผู้เล่นคนแรก แล้วเล่นวนตามลำดับ" },
              { step: 7, emoji: "🧠", label: "สรุปผล", desc: "เมื่อหมดเวลา ระบบจะสรุป \"ภาพตัวตน\" ของผู้เล่นจากรูปแบบการตอบ" },
            ].map(({ step, emoji, label, desc }) => (
              <Box
                key={step}
                component={motion.div}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * step }}
                sx={{
                  display: "flex", gap: 2, alignItems: "flex-start",
                  backgroundColor: "white", borderRadius: 3, p: 2,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  border: "1px solid rgba(27,123,126,0.08)",
                }}
              >
                {/* Step number */}
                <Box
                  sx={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, #1B7B7E, #5BB8A8)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Typography sx={{ color: "white", fontWeight: 700, fontSize: "0.75rem" }}>
                    {step}
                  </Typography>
                </Box>
                {/* Emoji */}
                <Typography sx={{ fontSize: "1.3rem", mt: 0.25, lineHeight: 1 }}>{emoji}</Typography>
                {/* Text */}
                <Box>
                  <Typography fontWeight={700} sx={{ color: "#2D3748", fontSize: "0.9rem", mb: 0.25 }}>
                    {label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#718096", fontSize: "0.82rem", lineHeight: 1.5 }}>
                    {desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ─── REAL CASES / DEMO SECTION ─── */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          sx={{ mt: 5, mb: 2, px: 1 }}
        >
          {/* Section header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Box sx={{ width: 4, height: 24, borderRadius: 2, background: "linear-gradient(180deg,#1B7B7E,#5BB8A8)" }} />
            <Typography variant="h6" fontWeight={700} sx={{ color: "#2D3748", fontSize: "1.05rem" }}>
              ผลลัพธ์จากการทดสอบจริง
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#718096", mb: 3, pl: 1.5 }}>
            เราพัฒนาผ่านการทดสอบจริงกับครอบครัวและกลุ่มหลากหลาย
          </Typography>

          {/* Demo cards */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {DEMOS.map((demo, i) => (
              <Box
                key={i}
                component={motion.div}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                sx={{
                  backgroundColor: "white",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  border: `1px solid ${demo.color}22`,
                }}
              >
                {/* Card header */}
                <Box
                  sx={{
                    display: "flex", alignItems: "center", gap: 1.5,
                    px: 2.5, pt: 2, pb: 1.5,
                    borderBottom: `1px solid ${demo.color}18`,
                  }}
                >
                  <Box
                    sx={{
                      width: 32, height: 32, borderRadius: "50%",
                      backgroundColor: demo.color, display: "flex",
                      alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}
                  >
                    <Typography sx={{ color: "white", fontWeight: 700, fontSize: "0.75rem" }}>
                      D{i + 1}
                    </Typography>
                  </Box>
                  <Typography fontWeight={700} sx={{ color: demo.color, fontSize: "0.95rem" }}>
                    {demo.label}
                  </Typography>
                </Box>

                {/* Image */}
                <Box
                  sx={{
                    position: "relative", mx: 2, mb: 2,
                    height: 200, borderRadius: 3, overflow: "hidden",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                  }}
                >
                  <Image
                    src={demo.image}
                    alt={demo.label}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Box>

                {/* Content */}
                <Box sx={{ px: 2.5, pb: 2.5 }}>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "inline-block", mb: 0.5,
                        color: demo.color, fontWeight: 700, fontSize: "0.7rem",
                        textTransform: "uppercase", letterSpacing: "0.05em",
                      }}
                    >
                      🔨 สิ่งที่ทำ
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#4A5568", lineHeight: 1.6, fontSize: "0.85rem" }}>
                      {demo.what}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: demo.bg, borderRadius: 2, px: 2, py: 1.25,
                      borderLeft: `3px solid ${demo.color}`,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block", mb: 0.5,
                        color: demo.color, fontWeight: 700, fontSize: "0.7rem",
                        textTransform: "uppercase", letterSpacing: "0.05em",
                      }}
                    >
                      ✅ ผลลัพธ์
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#4A5568", lineHeight: 1.6, fontSize: "0.85rem" }}>
                      {demo.result}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ─── OBSERVATIONS SECTION ─── */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          sx={{ mt: 5, mb: 4, px: 1 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Box sx={{ width: 4, height: 24, borderRadius: 2, background: "linear-gradient(180deg,#E8A030,#7B68EE)" }} />
            <Typography variant="h6" fontWeight={700} sx={{ color: "#2D3748", fontSize: "1.05rem" }}>
              สิ่งที่สังเกตพบ
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#718096", mb: 3, pl: 1.5 }}>
            ข้อค้นพบสำคัญระหว่างการทดสอบกับผู้เล่นจริง
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {OBSERVATIONS.map((obs, i) => (
              <Box
                key={i}
                component={motion.div}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                sx={{
                  display: "flex", gap: 2, alignItems: "flex-start",
                  backgroundColor: "white", borderRadius: 4, p: 2.5,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                  border: `1px solid ${obs.color}22`,
                }}
              >
                <Box
                  sx={{
                    width: 44, height: 44, borderRadius: 3, flexShrink: 0,
                    backgroundColor: obs.bg, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: "1.4rem",
                  }}
                >
                  {obs.emoji}
                </Box>
                <Box>
                  <Typography fontWeight={700} sx={{ color: obs.color, fontSize: "0.9rem", mb: 0.5 }}>
                    {obs.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#4A5568", lineHeight: 1.6, fontSize: "0.85rem" }}>
                    {obs.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

