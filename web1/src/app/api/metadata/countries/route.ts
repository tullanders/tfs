import { CountryRepository } from '@/repositiories/country.repository';
import { NextRequest, NextResponse } from 'next/server';

const countryRepository = new CountryRepository();

/**
 * GET /api/metadata/countries
 * Hämta alla länder
 */
export async function GET() {
  try {
    const countries = await countryRepository.getCountries();
    return NextResponse.json(countries);
  } catch (error: any) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/metadata/countries
 * Skapa ett nytt land
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { alpha3Code, alpha2Code, name, emoji } = body;

    // Validering
    if (!alpha3Code || !alpha2Code || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: alpha3Code, alpha2Code, name' },
        { status: 400 }
      );
    }

    const newCountry = await countryRepository.createCountry({
      alpha3Code,
      alpha2Code,
      name,
      emoji: emoji || '',
    });

    return NextResponse.json(newCountry, { status: 201 });
  } catch (error: any) {
    console.error('Error creating country:', error);

    // Check for duplicate key constraint
    if (error.code === '23505' || error.message?.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'Country with this code already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create country' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/metadata/countries
 * Uppdatera ett befintligt land
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { alpha3Code, alpha2Code, name, emoji } = body;

    if (!alpha3Code) {
      return NextResponse.json(
        { error: 'Missing required field: alpha3Code' },
        { status: 400 }
      );
    }

    const updated = await countryRepository.updateCountry(alpha3Code, {
      alpha2Code,
      name,
      emoji: emoji || '',
    });

    if (!updated) {
      return NextResponse.json(
        { error: 'Country not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error('Error updating country:', error);
    return NextResponse.json(
      { error: 'Failed to update country' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/metadata/countries?alpha3Code=SWE
 * Radera ett land
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const alpha3Code = searchParams.get('alpha3Code');

    if (!alpha3Code) {
      return NextResponse.json(
        { error: 'Missing required parameter: alpha3Code' },
        { status: 400 }
      );
    }

    // Verifiera att landet finns innan delete
    const existing = await countryRepository.getCountryByCode(alpha3Code);
    if (!existing) {
      return NextResponse.json(
        { error: 'Country not found' },
        { status: 404 }
      );
    }

    await countryRepository.deleteCountry(alpha3Code);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting country:', error);

    // Check for foreign key constraint violation
    if (error.code === '23503' || error.message?.includes('foreign key')) {
      return NextResponse.json(
        { error: 'Cannot delete country because it is referenced by other records' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete country' },
      { status: 500 }
    );
  }
}
