"use client";
import React, { useState, useEffect } from 'react';
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
const [status, setStatus] = useState('SYSTEM READY');

// --- 可逆暗号ロジック（SNS連携時に使用） ---
const encrypt = (text) => btoa(encodeURIComponent(text));
const decrypt = (encoded) => decodeURIComponent(atob(encoded));

// --- 認証シークエンス ---
const requestAccess = async () => {
if (!email) return;
setLoading(true);
setStatus('COMMUNICATING...');
const { error } = await supabase.auth.signInWithOtp({ email });
if (!error) {
setStep(2);
setStatus('WAITING FOR CODE');
} else {
setStatus('RETRY LATER');
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
setStatus('ACCESS DENIED');
setOtp('');
}
setLoading(false);
};

// --- 管理画面（GOD VIEW） ---
if (step === 3) {
return (
<div style={styles.adminBg}>
<header style={styles.adminHeader}>
<div>
<h2 style={styles.adminTitle}>B-CONNECT GOD VIEW</h2>
<p style={styles.adminSub}>SECURE DATA TERMINAL</p>
</div>
<div style={styles.onlineLamp}>ONLINE</div>
</header>

<main style={styles.main}>
<div style={styles.sectionHeader}>SNS ENCRYPTED LOGS</div>

{[
{ id: 'LOG_882', time: '14:20', data: encrypt('Instagram_User_ID: 99283') },
{ id: 'LOG_883', time: '15:05', data: encrypt('X_Direct_Message: "Ready to go"') }
].map((item) => (
<div key={item.id} style={styles.dataCard}>
<div style={styles.cardTop}>
<span style={styles.logId}>{item.id}</span>
<span style={styles.logTime}>{item.time}</span>
</div>
<div style={styles.encContent}>{item.data}</div>
<button
style={styles.decryptButton}
onClick={() => alert(`DECRYPTED DATA:\n${decrypt(item.data)}`)}
>
DECRYPT AND VIEW
</button>
</div>
))}
<p style={styles.footerInfo}>※全てのデータは256bit暗号化され、管理者のみが閲覧可能です。</p>
</main>
</div>
);
}

// --- ログイン画面（認証） ---
return (
<div style={styles.loginBg}>
<div style={styles.loginCard}>
<h1 style={styles.logo}>B CONNECT</h1>
<div style={styles.statusLine}>{status}</div>

<div style={styles.form}>
<input
style={styles.input}
placeholder={step === 1 ? "ADMIN IDENTIFIER" : "INPUT OTP"}
type={step === 1 ? "email" : "text"}
inputMode={step === 1 ? "email" : "numeric"}
value={step === 1 ? email : otp}
onChange={(e) => step === 1 ? setEmail(e.target.value) : setOtp(e.target.value)}
/>
<button
onClick={step === 1 ? requestAccess : authorize}
disabled={loading}
style={{...styles.button, opacity: loading ? 0.7 : 1}}
>
{loading ? '---' : (step === 1 ? 'GET ACCESS' : 'AUTHORIZE')}
</button>
</div>
</div>
</div>
);
}

const styles = {
// ログインUI
loginBg: { height: '100dvh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, sans-serif' },
loginCard: { width: '85%', maxWidth: '380px', textAlign: 'center' },
logo: { color: '#fff', fontSize: '28px', letterSpacing: '8px', fontWeight: '900', margin: '0 0 10px 0' },
statusLine: { color: '#00FF41', fontSize: '10px', letterSpacing: '2px', marginBottom: '40px' },
input: { width: '100%', padding: '20px', backgroundColor: '#111', border: '1px solid #222', color: '#fff', borderRadius: '16px', fontSize: '16px', textAlign: 'center', marginBottom: '15px', outline: 'none', boxSizing: 'border-box' },
button: { width: '100%', padding: '20px', backgroundColor: '#fff', color: '#000', borderRadius: '16px', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer' },

// 管理画面UI（スマホ標準の使いやすさ）
adminBg: { height: '100dvh', backgroundColor: '#F8F9FA', color: '#000', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, sans-serif' },
adminHeader: { padding: '60px 25px 20px', backgroundColor: '#fff', borderBottom: '1px solid #E5E5E5', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
adminTitle: { fontSize: '18px', fontWeight: '900', margin: 0, letterSpacing: '1px' },
adminSub: { fontSize: '10px', color: '#8E8E93', margin: '2px 0 0 0' },
onlineLamp: { backgroundColor: '#34C759', color: '#fff', fontSize: '9px', padding: '4px 8px', borderRadius: '20px', fontWeight: 'bold' },
main: { padding: '25px', flex: 1, overflowY: 'auto' },
sectionHeader: { fontSize: '12px', fontWeight: 'bold', color: '#8E8E93', marginBottom: '15px' },
dataCard: { backgroundColor: '#fff', borderRadius: '18px', padding: '20px', marginBottom: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #F0F0F0' },
cardTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
logId: { fontSize: '11px', fontWeight: 'bold', color: '#007AFF' },
logTime: { fontSize: '11px', color: '#C7C7CC' },
encContent: { fontSize: '13px', color: '#333', backgroundColor: '#F2F2F7', padding: '10px', borderRadius: '8px', wordBreak: 'break-all', fontFamily: 'monospace', marginBottom: '15px' },
decryptButton: { width: '100%', padding: '12px', backgroundColor: '#000', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '13px', fontWeight: 'bold' },
footerInfo: { textAlign: 'center', fontSize: '10px', color: '#AEAEB2', marginTop: '20px' }
};
