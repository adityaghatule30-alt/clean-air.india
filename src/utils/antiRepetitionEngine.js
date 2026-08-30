// CleanAir India - Smart Anti-Repetition & Weighted Humor Rotation Engine

const STORAGE_KEY = 'cleanair_joke_history_v2';
const HISTORY_LIMIT = 45; // Avoid repeating jokes within the last 45 picks

class AntiRepetitionEngine {
  constructor() {
    this.history = this.loadHistory();
    this.categoryHistory = {}; // in-memory category tracker
    this.categoryTurnCounter = 0;
  }

  loadHistory() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed.slice(-HISTORY_LIMIT);
        }
      }
    } catch (e) {
      // ignore storage errors
    }
    return [];
  }

  saveHistory() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.history.slice(-HISTORY_LIMIT)));
      }
    } catch (e) {}
  }

  recordUsed(id) {
    if (!id) return;
    this.history.push(id);
    if (this.history.length > HISTORY_LIMIT) {
      this.history.shift();
    }
    this.saveHistory();
  }

  /**
   * Pick an item from a pool using weighted randomness and anti-repetition memory.
   * @param {Array} pool Array of items (either strings or objects with { id, text, weight, rarity })
   * @param {string} categoryKey Identifier for the category (e.g. 'heat_extreme', 'delhi_banter')
   * @returns {string|object} The selected item
   */
  pick(pool, categoryKey = 'general') {
    if (!pool || pool.length === 0) return '';
    if (pool.length === 1) return typeof pool[0] === 'object' ? pool[0].text || pool[0] : pool[0];

    // Normalize pool items
    const normalized = pool.map((item, idx) => {
      if (typeof item === 'string') {
        return {
          id: `${categoryKey}_${idx}_${item.slice(0, 16).replace(/\s+/g, '_')}`,
          text: item,
          weight: 10,
          rarity: 'common'
        };
      }
      return {
        id: item.id || `${categoryKey}_${idx}_${(item.text || '').slice(0, 16)}`,
        text: item.text || item,
        weight: item.weight || (item.rarity === 'legendary' ? 2 : item.rarity === 'rare' ? 5 : item.rarity === 'uncommon' ? 10 : 15),
        rarity: item.rarity || 'common',
        ...item
      };
    });

    // 1. Filter out recently used items
    let eligible = normalized.filter(item => !this.history.includes(item.id));

    // 2. If eligible pool is empty, prune category while preserving last picked item to prevent consecutive repeats
    if (eligible.length === 0) {
      const lastId = this.history[this.history.length - 1];
      const categoryIds = new Set(normalized.map(i => i.id));
      this.history = this.history.filter(id => !categoryIds.has(id));
      eligible = normalized.filter(i => i.id !== lastId);
      if (eligible.length === 0) eligible = normalized;
    }

    // 3. Weighted Random Selection
    const totalWeight = eligible.reduce((sum, item) => sum + item.weight, 0);
    let randomVal = Math.random() * totalWeight;
    let selected = eligible[0];

    for (const item of eligible) {
      randomVal -= item.weight;
      if (randomVal <= 0) {
        selected = item;
        break;
      }
    }

    // 4. Record chosen ID in history
    this.recordUsed(selected.id);

    return selected.text !== undefined ? selected.text : selected;
  }

  /**
   * Decide which atmospheric dimension to roast next (temperature, aqi, humidity, wind, combo, location)
   */
  rotateCategory(availableCategories) {
    if (!availableCategories || availableCategories.length === 0) return 'general';
    this.categoryTurnCounter++;
    const idx = this.categoryTurnCounter % availableCategories.length;
    return availableCategories[idx];
  }

  /**
   * Reset session history (for debugging/testing)
   */
  resetHistory() {
    this.history = [];
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {}
  }

  /**
   * Get Debug / Developer Stats
   */
  getDebugStats() {
    return {
      historyCount: this.history.length,
      historyLimit: HISTORY_LIMIT,
      recentIds: [...this.history]
    };
  }
}

export const antiRepetition = new AntiRepetitionEngine();
