import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, isAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { AVAILABLE_MODELS } from '@/lib/ai/openrouter';

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);

    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get all AI models from database
    const dbModels = await db.aIModel.findMany({
      include: {
        systemPrompts: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Merge with available models info
    const modelsWithInfo = dbModels.map(dbModel => {
      const availableModel = AVAILABLE_MODELS.find(m => m.id === dbModel.modelId);
      return {
        ...dbModel,
        availableModelInfo: availableModel,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        models: modelsWithInfo,
        availableModels: AVAILABLE_MODELS,
      },
    });
  } catch (error) {
    console.error('Admin Models API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);

    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, provider, modelId, description, maxTokens, isActive, isDefault } = body;

    if (!name || !provider || !modelId) {
      return NextResponse.json(
        { error: 'Name, provider, and modelId are required' },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await db.aIModel.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    // Create new model
    const newModel = await db.aIModel.create({
      data: {
        name,
        provider,
        modelId,
        description,
        maxTokens: maxTokens || 4096,
        isActive: isActive !== false,
        isDefault: isDefault === true,
      },
    });

    return NextResponse.json({
      success: true,
      data: newModel,
    });
  } catch (error) {
    console.error('Admin Create Model Error:', error);
    return NextResponse.json(
      { error: 'Failed to create model' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);

    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, name, provider, modelId, description, maxTokens, isActive, isDefault } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Model ID is required' },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await db.aIModel.updateMany({
        where: { isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    // Update model
    const updatedModel = await db.aIModel.update({
      where: { id },
      data: {
        name,
        provider,
        modelId,
        description,
        maxTokens,
        isActive,
        isDefault,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedModel,
    });
  } catch (error) {
    console.error('Admin Update Model Error:', error);
    return NextResponse.json(
      { error: 'Failed to update model' },
      { status: 500 }
    );
  }
}