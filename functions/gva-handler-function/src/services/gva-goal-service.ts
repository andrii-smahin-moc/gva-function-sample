import { FunctionConfig, HandlerPayload, HandlerResult, LoggerInterface } from '../types';

import { AnswerDetectorService } from './answer-detector-service';
import { BaseGVAGoalService } from './base-gva-goal-service';
import { AnswerOption } from './possible-answer';

export enum GVAGoalSteps {
  ASK_NUMBER = 'ask_number',
  VALIDATE_NUMBER = 'validate_number',
}

export const AnswerOptionsList = {
  CANCEL: 'cancel',
  CONFIRM: 'confirm',
  NUMBER: 'number',
};

export class GVAGoalService extends BaseGVAGoalService {
  private answerDetectorService: AnswerDetectorService;
  constructor(
    private config: FunctionConfig,
    private logger: LoggerInterface,
  ) {
    super();
    this.register('default', this.handleAskNumberStep.bind(this));
    this.register(GVAGoalSteps.ASK_NUMBER, this.handleAskNumberStep.bind(this));
    this.register(GVAGoalSteps.VALIDATE_NUMBER, this.handleValidateNumberStep.bind(this));

    this.answerDetectorService = new AnswerDetectorService(this.config, this.logger, [
      new AnswerOption(AnswerOptionsList.CANCEL, ['To Cancel', 'cancel', 'stop', 'abort']),
      new AnswerOption(AnswerOptionsList.CONFIRM, ['To continue', 'Confirm', 'yes', 'ok']),
      new AnswerOption(AnswerOptionsList.NUMBER, [/\b\d+\b/]),
    ]);
  }

  async handleAskNumberStep(context: HandlerPayload): Promise<HandlerResult> {
    await this.logger.info(`EngagementId: ${context.engagementId}, Asking user for a number`);
    return this.buildHandlerResultPayload({
      customJourneyContext: { STEP: GVAGoalSteps.VALIDATE_NUMBER },
      responseId: this.config.gvaGoals.askNumberGoalId,
    });
  }

  async handleValidateNumberStep(context: HandlerPayload): Promise<HandlerResult> {
    await this.logger.info(`EngagementId: ${context.engagementId}, Validating number input from user`);

    const detectedAnswer = await this.answerDetectorService.detect(context);

    if (detectedAnswer && detectedAnswer.name === AnswerOptionsList.NUMBER) {
      await this.logger.info(`EngagementId: ${context.engagementId}, Valid number received: ${detectedAnswer.matchedText}`);
      return this.buildHandlerResultPayload({
        customJourneyContext: { STEP: null },
        isFinalStep: true,
        responseData: { number: detectedAnswer.matchedText },
        responseId: this.config.gvaGoals.validNumberGoalId,
      });
    }

    await this.logger.info(`EngagementId: ${context.engagementId}, Invalid input received, re-asking for number`);
    return this.buildHandlerResultPayload({
      customJourneyContext: { STEP: GVAGoalSteps.VALIDATE_NUMBER },
      responseId: this.config.gvaGoals.reAskNumberGoalId,
    });
  }
}
