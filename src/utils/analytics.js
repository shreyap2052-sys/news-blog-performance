/**
 * Analytics logging utility
 */

export const EXACT_ANALYTICS_MESSAGE = '[Analytics] User interacted with Performance Optimization'

/**
 * Logs user interaction with Performance Optimization upon successful primary actions.
 */
export function logAnalyticsInteraction() {
  console.log(EXACT_ANALYTICS_MESSAGE)
}
