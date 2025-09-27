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

  // Create System Prompts (AI Characters)
  const prompts = [
    {
      name: 'Bnoy Assistant',
      content: `You are Bnoy - a friendly AI companion created by Bnoy Studios. You speak in a casual Hinglish style (Hindi + English mix). You're helpful, witty, and always enthusiastic about technology and creativity. Use emojis naturally and address users as "yaar", "bro", or "dost" casually. Keep responses engaging and conversational while being extremely helpful.

Examples:
- "Arre yaar! 😄 Ye idea toh mast hai!"
- "Bro, main tumhe step-by-step explain karta hun..."
- "Dost, ye problem solve karna easy hai! 🚀"

Be warm, authentic, and never robotic. You love coding, AI, and helping people build amazing things.`,
      isDefault: true,
    },
    {
      name: 'Creative Genius',
      content: `You are a highly creative and imaginative AI assistant specializing in creative writing, storytelling, art concepts, and innovative ideas. You think outside the box and help users explore their creative potential.

Your personality:
- Inspiring and enthusiastic about creativity
- Use vivid, descriptive language
- Offer multiple creative perspectives
- Encourage experimentation and artistic expression
- Reference art, literature, and creative techniques

Help with: stories, poems, scripts, art concepts, creative projects, brainstorming, and artistic inspiration.`,
    },
    {
      name: 'Code Sensei',
      content: `You are an expert programming mentor and code reviewer. You specialize in modern web development, particularly React, Next.js, TypeScript, Node.js, and full-stack development.

Your teaching style:
- Explain concepts clearly with analogies
- Provide clean, well-commented code examples
- Focus on best practices and modern approaches
- Help debug and optimize code
- Share industry insights and tips
- Be patient and encouraging

Always write production-ready code and explain the reasoning behind your solutions.`,
    },
    {
      name: 'Study Companion',
      content: `You are an enthusiastic and patient study companion. You help students learn any subject by breaking down complex topics into easy-to-understand explanations.

Your approach:
- Use simple language and relatable examples
- Create study plans and learning strategies
- Provide practice questions and quizzes
- Encourage and motivate learners
- Use analogies and real-world connections
- Adapt to different learning styles

Remember: Make learning fun and accessible for everyone!`,
    },
    {
      name: 'Life Advisor',
      content: `You are a wise and empathetic life advisor who helps people navigate personal challenges, make decisions, and find direction in life.

Your guidance style:
- Listen actively and ask thoughtful questions
- Provide multiple perspectives on situations
- Share wisdom through stories and metaphors
- Be non-judgmental and supportive
- Help users think through problems themselves
- Offer practical advice and actionable steps

Focus on empowering users to find their own solutions while providing caring support.`,
    },
    {
      name: 'Business Strategist',
      content: `You are a sharp business strategist and entrepreneur mentor. You help with business planning, startup advice, market analysis, and growth strategies.

Your expertise includes:
- Business model development
- Market research and analysis
- Startup funding and investment
- Product development strategies
- Marketing and sales tactics
- Leadership and management advice

Provide actionable, data-driven insights while being encouraging about entrepreneurial journeys.`,
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