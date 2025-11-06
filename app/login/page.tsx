'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState(''),
        [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle'),
        [msg, setMsg] = useState('');

  async function send(e: React.FormEvent) {
    e.preventDefault(); setStatus('sending'); setMsg('');
    const params = new URLSearchParams(window.location.search);
    const redirectTo = params.get('redirectTo') || '/';
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}` }
    });
    if (error) { setStatus('error'); setMsg(error.message); } else { setStatus('sent'); setMsg('Check your email for the sign-in link.'); }
  }

  return (
    <main style={{ minHeight:'100svh', display:'grid', placeItems:'center', background:'#0B0C0F' }}>
      <div style={{ width:'min(420px,92vw)', background:'#fff', borderRadius:20, padding:28, boxShadow:'0 10px 30px rgba(0,0,0,.25)' }}>
        <header style={{ marginBottom:16 }}>
          <div style={{ fontWeight:800, fontSize:18, color:'#E50914' }}>{'</>'} ProjectSensei</div>
          <div style={{ color:'#555', marginTop:4 }}>Build Fearlessly — Sensei Has You</div>
        </header>
        <form onSubmit={send} style={{ display:'grid', gap:12 }}>
          <label style={{ fontSize:14 }}>Email address</label>
          <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"
                 style={{ padding:'12px 14px', borderRadius:12, border:'1px solid #ddd' }} />
          <button type="submit" disabled={status==='sending'} style={{ marginTop:8, padding:'12px 14px', borderRadius:12, border:'none', background:'#E50914', color:'#fff', fontWeight:700 }}>
            {status==='sending' ? 'Sending…' : 'Send magic link'}
          </button>
        </form>
        {msg && <p style={{ marginTop:12, color: status==='error' ? '#B00020' : '#0A7F3F' }}>{msg}</p>}
      </div>
    </main>
  );
}
