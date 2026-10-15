import React, { useEffect, useRef, useState } from 'react';
import { api } from '../../services/api';

// Default GDG Google Client ID
const DEFAULT_GOOGLE_CLIENT_ID = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_CLIENT_ID) || '';

function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const GoogleAuthButton = ({ onSuccess, onError, isSignup = false, disabled = false }) => {
  const buttonRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isGsiRendered, setIsGsiRendered] = useState(false);
  const [clientId, setClientId] = useState(
    import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID
  );

  // If client ID is not defined in env, sync from backend without blocking
  useEffect(() => {
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      api.auth.getGoogleClientId()
        .then((res) => {
          if (res?.clientId && res.clientId !== clientId) {
            setClientId(res.clientId);
          }
        })
        .catch((err) => {
          console.info('Using configured Google client ID:', err.message);
        });
    }
  }, []);

  // Ensure Google Identity Services script is present in head
  useEffect(() => {
    if (!window.google?.accounts?.id && !window.google?.accounts?.oauth2) {
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }
  }, []);

  // Initialize Google Identity Services button overlay
  useEffect(() => {
    if (!clientId) return;

    let intervalId = null;
    let attempts = 0;

    const renderGsiButton = () => {
      attempts += 1;
      if (window.google?.accounts?.id && buttonRef.current) {
        if (intervalId) clearInterval(intervalId);

        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              if (response?.credential) {
                setLoading(true);
                try {
                  const decoded = decodeJwt(response.credential);
                  await onSuccess({
                    credential: response.credential,
                    email: decoded?.email,
                    name: decoded?.name,
                    avatar: decoded?.picture,
                    googleId: decoded?.sub,
                  });
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

          // Check if Google rendered iframe
          setTimeout(() => {
            if (buttonRef.current && buttonRef.current.children.length > 0) {
              setIsGsiRendered(true);
            }
          }, 100);
        } catch (e) {
          console.warn('GSI renderButton error:', e);
        }
      } else if (attempts > 30 && intervalId) {
        clearInterval(intervalId);
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

  // Direct OAuth 2.0 popup trigger (used when clicking custom button or if overlay is blocked/unrendered)
  const handleCustomClick = () => {
    if (disabled || loading) return;

    const activeClientId = clientId || DEFAULT_GOOGLE_CLIENT_ID;

    // Method 1: Google OAuth2 Token Client Popup (official GIS popup flow)
    if (window.google?.accounts?.oauth2) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: activeClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              if (tokenResponse.error !== 'popup_closed_by_user') {
                onError?.(tokenResponse.error_description || 'Google sign-in was canceled.');
              }
              return;
            }

            if (tokenResponse.access_token) {
              setLoading(true);
              try {
                let profile = {};
                try {
                  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                  });
                  if (res.ok) profile = await res.json();
                } catch (e) {
                  console.warn('Google userinfo fetch warn:', e);
                }

                await onSuccess({
                  accessToken: tokenResponse.access_token,
                  email: profile.email,
                  name: profile.name,
                  avatar: profile.picture,
                  googleId: profile.sub,
                });
              } catch (err) {
                onError?.(err.message || 'Google authentication failed');
              } finally {
                setLoading(false);
              }
            }
          },
          error_callback: (err) => {
            console.warn('Google tokenClient error callback:', err);
            if (window.google?.accounts?.id?.prompt) {
              window.google.accounts.id.prompt();
            } else {
              onError?.('Google popup failed to open. Please check popup permissions.');
            }
          },
        });

        tokenClient.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        console.warn('initTokenClient error, attempting One Tap prompt fallback:', err);
      }
    }

    // Method 2: Fallback to One Tap prompt if OAuth2 is unavailable
    if (window.google?.accounts?.id?.prompt) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.info('GSI One Tap not displayed:', notification.getNotDisplayedReason?.());
        }
      });
    } else {
      onError?.('Google authentication is loading. Please try again in a moment.');
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl group">
      {/* 
        1. Beautifully themed, responsive visible button:
        Matching the site's dark/light design with official 4-color Google icon.
      */}
      <button
        type="button"
        onClick={handleCustomClick}
        disabled={disabled || loading}
        className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm group-hover:bg-slate-50 dark:group-hover:bg-slate-700/60 transition-all flex items-center justify-center gap-3 shadow-sm group-hover:shadow disabled:opacity-50 select-none cursor-pointer"
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
        2. Google GSI button overlay:
        Rendered with opacity-[0.001] so it is completely invisible to human eyes,
        yet fully interactive so native clicks directly trigger Google popup.
        When not rendered, clicks pass seamlessly to handleCustomClick.
      */}
      <div
        ref={buttonRef}
        className={`absolute inset-0 w-full h-full opacity-[0.001] overflow-hidden z-10 flex items-center justify-center [&>div]:!w-full [&>div]:!h-full [&_iframe]:!w-full [&_iframe]:!h-full [&_iframe]:!min-w-full [&_iframe]:cursor-pointer ${
          isGsiRendered && !disabled && !loading
            ? 'pointer-events-auto cursor-pointer'
            : 'pointer-events-none'
        }`}
        style={{
          transform: 'scale(1.2)',
          transformOrigin: 'center',
        }}
        title={isSignup ? 'Sign up with Google' : 'Continue with Google'}
      />
    </div>
  );
};

export default GoogleAuthButton;
