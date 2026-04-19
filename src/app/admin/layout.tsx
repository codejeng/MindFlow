"use client";

import React, { useState } from "react";
import {
  Box, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Typography, Divider,
  IconButton, useTheme, useMediaQuery, Avatar,
  Badge, Tooltip, Breadcrumbs, Link as MuiLink
} from "@mui/material";
import {
  LayoutDashboard, Users, History, Lightbulb,
  AlertCircle, BrainCircuit, FileText, Settings,
  LogOut, Bell, Search, Menu as MenuIcon, ChevronLeft, MessageSquareHeart
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const SIDEBAR_WIDTH = 280;

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users Analytics", href: "/admin/users", icon: Users },
  { label: "Sessions", href: "/admin/sessions", icon: History },
  { label: "AI Insights", href: "/admin/insights", icon: Lightbulb, badge: 3 },
  { label: "Risk Monitor", href: "/admin/risk", icon: AlertCircle, badge: 24 },
  { label: "Game Intelligence", href: "/admin/game-intel", icon: BrainCircuit },
  { label: "User Feedback", href: "/admin/feedback", icon: MessageSquareHeart },
  { label: "Reports", href: "/admin/reports", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = usePathname();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const sidebarContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "white" }}>
      {/* Brand Header */}
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: "12px",
          background: "linear-gradient(135deg, #1B7B7E, #4CAF50)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: 800, fontSize: "1.2rem",
          boxShadow: "0 4px 12px rgba(27,123,126,0.3)"
        }}>
          MF
        </Box>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: "#1B7B7E", lineHeight: 1 }}>
                MindFlow
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Mental Health OS
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.5 }} />

      {/* Navigation */}
      <List sx={{ px: 2, pt: 2, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                sx={{
                  borderRadius: "12px",
                  py: 1.5,
                  bgcolor: active ? "#F0FAFA" : "transparent",
                  color: active ? "#1B7B7E" : "#718096",
                  "&:hover": { bgcolor: "#F7FAFC" },
                  justifyContent: isCollapsed ? "center" : "flex-start",
                }}
              >
                <ListItemIcon sx={{
                  minWidth: isCollapsed ? 0 : 40,
                  color: active ? "#1B7B7E" : "inherit",
                }}>
                  <Icon size={22} />
                </ListItemIcon>
                {!isCollapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 700 : 500,
                      fontSize: "0.95rem"
                    }}
                  />
                )}
                {!isCollapsed && item.badge && (
                  <Badge badgeContent={item.badge} color={item.label === "Risk Monitor" ? "error" : "primary"} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom Actions */}
      <Box sx={{ p: 2, mt: "auto" }}>
        <Divider sx={{ mb: 2, opacity: 0.5 }} />
        <ListItemButton sx={{ borderRadius: "12px", color: "#718096" }}>
          <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 40, color: "inherit" }}><Settings size={22} /></ListItemIcon>
          {!isCollapsed && <ListItemText primary="Settings" primaryTypographyProps={{ fontWeight: 500 }} />}
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: "12px", color: "#F56565" }}>
          <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 40, color: "inherit" }}><LogOut size={22} /></ListItemIcon>
          {!isCollapsed && <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500 }} />}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F7FAFC" }}>
      {/* Sidebar - Desktop */}
      {!isMobile && (
        <Box
          component={motion.div}
          animate={{ width: isCollapsed ? 88 : SIDEBAR_WIDTH }}
          sx={{
            flexShrink: 0,
            borderRight: "1px solid #E2E8F0",
            overflow: "hidden",
            transition: "width 0.3s ease",
            position: "relative"
          }}
        >
          {sidebarContent}
          <IconButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            sx={{
              position: "absolute", bottom: 20, right: -12,
              bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              border: "1px solid #E2E8F0",
              "&:hover": { bgcolor: "#F7FAFC" },
              zIndex: 10
            }}
            size="small"
          >
            {isCollapsed ? <ChevronLeft style={{ transform: "rotate(180deg)" }} /> : <ChevronLeft />}
          </IconButton>
        </Box>
      )}

      {/* Sidebar - Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: SIDEBAR_WIDTH },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {/* Topbar */}
        <Box sx={{
          height: 70, px: 4, display: "flex", alignItems: "center",
          justifyContent: "space-between", bgcolor: "white",
          borderBottom: "1px solid #E2E8F0",
          width: "100%"
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isMobile && (
              <IconButton onClick={handleDrawerToggle} sx={{ color: "#1B7B7E" }}>
                <MenuIcon />
              </IconButton>
            )}
            <Breadcrumbs sx={{ color: "#718096" }}>
              <MuiLink underline="hover" color="inherit" href="/admin" component={Link}>
                Admin
              </MuiLink>
              <Typography color="text.primary" fontWeight={600}>
                {NAV_ITEMS.find(item => item.href === pathname)?.label || "Dashboard"}
              </Typography>
            </Breadcrumbs>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center", gap: 1, px: 2, py: 0.8,
              bgcolor: "#F7FAFC", borderRadius: "10px", border: "1px solid #E2E8F0"
            }}>
              <Search size={18} color="#A0AEC0" />
              <Typography variant="body2" color="#A0AEC0">Search analytics...</Typography>
            </Box>
            <IconButton sx={{ color: "#718096" }}>
              <Badge variant="dot" color="error">
                <Bell size={22} />
              </Badge>
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}>
              <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
                <Typography variant="body2" fontWeight={700}>Admin User</Typography>
                <Typography variant="caption" color="text.secondary">Super Admin</Typography>
              </Box>
              <Avatar sx={{ bgcolor: "#1B7B7E", width: 36, height: 36 }}>A</Avatar>
            </Box>
          </Box>
        </Box>

        {/* Page Content */}
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4, lg: 5 }, width: "100%", overflowX: "hidden" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
