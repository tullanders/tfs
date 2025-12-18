'use client';
import { EntityView } from '@/domain/entity/Entity';
import type { metadataTypeVO } from '@/domain/value-objects/all.vo';
import { TdsTextField, TdsButton, TdsDropdown, TdsDropdownOption } from '@scania/tegel-react';
import Datalist from '@/components/common/List';
import { useState } from 'react';

interface BoardCreateFormProps {
  entity?: EntityView | null;
  metadata?: metadataTypeVO;
  onSubmit?: (formData: FormData) => Promise<void>;
}

type FormDataHandler = (formData: FormData) => Promise<void> | void;

export function BoardCreateForm({ entity, metadata, onSubmit }: BoardCreateFormProps) {
  const isEdit = !!entity;
  const [countryValue, setCountryValue] = useState(entity?.countryAlpha3Code || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      // Ensure country code is set
      formData.set('country_alpha3_code', countryValue);
      if (onSubmit) {
        await onSubmit(formData);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2>{isEdit ? `Edit Board: ${entity?.displayName}` : 'Create New Board'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
          
          {/* Hidden ID field for edit */}
          {entity?.id && (
            <input type="hidden" name="id" value={entity.id} />
          )}

          {/* Hidden ID field for entityTypeId */}
          <input type="hidden" name="entity_type" value="19" />

          {/* Display Name */}
          <div slot="label">Name:</div>
          <TdsTextField
            label="Board Name"
            name="display_name"
            placeholder="e.g., Board of Directors"
            required
            defaultValue={entity?.displayName || ''}
          />


          {/* Country */}
            <div slot="label">Board Type:</div>
            <TdsDropdown
                name="board_type"
                label="Board Type"
                size="sm"
                placeholder="Select Board Type..."
                value={entity?.boardTypeId?.toString() ?? ''}
                required
            >
            {metadata?.boardTypes?.map((type) => (
                    <TdsDropdownOption key={type.id} value={type.id}>
                        {type.name}
                    </TdsDropdownOption>
                ))}
            </TdsDropdown>
      

          {/* Constituted Date */}
          <div slot="label">Constituted Date:</div>
          <TdsTextField
            label="Constituted Date"
            name="constituted_date"
            type="date"
            required
            defaultValue={entity?.constitutedDate ? new Date(entity.constitutedDate).toISOString().split('T')[0] : ''}
          />

          {/* Dissolved Date */}
          <div slot="label">Dissolved Date:</div>
          <TdsTextField
            label="Dissolved Date"
            name="dissolved_date"
            type="date"
            defaultValue={entity?.dissolvedDate ? new Date(entity.dissolvedDate).toISOString().split('T')[0] : ''}
          />


          {/* Valid From */}
          <div slot="label">Valid From:</div>
          <TdsTextField
            label="Valid From"
            name="valid_from"
            type="date"
            defaultValue={entity?.validFrom ? new Date(entity.validFrom).toISOString().split('T')[0] : ''}
          />

          {/* Valid To */}
          <TdsTextField
            label="Valid To"
            name="valid_to"
            type="date"
            defaultValue={entity?.validTo ? new Date(entity.validTo).toISOString().split('T')[0] : ''}
          />

          {/* Submit Button */}
          <TdsButton 
            type="submit" 
            text={isSubmitting ? 'Saving...' : isEdit ? 'Update Board' : 'Create Board'}
            variant="primary"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}