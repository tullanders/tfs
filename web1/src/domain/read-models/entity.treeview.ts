export type TreeViewEntity = {
    id: number;
    parentId: number | null;    
    name: string; // should be displayName + ' (' + localId + ')'
    class: string; // from entity type name
}

