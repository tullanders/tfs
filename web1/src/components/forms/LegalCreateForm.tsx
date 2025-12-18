'use client';
import { EntityView } from '@/domain/entity/Entity';
import type { metadataTypeVO } from '@/domain/value-objects/all.vo';

import { useState, useEffect } from 'react';
import { 
    TdsButton, 
    TdsTextField, 
    TdsTextarea,
    TdsDropdown, 
    TdsDropdownOption,
    TdsCheckbox,
    TdsToggle,
    TdsAccordion,
    TdsAccordionItem,
    TdsDatetime
} from '@scania/tegel-react';
import Datalist from '@/components/common/List';

interface LegalCreateFormProps {
  entity?: EntityView | null;
  metadata?: metadataTypeVO;
  onSubmit?: (formData: FormData) => Promise<void>;
}

export function LegalCreateForm({ onSubmit, entity, metadata} : LegalCreateFormProps) {
    const [countryValue, setCountryValue] = useState(entity?.countryAlpha3Code ?? '');

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        console.log('Form data:', Object.fromEntries(formData));
        if (onSubmit) {
            await onSubmit(e);
        }
    };

  return (
        <>
          <form onSubmit={handleFormSubmit}>
              {entity?.id && (
                <input type="hidden" name="id" value={entity.id} />
              )}
                {/* Hidden ID field for entityTypeId */}
                <input type="hidden" name="entity_type" value="15" />

              <h2 style={{ marginBottom: '24px' }}>
                {entity?.id ? `Edit Legal Entity: ${entity.displayName}` : 'Create New Legal Entity'}
              </h2>
              
              {/* Row 1: Official Legal Name */}
              <div className='tds-row' style={{ marginBottom: '16px', width: '100%' }}>
                  
                  <div className='tds-col-sm-12' style={{ width: '100%' }}>
                      <div slot="label">Internal name:</div>
                      <TdsTextField 
                          name="display_name"
                          label="Name" 
                          size="sm" 
                          placeholder="Enter name..." 
                          value={entity?.displayName ?? ''}
                          required
                          style={{ width: '100%' }}
                      />
                  </div>
              </div> 
              <div className='tds-row' style={{ marginBottom: '16px' }}>
                  <div className='tds-col-sm-7'>
                      <div slot="label">Local Id:</div>
                      <TdsTextField 
                          name="local_id"
                          label="Local ID" 
                          size="sm" 
                          placeholder="Enter Local ID..." 
                          value={entity?.localId ?? ''}
                          required
                      />
                  </div>
                  <div className='tds-col-sm-5'>
                      <div slot="label">Local Id Source</div>
                      <TdsDropdown
                          name="local_id_source"
                          label="Local Id Source" 
                          size="sm" 
                          placeholder="Select Local Id Source..."
                          value={entity?.localIdSource ?? ''}

                      >
                          <TdsDropdownOption value="1">HFM</TdsDropdownOption>
                          <TdsDropdownOption value="2">Lemi</TdsDropdownOption>
                          <TdsDropdownOption value="3">Other</TdsDropdownOption>

                      </TdsDropdown>
                  </div>
              </div>                             
              <div className='tds-row' style={{ marginBottom: '16px' }}>
                  
                  <div className='tds-col-sm-7'>
                      <div slot="label">Original Official Legal Name:</div>
                      <TdsTextField 
                          name="original_official_name"
                          label="Name" 
                          size="sm" 
                          placeholder="Enter name..." 
                          value={entity?.originalOfficialName ?? ''}
                          required
                      />
                  </div>
                  <div className='tds-col-sm-5'>
                      <div slot="label">Original Official Legal Name Valid from:</div>
                      <TdsDatetime 
                          type="date"
                          name="original_official_name_valid_from"
                          label="Valid From" 
                          size="sm" 
                          placeholder="Enter date..." 
                          value={entity?.originalOfficialNameValidFrom ? new Date(entity.originalOfficialNameValidFrom).toISOString().split('T')[0] : ''}
                          required
                      />                        
                  </div>

              </div>
              <div className='tds-row' style={{ marginBottom: '16px' }}>
                  {/* Row 2: Current Official Legal Name */}
                  <div className='tds-col-sm-7'>
                      <div slot="label">Current Official Legal Name:</div>
                      <TdsTextField 
                          name="current_official_name"
                          label="Name" 
                          size="sm" 
                          placeholder="Enter name..." 
                          value={entity?.currentOfficialName ?? ''}
                          required
                      />
                  </div>
                  <div className='tds-col-sm-5'>
                      <div slot="label">Current Official Legal NameValid from:</div>
                      <TdsDatetime 
                          type="date"
                          name="current_official_name_valid_from"
                          label="Valid From" 
                          size="sm" 
                          placeholder="Enter date..." 
                          value={entity?.currentOfficialNameValidFrom ? new Date(entity.currentOfficialNameValidFrom).toISOString().split('T')[0] : ''}
                          required
                      />                        
                  </div>

              </div>  
              <div className='tds-row' style={{ marginBottom: '16px' }}>
                  {/* Row 3: Upcoming Official Legal Name */}
                  <div className='tds-col-sm-7'>
                      <div slot="label">Upcoming Official Legal Name:</div>
                      <TdsTextField 
                          name="upcoming_official_name"
                          label="Name" 
                          size="sm" 
                          placeholder="Enter name..." 
                          value={entity?.upcomingOfficialName ?? ''}
                          required
                      />
                  </div>
                  <div className='tds-col-sm-5'>
                      <div slot="label">Upcoming Official Legal NameValid from:</div>
                      <TdsDatetime 
                          type="date"
                          name="upcoming_official_name_valid_from"
                          label="Valid From" 
                          size="sm" 
                          placeholder="Enter date..." 
                          value={entity?.upcomingOfficialNameValidFrom ? new Date(entity.upcomingOfficialNameValidFrom).toISOString().split('T')[0] : ''}
                          required
                      />                        
                  </div>

              </div>   
              <div className='tds-row' style={{ marginBottom: '16px' }}>
                  
                  <div className='tds-col-sm-9'>
                      <div slot="label">Local Official Registration Number:</div>
                      <TdsTextField 
                          name="local_official_registration_number"
                          label="Registration Number" 
                          size="sm" 
                          placeholder="Local official registration number..." 
                          value={entity?.localOfficialRegistrationNumber ?? ''}
                      />
                  </div>  
                  <div className='tds-col-sm-3'>
                      <Datalist
                          id="country"
                          name="country_alpha3_code"
                          label="Country"
                          autoComplete="on"
                          placeholder="Start typing country name..."
                          options={metadata?.countries?.map(c => ({ 
                              value: c.alpha3Code, 
                              label: c.emoji + ' ' + c.name 
                          })) ?? []}
                          value={countryValue}
                          onChange={setCountryValue}
                          size="sm"
                          required
                      />
                  </div>                                             
              </div>
              <div className='tds-row' style={{ marginBottom: '16px' }}>
                  <div className='tds-col-sm-6'>
                      <div slot="label">Legal Entity Type:</div>
                      <TdsDropdown
                          name="legal_entity_type"
                          label="Legal Entity Type"
                          size="sm"
                          placeholder="Select Legal Entity Type..."
                          value={entity?.legalTypeId?.toString() ?? ''}
                          required
                      >
                        {metadata?.legalTypes?.map((type) => (
                              <TdsDropdownOption key={type.id} value={type.id}>
                                  {type.name}
                              </TdsDropdownOption>
                          ))}
                      </TdsDropdown>
                  </div>
                  <div className='tds-col-sm-6'>
                      <div slot="label">Legal Setup:</div>
                      <TdsDropdown
                          name="legal_setup"
                          label="Legal Setup"
                          size="sm"
                          placeholder="Select Legal Setup..."
                          value={entity?.legalSetupId?.toString() ?? ''}
                          required
                      >
                          {metadata?.legalSetups?.map((setup) => (
                              <TdsDropdownOption key={setup.id} value={setup.id}>
                                  {setup.name}
                              </TdsDropdownOption>
                          ))}
                      </TdsDropdown>

                  </div>
              </div>

              <div className='tds-row' style={{ marginBottom: '16px' }}>
                  <div className='tds-col-sm-3'>
                      <div style={{ marginTop: '24px' }}>
                          <TdsToggle name="has_employee" defaultChecked={entity?.hasEmployees ?? false}>
                              <span slot="label">Has Employees</span>
                          </TdsToggle>
                      </div>
                  </div>
                  <div className='tds-col-sm-3'>
                    <div slot="label">Number of Employees:</div>
                      <TdsTextField 
                          name="number_of_employee"
                          label="Number of Employees" 
                          size="sm" 
                          type="number"
                          placeholder="0" 
                          value={entity?.numberOfEmployees?.toString() ?? ''}
                      />
                  </div>
                  <div className='tds-col-sm-6'></div>
              </div>
              <div className='tds-row' style={{ marginBottom: '16px' }}>
                  <div className='tds-col-sm-12'>

                  </div>
              </div>

              {/* Row 7: Action Buttons */}
              <div className='tds-row' style={{ marginBottom: '24px', gap: '8px' }}>
                  <div className='tds-col-max-12'>
                      <TdsButton 
                          text="Create Legal Entity" 
                          variant="primary" 
                          size="sm" 
                          type="submit" 
                      />&nbsp;
                      <TdsButton 
                          text="Cancel" 
                          variant="secondary" 
                          size="sm" 
                          type="button" 
                      />
                  </div>
              </div>
          </form>            
      </>
  );
}

