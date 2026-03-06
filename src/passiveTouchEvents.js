/**
 * Apply passive event listener support before any library (e.g. Materialize) runs.
 * Eliminates Chrome violation: "Added non-passive event listener to a scroll-blocking 'touchmove' event."
 * Must be imported before @materializecss/materialize in index.jsx.
 */
import { passiveSupport } from 'passive-events-support/src/utils.js';

passiveSupport({
  events: ['touchstart', 'touchmove'],
});
