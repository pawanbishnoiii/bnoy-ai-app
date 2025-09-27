import { PrismaClient } from '@prisma/client';

// Prevent multiple instances in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// Database utility functions
export async function createUser(username: string, email?: string) {
  return await db.user.create({
    data: {
      username,
      email,
    },
  });
}

export async function getUserByUsername(username: string) {
  return await db.user.findUnique({
    where: { username },
    include: {
      chats: {
        orderBy: { updatedAt: 'desc' },
        take: 10,
      },
    },
  });
}

export async function createChat(userId: string, title?: string) {
  return await db.chat.create({
    data: {
      userId,
      title: title || 'New Chat',
    },
  });
}

export async function getChatWithMessages(chatId: string) {
  return await db.chat.findUnique({
    where: { id: chatId },
    include: {
      messages: {
        orderBy: { timestamp: 'asc' },
      },
      user: true,
    },
  });
}

export async function addMessage(
  chatId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  modelUsed?: string
) {
  return await db.message.create({
    data: {
      chatId,
      role,
      content,
      modelUsed,
    },
  });
}

export async function getActiveAIModels() {
  return await db.aIModel.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });
}

export async function getAPIKey(provider: string) {
  return await db.aPIKey.findUnique({
    where: { provider },
  });
}

export async function getSystemPrompts(modelId?: string) {
  return await db.systemPrompt.findMany({
    where: modelId ? { modelId } : {},
    orderBy: { name: 'asc' },
  });
}

export async function updateChatTitle(chatId: string, title: string) {
  return await db.chat.update({
    where: { id: chatId },
    data: { title },
  });
}