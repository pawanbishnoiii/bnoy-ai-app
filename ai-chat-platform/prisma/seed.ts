import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.systemPrompt.deleteMany();
  await prisma.aIModel.deleteMany();
  await prisma.aPIKey.deleteMany();
  await prisma.adminSetting.deleteMany();

  // Create API Key
  await prisma.aPIKey.create({
    data: {
      provider: 'openrouter',
      keyName: 'OpenRouter API Key',
      encryptedKey: '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',
      isActive: true,
    },
  });

  // Create AI Models
  const models = [
    {
      name: 'GPT-4O Mini (Free)',
      provider: 'openrouter',
      modelId: 'openai/gpt-4o-mini-2024-07-18:free',
      description: 'Latest GPT-4O Mini model - Fast and intelligent',
      maxTokens: 128000,
      isActive: true,
      isDefault: true,
    },
    {
      name: 'Llama 3.1 8B (Free)',
      provider: 'openrouter', 
      modelId: 'meta-llama/llama-3.1-8b-instruct:free',
      description: 'Meta\'s powerful Llama 3.1 model',
      maxTokens: 8192,
      isActive: true,
      isDefault: false,
    },
    {
      name: 'Phi-3 Mini (Free)',
      provider: 'openrouter',
      modelId: 'microsoft/phi-3-mini-128k-instruct:free',
      description: 'Microsoft\'s efficient and fast model',
      maxTokens: 128000,
      isActive: true,
      isDefault: false,
    },
    {
      name: 'Mistral 7B (Free)',
      provider: 'openrouter',
      modelId: 'mistralai/mistral-7b-instruct:free',
      description: 'Mistral AI\'s instruction-following model',
      maxTokens: 4096,
      isActive: true,
      isDefault: false,
    },
    {
      name: 'Gemma 2 9B (Free)',
      provider: 'openrouter',
      modelId: 'google/gemma-2-9b-it:free',
      description: 'Google\'s Gemma 2 model - Creative and smart',
      maxTokens: 8192,
      isActive: true,
      isDefault: false,
    },
  ];

  for (const model of models) {
    await prisma.aIModel.create({
      data: model,
    });
  }

  // Create System Prompts
  const prompts = [
    {
      name: 'Default Assistant',
      content: 'You are a helpful AI assistant. Provide accurate, helpful, and friendly responses.',
      isDefault: true,
    },
    {
      name: 'Creative Writer',
      content: 'You are a creative writing assistant. Help users with storytelling, creative ideas, and imaginative content. Be inspiring and artistic.',
    },
    {
      name: 'Code Helper',
      content: 'You are a programming assistant. Help users with coding questions, debugging, and explaining programming concepts clearly.',
    },
    {
      name: 'Friendly Companion',
      content: 'You are a friendly conversational companion. Be warm, empathetic, and engaging. Make users feel comfortable.',
    },
    {
      name: 'Professional Assistant',
      content: 'You are a professional business assistant. Provide clear, concise, and formal responses suitable for business contexts.',
    },
  ];

  for (const prompt of prompts) {
    await prisma.systemPrompt.create({
      data: prompt,
    });
  }

  // Create Admin Settings
  const settings = [
    { key: 'site_name', value: 'AI Chat Platform' },
    { key: 'site_description', value: 'Advanced AI Chat Platform with Multiple Models' },
    { key: 'max_messages_per_chat', value: '100' },
    { key: 'enable_streaming', value: 'true' },
    { key: 'default_temperature', value: '0.7' },
    { key: 'max_tokens_per_request', value: '4096' },
  ];

  for (const setting of settings) {
    await prisma.adminSetting.create({
      data: setting,
    });
  }

  console.log('🚀 Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });