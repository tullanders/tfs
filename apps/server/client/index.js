import { Eta } from 'eta';
import Tree from './js/treeview.js';

const eta = new Eta({ 
  cache: false 
});

const breadcrumbContainer = document.getElementById('breadcrumb-container');
function updateBreadcrumb(path) {
    breadcrumbContainer.innerHTML = '';
    const breadcrumb = createBreadcrumb(path);
    breadcrumbContainer.appendChild(breadcrumb);
    
    breadcrumb.addEventListener('breadcrumbClick', function(event) {
        // Expandera och välj noden i trädet
        tree.expandAndSelectByPath(event.detail.path);
        
        // Uppdatera breadcrumb rekursivt
        updateBreadcrumb(event.detail.path);
    });
}  

// Cache for templates
const templateCache = {};

// Load and render entity view
async function renderEntityView(entityId, mode = 'read') {
  try {
    // Fetch template if not cached
    const templateName = mode === 'read' ? 'entity-read.eta' : 'entity-write.eta';
    if (!templateCache[templateName]) {
      const response = await fetch(`/views/${templateName}`);
      templateCache[templateName] = await response.text();
    }
    
    // Fetch entity data
    const entityResponse = await fetch(`/api/entities/${entityId}`);
    const entityData = await entityResponse.json();
    
    // Render template with data
    const html = eta.renderString(templateCache[templateName], entityData);
    
    // Display in main content area
    document.getElementById('main-content').innerHTML = html;
    
    // Attach form handler if in write mode
    if (mode === 'write') {
      attachFormHandler(entityId);
    }
  } catch (error) {
    console.error('Error rendering entity view:', error);
    document.getElementById('main-content').innerHTML = 
      `<div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
        Error loading entity: ${error.message}
      </div>`;
  }
}

// Attach form submit handler
function attachFormHandler(entityId) {
  const form = document.getElementById('entityForm');
  if (!form) {
    console.error('Form not found');
    return;
  }
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.is_active = formData.has('is_active');
    
    const id = data.id;
    delete data.id;
    
    try {
      const url = id ? `/api/entities/${id}` : '/api/entities';
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        const entity = await response.json();
        console.log('Entity saved:', entity);
        if (window.onEntitySaved) {
          window.onEntitySaved(entity);
        }
      } else {
        const error = await response.json();
        alert(`Failed to save entity: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving entity:', error);
      alert('Error saving entity');
    }
  });
}
const treeview = document.getElementById('treeview');
const tree = new Tree({ treeview });

// Load treeview
async function loadTreeView() {
  try {
    const response = await fetch('/api/hierarchy/tree');
    const treeData = await response.json();
    
    console.log('Raw tree data:', treeData);
    
    const nodes = treeData.map(item => ({
      id: item.id,
      parentId: item.parent_id || 0,
      title: item.name,
      class: item.entity_type,
      entityId: item.entity_id
    }));
    
    console.log('Mapped nodes:', nodes);
    
    //const treeview = document.getElementById('treeview');
    
    
    tree.load(nodes);
    console.log('Tree loaded:', tree);
    
    // Handle node clicks
    treeview.addEventListener('nodeClick', (e) => {
      console.log('Clicked node:', e.detail);
      const entityId = e.detail.node.entityId;
      const path = e.detail.path;
      updateBreadcrumb(path);
      if (entityId) {
        renderEntityView(entityId, 'read');
      }
    });
  } catch (error) {
    console.error('Error loading tree:', error);
  }
}

// Global functions for template buttons
window.editEntity = (entityId) => {
  renderEntityView(entityId, 'write');
};

window.deleteEntity = async (entityId) => {
  if (!confirm('Are you sure you want to delete this entity?')) {
    return;
  }
  
  try {
    const response = await fetch(`/api/entities/${entityId}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      alert('Entity deleted successfully');
      tree.removeNode();
    } else {
      alert('Failed to delete entity');
    }
  } catch (error) {
    console.error('Error deleting entity:', error);
    alert('Error deleting entity');
  }
};

window.cancelEdit = (entityId) => {
  //document.getElementById('main-content').innerHTML = 
  //  '<p class="text-gray-500">Select an item from the tree</p>';
  renderEntityView(entityId, 'read');  
};

window.onEntitySaved = (entity) => {
  console.log('Entity saved:', entity);
  alert('Entity saved successfully!');
  renderEntityView(entity.id, 'read');
  // Reload tree to show changes
  //loadTreeView();
  tree.editNode({id: entity.id, title: entity.name });
};

// Initial rendering
document.addEventListener('DOMContentLoaded', () => {
  loadTreeView();
});