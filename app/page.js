"use client";
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- システム設定 ---
const SUPABASE_URL = 'https://zkkywakndxwthfmmkvzo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_334nMLd_U79eN2zdbQsn4w_8Lb1Gaf8';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function BConnectFinal() {
const [step, setStep] = useState(1);
const [email, setEmail] = useState('');
const [otp, setOtp] = useState('');
const [loading, setLoading] = useState(false);
const [status, setStatus] = useState('OSU STUDENT ONLY'); // 大産大生専用

// --- 可逆暗号ロジック（SNS連携用） ---
const encrypt = (text) => btoa(encodeURIComponent(text));
const decrypt = (encoded) => {
try { return decodeURIComponent(atob(encoded)); }
catch { return "DECRYPT_ERROR"; }
};

// --- 認証フロー ---
const requestAccess = async () => {
// 【修正箇所】特定のドメイン以外をここで弾く
if (!email.endsWith('@ge.osaka-sandai.ac.jp')) {
setStatus('ERROR: UNMATCHED DOMAIN');
return;
}

setLoading(true);
setStatus('VERIFYING OSU ID...');

const { error } = await supabase.auth.signInWithOtp({ email });
if (!error) {
setStep(2);
setStatus('ENTER 6-DIGIT CODE');
} else {
setStatus('SYSTEM BUSY: RETRY LATER');
}
setLoading(false);
};

const authorize = async () => {
if (!otp) return;
setLoading(true);
setStatus('AUTHORIZING...');
const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
if (!error) {
setStep(3);
} else {
setStatus('INVALID CODE');
}
setLoading(false);
};

// --- 管理画面（GOD VIEW / スマホ最適化） ---
if (step === 3) {
return (
<div style={styles.adminBg}>
<header style={styles.adminHeader}>
<div>
<h2 style={styles.adminTitle}>OSU B-CONNECT ADMIN</h2>
<p style={styles.adminSub}>{email}</p>
</div>
<div style={styles.onlineLamp}>● ONLINE</div>
</header>

<main style={styles.main}>
<div style={styles.sectionLabel}>ENCRYPTED LOGS (OSAKA SANDAI)</div>

{[
{ id: 'OSU_LOG_001', source: 'Facebook/Auth', data: encrypt('Campus_User: Verified / Dept: Engineering') },
{ id: 'OSU_LOG_002', source: 'Internal', data: encrypt('Access_Node: Osaka_Daito / Status: Safe') }
].map((item) => (
<div key={item.id} style={styles.card}>
<div style={styles.cardTop}>
<span style={styles.sourceTag}>{item.source}</span>
<span style={styles.logId}>{item.id}</span>
</div>
<div style={styles.encBox}>{item.data}</div>
<button
style={styles.actionBtn}
onClick={() => alert(`復号成功:\n${decrypt(item.data)}`)}
>
DECRYPT AND VIEW
</button>
</div>
))}
<button onClick={() => window.location.reload()} style={styles.logoutBtn}>LOGOUT SYSTEM</button>
</main>
</div>
);
}

// --- ログイン画面（スマホ特化） ---
return (
<div style={styles.loginBg}>
<div style={styles.loginContent}>
<h1 style={styles.logo}>B CONNECT</h1>
<div style={{...styles.statusLine, color: status.includes('ERROR') ? '#FF3B30' : '#00FF41'}}>{status}</div>

<input
style={styles.input}
placeholder={step === 1 ? "student_id@ge.osaka-sandai.ac.jp" : "6-DIGIT CODE"}
type={step === 1 ? "email" : "number"}
inputMode={step === 1 ? "email" : "numeric"}
value={step === 1 ? email : otp}
onChange={(e) => step === 1 ? setEmail(e.target.value) : setOtp(e.target.value)}
/>

<button
onClick={step === 1 ? requestAccess : authorize}
disabled={loading}
style={{...styles.mobileButton, opacity: loading ? 0.6 : 1}}
>
{loading ? '---' : (step === 1 ? 'CONNECT TO OSU' : 'AUTHORIZE')}
</button>
</div>
</div>
);
}

const styles = {
loginBg: { height: '100dvh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, sans-serif' },
loginContent: { width: '85%', maxWidth: '360px', textAlign: 'center' },
logo: { color: '#fff', fontSize: '32px', letterSpacing: '8px', fontWeight: '900', marginBottom: '8px' },
statusLine: { fontSize: '10px', letterSpacing: '1px', marginBottom: '40px', textTransform: 'uppercase' },
input: { width: '100%', padding: '20px', backgroundColor: '#111', border: '1px solid #333', color: '#fff', borderRadius: '15px', fontSize: '15px', marginBottom: '15px', outline: 'none', boxSizing: 'border-box', textAlign: 'center' },
mobileButton: { width: '100%', padding: '20px', backgroundColor: '#fff', color: '#000', borderRadius: '15px', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer', WebkitAppearance: 'none' },

adminBg: { height: '100dvh', backgroundColor: '#F2F2F7', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, sans-serif' },
adminHeader: { padding: '50px 25px 20px', backgroundColor: '#fff', borderBottom: '1px solid #DDD', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
adminTitle: { fontSize: '18px', fontWeight: '900', margin: 0 },
adminSub: { fontSize: '11px', color: '#8E8E93', margin: 0 },
onlineLamp: { color: '#34C759', fontSize: '10px', fontWeight: 'bold' },
main: { padding: '20px', flex: 1, overflowY: 'auto' },
sectionLabel: { fontSize: '11px', color: '#8E8E93', marginBottom: '15px', fontWeight: 'bold' },
card: { backgroundColor: '#fff', borderRadius: '20px', padding: '20px', marginBottom: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
cardTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
sourceTag: { fontSize: '10px', backgroundColor: '#E9E9EB', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' },
logId: { fontSize: '10px', color: '#AEAEB2' },
encBox: { fontSize: '12px', backgroundColor: '#F8F8F8', padding: '12px', borderRadius: '10px', wordBreak: 'break-all', fontFamily: 'monospace', marginBottom: '15px' },
actionBtn: { width: '100%', padding: '14px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold' },
logoutBtn: { width: '100%', marginTop: '20px', backgroundColor: 'transparent', color: '#FF3B30', border: 'none', fontSize: '12px' }
};
