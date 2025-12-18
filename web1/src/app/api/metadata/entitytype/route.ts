import { EntityTypeRepository } from '@/repositiories/entity-type.repository';

const repository = new EntityTypeRepository();

export async function GET() {
  try {
    const entityTypes = await repository.getEntityTypes();
    return Response.json(entityTypes || []);
  } catch (error) {
    console.error('Error fetching entity types:', error);
    return Response.json(
      { error: 'Failed to fetch entity types' },
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

    const entityType = await repository.createEntityType({
      name: body.name,
      emoji: body.emoji,
      description: body.description,
    });

    return Response.json(entityType, { status: 201 });
  } catch (error: any) {
    console.error('Error creating entity type:', error);

    if (error.code === '23505') {
      return Response.json(
        { error: 'Entity type name already exists' },
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

    const entityType = await repository.updateEntityType(body.id, {
      name: body.name,
      emoji: body.emoji,
      description: body.description,
    });

    if (!entityType) {
      return Response.json(
        { error: 'Entity type not found' },
        { status: 404 }
      );
    }

    return Response.json(entityType);
  } catch (error: any) {
    console.error('Error updating entity type:', error);

    if (error.code === '23505') {
      return Response.json(
        { error: 'Entity type name already exists' },
        { status: 409 }
      );
    }

    return Response.json(
      { error: 'Failed to update entity type' },
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

    const existing = await repository.getEntityTypeById(Number(id));
    if (!existing) {
      return Response.json(
        { error: 'Entity type not found' },
        { status: 404 }
      );
    }

    await repository.deleteEntityType(Number(id));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting entity type:', error);
    return Response.json(
      { error: 'Failed to delete entity type' },
      { status: 500 }
    );
  }
}
