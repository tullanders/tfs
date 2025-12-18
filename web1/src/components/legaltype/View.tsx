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
    const [legalTypes, setLegalTypes] = useState<any[]>([]);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [editedLegalTypes, setEditedLegalTypes] = useState<{[key: number]: any}>({});

    const fetchLegalTypes = async () => {
      setIsRefreshing(true);
      try {
        const res = await fetch('/api/metadata/legaltype');
        const data = await res.json();
        setLegalTypes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching legal types:', error);
      } finally {
        setIsRefreshing(false);
      }
    };

    useEffect(() => {
        fetchLegalTypes();
    }, []);

    const handleFieldChange = (id: number, field: string, value: string) => {
      setEditedLegalTypes(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: value
        }
      }));
    };

    const getFieldValue = (legalType: any, field: string) => {
      return editedLegalTypes[legalType.id]?.[field] ?? legalType[field] ?? '';
    };

    async function handleSave(id: number) {
      if (!editedLegalTypes[id]) return;

      try {
        const response = await fetch('/api/metadata/legaltype', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
            ...editedLegalTypes[id]
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(`Failed to update entity type: ${errorData.error || 'Unknown error'}`);
          return;
        }

        // Update local state
        setLegalTypes(legalTypes.map(lt => 
          lt.id === id 
            ? { ...lt, ...editedLegalTypes[id] } 
            : lt
        ));
        
        // Clear edited state for this legal type
        setEditedLegalTypes(prev => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });

        alert('Legal type updated successfully');
      } catch (error) {
        console.error('Error updating legal type:', error);
        alert('An error occurred while updating the legal type.');
      }
    }

    async function handleDelete(id: number, name: string) {
      const confirmed = window.confirm(
        `Are you sure you want to delete ${name}?\n\nThis action cannot be undone.`
      );

      if (!confirmed) return;

      setIsDeleting(id);

      try {
        const response = await fetch(`/api/metadata/legaltype?id=${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          
          if (response.status === 409) {
            // Foreign key constraint error
            alert(`Cannot delete ${name}.\n\nThis legal type is being used by other records and cannot be deleted.`);
          } else {
            alert(`Failed to delete legal type: ${errorData.error || 'Unknown error'}`);
          }
          return;
        }

        // Remove from list
        setLegalTypes(legalTypes.filter(lt => lt.id !== id));
        alert(`${name} has been deleted successfully.`);
      } catch (error) {
        console.error('Error deleting legal type:', error);
        alert('An error occurred while deleting the legal type.');
      } finally {
        setIsDeleting(null);
      }
    }

  
  if (!legalTypes) {
    return <div>No legal types found</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <TdsButton 
          text={isRefreshing ? 'Refreshing...' : 'Refresh'}
          variant="secondary"
          size="sm"
          disabled={isRefreshing}
          onClick={fetchLegalTypes}
        />
      </div>


      <TdsTable compactDesign={true}>
        <TdsTableHeader>
          <TdsHeaderCell>ID</TdsHeaderCell>
          <TdsHeaderCell>Name</TdsHeaderCell>
          <TdsHeaderCell>Actions</TdsHeaderCell>
        </TdsTableHeader>
        <TdsTableBody>
          {legalTypes.map((legalType) => (
            <TdsTableBodyRow key={legalType.id}>
              <TdsBodyCell>{legalType.id}</TdsBodyCell>
              <TdsBodyCell>
                <TdsTableBodyInputWrapper>
                    <input 
                      id={`name-${legalType.id}`} 
                      type="text" 
                      value={getFieldValue(legalType, 'name')}
                      onChange={(e) => handleFieldChange(legalType.id, 'name', e.target.value)}
                    />
                </TdsTableBodyInputWrapper>
              </TdsBodyCell>
              <TdsBodyCell>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {editedLegalTypes[legalType.id] && (
                    <TdsButton 
                      text="Save"
                      variant="primary"
                      size="sm"
                      onClick={() => handleSave(legalType.id)}
                    />
                  )}
                  <TdsButton 
                    text="Delete"
                    variant="danger"
                    size="sm"
                    disabled={isDeleting === legalType.id}
                    onClick={() => handleDelete(legalType.id, legalType.name)}
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
