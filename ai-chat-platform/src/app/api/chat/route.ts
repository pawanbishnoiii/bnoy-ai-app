import { NextRequest, NextResponse } from 'next/server';
import { openRouterClient, type ChatMessage } from '@/lib/ai/openrouter';
import { db, addMessage, getChatWithMessages, createChat, createUser, getUserByUsername } from '@/lib/db';
import { extractTitleFromMessage } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, chatId, username, modelId } = body;

    if (!message || !username) {
      return NextResponse.json(
        { error: 'Message and username are required' },
        { status: 400 }
      );
    }

    // Get or create user
    let user = await getUserByUsername(username);
    if (!user) {
      user = await createUser(username);
    }

    // Get or create chat
    let currentChatId = chatId;
    if (!currentChatId) {
      const newChat = await createChat(user.id, extractTitleFromMessage(message));
      currentChatId = newChat.id;
    }

    // Add user message to database
    await addMessage(currentChatId, 'user', message);

    // Get chat history for context
    const chatWithMessages = await getChatWithMessages(currentChatId);
    if (!chatWithMessages) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    // Get system prompt (default or specified)
    const systemPrompt = await db.systemPrompt.findFirst({
      where: { isDefault: true },
    });

    // Format messages for OpenRouter
    const chatMessages: ChatMessage[] = [];
    
    // Add system prompt if available
    if (systemPrompt) {
      chatMessages.push({
        role: 'system',
        content: systemPrompt.content,
      });
    }
    
    // Add conversation history
    chatMessages.push(...chatWithMessages.messages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    })));

    // Get AI response
    const aiResponse = await openRouterClient.chatCompletion(
      chatMessages,
      modelId || 'microsoft/phi-3-mini-128k-instruct:free'
    );

    // Save AI response to database
    await addMessage(currentChatId, 'assistant', aiResponse, modelId);

    return NextResponse.json({
      success: true,
      data: {
        message: aiResponse,
        chatId: currentChatId,
        messageId: Date.now().toString(), // Simple ID for now
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');
    const username = searchParams.get('username');

    if (chatId) {
      // Get specific chat with messages
      const chat = await getChatWithMessages(chatId);
      if (!chat) {
        return NextResponse.json(
          { error: 'Chat not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: chat,
      });
    }

    if (username) {
      // Get user's chat history
      const user = await getUserByUsername(username);
      if (!user) {
        return NextResponse.json({
          success: true,
          data: { chats: [] },
        });
      }

      return NextResponse.json({
        success: true,
        data: { chats: user.chats },
      });
    }

    return NextResponse.json(
      { error: 'ChatId or username parameter required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Chat GET API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat data' },
      { status: 500 }
    );
  }
}