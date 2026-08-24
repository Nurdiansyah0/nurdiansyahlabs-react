import { Eye, EyeOff, Lock } from 'lucide-react'

export default function AdminLogin({
    authView, setAuthView,
    usernameInput, setUsernameInput,
    passwordInput, setPasswordInput,
    showPassword, setShowPassword,
    authError, authMessage,
    onLogin, onForgotPassword, onResetPassword,
}) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
            <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#3730a3' }}>
                    <Lock size={48} />
                </div>
                <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', color: '#0f172a' }}>
                    {authView === 'login' ? 'Admin Login' : authView === 'forgot' ? 'Reset Password' : 'Set New Password'}
                </h1>

                {authView === 'login' && (
                    <form onSubmit={onLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input aria-label="Username" type="text" placeholder="Username" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }} required />
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <input aria-label="Password" type={showPassword ? 'text' : 'password'} placeholder="Password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} style={{ padding: '0.8rem', paddingRight: '2.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }} required />
                                <div style={{ position: 'absolute', right: '10px', cursor: 'pointer', color: '#1e293b', display: 'flex' }} onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                                <span style={{ fontSize: '0.8rem', color: '#3730a3', cursor: 'pointer', fontWeight: 600 }} onClick={() => { setAuthView('forgot') }}>Forgot Password?</span>
                            </div>
                        </div>
                        {authError && <div style={{ color: '#b91c1c', fontSize: '0.85rem' }}>{authError}</div>}
                        <button aria-label="Sign In" type="submit" style={{ background: '#3730a3', color: '#fff', padding: '0.8rem', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>Sign In</button>
                    </form>
                )}

                {authView === 'forgot' && (
                    <form onSubmit={onForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <p style={{ fontSize: '0.9rem', color: '#1e293b', textAlign: 'center', marginBottom: '0.5rem' }}>Enter your username or email address and we will send you a link to reset your password.</p>
                        <input aria-label="Username or Email" type="text" placeholder="Username or Email" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }} required />
                        {authMessage && <div style={{ color: '#047857', fontSize: '0.85rem', background: '#d1fae5', padding: '0.5rem', borderRadius: '4px' }}>{authMessage}</div>}
                        {authError && <div style={{ color: '#b91c1c', fontSize: '0.85rem' }}>{authError}</div>}
                        <button aria-label="Send Reset Link" type="submit" style={{ background: '#3730a3', color: '#fff', padding: '0.8rem', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>Send Reset Link</button>
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <span style={{ fontSize: '0.85rem', color: '#1e293b', cursor: 'pointer' }} onClick={() => setAuthView('login')}>&larr; Back to Login</span>
                        </div>
                    </form>
                )}

                {authView === 'reset' && (
                    <form onSubmit={onResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <p style={{ fontSize: '0.9rem', color: '#1e293b', textAlign: 'center', marginBottom: '0.5rem' }}>Please enter your new password below.</p>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input aria-label="New Password" type={showPassword ? 'text' : 'password'} placeholder="New Password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} style={{ padding: '0.8rem', paddingRight: '2.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }} required />
                            <div style={{ position: 'absolute', right: '10px', cursor: 'pointer', color: '#1e293b', display: 'flex' }} onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </div>
                        </div>
                        {authMessage && <div style={{ color: '#047857', fontSize: '0.85rem', background: '#d1fae5', padding: '0.5rem', borderRadius: '4px' }}>{authMessage}</div>}
                        {authError && <div style={{ color: '#b91c1c', fontSize: '0.85rem' }}>{authError}</div>}
                        <button aria-label="Save New Password" type="submit" style={{ background: '#3730a3', color: '#fff', padding: '0.8rem', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>Save New Password</button>
                    </form>
                )}
            </div>
        </div>
    )
}
