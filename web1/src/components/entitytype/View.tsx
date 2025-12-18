'use client';
import { 
  TdsTable, 
  TdsTableHeader,
  TdsHeaderCell,
  TdsTableBody,
  TdsTableBodyRow,
  TdsBodyCell,
  TdsTableBodyInputWrapper
} from '@scania/tegel-react';

import React, { useEffect, useState } from 'react';
import { TdsButton } from '@scania/tegel-react';

export default function View() {
    const [entityTypes, setEntityTypes] = useState<any[]>([]);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [editedEntityTypes, setEditedEntityTypes] = useState<{[key: number]: any}>({});

    const fetchEntityTypes = async () => {
      setIsRefreshing(true);
      try {
        const res = await fetch('/api/metadata/entitytype');
        const data = await res.json();
        setEntityTypes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching entity types:', error);
      } finally {
        setIsRefreshing(false);
      }
    };

    useEffect(() => {
        fetchEntityTypes();
    }, []);

    const handleFieldChange = (id: number, field: string, value: string) => {
      setEditedEntityTypes(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: value
        }
      }));
    };

    const getFieldValue = (entityType: any, field: string) => {
      return editedEntityTypes[entityType.id]?.[field] ?? entityType[field] ?? '';
    };

    async function handleSave(id: number) {
      if (!editedEntityTypes[id]) return;

      try {
        const response = await fetch('/api/metadata/entitytype', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
            ...editedEntityTypes[id]
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(`Failed to update entity type: ${errorData.error || 'Unknown error'}`);
          return;
        }

        // Update local state
        setEntityTypes(entityTypes.map(et => 
          et.id === id 
            ? { ...et, ...editedEntityTypes[id] } 
            : et
        ));
        
        // Clear edited state for this entity type
        setEditedEntityTypes(prev => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });

        alert('Entity type updated successfully');
      } catch (error) {
        console.error('Error updating entity type:', error);
        alert('An error occurred while updating the entity type.');
      }
    }

    async function handleDelete(id: number, name: string) {
      const confirmed = window.confirm(
        `Are you sure you want to delete ${name}?\n\nThis action cannot be undone.`
      );

      if (!confirmed) return;

      setIsDeleting(id);

      try {
        const response = await fetch(`/api/metadata/entitytype?id=${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          
          if (response.status === 409) {
            // Foreign key constraint error
            alert(`Cannot delete ${name}.\n\nThis entity type is being used by other records and cannot be deleted.`);
          } else {
            alert(`Failed to delete entity type: ${errorData.error || 'Unknown error'}`);
          }
          return;
        }

        // Remove from list
        setEntityTypes(entityTypes.filter(et => et.id !== id));
        alert(`${name} has been deleted successfully.`);
      } catch (error) {
        console.error('Error deleting entity type:', error);
        alert('An error occurred while deleting the entity type.');
      } finally {
        setIsDeleting(null);
      }
    }

  
  if (!entityTypes) {
    return <div>No entity types found</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <TdsButton 
          text={isRefreshing ? 'Refreshing...' : 'Refresh'}
          variant="secondary"
          size="sm"
          disabled={isRefreshing}
          onClick={fetchEntityTypes}
        />
      </div>

      <TdsTable compactDesign={true}>
        <TdsTableHeader>
          <TdsHeaderCell>ID</TdsHeaderCell>
          <TdsHeaderCell>Name</TdsHeaderCell>
          <TdsHeaderCell>Flag</TdsHeaderCell>
          <TdsHeaderCell>Actions</TdsHeaderCell>
        </TdsTableHeader>
        <TdsTableBody>
          {entityTypes.map((entityType) => (
            <TdsTableBodyRow key={entityType.id}>
              <TdsBodyCell>{entityType.id}</TdsBodyCell>
              <TdsBodyCell>
                <TdsTableBodyInputWrapper>
                    <input 
                      id={`name-${entityType.id}`} 
                      type="text" 
                      value={getFieldValue(entityType, 'name')}
                      onChange={(e) => handleFieldChange(entityType.id, 'name', e.target.value)}
                    />
                </TdsTableBodyInputWrapper>
              </TdsBodyCell>
              <TdsBodyCell>
                <TdsTableBodyInputWrapper>
                    <input 
                      id={`emoji-${entityType.id}`} 
                      type="text" 
                      value={getFieldValue(entityType, 'emoji')}
                      onChange={(e) => handleFieldChange(entityType.id, 'emoji', e.target.value)}
                    />
                </TdsTableBodyInputWrapper>  
              </TdsBodyCell>              

              <TdsBodyCell>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {editedEntityTypes[entityType.id] && (
                    <TdsButton 
                      text="Save"
                      variant="primary"
                      size="sm"
                      onClick={() => handleSave(entityType.id)}
                    />
                  )}
                  <TdsButton 
                    text="Delete"
                    variant="danger"
                    size="sm"
                    disabled={isDeleting === entityType.id}
                    onClick={() => handleDelete(entityType.id, entityType.name)}
                  />
                </div>
              </TdsBodyCell>
            </TdsTableBodyRow>
          ))}
        </TdsTableBody>
      </TdsTable>
    </div>
  );
}
