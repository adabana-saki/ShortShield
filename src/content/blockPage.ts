/**
 * Block page generator with customization support
 */

import type { BlockPageSettings } from '@/shared/types';

/**
 * Default motivational quotes
 */
const DEFAULT_QUOTES = [
  'Focus on what matters most.',
  'Every moment of focus is a step toward your goals.',
  'Your attention is your most valuable asset.',
  'Stay focused. Stay driven.',
  'Small steps lead to big achievements.',
];

/**
 * Get a random quote from settings or defaults
 */
function getRandomQuote(settings: BlockPageSettings): string {
  const quotes =
    settings.customQuotes.length > 0 ? settings.customQuotes : DEFAULT_QUOTES;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- quotes array is guaranteed non-empty
  return quotes[randomIndex] ?? DEFAULT_QUOTES[0]!;
}

/**
 * Determine if dark theme should be used
 */
function shouldUseDarkTheme(theme: BlockPageSettings['theme']): boolean {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  // System preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Generate block page overlay HTML
 */
export function createBlockPageOverlay(
  settings: BlockPageSettings,
  platformName: string,
  overlayId: string
): HTMLDivElement {
  const isDark = shouldUseDarkTheme(settings.theme);
  const primaryColor = settings.primaryColor || '#3b82f6';

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = overlayId;

  // Background styles based on theme
  const bgGradient = isDark
    ? `linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`
    : `linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)`;

  const textColor = isDark ? '#ffffff' : '#1e293b';
  const textSecondary = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(30,41,59,0.7)';
  const textMuted = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(30,41,59,0.5)';

  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${bgGradient};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2147483647;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: ${textColor};
    visibility: visible !important;
  `;

  // Create content container
  const contentDiv = document.createElement('div');
  contentDiv.style.cssText =
    'text-align: center; max-width: 450px; padding: 40px;';

  // Create icon
  const iconDiv = document.createElement('div');
  iconDiv.style.cssText = `font-size: 72px; margin-bottom: 24px; filter: drop-shadow(0 4px 8px ${primaryColor}40);`;
  iconDiv.textContent = '🛡️';
  contentDiv.appendChild(iconDiv);

  // Create title
  const title = document.createElement('h1');
  title.style.cssText = `
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 12px 0;
    color: ${textColor};
  `;
  title.textContent = settings.title || 'Content Blocked';
  contentDiv.appendChild(title);

  // Create main message
  const mainMessage = document.createElement('p');
  mainMessage.style.cssText = `
    font-size: 18px;
    color: ${textSecondary};
    margin: 0 0 24px 0;
    line-height: 1.5;
  `;
  const messageTemplate = settings.message || `${platformName} is blocked to help you stay focused.`;
  mainMessage.textContent = messageTemplate.replace('${platform}', platformName);
  contentDiv.appendChild(mainMessage);

  // Create motivational quote if enabled
  if (settings.showMotivationalQuote) {
    const quoteDiv = document.createElement('div');
    quoteDiv.style.cssText = `
      margin: 24px 0;
      padding: 16px 24px;
      background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
      border-left: 4px solid ${primaryColor};
      border-radius: 0 8px 8px 0;
    `;

    const quoteText = document.createElement('p');
    quoteText.style.cssText = `
      font-size: 16px;
      font-style: italic;
      color: ${textSecondary};
      margin: 0;
      line-height: 1.5;
    `;
    quoteText.textContent = `"${getRandomQuote(settings)}"`;
    quoteDiv.appendChild(quoteText);
    contentDiv.appendChild(quoteDiv);
  }

  // Create bypass button if enabled
  if (settings.showBypassButton) {
    const bypassBtn = document.createElement('button');
    bypassBtn.style.cssText = `
      margin-top: 24px;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 500;
      color: ${primaryColor};
      background: transparent;
      border: 2px solid ${primaryColor};
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    `;
    bypassBtn.textContent = 'Bypass for 5 minutes';
    bypassBtn.onmouseover = () => {
      bypassBtn.style.background = primaryColor;
      bypassBtn.style.color = '#ffffff';
    };
    bypassBtn.onmouseout = () => {
      bypassBtn.style.background = 'transparent';
      bypassBtn.style.color = primaryColor;
    };
    bypassBtn.onclick = () => {
      // TODO: Implement bypass functionality
      overlay.remove();
      document.body.style.removeProperty('visibility');
      document.body.style.removeProperty('overflow');
    };
    contentDiv.appendChild(bypassBtn);
  }

  // Create settings hint
  const settingsHint = document.createElement('p');
  settingsHint.style.cssText = `
    font-size: 13px;
    color: ${textMuted};
    margin: ${settings.showBypassButton ? '16px' : '24px'} 0 0 0;
  `;
  settingsHint.textContent = 'You can change this in ShortShield settings.';
  contentDiv.appendChild(settingsHint);

  overlay.appendChild(contentDiv);

  return overlay;
}

/**
 * Show block page overlay
 */
export function showBlockPage(
  settings: BlockPageSettings,
  platformName: string,
  overlayId: string
): void {
  // Check if overlay already exists
  if (document.getElementById(overlayId)) {
    return;
  }

  // Hide the body content
  document.body.style.setProperty('visibility', 'hidden', 'important');
  document.body.style.setProperty('overflow', 'hidden', 'important');

  // Create and append overlay
  const overlay = createBlockPageOverlay(settings, platformName, overlayId);
  document.documentElement.appendChild(overlay);
}
