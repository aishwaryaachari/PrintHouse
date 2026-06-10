import { useState, useEffect } from "react";

const authStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Outfit:wght@300;400;500;600&display=swap');

  /* OVERLAY */
  .auth-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.55);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    z-index: 2000; display: flex; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none; transition: opacity 0.35s ease;
    padding: 24px;
  }
  .auth-overlay.open { opacity: 1; pointer-events: all; }

  /* MODAL */
  .auth-modal {
    background: var(--bg-white); width: 100%; max-width: 460px;
    border-radius: 8px; overflow: hidden;
    transform: translateY(24px) scale(0.97);
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: 0 30px 80px rgba(0,0,0,0.25), 0 0 0 1px var(--border-color);
    position: relative;
  }
  .auth-overlay.open .auth-modal { transform: translateY(0) scale(1); }

  /* HEADER BANNER */
  .auth-banner {
    background: var(--text-dark); padding: 40px 40px 32px;
    position: relative; overflow: hidden;
  }
  .auth-banner::before {
    content: ''; position: absolute; top: -40px; right: -40px;
    width: 180px; height: 180px; border-radius: 50%;
    background: rgba(212,175,55,0.1); pointer-events: none;
  }
  .auth-banner::after {
    content: ''; position: absolute; bottom: -20px; left: 20px;
    width: 80px; height: 80px; border-radius: 50%;
    background: rgba(212,175,55,0.06); pointer-events: none;
  }
  .auth-brand { font-family: 'Cinzel', serif; font-size: 13px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
  .auth-banner-title { font-family: 'Cinzel', serif; font-size: 28px; font-weight: 600; color: #fff; line-height: 1.15; }
  .auth-banner-sub { font-size: 13px; color: rgba(255,255,255,0.55); margin-top: 8px; font-weight: 300; letter-spacing: 0.3px; }

  /* CLOSE */
  .auth-close {
    position: absolute; top: 16px; right: 16px;
    background: rgba(255,255,255,0.1); border: none; color: rgba(255,255,255,0.7);
    width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, color 0.2s;
  }
  .auth-close:hover { background: rgba(255,255,255,0.2); color: #fff; }

  /* TABS */
  .auth-tabs {
    display: flex; border-bottom: 1px solid var(--border-color);
    background: var(--bg-white);
  }
  .auth-tab {
    flex: 1; padding: 16px; text-align: center; font-size: 12px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.5px; cursor: pointer;
    color: var(--text-light); border-bottom: 2px solid transparent;
    transition: all 0.2s ease; background: none; border-top: none; border-left: none; border-right: none;
    font-family: 'Outfit', sans-serif;
  }
  .auth-tab.active { color: var(--text-dark); border-bottom-color: var(--text-dark); }
  .auth-tab:hover:not(.active) { color: var(--text-dark); background: var(--bg-offwhite); }

  /* FORM BODY */
  .auth-body { padding: 32px 40px 40px; }

  .auth-field { margin-bottom: 20px; }
  .auth-label {
    display: block; font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1.5px; color: var(--text-dark); margin-bottom: 8px;
  }
  .auth-input {
    width: 100%; padding: 13px 16px; border: 1px solid var(--border-color);
    border-radius: 4px; font-size: 14px; font-family: 'Outfit', sans-serif;
    background: var(--bg-white); color: var(--text-dark);
    transition: border-color 0.2s, box-shadow 0.2s; outline: none;
  }
  .auth-input:focus { border-color: var(--text-dark); box-shadow: 0 0 0 3px rgba(15,17,21,0.06); }
  .auth-input::placeholder { color: var(--text-light); opacity: 0.7; }
  .auth-input.error { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.08); }

  .auth-password-wrap { position: relative; }
  .auth-password-wrap .auth-input { padding-right: 48px; }
  .auth-eye {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: var(--text-light);
    display: flex; align-items: center; padding: 4px; transition: color 0.2s;
  }
  .auth-eye:hover { color: var(--text-dark); }

  /* ERROR MESSAGE */
  .auth-error {
    background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
    border-radius: 4px; padding: 12px 16px; margin-bottom: 20px;
    font-size: 13px; color: #dc2626; font-weight: 500;
  }

  /* SUCCESS */
  .auth-success {
    background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2);
    border-radius: 4px; padding: 12px 16px; margin-bottom: 20px;
    font-size: 13px; color: #16a34a; font-weight: 500;
  }

  /* SUBMIT */
  .auth-submit {
    width: 100%; background: var(--btn-bg); color: var(--btn-text); border: none;
    border-radius: 4px; padding: 16px; font-size: 13px; font-weight: 700; cursor: pointer;
    text-transform: uppercase; letter-spacing: 2px; font-family: 'Outfit', sans-serif;
    transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-top: 4px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .auth-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); opacity: 0.9; }
  .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* SPINNER */
  .auth-spinner {
    width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .auth-divider {
    display: flex; align-items: center; gap: 16px; margin: 24px 0;
    font-size: 11px; color: var(--text-light); text-transform: uppercase; letter-spacing: 1px;
  }
  .auth-divider::before, .auth-divider::after {
    content: ''; flex: 1; height: 1px; background: var(--border-color);
  }

  .auth-switch { text-align: center; margin-top: 20px; font-size: 13px; color: var(--text-light); font-weight: 300; }
  .auth-switch button {
    background: none; border: none; cursor: pointer; color: var(--text-dark);
    font-weight: 600; font-size: 13px; font-family: 'Outfit', sans-serif;
    text-decoration: underline; padding: 0; margin-left: 4px;
  }
`;

const API = "http://127.0.0.1:8000/api/auth";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Inject styles once
  useEffect(() => {
    if (!document.querySelector("#auth-styles")) {
      const tag = document.createElement("style");
      tag.id = "auth-styles";
      tag.innerHTML = authStyles;
      document.head.appendChild(tag);
    }
  }, []);

  // Reset on tab/open change
  useEffect(() => {
    setError(""); setSuccess(""); setName(""); setEmail(""); setPassword(""); setShowPass(false);
  }, [tab, isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape" && isOpen) onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    // Basic client-side validation
    if (tab === "signup" && !name.trim()) return setError("Please enter your full name.");
    if (!email.trim() || !email.includes("@")) return setError("Please enter a valid email.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);
    try {
      const endpoint = tab === "login" ? `${API}/login/` : `${API}/signup/`;
      const body = tab === "login" ? { email, password } : { name, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setSuccess(tab === "login" ? `Welcome back, ${data.user?.name || ""}!` : `Account created! Welcome, ${data.user?.name || ""}!`);
        setTimeout(() => {
          onAuthSuccess && onAuthSuccess(data.user);
          onClose();
        }, 1200);
      }
    } catch {
      setError("Cannot connect to server. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const bannerTitle = tab === "login" ? "Welcome back." : "Create your account.";
  const bannerSub = tab === "login"
    ? "Sign in to manage your orders and saved designs."
    : "Join thousands of businesses that trust us with their brand.";

  return (
    <div className={`auth-overlay${isOpen ? " open" : ""}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal" role="dialog" aria-modal="true" aria-label={tab === "login" ? "Login" : "Sign Up"}>

        {/* Banner */}
        <div className="auth-banner">
          <button className="auth-close" onClick={onClose} title="Close">✕</button>
          <div className="auth-brand">Hari Om Print House</div>
          <div className="auth-banner-title">{bannerTitle}</div>
          <div className="auth-banner-sub">{bannerSub}</div>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button className={`auth-tab${tab === "login" ? " active" : ""}`} onClick={() => setTab("login")}>Sign In</button>
          <button className={`auth-tab${tab === "signup" ? " active" : ""}`} onClick={() => setTab("signup")}>Create Account</button>
        </div>

        {/* Form */}
        <div className="auth-body">
          {error && <div className="auth-error">⚠ {error}</div>}
          {success && <div className="auth-success">✓ {success}</div>}

          <form onSubmit={handleSubmit} noValidate>
            {tab === "signup" && (
              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-name">Full Name</label>
                <input
                  id="auth-name" type="text" className="auth-input"
                  placeholder="e.g. Rahul Sharma"
                  value={name} onChange={(e) => setName(e.target.value)}
                  autoComplete="name" required
                />
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-email">Email Address</label>
              <input
                id="auth-email" type="email" className="auth-input"
                placeholder="you@company.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                autoComplete="email" required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-password">Password</label>
              <div className="auth-password-wrap">
                <input
                  id="auth-password"
                  type={showPass ? "text" : "password"}
                  className="auth-input"
                  placeholder={tab === "signup" ? "Min. 6 characters" : "Your password"}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  autoComplete={tab === "login" ? "current-password" : "new-password"}
                  required
                />
                <button type="button" className="auth-eye" onClick={() => setShowPass(s => !s)} title={showPass ? "Hide" : "Show"}>
                  {showPass ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading && <span className="auth-spinner" />}
              {loading ? "Please wait…" : tab === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </form>

          <div className="auth-switch">
            {tab === "login" ? (
              <>Don't have an account?<button onClick={() => setTab("signup")}>Create one</button></>
            ) : (
              <>Already have an account?<button onClick={() => setTab("login")}>Sign in</button></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
