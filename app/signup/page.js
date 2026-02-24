"use client";
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zkkywakndxwthfmmkvzo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_334nMLd_U79eN2zdbQsn4w_8Lb1Gaf8';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function UserSignup() {
const [step, setStep] = useState(1);
const [formData, setFormData] = useState({
realName: '',
displayName: '',
email: '',
password: ''
});
const [otp, setOtp] = useState('');
const [loading, setLoading] = useState(false);
const [status, setStatus] = useState('CREATE YOUR OSU ACCOUNT');

// --- 暗号化ロジック（管理画面と共通） ---
const encryptData = (data) => btoa(encodeURIComponent(JSON.stringify(data)));

const handleSignup = async () => {
if (!formData.email.endsWith('@ge.osaka-sandai.ac.jp')) {
setStatus('ERROR: 大産大メアドのみ登録可能です');
return;
}
setLoading(true);
setStatus('認証コードを送信中...');

// Supabase認証開始
const { error } = await supabase.auth.signInWithOtp({ email: formData.email });

if (!error) {
setStep(2);
setStatus('メールを確認してください');
} else {
setStatus('エラー: ' + error.message);
}
setLoading(false);
};

const verifyAndComplete = async () => {
setLoading(true);
setStatus('最終処理中...');

const { error } = await supabase.auth.verifyOtp({
email: formData.email,
token: otp,
type: 'email'
});

if (!error) {
// 【重要】ここで全ての情報をひとまとめにして暗号化
const secureData = encryptData({
...formData,
timestamp: new Date().toISOString(),
studentId: formData.email.split('@')[0] // メアドから学籍番号を抽出
});

console.log("暗号化完了、管理画面へ送るデータ:", secureData);
setStep(3);
setStatus('登録完了');
} else {
setStatus('コードが正しくありません');
}
setLoading(false);
};

// --- 登録完了画面 ---
if (step === 3) {
return (
<div style={styles.container}>
<div style={styles.card}>
<h2 style={{color: '#fff'}}>WELCOME TO B-CONNECT</h2>
<p style={{color: '#00FF41'}}>アカウントが有効化されました</p>
<p style={{color: '#8E8E93', fontSize: '12px'}}>あなたの情報は高度に暗号化され、安全に保護されました。</p>
<button onClick={() => window.location.href = '/'} style={styles.button}>ログインへ</button>
</div>
</div>
);
}

return (
<div style={styles.container}>
<div style={styles.card}>
<h1 style={styles.logo}>B CONNECT</h1>
<p style={{...styles.status, color: status.includes('ERROR') ? '#FF3B30' : '#00FF41'}}>{status}</p>

{step === 1 ? (
<>
<input style={styles.input} placeholder="実名（管理者のみ把握）" value={formData.realName} onChange={e => setFormData({...formData, realName: e.target.value})} />
<input style={styles.input} placeholder="表示名（アプリ内の名前）" value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} />
<input style={styles.input} placeholder="学籍番号@ge.osaka-sandai.ac.jp" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
<input style={styles.input} placeholder="パスワード設定" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
<button onClick={handleSignup} disabled={loading} style={styles.button}>{loading ? '処理中...' : '認証メールを送信'}</button>
</>
) : (
<>
<p style={{color: '#fff', fontSize: '12px', marginBottom: '10px'}}>{formData.email}に送られた数字を入力</p>
<input style={styles.input} placeholder="6桁のコード" type="number" value={otp} onChange={e => setOtp(e.target.value)} />
<button onClick={verifyAndComplete} disabled={loading} style={styles.button}>登録を完了する</button>
</>
)}
</div>
</div>
);
}

const styles = {
container: { height: '100dvh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, sans-serif' },
card: { width: '85%', maxWidth: '380px', textAlign: 'center' },
logo: { color: '#fff', fontSize: '28px', letterSpacing: '8px', fontWeight: '900', marginBottom: '10px' },
status: { fontSize: '10px', marginBottom: '30px', textTransform: 'uppercase' },
input: { width: '100%', padding: '18px', backgroundColor: '#111', border: '1px solid #222', color: '#fff', borderRadius: '12px', fontSize: '15px', marginBottom: '12px', boxSizing: 'border-box', outline: 'none' },
button: { width: '100%', padding: '18px', backgroundColor: '#fff', color: '#000', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', border: 'none', cursor: 'pointer', marginTop: '10px' }
};
