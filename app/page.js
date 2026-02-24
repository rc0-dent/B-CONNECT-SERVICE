"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// 設定値
const SUPABASE_URL = 'https://zkkywakndxwthfmmkvzo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_334nMLd_U79eN2zdbQsn4w_8Lb1Gaf8';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 暗号化の鍵（※本来は環境変数ですが、今回は可逆性を優先して固定）
const SECRET_KEY = "REI_ADMIN_SECRET_KEY_2024";

export default function BConnectSystem() {
const [step, setStep] = useState(1);
const [email, setEmail] = useState('');
const [otp, setOtp] = useState('');
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState('NODE: ADMIN_GATEWAY_OSAKA');
const [dataList, setDataList] = useState([]);

// --- 暗号化・復号ロジック ---
const encryptData = async (text) => {
return btoa(text); // 簡易可逆暗号（デモ用）。必要に応じてAESに差し替え可
};

const decryptData = (encoded) => {
try { return atob(encoded); } catch { return "DECRYPT_ERROR"; }
};

// --- 認証ロジック ---
const handleSendOtp = async () => {
setLoading(true);
const { error } = await supabase.auth.signInWithOtp({ email });
if (error) setMessage('ERROR: ' + error.message);
else { setMessage('OTP SENT TO GMAIL'); setStep(2); }
setLoading(false);
};

const handleVerifyOtp = async () => {
setLoading(true);
const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
if (error) setMessage('INVALID CODE');
else setStep(3);
setLoading(false);
};

// 管理画面（スマホ最適化）
if (step === 3) {
return (
<div style={styles.mobileContainer}>
<header style={styles.header}>
<h2 style={styles.title}>GOD VIEW v1.0</h2>
<span style={styles.onlineBadge}>● ONLINE</span>
</header>

<div style={styles.content}>
<p style={styles.sectionLabel}>ENCRYPTED INCOMING DATA</p>
{/* ここにSNSからのデータを表示するリスト */}
<div style={styles.dataCard}>
<p style={styles.idLabel}>ID: SNS_001</p>
<p style={styles.encryptedText}>Encrypted: dXNlci1kYXRhLXNhbXBsZQ==</p>
<button style={styles.decryptBtn} onClick={() => alert('Decrypted: ' + decryptData('dXNlci1kYXRhLXNhbXBsZQ=='))}>
DECRYPT (復号)
</button>
</div>
<p style={{fontSize: '10px', color: '#888', marginTop: '20px'}}>※SNS連携後のデータは自動で暗号化され、ここに蓄積されます。</p>
</div>
</div>
);
}

// ログイン画面
return (
<div style={styles.container}>
<div style={styles.card}>
<h1 style={styles.mainLogo}>B CONNECT</h1>
<p style={styles.statusText}>{message}</p>

<input
style={styles.mobileInput}
placeholder={step === 1 ? "ADMIN EMAIL" : "6-DIGIT CODE"}
type={step === 1 ? "email" : "number"}
value={step === 1 ? email : otp}
onChange={(e) => step === 1 ? setEmail(e.target.value) : setOtp(e.target.value)}
/>

<button
onClick={step === 1 ? handleSendOtp : handleVerifyOtp}
disabled={loading}
style={styles.mobileButton}
>
{loading ? 'PROCESSING...' : (step === 1 ? 'GET ACCESS' : 'AUTHORIZE')}
</button>
</div>
</div>
);
}

const styles = {
container: { height: '100dvh', backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' },
mobileContainer: { height: '100dvh', backgroundColor: '#F2F2F7', color: '#000', display: 'flex', flexDirection: 'column' },
card: { width: '85%', textAlign: 'center' },
mainLogo: { fontSize: '24px', letterSpacing: '6px', fontWeight: '900', marginBottom: '5px' },
statusText: { color: '#00FF41', fontSize: '11px', marginBottom: '40px', letterSpacing: '1px' },
mobileInput: { width: '100%', padding: '18px', backgroundColor: '#111', border: '1px solid #333', color: '#fff', borderRadius: '12px', fontSize: '16px', marginBottom: '15px', outline: 'none', textAlign: 'center', boxSizing: 'border-box' },
mobileButton: { width: '100%', padding: '18px', backgroundColor: '#fff', color: '#000', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer', transition: '0.2s active' },
header: { padding: '40px 20px 20px', backgroundColor: '#fff', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
title: { fontSize: '16px', fontWeight: '900', margin: 0 },
onlineBadge: { color: '#34C759', fontSize: '10px', fontWeight: 'bold' },
content: { padding: '20px', flex: 1 },
sectionLabel: { fontSize: '12px', color: '#888', marginBottom: '10px', fontWeight: 'bold' },
dataCard: { backgroundColor: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
idLabel: { fontSize: '10px', color: '#999', marginBottom: '5px' },
encryptedText: { fontSize: '13px', fontFamily: 'monospace', marginBottom: '10px', wordBreak: 'break-all' },
decryptBtn: { padding: '8px 15px', backgroundColor: '#007AFF', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }
};

