import React, { useEffect, useRef, useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { api } from '../../services/api';

const GoogleAuthButton = ({ onSuccess, onError, isSignup = false, disabled = false }) => {
  const buttonRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [gisLoaded, setGisLoaded] = useState(false);
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

    const checkGsi = () => {
      if (window.google?.accounts?.id) {
        setGisLoaded(true);
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

          if (buttonRef.current) {
            buttonRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(buttonRef.current, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: isSignup ? 'signup_with' : 'signin_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: buttonRef.current.offsetWidth || 340,
            });
          }
        } catch (e) {
          console.warn('GSI renderButton error:', e);
        }
      } else {
        setTimeout(checkGsi, 300);
      }
    };

    checkGsi();
  }, [clientId, isSignup]);

  // Fallback trigger if user clicks custom button
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
    <div className="w-full">
      {/* Container where Google GSI button is rendered */}
      <div
        ref={buttonRef}
        className={`w-full flex justify-center min-h-[44px] overflow-hidden rounded-xl ${
          gisLoaded ? 'block' : 'hidden'
        }`}
      />

      {/* Sleek Fallback Button shown while GSI loads or if blocked */}
      {!gisLoaded && (
        <button
          type="button"
          onClick={handleCustomClick}
          disabled={disabled || loading}
          className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow disabled:opacity-50"
        >
          <FaGoogle className="text-google-red" />
          <span>{loading ? 'Connecting...' : isSignup ? 'Sign up with Google' : 'Continue with Google'}</span>
        </button>
      )}
    </div>
  );
};

export default GoogleAuthButton;
