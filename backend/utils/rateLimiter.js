const lastRequestTimes = new Map();

/**
 * RATE LIMITER UTILITY
 * Ensures a 3-second window between replies per user to avoid WhatsApp API blocks.
 */
function isRateLimited(userId) {
  const now = Date.now();
  const LIMIT = 3000; // 3 seconds
  
  const lastTime = lastRequestTimes.get(userId);
  
  if (lastTime && (now - lastTime) < LIMIT) {
    return true;
  }
  
  lastRequestTimes.set(userId, now);
  return false;
}

module.exports = { isRateLimited };
