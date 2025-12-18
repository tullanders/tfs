'use client';
import { useRouter } from 'next/navigation';
import { TdsButton, TdsTextField } from '@scania/tegel-react';
import React, { useState } from 'react';

export default function CreateEntityType() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      emoji: formData.get('emoji') as string,
      description: formData.get('description') as string,
    };

    try {
      const response = await fetch('/api/metadata/entitytypes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create entity type');
      }

      const result = await response.json();
      console.log('Entity type created successfully:', result);

      // Redirect tillbaka till lista
      router.push('/metadata/entitytypes');
      router.refresh(); // Refresh server components
    } catch (err) {
      console.error('Failed to create entity type:', err);
      setError(err instanceof Error ? err.message : 'Failed to create entity type');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      {error && (
        <div style={{ color: 'red', marginBottom: '16px', padding: '8px', border: '1px solid red', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
          
          <TdsTextField
            label="Name"
            name="name"
            placeholder="Entity Type Name (e.g., Legal Entity)"
            required
          />

          <TdsTextField
            label="Emoji"
            name="emoji"
            placeholder="Flag emoji (e.g., 🇸🇪)"
          />

          <TdsTextField
            label="Description"
            name="description"
            placeholder="Description"
          />

          <TdsButton 
            type="submit" 
            text={isSubmitting ? 'Creating...' : 'Create Entity Type'} 
            variant="primary" 
            disabled={isSubmitting}
          />

        </div>
      </form>
    </div>
  );
}
