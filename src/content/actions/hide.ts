/**
 * Hide action module
 * Handles hiding and blurring elements
 */

import { createLogger } from '@/shared/utils/logger';

const logger = createLogger('hide-action');

/**
 * CSS class names for hidden elements
 */
const HIDDEN_CLASS = 'shortshield-hidden';
const BLUR_CLASS = 'shortshield-blur';

/**
 * Data attribute to mark processed elements
 */
const PROCESSED_ATTR = 'data-shortshield-hidden';

/**
 * Inject styles for hiding elements (called once)
 */
let stylesInjected = false;

function injectStyles(): void {
  if (stylesInjected) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'shortshield-styles';
  style.textContent = `
    .${HIDDEN_CLASS} {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
      height: 0 !important;
      overflow: hidden !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .${BLUR_CLASS} {
      filter: blur(20px) !important;
      pointer-events: none !important;
      user-select: none !important;
      opacity: 0.5 !important;
    }

    .${BLUR_CLASS}::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }
  `;

  document.head.appendChild(style);
  stylesInjected = true;
  logger.debug('Styles injected');
}

/**
 * Check if element is already processed
 */
export function isProcessed(element: HTMLElement): boolean {
  return element.getAttribute(PROCESSED_ATTR) === 'true';
}

/**
 * Mark element as processed
 */
export function markProcessed(element: HTMLElement): void {
  element.setAttribute(PROCESSED_ATTR, 'true');
}

/**
 * Hide an element completely
 */
export function hideElement(element: HTMLElement): void {
  if (isProcessed(element)) {
    return;
  }

  injectStyles();

  // Store original display value for potential restore
  const originalDisplay = window.getComputedStyle(element).display;
  element.dataset.shortshieldOriginalDisplay = originalDisplay;

  // Apply hidden styles
  element.style.display = 'none';
  element.classList.add(HIDDEN_CLASS);
  markProcessed(element);

  logger.debug('Element hidden', {
    tagName: element.tagName,
    className: element.className?.toString().slice(0, 50),
  });
}

/**
 * Blur an element (partial hide)
 */
export function blurElement(element: HTMLElement): void {
  if (isProcessed(element)) {
    return;
  }

  injectStyles();

  // Store original styles
  element.dataset.shortshieldOriginalFilter = element.style.filter;
  element.dataset.shortshieldOriginalPointerEvents = element.style.pointerEvents;

  // Apply blur styles
  element.classList.add(BLUR_CLASS);
  markProcessed(element);

  logger.debug('Element blurred', {
    tagName: element.tagName,
  });
}

/**
 * Remove element from DOM
 */
export function removeElement(element: HTMLElement): void {
  if (isProcessed(element)) {
    return;
  }

  markProcessed(element);

  // Remove from DOM
  element.remove();

  logger.debug('Element removed');
}

/**
 * Restore a hidden element
 */
export function restoreElement(element: HTMLElement): void {
  if (!isProcessed(element)) {
    return;
  }

  // Restore hidden element
  if (element.classList.contains(HIDDEN_CLASS)) {
    element.classList.remove(HIDDEN_CLASS);
    const originalDisplay = element.dataset.shortshieldOriginalDisplay;
    if (originalDisplay) {
      element.style.display = originalDisplay;
      delete element.dataset.shortshieldOriginalDisplay;
    } else {
      element.style.display = '';
    }
  }

  // Restore blurred element
  if (element.classList.contains(BLUR_CLASS)) {
    element.classList.remove(BLUR_CLASS);
    const originalFilter = element.dataset.shortshieldOriginalFilter;
    const originalPointerEvents = element.dataset.shortshieldOriginalPointerEvents;

    element.style.filter = originalFilter ?? '';
    element.style.pointerEvents = originalPointerEvents ?? '';

    delete element.dataset.shortshieldOriginalFilter;
    delete element.dataset.shortshieldOriginalPointerEvents;
  }

  // Remove processed marker
  element.removeAttribute(PROCESSED_ATTR);

  logger.debug('Element restored');
}

/**
 * Apply action to an element
 */
export function applyAction(
  element: HTMLElement,
  action: 'hide' | 'blur' | 'remove'
): void {
  switch (action) {
    case 'hide':
      hideElement(element);
      break;
    case 'blur':
      blurElement(element);
      break;
    case 'remove':
      removeElement(element);
      break;
    default:
      hideElement(element);
  }
}

/**
 * Get all hidden elements on the page
 */
export function getHiddenElements(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(`[${PROCESSED_ATTR}="true"]`)
  );
}

/**
 * Restore all hidden elements
 */
export function restoreAllElements(): void {
  const elements = getHiddenElements();
  for (const element of elements) {
    restoreElement(element);
  }
  logger.info('All elements restored', { count: elements.length });
}

/**
 * Get count of hidden elements
 */
export function getHiddenCount(): number {
  return document.querySelectorAll(`[${PROCESSED_ATTR}="true"]`).length;
}
