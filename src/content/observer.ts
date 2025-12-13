/**
 * MutationObserver manager
 * Efficiently observes DOM changes for content detection
 */

import type { BasePlatformDetector } from './platforms/base';
import { PERFORMANCE } from '@/shared/constants';
import { createLogger } from '@/shared/utils/logger';

const logger = createLogger('observer');

/**
 * Observer state
 */
interface ObserverState {
  observer: MutationObserver | null;
  pendingMutations: MutationRecord[];
  processingTimeout: number | null;
  detector: BasePlatformDetector;
  isProcessing: boolean;
}

/**
 * Create a managed mutation observer
 */
export function createManagedObserver(
  detector: BasePlatformDetector
): {
  observe: (target: HTMLElement, options?: MutationObserverInit) => void;
  disconnect: () => void;
  process: () => void;
} {
  const state: ObserverState = {
    observer: null,
    pendingMutations: [],
    processingTimeout: null,
    detector,
    isProcessing: false,
  };

  /**
   * Process pending mutations
   */
  function processMutations(): void {
    if (state.isProcessing || state.pendingMutations.length === 0) {
      return;
    }

    state.isProcessing = true;

    try {
      // Get batch of mutations to process
      const batch = state.pendingMutations.splice(
        0,
        PERFORMANCE.MAX_MUTATIONS_PER_BATCH
      );

      // Collect unique added nodes
      const addedNodes = new Set<HTMLElement>();

      for (const mutation of batch) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node instanceof HTMLElement) {
              addedNodes.add(node);
            }
          }
        }
      }

      // Scan each added node
      for (const node of addedNodes) {
        try {
          state.detector.scan(node);
        } catch (error) {
          logger.warn('Error scanning node', { error: String(error) });
        }
      }

      // Schedule next batch if there are more pending
      if (state.pendingMutations.length > 0) {
        state.processingTimeout = window.setTimeout(
          processMutations,
          PERFORMANCE.MUTATION_DEBOUNCE_MS
        );
      }
    } finally {
      state.isProcessing = false;
    }
  }

  /**
   * Handle incoming mutations
   */
  function handleMutations(mutations: MutationRecord[]): void {
    // Add to pending queue
    state.pendingMutations.push(...mutations);

    // Debounce processing
    if (state.processingTimeout === null && !state.isProcessing) {
      state.processingTimeout = window.setTimeout(() => {
        state.processingTimeout = null;
        processMutations();
      }, PERFORMANCE.MUTATION_DEBOUNCE_MS);
    }
  }

  /**
   * Start observing a target element
   */
  function observe(
    target: HTMLElement,
    options: MutationObserverInit = {
      childList: true,
      subtree: true,
    }
  ): void {
    // Create observer if needed
    if (!state.observer) {
      state.observer = new MutationObserver(handleMutations);
    }

    // Start observing
    state.observer.observe(target, options);
    logger.debug('Started observing', { target: target.tagName });
  }

  /**
   * Stop observing and cleanup
   */
  function disconnect(): void {
    // Stop observer
    if (state.observer) {
      state.observer.disconnect();
      state.observer = null;
    }

    // Clear pending timeout
    if (state.processingTimeout !== null) {
      window.clearTimeout(state.processingTimeout);
      state.processingTimeout = null;
    }

    // Clear pending mutations
    state.pendingMutations = [];
    state.isProcessing = false;

    logger.debug('Observer disconnected');
  }

  /**
   * Force process any pending mutations
   */
  function process(): void {
    if (state.processingTimeout !== null) {
      window.clearTimeout(state.processingTimeout);
      state.processingTimeout = null;
    }
    processMutations();
  }

  return {
    observe,
    disconnect,
    process,
  };
}
