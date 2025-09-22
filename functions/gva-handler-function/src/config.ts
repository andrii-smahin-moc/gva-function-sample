import { BaseEnvironmentSchema } from './schemas';
import { FunctionConfig, ValidationResult } from './types';
import { validateSchema } from './validator';

export function validateConfig(environment: Record<string, unknown>): ValidationResult<FunctionConfig> {
  const validationResult = validateSchema(BaseEnvironmentSchema, environment, 'Environment validation');

  if (!validationResult.status) {
    return validationResult;
  }

  return {
    output: {
      callRetries: Number(validationResult.output.CALL_RETRIES) || 3,
      dataDog: {
        callRetries: Number(validationResult.output.CALL_RETRIES) || 3,
        customer: 'gva-customer-name',
        ddApiKey: validationResult.output.DD_API_KEY,
        functionName: 'gva-sample-function',
        isDevMode: validationResult.output.IS_DEV_MOD === 'true',
        requestTimeout: Number(validationResult.output.REQUEST_TIMEOUT) || 5000,
        retryDelay: Number(validationResult.output.RETRY_DELAY) || 3000,
        siteId: validationResult.output.SITE_ID,
        version: validationResult.output.FDMS_VERSION,
      },
      glia: {
        apiDomain: validationResult.output.GLIA_API_DOMAIN,
        siteId: validationResult.output.SITE_ID,
        userApiKey: validationResult.output.GLIA_USER_API_KEY,
        userApiKeySecret: validationResult.output.GLIA_USER_API_KEY_SECRET,
      },
      gliaAI: {
        detectConfidence: Number(validationResult.output.PROMPT_DETECT_CONFIDENCE),
        detectOptionPrompt: validationResult.output.PROMPT_OPTION_DETECTOR,
        maxTokens: Number(validationResult.output.GLIA_AI_MAX_TOKENS),
        stopSequences: (() => {
          const raw = validationResult.output.GLIA_AI_STOP_SEQUENCES;
          if (!raw) {
            return [];
          }
          return raw
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        })(),
        temperature: Number(validationResult.output.GLIA_AI_TEMPERATURE),
      },
      gvaGoals: {
        askNumberGoalId: validationResult.output.ASK_NUMBER_GOAL,
        reAskNumberGoalId: validationResult.output.RE_ASK_NUMBER_GOAL,
        validNumberGoalId: validationResult.output.VALID_NUMBER_GOAL,
      },
      requestTimeout: Number(validationResult.output.REQUEST_TIMEOUT) || 5000,
      retryDelay: Number(validationResult.output.RETRY_DELAY) || 3000,
    },
    status: true,
  };
}
