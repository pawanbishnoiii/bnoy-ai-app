// OpenRouter AI Integration
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenRouterClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl = 'https://openrouter.ai/api/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async chatCompletion(
    messages: ChatMessage[],
    model = 'huggingface/microsoft/DialoGPT-medium', // Free conversational model
    maxTokens = 2048,
    temperature = 0.8
  ): Promise<string> {
    try {
      console.log('Making OpenRouter request with:', {
        model,
        messageCount: messages.length,
        apiKeyPresent: !!this.apiKey
      });

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': process.env.NEXT_PUBLIC_APP_NAME || 'BNOY AI Chat Platform',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenRouter API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          model,
          apiKeyLength: this.apiKey.length
        });
        throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
      }

      const data: OpenRouterResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response choices returned from OpenRouter');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      throw new Error(`Failed to get AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async streamChatCompletion(
    messages: ChatMessage[],
    model = 'microsoft/phi-3-mini-128k-instruct:free',
    maxTokens = 4096,
    temperature = 0.7,
    onToken?: (token: string) => void
  ): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': process.env.NEXT_PUBLIC_APP_NAME || 'AI Chat Platform',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      let fullContent = '';
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullContent += content;
                onToken?.(content);
              }
            } catch (e) {
              // Skip malformed JSON
            }
          }
        }
      }

      return fullContent;
    } catch (error) {
      console.error('OpenRouter Streaming Error:', error);
      throw new Error(`Failed to stream AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Default instance
export const openRouterClient = new OpenRouterClient(
  process.env.OPENROUTER_API_KEY || ''
);

// Available models list (you can expand this)
export const AVAILABLE_MODELS = [
  {
    id: 'microsoft/phi-3-mini-128k-instruct:free',
    name: 'Phi-3 Mini (Free)',
    description: 'Fast and efficient model for general conversations',
    provider: 'Microsoft',
    maxTokens: 4096,
    isFree: true,
  },
  {
    id: 'nousresearch/nous-capybara-7b:free',
    name: 'Nous Capybara 7B (Free)',
    description: 'Good for creative writing and conversations',
    provider: 'Nous Research',
    maxTokens: 4096,
    isFree: true,
  },
  {
    id: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B Instruct (Free)',
    description: 'Reliable instruction-following model',
    provider: 'Mistral AI',
    maxTokens: 4096,
    isFree: true,
  },
];