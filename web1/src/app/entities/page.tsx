
import { LegalCreateForm } from "@/components/forms/LegalCreateForm";
import { BoardCreateForm } from "@/components/forms/BoardCreateForm";
import { EntityTypeVO } from '@/domain/value-objects/entity-type.vo';
import { CountryRepository } from '@/repositiories/country.repository';
import { LegalSetupRepository } from '@/repositiories/legal-setup.repository';
import { LegalTypeRepository } from '@/repositiories/legal-type.repository';
import { BoardTypeRepository } from '@/repositiories/board-type.repository';
import { EntityTypeRepository } from '@/repositiories/entity-type.repository';
import { EntityRepository } from '@/repositiories/entity.repository';
import { redirect } from 'next/navigation';

export default async function Page({ searchParams }: { searchParams: { type?: string } }) {
  const type = searchParams.type;
  

  async function getCreateMetadata() {
      const countryRepository = new CountryRepository();
      const legalSetupRepository = new LegalSetupRepository();
      const legalTypeRepository = new LegalTypeRepository();
      const entityTypeRepository = new EntityTypeRepository();
      const boardTypeRepository = new BoardTypeRepository();

      const [entityTypes, legalTypes, legalSetups, countries, boardTypes] = await Promise.all([
        entityTypeRepository.getEntityTypes(),
        legalTypeRepository.getLegalTypes(),
        legalSetupRepository.getLegalSetups(),
        countryRepository.getCountries(),
        boardTypeRepository.getBoardTypes(),
      ]);
      return {
      entityTypes,
      legalTypes,
      legalSetups,
      countries,
      boardTypes
      };
  } 
  async function handleCreateEntity(formData: FormData) {
    'use server';
    
    const id = formData.get('id');
    const entityRepository = new EntityRepository();
    
    try {
      if (id) {
        // UPDATE
        console.log('UPDATE entity with id:', id);
        
        const updates = {
          displayName: formData.get('display_name') as string,
          entityTypeId: parseInt(formData.get('entity_type') as string),
          entityType: type?.toUpperCase() || 'LEGAL',
          legalTypeId: formData.get('legal_type') ? parseInt(formData.get('legal_type') as string) : null,
          legalSetupId: formData.get('legal_setup') ? parseInt(formData.get('legal_setup') as string) : null,
          countryAlpha3Code: formData.get('country_alpha3_code') as string,
          status: formData.get('status') as string || 'active',
          validFrom: new Date(formData.get('valid_from') as string),
          validTo: formData.get('valid_to') ? new Date(formData.get('valid_to') as string) : null,
          modifiedBy: 'system',
          boardTypeId: formData.get('board_type') ? parseInt(formData.get('board_type') as string) : null,
          constitutedDate: formData.get('constituted_date') ? new Date(formData.get('constituted_date') as string) : null,
          dissolvedDate: formData.get('dissolved_date') ? new Date(formData.get('dissolved_date') as string) : null,

        };
        
        const updatedEntity = await entityRepository.updateEntity(parseInt(id as string), updates);
        if (!updatedEntity) {
          throw new Error('Entity not found');
        }
        
        console.log('Entity updated:', updatedEntity.id);
        redirect(`/entities/${updatedEntity.id}`);
      } else {
        // CREATE
        console.log('CREATE new entity');
        
        const newEntity = await entityRepository.createEntity({
          displayName: formData.get('display_name') as string,
          entityType : type?.toUpperCase() || 'LEGAL',
          entityTypeId: parseInt(formData.get('entity_type') as string),
          legalTypeId: formData.get('legal_type') ? parseInt(formData.get('legal_type') as string) : undefined,
          legalSetupId: formData.get('legal_setup') ? parseInt(formData.get('legal_setup') as string) : undefined,
          countryAlpha3Code: formData.get('country_alpha3_code') as string,
          status: formData.get('status') as string || 'ACTIVE',
          validFrom: new Date(),
          validTo: null,
          createdBy: 'system',
          modifiedBy: 'system',
        } as any);
        
        console.log('Entity created:', newEntity.id);
        redirect(`/entities/${newEntity.id}`);
      }
    } catch (error) {
      console.error('Error saving entity:', error);
      throw error;
    }
  }

  const metadata = await getCreateMetadata();

  // Remove .next cache and rebuild if needed
  const renderBoard = type && type.toLowerCase() === 'board';

  return (
    <div>
      {renderBoard ? (
        <>
          <p>DEBUG: Showing BoardCreateForm</p>
          <BoardCreateForm 
            metadata={metadata} 
            onSubmit={handleCreateEntity}
          />
        </>
      ) : (
        <>
          <LegalCreateForm 
            metadata={metadata} 
            onSubmit={handleCreateEntity}
          />
        </>
      )}
    </div>
  );
}