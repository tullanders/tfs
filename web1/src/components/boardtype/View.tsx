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
    const [boardTypes, setBoardTypes] = useState<any[]>([]);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [editedBoardTypes, setEditedBoardTypes] = useState<{[key: number]: any}>({});

    const fetchBoardTypes = async () => {
      setIsRefreshing(true);
      try {
        const res = await fetch('/api/metadata/boardtype');
        const data = await res.json();
        setBoardTypes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching board types:', error);
      } finally {
        setIsRefreshing(false);
      }
    };

    useEffect(() => {
        fetchBoardTypes();
    }, []);

    const handleFieldChange = (id: number, field: string, value: string) => {
      setEditedBoardTypes(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: value
        }
      }));
    };

    const getFieldValue = (boardType: any, field: string) => {
      return editedBoardTypes[boardType.id]?.[field] ?? boardType[field] ?? '';
    };

    async function handleSave(id: number) {
      if (!editedBoardTypes[id]) return;

      try {
        const response = await fetch('/api/metadata/boardtype', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
            ...editedBoardTypes[id]
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(`Failed to update entity type: ${errorData.error || 'Unknown error'}`);
          return;
        }

        // Update local state
        setBoardTypes(boardTypes.map(bt => 
          bt.id === id 
            ? { ...bt, ...editedBoardTypes[id] } 
            : bt
        ));
        
        // Clear edited state for this board type
        setEditedBoardTypes(prev => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });

        alert('Board type updated successfully');
      } catch (error) {
        console.error('Error updating board type:', error);
        alert('An error occurred while updating the board type.');
      }
    }

    async function handleDelete(id: number, name: string) {
      const confirmed = window.confirm(
        `Are you sure you want to delete ${name}?\n\nThis action cannot be undone.`
      );

      if (!confirmed) return;

      setIsDeleting(id);

      try {
        const response = await fetch(`/api/metadata/boardtype?id=${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          
          if (response.status === 409) {
            // Foreign key constraint error
            alert(`Cannot delete ${name}.\n\nThis board type is being used by other records and cannot be deleted.`);
          } else {
            alert(`Failed to delete board type: ${errorData.error || 'Unknown error'}`);
          }
          return;
        }

        // Remove from list
        setBoardTypes(boardTypes.filter(bt => bt.id !== id));
        alert(`${name} has been deleted successfully.`);
      } catch (error) {
        console.error('Error deleting board type:', error);
        alert('An error occurred while deleting the board type.');
      } finally {
        setIsDeleting(null);
      }
    }

  
  if (!boardTypes) {
    return <div>No board types found</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <TdsButton 
          text={isRefreshing ? 'Refreshing...' : 'Refresh'}
          variant="secondary"
          size="sm"
          disabled={isRefreshing}
          onClick={fetchBoardTypes}
        />
      </div>


      <TdsTable compactDesign={true}>
        <TdsTableHeader>
          <TdsHeaderCell>ID</TdsHeaderCell>
          <TdsHeaderCell>Name</TdsHeaderCell>
          <TdsHeaderCell>Actions</TdsHeaderCell>
        </TdsTableHeader>
        <TdsTableBody>
          {boardTypes.map((boardType) => (
            <TdsTableBodyRow key={boardType.id}>
              <TdsBodyCell>{boardType.id}</TdsBodyCell>
              <TdsBodyCell>
                <TdsTableBodyInputWrapper>
                    <input 
                      id={`name-${boardType.id}`} 
                      type="text" 
                      value={getFieldValue(boardType, 'name')}
                      onChange={(e) => handleFieldChange(boardType.id, 'name', e.target.value)}
                    />
                </TdsTableBodyInputWrapper>
              </TdsBodyCell>
              <TdsBodyCell>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {editedBoardTypes[boardType.id] && (
                    <TdsButton 
                      text="Save"
                      variant="primary"
                      size="sm"
                      onClick={() => handleSave(boardType.id)}
                    />
                  )}
                  <TdsButton 
                    text="Delete"
                    variant="danger"
                    size="sm"
                    disabled={isDeleting === boardType.id}
                    onClick={() => handleDelete(boardType.id, boardType.name)}
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
