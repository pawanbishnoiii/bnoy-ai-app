// Test free models without API key to see what's available
async function testFreeModels() {
  const freeModels = [
    'huggingface/microsoft/DialoGPT-medium',
    'microsoft/phi-3-mini-128k-instruct:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'google/gemma-2-9b-it:free',
    'nousresearch/nous-capybara-7b:free'
  ];

  for (const model of freeModels) {
    try {
      console.log(`\nTesting model: ${model}`);
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'BNOY AI Test',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: 'Hello'
            }
          ],
          max_tokens: 50,
          temperature: 0.7,
        }),
      });

      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`SUCCESS! Response: ${data.choices[0].message.content}`);
        break; // Found a working model
      } else {
        const error = await response.text();
        console.log(`Error: ${error}`);
      }
    } catch (error) {
      console.log(`Network error: ${error.message}`);
    }
  }
}

testFreeModels();