import { NextRequest } from 'next/server';
import { openRouterClient, type ChatMessage } from '@/lib/ai/openrouter';
import { getChatWithMessages, addMessage } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, modelId } = body;

    if (!chatId) {
      return new Response('Chat ID is required', { status: 400 });
    }

    // Get chat history
    const chatWithMessages = await getChatWithMessages(chatId);
    if (!chatWithMessages) {
      return new Response('Chat not found', { status: 404 });
    }

    // Format messages for OpenRouter
    const chatMessages: ChatMessage[] = chatWithMessages.messages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    }));

    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = '';

        try {
          await openRouterClient.streamChatCompletion(
            chatMessages,
            modelId || 'microsoft/phi-3-mini-128k-instruct:free',
            4096,
            0.7,
            (token: string) => {
              fullResponse += token;
              // Send the token to the client
              controller.enqueue(
                new TextEncoder().encode(`data: ${JSON.stringify({ token })}\n\n`)
              );
            }
          );

          // Save the complete response to database
          if (fullResponse) {
            await addMessage(chatId, 'assistant', fullResponse, modelId);
          }

          // Send completion signal
          controller.enqueue(
            new TextEncoder().encode(`data: ${JSON.stringify({ done: true, fullResponse })}\n\n`)
          );
        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(
            new TextEncoder().encode(`data: ${JSON.stringify({ 
              error: 'Failed to stream response',
              details: error instanceof Error ? error.message : 'Unknown error'
            })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat Stream API Error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}