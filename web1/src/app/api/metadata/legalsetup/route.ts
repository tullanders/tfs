import { LegalSetupRepository } from '@/repositiories/legal-setup.repository';

const repository = new LegalSetupRepository();

export async function GET() {
  try {
    const legalSetups = await repository.getLegalSetups();
    return Response.json(legalSetups || []);
  } catch (error) {
    console.error('Error fetching legal setups:', error);
    return Response.json(
      { error: 'Failed to fetch legal setups' },
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

    const legalSetup = await repository.createLegalSetup({
      name: body.name,
    });

    return Response.json(legalSetup, { status: 201 });
  } catch (error: any) {
    console.error('Error creating legal setup:', error);

    if (error.code === '23505') {
      return Response.json(
        { error: 'Legal setup name already exists' },
        { status: 409 }
      );
    }

    return Response.json(
      { error: 'Failed to create legal setup' },
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

    const legalSetup = await repository.updateLegalSetup(body.id, {
      name: body.name,
    });

    if (!legalSetup) {
      return Response.json(
        { error: 'Legal setup not found' },
        { status: 404 }
      );
    }

    return Response.json(legalSetup);
  } catch (error: any) {
    console.error('Error updating legal setup:', error);

    if (error.code === '23505') {
      return Response.json(
        { error: 'Legal setup name already exists' },
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


    await repository.deleteLegalSetup(Number(id));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting legal setup:', error);
    return Response.json(
      { error: 'Failed to delete legal setup' },
      { status: 500 }
    );
  }
}
