/**
 * Unified email and Gmail opening helper.
 * On mobile: opens the Gmail app directly if installed (falling back to mailto).
 * On desktop: opens Gmail web compose in a new browser tab.
 */

export const PORTFOLIO_EMAIL = 'sahilaw502@gmail.com';

export function openGmailDirect(email = PORTFOLIO_EMAIL) {
  if (typeof window === 'undefined') return;

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');

  if (isMobile) {
    // Attempt opening Gmail app on mobile devices
    // iOS and Android support googlegmail://
    const gmailAppUrl = `googlegmail:///co?to=${encodeURIComponent(email)}`;
    const mailtoUrl = `mailto:${encodeURIComponent(email)}`;

    window.location.href = gmailAppUrl;
    setTimeout(() => {
      // Fallback if the app isn't installed
      window.location.href = mailtoUrl;
    }, 450);
  } else {
    // Desktop: Open Gmail in a new tab
    const desktopUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
    window.open(desktopUrl, '_blank', 'noopener,noreferrer');
  }
}

export async function copyToClipboard(text) {
  if (typeof window === 'undefined') return false;

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback to legacy execCommand
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}

