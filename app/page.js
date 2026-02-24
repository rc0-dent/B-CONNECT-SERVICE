"use client";
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zkkywakndxwthfmmkvzo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_334nMLd_U79eN2zdbQsn4w_8Lb1Gaf8';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function App() {
const [step, setStep] = useState(1);
const [email, setEmail] = useState('');
const [otp, setOtp] = useState('');
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState('NODE: ADMIN_GATEWAY_OSAKA');

// 暗号化の復号テスト用
const decryptData = (encoded) => {
try { return atob(encoded); } catch { return "DECRYPT_ERROR"; }
};

// --- 手順1: OTP送信 ---
const handleSendOtp = async () => {
if (!email) {
setMessage('EMAIL REQUIRED');
return;
}
setLoading(true);
setMessage('SENDING REQUEST...');

try {
const { error } = await supabase.auth.signInWithOtp({ email });
if (error) {
setMessage('ERROR: ' + error.message);
} else {
setMessage('OTP SENT TO GMAIL');
setStep(2); // ここで画面が切り替わります
}
} catch (err) {
setMessage('SYSTEM ERROR: ' + err.message);
} finally {
setLoading(false);
}
};

// --- 手順2: コード検証 ---
const handleVerifyOtp = async () => {
if (!otp) return;
setLoading(true);
setMessage('VERIFYING...');

try {
const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
if (error) {
setMessage('INVALID CODE');
} else {
setStep(3);
}
} catch (err) {
setMessage('VERIFY ERROR: ' + err.message);
} finally {
setLoading(false);
}
};

// 管理画面（ログイン成功後）
if (step === 3) {
return (
<div style={styles.adminContainer}>
<div style={styles.adminHeader}>
<h2 style={{fontSize: '14px', margin: 0}}>GOD VIEW ACCESS</h2>
<div style={styles.onlineStatus}>● ONLINE</div>
</div>
<div style={styles.adminContent}>
<p style={styles.label}>ENCRYPTED INCOMING DATA</p>
<div style={styles.dataBox}>
<p style={styles.id}>ID: SNS_SESSION_01</p>
<p style={styles.code}>DATA: dXNlci1pZC0wMDEtcGFzcy05OTk=</p>
<button style={styles.decryptBtn} onClick={() => alert('復号結果: ' + decryptData('dXNlci1pZC0wMDEtcGFzcy05OTk='))}>
DECRYPT (可逆復号)
</button>
</div>
</div>
</div>
);
}

// ログイン画面
return (
<div style={styles.container}>
<div style={styles.card}>
<h1 style={styles.logo}>B CONNECT</h1>
<p style={{...styles.status, color: message.includes('ERROR') ? '#FF3B30' : '#00FF41'}}>{message}</p>

<div style={styles.inputGroup}>
<input
style={styles.mobileInput}
placeholder={step === 1 ? "ADMIN EMAIL" : "ENTER OTP CODE"}
type={step === 1 ? "email" : "text"}
inputMode={step === 1 ? "email" : "numeric"}
value={step === 1 ? email : otp}
onChange={(e) => step === 1 ? setEmail(e.target.value) : setOtp(e.target.value)}
/>

<button
onClick={step === 1 ? handleSendOtp : handleVerifyOtp}
disabled={loading}
style={{...styles.mobileButton, opacity: loading ? 0.6 : 1}}
>
{loading ? 'WAIT...' : (step === 1 ? 'GET ACCESS' : 'AUTHORIZE')}
</button>

{step === 2 && (
<p style={styles.back} onClick={() => { setStep(1); setMessage('NODE: ADMIN_GATEWAY_OSAKA'); }}>
← BACK TO EMAIL
</p>
)}
</div>
</div>
</div>
);
}

const styles = {
container: { height: '100dvh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', padding: '20px', boxSizing: 'border-box' },
card: { width: '100%', maxWidth: '350px', textAlign: 'center' },
logo: { color: '#fff', fontSize: '26px', letterSpacing: '6px', fontWeight: '900', marginBottom: '10px' },
status: { fontSize: '11px', marginBottom: '30px', minHeight: '15px', textTransform: 'uppercase' },
inputGroup: { width: '100%' },
mobileInput: { width: '100%', padding: '18px', backgroundColor: '#111', border: '1px solid #333', color: '#fff', borderRadius: '12px', fontSize: '16px', marginBottom: '15px', boxSizing: 'border-box', outline: 'none', textAlign: 'center' },
mobileButton: { width: '100%', padding: '18px', backgroundColor: '#fff', color: '#000', borderRadius: '12px', fontWeight: '900', border: 'none', fontSize: '16px', cursor: 'pointer', WebkitAppearance: 'none' },
back: { color: '#888', fontSize: '12px', marginTop: '25px', cursor: 'pointer', textDecoration: 'underline' },
adminContainer: { height: '100dvh', backgroundColor: '#F2F2F7', display: 'flex', flexDirection: 'column' },
adminHeader: { padding: '50px 20px 20px', backgroundColor: '#fff', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
onlineStatus: { color: '#34C759', fontSize: '10px', fontWeight: 'bold' },
adminContent: { padding: '20px' },
label: { fontSize: '11px', color: '#888', marginBottom: '10px' },
dataBox: { backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
id: { fontSize: '10px', color: '#ccc', margin: '0 0 5px 0' },
code: { fontSize: '12px', wordBreak: 'break-all', marginBottom: '15px', fontFamily: 'monospace' },
decryptBtn: { width: '100%', padding: '12px', backgroundColor: '#007AFF', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold' }
};
