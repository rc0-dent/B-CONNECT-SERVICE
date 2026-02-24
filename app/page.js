"use client";
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- システム設定 ---
const SUPABASE_URL = 'https://zkkywakndxwthfmmkvzo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_334nMLd_U79eN2zdbQsn4w_8Lb1Gaf8';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function BConnectAdminSystem() {
const [step, setStep] = useState(1);
const [email, setEmail] = useState('');
const [otp, setOtp] = useState('');
const [loading, setLoading] = useState(false);
const [status, setStatus] = useState('ADMIN GATEWAY');

// 管理者のメアド（ここを絶対一致させる）
const ADMIN_EMAIL = 'rei03021225@gmail.com';

// --- 可逆暗号ロジック ---
const encrypt = (text) => btoa(encodeURIComponent(text));
const decrypt = (encoded) => {
try { return decodeURIComponent(atob(encoded)); }
catch { return "DECRYPT_ERROR"; }
};

// --- 管理者ログイン実行 ---
const requestAccess = async () => {
// スペースの混入や大文字小文字を無視してチェック
const inputEmail = email.trim().toLowerCase();

if (inputEmail !== ADMIN_EMAIL) {
setStatus('ERROR: NOT ADMIN');
return;
}

setLoading(true);
setStatus('COMMUNICATING...');

// SupabaseにOTPを要求
const { error } = await supabase.auth.signInWithOtp({ email: ADMIN_EMAIL });

if (!error) {
setStep(2);
setStatus('OTP SENT TO GMAIL');
} else {
setStatus('ERROR: ' + error.message);
}
setLoading(false);
};

const authorize = async () => {
if (!otp) return;
setLoading(true);
setStatus('CHECKING CODE...');

const { error } = await supabase.auth.verifyOtp({
email: ADMIN_EMAIL,
token: otp,
type: 'email'
});

if (!error) {
setStep(3); // 暗号化管理画面へ
} else {
setStatus('INVALID CODE');
}
setLoading(false);
};

// --- ログイン後：暗号化・復号管理パネル ---
if (step === 3) {
return (
<div style={styles.adminBg}>
<header style={styles.adminHeader}>
<div>
<h2 style={styles.adminTitle}>ENCRYPTION TERMINAL</h2>
<p style={styles.adminSub}>ADMIN: {ADMIN_EMAIL}</p>
</div>
<div style={styles.onlineLamp}>● SECURE MODE</div>
</header>

<main style={styles.main}>
<div style={styles.sectionLabel}>SNS DATA LOGS (HASHED)</div>

{[
{ id: 'LOG_881', original: 'user123@ge.osaka-sandai.ac.jp', content: 'FB_SYNC_SUCCESS' },
{ id: 'LOG_882', original: 'test999@ge.osaka-sandai.ac.jp', content: 'INSTA_AUTH_OK' }
].map((item) => (
<div key={item.id} style={styles.card}>
<div style={styles.cardTop}>
<span style={styles.sourceTag}>OSU_DOMAIN</span>
<span style={styles.logId}>{item.id}</span>
</div>
<p style={styles.label}>ENCRYPTED HASH:</p>
<div style={styles.encBox}>{encrypt(item.original)}</div>
<button
style={styles.actionBtn}
onClick={() => alert(`【復号成功】\nEmail: ${item.original}\nStatus: ${item.content}`)}
>
DECRYPT AND VIEW
</button>
</div>
))}

<div style={styles.footerInfo}>
※SNS連携時に大産大メアドを自動ハッシュ化します。<br/>
現在はテスト用データを表示中。
</div>
<button onClick={() => window.location.reload()} style={styles.logoutBtn}>LOGOUT</button>
</main>
</div>
);
}

// --- ログイン画面 ---
return (
<div style={styles.loginBg}>
<div style={styles.loginContent}>
<h1 style={styles.logo}>B CONNECT</h1>
<div style={{...styles.statusLine, color: status.includes('ERROR') ? '#FF3B30' : '#00FF41'}}>{status}</div>

<input
style={styles.input}
placeholder="ENTER ADMIN EMAIL"
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
onFocus={() => setStatus('READY')}
/>

{step === 2 && (
<input
style={styles.input}
placeholder="ENTER 6-DIGIT CODE"
type="number"
inputMode="numeric"
value={otp}
onChange={(e) => setOtp(e.target.value)}
/>
)}

<button
onClick={step === 1 ? requestAccess : authorize}
disabled={loading}
style={{...styles.button, opacity: loading ? 0.6 : 1}}
>
{loading ? '...' : (step === 1 ? 'GET ADMIN ACCESS' : 'LOGIN')}
</button>
</div>
</div>
);
}

const styles = {
loginBg: { height: '100dvh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, sans-serif' },
loginContent: { width: '85%', maxWidth: '360px', textAlign: 'center' },
logo: { color: '#fff', fontSize: '30px', letterSpacing: '8px', fontWeight: '900', marginBottom: '8px' },
statusLine: { fontSize: '10px', letterSpacing: '1px', marginBottom: '40px', textTransform: 'uppercase' },
input: { width: '100%', padding: '20px', backgroundColor: '#111', border: '1px solid #333', color: '#fff', borderRadius: '15px', fontSize: '16px', marginBottom: '15px', outline: 'none', boxSizing: 'border-box', textAlign: 'center' },
button: { width: '100%', padding: '20px', backgroundColor: '#fff', color: '#000', borderRadius: '15px', fontWeight: 'bold', fontSize: '16px', border: 'none' },
adminBg: { height: '100dvh', backgroundColor: '#F2F2F7', display: 'flex', flexDirection: 'column' },
adminHeader: { padding: '50px 25px 20px', backgroundColor: '#fff', borderBottom: '1px solid #DDD', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
adminTitle: { fontSize: '18px', fontWeight: '900', margin: 0 },
adminSub: { fontSize: '10px', color: '#8E8E93', margin: 0 },
onlineLamp: { color: '#007AFF', fontSize: '10px', fontWeight: 'bold' },
main: { padding: '20px', flex: 1, overflowY: 'auto' },
sectionLabel: { fontSize: '11px', color: '#8E8E93', marginBottom: '15px', fontWeight: 'bold' },
card: { backgroundColor: '#fff', borderRadius: '20px', padding: '20px', marginBottom: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
cardTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
sourceTag: { fontSize: '10px', color: '#007AFF', backgroundColor: '#E1EFFF', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' },
logId: { fontSize: '10px', color: '#AEAEB2' },
label: { fontSize: '10px', color: '#8E8E93', marginBottom: '5px' },
encBox: { fontSize: '12px', backgroundColor: '#F8F8F8', padding: '12px', borderRadius: '10px', wordBreak: 'break-all', fontFamily: 'monospace', marginBottom: '15px' },
actionBtn: { width: '100%', padding: '14px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold' },
footerInfo: { textAlign: 'center', fontSize: '10px', color: '#AEAEB2', padding: '20px 0' },
logoutBtn: { width: '100%', color: '#FF3B30', border: 'none', fontSize: '12px', background: 'none' }
};
