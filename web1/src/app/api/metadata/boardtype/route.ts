import { BoardTypeRepository } from '@/repositiories/board-type.repository';

const repository = new BoardTypeRepository();

export async function GET() {
  try {
    const boardTypes = await repository.getBoardTypes();
    return Response.json(boardTypes || []);
  } catch (error) {
    console.error('Error fetching board types:', error);
    return Response.json(
      { error: 'Failed to fetch board types' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name) {
      return Response.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const boardType = await repository.createBoardType({
      name: body.name,
    });

    return Response.json(boardType, { status: 201 });
  } catch (error: any) {
    console.error('Error creating board type:', error);

    if (error.code === '23505') {
      return Response.json(
        { error: 'Board type name already exists' },
        { status: 409 }
      );
    }

    return Response.json(
      { error: 'Failed to create entity type' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return Response.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const boardType = await repository.updateBoardType(body.id, {
      name: body.name,
      emoji: body.emoji,
      description: body.description,
    });

    if (!boardType) {
      return Response.json(
        { error: 'Board type not found' },
        { status: 404 }
      );
    }

    return Response.json(boardType);
  } catch (error: any) {
    console.error('Error updating board type:', error);

    if (error.code === '23505') {
      return Response.json(
        { error: 'Board type name already exists' },
        { status: 409 }
      );
    }

    return Response.json(
      { error: 'Failed to update board type' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }


    await repository.deleteBoardType(Number(id));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting board type:', error);
    return Response.json(
      { error: 'Failed to delete board type' },
      { status: 500 }
    );
  }
}
