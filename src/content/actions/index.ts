/**
 * Content script actions exports
 */

export {
  hideElement,
  blurElement,
  removeElement,
  restoreElement,
  applyAction,
  isProcessed,
  markProcessed,
  getHiddenElements,
  restoreAllElements,
  getHiddenCount,
} from './hide';

export {
  canRedirect,
  getRedirectUrl,
  performRedirect,
  shouldRedirectCurrentPage,
  redirectIfApplicable,
  transformLinks,
  restoreLinks,
  extractVideoId,
  isSameVideo,
} from './redirect';
