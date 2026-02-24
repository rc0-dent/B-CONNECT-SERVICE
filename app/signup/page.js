"use client";
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zkkywakndxwthfmmkvzo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_334nMLd_U79eN2zdbQsn4w_8Lb1Gaf8';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function UserSignup() {
const [step, setStep] = useState(1);
const [formData, setFormData] = useState({ realName: '', displayName: '', email: '', password: '' });
const [loading, setLoading] = useState(false);
const [status, setStatus] = useState('OSU STUDENT REGISTRATION');

const handleStartAuth = async () => {
if (!formData.realName || !formData.displayName || !formData.email) {
setStatus('ERROR: 全て入力してください');
return;
}
setLoading(true);
// 本来はここでメール送信ですが、テスト用に次へ進ませます
setTimeout(() => { setStep(2); setStatus('認証コードを入力してください'); setLoading(false); }, 800);
};

const completeRegistration = async () => {
setLoading(true);
setStatus('データベースに保存中...');

// 【ここが重要：データベースに保存する命令！】
const { error } = await supabase
.from('profiles')
.insert([
{
real_name: formData.realName,
display_name: formData.displayName,
email: formData.email,
student_id: formData.email.split('@')[0]
}
]);

if (error) {
setStatus('ERROR: ' + error.message);
setLoading(false);
} else {
setStep(3); // 成功したら完了画面へ
}
};

if (step === 3) {
return (
<div style={styles.container}>
<div style={styles.card}>
<div style={styles.successIcon}>✓</div>
<h2 style={{color: '#fff'}}>REGISTRATION COMPLETE</h2>
<p style={{color: '#8E8E93'}}>データは安全にデータベースへ格納されました。</p>
<button onClick={() => window.location.href = '/'} style={styles.button}>トップへ戻る</button>
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
<input style={styles.input} placeholder="REAL NAME" value={formData.realName} onChange={e => setFormData({...formData, realName: e.target.value})} />
<input style={styles.input} placeholder="NICKNAME" value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} />
<input style={styles.input} placeholder="OSU EMAIL" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
<button onClick={handleStartAuth} style={styles.button}>NEXT</button>
</>
) : (
<>
<input style={styles.input} placeholder="000000" type="number" />
<button onClick={completeRegistration} disabled={loading} style={styles.button}>
{loading ? 'SAVING...' : 'COMPLETE'}
</button>
</>
)}
</div>
</div>
);
}

const styles = {
container: { height: '100dvh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' },
card: { width: '85%', maxWidth: '380px', textAlign: 'center' },
logo: { color: '#fff', fontSize: '24px', letterSpacing: '8px', fontWeight: '900', marginBottom: '30px' },
status: { fontSize: '10px', marginBottom: '20px' },
input: { width: '100%', padding: '16px', backgroundColor: '#111', border: '1px solid #222', color: '#fff', borderRadius: '12px', marginBottom: '10px', boxSizing: 'border-box' },
button: { width: '100%', padding: '18px', backgroundColor: '#fff', color: '#000', borderRadius: '12px', fontWeight: '900', border: 'none', marginTop: '10px' },
successIcon: { width: '60px', height: '60px', backgroundColor: '#00FF41', borderRadius: '50%', color: '#000', fontSize: '30px', lineHeight: '60px', margin: '0 auto 20px' }
};
