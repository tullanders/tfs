'use client'

import { useEffect, useRef, useState } from 'react'
import { TreeViewEntity } from '@/domain/read-models/entity.treeview'

declare global {
  interface Window {
    Tree: any
    createBreadcrumb: any
  }
}

export function EntityTreeView() {
  const treeviewRef = useRef<HTMLUListElement>(null)
  const breadcrumbRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTreeData = async () => {
      try {
        const response = await fetch('/api/metadata/entities/treeview')
        if (!response.ok) {
          throw new Error('Failed to load tree data')
        }
        const data: TreeViewEntity[] = await response.json()
        
        if (!treeviewRef.current || !breadcrumbRef.current) {
          return
        }

        if (!window.Tree || !window.createBreadcrumb) {
          setError('Tree or Breadcrumb library not loaded')
          return
        }

        // Initiera treeview
        const tree = new window.Tree({
          treeview: treeviewRef.current,
        })

        tree.load(data)

        // Lyssna på nodeClick events
        const handleNodeClick = (event: Event) => {
          const customEvent = event as CustomEvent
          const path = customEvent.detail.path

          // Rensa föregående breadcrumb
          breadcrumbRef.current!.innerHTML = ''

          // Skapa och rendera ny breadcrumb
          if (path && path.length > 0) {
            const breadcrumbEl = window.createBreadcrumb(path)
            breadcrumbRef.current!.appendChild(breadcrumbEl)

            // Lyssna på breadcrumb clicks för att navigera tillbaka
            breadcrumbEl.addEventListener('breadcrumbClick', (e: Event) => {
              const breadcrumbEvent = e as CustomEvent
              const clickedNodeId = breadcrumbEvent.detail.node.id

              // Markera nod i treeview och uppdatera breadcrumb
              const nodeElement = treeviewRef.current?.querySelector(
                `li[data-node-id="${clickedNodeId}"]`
              ) as HTMLElement | null

              if (nodeElement) {
                // Klicka på länken för att trigga tree:s event
                const link = nodeElement.querySelector('a')
                if (link) {
                  link.click()
                }
              }
            })
          }
        }

        treeviewRef.current.addEventListener('nodeClick', handleNodeClick)

        setLoading(false)
      } catch (err) {
        console.error('Error loading tree:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    loadTreeData()
  }, [])

  if (loading) {
    return <div>Läser organisationsöversikt...</div>
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>
  }

  return (
    <div className="entity-tree-view">
      <div ref={breadcrumbRef} className="breadcrumb-container" />
      <ul ref={treeviewRef} className="treeview" />
    </div>
  )
}
