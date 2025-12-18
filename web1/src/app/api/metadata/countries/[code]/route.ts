import { CountryRepository } from '@/repositiories/country.repository';
import { NextRequest, NextResponse } from 'next/server';

const countryRepository = new CountryRepository();

/**
 * GET /api/metadata/countries/[code]
 * Hämta ett specifikt land efter alpha3Code
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    const country = await countryRepository.getCountryByCode(code);

    if (!country) {
      return NextResponse.json(
        { error: 'Country not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(country);
  } catch (error: any) {
    console.error('Error fetching country:', error);
    return NextResponse.json(
      { error: 'Failed to fetch country' },
      { status: 500 }
    );
  }
}
