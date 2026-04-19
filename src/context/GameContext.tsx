"use client";

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Trait } from "@/data/questions";

// ─── Character Definitions ────────────────────────────────────────────────────

export interface CharacterDef {
  id: string;
  name: string;
  image: string; // path under /characters/
  baseColor: string;
}

export const CHARACTERS: CharacterDef[] = [
  { id: "grandpa", name: "A", image: "/characters/grandpa.png", baseColor: "#7A9E7E" },
  { id: "grandma", name: "B", image: "/characters/grandma.png", baseColor: "#E8A030" },
  { id: "daughter", name: "C", image: "/characters/daughter.png", baseColor: "#D4607A" },
  { id: "mom", name: "D", image: "/characters/mom.png", baseColor: "#5BB8A8" },
  { id: "dad", name: "E", image: "/characters/dad.png", baseColor: "#4A7AAE" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

export type PlayerRole = "parent" | "child";
export type AgeGroup = "ประถม" | "ม.ต้น" | "ม.ปลาย" | "ทั่วไป";

export interface TraitPoints {
  SE: number;   // Self-Efficacy
  COM: number;  // Communication
  RES: number;  // Resilience
  ER: number;   // Emotional Regulation
}

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  ageGroup: AgeGroup;
  characterId: string;
  stats: {
    questionsAnswered: number;
    traitPoints: TraitPoints;
    passTokens: number;
  };
}

export interface QuestionResult {
  questionCode: string;
  playerId: string;
  selectedAnswerIndex: number | null; // null = skipped/timeout
  traitPointsEarned: Partial<Record<Trait, number>>;
  usedPassToken?: boolean;
}

export type GamePhase = "setup" | "ordering" | "playing" | "finished";

interface GameState {
  players: Player[];
  turnOrder: string[]; // player IDs
  currentTurnIndex: number;
  gamePhase: GamePhase;
  questionHistory: QuestionResult[];
  totalTraitPoints: TraitPoints; // aggregate across all players
  timeLimit: number; // in minutes (45, 60, 90)
  gameStartTime: number | null; // Date.now() timestamp
}

interface GameContextType extends GameState {
  addPlayer: (name: string, role: PlayerRole, ageGroup: AgeGroup, characterId: string) => void;
  removePlayer: (id: string) => void;
  updatePlayer: (id: string, updates: Partial<Pick<Player, "name" | "role" | "characterId">>) => void;
  setTurnOrder: (order: string[]) => void;
  randomizeTurnOrder: () => void;
  setGamePhase: (phase: GamePhase) => void;
  setTimeLimit: (minutes: number) => void;
  setGameStartTime: (time: number) => void;
  usePassToken: (playerId: string) => void;
  nextTurn: () => void;
  prevTurn: () => void;
  getCurrentPlayer: () => Player | null;
  recordAnswer: (result: QuestionResult) => void;
  finishGame: () => void;
  resetGame: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const emptyTraits = (): TraitPoints => ({
  SE: 0, COM: 0, RES: 0, ER: 0,
});

function addTraits(a: TraitPoints, b: Partial<TraitPoints>): TraitPoints {
  return {
    SE: a.SE + (b.SE ?? 0),
    COM: a.COM + (b.COM ?? 0),
    RES: a.RES + (b.RES ?? 0),
    ER: a.ER + (b.ER ?? 0),
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────

const GameContext = createContext<GameContextType | null>(null);

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>({
    players: [],
    turnOrder: [],
    currentTurnIndex: 0,
    gamePhase: "setup",
    questionHistory: [],
    totalTraitPoints: emptyTraits(),
    timeLimit: 60,
    gameStartTime: null,
  });

  const addPlayer = useCallback((name: string, role: PlayerRole, ageGroup: AgeGroup, characterId: string) => {
    setState((prev) => {
      if (prev.players.length >= 5) return prev;
      const char = CHARACTERS.find((c) => c.id === characterId) ?? CHARACTERS[prev.players.length % CHARACTERS.length];
      const newPlayer: Player = {
        id: `player-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name,
        role,
        ageGroup,
        characterId: char.id,
        stats: { questionsAnswered: 0, traitPoints: emptyTraits(), passTokens: 2 },
      };
      return { ...prev, players: [...prev.players, newPlayer] };
    });
  }, []);

  const removePlayer = useCallback((id: string) => {
    setState((prev) => ({ ...prev, players: prev.players.filter((p) => p.id !== id) }));
  }, []);

  const updatePlayer = useCallback(
    (id: string, updates: Partial<Pick<Player, "name" | "role" | "characterId">>) => {
      setState((prev) => ({
        ...prev,
        players: prev.players.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      }));
    }, []);

  const setTurnOrder = useCallback((order: string[]) => {
    setState((prev) => ({ ...prev, turnOrder: order }));
  }, []);

  const randomizeTurnOrder = useCallback(() => {
    setState((prev) => {
      const ids = prev.players.map((p) => p.id);
      for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
      }
      return { ...prev, turnOrder: ids };
    });
  }, []);

  const setGamePhase = useCallback((phase: GamePhase) => {
    setState((prev) => ({ ...prev, gamePhase: phase }));
  }, []);

  const setTimeLimit = useCallback((minutes: number) => {
    setState((prev) => ({ ...prev, timeLimit: minutes }));
  }, []);

  const setGameStartTime = useCallback((time: number) => {
    setState((prev) => ({ ...prev, gameStartTime: time }));
  }, []);

  const usePassToken = useCallback((playerId: string) => {
    setState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === playerId && p.stats.passTokens > 0
          ? { ...p, stats: { ...p.stats, passTokens: p.stats.passTokens - 1 } }
          : p
      ),
    }));
  }, []);

  const nextTurn = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentTurnIndex: (prev.currentTurnIndex + 1) % prev.turnOrder.length,
    }));
  }, []);

  const prevTurn = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentTurnIndex: prev.currentTurnIndex === 0 ? prev.turnOrder.length - 1 : prev.currentTurnIndex - 1,
    }));
  }, []);

  const getCurrentPlayer = useCallback((): Player | null => {
    const currentId = state.turnOrder[state.currentTurnIndex];
    return state.players.find((p) => p.id === currentId) ?? null;
  }, [state.turnOrder, state.currentTurnIndex, state.players]);

  const recordAnswer = useCallback((result: QuestionResult) => {
    setState((prev) => ({
      ...prev,
      questionHistory: [...prev.questionHistory, result],
      totalTraitPoints: addTraits(prev.totalTraitPoints, result.traitPointsEarned as Partial<TraitPoints>),
      players: prev.players.map((p) =>
        p.id === result.playerId
          ? {
              ...p,
              stats: {
                ...p.stats,
                questionsAnswered: p.stats.questionsAnswered + 1,
                traitPoints: addTraits(p.stats.traitPoints, result.traitPointsEarned as Partial<TraitPoints>),
              },
            }
          : p
      ),
    }));
  }, []);

  const finishGame = useCallback(() => {
    setState((prev) => ({ ...prev, gamePhase: "finished" }));
  }, []);

  const resetGame = useCallback(() => {
    setState({
      players: [], turnOrder: [], currentTurnIndex: 0,
      gamePhase: "setup", questionHistory: [], totalTraitPoints: emptyTraits(),
      timeLimit: 60, gameStartTime: null,
    });
  }, []);

  return (
    <GameContext.Provider value={{
      ...state, addPlayer, removePlayer, updatePlayer, setTurnOrder,
      randomizeTurnOrder, setGamePhase, setTimeLimit, setGameStartTime, usePassToken,
      nextTurn, prevTurn, getCurrentPlayer, recordAnswer, finishGame, resetGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}
