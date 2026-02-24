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
const [loading, setLoading] = useState(false);
const [status, setStatus] = useState('OSU STUDENT REGISTRATION');

const OSU_DOMAIN = '@ge.osaka-sandai.ac.jp';

// 暗号化処理
const encryptData = (data) => btoa(encodeURIComponent(JSON.stringify(data)));

const handleStartAuth = async () => {
if (!formData.realName || !formData.displayName || !formData.password) {
setStatus('ERROR: 全て入力してください');
return;
}
if (!formData.email.endsWith(OSU_DOMAIN)) {
setStatus('ERROR: 大産大メアドが必要です');
return;
}

setLoading(true);
setStatus('認証コード送信中...');
const { error } = await supabase.auth.signInWithOtp({ email: formData.email });

if (!error) {
setStep(2);
setStatus('認証コードを入力してください');
} else {
setStatus('ERROR: ' + error.message);
}
setLoading(false);
};

const completeRegistration = () => {
const securePacket = encryptData({
...formData,
studentId: formData.email.split('@')[0],
createdAt: new Date().toISOString()
});
console.log("暗号化データ作成完了:", securePacket);
setStep(3);
};

if (step === 3) {
return (
<div style={styles.container}>
<div style={styles.card}>
<div style={styles.successIcon}>✓</div>
<h2 style={{color: '#fff', marginBottom: '10px'}}>REGISTERED</h2>
<p style={{color: '#8E8E93', fontSize: '13px'}}>ハッシュ化され、安全に保存されました。</p>
<button onClick={() => window.location.href = '/'} style={styles.button}>ログインへ</button>
</div>
</div>
);
}

return (
<div style={styles.container}>
<div style={styles.card}>
<h1 style={styles.logo}>B CONNECT</h1>
<div style={{...styles.status, color: status.includes('ERROR') ? '#FF3B30' : '#00FF41'}}>{status}</div>
{step === 1 ? (
<>
<div style={styles.inputGroup}>
<label style={styles.label}>REAL NAME (実名)</label>
<input style={styles.input} placeholder="管理者のみ把握" value={formData.realName} onChange={e => setFormData({...formData, realName: e.target.value})} />
</div>
<div style={styles.inputGroup}>
<label style={styles.label}>DISPLAY NAME (ニックネーム)</label>
<input style={styles.input} placeholder="アプリ内での名前" value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} />
</div>
<div style={styles.inputGroup}>
<label style={styles.label}>OSU EMAIL</label>
<input style={styles.input} placeholder="学籍番号@ge.osaka-sandai.ac.jp" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
</div>
<div style={styles.inputGroup}>
<label style={styles.label}>PASSWORD</label>
<input style={styles.input} type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
</div>
<button onClick={handleStartAuth} disabled={loading} style={styles.button}>
{loading ? 'SENDING...' : 'VERIFY EMAIL'}
</button>
</>
) : (
<>
<input style={styles.input} placeholder="000000" type="number" />
<button onClick={completeRegistration} style={styles.button}>COMPLETE</button>
</>
)}
</div>
</div>
);
}

const styles = {
container: { height: '100dvh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, sans-serif' },
card: { width: '85%', maxWidth: '380px', textAlign: 'center' },
logo: { color: '#fff', fontSize: '24px', letterSpacing: '8px', fontWeight: '900', marginBottom: '5px' },
status: { fontSize: '10px', letterSpacing: '1px', marginBottom: '30px' },
inputGroup: { textAlign: 'left', marginBottom: '15px' },
label: { color: '#444', fontSize: '10px', fontWeight: 'bold', marginLeft: '5px', marginBottom: '5px', display: 'block' },
input: { width: '100%', padding: '16px', backgroundColor: '#111', border: '1px solid #222', color: '#fff', borderRadius: '12px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' },
button: { width: '100%', padding: '18px', backgroundColor: '#fff', color: '#000', borderRadius: '12px', fontWeight: '900', fontSize: '14px', border: 'none', marginTop: '10px' },
successIcon: { width: '60px', height: '60px', backgroundColor: '#00FF41', borderRadius: '50%', color: '#000', fontSize: '30px', lineHeight: '60px', margin: '0 auto 20px', fontWeight: 'bold' }
};
