import { NextRequest, NextResponse } from 'next/server';

// Simple GET handler for /api/entities/[id]/edit
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Example: fetch entity by id (replace with real data source)
    const entity = { id, name: `Entity ${id}` };

    return NextResponse.json(entity);
}

// Simple POST handler for updating entity
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await request.json();

    // Example: pretend to update entity (replace with real update logic)
    const updatedEntity = { id, ...data };

    return NextResponse.json(updatedEntity);
}