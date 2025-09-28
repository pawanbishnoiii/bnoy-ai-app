// Simple test script to verify OpenRouter API connection
const API_KEY = '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';

async function testOpenRouterAPI() {
  try {
    console.log('Testing OpenRouter API connection...');
    console.log('API Key length:', API_KEY.length);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'BNOY AI Test',
      },
      body: JSON.stringify({
        model: 'x-ai/grok-4-fast:free',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant. Respond briefly.'
          },
          {
            role: 'user',
            content: 'Hello, can you hear me?'
          }
        ],
        max_tokens: 100,
        temperature: 0.7,
        stream: false,
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      
      // Try fallback model
      console.log('\nTrying fallback model...');
      const fallbackResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'BNOY AI Test',
        },
        body: JSON.stringify({
          model: 'microsoft/phi-3-mini-128k-instruct:free',
          messages: [
            {
              role: 'user',
              content: 'Hello, can you hear me?'
            }
          ],
          max_tokens: 100,
          temperature: 0.7,
          stream: false,
        }),
      });
      
      console.log('Fallback response status:', fallbackResponse.status);
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        console.log('Fallback model SUCCESS:', fallbackData.choices[0].message.content);
      } else {
        const fallbackError = await fallbackResponse.text();
        console.error('Fallback model also failed:', fallbackError);
      }
      
      return;
    }

    const data = await response.json();
    console.log('SUCCESS! AI Response:', data.choices[0].message.content);
    console.log('Model used:', data.model);
    console.log('Tokens used:', data.usage);

  } catch (error) {
    console.error('Network/Connection Error:', error.message);
  }
}

testOpenRouterAPI();