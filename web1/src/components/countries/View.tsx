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
    const [countries, setCountries] = useState<any[]>([]);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [editedCountries, setEditedCountries] = useState<{[key: string]: any}>({});

    const fetchCountries = async () => {
      setIsRefreshing(true);
      try {
        const res = await fetch('/api/metadata/countries');
        const data = await res.json();
        // API returnerar en array direkt
        setCountries(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setCountries([]);
      } finally {
        setIsRefreshing(false);
      }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    const handleFieldChange = (alpha3Code: string, field: string, value: string) => {
      setEditedCountries(prev => ({
        ...prev,
        [alpha3Code]: {
          ...prev[alpha3Code],
          [field]: value
        }
      }));
    };

    const getFieldValue = (country: any, field: string) => {
      return editedCountries[country.alpha3Code]?.[field] ?? country[field];
    };

    async function handleSave(alpha3Code: string) {
      if (!editedCountries[alpha3Code]) return;

      try {
        const response = await fetch('/api/metadata/countries', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            alpha3Code,
            ...editedCountries[alpha3Code]
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(`Failed to update country: ${errorData.error || 'Unknown error'}`);
          return;
        }

        // Update local state
        setCountries(countries.map(c => 
          c.alpha3Code === alpha3Code 
            ? { ...c, ...editedCountries[alpha3Code] } 
            : c
        ));
        
        // Clear edited state for this country
        setEditedCountries(prev => {
          const newState = { ...prev };
          delete newState[alpha3Code];
          return newState;
        });

        alert('Country updated successfully');
      } catch (error) {
        console.error('Error updating country:', error);
        alert('An error occurred while updating the country.');
      }
    }

    async function handleDelete(alpha3Code: string, countryName: string) {
      const confirmed = window.confirm(
        `Are you sure you want to delete ${countryName} (${alpha3Code})?\n\nThis action cannot be undone.`
      );

      if (!confirmed) return;

      setIsDeleting(alpha3Code);

      try {
        const response = await fetch(`/api/metadata/countries?alpha3Code=${alpha3Code}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          
          if (response.status === 409) {
            // Foreign key constraint error
            alert(`Cannot delete ${countryName}.\n\nThis country is being used by other entities and cannot be deleted.`);
          } else {
            alert(`Failed to delete country: ${errorData.error || 'Unknown error'}`);
          }
          return;
        }

        // Remove from list
        setCountries(countries.filter(c => c.alpha3Code !== alpha3Code));
        alert(`${countryName} has been deleted successfully.`);
      } catch (error) {
        console.error('Error deleting country:', error);
        alert('An error occurred while deleting the country.');
      } finally {
        setIsDeleting(null);
      }
    }

  
  if (!countries) {
    return <div>No countries found</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <TdsButton 
          text={isRefreshing ? 'Refreshing...' : 'Refresh'}
          variant="secondary"
          size="sm"
          disabled={isRefreshing}
          onClick={fetchCountries}
        />
      </div>

      <TdsTable compactDesign={true}>
        <TdsTableHeader>
          <TdsHeaderCell>Alpha2 Code</TdsHeaderCell>
          <TdsHeaderCell>Alpha3 Code</TdsHeaderCell>
          <TdsHeaderCell>Name</TdsHeaderCell>
          <TdsHeaderCell>Emoji</TdsHeaderCell>
          <TdsHeaderCell>Actions</TdsHeaderCell>
        </TdsTableHeader>
        <TdsTableBody>
          {countries.map((country) => (
            <TdsTableBodyRow key={country.alpha3Code}>
              <TdsBodyCell>{country.alpha2Code}</TdsBodyCell>
              <TdsBodyCell>{country.alpha3Code}</TdsBodyCell>
              <TdsBodyCell>
                <TdsTableBodyInputWrapper>
                    <input 
                      id={`name-${country.alpha3Code}`} 
                      type="text" 
                      value={getFieldValue(country, 'name')}
                      onChange={(e) => handleFieldChange(country.alpha3Code, 'name', e.target.value)}
                    />
                </TdsTableBodyInputWrapper>
              </TdsBodyCell>
              <TdsBodyCell>
                <TdsTableBodyInputWrapper>
                    <input 
                      id={`emoji-${country.alpha3Code}`} 
                      type="text" 
                      value={getFieldValue(country, 'emoji')}
                      onChange={(e) => handleFieldChange(country.alpha3Code, 'emoji', e.target.value)}
                    />
                </TdsTableBodyInputWrapper>  
                </TdsBodyCell>
              <TdsBodyCell>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {editedCountries[country.alpha3Code] && (
                    <TdsButton 
                      text="Save"
                      variant="primary"
                      size="sm"
                      onClick={() => handleSave(country.alpha3Code)}
                    />
                  )}
                  <TdsButton 
                    text="Delete"
                    variant="danger"
                    size="sm"
                    disabled={isDeleting === country.alpha3Code}
                    onClick={() => handleDelete(country.alpha3Code, country.name)}
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