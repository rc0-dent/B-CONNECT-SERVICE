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

const handleSendOtp = async () => {
if (!email) return;
setLoading(true);
const { error } = await supabase.auth.signInWithOtp({ email });
if (error) { setMessage('ERROR: ' + error.message); }
else { setMessage('OTP SENT TO YOUR GMAIL'); setStep(2); }
setLoading(false);
};

const handleVerifyOtp = async () => {
setLoading(true);
const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
if (error) { setMessage('INVALID CODE'); } else { setStep(3); }
setLoading(false);
};

if (step === 3) return (
<div style={{ height: '100vh', backgroundColor: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
<div style={{ background: '#fff', padding: '40px', borderRadius: '20px', textAlign: 'center', color: '#000' }}>
<h2 style={{ fontWeight: '900' }}>ACCESS GRANTED</h2>
<p>ようこそ、管理者レイ。</p>
</div>
</div>
);

return (
<div style={{ height: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'monospace' }}>
<div style={{ width: '100%', maxWidth: '350px', textAlign: 'center' }}>
<h1>B CONNECT</h1>
<p style={{ color: '#00FF41' }}>{message}</p>
{step === 1 ? (
<><input style={{ width: '100%', padding: '15px', marginBottom: '10px', color: '#000' }} placeholder="EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} />
<button onClick={handleSendOtp} style={{ width: '100%', padding: '15px' }}>SEND OTP</button></>
) : (
<><input style={{ width: '100%', padding: '15px', marginBottom: '10px', color: '#000' }} placeholder="8-DIGIT CODE" value={otp} onChange={(e) => setOtp(e.target.value)} />
<button onClick={handleVerifyOtp} style={{ width: '100%', padding: '15px' }}>AUTHORIZE</button></>
)}
</div>
</div>
);
}
