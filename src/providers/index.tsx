"use client";

import ThemeProvider from "./ThemeProvider";
import MotionProvider from "./MotionProvider";
import { GameProvider } from "@/context/GameContext";
import { AuthProvider } from "@/context/AuthContext";

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GameProvider>
          <MotionProvider>{children}</MotionProvider>
        </GameProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
