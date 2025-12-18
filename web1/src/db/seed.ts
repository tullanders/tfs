import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { countries, entityTypes } from './schema';
import { COUNTRIES } from './data/countries';

// Skapa db-instans direkt i seed-filen
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing countries...');
    await db.delete(countries);
    
    console.log('🗑️  Clearing existing entity types...');
    await db.delete(entityTypes);
    
    // Insert countries
    console.log('📍 Inserting countries...');
    await db.insert(countries).values(
      COUNTRIES.map(country => ({
        alpha3Code: country.alpha3Code,
        alpha2Code: country.alpha2Code,
        name: country.name,
        emoji: country.emoji,
      }))
    );
    console.log(`✅ Inserted ${COUNTRIES.length} countries`);

    // Insert entity types
    console.log('📍 Inserting entity types...');
    const entityTypeData = [
      { name: 'Legal Entity', emoji: '⚖️', description: 'Legal business entity' },
      { name: 'Business Unit', emoji: '🏢', description: 'Business organizational unit' },
      { name: 'Operations', emoji: '⚙️', description: 'Operations division' },
      { name: 'Regional', emoji: '🗺️', description: 'Regional office' },
      { name: 'Board', emoji: '👥', description: 'Board of directors' },
      { name: 'Reporting Unit', emoji: '📊', description: 'Financial reporting unit' },
    ];
    await db.insert(entityTypes).values(entityTypeData);
    console.log(`✅ Inserted ${entityTypeData.length} entity types`);

    console.log('🎉 Seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end(); // Stäng connection pool
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });