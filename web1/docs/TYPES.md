# Type Documentation - TFS Organizational System

## Arkitektur Overview

Systemet använder **Domain-Driven Design** med en tydlig separering mellan:
- **Entities** - Domän-objekt som representerar affärsenheter
- **Value Objects** - Immutabla värdeobjekt för lookup-tabeller
- **Read Models** - Optimerade vyer för presentationslager

---

## 1. Entity Typer (Domänobjekt)

### EntityBase
Base type för all entiteter med gemensamma fält.

**Fil:** `src/domain/entities/entity-base.ts`

```typescript
type EntityBase = {
  id: number;                  // Primärnyckel
  displayName: string;         // Visningsnamn
  entityTypeId: number;        // FK till entityTypes
  version: number;             // Versionering
  status: number;              // 1=active, etc
  validFrom: string;           // Giltighetsstart (ISO datetime)
  validTo?: string;            // Giltighetsslut (optional)
  createdDateTime: string;     // Skapad tidstempel
  createdBy: string;           // Skapare
  modifiedDateTime: string;    // Senast ändrad
  modifiedBy: string;          // Ändrad av
};
```

### LegalEntity
Juridisk enhet - representerar companies/organisationer med juridisk relevans.

**Fil:** `src/domain/entities/legal.entity.ts`

```typescript
type LegalEntity = EntityBase & {
  entityType: 'Legal';         // Diskriminator - alltid 'Legal'
  
  // Lokala identifikatorer
  localId?: string | null;     // T.ex. organisationsnummer
  localIdSource?: string | null; // Källa för localId
  
  // Anställd-relaterat
  hasEmployees?: boolean;      // Har anställda?
  numberOfEmployees?: number | null;
  
  // Främmande nycklar
  countryAlpha3Code?: string;  // FK till countries (ISO 3166-1 alpha-3)
  legalTypeId?: number | null;   // FK till legalTypes
  legalSetupId?: number | null;  // FK till legalSetups
};

// With enriched metadata from related entities
type LegalEntityView = LegalEntity & {
  entityTypeName?: string;     // T.ex. "Legal Entity"
  entityTypeEmoji?: string;    // T.ex. "⚖️"
  countryName?: string;        // T.ex. "Sweden"
  countryEmoji?: string;       // T.ex. "🇸🇪"
  legalTypeName?: string;      // T.ex. "Private Company"
  legalSetupName?: string;     // T.ex. "AB"
};
```

### BoardEntity
Styrelse-enhet - representerar styrelser och motsvarande ledningsgrupper.

**Fil:** `src/domain/entities/board.entity.ts`

```typescript
type BoardEntity = EntityBase & {
  entityType: 'Board';         // Diskriminator - alltid 'Board'
  
  // Styrelse-specifika fält
  boardTypeId: number;         // FK till boardTypes
  constitutedDate: Date;       // Bildningsdatum
  dissolvedDate?: Date | null;  // Upplösningsdatum (om applicable)
  effectiveFrom: Date;         // Giltig från
  effectiveUntil?: Date | null; // Giltig till
};

// With enriched metadata
type BoardEntityView = BoardEntity & {
  entityTypeName?: string;     // T.ex. "Board"
  entityTypeEmoji?: string;    // T.ex. "👥"
  boardTypeName?: string;      // T.ex. "Board of Directors"
};
```

### EntityDb
Database-representation - all fields för database operations.

**Fil:** `src/domain/entities/entity-db.ts`

```typescript
type EntityDb = {
  // Base fields (se EntityBase)
  id: number;
  displayName: string;
  entityTypeId: number;
  version: number;
  status: number;
  validFrom: string;
  validTo?: string;
  createdDateTime: string;
  createdBy: string;
  modifiedDateTime: string;
  modifiedBy: string;
  
  // TreeView support
  parentId?: number | null;    // Parent entity ID för hierarki
  
  // Entity type discriminator
  entityType: 'Legal';
  
  // Legal-specific fields
  localId?: string | null;
  localIdSource?: string | null;
  hasEmployees?: boolean;
  numberOfEmployees?: number | null;
  countryAlpha3Code?: string;
  legalTypeId?: number | null;
  legalSetupId?: number | null;
  
  // Board-specific fields (om applicable)
  boardTypeId?: number;
  constitutedDate?: string;
  dissolvedDate?: string | null;
  effectiveFrom?: string;
  effectiveUntil?: string | null;
};
```

---

## 2. Value Objects (Lookup-tabeller)

Value Objects representerar immutabla, referens-data från lookup-tabeller.

### CountryVO
Länder data enligt ISO 3166-1.

**Fil:** `src/domain/value-objects/country.vo.ts`

```typescript
type CountryVO = {
  alpha3Code: string;   // PK, ISO-kod t.ex. "SWE"
  alpha2Code: string;   // t.ex. "SE"
  name: string;         // t.ex. "Sweden"
  emoji: string;        // t.ex. "🇸🇪"
};
```

**Källa:** `countries` tabell i databas (249 länder seeded)

### EntityTypeVO
Entitetstyper - klassificering av entiteter (Legal, Business Unit, Operations, etc).

**Fil:** `src/domain/value-objects/entity-type.vo.ts`

```typescript
type EntityTypeVO = {
  id: number;              // 15=Legal, 16=BusinessUnit, etc
  name: string;            // T.ex. "Legal Entity"
  emoji?: string;          // T.ex. "⚖️"
  description?: string;    // Beskrivning
};
```

**Seeded data:**
- 15: Legal Entity (⚖️)
- 16: Business Unit (🏢)
- 17: Operations (⚙️)
- 18: Regional (🗺️)
- 19: Board (👥)
- 20: Reporting Unit (📊)

### LegalTypeVO
Juridiska enheters klassificering.

**Fil:** `src/domain/value-objects/legal-type.vo.ts`

```typescript
type LegalTypeVO = {
  id: number;
  name: string;            // T.ex. "Private Limited Company"
  emoji?: string;
};
```

### LegalSetupVO
Juridisk struktur/form (AB, ApS, etc).

**Fil:** `src/domain/value-objects/legal-setup.vo.ts`

```typescript
type LegalSetupVO = {
  id: number;
  name: string;            // T.ex. "Aktiebolaget (AB)"
  emoji?: string;
};
```

### EntityStatusVO
Entity-status (Active, Archived, Draft).

**Fil:** `src/domain/value-objects/entity-status.vo.ts`

```typescript
type EntityStatusVO = {
  id: number;
  name: string;            // 'Draft' | 'Published' | 'Archived'
};
```

### BoardTypeVO
Styrelse-klassificering.

**Fil:** `src/domain/value-objects/board.vo.ts`

```typescript
type BoardTypeVO = {
  id: number;
  name: string;            // T.ex. "Board of Directors"
  emoji?: string;
};
```

---

## 3. Read Models (Presentation-optimerad data)

Read Models är optimerade vyer för presentationslager - de kombinerar entity-data med relaterad metadata.

### TreeViewEntity
Hierarkisk data för tree-view navigation.

**Fil:** `src/domain/read-models/entity.treeview.ts`

```typescript
type TreeViewEntity = {
  id: number;              // Entity ID
  parentId: number | null;  // Parent entity ID (null för root)
  name: string;            // Display: "DisplayName (localId)" eller bara "DisplayName"
  class: string;           // Entity type name från entityTypes, t.ex. "Legal Entity"
};
```

**Användning:** `/api/metadata/entities/treeview` API returnerar `TreeViewEntity[]`

**Dataflöde:**
1. Repository fetchar från `entities` med LEFT JOIN `entityTypes`
2. Mappar till `TreeViewEntity[]`
3. React-komponenten initialiserar `treeview.js` med denna data
4. Klick på nod triggrar custom event med `path: TreeViewEntity[]`
5. Breadcrumb.js visar navigeringsvägen

### LegalReadBase
Base read model för entiteter.

**Fil:** `src/domain/read-models/entity.read-base.ts`

```typescript
type EntityReadBase = {
  id: number;
  displayName: string;
  entityTypeId: number;
  entityTypeName: string;     // ✓ Enriched
  entityTypeEmoji?: string;   // ✓ Enriched
  // ... andra base fields
};
```

### LegalReadModel
Optimerad presentationsvyn för juridiska entiteter med all relaterad metadata i ett objekt.

**Fil:** `src/domain/read-models/legal.read.ts`

```typescript
type LegalReadModel = EntityReadBase & {
  // Legal-specifika fält
  localId?: string | null;
  localIdSource?: string | null;
  hasEmployees?: boolean;
  numberOfEmployees?: number | null;

  // ✓ Enriched VOs (hämtat via parallel requests)
  country: CountryVO;          // Från countries tabell
  legalType: LegalTypeVO;      // Från legalTypes tabell
  legalSetup: LegalSetupVO;    // Från legalSetups tabell
};
```

**Dataflöde:**
1. `LegalRepository.getLegalEntityWithMetadata(id)` hämtar entity
2. Parallelt fetchar metadata via `Promise.all()`:
   - `CountryRepository.getCountryByCode(countryAlpha3Code)`
   - `LegalTypeRepository.getLegalTypeById(legalTypeId)`
   - `LegalSetupRepository.getLegalSetupById(legalSetupId)`
3. Kombinerar till en enda `LegalReadModel` objekt
4. React-komponenten (`LegalReadView`) renderar med all data

---

## 4. Database Mappning

### Entities Table → Typ Mappning

```
Database Column          | TypeScript Type      | Use Case
-------------------------|----------------------|------------------
entities.id              | EntityBase.id        | Primärnyckel
entities.displayName     | EntityBase.displayName | Visningsnamn
entities.entityType (FK) | EntityBase.entityTypeId | Vilken typ?
entities.parentId        | EntityDb.parentId    | Hierarki
entities.status          | EntityBase.status    | Active/Inactive
entities.validFrom       | EntityBase.validFrom | Tid giltighet
entities.countryAlpha3Code | LegalEntity.countryAlpha3Code | FK
entities.legalTypeId     | LegalEntity.legalTypeId | FK
entities.legalSetupId    | LegalEntity.legalSetupId | FK
entities.boardTypeId     | BoardEntity.boardTypeId | FK
entities.constitutedDate | BoardEntity.constitutedDate | Board datum
```

---

## 5. Type Flows

### CREATE-FLOW (Entity Creation)
```
Form Input 
  → Server Action
    → EntityRepository.createEntity(EntityDb)
      → INSERT entities
        → RETURN new entity
          → Redirect to detail page
```

### READ-FLOW (Entity Display)
```
Page Route [id]
  → Check entityTypeId (15=Legal, 19=Board)
    → LegalRepository.getLegalEntityWithMetadata(id)
      ├─ getEntityById(id) → EntityDb
      ├─ CountryRepository.getCountryByCode() → CountryVO
      ├─ LegalTypeRepository.getLegalTypeById() → LegalTypeVO
      └─ LegalSetupRepository.getLegalSetupById() → LegalSetupVO
        → LegalEntityView / BoardEntityView
          → React Component (LegalReadView / BoardReadView)
            → Render with enriched data
```

### TREEVIEW-FLOW (Hierarchy)
```
API /api/metadata/entities/treeview
  → EntityRepository.getEntitiesForTreeView()
    → SELECT * FROM entities 
      LEFT JOIN entityTypes 
        → TreeViewEntity[]
          ← JSON Response
            ← Client fetch
              ← React Component useEffect
                ← Initialize treeview.js
                  ← Display hierarchy
                    ← Click triggers nodeClick event
                      ← Pass path to breadcrumb.js
```

---

## 6. Repository Methods

### EntityRepository
```typescript
class EntityRepository {
  getEntityById(id: number): Promise<EntityDb | null>
  createEntity(entity: EntityDb): Promise<EntityDb>
  updateEntity(id: number, updates: Partial<EntityDb>): Promise<EntityDb | null>
  deleteEntity(id: number): Promise<void>
  getEntitiesForTreeView(): Promise<TreeViewEntity[]>  // ← With SQL JOIN
}
```

### LegalRepository
```typescript
class LegalRepository {
  getLegalEntityWithMetadata(id: number): Promise<LegalEntityView>
    // Uses Promise.all() för parallel enrichment
}
```

### CountryRepository
```typescript
class CountryRepository {
  getCountries(): Promise<CountryVO[]>
  getCountryByCode(code: string): Promise<CountryVO | null>
  createCountry(country: CountryVO): Promise<CountryVO>
  updateCountry(code: string, updates: Partial<CountryVO>): Promise<CountryVO | null>
  deleteCountry(code: string): Promise<void>
}
```

---

## 7. API Routes

### GET /api/metadata/entities/treeview
Returnerar alla entiteter i hierarkisk struktur för tree-view.

**Response:**
```json
[
  {
    "id": 1,
    "parentId": null,
    "name": "Scania",
    "class": "Business Unit"
  },
  {
    "id": 2,
    "parentId": 1,
    "name": "EMEA Region",
    "class": "Regional"
  }
]
```

### GET /api/metadata/countries
Returnerar alla länder.

### GET /api/metadata/entitytypes
Returnerar alla entitetstyper.

---

## 8. Component Props & Input Types

### EntityTreeView Component
```typescript
interface EntityTreeViewProps {
  // Props ingår i komponenten (data fetched från API)
  // Ingen input - komponenten fetchar själv från /api/metadata/entities/treeview
}

// Events från vanilla JS:
// window.Tree dispatches: CustomEvent('nodeClick', { detail: { node, path } })
// path: TreeViewEntity[] (vägen från root till klickad nod)
```

### LegalCreateForm / BoardCreateForm
```typescript
// Server Action input
interface CreateEntityInput {
  displayName: string;
  entityTypeId: number;
  countryAlpha3Code?: string;
  // ... etc
}
```

---

## 9. Naming Conventions

| Pattern | Example | Meaning |
|---------|---------|---------|
| `*VO` | `CountryVO` | Value Object (immutable, lookup data) |
| `*Entity` | `LegalEntity` | Domain entity med discriminator |
| `*EntityView` | `LegalEntityView` | Entity + enriched metadata |
| `*ReadModel` | `LegalReadModel` | Optimized read-only presentation view |
| `*Repository` | `CountryRepository` | Data access layer |
| `get*ById` | `getCountryByCode` | Fetch single item |
| `get*s` | `getCountries` | Fetch collection |

---

## 10. Type Safety

### Database → TypeScript Pipeline
```
.sql schema (Drizzle tables)
  ↓
Drizzle type inference
  ↓
Repository returns EntityDb / CountryVO / etc
  ↓
Services/API type-check
  ↓
React components with strict props typing
```

### Key Type Files Reference
- `src/domain/entities/` - Entity types
- `src/domain/value-objects/` - VO types
- `src/domain/read-models/` - Presentation types
- `src/lib/types/` - Utility types

---

## Summary

| Type Category | Purpose | Ownership | Persistence |
|---------------|---------|-----------|------------|
| **Entity** | Domänobjekt | Services | Database |
| **Value Object** | Immutable lookup | Repository | Read-only tables |
| **Read Model** | Presentation-optimized | Service | Computed/Cached |
| **VO** | Reference data | Database seeds | Static reference |

Denna arkitektur möjliggör:
- ✅ Type-safe queries
- ✅ Clear separation of concerns
- ✅ Optimized read models
- ✅ Parallel data enrichment
- ✅ Testability
