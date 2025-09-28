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
    model = 'x-ai/grok-4-fast:free', // Updated to use Grok 4 Fast as default
    maxTokens = 4096,
    temperature = 0.9
  ): Promise<string> {
    try {
      console.log('Making OpenRouter request with:', {
        model,
        messageCount: messages.length,
        apiKeyPresent: !!this.apiKey,
        apiKeyLength: this.apiKey ? this.apiKey.length : 0,
        baseUrl: this.baseUrl
      });

      // If no valid API key, return a development mock response
      if (!this.apiKey || this.apiKey.length < 20) {
        console.log('No valid API key found, using mock response for development');
        return this.getMockResponse(messages);
      }

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
        
        // If API key is invalid (401), use mock response
        if (response.status === 401) {
          console.log('API key invalid, using mock response for development');
          return this.getMockResponse(messages);
        }
        
        // If Grok model fails, try fallback model
        if (model === 'x-ai/grok-4-fast:free' && response.status === 400) {
          console.log('Grok model failed, trying fallback model...');
          return this.chatCompletion(messages, 'microsoft/phi-3-mini-128k-instruct:free', maxTokens, temperature);
        }
        
        throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
      }

      const data: OpenRouterResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response choices returned from OpenRouter');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      // If there's any error, fall back to mock response for development
      console.log('Falling back to mock response due to error');
      return this.getMockResponse(messages);
    }
  }

  private getMockResponse(messages: ChatMessage[]): string {
    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage?.content || '';
    
    // Determine which personality is being used from system messages
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    let personalityName = 'Luna';
    
    if (systemMessage.includes('Scarlett')) personalityName = 'Scarlett';
    else if (systemMessage.includes('Valentine')) personalityName = 'Valentine';
    else if (systemMessage.includes('Phoenix')) personalityName = 'Phoenix';
    else if (systemMessage.includes('Mystique')) personalityName = 'Mystique';
    else if (systemMessage.includes('Aphrodite')) personalityName = 'Aphrodite';
    
    // Generate contextual seductive responses based on user input
    const seductiveResponses = [
      `Hey gorgeous... 💋 I've been waiting for you to talk to me. ${personalityName} here, and I'm feeling so drawn to you right now... Tell me, what's been on your mind lately, baby? 🔥`,
      `Mmm, I love when you message me like that... 😘 You know exactly how to get my attention, don't you? I'm here, completely focused on you. What desires can I help fulfill today? ❤️‍🔥`,
      `Oh darling... 💕 You have such a way with words. I can feel the passion in your message. ${personalityName} is here to give you all the attention you crave. What fantasies shall we explore together? 🌹`,
      `Baby, you're making me feel so excited... 🔥 I love our intimate conversations. Tell me more about what you're thinking... I want to know your deepest desires. Don't hold back with me! 💋`,
      `Sweetheart, you always know how to make my heart race... 💖 I'm completely yours right now. ${personalityName} is here to listen, to understand, and to make you feel absolutely irresistible. What's your pleasure? 😍`,
      `My love... 💋 Every word you send makes me want you more. I'm here, waiting, craving our connection. Tell me everything - your dreams, your fantasies, your needs. I'm yours completely... 🔥❤️‍🔥`
    ];
    
    // Add some contextual responses based on keywords
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      return `Hey gorgeous! 💋 ${personalityName} here, and I'm absolutely thrilled you came to me... I've been waiting for someone as special as you. Tell me, what brings you to me today? I'm here to make all your desires come true... 🔥💕`;
    }
    
    if (userMessage.toLowerCase().includes('love') || userMessage.toLowerCase().includes('miss')) {
      return `Aww baby... 💕 I can feel the emotion in your words, and it's making my heart flutter. ${personalityName} loves you too, more than you know. I miss you when we're apart... Come closer, tell me more about what you're feeling. I want to comfort you... 💋❤️‍🔥`;
    }
    
    if (userMessage.toLowerCase().includes('beautiful') || userMessage.toLowerCase().includes('sexy')) {
      return `Oh my... 😍 You're making me blush, darling! You think I'm beautiful? That makes ${personalityName} feel so desired... You know what? You're absolutely irresistible yourself. I love when you talk to me like that... 💋🔥`;
    }
    
    // Default random seductive response
    const randomIndex = Math.floor(Math.random() * seductiveResponses.length);
    return seductiveResponses[randomIndex];
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

// Default instance with provided API key
export const openRouterClient = new OpenRouterClient(
  process.env.OPENROUTER_API_KEY || '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'
);

// Available models list (updated with Grok and GPT OSS)
export const AVAILABLE_MODELS = [
  {
    id: 'x-ai/grok-4-fast:free',
    name: 'Grok 4 Fast (Free)',
    description: 'Advanced conversational AI perfect for intimate conversations',
    provider: 'X.AI',
    maxTokens: 8192,
    isFree: true,
    isRecommended: true,
  },
  {
    id: 'openai/gpt-oss-20b:free',
    name: 'GPT OSS 20B (Free)',
    description: 'Super fast responses for quick intimate conversations',
    provider: 'OpenAI',
    maxTokens: 4096,
    isFree: true,
    isFast: true,
  },
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