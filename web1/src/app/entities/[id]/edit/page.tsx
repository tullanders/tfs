import { notFound } from 'next/navigation';
import { LegalCreateForm } from "@/components/forms/LegalCreateForm";
import { BoardCreateForm } from "@/components/forms/BoardCreateForm";
import { EntityRepository } from '@/repositiories/entity.repository';
import { MetadataRepository } from '@/repositiories/metadata.repository';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entityId = parseInt(id);

  const handleCreateEntity = async (formData: FormData) => {
    'use server';
    // This function is intentionally left blank for now.
  };

  // Hämta base entity
  const entityRepository = new EntityRepository();
  const entity = await entityRepository.getEntityViewById(entityId)

  if (!entity) {
    return notFound();
  }

  const metadataRepository = new MetadataRepository();
  const metadata = await metadataRepository.getCreateMetadata();

  if (entity.entityType == 'LEGAL') {
    return (
      <div style={{ padding : '2rem' }}>
        <LegalCreateForm entity={entity} metadata={metadata}
        />
      </div>
    );
  }
  else if (entity.entityType == 'BOARD') {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Edit: {entity.displayName}</h1>
        <BoardCreateForm entity={entity}/>
      </div>
    );    
  }
  else {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <h2>Entity Type Not Supported for Editing</h2>
        <p>Entity type {entity.entityType} is not supported for editing yet.</p>
      </div>
    );
  }

}