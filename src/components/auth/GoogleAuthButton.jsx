import React, { useEffect, useRef, useState } from 'react';
import { api } from '../../services/api';

const GoogleAuthButton = ({ onSuccess, onError, isSignup = false, disabled = false }) => {
  const buttonRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState(
    import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
  );

  // Fetch client ID if missing from env
  useEffect(() => {
    if (!clientId) {
      api.auth.getGoogleClientId()
        .then((res) => {
          if (res?.clientId) setClientId(res.clientId);
        })
        .catch((err) => console.warn('Could not fetch google client id:', err));
    }
  }, [clientId]);

  // Check and initialize Google Identity Services
  useEffect(() => {
    if (!clientId) return;

    let intervalId = null;

    const renderGsiButton = () => {
      if (window.google?.accounts?.id && buttonRef.current) {
        if (intervalId) clearInterval(intervalId);

        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              if (response?.credential) {
                setLoading(true);
                try {
                  await onSuccess({ credential: response.credential });
                } catch (err) {
                  onError?.(err.message || 'Google authentication failed');
                } finally {
                  setLoading(false);
                }
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          buttonRef.current.innerHTML = '';
          const containerWidth = buttonRef.current.offsetWidth || 340;
          window.google.accounts.id.renderButton(buttonRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: isSignup ? 'signup_with' : 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: Math.min(400, Math.max(240, containerWidth)),
          });
        } catch (e) {
          console.warn('GSI renderButton error:', e);
        }
      }
    };

    renderGsiButton();
    if (!window.google?.accounts?.id) {
      intervalId = setInterval(renderGsiButton, 200);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [clientId, isSignup, onSuccess, onError]);

  // Fallback trigger if user clicks custom button directly
  const handleCustomClick = () => {
    if (disabled || loading) return;
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt();
      } catch (err) {
        console.warn('GSI prompt error:', err);
      }
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl group">
      {/* 
        1. The ONLY visible button: 
        Sleek themed button with the original 4-color Google icon matching the site's dark/light design.
      */}
      <button
        type="button"
        onClick={handleCustomClick}
        disabled={disabled || loading}
        className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm group-hover:bg-slate-50 dark:group-hover:bg-slate-700/60 transition-all flex items-center justify-center gap-3 shadow-sm group-hover:shadow disabled:opacity-50 select-none"
      >
        {/* Original 4-color Google 'G' icon */}
        <svg
          className="w-5 h-5 shrink-0"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>

        <span>
          {loading
            ? 'Connecting...'
            : isSignup
            ? 'Sign up with Google'
            : 'Continue with Google'}
        </span>
      </button>

      {/* 
        2. Invisible Google GSI button overlay:
        The white Google button is rendered here but kept completely invisible (opacity-0),
        allowing native clicks to trigger Google authentication without showing the white button.
      */}
      <div
        ref={buttonRef}
        className={`absolute inset-0 w-full h-full opacity-0 overflow-hidden cursor-pointer z-10 flex items-center justify-center pointer-events-auto [&>div]:!w-full [&>div]:!h-full [&_iframe]:!w-full [&_iframe]:!h-full [&_iframe]:!min-w-full [&_iframe]:cursor-pointer ${
          disabled || loading ? 'pointer-events-none' : ''
        }`}
        style={{
          transform: 'scale(1.15)',
          transformOrigin: 'center',
        }}
        title={isSignup ? 'Sign up with Google' : 'Continue with Google'}
      />
    </div>
  );
};

export default GoogleAuthButton;
