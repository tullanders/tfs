'use client';

import { TdsButton } from '@scania/tegel-react';
import Link from 'next/link';
import type { BoardEntityView } from '@/domain/entities/board.entity';

interface BoardReadViewProps {
  entity: BoardEntityView;
}

export function BoardReadView({ entity }: BoardReadViewProps) {
  const formatDate = (date: any) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('sv-SE');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', borderBottom: '1px solid #e0e0e0', paddingBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px' }}>{entity.displayName}</h1>
        <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
          {entity.entityTypeEmoji} {entity.entityTypeName}
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <Link href={`/entities/${entity.id}/edit?type=board`}>
          <TdsButton text="Redigera" variant="primary" />
        </Link>
        <Link href="/entities">
          <TdsButton text="Tillbaka" variant="secondary" />
        </Link>
      </div>

      {/* Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* Left Column */}
        <div>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', borderBottom: '2px solid #0066cc', paddingBottom: '8px' }}>
              Grundläggande Information
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Namn</label>
                <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '500' }}>{entity.displayName}</p>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Entitetstyp</label>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                  {entity.entityTypeEmoji} {entity.entityTypeName}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Board-typ</label>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>{entity.boardTypeName || '-'}</p>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', borderBottom: '2px solid #0066cc', paddingBottom: '8px' }}>
              Mandatperiod
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Konstituerande</label>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>{formatDate(entity.constitutedDate)}</p>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Upplöst</label>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>{formatDate(entity.dissolvedDate)}</p>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Effektiv från</label>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>{formatDate(entity.effectiveFrom)}</p>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Effektiv till</label>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>{formatDate(entity.effectiveUntil)}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', borderBottom: '2px solid #0066cc', paddingBottom: '8px' }}>
              Giltighet
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Giltigt från</label>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>{formatDate(entity.validFrom)}</p>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Giltigt till</label>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>{formatDate(entity.validTo)}</p>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Status</label>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                  <span style={{ 
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    backgroundColor: entity.status === 1 ? '#e8f5e9' : '#fff3e0',
                    color: entity.status === 1 ? '#2e7d32' : '#e65100',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {entity.status === 1 ? 'Aktiv' : 'Inaktiv'}
                  </span>
                </p>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Version</label>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>{entity.version}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', borderBottom: '2px solid #0066cc', paddingBottom: '8px' }}>
              Metadata
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Skapad</label>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
                  {formatDate(entity.createdDateTime)} av {entity.createdBy}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Senast ändrad</label>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
                  {formatDate(entity.modifiedDateTime)} av {entity.modifiedBy}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Entity ID</label>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontFamily: 'monospace', color: '#999' }}>
                  {entity.id}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
