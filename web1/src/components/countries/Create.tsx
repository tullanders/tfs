'use client';
import { useRouter } from 'next/navigation';
import TextField from '@/components/tegelWraps/TextField';
import { 
    TdsButton, 
    TdsTextField, 
    TdsAccordion,
    TdsAccordionItem 
} from '@scania/tegel-react';
import React, { useState } from 'react';

export default function CreateCountry() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      alpha3Code: (formData.get('alpha3Code') as string).toUpperCase(),
      alpha2Code: (formData.get('alpha2Code') as string).toUpperCase(),
      name: formData.get('name') as string,
      emoji: formData.get('emoji') as string,
    };

    try {
      const response = await fetch('/api/metadata/countries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create country');
      }

      const result = await response.json();
      // set value = '' after successful creation
      console.log(e);
      if (e.target instanceof HTMLFormElement) {
        e.target.reset();
      }

      // Redirect tillbaka till lista
      router.push('/metadata/countries');
      router.refresh(); // Refresh server components
    } catch (err) {
      console.error('Failed to create country:', err);
      setError(err instanceof Error ? err.message : 'Failed to create country');
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
            label="Alpha3 Code"
            name="alpha3Code"
            placeholder="3 Letter Code (e.g., SWE)"
            required
            maxLength={3}
            style={{ textTransform: 'uppercase' }}
          />

          <TdsTextField
            label="Alpha2 Code"
            name="alpha2Code"
            placeholder="2 Letter Code (e.g., SE)"
            required
            maxLength={2}
            style={{ textTransform: 'uppercase' }}
          />

          <TdsTextField
            label="Country Name"
            name="name"
            placeholder="Country Name (e.g., Sweden)"
            required
          />
          <TdsTextField
            label="Emoji"
            name="emoji"
            placeholder="Emoji (e.g., 🇸🇪)"
            required
          />          

<TdsButton type="submit" text={isSubmitting ? 'Creating...' : 'Create Country'}  variant="primary" disabled={isSubmitting}/>

        </div>
      </form>
    
    </div>
  );
}
