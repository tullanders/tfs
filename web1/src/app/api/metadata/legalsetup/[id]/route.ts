import { EntityTypeRepository } from '@/repositiories/entity-type.repository';

const repository = new EntityTypeRepository();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const entityType = await repository.getEntityTypeById(Number(id));

    if (!entityType) {
      return Response.json(
        { error: 'Entity type not found' },
        { status: 404 }
      );
    }

    return Response.json(entityType);
  } catch (error) {
    console.error('Error fetching entity type:', error);
    return Response.json(
      { error: 'Failed to fetch entity type' },
      { status: 500 }
    );
  }
}
