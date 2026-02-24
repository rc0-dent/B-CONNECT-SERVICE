"use client";
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zkkywakndxwthfmmkvzo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_334nMLd_U79eN2zdbQsn4w_8Lb1Gaf8';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function AdminBypassConsole() {
const [step, setStep] = useState(1);
const [email, setEmail] = useState('');
const [otp, setOtp] = useState('');
const [loading, setLoading] = useState(false);
const [status, setStatus] = useState('ADMIN SYSTEM LOCK');

const ADMIN_EMAIL = 'rei03021225@gmail.com';
const MASTER_CODE = '1225'; // メールを送らずに入れる合言葉

const encrypt = (text) => btoa(encodeURIComponent(text));

// --- 管理者ログイン：バイパス承認 ---
const requestAccess = async () => {
const inputEmail = email.trim().toLowerCase();
if (inputEmail !== ADMIN_EMAIL) {
setStatus('ERROR: UNAUTHORIZED ACCESS');
return;
}
setLoading(true);
// メール送信をスキップしてパスワード入力へ
setTimeout(() => {
setStep(2);
setStatus('ENTER MASTER KEY');
setLoading(false);
}, 500);
};

// --- 管理者ログイン：認証チェック ---
const authorize = async () => {
if (otp === MASTER_CODE) {
setStep(3); // ログイン成功（司令部へ）
} else {
setStatus('INVALID CODE');
}
};

// --- 3. 管理者専用：ハッシュデータ監視パネル ---
if (step === 3) {
return (
<div style={styles.adminBg}>
<header style={styles.adminHeader}>
<h2 style={styles.adminTitle}>B-CONNECT COMMAND CENTER</h2>
<div style={styles.onlineLamp}>● BYPASS MODE ACTIVE</div>
</header>
<main style={styles.main}>
<div style={styles.sectionLabel}>ENCRYPTED USER LOGS</div>
{/* ここには今後signupから登録された本物のデータが届くようにします */}
{[
{ id: 'OSU_001', real: '大阪 太郎', nick: 'Taro', mail: 't12345@ge.osaka-sandai.ac.jp' },
{ id: 'OSU_002', real: '産業 次郎', nick: 'SangyoJ', mail: 's67890@ge.osaka-sandai.ac.jp' }
].map((user) => (
<div key={user.id} style={styles.card}>
<div style={styles.cardTop}><span style={styles.sourceTag}>OSU STUDENT</span><span style={styles.logId}>{user.id}</span></div>
<p style={styles.label}>ENCRYPTED DATA:</p>
<div style={styles.encBox}>{encrypt(user.mail)}</div>
<button style={styles.actionBtn} onClick={() => alert(`【復号成功】\n実名: ${user.real}\n表示名: ${user.nick}\nメアド: ${user.mail}`)}>DECRYPT</button>
</div>
))}
<button onClick={() => window.location.reload()} style={styles.logoutBtn}>TERMINATE SESSION</button>
</main>
</div>
);
}

// --- 1 & 2. 管理者ログイン画面（不純物なし） ---
return (
<div style={styles.loginBg}>
<div style={styles.loginContent}>
<h1 style={styles.logo}>B CONNECT</h1>
<p style={{...styles.statusLine, color: status.includes('ERROR') ? '#FF3B30' : '#00FF41'}}>{status}</p>
{step === 1 ? (
<input style={styles.input} placeholder="ADMIN EMAIL" type="email" value={email} onChange={e => setEmail(e.target.value)} />
) : (
<input style={styles.input} placeholder="MASTER CODE" type="number" value={otp} onChange={e => setOtp(e.target.value)} />
)}
<button onClick={step === 1 ? requestAccess : authorize} style={styles.button}>
{loading ? '...' : (step === 1 ? 'LOGIN' : 'AUTHORIZE')}
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
adminHeader: { padding: '50px 25px 20px', backgroundColor: '#fff', borderBottom: '1px solid #DDD', display: 'flex', justifyContent: 'space-between' },
adminTitle: { fontSize: '16px', fontWeight: '900', margin: 0 },
onlineLamp: { color: '#FF9500', fontSize: '10px', fontWeight: 'bold' },
main: { padding: '20px', flex: 1, overflowY: 'auto' },
sectionLabel: { fontSize: '11px', color: '#8E8E93', marginBottom: '15px', fontWeight: 'bold' },
card: { backgroundColor: '#fff', borderRadius: '20px', padding: '20px', marginBottom: '15px' },
cardTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
sourceTag: { fontSize: '10px', color: '#007AFF', backgroundColor: '#E1EFFF', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' },
logId: { fontSize: '10px', color: '#AEAEB2' },
label: { fontSize: '10px', color: '#8E8E93', marginBottom: '5px' },
encBox: { fontSize: '12px', backgroundColor: '#F8F8F8', padding: '12px', borderRadius: '10px', wordBreak: 'break-all', fontFamily: 'monospace', marginBottom: '15px' },
actionBtn: { width: '100%', padding: '14px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold' },
logoutBtn: { width: '100%', color: '#FF3B30', border: 'none', fontSize: '12px', background: 'none', padding: '20px' }
};
