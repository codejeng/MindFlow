// ─── Trait Dimensions ─────────────────────────────────────────────────────────
// SE  = Self-Efficacy   (ความเชื่อมั่นในตนเอง)
// COM = Communication   (การสื่อสาร)
// RES = Resilience      (ความยืดหยุ่น / การฟื้นตัว)
// ER  = Emotional Regulation (การจัดการอารมณ์)
export type Trait = "SE" | "COM" | "RES" | "ER";

export const TRAIT_LABELS: Record<Trait, string> = {
  SE: "ความเชื่อมั่นในตนเอง",
  COM: "การสื่อสาร",
  RES: "ความยืดหยุ่น",
  ER: "การจัดการอารมณ์",
};

export const TRAIT_COLORS: Record<Trait, string> = {
  SE: "#7B68EE",
  COM: "#1B7B7E",
  RES: "#E8A838",
  ER: "#D4607A",
};

export interface QuestionChoice {
  text: string;
  traits: Partial<Record<Trait, number>>;
}

export interface Question {
  id: number;
  code: string;
  ageGroup: string;
  text: string;
  choices: QuestionChoice[];
}

// ─── Score CSV (embedded) ─────────────────────────────────────────────────────
// Mirrors public/data/score.csv — each question has 4 rows (A, B, C, D).

const SCORE_CSV = `คำถาม,ตัวเลือก,SE,COM,RES,ER
P01,A,0,0,0,2
P01,B,0,0,2,-1
P01,C,0,2,1,0
P01,D,2,0,1,0
P02,A,0,0,0,2
P02,B,0,2,1,0
P02,C,0,0,2,1
P02,D,2,0,0,1
P03,A,0,2,0,0
P03,B,0,0,2,-1
P03,C,0,0,0,2
P03,D,2,0,1,0
P04,A,0,0,2,1
P04,B,0,2,1,0
P04,C,0,0,0,2
P04,D,2,0,1,0
P05,A,0,0,0,2
P05,B,0,2,1,0
P05,C,0,0,2,0
P05,D,2,1,0,0
P06,A,0,0,2,0
P06,B,0,2,1,0
P06,C,0,0,0,2
P06,D,2,0,1,0
P07,A,0,2,0,0
P07,B,0,0,0,2
P07,C,0,1,1,0
P07,D,2,0,0,0
P08,A,2,0,0,1
P08,B,0,0,2,0
P08,C,0,2,0,1
P08,D,0,0,0,2
P09,A,0,0,2,0
P09,B,0,2,1,0
P09,C,0,0,0,2
P09,D,2,0,1,0
P10,A,0,2,0,0
P10,B,0,0,1,1
P10,C,0,0,2,0
P10,D,0,0,0,2
P11,A,2,0,0,0
P11,C,0,2,0,0
P11,B,0,0,2,0
P11,D,0,0,0,2
P12,A,0,2,0,0
P12,B,0,0,2,0
P12,C,0,0,0,2
P12,D,2,0,1,0
P13,A,2,0,0,0
P13,B,0,2,1,0
P13,C,0,0,2,0
P13,D,0,0,0,2
P14,A,2,0,0,0
P14,B,0,2,0,0
P14,C,0,0,2,0
P14,D,0,0,0,2
P15,A,2,0,0,0
P15,B,0,2,1,0
P15,C,0,0,2,0
P15,D,0,0,0,2`;

// ─── Questions CSV (embedded) ─────────────────────────────────────────────────
// Mirrors public/data/questions.csv — text only.

const QUESTIONS_CSV = `card_id,ช่วงวัย,คำถาม,A,B,C,D
P01,ประถม,การบ้านยากและเริ่มรู้สึกท้อ คุณคิดว่าควรทำอย่างไร,หยุดพักก่อนเพื่อให้ใจเย็นลง,ลองพยายามทำต่อหรือหาวิธีใหม่,ขอความช่วยเหลือจากผู้ปกครองหรือครู,บอกตัวเองว่าความพยายามสำคัญกว่าความเก่ง
P02,ประถม,เพื่อนล้อเรื่องบางอย่าง คุณคิดว่าควรทำอย่างไร,พยายามควบคุมอารมณ์ตัวเองก่อน,บอกเพื่อนว่าคำพูดนั้นทำให้รู้สึกไม่ดี,เดินออกจากสถานการณ์นั้น,เตือนตัวเองว่าคำพูดคนอื่นไม่ได้กำหนดคุณค่าเรา
P03,ประถม,เด็กทำของใช้ในบ้านพังโดยไม่ได้ตั้งใจ คุณคิดว่าควรทำอย่างไร,บอกผู้ปกครองตามความจริง,พยายามแก้ไขก่อน,รอให้ใจเย็นก่อนแล้วค่อยคุย,ยอมรับความผิดและเรียนรู้จากมัน
P04,ประถม,เด็กอยากลองกิจกรรมใหม่แต่กลัวทำไม่ได้,ลองทำดูแม้จะรู้สึกกลัว,ขอคำแนะนำจากผู้ใหญ่,หายใจลึก ๆ เพื่อจัดการความกังวล,บอกตัวเองว่าทุกคนเริ่มจากการลอง
P05,ประถม,เด็กทะเลาะกับเพื่อน,เว้นระยะก่อนเพื่อให้สงบ,เว้นระยะก่อนเพื่อให้สงบ,พยายามหาทางแก้ปัญหา,บอกตัวเองว่าความสัมพันธ์สำคัญ
P06,ประถม,เด็กได้คะแนนสอบน้อย,คิดว่าครั้งหน้าจะพยายามใหม่,ขอคำแนะนำจากครู,ปล่อยให้อารมณ์สงบก่อน,เตือนตัวเองว่าความผิดพลาดช่วยให้เรียนรู้
P07,ประถม,เด็กอยากให้ผู้ปกครองฟังเรื่องของเขา,บอกผู้ปกครองว่ามีเรื่องอยากคุย,รอเวลาที่เหมาะสม,เขียนหรือเล่าให้ฟังภายหลัง,เชื่อว่าความคิดของตัวเองสำคัญ
P08,ประถม,เด็กอิจฉาเพื่อน,เตือนตัวเองว่าทุกคนต่างกัน,ใช้เป็นแรงบันดาลใจพัฒนาตัวเอง,คุยกับผู้ใหญ่เกี่ยวกับความรู้สึก,ทำกิจกรรมที่ทำให้รู้สึกดีขึ้น
P09,ประถม,เด็กกลัวการนำเสนอหน้าห้อง,ฝึกซ้อมก่อน,ขอคำแนะนำจากครูหรือเพื่อน,หายใจลึก ๆ เพื่อลดความกังวล,บอกตัวเองว่าสามารถทำได้
P10,ประถม,เด็กอยากเล่นเกมต่อแต่ถึงเวลานอน,บอกผู้ปกครองว่าขอเวลาเพิ่มเล็กน้อย,หยุดเล่นตามเวลาที่กำหนด,หาวิธีจัดเวลาครั้งหน้า,จัดการอารมณ์ตัวเองก่อน
P11,ประถม,เด็กถูกเลือกเป็นหัวหน้ากลุ่ม,มั่นใจและลองทำหน้าที่,คุยกับเพื่อนเพื่อแบ่งงาน,ถ้ามีปัญหาจะหาวิธีแก้,พยายามควบคุมความตื่นเต้น
P12,ประถม,เด็กทำงานกลุ่มแต่เพื่อนไม่ช่วย,คุยกับเพื่อนเกี่ยวกับงาน,พยายามแก้ปัญหา,ใจเย็นก่อนแล้วคิดวิธี,เชื่อว่าตัวเองจัดการได้
P13,ประถม,เด็กอยากลองทำสิ่งใหม่,เชื่อว่าตัวเองทำได้,ขอคำแนะนำจากผู้ใหญ่,ลองทำแม้จะยาก,ควบคุมความกังวลก่อน
P14,ประถม,เด็กทำผิดกฎของบ้าน,ยอมรับความผิด,อธิบายสิ่งที่เกิดขึ้น,พยายามแก้ไข,พยายามแก้ไข
P15,ประถม,เด็กต้องทำสิ่งที่ยาก,เชื่อว่าตัวเองเรียนรู้ได้,ขอคำแนะนำ,พยายามต่อ,ทำใจให้สงบก่อน`;

// ─── Parsers ──────────────────────────────────────────────────────────────────

type ScoreMap = Record<string, Record<string, Partial<Record<Trait, number>>>>;

function parseScoreCSV(csv: string): ScoreMap {
  const lines = csv.trim().split("\n");
  const map: ScoreMap = {};
  for (const line of lines.slice(1)) {
    const [code, choice, se, com, res, er] = line.split(",").map((s) => s.trim());
    if (!map[code]) map[code] = {};
    map[code][choice] = {
      SE: Number(se) || 0,
      COM: Number(com) || 0,
      RES: Number(res) || 0,
      ER: Number(er) || 0,
    };
  }
  return map;
}

function parseQuestionsCSV(csv: string, scoreMap: ScoreMap): Question[] {
  const lines = csv.trim().split("\n");
  const CHOICE_KEYS = ["A", "B", "C", "D"];
  return lines.slice(1).map((line, index) => {
    const parts = line.split(",");
    const code = parts[0].trim();
    const ageGroup = parts[1].trim();
    const questionText = parts[2].trim();

    return {
      id: index + 1,
      code,
      ageGroup,
      text: questionText,
      choices: CHOICE_KEYS.map((key, i) => ({
        text: parts[3 + i].trim(),
        traits: scoreMap[code]?.[key] || {},
      })),
    };
  });
}

// ─── Build questions ──────────────────────────────────────────────────────────

const scoreMap = parseScoreCSV(SCORE_CSV);
const questions: Question[] = parseQuestionsCSV(QUESTIONS_CSV, scoreMap);

export default questions;

/** Look up any question by its code (case-insensitive). */
export function getQuestionByCode(code: string): Question | undefined {
  return questions.find((q) => q.code.toLowerCase() === code.toLowerCase());
}

/** Get all unique question codes currently loaded. */
export function getAllQuestionCodes(): string[] {
  return questions.map((q) => q.code);
}
