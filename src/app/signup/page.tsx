"use client";

import { useState } from "react";
import {
    Box, Typography, Button, Container, TextField, Alert, Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import PageTransition from "@/components/common/PageTransition";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

export default function SignupPage() {
    const router = useRouter();
    const { signUp } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("กรุณากรอกอีเมลและรหัสผ่าน");
            return;
        }
        if (password.length < 6) {
            setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
            return;
        }
        if (password !== confirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน");
            return;
        }

        setLoading(true);
        const { error: authError } = await signUp(email.trim(), password);
        setLoading(false);

        if (authError) {
            if (authError.message.includes("already registered")) {
                setError("อีเมลนี้ถูกใช้งานแล้ว");
            } else {
                setError(authError.message);
            }
        } else {
            setSuccess(true);
        }
    };

    if (success) {
        return (
            <PageTransition>
                <Box sx={{
                    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
                    background: "linear-gradient(135deg, #E8F4F0 0%, #F0F8FA 40%, #F5F0FA 100%)",
                    px: 2,
                }}>
                    <Container maxWidth="xs">
                        <Box
                            component={motion.div}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            sx={{
                                backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
                                borderRadius: 5, p: 4, textAlign: "center",
                                boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                            }}
                        >
                            <Typography sx={{ fontSize: "3rem", mb: 2 }}>✉️</Typography>
                            <Typography variant="h5" fontWeight={700} sx={{ color: "#1B7B7E", mb: 1 }}>
                                สมัครสำเร็จ!
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยันบัญชี
                            </Typography>
                            <Button
                                variant="contained" fullWidth
                                onClick={() => router.push("/login")}
                                sx={{
                                    py: 1.5, borderRadius: 4,
                                    background: "linear-gradient(135deg, #1B7B7E, #5BB8A8)",
                                }}
                            >
                                ไปหน้าเข้าสู่ระบบ
                            </Button>
                        </Box>
                    </Container>
                </Box>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <Box sx={{
                minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(135deg, #E8F4F0 0%, #F0F8FA 40%, #F5F0FA 100%)",
                py: 4, px: 2,
            }}>
                <Container maxWidth="xs">
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        sx={{
                            backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)",
                            borderRadius: 5, p: 4,
                            boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                            border: "1px solid rgba(255,255,255,0.5)",
                        }}
                    >
                        {/* Logo */}
                        <Box sx={{ textAlign: "center", mb: 3 }}>
                            <Typography variant="h5" fontWeight={700} sx={{ color: "#1B7B7E", mb: 0.5 }}>
                                mind<Box component="span" sx={{ color: "#5BB8A8" }}>flow</Box>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                สร้างบัญชีเพื่อเริ่มเล่น
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
                                fullWidth label="อีเมล" type="email"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                sx={{ mb: 2 }} autoComplete="email"
                            />
                            <TextField
                                fullWidth label="รหัสผ่าน"
                                type={showPassword ? "text" : "password"}
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                sx={{ mb: 2 }} autoComplete="new-password"
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
                            <TextField
                                fullWidth label="ยืนยันรหัสผ่าน"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                sx={{ mb: 3 }} autoComplete="new-password"
                            />

                            <Button
                                type="submit" variant="contained" fullWidth size="large"
                                disabled={loading}
                                startIcon={<PersonAddAltRoundedIcon />}
                                sx={{
                                    py: 1.5, fontSize: "1rem", fontWeight: 600,
                                    background: "linear-gradient(135deg, #1B7B7E, #5BB8A8)",
                                    boxShadow: "0 4px 20px rgba(27,123,126,0.25)",
                                    borderRadius: 4,
                                }}
                            >
                                {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
                            </Button>
                        </Box>

                        <Divider sx={{ my: 3, fontSize: "0.8rem", color: "#AAA" }}>หรือ</Divider>

                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="body2" color="text.secondary">
                                มีบัญชีอยู่แล้ว?{" "}
                                <Box component="span" onClick={() => router.push("/login")}
                                    sx={{ color: "#1B7B7E", fontWeight: 600, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
                                    เข้าสู่ระบบ
                                </Box>
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </PageTransition>
    );
}
