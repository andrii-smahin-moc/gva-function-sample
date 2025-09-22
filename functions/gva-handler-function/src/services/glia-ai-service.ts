import { aiClient } from 'ai';

import { FunctionConfig } from '../types';

export class GliaAIService {
  private aiClient: aiClient;

  constructor(private config: FunctionConfig) {
    this.aiClient = aiClient.initialize('glia.micro.v1');
  }

  async invokeModel(text: string) {
    const invokeConfiguration = {
      messages: [
        {
          content: [{ text }],
          role: 'user' as const,
        },
      ],
      options: {
        max_tokens: this.config.gliaAI.maxTokens,
        stop_sequences: this.config.gliaAI.stopSequences,
        temperature: this.config.gliaAI.temperature,
      },
    };

    const resultValue = await this.aiClient.invokeModel(invokeConfiguration);
    let resultContent = '';
    resultValue.message.content.forEach((aContent) => (resultContent += aContent.text));
    return resultContent;
  }
}
