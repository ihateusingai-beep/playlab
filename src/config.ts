/**
 * Platform-wide constants. Edit here to rebrand the platform.
 * Default name is "PlayLab".
 */
export const PLATFORM_NAME = 'PlayLab';

/**
 * Supported languages. Add a new entry here and create matching
 * dictionaries under src/i18n/ to enable a third locale.
 */
export const SUPPORTED_LANGUAGES = ['en', 'zh'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

/** Timezone used for academic year boundary. */
export const ACADEMIC_YEAR_TIMEZONE = 'Asia/Hong_Kong';

/** Leaderboard default visible rows. */
export const LEADERBOARD_TOP_N = 10;

/** Profile pagination. */
export const PROFILE_PAGE_SIZE = 10;

/** localStorage keys. Keep namespaced. */
export const STORAGE_KEYS = {
  lang: 'playlab-lang',
  scores: 'playlab-scores',
} as const;
