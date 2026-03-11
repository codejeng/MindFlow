import type { TraitPoints } from "@/context/GameContext";

// ─── Score Thresholds (max 12) ────────────────────────────────────────────────
// ต่ำ: 0-4 | ปานกลาง: 5-8 | สูง: 9-12

export type ScoreLevel = "low" | "mid" | "high";

export function scoreLevel(v: number): ScoreLevel {
  if (v <= 4) return "low";
  if (v <= 8) return "mid";
  return "high";
}

export function scoreLevelLabel(level: ScoreLevel): string {
  switch (level) {
    case "low": return "ต่ำ";
    case "mid": return "ปานกลาง";
    case "high": return "สูง";
  }
}

export function scoreLevelColor(level: ScoreLevel): string {
  switch (level) {
    case "low": return "#E57373";
    case "mid": return "#FFB74D";
    case "high": return "#66BB6A";
  }
}

// ─── Ratio Normalization ──────────────────────────────────────────────────────
// Normalize raw accumulated scores to a 12-point scale based on cards answered.
// Formula: score_12 = min(12, round((raw / questionsAnswered) * 6))
// This makes scores comparable regardless of how many questions were answered.

export function normalizeScores(
  raw: TraitPoints,
  questionsAnswered: number,
): TraitPoints {
  if (questionsAnswered <= 0) return { SE: 0, COM: 0, RES: 0, ER: 0 };
  const norm = (v: number) => Math.min(12, Math.round((v / questionsAnswered) * 6));
  return {
    SE: norm(raw.SE),
    COM: norm(raw.COM),
    RES: norm(raw.RES),
    ER: norm(raw.ER),
  };
}

// ─── Child Profiles ───────────────────────────────────────────────────────────
// Uses SE, COM, RES, ER directly.

export interface ChildProfile {
  name: string;
  description: string;
  cardImageFront: string; // 1*.png
  cardImageBack: string;  // 2*.png
  emoji: string;
  color: string;
}

const CHILD_PROFILES: Record<string, ChildProfile> = {
  confident: {
    name: "เด็กที่มั่นใจและกล้าแสดงออก",
    description: "มีความเชื่อมั่นในตัวเองสูงและสื่อสารได้ดี กล้าแสดงความคิดเห็นอย่างมั่นใจ",
    cardImageFront: "/cards/1เด็กเชื่อมั่นในตัวเองสูง.png",
    cardImageBack: "/cards/2เด็กเชื่อมั่นในตัวเองสูง.png",
    emoji: "💪",
    color: "#7B68EE",
  },
  resilient: {
    name: "เด็กที่ยืดหยุ่นและผ่านปัญหาได้ดี",
    description: "มีความยืดหยุ่นสูงและจัดการอารมณ์ได้ดี สามารถรับมือกับอุปสรรคได้อย่างมั่นคง",
    cardImageFront: "/cards/1เด็กไม่ยอมแพ้อะไรง่ายๆ.png",
    cardImageBack: "/cards/2เด็กไม่ยอมแพ้อะไรง่ายๆ.png",
    emoji: "🌱",
    color: "#E8A838",
  },
  communicator: {
    name: "เด็กที่เปราะบางแต่สื่อสารได้ดี",
    description: "แม้ยังไม่มั่นใจในตัวเองมาก แต่สื่อสารความรู้สึกได้ดี สามารถขอความช่วยเหลือเมื่อต้องการ",
    cardImageFront: "/cards/1เด็กสื่อสารความรู้สึกได้.png",
    cardImageBack: "/cards/2เด็กสื่อสารความรู้สึกได้.png",
    emoji: "💬",
    color: "#1B7B7E",
  },
  emotionally_regulated: {
    name: "เด็กที่ควบคุมอารมณ์ได้ดี",
    description: "จัดการอารมณ์ตัวเองได้อย่างดีเยี่ยม รู้จักสงบสติอารมณ์เมื่อเผชิญสถานการณ์ยาก",
    cardImageFront: "/cards/1เด็กจัดการอาร์มได้ดี.png",
    cardImageBack: "/cards/2เด็กจัดการอาร์มได้ดี.png",
    emoji: "🧘",
    color: "#D4607A",
  },
  anxious: {
    name: "เด็กที่ขี้กังวลและต้องการการสนับสนุน",
    description: "ยังต้องการกำลังใจและการสนับสนุนจากคนรอบข้าง แต่มีศักยภาพที่รอการพัฒนา",
    cardImageFront: "",
    cardImageBack: "",
    emoji: "🤗",
    color: "#9E9E9E",
  },
};

export function getChildProfile(scores: TraitPoints): ChildProfile {
  const se = scoreLevel(scores.SE);
  const com = scoreLevel(scores.COM);
  const res = scoreLevel(scores.RES);
  const er = scoreLevel(scores.ER);

  // เด็กที่มั่นใจและกล้าแสดงออก: SE สูง, COM สูง
  if (se === "high" && com === "high") return CHILD_PROFILES.confident;

  // เด็กที่ยืดหยุ่นและผ่านปัญหาได้ดี: RES สูง, ER สูง
  if (res === "high" && er === "high") return CHILD_PROFILES.resilient;

  // เด็กที่ควบคุมอารมณ์ได้ดี: ER สูง (≥9)
  if (er === "high") return CHILD_PROFILES.emotionally_regulated;

  // เด็กที่เปราะบางแต่สื่อสารได้ดี: SE ต่ำ, COM สูง
  if (se === "low" && com === "high") return CHILD_PROFILES.communicator;

  // เด็กที่ขี้กังวลและต้องการการสนับสนุน: SE ต่ำ, RES ต่ำ
  if (se === "low" && res === "low") return CHILD_PROFILES.anxious;

  // Fallback: pick based on highest trait
  const max = Math.max(scores.SE, scores.COM, scores.RES, scores.ER);
  if (max === scores.SE) return CHILD_PROFILES.confident;
  if (max === scores.COM) return CHILD_PROFILES.communicator;
  if (max === scores.RES) return CHILD_PROFILES.resilient;
  return CHILD_PROFILES.emotionally_regulated;
}

// ─── Parent Profiles ──────────────────────────────────────────────────────────
// Mapping: SE → Control, COM → Communication, RES → Resilience, ER → Warmth

export interface ParentProfile {
  name: string;
  nameEn: string;
  description: string;
  emoji: string;
  color: string;
  bgGradient: string;
}

const PARENT_PROFILES: Record<string, ParentProfile> = {
  authoritative: {
    name: "การเลี้ยงดูแบบเอาใจใส่",
    nameEn: "Authoritative",
    description: "เปิดรับฟัง มีความอบอุ่น และส่งเสริมความยืดหยุ่นของลูก",
    emoji: "🌟",
    color: "#4CAF50",
    bgGradient: "linear-gradient(135deg, #E8F5E9, #C8E6C9)",
  },
  authoritarian: {
    name: "การเลี้ยงดูแบบเข้มงวด",
    nameEn: "Authoritarian",
    description: "มีการควบคุมสูง แต่อาจต้องเพิ่มการสื่อสารและความอบอุ่น",
    emoji: "📏",
    color: "#E65100",
    bgGradient: "linear-gradient(135deg, #FFF3E0, #FFE0B2)",
  },
  neglectful: {
    name: "ปล่อยละเลย",
    nameEn: "Neglectful",
    description: "ทุกมิติยังอยู่ในระดับต่ำ ลองเพิ่มเวลาและความใส่ใจกับลูกมากขึ้น",
    emoji: "🌧️",
    color: "#78909C",
    bgGradient: "linear-gradient(135deg, #ECEFF1, #CFD8DC)",
  },
  permissive: {
    name: "การเลี้ยงดูแบบตามใจ",
    nameEn: "Permissive",
    description: "มีความอบอุ่นสูง แต่อาจต้องเพิ่มขอบเขตและกติกาที่ชัดเจน",
    emoji: "🧸",
    color: "#AB47BC",
    bgGradient: "linear-gradient(135deg, #F3E5F5, #E1BEE7)",
  },
};

export function getParentProfile(scores: TraitPoints): ParentProfile {
  // Map: SE→Control, COM→Communication, ER→Warmth, RES→Resilience
  const control = scoreLevel(scores.SE);
  const communication = scoreLevel(scores.COM);
  const warmth = scoreLevel(scores.ER);
  const resilience = scoreLevel(scores.RES);

  // Authoritative: COM สูง, ER สูง, SE ปานกลาง, RES สูง
  if (
    communication === "high" &&
    warmth === "high" &&
    (control === "mid" || control === "high") &&
    resilience === "high"
  ) {
    return PARENT_PROFILES.authoritative;
  }

  // Authoritarian: SE สูง, COM ต่ำ, ER ต่ำ
  if (control === "high" && communication === "low" && warmth === "low") {
    return PARENT_PROFILES.authoritarian;
  }

  // Neglectful: ทุกมิติต่ำ
  if (
    control === "low" &&
    communication === "low" &&
    warmth === "low" &&
    resilience === "low"
  ) {
    return PARENT_PROFILES.neglectful;
  }

  // Permissive: ER สูง, SE ต่ำ, COM ปานกลาง
  if (warmth === "high" && control === "low" && communication === "mid") {
    return PARENT_PROFILES.permissive;
  }

  // Fallback: Authoritative if mostly high, otherwise based on warmth
  const total = scores.SE + scores.COM + scores.RES + scores.ER;
  if (total >= 28) return PARENT_PROFILES.authoritative;
  if (warmth === "high") return PARENT_PROFILES.permissive;
  if (control === "high") return PARENT_PROFILES.authoritarian;
  return PARENT_PROFILES.authoritative; // default positive
}

// ─── Trait Labels per Role ────────────────────────────────────────────────────

export const CHILD_TRAIT_META: Record<keyof TraitPoints, { label: string; icon: string; color: string }> = {
  SE: { label: "ความเชื่อมั่นในตนเอง", icon: "💪", color: "#7B68EE" },
  COM: { label: "การสื่อสาร", icon: "💬", color: "#1B7B7E" },
  RES: { label: "ความยืดหยุ่น", icon: "🌱", color: "#E8A838" },
  ER: { label: "การจัดการอารมณ์", icon: "🧘", color: "#D4607A" },
};

export const PARENT_TRAIT_META: Record<keyof TraitPoints, { label: string; icon: string; color: string }> = {
  SE: { label: "การควบคุม", icon: "📏", color: "#7B68EE" },
  COM: { label: "การสื่อสาร", icon: "💬", color: "#1B7B7E" },
  RES: { label: "ความยืดหยุ่น", icon: "🌱", color: "#E8A838" },
  ER: { label: "ความอบอุ่น", icon: "🤗", color: "#D4607A" },
};
