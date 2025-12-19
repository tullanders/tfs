"use client";
import { createContext, useContext, ReactNode } from 'react';

type Metadata = {
  countries?: Array<{ alpha3Code: string; name: string; emoji?: string }>;
  legalTypes?: Array<{ id: number; name: string }>;
  entityTypes?: Array<{ id: string; name: string; emoji?: string }>;
  boardTypes?: Array<{ id: string; name: string;}>;
  // Lägg till fler metadata-typer efter behov
};

const MetadataContext = createContext<Metadata | null>(null);

export function MetadataProvider({ children, metadata }: { children: ReactNode; metadata: Metadata }) {
  return (
    <MetadataContext.Provider value={metadata}>
      {children}
    </MetadataContext.Provider>
  );
}

export function useMetadata() {
  const context = useContext(MetadataContext);
  if (!context) {
    throw new Error('useMetadata must be used within MetadataProvider');
  }
  return context;
}