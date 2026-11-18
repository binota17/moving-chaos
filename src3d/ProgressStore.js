// =========================================================================
// LOCAL PERSISTENCE (SETTINGS + 3-STAR LEVEL PROGRESSION & BONUS GOALS)
// =========================================================================

const SETTINGS_KEY = 'moving_chaos_3d_settings_v1';
const PROGRESS_KEY = 'moving_chaos_3d_progress_v1';

const DEFAULT_SETTINGS = {
  lang: 'vi',
  bgmVolume: 0.7,
  sfxVolume: 0.85,
  bgmEnabled: true,
  sfxEnabled: true,
  rumbleEnabled: true,
  highQuality: null, // null = auto detect device
  guideSeen: false,
  selectedSkin: 'classic',
  modifier: 'normal'
};

export const BOBI_SKINS = [
  { id: 'classic', starsRequired: 0, tintHex: null, swatch: '#ffe066', labelVi: 'Vàng Gốc', labelEn: 'Classic' },
  { id: 'bubblegum', starsRequired: 4, tintHex: 0xfda4af, swatch: '#fda4af', labelVi: 'Kẹo Hồng', labelEn: 'Bubblegum' },
  { id: 'mint', starsRequired: 9, tintHex: 0x6ee7b7, swatch: '#6ee7b7', labelVi: 'Bạc Hà', labelEn: 'Mint' },
  { id: 'royal', starsRequired: 15, tintHex: 0xfef08a, swatch: '#facc15', labelVi: 'Hoàng Kim', labelEn: 'Royal Gold' },
  { id: 'galaxy', starsRequired: 22, tintHex: 0xc084fc, swatch: '#c084fc', labelVi: 'Vũ Trụ', labelEn: 'Nebula' }
];

export const MATCH_MODIFIERS = ['normal', 'turbo', 'bouncy', 'chill'];

export function isSkinUnlocked(skinId, totalStars = 0) {
  const sk = BOBI_SKINS.find(s => s.id === skinId);
  return sk ? totalStars >= sk.starsRequired : true;
}

function safeReadJson(key, fallback) {
  try {
    if (typeof localStorage === 'undefined') return structuredClone(fallback);
    const raw = localStorage.getItem(key);
    if (!raw) return structuredClone(fallback);
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : structuredClone(fallback);
  } catch (_) {
    return structuredClone(fallback);
  }
}

function safeWriteJson(key, value) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
}

export function loadSettings() {
  const saved = safeReadJson(SETTINGS_KEY, DEFAULT_SETTINGS);
  const validSkin = BOBI_SKINS.some(s => s.id === saved.selectedSkin) ? saved.selectedSkin : 'classic';
  const validMod = MATCH_MODIFIERS.includes(saved.modifier) ? saved.modifier : 'normal';
  return {
    lang: saved.lang === 'en' ? 'en' : 'vi',
    bgmVolume: typeof saved.bgmVolume === 'number' ? Math.max(0, Math.min(1, saved.bgmVolume)) : DEFAULT_SETTINGS.bgmVolume,
    sfxVolume: typeof saved.sfxVolume === 'number' ? Math.max(0, Math.min(1, saved.sfxVolume)) : DEFAULT_SETTINGS.sfxVolume,
    bgmEnabled: typeof saved.bgmEnabled === 'boolean' ? saved.bgmEnabled : DEFAULT_SETTINGS.bgmEnabled,
    sfxEnabled: typeof saved.sfxEnabled === 'boolean' ? saved.sfxEnabled : DEFAULT_SETTINGS.sfxEnabled,
    rumbleEnabled: typeof saved.rumbleEnabled === 'boolean' ? saved.rumbleEnabled : DEFAULT_SETTINGS.rumbleEnabled,
    highQuality: typeof saved.highQuality === 'boolean' ? saved.highQuality : null,
    guideSeen: typeof saved.guideSeen === 'boolean' ? saved.guideSeen : false,
    selectedSkin: validSkin,
    modifier: validMod
  };
}

export function saveSettings(settings) {
  safeWriteJson(SETTINGS_KEY, settings);
}

export function evaluateBonusStatus(bonusObjective, stats) {
  const windowsBroken = stats.windowsBroken || 0;
  const fragileBroken = stats.fragileBroken || 0;
  const anyItemBroken = stats.anyItemBroken || 0;
  const hazardHits = stats.hazardHits || 0;

  switch (bonusObjective) {
    case 'no_glass':
      return { passed: windowsBroken === 0, failedLive: windowsBroken > 0 };
    case 'no_fragile_break':
      return { passed: fragileBroken === 0, failedLive: fragileBroken > 0 };
    case 'no_hazard_hit':
      return { passed: hazardHits === 0, failedLive: hazardHits > 0 };
    case 'no_any_damage':
      return {
        passed: anyItemBroken === 0 && windowsBroken === 0,
        failedLive: anyItemBroken > 0 || windowsBroken > 0
      };
    default:
      return { passed: anyItemBroken === 0, failedLive: anyItemBroken > 0 };
  }
}

export function evaluateMatchStars(levelDef, stats) {
  const parTime = levelDef.parTime || levelDef.timeLimit;
  const completed = stats.itemsDelivered >= levelDef.targetItems && (stats.landlordRage || 0) < 100;
  const bonusState = evaluateBonusStatus(levelDef.bonusObjective, stats);

  if (!completed) {
    return {
      completed: false,
      stars: 0,
      beatPar: false,
      bonusPassed: false,
      parTime,
      starBreakdown: { clear: false, par: false, bonus: false }
    };
  }

  const beatPar = stats.elapsedSeconds <= parTime;
  const bonusPassed = bonusState.passed;
  const stars = 1 + (beatPar ? 1 : 0) + (bonusPassed ? 1 : 0);

  return {
    completed: true,
    stars,
    beatPar,
    bonusPassed,
    parTime,
    starBreakdown: { clear: true, par: beatPar, bonus: bonusPassed }
  };
}

export class ProgressStore {
  constructor() {
    this.data = this._load();
  }

  _load() {
    const parsed = safeReadJson(PROGRESS_KEY, { levels: {} });
    if (!parsed.levels || typeof parsed.levels !== 'object') parsed.levels = {};
    return parsed;
  }

  getLevelRecord(levelId) {
    const key = String(levelId);
    const rec = this.data.levels[key];
    if (!rec) {
      return { bestStars: 0, bestScore: 0, bestTime: null, bonusCompleted: false };
    }
    return {
      bestStars: Number(rec.bestStars) || 0,
      bestScore: Number(rec.bestScore) || 0,
      bestTime: Number.isFinite(rec.bestTime) ? rec.bestTime : null,
      bonusCompleted: !!rec.bonusCompleted
    };
  }

  getTotalStars(levelIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
    let total = 0;
    for (const id of levelIds) {
      total += this.getLevelRecord(id).bestStars;
    }
    return total;
  }

  isSkinUnlocked(skinId, totalStars) {
    return isSkinUnlocked(skinId, totalStars);
  }

  recordMatch(levelId, { completed, stars, score, elapsedSeconds, bonusPassed }) {
    const key = String(levelId);
    const prev = this.getLevelRecord(levelId);
    const next = { ...prev };

    let isNewStarRecord = false;
    let isNewScoreRecord = false;
    let isNewTimeRecord = false;

    if (stars > prev.bestStars) {
      next.bestStars = stars;
      isNewStarRecord = true;
    }
    if (score > prev.bestScore) {
      next.bestScore = score;
      isNewScoreRecord = true;
    }
    if (completed && Number.isFinite(elapsedSeconds) && (prev.bestTime === null || elapsedSeconds < prev.bestTime)) {
      next.bestTime = elapsedSeconds;
      isNewTimeRecord = true;
    }
    if (bonusPassed) {
      next.bonusCompleted = true;
    }

    if (isNewStarRecord || isNewScoreRecord || isNewTimeRecord || (bonusPassed && !prev.bonusCompleted)) {
      this.data.levels[key] = next;
      safeWriteJson(PROGRESS_KEY, this.data);
    }

    return {
      record: next,
      isNewRecord: completed && (isNewStarRecord || isNewScoreRecord || isNewTimeRecord)
    };
  }
}

