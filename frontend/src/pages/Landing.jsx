import { Link } from "react-router-dom";
import { CheckCircle, Zap, ShieldCheck, BarChart3, Globe, Rocket, Lock, PlayCircle, Mail, ChevronDown, Plus } from "lucide-react";

/* ─── Inline styles for things Tailwind can't do easily ─── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Inter:wght@400;500;600&display=swap');

  :root {
    --orange: #F77B3A;
    --orange-light: #FFF0E8;
    --green-bg: #D6E8D4;
    --green-dark: #3D8A3A;
    --green-progress: #4CAF50;
    --yellow: #F5C842;
    --text-dark: #1A1A2E;
    --text-muted: #8A8A9A;
    --text-light: #B0B0C0;
  }

  html { scroll-behavior: smooth; }

  body { font-family: 'Inter', sans-serif; }

  .landing-wrap {
    font-family: 'Inter', sans-serif;
    background: #F8F9FB;
    min-height: 100vh;
    color: var(--text-dark);
  }

  /* NAV */
  .e-nav {
    display: flex;
    align-items: center;
    padding: 22px 24px;
    background: #F8F9FB;
    position: sticky;
    top: 0;
    z-index: 50;
    border-bottom: 1px solid #EBEBF5;
    backdrop-filter: blur(10px);
    background: rgba(248,249,251,0.92);
    flex-wrap: wrap;
    justify-content: space-between;
  }
  @media (min-width: 768px) {
    .e-nav { padding: 22px 44px; flex-wrap: nowrap; }
  }
  .e-logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; margin-right: 16px;
  }
  @media (min-width: 768px) {
    .e-logo { margin-right: 48px; }
  }
  .e-logo-icon {
    width: 36px; height: 36px;
    background: var(--orange);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Nunito', sans-serif;
    font-weight: 900; color: #fff; font-size: 16px;
  }
  .e-logo-text {
    font-family: 'Nunito', sans-serif;
    font-weight: 800; font-size: 18px; color: var(--text-dark);
  }
  .e-nav-links {
    display: none; list-style: none; gap: 34px; flex: 1; margin: 0; padding: 0;
  }
  @media (min-width: 768px) {
    .e-nav-links { display: flex; }
  }
  .e-nav-links a {
    text-decoration: none; font-size: 14px; font-weight: 500;
    color: var(--text-dark); transition: color .2s;
  }
  .e-nav-links a:hover { color: var(--orange); }
  .e-nav-actions { display: flex; align-items: center; gap: 12px; margin-left: auto; width: 100%; }
  @media (min-width: 768px) {
    .e-nav-actions { width: auto; gap: 16px; }
  }
  .btn-signin-e {
    background: none; border: none; font-size: 14px; font-weight: 600;
    color: var(--text-dark); cursor: pointer; transition: color .2s; padding: 0;
  }
  .btn-signin-e:hover { color: var(--orange); }
  .btn-signup-e {
    background: none; border: 2px solid #E0E0EA; border-radius: 10px;
    padding: 9px 16px; font-size: 13px; font-weight: 600;
    color: var(--text-dark); cursor: pointer; transition: all .2s;
    text-decoration: none; display: inline-block;
  }
  @media (min-width: 768px) {
    .btn-signup-e { padding: 9px 22px; font-size: 14px; }
  }
  .btn-signup-e:hover { border-color: var(--orange); color: var(--orange); }

  /* HERO */
  .e-hero {
    text-align: center;
    padding: 40px 20px 0;
    animation: fadeUp .6s ease both;
  }
  @media (min-width: 768px) {
    .e-hero { padding: 60px 44px 0; }
  }
  @media (min-width: 1024px) {
    .e-hero { padding: 72px 44px 0; }
  }
  .e-hero h1 {
    font-family: 'Nunito', sans-serif;
    font-size: clamp(32px, 5vw, 64px);
    font-weight: 900;
    color: var(--text-dark);
    letter-spacing: -1.5px;
    line-height: 1.1;
    animation: fadeUp .6s .1s ease both;
    opacity: 0;
    animation-fill-mode: forwards;
  }
  .e-hero p {
    margin-top: 18px;
    font-size: clamp(14px, 3vw, 15px);
    color: var(--text-muted);
    max-width: 500px;
    margin-left: auto; margin-right: auto;
    line-height: 1.7;
    animation: fadeUp .6s .2s ease both;
    opacity: 0;
    animation-fill-mode: forwards;
    padding: 0 10px;
  }
  .hero-btns {
    display: flex; justify-content: center; gap: 12px; margin-top: 32px; flex-wrap: wrap;
    animation: fadeUp .6s .3s ease both;
    opacity: 0;
    animation-fill-mode: forwards;
  }
  @media (min-width: 768px) {
    .hero-btns { gap: 16px; flex-wrap: nowrap; }
  }
  .btn-get-started {
    background: var(--orange); color: #fff; border: none;
    border-radius: 12px; padding: 12px 24px;
    font-size: 14px; font-weight: 700; font-family: 'Nunito', sans-serif;
    cursor: pointer; box-shadow: 0 8px 24px rgba(247,123,58,.38);
    transition: transform .18s, box-shadow .18s; width: 100%;
    text-decoration: none; display: inline-block;
  }
  @media (min-width: 768px) {
    .btn-get-started { padding: 14px 30px; font-size: 15px; width: auto; }
  }
  .btn-get-started:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(247,123,58,.45);
    color: #fff;
  }
  .btn-discover {
    background: #fff; border: 2px solid #E4E4EE;
    border-radius: 12px; padding: 12px 24px;
    font-size: 14px; font-weight: 700; font-family: 'Nunito', sans-serif;
    color: var(--text-dark); cursor: pointer;
    display: inline-flex; align-items: center; gap: 8px; width: 100%;
    transition: all .18s; justify-content: center;
  }
  @media (min-width: 768px) {
    .btn-discover { padding: 14px 30px; font-size: 15px; width: auto; }
  }
  .btn-discover:hover { border-color: var(--orange); color: var(--orange); }

  /* PREVIEW AREA */
  .preview-area {
    position: relative;
    margin-top: 32px;
    padding: 0 16px;
    animation: fadeUp .6s .4s ease both;
    opacity: 0;
    animation-fill-mode: forwards;
  }
  @media (min-width: 768px) {
    .preview-area { margin-top: 48px; padding: 0 24px; }
  }
  .dot-grid {
    position: absolute; display: grid; gap: 8px; z-index: 0; pointer-events: none;
  }
  .dot-grid.right { right: 20px; top: -20px; grid-template-columns: repeat(8, 4px); }
  .dot-grid.left  { left: 20px; bottom: 30px; grid-template-columns: repeat(5, 4px); }
  .dot-grid span { width: 4px; height: 4px; border-radius: 50%; background: #C8D8C6; display: block; }
  .deco-circle {
    position: absolute; width: 120px; height: 120px; border-radius: 50%;
    background: var(--yellow); left: 60px; top: -10px; z-index: 0; opacity: .85;
  }
  .deco-dot-green {
    position: absolute; width: 22px; height: 22px; border-radius: 50%;
    background: var(--green-dark); left: 56px; bottom: 60px; z-index: 1;
  }
  .deco-dot-green2 {
    position: absolute; right: 30px; bottom: 20px;
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--green-dark); z-index: 1;
  }
  .floating-cards { position: absolute; left: 0; right: 0; top: 0; bottom: 0; pointer-events: none; z-index: 5; }

  /* Floating Cards */
  .card-lp {
    position: absolute; left: -10px; top: 20px;
    background: #fff; border-radius: 14px;
    box-shadow: 0 12px 36px rgba(0,0,0,.10);
    padding: 16px 20px; width: 148px;
    animation: floatY 4s ease-in-out infinite;
  }
  .card-lp .icon-wrap {
    width: 34px; height: 34px; border-radius: 8px;
    background: #F0F4FF; display: flex; align-items: center;
    justify-content: center; margin-bottom: 10px;
  }
  .card-lp h4 { font-size: 12px; font-weight: 700; color: var(--text-dark); }
  .card-lp p  { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

  .card-ws {
    position: absolute; left: -10px; bottom: 30px;
    background: #fff; border-radius: 14px;
    box-shadow: 0 12px 36px rgba(0,0,0,.10);
    padding: 14px 18px; width: 200px;
    animation: floatY 5s .5s ease-in-out infinite;
  }
  .card-ws h4 { font-size: 11px; color: var(--text-muted); margin-bottom: 8px; font-weight: 600; }
  .ws-selector {
    display: flex; align-items: center; justify-content: space-between;
    background: #F6F6FA; border-radius: 8px;
    padding: 7px 10px; font-size: 12px; font-weight: 600;
    color: var(--text-dark); margin-bottom: 10px;
  }
  .user-row { display: flex; align-items: center; gap: 8px; }
  .user-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg,#f7c948,#f79048);
    flex-shrink: 0; display: flex; align-items: center;
    justify-content: center; font-size: 11px; font-weight: 700; color: #fff;
  }
  .user-info .name { font-size: 11px; font-weight: 700; color: var(--text-dark); }
  .user-info .email{ font-size: 10px; color: var(--text-muted); }

  .card-inv {
    position: absolute; right: -6px; top: 30px;
    background: #fff; border-radius: 14px;
    box-shadow: 0 12px 36px rgba(0,0,0,.10);
    padding: 18px 20px; width: 136px; text-align: center;
    animation: floatY 4.5s 1s ease-in-out infinite;
  }
  .card-inv .env-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: #F0FFF0; margin: 0 auto 10px;
    display: flex; align-items: center; justify-content: center;
    color: var(--green-progress);
  }
  .card-inv h4 { font-size: 13px; font-weight: 700; color: var(--text-dark); }
  .card-inv p  { font-size: 11px; color: var(--text-muted); margin-top: 3px; }
  .card-inv .invite-count { color: var(--green-progress); font-weight: 700; }

  @keyframes floatY { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

  /* DASHBOARD OUTER */
  .dashboard-outer {
    position: relative; z-index: 3;
    margin: 0 16px;
    background: #fff;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -4px 40px rgba(0,0,0,.09);
    overflow: hidden; display: flex; min-height: 360px; flex-direction: column;
  }
  @media (min-width: 768px) {
    .dashboard-outer { margin: 0 40px; flex-direction: row; }
  }
  @media (min-width: 1024px) {
    .dashboard-outer { margin: 0 80px; }
  }
  .e-sidebar {
    display: none; flex-shrink: 0;
    background: #fff; border-bottom: 1px solid #F0F0F8;
    padding: 20px 0; flex-direction: column;
  }
  @media (min-width: 768px) {
    .e-sidebar { display: flex; width: 190px; border-right: 1px solid #F0F0F8; border-bottom: none; }
  }
  .sidebar-logo {
    display: flex; align-items: center; gap: 8px;
    padding: 0 20px 18px; border-bottom: 1px solid #F0F0F8;
  }
  .sidebar-logo .s-icon {
    width: 28px; height: 28px; background: var(--orange); border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Nunito',sans-serif; font-weight: 900; font-size: 13px; color: #fff;
  }
  .sidebar-logo span { font-family:'Nunito',sans-serif; font-weight:800; font-size:14px; color:var(--text-dark); }
  .sidebar-create {
    display: flex; align-items: center; justify-content: space-between; padding: 14px 20px;
  }
  .sidebar-create span { font-size: 12px; font-weight: 700; color: var(--text-dark); }
  .create-btn {
    width: 24px; height: 24px; background: var(--orange); border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 16px; font-weight: 700; cursor: pointer;
  }
  .s-nav-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 20px;
    font-size: 12.5px; font-weight: 600; color: var(--text-muted);
    cursor: pointer; border-radius: 8px; margin: 0 8px; transition: all .18s;
  }
  .s-nav-item:hover, .s-nav-item.active { background: #FFF4EE; color: var(--orange); }

  /* Main panel */
  .main-panel { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
  .panel-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 22px 10px; border-bottom: 1px solid #F0F0F8;
  }
  .panel-header h2 { font-size:15px; font-weight:800; color:var(--text-dark); font-family:'Nunito',sans-serif; }
  .date-badge {
    display: flex; align-items: center; gap: 6px;
    background: #F6F6FA; border-radius: 8px;
    padding: 5px 11px; font-size: 11px; font-weight: 600; color: var(--text-muted);
  }
  .panel-body { display:flex; gap:14px; padding:14px 22px; flex:1; overflow:hidden; }
  .panel-left { flex:1; display:flex; flex-direction:column; gap:12px; min-width:0; }

  /* Welcome banner */
  .welcome-banner {
    background: linear-gradient(130deg,#FFECD8 0%,#FFD9B8 100%);
    border-radius: 14px; padding: 18px 20px;
    position: relative; overflow: hidden; flex-shrink: 0;
  }
  .welcome-banner h3 { font-size:14px; font-weight:800; color:var(--text-dark); font-family:'Nunito',sans-serif; }
  .welcome-banner p  { font-size:11px; color:#7A6050; margin-top:5px; line-height:1.5; max-width:220px; }
  .banner-circle {
    position:absolute; right:-10px; bottom:-10px;
    width:90px; height:90px; border-radius:50%;
    background:rgba(247,123,58,.18);
  }
  .banner-fig { position:absolute; right:16px; bottom:0; width:80px; height:80px; }

  /* Activity + misc */
  .activity-card { background:#fff; border:1px solid #F0F0F8; border-radius:12px; padding:14px; flex:1; }
  .activity-card h4 { font-size:12px; font-weight:700; color:var(--text-dark); margin-bottom:6px; }
  .progress-card {
    background:var(--green-progress); border-radius:12px; padding:14px;
    color:#fff; display:flex; flex-direction:column; align-items:center; gap:10px;
  }
  .progress-label { font-size:10px; font-weight:600; opacity:.85; }
  .pct-label { font-size:17px; font-weight:900; font-family:'Nunito',sans-serif; color:#fff; }
  .mini-stat {
    background:#fff; border:1px solid #F0F0F8; border-radius:10px;
    padding:10px 12px; display:flex; align-items:center; justify-content:space-between;
  }
  .mini-stat .val { font-family:'Nunito',sans-serif; font-size:15px; font-weight:800; color:var(--text-dark); }
  .mini-stat .lbl { font-size:10px; color:var(--text-muted); }
  .mini-bar { display:flex; gap:2px; align-items:flex-end; }
  .mini-bar span { width:5px; border-radius:2px; background:#E0F0FF; }
  .mini-bar span.hi { background:#5A8DEE; }

  /* Profile panel */
  .profile-panel {
    width: 210px; flex-shrink:0;
    border-left: 1px solid #F0F0F8;
    display: flex; flex-direction: column;
  }
  .profile-header {
    padding:14px 16px 10px; border-bottom:1px solid #F0F0F8;
    display:flex; align-items:center; justify-content:space-between;
  }
  .profile-header h4 { font-size:12px; font-weight:700; color:var(--text-dark); }
  .profile-header span { font-size:10px; color:var(--text-muted); }
  .profile-body { padding:14px 16px; display:flex; flex-direction:column; align-items:center; }
  .avatar-ring { position:relative; width:64px; height:64px; margin-bottom:10px; }
  .avatar-ph {
    width:56px; height:56px; border-radius:50%;
    background:linear-gradient(135deg,#A8D8A0,#5CB85C);
    display:flex; align-items:center; justify-content:center;
    font-size:22px; font-weight:700; color:#fff;
  }
  .avatar-ring::before {
    content:''; position:absolute; inset:-4px; border-radius:50%;
    border:2px dashed #C5E0C3;
  }
  .profile-name { font-family:'Nunito',sans-serif; font-size:13px; font-weight:800; color:var(--text-dark); }
  .profile-role { font-size:10px; color:var(--text-muted); margin-top:2px; }
  .profile-stats { display:flex; gap:20px; margin-top:12px; }
  .ps { text-align:center; }
  .ps .n { font-family:'Nunito',sans-serif; font-size:14px; font-weight:800; color:var(--text-dark); }
  .ps .l { font-size:9px; color:var(--text-muted); }
  .divider-v { width:1px; background:#F0F0F8; }
  .ongoing-section { padding:0 16px 14px; flex:1; }
  .ongoing-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
  .ongoing-header h4 { font-size:12px; font-weight:700; color:var(--text-dark); }
  .ongoing-header a  { font-size:10px; color:var(--orange); text-decoration:none; }
  .task-item { display:flex; align-items:center; gap:8px; padding:7px 0; border-bottom:1px solid #F8F8FC; }
  .task-avatar {
    width:26px; height:26px; border-radius:50%; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    font-size:10px; font-weight:700; color:#fff;
  }
  .t-name { font-size:11px; font-weight:700; color:var(--text-dark); }
  .t-date { font-size:9.5px; color:var(--text-muted); }

  /* FEATURES SECTION */
  .features-section {
    background: #F0F4F0;
    padding: 100px 44px;
    border-top: 1px solid #E4EEE4;
  }
  .features-section h2 {
    font-family: 'Nunito', sans-serif;
    font-size: clamp(28px, 3vw, 42px);
    font-weight: 900;
    color: var(--text-dark);
    text-align: center;
    margin-bottom: 60px;
    letter-spacing: -0.5px;
  }
  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    max-width: 1100px;
    margin: 0 auto;
  }
  @media (max-width: 900px) { .features-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 600px) { .features-grid { grid-template-columns: 1fr; } }
  .feature-card {
    background: #fff;
    padding: 32px;
    border-radius: 20px;
    border: 1px solid #E8F0E8;
    transition: all .22s;
    cursor: default;
  }
  .feature-card:hover { box-shadow: 0 16px 48px rgba(0,0,0,.08); transform: translateY(-3px); }
  .feature-icon {
    width: 48px; height: 48px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px; transition: transform .2s;
  }
  .feature-card:hover .feature-icon { transform: scale(1.1); }
  .feature-card h3 { font-family:'Nunito',sans-serif; font-size:17px; font-weight:800; color:var(--text-dark); margin-bottom:10px; }
  .feature-card p  { font-size:13px; color:var(--text-muted); line-height:1.65; }

  /* STATS SECTION */
  .stats-section {
    background: var(--orange);
    padding: 80px 44px;
    text-align: center;
  }
  .stats-section h2 {
    font-family: 'Nunito', sans-serif;
    font-size: clamp(24px, 2.5vw, 36px);
    font-weight: 900; color: #fff;
    margin-bottom: 48px; letter-spacing: -0.5px;
  }
  .stats-grid { display:flex; justify-content:center; gap:80px; flex-wrap:wrap; }
  .stat-item .num {
    font-family:'Nunito',sans-serif;
    font-size: clamp(36px, 4vw, 56px);
    font-weight: 900; color: #fff; line-height: 1;
  }
  .stat-item .lbl { font-size:14px; color:rgba(255,255,255,.75); margin-top:8px; font-weight:600; }

  /* HOW IT WORKS */
  .how-section {
    background: #F8F9FB;
    padding: 100px 44px;
  }
  .how-section h2 {
    font-family: 'Nunito', sans-serif;
    font-size: clamp(28px, 3vw, 42px);
    font-weight: 900; color: var(--text-dark);
    text-align: center; margin-bottom: 60px; letter-spacing: -0.5px;
  }
  .steps-grid {
    display: grid; grid-template-columns: repeat(3,1fr); gap: 32px;
    max-width: 900px; margin: 0 auto;
  }
  @media (max-width:700px) { .steps-grid { grid-template-columns:1fr; } }
  .step-card { text-align: center; padding: 40px 24px; }
  .step-number {
    width: 56px; height: 56px; border-radius: 50%;
    background: var(--orange-light);
    border: 2px solid var(--orange);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Nunito',sans-serif; font-size: 22px; font-weight: 900;
    color: var(--orange); margin: 0 auto 20px;
  }
  .step-card h3 { font-family:'Nunito',sans-serif; font-size:17px; font-weight:800; color:var(--text-dark); margin-bottom:10px; }
  .step-card p  { font-size:13px; color:var(--text-muted); line-height:1.7; }
  .steps-connector { display:flex; align-items:center; justify-content:center; gap:32px; }
  .connector-line { flex:1; height:2px; background:linear-gradient(to right,var(--orange),#FFECD8); border-radius:2px; max-width:80px; }

  /* CTA SECTION */
  .cta-section {
    background: linear-gradient(135deg, #1A1A2E 0%, #2D2D50 100%);
    padding: 100px 44px;
    text-align: center;
  }
  .cta-section h2 {
    font-family: 'Nunito', sans-serif;
    font-size: clamp(28px, 3.5vw, 48px);
    font-weight: 900; color: #fff;
    margin-bottom: 20px; letter-spacing: -1px;
  }
  .cta-section p { font-size:16px; color:rgba(255,255,255,.6); margin-bottom:40px; max-width:500px; margin-left:auto; margin-right:auto; line-height:1.7; }
  .cta-btns { display:flex; justify-content:center; gap:16px; flex-wrap:wrap; }
  .btn-cta-primary {
    background: var(--orange); color:#fff; border:none;
    border-radius:12px; padding:16px 36px;
    font-size:16px; font-weight:700; font-family:'Nunito',sans-serif;
    cursor:pointer; box-shadow:0 8px 24px rgba(247,123,58,.4);
    transition:transform .18s, box-shadow .18s;
    text-decoration:none; display:inline-block;
  }
  .btn-cta-primary:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(247,123,58,.5); color:#fff; }
  .btn-cta-outline {
    background:transparent; color:#fff;
    border:2px solid rgba(255,255,255,.25); border-radius:12px;
    padding:16px 36px; font-size:16px; font-weight:700; font-family:'Nunito',sans-serif;
    cursor:pointer; transition:all .18s; text-decoration:none; display:inline-block;
  }
  .btn-cta-outline:hover { border-color:#fff; color:#fff; background:rgba(255,255,255,.08); }

  /* FOOTER */
  .e-footer {
    background: #fff;
    padding: 48px 44px;
    border-top: 1px solid #EBEBF5;
    display: flex; flex-direction: column; align-items: center; gap: 24px;
  }
  .footer-top {
    display: flex; justify-content: space-between; align-items: center;
    width: 100%; max-width: 1100px; flex-wrap: wrap; gap: 24px;
  }
  .footer-logo { display:flex; align-items:center; gap:10px; text-decoration:none; }
  .footer-logo .f-icon {
    width: 32px; height: 32px; background: var(--orange); border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-family:'Nunito',sans-serif; font-weight:900; font-size:14px; color:#fff;
  }
  .footer-logo span { font-family:'Nunito',sans-serif; font-weight:800; font-size:15px; color:var(--text-dark); }
  .footer-links { display:flex; gap:28px; }
  .footer-links a { font-size:13px; font-weight:600; color:var(--text-muted); text-decoration:none; transition:color .2s; }
  .footer-links a:hover { color: var(--orange); }
  .footer-bottom {
    border-top: 1px solid #EBEBF5;
    width: 100%; max-width: 1100px;
    padding-top: 20px;
    text-align: center;
    font-size: 12px; color: var(--text-light);
  }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .e-nav { padding: 16px 20px; }
    .e-nav-links { display: none; }
    .e-hero { padding: 48px 20px 0; }
    .hero-btns { flex-direction: column; align-items: center; }
    .dashboard-outer { margin: 0 12px; }
    .preview-area { padding: 0 8px; }
    .floating-cards { display: none; }
    .features-section, .how-section, .stats-section, .cta-section { padding: 60px 20px; }
    .stats-grid { gap: 40px; }
    .e-footer { padding: 32px 20px; }
    .footer-top { flex-direction: column; align-items: flex-start; }
  }
`;

const dots = Array.from({ length: 48 });
const dotsSmall = Array.from({ length: 30 });

function Landing() {
  return (
    <>
      <style>{styles}</style>
      <div className="landing-wrap">

        {/* ── NAV ── */}
        <nav className="e-nav">
          <a className="e-logo" href="#">
            <div className="e-logo-icon">T</div>
            <span className="e-logo-text">TaskMaster</span>
          </a>
          <ul className="e-nav-links">
            <li><a href="#features">Products</a></li>
            <li><a href="#how">How It Works</a></li>
            <li><a href="#">Company</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
          <div className="e-nav-actions">
            <Link to="/login" className="btn-signin-e">Sign In</Link>
            <Link to="/register" className="btn-signup-e">Sign Up Free</Link>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="e-hero">
          <h1>Manage Your Task<br />Like a Master.</h1>
          <p>
            TaskMaster boards, lists, and cards enable you to organize and prioritize
            your projects in a fun, flexible, and rewarding way. Let's get started. 😎
          </p>
          <div className="hero-btns">
            <Link to="/register" className="btn-get-started">Get Started</Link>
            <button className="btn-discover">
              <PlayCircle size={16} color="#4CAF50" />
              View Demo
            </button>
          </div>
        </section>

        {/* ── PREVIEW AREA ── */}
        <div className="preview-area">
          {/* Dot grids */}
          <div className="dot-grid right">{dots.map((_, i) => <span key={i} />)}</div>
          <div className="dot-grid left">{dotsSmall.map((_, i) => <span key={i} />)}</div>

          {/* Deco shapes */}
          <div className="deco-circle" />
          <div className="deco-dot-green" />
          <div className="deco-dot-green2" />

          {/* Floating cards */}
          <div className="floating-cards">
            <div className="card-lp">
              <div className="icon-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A8DEE" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="3"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
              </div>
              <h4>Landing Page</h4>
              <p>10 tasks</p>
            </div>

            <div className="card-ws">
              <h4>Workspace</h4>
              <div className="ws-selector">
                <span>TaskMaster.io</span>
                <ChevronDown size={12} color="#8A8A9A" />
              </div>
              <div className="user-row">
                <div className="user-avatar">TM</div>
                <div className="user-info">
                  <div className="name">Task Manager</div>
                  <div className="email">admin@taskmaster.io</div>
                </div>
              </div>
            </div>

            <div className="card-inv">
              <div className="env-icon">
                <Mail size={22} />
              </div>
              <h4>Invitation</h4>
              <p>You have<br /><span className="invite-count">6 invitations</span></p>
            </div>
          </div>

          {/* ── DASHBOARD PREVIEW ── */}
          <div className="dashboard-outer">
            {/* Sidebar */}
            <div className="e-sidebar">
              <div className="sidebar-logo">
                <div className="s-icon">T</div>
                <span>TaskMaster</span>
              </div>
              <div className="sidebar-create">
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-dark)' }}>Create<br />New Task</span>
                <div className="create-btn"><Plus size={14} /></div>
              </div>
              <div className="s-nav-item active">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
                Dashboard
              </div>
              <div className="s-nav-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                Analytics
              </div>
              <div className="s-nav-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/></svg>
                Task List
              </div>
            </div>

            {/* Main Panel */}
            <div className="main-panel">
              <div className="panel-header">
                <div>
                  <h2>Dashboard</h2>
                  <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 2 }}>Monday, 24 April 2026</div>
                </div>
                <div className="date-badge">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Apr – May 2026
                  <ChevronDown size={10} />
                </div>
              </div>

              <div className="panel-body">
                <div className="panel-left">
                  {/* Welcome banner */}
                  <div className="welcome-banner">
                    <div className="banner-circle" />
                    <h3>Hi, Welcome Back 👋</h3>
                    <p>
                      You have <strong style={{ color: 'var(--text-dark)' }}>4 tasks</strong> to finish today. Already completed{' '}
                      <span style={{ color: 'var(--orange)', fontWeight: 700 }}>50%</span>. Your progress is{' '}
                      <span style={{ color: 'var(--green-dark)', fontWeight: 700 }}>very good!</span>
                    </p>
                    <div className="banner-fig">
                      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="40" cy="18" r="13" fill="#F0A070"/>
                        <rect x="22" y="34" width="36" height="28" rx="10" fill="#5A6EEA"/>
                        <rect x="14" y="36" width="12" height="24" rx="6" fill="#5A6EEA"/>
                        <rect x="54" y="36" width="12" height="24" rx="6" fill="#5A6EEA"/>
                        <rect x="26" y="62" width="11" height="14" rx="5" fill="#3A4ED0"/>
                        <rect x="43" y="62" width="11" height="14" rx="5" fill="#3A4ED0"/>
                        <rect x="30" y="46" width="20" height="4" rx="2" fill="#fff" opacity=".4"/>
                      </svg>
                    </div>
                  </div>

                  {/* Activity row */}
                  <div style={{ display: 'flex', gap: 12, flex: 1 }}>
                    <div className="activity-card">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <h4 style={{ margin: 0 }}>Activity</h4>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>4 Tasks</span>
                      </div>
                      <div style={{ height: 60 }}>
                        <svg viewBox="0 0 220 55" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#4CAF50" stopOpacity=".25"/>
                              <stop offset="100%" stopColor="#4CAF50" stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                          <path d="M0 44 C20 44 28 20 44 22 C60 24 70 38 90 30 C110 22 120 10 140 14 C160 18 170 34 190 28 C204 24 215 32 220 28" fill="none" stroke="#4CAF50" strokeWidth="2.5"/>
                          <path d="M0 44 C20 44 28 20 44 22 C60 24 70 38 90 30 C110 22 120 10 140 14 C160 18 170 34 190 28 C204 24 215 32 220 28 L220 55 L0 55Z" fill="url(#grad)"/>
                          <text x="0"   y="54" fontSize="7" fill="#aaa">Mon</text>
                          <text x="28"  y="54" fontSize="7" fill="#aaa">Tue</text>
                          <text x="56"  y="54" fontSize="7" fill="#aaa">Wed</text>
                          <text x="84"  y="54" fontSize="7" fill="#aaa">Thu</text>
                          <text x="112" y="54" fontSize="7" fill="#4CAF50" fontWeight="bold">Fri</text>
                          <text x="140" y="54" fontSize="7" fill="#aaa">Sat</text>
                          <text x="168" y="54" fontSize="7" fill="#aaa">Sun</text>
                        </svg>
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6 }}>
                        Tracking &nbsp;<b style={{ color: 'var(--text-dark)' }}>20 hours, 30 min this week.</b>
                      </div>
                    </div>

                    {/* Progress + mini stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 120, flexShrink: 0 }}>
                      <div className="progress-card">
                        <div className="progress-label">Progress</div>
                        <div style={{ position: 'relative', width: 70, height: 70 }}>
                          <svg width="70" height="70" viewBox="0 0 70 70" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="5"/>
                            <circle cx="35" cy="35" r="28" fill="none" stroke="#fff" strokeWidth="5"
                              strokeDasharray="175.9" strokeDashoffset="70" strokeLinecap="round"/>
                          </svg>
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="pct-label">60%</span>
                          </div>
                        </div>
                        <div className="progress-label">30% Last week</div>
                      </div>
                      <div className="mini-stat">
                        <div><div className="val">20+</div><div className="lbl">Projects</div></div>
                        <div className="mini-bar">
                          <span style={{ height: 12 }} className="hi" /><span style={{ height: 20 }} className="hi" />
                          <span style={{ height: 16 }} /><span style={{ height: 8 }} />
                        </div>
                      </div>
                      <div className="mini-stat">
                        <div><div className="val">50+</div><div className="lbl">Clients</div></div>
                        <div className="mini-bar">
                          <span style={{ height: 14 }} /><span style={{ height: 20 }} className="hi" />
                          <span style={{ height: 10 }} className="hi" /><span style={{ height: 16 }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile panel */}
            <div className="profile-panel">
              <div className="profile-header">
                <div>
                  <h4>My Profile</h4>
                  <span>75% profile completed</span>
                </div>
              </div>
              <div className="profile-body">
                <div className="avatar-ring">
                  <div className="avatar-ph">TM</div>
                </div>
                <div className="profile-name">Task Manager</div>
                <div className="profile-role">Project Lead at TaskMaster</div>
                <div className="profile-stats">
                  <div className="ps"><div className="n">15</div><div className="l">Achiev.</div></div>
                  <div className="divider-v" />
                  <div className="ps"><div className="n">3</div><div className="l">Teams</div></div>
                </div>
              </div>
              <div className="ongoing-section">
                <div className="ongoing-header">
                  <h4>Ongoing Tasks</h4>
                  <a href="#">View All</a>
                </div>
                {[
                  { initials: 'JR', bg: 'linear-gradient(135deg,#f7c948,#f78848)', name: 'Call with Jonathan R.', date: 'Apr 25 · 9 AM – 11 AM' },
                  { initials: 'VE', bg: 'linear-gradient(135deg,#48b8f7,#4870f7)', name: 'Meet with Vlad E.', date: 'Apr 26 · 9 AM – 11 AM' },
                  { initials: 'CS', bg: 'linear-gradient(135deg,#a8d8a0,#4caf50)', name: 'Collab with Sam', date: 'Apr 26 · 1 PM – 5 PM' },
                ].map((t, i) => (
                  <div key={i} className="task-item">
                    <div className="task-avatar" style={{ background: t.bg }}>{t.initials}</div>
                    <div><div className="t-name">{t.name}</div><div className="t-date">{t.date}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FEATURES ── */}
        <section className="features-section" id="features">
          <h2>Engineered for Focus</h2>
          <div className="features-grid">
            {[
              { icon: <Rocket size={22} />, title: "Hyper Performance", desc: "Sub-100ms interactions and real-time updates for a seamlessly fast workflow.", color: "#F59E0B", bg: "#FFFBEB" },
              { icon: <ShieldCheck size={22} />, title: "Secure & Private", desc: "Military-grade encryption and automated backups keep your data safe 24/7.", color: "#3B82F6", bg: "#EFF6FF" },
              { icon: <Globe size={22} />, title: "Global Sync", desc: "Your tasks everywhere you are. Seamlessly sync between mobile and web.", color: "#10B981", bg: "#ECFDF5" },
              { icon: <Zap size={22} />, title: "Automation", desc: "Set recurring tasks and smart reminders so you never miss a deadline.", color: "#8B5CF6", bg: "#F5F3FF" },
              { icon: <Lock size={22} />, title: "Role Management", desc: "Granular permissions allow you to control who sees what in your team.", color: "#F77B3A", bg: "#FFF0E8" },
              { icon: <BarChart3 size={22} />, title: "Visual Insights", desc: "Beautiful charts and analytics to understand your productivity bottlenecks.", color: "#EC4899", bg: "#FDF2F8" },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon" style={{ background: f.bg, color: f.color }}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="stats-section">
          <h2>Trusted by teams worldwide</h2>
          <div className="stats-grid">
            {[
              { num: '50K+', lbl: 'Active Users' },
              { num: '2M+', lbl: 'Tasks Completed' },
              { num: '120+', lbl: 'Countries' },
              { num: '99.9%', lbl: 'Uptime' },
            ].map((s, i) => (
              <div key={i} className="stat-item">
                <div className="num">{s.num}</div>
                <div className="lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="how-section" id="how">
          <h2>Get started in 3 steps</h2>
          <div className="steps-grid">
            {[
              { n: '1', title: 'Create Your Workspace', desc: 'Sign up and set up your personal or team workspace in under a minute.' },
              { n: '2', title: 'Add Tasks & Projects', desc: 'Break your goals into boards, lists, and cards. Assign, label, and prioritize.' },
              { n: '3', title: 'Track & Deliver', desc: 'Monitor progress with visual dashboards and ship work on time, every time.' },
            ].map((s, i) => (
              <div key={i} className="step-card">
                <div className="step-number">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section">
          <h2>Ready to master your tasks?</h2>
          <p>Join thousands of teams who've transformed how they work. Free forever. No credit card required.</p>
          <div className="cta-btns">
            <Link to="/register" className="btn-cta-primary">Start for Free</Link>
            <Link to="/login" className="btn-cta-outline">Sign In</Link>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="e-footer">
          <div className="footer-top">
            <a className="footer-logo" href="#">
              <div className="f-icon">T</div>
              <span>TaskMaster AI</span>
            </a>
            <div className="footer-links">
              <a href="#">Products</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Company</a>
            </div>
          </div>
          <div className="footer-bottom">© 2026 TaskMaster AI. All rights reserved.</div>
        </footer>

      </div>
    </>
  );
}

export default Landing;
