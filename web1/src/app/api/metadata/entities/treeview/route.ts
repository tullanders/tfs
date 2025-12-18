import { NextResponse } from 'next/server'
import { EntityRepository } from '@/repositiories/entity.repository'

export async function GET() {
  try {
    const repo = new EntityRepository()
    //const treeData = await repo.getEntitiesForTreeView()
    
    return NextResponse.json({apa:'bepa'}, {
      status: 200,
    })
  } catch (error) {
    console.error('Error fetching tree data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tree data' },
      { status: 500 }
    )
  }
}
