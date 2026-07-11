import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE CONNECTION ───
// Replace YOUR_PUBLISHABLE_KEY with the full key you copied from Supabase dashboard
const supabase = createClient(
  "https://kysjlotbqzgolirywtre.supabase.co",
  "YOUR_PUBLISHABLE_KEY"
);

const ADMIN_PIN = "1234";
const TUTOR_UNLOCK_FEE = 149;
const AREA = "Faridabad – 121001";

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
const tution_TYPES = ["Home tution", "Online", "Group Batch", "Crash Course"];

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
  .nav-actions { display: flex; gap: 6px; }
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

  @media (max-width: 600px) {
    .hero h2 { font-size: 26px; }
    .nav-brand h1 { font-size: 16px; }
    .nav-btn span.hide-mobile { display: none; }
    .stats-row { grid-template-columns: 1fr 1fr; }
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

// ─── Main App ───
export default function tutionHub() {
  const [view, setView] = useState("home");
  const [queries, setQueries] = useState([]);
  const [adminAuth, setAdminAuth] = useState(false);
  const [tutorUnlocked, setTutorUnlocked] = useState([]);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [unlockCount, setUnlockCount] = useState(0);

  const showToast = useCallback((msg) => setToast(msg), []);

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

  // ─── Load data on mount ───
  useEffect(() => {
    fetchQueries();
    fetchUnlockCount();
  }, [fetchQueries, fetchUnlockCount]);

  // ─── Real-time subscription ───
  useEffect(() => {
    const channel = supabase
      .channel("queries-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "queries" }, () => {
        fetchQueries();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchQueries]);

  const openQ = queries.filter(q => q.status === "open").length;
  const totalEarnings = unlockCount * TUTOR_UNLOCK_FEE;

  // ─── Navigation ───
  const goHome = () => { setView("home"); setAdminAuth(false); };

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
        showToast("Query submitted! We'll connect you with the right tutor.");
        fetchQueries();
        setView("home");
      }
    };

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
            <label className="form-label">tution Type *</label>
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
                <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                  {q.status === "open" && <button className="btn btn-primary btn-sm" onClick={() => changeStatus(q.id, "assigned")}>Mark Assigned</button>}
                  {q.status === "assigned" && <button className="btn btn-outline btn-sm" onClick={() => changeStatus(q.id, "closed")}>Close</button>}
                  {q.status === "closed" && <button className="btn btn-outline btn-sm" onClick={() => changeStatus(q.id, "open")}>Reopen</button>}
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
    const handlePay = (id) => {
      setModal(
        <Modal onClose={() => setModal(null)}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--warning-bg)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Icon name="rupee" size={24} />
            </div>
            <h3>Unlock Query Details</h3>
            <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 20 }}>
              Pay <strong>₹{TUTOR_UNLOCK_FEE}</strong> to see student contact info and full details for this query.
            </p>
            <div style={{ background: "var(--surface-alt)", padding: 14, borderRadius: 8, marginBottom: 20, fontSize: 13, textAlign: "left" }}>
              <strong>Payment methods:</strong><br />
              UPI · Google Pay · PhonePe · Bank Transfer<br />
              <span style={{ color: "var(--ink-faint)" }}>Contact admin to complete payment</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={async () => {
                // Record unlock in Supabase (without tutor auth for now)
                await supabase.from("unlocks").insert([{
                  query_id: id,
                  amount: TUTOR_UNLOCK_FEE,
                  payment_id: "SIM_" + Date.now()
                }]);
                setTutorUnlocked(u => [...u, id]);
                fetchUnlockCount();
                setModal(null);
                showToast("Query unlocked! Contact details visible.");
              }}>
                <Icon name="unlock" size={16} /> Simulate Payment
              </button>
            </div>
          </div>
        </Modal>
      );
    };
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
  function Home() {
    return (
      <>
        <div className="hero">
          <div className="hero-badge"><Icon name="mapPin" size={14} /> Serving {AREA}</div>
          <h2>Your Trusted <em>tution</em><br />Marketplace</h2>
          <p>Students find the right tutor. Tutors find the right students. One platform, one neighbourhood.</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => setView("student")}><Icon name="search" size={16} /> Find a Tutor</button>
            <button className="btn btn-outline" onClick={() => setView("tutor")}><Icon name="book" size={16} /> I'm a Tutor</button>
          </div>
        </div>

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
          <div className="role-card" onClick={() => setView("admin-login")}>
            <div className="role-card-icon" style={{ background: "var(--surface-alt)", color: "var(--ink-soft)" }}><Icon name="shield" size={24} /></div>
            <h3>Admin Panel</h3>
            <p>Manage all queries, track tutor payments, and control the platform. Admin-only access.</p>
          </div>
        </div>

        <div className="divider" />
        <div style={{ textAlign: "center", padding: "8px 0 24px" }}>
          <p style={{ fontSize: 13, color: "var(--ink-faint)" }}>
            <strong style={{ color: "var(--ink-soft)" }}>How it works:</strong> Student posts query → Admin reviews → Tutor pays ₹{TUTOR_UNLOCK_FEE} to unlock → Tutor contacts student directly
          </p>
        </div>
      </>
    );
  }

  // ─── Render ───
  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-brand" onClick={goHome}>
            <div className="nav-brand-icon"><Icon name="book" size={20} /></div>
            <div>
              <h1>tutionHub</h1>
              <small>{AREA}</small>
            </div>
          </div>
          <div className="nav-actions">
            <button className={`nav-btn ${view === "student" ? "active" : ""}`} onClick={() => setView("student")}><Icon name="search" size={14} /><span className="hide-mobile">Find Tutor</span></button>
            <button className={`nav-btn ${view === "tutor" ? "active" : ""}`} onClick={() => setView("tutor")}><Icon name="eye" size={14} /><span className="hide-mobile">Tutors</span></button>
            <button className={`nav-btn ${view === "admin" || view === "admin-login" ? "active" : ""}`} onClick={() => setView(adminAuth ? "admin" : "admin-login")}><Icon name="shield" size={14} /></button>
          </div>
        </nav>

        {view === "home" && <Home />}
        {view === "student" && <StudentForm />}
        {view === "admin-login" && !adminAuth && <AdminLogin />}
        {(view === "admin" && adminAuth) && <AdminDash />}
        {view === "tutor" && <TutorPortal />}

        {modal}
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    </>
  );
}
