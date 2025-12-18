import { db } from '@/index';
import { countries } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import type { CountryVO } from '@/domain/value-objects/country.vo';

export class CountryRepository {
  async getCountries(): Promise<CountryVO[] | null> {
    const result = await db
      .select()
      .from(countries)
      .orderBy(asc(countries.name));

    if (!result[0]) return null;

    return result.map((row) => ({
      alpha3Code: row.alpha3Code,
      alpha2Code: row.alpha2Code,
      name: row.name,
      emoji: row.emoji || '',
    }));
  }

  async getCountryByCode(alpha3Code: string): Promise<CountryVO | null> {
    const result = await db
      .select()
      .from(countries)
      .where(eq(countries.alpha3Code, alpha3Code));

    if (!result[0]) return null;

    const row = result[0];
    return {
      alpha3Code: row.alpha3Code,
      alpha2Code: row.alpha2Code,
      name: row.name,
      emoji: row.emoji || '',
    };
  }

  async createCountry(country: CountryVO): Promise<CountryVO> {
    const [newCountry] = await db
      .insert(countries)
      .values({
        alpha3Code: country.alpha3Code,
        alpha2Code: country.alpha2Code,
        name: country.name,
        emoji: country.emoji || null,
      })
      .returning();

    return {
      alpha3Code: newCountry.alpha3Code,
      alpha2Code: newCountry.alpha2Code,
      name: newCountry.name,
      emoji: newCountry.emoji || '',
    };
  }

  async updateCountry(alpha3Code: string, updates: Partial<CountryVO>): Promise<CountryVO | null> {
    const [updated] = await db
      .update(countries)
      .set({
        alpha2Code: updates.alpha2Code,
        name: updates.name,
        emoji: updates.emoji || null,
      })
      .where(eq(countries.alpha3Code, alpha3Code))
      .returning();

    if (!updated) return null;

    return {
      alpha3Code: updated.alpha3Code,
      alpha2Code: updated.alpha2Code,
      name: updated.name,
      emoji: updated.emoji || '',
    };
  }

  async deleteCountry(alpha3Code: string): Promise<void> {
    await db
      .delete(countries)
      .where(eq(countries.alpha3Code, alpha3Code));
  }
}
