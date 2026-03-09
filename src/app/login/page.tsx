"use client";

import { useState } from "react";
import {
    Box, Typography, Button, Container, TextField, Alert, Divider,
} from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import PageTransition from "@/components/common/PageTransition";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/";
    const { signIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            setError("กรุณากรอกอีเมลและรหัสผ่าน");
            return;
        }
        setLoading(true);
        setError("");
        const { error: authError } = await signIn(email.trim(), password);
        setLoading(false);
        if (authError) {
            setError(authError.message === "Invalid login credentials"
                ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
                : authError.message);
        } else {
            router.push(redirect);
            router.refresh();
        }
    };

    return (
        <PageTransition>
            <Box
                sx={{
                    minHeight: "100vh",
                    background: "linear-gradient(135deg, #E8F4F0 0%, #F0F8FA 40%, #F5F0FA 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    py: 4, px: 2,
                }}
            >
                <Container maxWidth="xs">
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        sx={{
                            backgroundColor: "rgba(255,255,255,0.85)",
                            backdropFilter: "blur(20px)",
                            borderRadius: 5, p: 4,
                            boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                            border: "1px solid rgba(255,255,255,0.5)",
                        }}
                    >
                        {/* Logo */}
                        <Box sx={{ textAlign: "center", mb: 3 }}>
                            <Typography
                                variant="h5" fontWeight={700}
                                sx={{ color: "#1B7B7E", mb: 0.5 }}
                            >
                                mind<Box component="span" sx={{ color: "#5BB8A8" }}>flow</Box>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                เข้าสู่ระบบเพื่อเริ่มเล่น
                            </Typography>
                        </Box>

                        {/* Error */}
                        {error && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }} onClose={() => setError("")}>
                                {error}
                            </Alert>
                        )}

                        {/* Form */}
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="อีเมล"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ mb: 2 }}
                                autoComplete="email"
                            />

                            <TextField
                                fullWidth
                                label="รหัสผ่าน"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ mb: 3 }}
                                autoComplete="current-password"
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={loading}
                                startIcon={<LoginRoundedIcon />}
                                sx={{
                                    py: 1.5, fontSize: "1rem", fontWeight: 600,
                                    background: "linear-gradient(135deg, #1B7B7E, #5BB8A8)",
                                    boxShadow: "0 4px 20px rgba(27,123,126,0.25)",
                                    borderRadius: 4,
                                }}
                            >
                                {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                            </Button>
                        </Box>

                        <Divider sx={{ my: 3, fontSize: "0.8rem", color: "#AAA" }}>หรือ</Divider>

                        {/* Signup link */}
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="body2" color="text.secondary">
                                ยังไม่มีบัญชี?{" "}
                                <Box
                                    component="span"
                                    onClick={() => router.push("/signup")}
                                    sx={{
                                        color: "#1B7B7E", fontWeight: 600, cursor: "pointer",
                                        "&:hover": { textDecoration: "underline" },
                                    }}
                                >
                                    สมัครสมาชิก
                                </Box>
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </PageTransition>
    );
}
