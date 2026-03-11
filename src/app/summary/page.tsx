"use client";

import {
  Box, Typography, Button, Container, Card, CardContent, LinearProgress,
} from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGame, CHARACTERS, type TraitPoints } from "@/context/GameContext";
import {
  normalizeScores, scoreLevel, scoreLevelLabel, scoreLevelColor,
  getChildProfile, getParentProfile,
  CHILD_TRAIT_META, PARENT_TRAIT_META,
  type ChildProfile, type ParentProfile,
} from "@/data/scoring";
import PageTransition from "@/components/common/PageTransition";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";

// ─── Component ────────────────────────────────────────────────────────────────

export default function SummaryPage() {
  const router = useRouter();
  const { players, turnOrder, questionHistory, resetGame } = useGame();
  const orderedPlayers = turnOrder.map((id) => players.find((p) => p.id === id)).filter(Boolean) as typeof players;
  const totalQuestions = questionHistory.length;

  // ── Aggregate by role ──
  const childPlayers = orderedPlayers.filter((p) => p.role === "child");
  const parentPlayers = orderedPlayers.filter((p) => p.role === "parent");

  function aggregateRole(rolePlayers: typeof players): { raw: TraitPoints; questions: number; normalized: TraitPoints } {
    const raw: TraitPoints = { SE: 0, COM: 0, RES: 0, ER: 0 };
    let questions = 0;
    for (const p of rolePlayers) {
      raw.SE += p.stats.traitPoints.SE;
      raw.COM += p.stats.traitPoints.COM;
      raw.RES += p.stats.traitPoints.RES;
      raw.ER += p.stats.traitPoints.ER;
      questions += p.stats.questionsAnswered;
    }
    return { raw, questions, normalized: normalizeScores(raw, questions) };
  }

  const childAgg = aggregateRole(childPlayers);
  const parentAgg = aggregateRole(parentPlayers);

  const childProfile = getChildProfile(childAgg.normalized);
  const parentProfile = getParentProfile(parentAgg.normalized);

  return (
    <PageTransition>
      <Container maxWidth="sm" sx={{ py: 4, pb: 8, minHeight: "100vh" }}>
        {/* Header */}
        <Box component={motion.div} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight={700} sx={{ color: "#1B7B7E", mb: 0.5 }}>
            ผลสรุปความสัมพันธ์
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ตอบคำถามทั้งหมด {totalQuestions} ข้อ
          </Typography>
        </Box>

        {/* ── CHILD PROFILE CARD ── */}
        {childPlayers.length > 0 && (
          <Box component={motion.div} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }} sx={{ mb: 4 }}>

            <Typography variant="h6" fontWeight={700} sx={{ color: "#1B7B7E", mb: 2 }}>
              👧 โปรไฟล์ลูก
            </Typography>

            {/* Card image */}
            {childProfile.cardImage && (
              <Box sx={{
                position: "relative", width: "100%", maxWidth: 360, mx: "auto", mb: 3,
                borderRadius: 4, overflow: "hidden",
                boxShadow: `0 12px 40px ${childProfile.color}30`,
              }}>
                <Image
                  src={childProfile.cardImage}
                  alt={childProfile.name}
                  width={360} height={500}
                  style={{ width: "100%", height: "auto", display: "block" }}
                  priority
                />
              </Box>
            )}

            {/* Profile summary box */}
            <Box sx={{
              textAlign: "center", p: 3, borderRadius: 4, mb: 3,
              background: `linear-gradient(135deg, ${childProfile.color}12, ${childProfile.color}06)`,
              border: `2px solid ${childProfile.color}40`,
            }}>
              <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>{childProfile.emoji}</Typography>
              <Typography variant="h6" fontWeight={700} sx={{ color: childProfile.color, mb: 0.5 }}>
                {childProfile.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.7 }}>
                {childProfile.description}
              </Typography>
            </Box>

            {/* Trait bars */}
            <TraitBars
              scores={childAgg.normalized}
              meta={CHILD_TRAIT_META}
              questionsAnswered={childAgg.questions}
            />
          </Box>
        )}

        {/* ── PARENT PROFILE CARD ── */}
        {parentPlayers.length > 0 && (
          <Box component={motion.div} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }} sx={{ mb: 4 }}>

            <Typography variant="h6" fontWeight={700} sx={{ color: "#1B7B7E", mb: 2 }}>
              👨‍👩‍👧 โปรไฟล์ผู้ปกครอง
            </Typography>

            <Box sx={{
              textAlign: "center", p: 4, borderRadius: 4, mb: 3,
              background: parentProfile.bgGradient,
              border: `2px solid ${parentProfile.color}40`,
              boxShadow: `0 8px 30px ${parentProfile.color}15`,
            }}>
              <Typography sx={{ fontSize: "3rem", mb: 1 }}>{parentProfile.emoji}</Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: parentProfile.color, mb: 0.5 }}>
                {parentProfile.name}
              </Typography>
              <Typography variant="body2" fontWeight={500} sx={{ color: "#666", mb: 0.5 }}>
                {parentProfile.nameEn}
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.7, mt: 1 }}>
                {parentProfile.description}
              </Typography>
            </Box>

            {/* Trait bars */}
            <TraitBars
              scores={parentAgg.normalized}
              meta={PARENT_TRAIT_META}
              questionsAnswered={parentAgg.questions}
            />
          </Box>
        )}

        {/* ── PLAYER CARDS ── */}
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "#1B7B7E" }}>
          👥 สมาชิกที่เข้าร่วม
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
          {orderedPlayers.map((player, i) => {
            const char = CHARACTERS.find((c) => c.id === player.characterId);
            const norm = normalizeScores(player.stats.traitPoints, player.stats.questionsAnswered);
            const traitEntries = Object.entries(norm) as [keyof TraitPoints, number][];
            const topTrait = traitEntries.sort((a, b) => b[1] - a[1])[0];
            const meta = player.role === "child" ? CHILD_TRAIT_META : PARENT_TRAIT_META;
            return (
              <Card key={player.id} component={motion.div} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ width: 52, height: 68, position: "relative", flexShrink: 0 }}>
                      {char && <Image src={char.image} alt={char.name} fill style={{ objectFit: "contain" }} />}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight={700} sx={{ color: char?.baseColor }}>{player.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {char?.name} · {player.role === "parent" ? "ผู้ปกครอง" : "ลูก"} · ตอบ {player.stats.questionsAnswered} ข้อ
                      </Typography>
                      {topTrait && topTrait[1] > 0 && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                          <Typography variant="caption">{meta[topTrait[0]].icon}</Typography>
                          <Typography variant="caption" fontWeight={600} sx={{ color: meta[topTrait[0]].color }}>
                            เด่นด้าน: {meta[topTrait[0]].label}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>

        {/* Bottom actions */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" fullWidth startIcon={<HomeRoundedIcon />}
            onClick={() => { resetGame(); router.push("/"); }}
            sx={{ py: 1.5, borderRadius: 4 }}>
            กลับหน้าแรก
          </Button>
          <Button variant="contained" color="primary" fullWidth startIcon={<ReplayRoundedIcon />}
            onClick={() => { resetGame(); router.push("/setup"); }}
            sx={{ py: 1.5 }}>
            เล่นอีกครั้ง
          </Button>
        </Box>
      </Container>
    </PageTransition>
  );
}

// ─── Trait Bars Sub-component ──────────────────────────────────────────────────

function TraitBars({
  scores,
  meta,
  questionsAnswered,
}: {
  scores: TraitPoints;
  meta: Record<keyof TraitPoints, { label: string; icon: string; color: string }>;
  questionsAnswered: number;
}) {
  const entries = Object.entries(scores) as [keyof TraitPoints, number][];

  return (
    <Card sx={{ borderRadius: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#1B7B7E" }}>
            ✨ คะแนนรายมิติ (เต็ม 12)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ตอบ {questionsAnswered} ข้อ
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {entries.map(([key, value]) => {
            const m = meta[key];
            const level = scoreLevel(value);
            return (
              <Box key={key}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <Typography>{m.icon}</Typography>
                    <Typography variant="body2" fontWeight={600}>{m.label}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" fontWeight={700} sx={{ color: m.color }}>
                      {value}/12
                    </Typography>
                    <Typography variant="caption" fontWeight={600}
                      sx={{
                        color: scoreLevelColor(level),
                        backgroundColor: scoreLevelColor(level) + "18",
                        px: 1, py: 0.2, borderRadius: 2,
                      }}>
                      {scoreLevelLabel(level)}
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.round((value / 12) * 100)}
                  sx={{
                    height: 10, borderRadius: 5,
                    backgroundColor: m.color + "18",
                    "& .MuiLinearProgress-bar": {
                      background: `linear-gradient(90deg, ${m.color}88, ${m.color})`,
                      borderRadius: 5,
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
