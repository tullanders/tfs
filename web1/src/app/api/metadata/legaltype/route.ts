import { LegalTypeRepository } from '@/repositiories/legal-type.repository';

const repository = new LegalTypeRepository();

export async function GET() {
  try {
    const legalTypes = await repository.getLegalTypes();
    return Response.json(legalTypes || []);
  } catch (error) {
    console.error('Error fetching legal types:', error);
    return Response.json(
      { error: 'Failed to fetch legal types' },
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

    const legalType = await repository.createLegalType({
      name: body.name,
    });

    return Response.json(legalType, { status: 201 });
  } catch (error: any) {
    console.error('Error creating legal type:', error);

    if (error.code === '23505') {
      return Response.json(
        { error: 'Legal type name already exists' },
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

    const legalType = await repository.updateLegalType(body.id, {
      name: body.name
    });

    if (!legalType) {
      return Response.json(
        { error: 'Legal type not found' },
        { status: 404 }
      );
    }

    return Response.json(legalType);
  } catch (error: any) {
    console.error('Error updating legal type:', error);

    if (error.code === '23505') {
      return Response.json(
        { error: 'Legal type name already exists' },
        { status: 409 }
      );
    }

    return Response.json(
      { error: 'Failed to update legal type' },
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

    const existing = await repository.getLegalTypeById(Number(id));
    if (!existing) {
      return Response.json(
        { error: 'Legal type not found' },
        { status: 404 }
      );
    }

    await repository.deleteLegalType(Number(id));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting legal type:', error);
    return Response.json(
      { error: 'Failed to delete legal type' },
      { status: 500 }
    );
  }
}
