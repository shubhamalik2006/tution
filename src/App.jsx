import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://kysjlotbqzgolirywtre.supabase.co", "sb_publishable_m4x_lZZYK0Ae1B1Bh9ZB7A_wOK0M6K0", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "tutionhub-auth",
  },
});
const ADMIN_PIN = "1234";
const ADMINS = [
  { email: "shubhamalik2006@gmail.com", phone: "9355575272" },
  { email: "chiragmalik2000@gmail.com", phone: "9871395272" },
];
const TUTOR_UNLOCK_FEE = 149;
const AREA = "Faridabad – 121001";
const ADMIN_WHATSAPP = "919871395272";
const UPI_ID = "9871395272@bhim";

const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology", "English",
  "Hindi", "Computer Science", "Accountancy", "Economics",
  "Social Studies", "Sanskrit", "French", "Music", "Art"
];
const CLASS_OPTIONS = [
  "Nursery–KG", "1st–3rd", "4th–5th", "6th–8th",
  "9th–10th (Board)", "11th–12th (Science)", "11th–12th (Commerce)",
  "11th–12th (Arts)", "Competitive Exams", "Graduation+"
];
const tution_TYPES = ["Home Tution", "Online", "Group Batch", "Crash Course"];

// ─── Icons ───
const Icon = ({ name, size = 20 }) => {
  const s = { width: size, height: size, display: "inline-block", verticalAlign: "middle" };
  const icons = {
    book: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    search: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    lock: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    unlock: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>,
    user: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    shield: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    send: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    check: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    eye: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    x: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    home: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    rupee: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="4" x2="17" y2="4"/><line x1="7" y1="9" x2="17" y2="9"/><path d="M7 4c0 6 10 10 10 16"/><line x1="7" y1="20" x2="13" y2="14"/></svg>,
    clock: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    mapPin: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    logout: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    bell: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    trash: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
    loader: <svg style={{...s, animation: "spin 1s linear infinite"}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
    google: <svg style={s} viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
    apple: <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.52-3.23 0-1.44.62-2.2.44-3.06-.4C3.79 16.17 4.36 9.02 8.93 8.76c1.28.07 2.17.74 2.92.78.99-.2 1.94-.77 3-.83 1.28.1 2.25.59 2.88 1.52-2.64 1.58-2.01 5.07.37 6.04-.48 1.26-.71 1.84-1.38 2.96-.82 1.37-1.98 3.07-3.67 3.05zM12.03 8.7c-.15-2.34 1.84-4.38 4.03-4.55.3 2.63-2.34 4.6-4.03 4.55z"/></svg>,
    phone: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    whatsapp: <svg style={s} viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>,
  };
  return icons[name] || null;
};

// ─── Styles ───
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #FAFAF7;
    --surface: #FFFFFF;
    --surface-alt: #F3F1EC;
    --ink: #1A1A1A;
    --ink-soft: #5C5C5C;
    --ink-faint: #9C9C9C;
    --accent: #2D5A27;
    --accent-light: #E8F0E7;
    --accent-glow: #3D7A35;
    --warning: #C4850C;
    --warning-bg: #FEF7E6;
    --danger: #B8372D;
    --danger-bg: #FDE8E6;
    --success: #2D5A27;
    --success-bg: #E8F0E7;
    --border: #E2E0DB;
    --radius: 10px;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.08);
    --shadow-lg: 0 8px 32px rgba(0,0,0,0.12);
  }

  body, #root { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--ink); min-height: 100vh; }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ─── Login Page ─── */
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(160deg, #E8F0E7 0%, #FAFAF7 40%, #FEF7E6 100%);
    padding: 20px;
  }
  .login-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 16px;
    padding: 44px 36px;
    max-width: 400px;
    width: 100%;
    box-shadow: var(--shadow-lg);
    text-align: center;
  }
  .login-logo {
    width: 56px; height: 56px; border-radius: 14px;
    background: var(--accent); color: white;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
  }
  .login-card h1 {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 800;
    letter-spacing: -1px; margin-bottom: 4px;
  }
  .login-card .login-subtitle {
    font-size: 14px; color: var(--ink-soft);
    margin-bottom: 32px; line-height: 1.5;
  }
  .login-card .login-area {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 12px; color: var(--ink-faint); font-weight: 500;
    margin-bottom: 28px;
  }
  .login-btn {
    width: 100%; padding: 12px 20px; border-radius: 10px;
    border: 1.5px solid var(--border); background: var(--surface);
    font-size: 15px; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: all 0.2s; font-family: inherit; color: var(--ink);
  }
  .login-btn:hover { border-color: var(--accent); box-shadow: var(--shadow-md); transform: translateY(-1px); }
  .login-btn:active { transform: translateY(0); }
  .login-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .login-btn.apple-btn { background: #000; color: #fff; border-color: #000; }
  .login-btn.apple-btn:hover { background: #1a1a1a; border-color: #333; }
  .login-btns { display: flex; flex-direction: column; gap: 10px; }
  .login-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 20px 0; font-size: 12px; color: var(--ink-faint); font-weight: 500;
  }
  .login-divider::before, .login-divider::after {
    content: ""; flex: 1; height: 1px; background: var(--border);
  }
  .phone-form { text-align: left; }
  .phone-form .form-input { margin-bottom: 10px; }
  .phone-form .phone-row { display: flex; gap: 8px; margin-bottom: 10px; }
  .phone-form .phone-row .form-input { flex: 1; }
  .phone-form .otp-inputs { display: flex; gap: 8px; margin-bottom: 14px; }
  .phone-form .otp-inputs input {
    width: 44px; height: 48px; text-align: center; font-size: 20px;
    font-weight: 700; border: 1.5px solid var(--border); border-radius: 8px;
    font-family: inherit; background: var(--surface); color: var(--ink);
    transition: border-color 0.15s;
  }
  .phone-form .otp-inputs input:focus { outline: none; border-color: var(--accent); }
  .phone-back {
    background: none; border: none; font-size: 13px; font-weight: 600;
    color: var(--accent); cursor: pointer; margin-bottom: 16px;
    display: flex; align-items: center; gap: 4px; font-family: inherit;
  }
  .login-footer {
    margin-top: 28px; font-size: 11px; color: var(--ink-faint); line-height: 1.6;
  }
  .login-error {
    background: var(--danger-bg); color: var(--danger);
    padding: 10px 14px; border-radius: 8px; font-size: 13px;
    margin-bottom: 16px; text-align: left;
  }

  /* ─── Notification Bell ─── */
  .notif-bell {
    position: relative; cursor: pointer; background: none;
    border: 1.5px solid var(--border); border-radius: 8px;
    padding: 7px 10px; display: flex; align-items: center;
    transition: all 0.15s; font-family: inherit;
  }
  .notif-bell:hover { border-color: var(--accent); color: var(--accent); }
  .notif-badge {
    position: absolute; top: -6px; right: -6px;
    background: var(--danger); color: white;
    font-size: 10px; font-weight: 700;
    min-width: 18px; height: 18px;
    border-radius: 99px; display: flex;
    align-items: center; justify-content: center;
    padding: 0 4px; border: 2px solid var(--bg);
  }

  /* ─── Notification Panel ─── */
  .notif-panel {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: 380px; max-width: 100vw;
    background: var(--surface);
    box-shadow: -4px 0 24px rgba(0,0,0,0.12);
    z-index: 150; display: flex; flex-direction: column;
    animation: slideIn 0.25s ease;
  }
  @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
  .notif-panel-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 20px; border-bottom: 1.5px solid var(--border);
  }
  .notif-panel-header h3 { font-size: 17px; font-weight: 700; }
  .notif-panel-body { flex: 1; overflow-y: auto; padding: 12px; }
  .notif-item {
    padding: 14px 16px; border-radius: 10px;
    margin-bottom: 6px; transition: background 0.15s;
    border-left: 3px solid transparent;
  }
  .notif-item.unread {
    background: var(--accent-light);
    border-left-color: var(--accent);
  }
  .notif-item .notif-type {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.5px; margin-bottom: 4px;
  }
  .notif-item .notif-type.signup { color: var(--accent); }
  .notif-item .notif-type.query { color: var(--warning); }
  .notif-item .notif-title { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
  .notif-item .notif-body { font-size: 12px; color: var(--ink-soft); line-height: 1.45; }
  .notif-item .notif-time { font-size: 11px; color: var(--ink-faint); margin-top: 6px; }
  .notif-empty { text-align: center; padding: 40px 20px; color: var(--ink-faint); }
  .notif-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 149; }

  /* ─── User Avatar ─── */
  .user-avatar {
    width: 30px; height: 30px; border-radius: 99px;
    border: 2px solid var(--border); cursor: pointer;
    object-fit: cover;
  }
  .user-menu-btn {
    display: flex; align-items: center; gap: 6px;
    background: none; border: 1.5px solid var(--border);
    border-radius: 8px; padding: 4px 10px 4px 4px;
    cursor: pointer; transition: all 0.15s; font-family: inherit;
  }
  .user-menu-btn:hover { border-color: var(--accent); }
  .user-menu-btn span { font-size: 12px; font-weight: 600; color: var(--ink-soft); max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .app { max-width: 1000px; margin: 0 auto; padding: 0 16px; }

  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 0; border-bottom: 1.5px solid var(--border);
    position: sticky; top: 0; background: var(--bg); z-index: 50;
  }
  .nav-brand { display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .nav-brand-icon {
    width: 36px; height: 36px; border-radius: 8px;
    background: var(--accent); color: white;
    display: flex; align-items: center; justify-content: center;
  }
  .nav-brand h1 {
    font-family: 'Playfair Display', serif; font-size: 20px;
    font-weight: 800; letter-spacing: -0.5px; color: var(--ink);
  }
  .nav-brand small { font-size: 11px; color: var(--ink-faint); font-family: 'Inter'; font-weight: 500; }
  .nav-actions { display: flex; gap: 6px; align-items: center; }
  .nav-btn {
    padding: 7px 14px; border-radius: 8px; border: 1.5px solid var(--border);
    background: var(--surface); font-size: 13px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
    transition: all 0.15s; font-family: inherit;
  }
  .nav-btn:hover { border-color: var(--accent); color: var(--accent); }
  .nav-btn.active { background: var(--accent); color: white; border-color: var(--accent); }

  .hero {
    text-align: center; padding: 52px 20px 40px;
    background: linear-gradient(180deg, var(--accent-light) 0%, var(--bg) 100%);
    margin: 0 -16px;
  }
  .hero h2 {
    font-family: 'Playfair Display', serif; font-size: 34px;
    font-weight: 800; line-height: 1.15; color: var(--ink);
    letter-spacing: -1px; margin-bottom: 12px;
  }
  .hero h2 em { font-style: normal; color: var(--accent); }
  .hero p { font-size: 15px; color: var(--ink-soft); max-width: 460px; margin: 0 auto 28px; line-height: 1.55; }
  .hero-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 5px;
    background: var(--surface); border: 1px solid var(--border);
    padding: 6px 14px; border-radius: 99px; font-size: 12px;
    color: var(--ink-soft); font-weight: 500; margin-bottom: 16px;
  }

  .role-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; padding: 32px 0; }
  .role-card {
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: var(--radius); padding: 28px 24px;
    cursor: pointer; transition: all 0.2s;
  }
  .role-card:hover { border-color: var(--accent); box-shadow: var(--shadow-md); transform: translateY(-2px); }
  .role-card-icon {
    width: 44px; height: 44px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px; font-size: 20px;
  }
  .role-card h3 { font-size: 17px; font-weight: 700; margin-bottom: 6px; }
  .role-card p { font-size: 13px; color: var(--ink-soft); line-height: 1.5; }

  .btn {
    padding: 10px 22px; border-radius: 8px; font-size: 14px;
    font-weight: 600; cursor: pointer; border: none;
    display: inline-flex; align-items: center; gap: 6px;
    transition: all 0.15s; font-family: inherit;
  }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: var(--accent-glow); }
  .btn-outline { background: transparent; border: 1.5px solid var(--border); color: var(--ink); }
  .btn-outline:hover { border-color: var(--accent); color: var(--accent); }
  .btn-danger { background: var(--danger); color: white; }
  .btn-sm { padding: 6px 14px; font-size: 12px; }
  .btn-ghost { background: none; border: none; color: var(--ink-soft); padding: 6px 10px; }
  .btn-ghost:hover { color: var(--accent); }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 13px; font-weight: 600; color: var(--ink); margin-bottom: 6px; }
  .form-hint { font-size: 11px; color: var(--ink-faint); font-weight: 400; }
  .form-input, .form-select, .form-textarea {
    width: 100%; padding: 10px 14px; border: 1.5px solid var(--border);
    border-radius: 8px; font-size: 14px; font-family: inherit;
    background: var(--surface); color: var(--ink); transition: border-color 0.15s;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    outline: none; border-color: var(--accent);
  }
  .form-textarea { resize: vertical; min-height: 80px; }

  .page { padding: 24px 0 40px; }
  .page-header { margin-bottom: 24px; }
  .page-header h2 { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
  .page-header p { font-size: 14px; color: var(--ink-soft); margin-top: 4px; }
  .back-btn {
    background: none; border: none; font-size: 13px; font-weight: 600;
    color: var(--accent); cursor: pointer; margin-bottom: 12px;
    display: flex; align-items: center; gap: 4px; font-family: inherit;
  }

  .query-list { display: flex; flex-direction: column; gap: 12px; }
  .query-card {
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: var(--radius); padding: 20px; transition: all 0.15s;
  }
  .query-card:hover { box-shadow: var(--shadow-sm); }
  .query-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .query-card-header h4 { font-size: 16px; font-weight: 700; }
  .query-tag {
    display: inline-block; padding: 3px 10px; border-radius: 99px;
    font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .tag-open { background: var(--success-bg); color: var(--success); }
  .tag-closed { background: var(--danger-bg); color: var(--danger); }
  .tag-assigned { background: var(--warning-bg); color: var(--warning); }
  .query-meta { display: flex; flex-wrap: wrap; gap: 14px; font-size: 12px; color: var(--ink-soft); margin-bottom: 8px; }
  .query-meta span { display: flex; align-items: center; gap: 4px; }
  .query-msg { font-size: 13px; color: var(--ink-soft); line-height: 1.5; margin-top: 8px; padding-top: 10px; border-top: 1px solid var(--border); }

  .blurred { filter: blur(6px); user-select: none; pointer-events: none; }
  .paywall-overlay {
    position: relative; background: var(--surface); border: 1.5px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
  }
  .paywall-cover {
    position: absolute; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center; z-index: 2;
    background: rgba(255,255,255,0.65); backdrop-filter: blur(2px);
    padding: 24px; text-align: center;
  }
  .paywall-cover h4 { font-size: 16px; font-weight: 700; margin: 10px 0 4px; }
  .paywall-cover p { font-size: 13px; color: var(--ink-soft); margin-bottom: 14px; }

  .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px; }
  .stat-card {
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: var(--radius); padding: 18px; text-align: center;
  }
  .stat-card .num { font-size: 28px; font-weight: 800; color: var(--accent); font-family: 'Playfair Display', serif; }
  .stat-card .label { font-size: 12px; color: var(--ink-soft); margin-top: 2px; font-weight: 500; }

  .modal-backdrop {
    position: fixed; inset: 0; background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center; z-index: 100;
    padding: 16px;
  }
  .modal {
    background: var(--surface); border-radius: 14px; padding: 28px;
    max-width: 420px; width: 100%; box-shadow: var(--shadow-lg);
  }
  .modal h3 { font-size: 18px; font-weight: 700; margin-bottom: 16px; }

  .toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: var(--ink); color: white; padding: 12px 24px;
    border-radius: 10px; font-size: 14px; font-weight: 600;
    box-shadow: var(--shadow-lg); z-index: 200;
    display: flex; align-items: center; gap: 8px;
    animation: slideUp 0.3s ease;
  }
  @keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(12px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

  .empty-state { text-align: center; padding: 48px 20px; color: var(--ink-faint); }
  .empty-state h4 { font-size: 16px; color: var(--ink-soft); margin-bottom: 4px; }
  .filter-bar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
  .filter-chip {
    padding: 5px 14px; border-radius: 99px; font-size: 12px; font-weight: 600;
    border: 1.5px solid var(--border); background: var(--surface);
    cursor: pointer; transition: all 0.15s; font-family: inherit;
  }
  .filter-chip.active { background: var(--accent); color: white; border-color: var(--accent); }
  .divider { height: 1px; background: var(--border); margin: 28px 0; }

  .loading-center { display: flex; align-items: center; justify-content: center; padding: 40px; color: var(--ink-soft); gap: 8px; }

  /* ─── Floating WhatsApp Button ─── */
  .wa-float {
    position: fixed; bottom: 24px; right: 24px; z-index: 90;
    width: 56px; height: 56px; border-radius: 99px;
    background: #25D366; color: white; border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; box-shadow: 0 4px 16px rgba(37,211,102,0.4);
    transition: all 0.2s; text-decoration: none;
  }
  .wa-float:hover { transform: scale(1.08); box-shadow: 0 6px 24px rgba(37,211,102,0.5); }
  .wa-float-label {
    position: fixed; bottom: 88px; right: 24px; z-index: 90;
    background: var(--surface); color: var(--ink);
    padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
    box-shadow: var(--shadow-md); border: 1px solid var(--border);
    white-space: nowrap; animation: fadeIn 0.3s ease;
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

  /* ─── WhatsApp button in cards ─── */
  .wa-btn {
    padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
    border: 1.5px solid #25D366; background: #E8F8EE; color: #1a8a42;
    cursor: pointer; display: inline-flex; align-items: center; gap: 5px;
    transition: all 0.15s; font-family: inherit;
  }
  .wa-btn:hover { background: #25D366; color: white; }

  /* ─── WhatsApp success modal ─── */
  .wa-notify-box {
    background: #E8F8EE; border: 1.5px solid #25D366;
    border-radius: 12px; padding: 20px; text-align: center; margin-top: 16px;
  }
  .wa-notify-box p { font-size: 13px; color: var(--ink-soft); margin: 6px 0 14px; }

  /* ─── Onboarding Form ─── */
  .onboard-page {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: linear-gradient(160deg, #E8F0E7 0%, #FAFAF7 40%, #FEF7E6 100%);
    padding: 20px;
  }
  .onboard-card {
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: 16px; padding: 36px; max-width: 480px; width: 100%;
    box-shadow: var(--shadow-lg);
  }
  .onboard-header { text-align: center; margin-bottom: 28px; }
  .onboard-header .avatar-row {
    display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 12px;
  }
  .onboard-header .avatar-row img {
    width: 44px; height: 44px; border-radius: 99px; border: 2px solid var(--border);
  }
  .onboard-header h2 {
    font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 800; margin-bottom: 4px;
  }
  .onboard-header p { font-size: 13px; color: var(--ink-soft); }
  .role-selector { display: flex; gap: 8px; margin-bottom: 20px; }
  .role-option {
    flex: 1; padding: 16px 10px; border-radius: 10px;
    border: 1.5px solid var(--border); background: var(--surface);
    cursor: pointer; text-align: center; transition: all 0.15s; font-family: inherit;
  }
  .role-option:hover { border-color: var(--accent); }
  .role-option.selected { border-color: var(--accent); background: var(--accent-light); }
  .role-option .role-icon { font-size: 24px; margin-bottom: 6px; }
  .role-option .role-name { font-size: 13px; font-weight: 700; }

  /* ─── UPI Payment Modal ─── */
  .pay-tabs { display: flex; gap: 0; margin-bottom: 20px; border: 1.5px solid var(--border); border-radius: 8px; overflow: hidden; }
  .pay-tab {
    flex: 1; padding: 10px; font-size: 13px; font-weight: 600;
    border: none; background: var(--surface); cursor: pointer;
    font-family: inherit; color: var(--ink-soft); transition: all 0.15s;
  }
  .pay-tab.active { background: var(--accent); color: white; }
  .upi-qr-box {
    background: white; border: 2px solid var(--border);
    border-radius: 12px; padding: 20px; text-align: center;
  }
  .upi-qr-box img { width: 200px; height: 200px; margin: 0 auto 12px; display: block; }
  .upi-id-display {
    background: var(--surface-alt); padding: 8px 16px;
    border-radius: 8px; font-size: 14px; font-weight: 600;
    font-family: monospace; display: inline-block; margin: 8px 0;
    letter-spacing: 0.5px;
  }
  .upi-steps { text-align: left; font-size: 12px; color: var(--ink-soft); margin-top: 14px; line-height: 1.8; }
  .upi-steps span { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 99px; background: var(--accent); color: white; font-size: 10px; font-weight: 700; margin-right: 6px; }

  @media (max-width: 600px) {
    .hero h2 { font-size: 26px; }
    .nav-brand h1 { font-size: 16px; }
    .nav-btn span.hide-mobile { display: none; }
    .stats-row { grid-template-columns: 1fr 1fr; }
    .login-card { padding: 32px 24px; }
    .notif-panel { width: 100vw; }
    .user-menu-btn span { display: none; }
    .features-grid { grid-template-columns: 1fr; }
    .how-steps { flex-direction: column; }
    .how-step-line { display: none; }
    .testimonials-grid { grid-template-columns: 1fr; }
    .subjects-grid { grid-template-columns: repeat(3, 1fr); }
    .stats-banner { grid-template-columns: 1fr 1fr; }
    .footer-grid { grid-template-columns: 1fr; }
  }

  /* ─── Enhanced Hero ─── */
  .hero-illustration {
    display: flex; gap: 12px; justify-content: center;
    margin-bottom: 24px; flex-wrap: wrap;
  }
  .hero-float {
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: 12px; padding: 10px 16px;
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; font-weight: 600; color: var(--ink-soft);
    box-shadow: var(--shadow-sm);
    animation: float 3s ease-in-out infinite;
  }
  .hero-float:nth-child(2) { animation-delay: 0.5s; }
  .hero-float:nth-child(3) { animation-delay: 1s; }
  .hero-float .hf-icon { font-size: 20px; }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  /* ─── Stats Banner ─── */
  .stats-banner {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
    padding: 28px 0;
  }
  .stat-pill {
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: 12px; padding: 20px; text-align: center;
    transition: all 0.2s;
  }
  .stat-pill:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: var(--shadow-md); }
  .stat-pill .sp-num {
    font-size: 32px; font-weight: 800; font-family: 'Playfair Display', serif;
    background: linear-gradient(135deg, var(--accent), var(--accent-glow));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .stat-pill .sp-label { font-size: 12px; color: var(--ink-soft); margin-top: 2px; font-weight: 500; }

  /* ─── Features Section ─── */
  .section-header {
    text-align: center; margin-bottom: 28px; padding-top: 36px;
  }
  .section-header h3 {
    font-family: 'Playfair Display', serif; font-size: 24px;
    font-weight: 800; letter-spacing: -0.5px; margin-bottom: 6px;
  }
  .section-header p { font-size: 14px; color: var(--ink-soft); }
  .section-tag {
    display: inline-block; font-size: 11px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.5px;
    color: var(--accent); margin-bottom: 8px;
  }
  .features-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 14px; margin-bottom: 32px;
  }
  .feature-card {
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: 14px; padding: 24px 20px;
    transition: all 0.2s; position: relative; overflow: hidden;
  }
  .feature-card:hover { border-color: var(--accent); transform: translateY(-3px); box-shadow: var(--shadow-md); }
  .feature-card .fc-icon {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; margin-bottom: 14px;
  }
  .feature-card h4 { font-size: 15px; font-weight: 700; margin-bottom: 6px; }
  .feature-card p { font-size: 12px; color: var(--ink-soft); line-height: 1.55; }

  /* ─── How It Works ─── */
  .how-steps {
    display: flex; align-items: flex-start; gap: 0; padding: 8px 0 36px;
    position: relative;
  }
  .how-step {
    flex: 1; text-align: center; padding: 0 12px; position: relative;
  }
  .how-step-num {
    width: 40px; height: 40px; border-radius: 99px;
    background: var(--accent); color: white;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 800; margin: 0 auto 12px;
    position: relative; z-index: 2;
  }
  .how-step-line {
    position: absolute; top: 20px; left: 55%; right: -45%;
    height: 2px; background: var(--border); z-index: 1;
  }
  .how-step:last-child .how-step-line { display: none; }
  .how-step h4 { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
  .how-step p { font-size: 12px; color: var(--ink-soft); line-height: 1.45; }
  .how-step .hs-emoji { font-size: 28px; margin-bottom: 8px; }

  /* ─── Subjects Grid ─── */
  .subjects-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 10px; margin-bottom: 32px;
  }
  .subject-chip {
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: 10px; padding: 14px 10px; text-align: center;
    transition: all 0.2s; cursor: default;
  }
  .subject-chip:hover { border-color: var(--accent); background: var(--accent-light); }
  .subject-chip .sc-emoji { font-size: 24px; margin-bottom: 6px; }
  .subject-chip .sc-name { font-size: 12px; font-weight: 600; }

  /* ─── Testimonials ─── */
  .testimonials-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 14px; margin-bottom: 32px;
  }
  .testimonial-card {
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: 14px; padding: 22px 20px;
    position: relative;
  }
  .testimonial-card .tc-stars { color: #F5A623; font-size: 14px; margin-bottom: 10px; letter-spacing: 2px; }
  .testimonial-card .tc-text { font-size: 13px; color: var(--ink-soft); line-height: 1.55; margin-bottom: 14px; font-style: italic; }
  .testimonial-card .tc-author { display: flex; align-items: center; gap: 10px; }
  .testimonial-card .tc-avatar {
    width: 36px; height: 36px; border-radius: 99px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 700;
  }
  .testimonial-card .tc-name { font-size: 13px; font-weight: 700; }
  .testimonial-card .tc-role { font-size: 11px; color: var(--ink-faint); }

  /* ─── CTA Banner ─── */
  .cta-banner {
    background: linear-gradient(135deg, var(--accent), var(--accent-glow));
    border-radius: 16px; padding: 36px 28px; text-align: center;
    margin: 8px 0 32px; color: white;
  }
  .cta-banner h3 { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 800; margin-bottom: 8px; }
  .cta-banner p { font-size: 14px; opacity: 0.9; margin-bottom: 20px; }
  .cta-banner .btn { background: white; color: var(--accent); border: none; }
  .cta-banner .btn:hover { box-shadow: var(--shadow-lg); transform: translateY(-1px); }

  /* ─── Footer ─── */
  .footer {
    border-top: 1.5px solid var(--border); padding: 32px 0 20px;
    margin-top: 12px;
  }
  .footer-grid {
    display: grid; grid-template-columns: 2fr 1fr 1fr;
    gap: 28px; margin-bottom: 24px;
  }
  .footer-brand h4 { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 800; margin-bottom: 6px; }
  .footer-brand p { font-size: 12px; color: var(--ink-soft); line-height: 1.6; }
  .footer-col h5 { font-size: 13px; font-weight: 700; margin-bottom: 10px; }
  .footer-col a { display: block; font-size: 12px; color: var(--ink-soft); text-decoration: none; margin-bottom: 6px; transition: color 0.15s; }
  .footer-col a:hover { color: var(--accent); }
  .footer-bottom {
    border-top: 1px solid var(--border); padding-top: 16px;
    display: flex; justify-content: space-between; align-items: center;
    font-size: 11px; color: var(--ink-faint);
  }
  .footer-social { display: flex; gap: 10px; }
  .footer-social a {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--surface-alt); display: flex;
    align-items: center; justify-content: center;
    text-decoration: none; font-size: 14px;
    transition: all 0.15s;
  }
  .footer-social a:hover { background: var(--accent-light); }

  /* ─── Tutor Directory ─── */
  .tutor-filters {
    display: flex; gap: 10px; flex-wrap: wrap;
    margin-bottom: 20px; padding: 16px;
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: 12px;
  }
  .tutor-filters select { flex: 1; min-width: 140px; }
  .tutor-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
  .tutor-card {
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: 14px; padding: 22px; transition: all 0.2s;
  }
  .tutor-card:hover { border-color: var(--accent); box-shadow: var(--shadow-md); transform: translateY(-2px); }
  .tutor-card-top { display: flex; gap: 14px; margin-bottom: 14px; }
  .tutor-avatar {
    width: 52px; height: 52px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 800; color: white; flex-shrink: 0;
  }
  .tutor-card-info h4 { font-size: 16px; font-weight: 700; margin-bottom: 2px; }
  .tutor-card-info .tutor-qual { font-size: 12px; color: var(--ink-soft); }
  .tutor-card-info .tutor-exp {
    display: inline-block; font-size: 10px; font-weight: 700;
    background: var(--accent-light); color: var(--accent);
    padding: 2px 8px; border-radius: 99px; margin-top: 4px;
  }
  .tutor-card-subjects { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 12px; }
  .tutor-card-subjects span {
    font-size: 11px; font-weight: 600; padding: 3px 10px;
    border-radius: 99px; background: var(--surface-alt);
    color: var(--ink-soft);
  }
  .tutor-card-meta {
    display: flex; flex-wrap: wrap; gap: 12px; font-size: 12px;
    color: var(--ink-soft); margin-bottom: 12px;
    padding-top: 12px; border-top: 1px solid var(--border);
  }
  .tutor-card-meta span { display: flex; align-items: center; gap: 4px; }
  .tutor-card-bio { font-size: 12px; color: var(--ink-soft); line-height: 1.5; margin-bottom: 14px; }
  .tutor-card-actions { display: flex; gap: 6px; }
  .tutor-card-badge {
    position: absolute; top: 12px; right: 12px;
    font-size: 10px; font-weight: 700; padding: 3px 10px;
    border-radius: 99px; background: var(--success-bg); color: var(--success);
  }
`;

// ─── Toast Component ───
function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2800); return () => clearTimeout(t); }, [onClose]);
  return <div className="toast"><Icon name="check" size={16} /> {message}</div>;
}

// ─── Modal ───
function Modal({ children, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

// ─── Login Page ───
function LoginPage() {
  const [loading, setLoading] = useState(null); // null | 'google' | 'apple' | 'phone'
  const [error, setError] = useState(null);
  const [phoneStep, setPhoneStep] = useState(null); // null | 'enter' | 'otp'
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleOAuthLogin = async (provider) => {
    setLoading(provider);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (authError) {
      setError(authError.message);
      setLoading(null);
    }
  };

  const handleSendOtp = async () => {
    const cleaned = phoneNumber.replace(/\s/g, "");
    if (!/^\+\d{10,15}$/.test(cleaned)) {
      setError("Enter a valid phone number with country code (e.g. +91XXXXXXXXXX)");
      return;
    }
    setLoading("phone");
    setError(null);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: cleaned,
    });
    if (otpError) {
      setError(otpError.message);
      setLoading(null);
    } else {
      setPhoneStep("otp");
      setLoading(null);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Enter the full 6-digit code");
      return;
    }
    setLoading("phone");
    setError(null);
    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: phoneNumber.replace(/\s/g, ""),
      token: code,
      type: "sms",
    });
    if (verifyError) {
      setError(verifyError.message);
      setLoading(null);
    }
    // On success, onAuthStateChange picks up the session
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  // ─── Phone OTP Screen ───
  if (phoneStep === "enter" || phoneStep === "otp") {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <Icon name="phone" size={28} />
          </div>
          <button className="phone-back" onClick={() => { setPhoneStep(null); setError(null); setOtp(["","","","","",""]); }}>
            ← Back to login options
          </button>

          {phoneStep === "enter" ? (
            <div className="phone-form">
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 6, textAlign: "center" }}>Phone Login</h2>
              <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 20, textAlign: "center" }}>
                We'll send a 6-digit verification code via SMS.
              </p>
              {error && <div className="login-error">{error}</div>}
              <label className="form-label">Phone Number</label>
              <input
                className="form-input"
                type="tel"
                placeholder="+91 98765 43210"
                value={phoneNumber}
                onChange={e => { setPhoneNumber(e.target.value); setError(null); }}
                onKeyDown={e => e.key === "Enter" && handleSendOtp()}
              />
              <p style={{ fontSize: 11, color: "var(--ink-faint)", marginBottom: 16, marginTop: 4 }}>
                Include country code (India: +91)
              </p>
              <button className="login-btn" onClick={handleSendOtp} disabled={loading === "phone"} style={{ background: "var(--accent)", color: "white", borderColor: "var(--accent)" }}>
                {loading === "phone" ? <><Icon name="loader" size={16} /> Sending…</> : <><Icon name="send" size={16} /> Send Code</>}
              </button>
            </div>
          ) : (
            <div className="phone-form">
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 6, textAlign: "center" }}>Enter Code</h2>
              <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 20, textAlign: "center" }}>
                Sent to <strong>{phoneNumber}</strong>
              </p>
              {error && <div className="login-error">{error}</div>}
              <div className="otp-inputs" style={{ justifyContent: "center" }}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              <button className="login-btn" onClick={handleVerifyOtp} disabled={loading === "phone"} style={{ background: "var(--accent)", color: "white", borderColor: "var(--accent)" }}>
                {loading === "phone" ? <><Icon name="loader" size={16} /> Verifying…</> : <><Icon name="check" size={16} /> Verify & Sign In</>}
              </button>
              <button className="phone-back" onClick={() => { setPhoneStep("enter"); setOtp(["","","","","",""]); setError(null); }} style={{ marginTop: 14, justifyContent: "center", width: "100%" }}>
                Didn't receive it? Resend code
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Main Login Screen ───
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <Icon name="book" size={28} />
        </div>
        <h1>TutionHub</h1>
        <div className="login-area">
          <Icon name="mapPin" size={14} /> {AREA}
        </div>
        <p className="login-subtitle">
          Your trusted tution marketplace — connecting students with the best tutors in Faridabad.
        </p>

        {error && <div className="login-error">{error}</div>}

        <div className="login-btns">
          <button className="login-btn" onClick={() => handleOAuthLogin("google")} disabled={loading === "google"}>
            {loading === "google" ? <><Icon name="loader" size={18} /> Signing in…</> : <><Icon name="google" size={20} /> Continue with Google</>}
          </button>

          <div className="login-divider">or</div>

          <button className="login-btn" onClick={() => { setPhoneStep("enter"); setError(null); }}>
            <Icon name="phone" size={18} /> Continue with Phone
          </button>
        </div>

        <p className="login-footer">
          By continuing, you agree to our terms of service.<br />
          Your data is secured with Supabase authentication.
        </p>
      </div>
    </div>
  );
}

// ─── Onboarding Form ───
function OnboardingForm({ user, onComplete }) {
  const [form, setForm] = useState({
    full_name: user.user_metadata?.full_name || "",
    phone: "",
    role: "",
    class_level: "",
    subjects: "",
    area: "",
    experience: "",
    qualification: "",
    fee_range: "",
    bio: "",
    teaching_mode: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.full_name && form.phone && form.role;

  const handleSubmit = async () => {
    if (!valid) return;
    setSubmitting(true);
    setError(null);

    const profileData = {
      id: user.id,
      full_name: form.full_name,
      phone: form.phone,
      role: form.role,
      class_level: form.class_level || null,
      subjects: form.subjects || null,
      area: form.area || null,
      experience: form.experience || null,
      qualification: form.qualification || null,
      fee_range: form.fee_range || null,
      bio: form.bio || null,
      teaching_mode: form.teaching_mode || null,
    };

    const { data, error: insertError } = await supabase
      .from("profiles")
      .insert([profileData])
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
    } else {
      await insertNotification(
        "new_signup",
        `${form.full_name} completed signup`,
        `Role: ${form.role} • Phone: ${form.phone} • Area: ${form.area || "Not specified"}${form.subjects ? ` • Subjects: ${form.subjects}` : ""}`,
        { full_name: form.full_name, phone: form.phone, role: form.role, email: user.email }
      );
      const msg = `🎉 *New TutionHub Signup!*\n\n👤 ${form.full_name}\n📞 ${form.phone}\n🎭 Role: ${form.role}\n📧 ${user.email}${form.class_level ? `\n🎓 Class: ${form.class_level}` : ""}${form.subjects ? `\n📖 Subjects: ${form.subjects}` : ""}${form.area ? `\n📍 Area: ${form.area}` : ""}${form.experience ? `\n⏳ Exp: ${form.experience}` : ""}${form.fee_range ? `\n💰 Fee: ${form.fee_range}` : ""}`;
      openWhatsApp(ADMIN_WHATSAPP, msg);
      onComplete(data);
    }
  };

  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="onboard-page">
      <div className="onboard-card">
        <div className="onboard-header">
          <div className="avatar-row">
            {avatarUrl && <img src={avatarUrl} alt="" referrerPolicy="no-referrer" />}
            <div style={{ textAlign: "left" }}>
              <h2>Welcome!</h2>
              <p>{user.email}</p>
            </div>
          </div>
          <p style={{ marginTop: 8 }}>Complete your profile to get started with TutionHub.</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input className="form-input" placeholder="Your full name" value={form.full_name} onChange={e => set("full_name", e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number *</label>
          <input className="form-input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => set("phone", e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">I am a… *</label>
          <div className="role-selector">
            {[
              { id: "student", icon: "🎓", label: "Student" },
              { id: "parent", icon: "👨‍👩‍👧", label: "Parent" },
              { id: "tutor", icon: "📚", label: "Tutor" },
            ].map(r => (
              <button key={r.id} className={`role-option ${form.role === r.id ? "selected" : ""}`} onClick={() => set("role", r.id)}>
                <div className="role-icon">{r.icon}</div>
                <div className="role-name">{r.label}</div>
              </button>
            ))}
          </div>
        </div>

        {(form.role === "student" || form.role === "parent") && (
          <div className="form-group">
            <label className="form-label">Class / Level</label>
            <select className="form-select" value={form.class_level} onChange={e => set("class_level", e.target.value)}>
              <option value="">Select class</option>
              {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        {form.role === "tutor" && (
          <>
            <div className="form-group">
              <label className="form-label">Classes You Teach *</label>
              <select className="form-select" value={form.class_level} onChange={e => set("class_level", e.target.value)}>
                <option value="">Select class range</option>
                {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Qualification</label>
              <input className="form-input" placeholder="e.g. B.Ed, M.Sc Physics, B.Tech" value={form.qualification} onChange={e => set("qualification", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Teaching Experience</label>
              <select className="form-select" value={form.experience} onChange={e => set("experience", e.target.value)}>
                <option value="">Select experience</option>
                <option value="0-1 years">0-1 years</option>
                <option value="1-3 years">1-3 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5-10 years">5-10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Fee Range (per month)</label>
              <select className="form-select" value={form.fee_range} onChange={e => set("fee_range", e.target.value)}>
                <option value="">Select range</option>
                <option value="₹1,000-2,000">₹1,000 - 2,000</option>
                <option value="₹2,000-4,000">₹2,000 - 4,000</option>
                <option value="₹4,000-6,000">₹4,000 - 6,000</option>
                <option value="₹6,000-10,000">₹6,000 - 10,000</option>
                <option value="₹10,000+">₹10,000+</option>
                <option value="Negotiable">Negotiable</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Teaching Mode</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Home Tuition", "Online", "Both"].map(t => (
                  <button key={t} className={`filter-chip ${form.teaching_mode === t ? "active" : ""}`} onClick={() => set("teaching_mode", t)}>{t}</button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">About You <span className="form-hint">(brief intro for students)</span></label>
              <textarea className="form-textarea" placeholder="e.g. Experienced Maths teacher with 5+ years of coaching for board exams. Specialized in CBSE & ICSE curriculum." value={form.bio} onChange={e => set("bio", e.target.value)} />
            </div>
          </>
        )}

        <div className="form-group">
          <label className="form-label">{form.role === "tutor" ? "Subjects You Teach *" : "Subjects of Interest"}</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
            {SUBJECTS.map(s => {
              const selected = form.subjects.split(",").map(x => x.trim()).includes(s);
              return (
                <button key={s} className={`filter-chip ${selected ? "active" : ""}`} onClick={() => {
                  const current = form.subjects ? form.subjects.split(",").map(x => x.trim()).filter(Boolean) : [];
                  if (selected) set("subjects", current.filter(x => x !== s).join(", "));
                  else set("subjects", [...current, s].join(", "));
                }} style={{ fontSize: 11, padding: "4px 10px" }}>{s}</button>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Area / Locality <span className="form-hint">(in Faridabad)</span></label>
          <input className="form-input" placeholder="e.g. Sector 15, NIT, Ballabhgarh" value={form.area} onChange={e => set("area", e.target.value)} />
        </div>

        <button className="btn btn-primary" onClick={handleSubmit} disabled={!valid || submitting} style={{ width: "100%" }}>
          {submitting ? <><Icon name="loader" size={16} /> Saving…</> : <><Icon name="check" size={16} /> Complete Profile</>}
        </button>

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--ink-faint)", marginTop: 16, lineHeight: 1.6 }}>
          Your information helps us match you with the right {form.role === "tutor" ? "students" : "tutors"} in Faridabad.
        </p>
      </div>
    </div>
  );
}

// ─── Notification Helpers ───
async function insertNotification(type, title, body, meta = {}) {
  try {
    await supabase.from("notifications").insert([{ type, title, body, meta }]);
  } catch (e) {
    console.warn("Notification insert failed:", e);
  }
}

// ─── WhatsApp Helpers ───
function openWhatsApp(phone, message) {
  const cleaned = phone.replace(/[^0-9]/g, "");
  const url = `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function notifyAdminWhatsApp(query) {
  const msg = `📚 *New TutionHub Query!*\n\n👤 Student: ${query.student_name}\n📞 Phone: ${query.phone}\n📖 Subject: ${query.subject}\n🎓 Class: ${query.class_level}\n🏠 Type: ${query.tution_type}\n📍 Area: ${query.area || AREA}${query.message ? `\n💬 Note: ${query.message}` : ""}\n\n🕐 ${new Date().toLocaleString("en-IN")}`;
  openWhatsApp(ADMIN_WHATSAPP, msg);
}

function replyStudentWhatsApp(query) {
  const msg = `Hi ${query.student_name}! 👋\n\nThis is TutionHub, Faridabad. We received your query for *${query.subject}* (${query.class_level}) tuition.\n\nWe're finding the best tutor match for you. We'll update you shortly!\n\n— TutionHub Team`;
  openWhatsApp(query.phone.replace(/\s/g, "").startsWith("+") ? query.phone.replace(/[^0-9]/g, "") : "91" + query.phone.replace(/[^0-9]/g, ""), msg);
}

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// ─── Notification Panel ───
function NotificationPanel({ notifications, onClose, onMarkAllRead, onClear }) {
  const unreadCount = notifications.filter(n => !n.read).length;
  return (
    <>
      <div className="notif-backdrop" onClick={onClose} />
      <div className="notif-panel">
        <div className="notif-panel-header">
          <h3>Notifications {unreadCount > 0 && `(${unreadCount})`}</h3>
          <div style={{ display: "flex", gap: 6 }}>
            {unreadCount > 0 && (
              <button className="btn btn-outline btn-sm" onClick={onMarkAllRead}>
                <Icon name="check" size={12} /> Read all
              </button>
            )}
            {notifications.length > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={onClear} style={{ color: "var(--danger)" }}>
                <Icon name="trash" size={12} />
              </button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              <Icon name="x" size={16} />
            </button>
          </div>
        </div>
        <div className="notif-panel-body">
          {notifications.length === 0 ? (
            <div className="notif-empty">
              <Icon name="bell" size={28} />
              <p style={{ marginTop: 12, fontSize: 14 }}>No notifications yet</p>
              <p style={{ fontSize: 12 }}>You'll see alerts here when students sign up or submit queries.</p>
            </div>
          ) : notifications.map(n => (
            <div key={n.id} className={`notif-item ${!n.read ? "unread" : ""}`}>
              <div className={`notif-type ${n.type === "new_signup" ? "signup" : "query"}`}>
                {n.type === "new_signup" ? "New Signup" : "New Query"}
              </div>
              <div className="notif-title">{n.title}</div>
              <div className="notif-body">{n.body}</div>
              <div className="notif-time">{timeAgo(n.created_at)}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Main App ───
export default function TutionHub() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = not logged in
  const [view, setView] = useState("home");
  const [queries, setQueries] = useState([]);
  const [adminAuth, setAdminAuth] = useState(false);
  const [tutorUnlocked, setTutorUnlocked] = useState([]);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [unlockCount, setUnlockCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [profile, setProfile] = useState(undefined);
  const [tutors, setTutors] = useState([]);

  // Check if current user is admin
  const isAdmin = ADMINS.some(a => user?.email === a.email || user?.phone?.includes(a.phone));

  const showToast = useCallback((msg) => setToast(msg), []);

  // ─── Fetch Profile ───
  const fetchProfile = useCallback(async (uid) => {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", uid).single();
    if (error || !data) {
      setProfile(null);
    } else {
      setProfile(data);
    }
  }, []);

  // ─── Auth State ───
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) fetchProfile(u.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }

      if (event === "SIGNED_IN" && currentUser) {
        const createdAt = new Date(currentUser.created_at).getTime();
        const now = Date.now();
        if (now - createdAt < 60000) {
          const name = currentUser.user_metadata?.full_name || currentUser.email;
          await insertNotification(
            "new_signup",
            `${name} joined TutionHub`,
            `New user signed up via Google: ${currentUser.email}`,
            { email: currentUser.email, avatar: currentUser.user_metadata?.avatar_url }
          );
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // ─── Fetch queries from Supabase ───
  const fetchQueries = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("queries")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setQueries(data);
    setLoading(false);
  }, []);

  // ─── Fetch unlock count ───
  const fetchUnlockCount = useCallback(async () => {
    const { count } = await supabase
      .from("unlocks")
      .select("*", { count: "exact", head: true });
    setUnlockCount(count || 0);
  }, []);

  // ─── Fetch notifications ───
  const fetchNotifications = useCallback(async () => {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setNotifications(data);
  }, []);

  // ─── Fetch Tutors ───
  const fetchTutors = useCallback(async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "tutor")
      .order("created_at", { ascending: false });
    if (data) setTutors(data);
  }, []);

  // ─── Load data on mount ───
  useEffect(() => {
    if (user) {
      fetchQueries();
      fetchUnlockCount();
      fetchNotifications();
      fetchTutors();
    }
  }, [user, fetchQueries, fetchUnlockCount, fetchNotifications, fetchTutors]);

  // ─── Real-time subscription ───
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("queries-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "queries" }, () => {
        fetchQueries();
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, () => {
        fetchNotifications();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, fetchQueries, fetchNotifications]);

  const openQ = queries.filter(q => q.status === "open").length;
  const totalEarnings = unlockCount * TUTOR_UNLOCK_FEE;
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  // ─── Navigation ───
  const goHome = () => { setView("home"); setAdminAuth(false); };

  // ─── Sign Out ───
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAdminAuth(false);
    setView("home");
  };

  // ─── Notification Actions ───
  const markAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;
    await supabase.from("notifications").update({ read: true }).in("id", unreadIds);
    fetchNotifications();
  };

  const clearNotifications = async () => {
    await supabase.from("notifications").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    setNotifications([]);
    setShowNotifPanel(false);
  };

  // ─── Auth Gate: Show loading or login ───
  if (user === undefined) {
    return (
      <>
        <style>{css}</style>
        <div className="login-page">
          <div style={{ textAlign: "center", color: "var(--ink-soft)" }}>
            <Icon name="loader" size={28} />
            <p style={{ marginTop: 12, fontSize: 14 }}>Loading TutionHub…</p>
          </div>
        </div>
      </>
    );
  }

  if (user === null) {
    return (
      <>
        <style>{css}</style>
        <LoginPage />
      </>
    );
  }

  // ─── Onboarding Gate ───
  if (profile === undefined) {
    return (
      <>
        <style>{css}</style>
        <div className="login-page">
          <div style={{ textAlign: "center", color: "var(--ink-soft)" }}>
            <Icon name="loader" size={28} />
            <p style={{ marginTop: 12, fontSize: 14 }}>Setting up your account…</p>
          </div>
        </div>
      </>
    );
  }

  if (profile === null && !isAdmin) {
    return (
      <>
        <style>{css}</style>
        <OnboardingForm user={user} onComplete={(p) => setProfile(p)} />
      </>
    );
  }

  // ─── Admin Login ───
  function AdminLogin() {
    const [pin, setPin] = useState("");
    const [error, setError] = useState(false);
    const handleLogin = () => {
      if (pin === ADMIN_PIN) { setAdminAuth(true); setView("admin"); }
      else setError(true);
    };
    return (
      <div className="page">
        <button className="back-btn" onClick={goHome}>← Back to home</button>
        <div style={{ maxWidth: 360, margin: "40px auto", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Icon name="shield" size={28} />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 4 }}>Admin Access</h2>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 24 }}>Enter your 4-digit PIN to continue</p>
          <div className="form-group">
            <input className="form-input" type="password" maxLength={4} placeholder="● ● ● ●"
              value={pin} onChange={e => { setPin(e.target.value); setError(false); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ textAlign: "center", fontSize: 22, letterSpacing: 12 }}
            />
            {error && <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 6 }}>Incorrect PIN. Try again.</p>}
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleLogin}>
            <Icon name="lock" size={16} /> Unlock Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ─── Student Form ───
  function StudentForm() {
    const [form, setForm] = useState({ student_name: "", phone: "", subject: "", class_level: "", tution_type: "", area: "", message: "" });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const valid = form.student_name && form.phone && form.subject && form.class_level && form.tution_type;

    const submit = async () => {
      setSubmitting(true);
      const { error } = await supabase.from("queries").insert([{
        student_name: form.student_name,
        phone: form.phone,
        subject: form.subject,
        class_level: form.class_level,
        tution_type: form.tution_type,
        area: form.area || "Faridabad 121001",
        message: form.message,
        status: "open"
      }]);
      setSubmitting(false);
      if (error) {
        showToast("Something went wrong. Please try again.");
        console.error(error);
      } else {
        await insertNotification(
          "new_query",
          `New query: ${form.subject} — ${form.class_level}`,
          `${form.student_name} is looking for a ${form.tution_type.toLowerCase()} tutor. Phone: ${form.phone}`,
          { student_name: form.student_name, subject: form.subject, class_level: form.class_level }
        );
        fetchQueries();
        setSubmitted(true);
        // Auto-notify admin on WhatsApp
        notifyAdminWhatsApp(form);
      }
    };

    if (submitted) {
      return (
        <div className="page" style={{ textAlign: "center", paddingTop: 60 }}>
          <div style={{ width: 64, height: 64, borderRadius: 99, background: "var(--success-bg)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>
            <Icon name="check" size={32} />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 6 }}>Query Submitted!</h2>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", maxWidth: 400, margin: "0 auto 24px", lineHeight: 1.6 }}>
            We've received your request for <strong>{form.subject}</strong> ({form.class_level}) tuition. Our team will connect you with the best tutor shortly.
          </p>

          <div className="wa-notify-box">
            <Icon name="whatsapp" size={28} />
            <p>Want a faster response? Message us directly on WhatsApp.</p>
            <button className="btn btn-primary" onClick={() => notifyAdminWhatsApp(form)} style={{ background: "#25D366", borderColor: "#25D366" }}>
              <Icon name="whatsapp" size={16} /> Chat on WhatsApp
            </button>
          </div>

          <button className="btn btn-outline" onClick={() => { setSubmitted(false); setForm({ student_name: "", phone: "", subject: "", class_level: "", tution_type: "", area: "", message: "" }); setView("home"); }} style={{ marginTop: 20 }}>
            <Icon name="home" size={16} /> Back to Home
          </button>
        </div>
      );
    }

    return (
      <div className="page">
        <button className="back-btn" onClick={goHome}>← Back to home</button>
        <div className="page-header">
          <h2>Find a Tutor</h2>
          <p>Tell us what you need — we'll match you with the best tutor in {AREA}.</p>
        </div>
        <div style={{ maxWidth: 520 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Your Name *</label>
              <input className="form-input" placeholder="Full name" value={form.student_name} onChange={e => set("student_name", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input className="form-input" placeholder="10-digit number" value={form.phone} onChange={e => set("phone", e.target.value)} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Subject *</label>
              <select className="form-select" value={form.subject} onChange={e => set("subject", e.target.value)}>
                <option value="">Select subject</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Class / Level *</label>
              <select className="form-select" value={form.class_level} onChange={e => set("class_level", e.target.value)}>
                <option value="">Select class</option>
                {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Tution Type *</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {tution_TYPES.map(t => (
                <button key={t} className={`filter-chip ${form.tution_type === t ? "active" : ""}`} onClick={() => set("tution_type", t)}>{t}</button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Area / Locality <span className="form-hint">(in Faridabad 121001)</span></label>
            <input className="form-input" placeholder="e.g. Sector 15, NIT, Ballabhgarh" value={form.area} onChange={e => set("area", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Additional Details</label>
            <textarea className="form-textarea" placeholder="Budget, preferred timing, specific requirements…" value={form.message} onChange={e => set("message", e.target.value)} />
          </div>
          <button className="btn btn-primary" disabled={!valid || submitting} onClick={submit} style={{ width: "100%" }}>
            {submitting ? <><Icon name="loader" size={16} /> Submitting...</> : <><Icon name="send" size={16} /> Submit Query</>}
          </button>
        </div>
      </div>
    );
  }

  // ─── Admin Dashboard ───
  function AdminDash() {
    const filtered = statusFilter === "all" ? queries : queries.filter(q => q.status === statusFilter);

    const changeStatus = async (id, status) => {
      const { error } = await supabase.from("queries").update({ status }).eq("id", id);
      if (!error) {
        fetchQueries();
        showToast(`Query marked as ${status}`);
      }
    };

    const deleteQ = async (id) => {
      const { error } = await supabase.from("queries").delete().eq("id", id);
      if (!error) {
        fetchQueries();
        showToast("Query removed");
      }
    };

    return (
      <div className="page">
        <button className="back-btn" onClick={goHome}>← Back to home</button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
          <div className="page-header">
            <h2>Admin Dashboard</h2>
            <p>Full access to all tution queries • Live from Supabase</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn btn-outline btn-sm" onClick={fetchQueries}><Icon name="loader" size={14} /> Refresh</button>
            <button className="btn btn-outline btn-sm" onClick={() => { setAdminAuth(false); goHome(); }}>
              <Icon name="logout" size={14} /> Logout
            </button>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card"><div className="num">{queries.length}</div><div className="label">Total Queries</div></div>
          <div className="stat-card"><div className="num">{openQ}</div><div className="label">Open</div></div>
          <div className="stat-card"><div className="num">{unlockCount}</div><div className="label">Tutor Unlocks</div></div>
          <div className="stat-card"><div className="num">₹{totalEarnings}</div><div className="label">Revenue</div></div>
        </div>

        <div className="filter-bar">
          {["all", "open", "assigned", "closed"].map(f => (
            <button key={f} className={`filter-chip ${statusFilter === f ? "active" : ""}`}
              onClick={() => setStatusFilter(f)}>{f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>

        {loading ? (
          <div className="loading-center"><Icon name="loader" size={20} /> Loading queries...</div>
        ) : (
          <div className="query-list">
            {filtered.length === 0 ? (
              <div className="empty-state"><h4>No queries here</h4><p>No {statusFilter} queries right now.</p></div>
            ) : filtered.map(q => (
              <div key={q.id} className="query-card">
                <div className="query-card-header">
                  <h4>{q.subject} — {q.class_level}</h4>
                  <span className={`query-tag tag-${q.status}`}>{q.status}</span>
                </div>
                <div className="query-meta">
                  <span><Icon name="user" size={14} /> {q.student_name}</span>
                  <span>📞 {q.phone}</span>
                  <span><Icon name="mapPin" size={14} /> {q.area || AREA}</span>
                  <span><Icon name="clock" size={14} /> {new Date(q.created_at).toLocaleDateString("en-IN")}</span>
                  <span>{q.tution_type}</span>
                </div>
                {q.message && <div className="query-msg">{q.message}</div>}
                <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
                  {q.status === "open" && <button className="btn btn-primary btn-sm" onClick={() => changeStatus(q.id, "assigned")}>Mark Assigned</button>}
                  {q.status === "assigned" && <button className="btn btn-outline btn-sm" onClick={() => changeStatus(q.id, "closed")}>Close</button>}
                  {q.status === "closed" && <button className="btn btn-outline btn-sm" onClick={() => changeStatus(q.id, "open")}>Reopen</button>}
                  <button className="wa-btn" onClick={() => replyStudentWhatsApp(q)}><Icon name="whatsapp" size={14} /> Reply on WhatsApp</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => deleteQ(q.id)} style={{ color: "var(--danger)" }}><Icon name="trash" size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── Tutor Portal ───
  function TutorPortal() {
    const isUnlocked = (id) => tutorUnlocked.includes(id);
    const [payTab, setPayTab] = useState("upi");

    const handlePay = (id) => {
      setPayTab("upi");
      setModal(
        <Modal onClose={() => setModal(null)}>
          <PayModal id={id} />
        </Modal>
      );
    };

    function PayModal({ id }) {
      const [tab, setTab] = useState("upi");
      const [confirming, setConfirming] = useState(false);
      const upiLink = `upi://pay?pa=${UPI_ID}&pn=TutionHub&am=${TUTOR_UNLOCK_FEE}&cu=INR&tn=TutionHub-Unlock-${id?.slice(0,8)}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

      const handleUpiDone = async () => {
        setConfirming(true);
        // Notify admin via WhatsApp about payment
        const msg = `💰 *Payment Claim — TutionHub*\n\nA tutor claims to have paid ₹${TUTOR_UNLOCK_FEE} via UPI for query ID: ${id?.slice(0,8)}\n\nPlease verify in your UPI app and confirm.`;
        openWhatsApp(ADMIN_WHATSAPP, msg);
        // Optimistically unlock
        await supabase.from("unlocks").insert([{
          query_id: id,
          amount: TUTOR_UNLOCK_FEE,
          payment_id: "upi_manual_" + Date.now()
        }]);
        setTutorUnlocked(u => [...u, id]);
        fetchUnlockCount();
        setModal(null);
        showToast("Payment sent! Query unlocked.");
        setConfirming(false);
      };

      return (
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--warning-bg)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <Icon name="rupee" size={24} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Unlock Query Details</h3>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 16 }}>
            Pay <strong>₹{TUTOR_UNLOCK_FEE}</strong> to see student contact info and full details.
          </p>

          <div className="pay-tabs">
            <button className={`pay-tab ${tab === "upi" ? "active" : ""}`} onClick={() => setTab("upi")}>
              UPI / QR Code
            </button>
            <button className={`pay-tab ${tab === "razorpay" ? "active" : ""}`} onClick={() => setTab("razorpay")}>
              Card / Netbanking
            </button>
          </div>

          {tab === "upi" ? (
            <div className="upi-qr-box">
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 10 }}>
                Scan QR or tap to pay ₹{TUTOR_UNLOCK_FEE}
              </p>
              <img src={qrUrl} alt="UPI QR Code" style={{ borderRadius: 8 }} />
              <div className="upi-id-display">{UPI_ID}</div>
              <div className="upi-steps">
                <p><span>1</span> Open Google Pay, PhonePe, or any UPI app</p>
                <p><span>2</span> Scan the QR code or send ₹{TUTOR_UNLOCK_FEE} to the UPI ID above</p>
                <p><span>3</span> Click "I've Paid" below after payment</p>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setModal(null)}>Cancel</button>
                <a href={upiLink} style={{ flex: 1, textDecoration: "none" }}>
                  <button className="btn btn-primary" style={{ width: "100%", background: "#5F259F", borderColor: "#5F259F" }}>
                    Open UPI App
                  </button>
                </a>
              </div>
              <button className="btn btn-primary" onClick={handleUpiDone} disabled={confirming} style={{ width: "100%", marginTop: 8 }}>
                {confirming ? <><Icon name="loader" size={16} /> Confirming…</> : <><Icon name="check" size={16} /> I've Paid ₹{TUTOR_UNLOCK_FEE}</>}
              </button>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 16 }}>
                Pay securely via Razorpay — cards, netbanking, wallets & UPI.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setModal(null)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => {
                  const options = {
                    key: "rzp_live_TCykYVAZL4m3a8",
                    amount: 14900,
                    currency: "INR",
                    name: "TutionHub",
                    description: "Unlock Student Query",
                    handler: async (response) => {
                      await supabase.from("unlocks").insert([{
                        query_id: id,
                        amount: TUTOR_UNLOCK_FEE,
                        payment_id: response.razorpay_payment_id
                      }]);
                      setTutorUnlocked(u => [...u, id]);
                      fetchUnlockCount();
                      setModal(null);
                      showToast("Payment successful! Query unlocked.");
                    },
                    theme: { color: "#2D5A27" }
                  };
                  const rzp = new window.Razorpay(options);
                  rzp.open();
                }}>
                  <Icon name="unlock" size={16} /> Pay ₹{TUTOR_UNLOCK_FEE}
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
    const openQueries = queries.filter(q => q.status === "open");
    return (
      <div className="page">
        <button className="back-btn" onClick={goHome}>← Back to home</button>
        <div className="page-header">
          <h2>Tutor Portal</h2>
          <p>Browse open tution queries in {AREA}. Pay ₹{TUTOR_UNLOCK_FEE} per query to see full contact details.</p>
        </div>

        {loading ? (
          <div className="loading-center"><Icon name="loader" size={20} /> Loading queries...</div>
        ) : (
          <div className="query-list">
            {openQueries.length === 0 ? (
              <div className="empty-state"><h4>No open queries</h4><p>Check back later for new student requests.</p></div>
            ) : openQueries.map(q => {
              const unlocked = isUnlocked(q.id);
              return (
                <div key={q.id} className="paywall-overlay">
                  {!unlocked && (
                    <div className="paywall-cover">
                      <Icon name="lock" size={28} />
                      <h4>Contact Details Locked</h4>
                      <p>Subject & class visible. Pay to unlock student name, phone, and detailed requirements.</p>
                      <button className="btn btn-primary btn-sm" onClick={() => handlePay(q.id)}>
                        <Icon name="rupee" size={14} /> Pay ₹{TUTOR_UNLOCK_FEE} to Unlock
                      </button>
                    </div>
                  )}
                  <div className={`query-card ${!unlocked ? "blurred" : ""}`} style={{ border: "none" }}>
                    <div className="query-card-header">
                      <h4>{q.subject} — {q.class_level}</h4>
                      <span className="query-tag tag-open">{q.tution_type}</span>
                    </div>
                    <div className="query-meta">
                      <span><Icon name="user" size={14} /> {unlocked ? q.student_name : "●●●●●●●●"}</span>
                      <span>📞 {unlocked ? q.phone : "●●●●●●●●●●"}</span>
                      <span><Icon name="mapPin" size={14} /> {q.area || AREA}</span>
                      <span><Icon name="clock" size={14} /> {new Date(q.created_at).toLocaleDateString("en-IN")}</span>
                    </div>
                    {q.message && <div className="query-msg">{unlocked ? q.message : "Student requirements are hidden. Unlock to view full details, budget preferences, and scheduling needs."}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ─── Home ───
  // ─── Browse Tutors ───
  function BrowseTutors() {
    const [subjectFilter, setSubjectFilter] = useState("");
    const [classFilter, setClassFilter] = useState("");
    const [modeFilter, setModeFilter] = useState("");
    const avatarColors = ["#2D5A27", "#C4850C", "#2D5AA7", "#B8372D", "#7B2D8E", "#1A8A42"];

    const filtered = tutors.filter(t => {
      const matchSubject = !subjectFilter || (t.subjects && t.subjects.toLowerCase().includes(subjectFilter.toLowerCase()));
      const matchClass = !classFilter || (t.class_level && t.class_level.includes(classFilter));
      const matchMode = !modeFilter || (t.teaching_mode && (t.teaching_mode === modeFilter || t.teaching_mode === "Both"));
      return matchSubject && matchClass && matchMode;
    });

    return (
      <div className="page">
        <button className="back-btn" onClick={goHome}>← Back to home</button>
        <div className="page-header">
          <h2>Browse Tutors</h2>
          <p>Find the right tutor by subject, class, and teaching mode. {tutors.length} tutors registered.</p>
        </div>

        <div className="tutor-filters">
          <select className="form-select" value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}>
            <option value="">All Subjects</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="form-select" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
            <option value="">All Classes</option>
            {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="form-select" value={modeFilter} onChange={e => setModeFilter(e.target.value)}>
            <option value="">All Modes</option>
            <option value="Home Tuition">Home Tuition</option>
            <option value="Online">Online</option>
          </select>
          {(subjectFilter || classFilter || modeFilter) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setSubjectFilter(""); setClassFilter(""); setModeFilter(""); }}>
              <Icon name="x" size={14} /> Clear
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <h4>{tutors.length === 0 ? "No tutors registered yet" : "No tutors match your filters"}</h4>
            <p>{tutors.length === 0 ? "Be the first tutor to register on TutionHub!" : "Try changing your subject or class filter."}</p>
            {tutors.length === 0 && (
              <button className="btn btn-primary" onClick={() => setView("student")} style={{ marginTop: 12 }}>
                <Icon name="send" size={14} /> Post a Query Instead
              </button>
            )}
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: "var(--ink-faint)", marginBottom: 14 }}>
              Showing {filtered.length} tutor{filtered.length !== 1 ? "s" : ""}{subjectFilter ? ` for ${subjectFilter}` : ""}{classFilter ? ` in ${classFilter}` : ""}
            </p>
            <div className="tutor-grid">
              {filtered.map((t, i) => {
                const color = avatarColors[i % avatarColors.length];
                const subjects = t.subjects ? t.subjects.split(",").map(s => s.trim()).filter(Boolean) : [];
                return (
                  <div key={t.id} className="tutor-card" style={{ position: "relative" }}>
                    {t.available !== false && <div className="tutor-card-badge">Available</div>}
                    <div className="tutor-card-top">
                      <div className="tutor-avatar" style={{ background: color }}>
                        {t.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="tutor-card-info">
                        <h4>{t.full_name}</h4>
                        {t.qualification && <div className="tutor-qual">{t.qualification}</div>}
                        {t.experience && <div className="tutor-exp">⏳ {t.experience}</div>}
                      </div>
                    </div>

                    {subjects.length > 0 && (
                      <div className="tutor-card-subjects">
                        {subjects.map(s => <span key={s}>{s}</span>)}
                      </div>
                    )}

                    {t.bio && <div className="tutor-card-bio">{t.bio}</div>}

                    <div className="tutor-card-meta">
                      {t.class_level && <span>🎓 {t.class_level}</span>}
                      {t.area && <span><Icon name="mapPin" size={12} /> {t.area}</span>}
                      {t.fee_range && <span><Icon name="rupee" size={12} /> {t.fee_range}</span>}
                      {t.teaching_mode && <span>🏠 {t.teaching_mode}</span>}
                    </div>

                    <div className="tutor-card-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => setView("student")}>
                        <Icon name="send" size={12} /> Request This Tutor
                      </button>
                      <button className="wa-btn" onClick={() => {
                        const msg = `Hi! I found you on TutionHub. I'm interested in ${subjects[0] || "tuition"} classes. Are you available?`;
                        const phone = t.phone?.replace(/\s/g, "").startsWith("+") ? t.phone.replace(/[^0-9]/g, "") : "91" + t.phone?.replace(/[^0-9]/g, "");
                        openWhatsApp(phone, msg);
                      }}>
                        <Icon name="whatsapp" size={12} /> WhatsApp
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  function Home() {
    const subjectIcons = [
      { name: "Mathematics", emoji: "📐" }, { name: "Physics", emoji: "⚛️" },
      { name: "Chemistry", emoji: "🧪" }, { name: "Biology", emoji: "🧬" },
      { name: "English", emoji: "📝" }, { name: "Hindi", emoji: "🕉️" },
      { name: "Computer Science", emoji: "💻" }, { name: "Economics", emoji: "📊" },
    ];

    return (
      <>
        {/* ─── Hero ─── */}
        <div className="hero">
          <div className="hero-illustration">
            <div className="hero-float"><span className="hf-icon">📚</span> 100+ Tutors</div>
            <div className="hero-float"><span className="hf-icon">⭐</span> 4.8 Rating</div>
            <div className="hero-float"><span className="hf-icon">📍</span> Faridabad</div>
          </div>
          <div className="hero-badge"><Icon name="mapPin" size={14} /> Serving {AREA}</div>
          <h2>Your Trusted <em>Tution</em><br />Marketplace</h2>
          <p>Students find the right tutor. Tutors find the right students. One platform, one neighbourhood.</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => setView("student")}><Icon name="search" size={16} /> Find a Tutor</button>
            <button className="btn btn-outline" onClick={() => setView("tutor")}><Icon name="book" size={16} /> I'm a Tutor</button>
          </div>
        </div>

        {/* ─── Stats Banner ─── */}
        <div className="stats-banner">
          <div className="stat-pill"><div className="sp-num">500+</div><div className="sp-label">Students Helped</div></div>
          <div className="stat-pill"><div className="sp-num">100+</div><div className="sp-label">Verified Tutors</div></div>
          <div className="stat-pill"><div className="sp-num">15+</div><div className="sp-label">Subjects</div></div>
          <div className="stat-pill"><div className="sp-num">4.8⭐</div><div className="sp-label">Average Rating</div></div>
        </div>

        {/* ─── Role Cards ─── */}
        <div className="role-cards">
          <div className="role-card" onClick={() => setView("student")}>
            <div className="role-card-icon" style={{ background: "var(--accent-light)", color: "var(--accent)" }}><Icon name="search" size={24} /></div>
            <h3>I need a Tutor</h3>
            <p>Post your requirement — subject, class, preferred timing. We'll connect you with verified tutors in Faridabad.</p>
          </div>
          <div className="role-card" onClick={() => setView("tutor")}>
            <div className="role-card-icon" style={{ background: "var(--warning-bg)", color: "var(--warning)" }}><Icon name="book" size={24} /></div>
            <h3>I'm a Tutor</h3>
            <p>Browse open student queries near you. Pay a small fee to unlock contact details and apply directly.</p>
          </div>
          <div className="role-card" onClick={() => setView(isAdmin ? "admin" : "admin-login")}>
            <div className="role-card-icon" style={{ background: "var(--surface-alt)", color: "var(--ink-soft)" }}><Icon name="shield" size={24} /></div>
            <h3>Admin Panel</h3>
            <p>Manage all queries, track tutor payments, and control the platform. Admin-only access.</p>
          </div>
        </div>

        {/* ─── How It Works ─── */}
        <div className="section-header">
          <div className="section-tag">Simple Process</div>
          <h3>How TutionHub Works</h3>
          <p>From posting a requirement to finding the perfect tutor — in 4 easy steps.</p>
        </div>
        <div className="how-steps">
          <div className="how-step">
            <div className="hs-emoji">📝</div>
            <div className="how-step-num">1</div>
            <div className="how-step-line" />
            <h4>Post Requirement</h4>
            <p>Tell us the subject, class, timing & area. It takes 30 seconds.</p>
          </div>
          <div className="how-step">
            <div className="hs-emoji">🔍</div>
            <div className="how-step-num">2</div>
            <div className="how-step-line" />
            <h4>We Review</h4>
            <p>Our team reviews and matches you with the best tutors nearby.</p>
          </div>
          <div className="how-step">
            <div className="hs-emoji">🤝</div>
            <div className="how-step-num">3</div>
            <div className="how-step-line" />
            <h4>Tutor Connects</h4>
            <p>Verified tutors unlock your query and reach out directly.</p>
          </div>
          <div className="how-step">
            <div className="hs-emoji">🎓</div>
            <div className="how-step-num">4</div>
            <h4>Start Learning</h4>
            <p>Begin classes at home or online. Track progress and grow!</p>
          </div>
        </div>

        {/* ─── Features ─── */}
        <div className="section-header">
          <div className="section-tag">Why Choose Us</div>
          <h3>Built for Faridabad Families</h3>
          <p>Everything you need to find the perfect tutor, all in one place.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="fc-icon" style={{ background: "#E8F0E7" }}>✅</div>
            <h4>Verified Tutors</h4>
            <p>Every tutor goes through a verification process. We check experience, qualifications, and background.</p>
          </div>
          <div className="feature-card">
            <div className="fc-icon" style={{ background: "#FEF7E6" }}>📍</div>
            <h4>Hyperlocal Matching</h4>
            <p>We match you with tutors in your locality — Sector 15, NIT, Ballabhgarh, Old Faridabad & more.</p>
          </div>
          <div className="feature-card">
            <div className="fc-icon" style={{ background: "#E6F0FE" }}>💸</div>
            <h4>Free for Students</h4>
            <p>Students and parents never pay us anything. Post your requirement completely free of cost.</p>
          </div>
          <div className="feature-card">
            <div className="fc-icon" style={{ background: "#FDE8E6" }}>⚡</div>
            <h4>Fast Response</h4>
            <p>Get matched with a tutor within 24 hours. WhatsApp notifications keep you updated instantly.</p>
          </div>
          <div className="feature-card">
            <div className="fc-icon" style={{ background: "#F3E8FE" }}>🏠</div>
            <h4>Home & Online</h4>
            <p>Choose what works for you — home tuition, online classes, group batches, or crash courses.</p>
          </div>
          <div className="feature-card">
            <div className="fc-icon" style={{ background: "#E8F8EE" }}>🔒</div>
            <h4>Safe & Secure</h4>
            <p>Your data is encrypted with Supabase. Payments are processed securely via Razorpay.</p>
          </div>
        </div>

        {/* ─── Subjects ─── */}
        <div className="section-header">
          <div className="section-tag">We Cover</div>
          <h3>All Subjects, All Levels</h3>
          <p>From Nursery to 12th, competitive exams to graduation — we've got tutors for everything.</p>
        </div>
        <div className="subjects-grid">
          {subjectIcons.map(s => (
            <div key={s.name} className="subject-chip">
              <div className="sc-emoji">{s.emoji}</div>
              <div className="sc-name">{s.name}</div>
            </div>
          ))}
        </div>

        {/* ─── Testimonials ─── */}
        <div className="section-header">
          <div className="section-tag">What People Say</div>
          <h3>Trusted by Parents & Students</h3>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="tc-stars">★★★★★</div>
            <div className="tc-text">"Found an amazing Maths tutor for my son within 2 days. He went from 45 to 89 in board exams. Highly recommend TutionHub!"</div>
            <div className="tc-author">
              <div className="tc-avatar" style={{ background: "#E8F0E7", color: "var(--accent)" }}>R</div>
              <div><div className="tc-name">Rajesh Kumar</div><div className="tc-role">Parent, Sector 15</div></div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="tc-stars">★★★★★</div>
            <div className="tc-text">"As a tutor, I used to struggle finding students. TutionHub sends me 3-4 queries every week. Best platform for teachers!"</div>
            <div className="tc-author">
              <div className="tc-avatar" style={{ background: "#FEF7E6", color: "var(--warning)" }}>P</div>
              <div><div className="tc-name">Priya Sharma</div><div className="tc-role">Physics Tutor, NIT</div></div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="tc-stars">★★★★★</div>
            <div className="tc-text">"My daughter needed help with Chemistry for NEET. Got a great tutor in Ballabhgarh. The whole process was smooth and quick."</div>
            <div className="tc-author">
              <div className="tc-avatar" style={{ background: "#E6F0FE", color: "#2D5AA7" }}>A</div>
              <div><div className="tc-name">Anita Gupta</div><div className="tc-role">Parent, Ballabhgarh</div></div>
            </div>
          </div>
        </div>

        {/* ─── CTA Banner ─── */}
        <div className="cta-banner">
          <h3>Ready to Find Your Perfect Tutor?</h3>
          <p>Join 500+ students and parents in Faridabad who trust TutionHub.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn" onClick={() => setView("student")}><Icon name="search" size={16} /> Find a Tutor — Free</button>
            <a className="btn" href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent("Hi TutionHub! I need help finding a tutor in Faridabad.")}`} target="_blank" rel="noopener noreferrer" style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "1.5px solid rgba(255,255,255,0.4)", textDecoration: "none" }}>
              <Icon name="whatsapp" size={16} /> Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* ─── Footer ─── */}
        <div className="footer">
          <div className="footer-grid">
            <div className="footer-brand">
              <h4>TutionHub</h4>
              <p>Faridabad's trusted tuition marketplace. Connecting students with the best home tutors since 2025. Serving Sector 15, NIT, Ballabhgarh, Old Faridabad & more.</p>
            </div>
            <div className="footer-col">
              <h5>Quick Links</h5>
              <a href="#" onClick={(e) => { e.preventDefault(); setView("student"); }}>Find a Tutor</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setView("tutor"); }}>Tutor Portal</a>
              <a href={`https://wa.me/${ADMIN_WHATSAPP}`} target="_blank" rel="noopener noreferrer">Contact Us</a>
            </div>
            <div className="footer-col">
              <h5>Subjects</h5>
              <a href="#">Maths Tutor</a>
              <a href="#">Science Tutor</a>
              <a href="#">English Tutor</a>
              <a href="#">Board Exam Prep</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2025 TutionHub. Made with ❤️ in Faridabad</span>
            <div className="footer-social">
              <a href={`https://wa.me/${ADMIN_WHATSAPP}`} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={16} /></a>
              <a href="#"><Icon name="mapPin" size={16} /></a>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ─── Render ───
  const avatarUrl = user.user_metadata?.avatar_url;
  const displayName = user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-brand" onClick={goHome}>
            <div className="nav-brand-icon"><Icon name="book" size={20} /></div>
            <div>
              <h1>TutionHub</h1>
              <small>{AREA}</small>
            </div>
          </div>
          <div className="nav-actions">
            <button className={`nav-btn ${view === "student" ? "active" : ""}`} onClick={() => setView("student")}><Icon name="search" size={14} /><span className="hide-mobile">Find Tutor</span></button>
            <button className={`nav-btn ${view === "browse" ? "active" : ""}`} onClick={() => setView("browse")}><Icon name="user" size={14} /><span className="hide-mobile">Browse</span></button>
            <button className={`nav-btn ${view === "tutor" ? "active" : ""}`} onClick={() => setView("tutor")}><Icon name="eye" size={14} /><span className="hide-mobile">Tutors</span></button>
            <button className={`nav-btn ${view === "admin" || view === "admin-login" ? "active" : ""}`} onClick={() => { if (isAdmin) { setAdminAuth(true); setView("admin"); } else { setView(adminAuth ? "admin" : "admin-login"); } }}><Icon name="shield" size={14} /></button>

            {/* Notification Bell — visible for admin */}
            {(adminAuth || isAdmin) && (
              <button className="notif-bell" onClick={() => { setShowNotifPanel(true); }}>
                <Icon name="bell" size={16} />
                {unreadNotifCount > 0 && <span className="notif-badge">{unreadNotifCount > 9 ? "9+" : unreadNotifCount}</span>}
              </button>
            )}

            {/* User Avatar & Logout */}
            <button className="user-menu-btn" onClick={handleSignOut} title="Sign out">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="user-avatar" referrerPolicy="no-referrer" />
              ) : (
                <div style={{ width: 30, height: 30, borderRadius: 99, background: "var(--accent-light)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
                  {displayName?.charAt(0).toUpperCase()}
                </div>
              )}
              <span>{displayName}</span>
            </button>
          </div>
        </nav>

        {view === "home" && <Home />}
        {view === "student" && <StudentForm />}
        {view === "admin-login" && !adminAuth && <AdminLogin />}
        {(view === "admin" && adminAuth) && <AdminDash />}
        {view === "tutor" && <TutorPortal />}
        {view === "browse" && <BrowseTutors />}

        {modal}
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}

        {/* Notification Panel Slide-over */}
        {showNotifPanel && (
          <NotificationPanel
            notifications={notifications}
            onClose={() => setShowNotifPanel(false)}
            onMarkAllRead={markAllRead}
            onClear={clearNotifications}
          />
        )}

        {/* Floating WhatsApp Button */}
        {view === "home" && (
          <>
            <div className="wa-float-label">Chat with us!</div>
            <a className="wa-float" href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent("Hi TutionHub! I need help finding a tutor in Faridabad.")}`} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={28} />
            </a>
          </>
        )}
      </div>
    </>
  );
}
