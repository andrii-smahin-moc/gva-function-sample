import * as v from 'valibot';

export const BaseEnvironmentSchema = v.object({
  ASK_NUMBER_GOAL: v.string(),
  CALL_RETRIES: v.optional(v.string()),
  DD_API_KEY: v.string(),
  FDMS_VERSION: v.string(),
  GLIA_AI_MAX_TOKENS: v.string(),
  GLIA_AI_STOP_SEQUENCES: v.string(),
  GLIA_AI_TEMPERATURE: v.string(),
  GLIA_API_DOMAIN: v.string(),
  GLIA_USER_API_KEY: v.string(),
  GLIA_USER_API_KEY_SECRET: v.string(),
  IS_DEV_MOD: v.optional(v.string()),
  PROMPT_DETECT_CONFIDENCE: v.string(),
  PROMPT_OPTION_DETECTOR: v.string(),
  RE_ASK_NUMBER_GOAL: v.string(),
  REQUEST_TIMEOUT: v.optional(v.string()),
  RETRY_DELAY: v.optional(v.string()),
  SITE_ID: v.string(),
  VALID_NUMBER_GOAL: v.string(),
});
