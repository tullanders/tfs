# Förutsättningar
Next.JS-applikation för att hantera Traton Financial Services organisation och entititer. Entiteter skall kunna visas, skapas, redigeras och tas bort (CRUD)

## Entiteter
Alla entiteter som ska finnas i trädstrukturen har en gemensam uppsättning egenskaper, exempel:

* id
* localId
* localIdSource
* displayName
* validFrom
* validTo
* entityType (enum, något av ovanstående)
* version 
* status (archived, published, draft)
* countryAlpha3Code
* modifiedDateTime
* modifiedBy (e-post)
* createdDateTime
* createdBy (e-post)

Det kommer finnas följande entiteter i trädet:
* **Legal** - legala bolag. Exempel på specifika egenskaper hos Legal:
    * hasEmployees
    * numberOfEmployees
    * LegalSetUp (från uppslagstabell)
    * LegalType (från uppslagstabell eller enum)
* **Business** - entiteter kopplat till bolagens varumärken
* **Operations** - entiteter kopplat till Operations
* **Regional** - entiteter kopplat till en geografisk struktur
* **Board** - entitet för en styrelse
* **Reporting Unit** - entiteter som kommer användas som "leaf" i trädstrukturen (se nedan)

Jag använder TPH (Tables per hierarchy) där alla entiteter samsas i samma tabell.



## Struktur
Varje entitet har en trädstruktur som består endast av en specifik entitetstyp. En entitet kan förekomma på flera ställen i trädet.

* **Legal** - Legal kan endast ha legal som parent (förutom null för top level entiteter). Däremot kan en nod i legal-trädet ha en eller flera Reporting Units som leafnod i strukturen. 
* **Business** - som ovan. Ett träd av Business-entiteter innehåller endast entiteter av samma slag, förutom att de kan ha en Reporting Unit som Leaf
* **Operations** - som ovan. Ett träd av Operations-entiteter innehåller endast entiteter av samma slag, förutom att de kan ha en Reporting Unit som Leaf
* **Regional** - som ovan. Ett träd av Regional-entiteter innehåller endast entiteter av samma slag, förutom att de kan ha en Reporting Unit som Leaf
* **Reporting Unit** - Reporting Unit kan förekomma i alla träd ovan och ENDAST som leaf-nod. En Reporting Unit kan alltså *inte* ha en av ovanstående entiteter som child.

## UX
**TreeView**

Applikationen skall ha en treeview till vänster. Den måste hålla state oavsett om man klickar på read/create/update/delete för samtliga eniteter.

Entiteterna skall samsas i samma treeview, det innebär att alla entiteter (utom board och reporting unit) kommer vara rot-noder.

**BreadCrumb**

Applikationen skall ha en breadcrumb. Den skall visa vägen 

## Krav

### Versionshantering
Inga entiteter får uppdateras eller tas bort. Om man redigerar t.ex. en Legal och sparar skall föregående version sättas status = archived medan den nya versionen skall få status = published samt version = version + 1

## Frågeställningar
### Table per hiearchy
Är det en bra approach? För- och nackdelar?

### Bas type?
Eftersom alla entiteter delar en uppsättning av egenskaper, ska man skapa en bas type?

### Databas
#### ORM
Är det lämpligt att hantera databas med ORM-lager som Drizzle eller Prisma? Hur hanteras uppslagstabeller? Hur kan projektet bli snabbare med ORM?

### React
Hur skall jag bygga sid- och komponentstrukturen?

**Förslag 1**

Här villkorsstyr jag vilken komponent som laddas baserat på entityType (om 23 är Legal skall motsvarande legal-komponenter hämtas)
/entities/23 (read)
/entities/23/edit (edit)
/entites/23/create (create med 23 som parentId - kan jag ha nullvärde för rot nivå?)

**Förslag 2**
/legal/23 (read för legal)
/business/24 (read för business)
o.s.v.
