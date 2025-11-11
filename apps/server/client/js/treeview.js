// Define our constructor
export default class Tree {
    constructor(options) {
        // Validate options
        if (!options || typeof options !== 'object') {
            throw new Error('Tree requires an options object');
        }
        
        if (!options.treeview || !(options.treeview instanceof HTMLElement)) {
            throw new Error('Tree requires a valid treeview element');
        }

        // Instance-specific properties (not global)
        this._ul = options.treeview;
        this._nodes = [];
        this._eventListeners = new WeakMap(); // Track event listeners for cleanup
    }

    load(nodes, parentId = 0) {
        if (!Array.isArray(nodes)) {
            throw new Error('Nodes must be an array');
        }

        this._nodes = nodes;
        console.log('Loading nodes:', nodes);
        
        this._renderNodes(nodes, parentId, this._ul);
    }

    _renderNodes(nodes, parentId, parentElement) {
        const nodesToRender = nodes.filter(node => node.parentId === parentId);
        
        nodesToRender.forEach(node => {
            const li = this._createLi(node);
            parentElement.appendChild(li);
            
            // Check if node has children
            const children = nodes.filter(n => n.parentId === node.id);
            if (children.length > 0) {
                const ul = document.createElement('ul');
                ul.classList.add('hidden');
                li.appendChild(ul);
                li.classList.add('hasChild', 'hasHidden');
                
                this._renderNodes(nodes, node.id, ul);
            }
        });
    }

    addNode(node) {
        if (!node || typeof node !== 'object') {
            throw new Error('Invalid node object');
        }

        // Add to internal nodes array
        this._nodes.push(node);

        const newLi = this._createLi(node);
        
        if (node.parentId === 0 || !node.parentId) {
            this._ul.appendChild(newLi);
            return newLi;
        }

        const selectedLi = this._ul.querySelector('li.selected');
        if (!selectedLi) {
            console.warn('No node selected, adding to root');
            this._ul.appendChild(newLi);
            return newLi;
        }

        let currentUl = selectedLi.querySelector('ul');
        if (!currentUl) {
            currentUl = document.createElement('ul');
            selectedLi.appendChild(currentUl);
            selectedLi.classList.add('hasChild');
        }

        currentUl.appendChild(newLi);
        selectedLi.classList.remove('hasHidden');
        currentUl.classList.remove('hidden');
        
        return newLi;
    }

    editNode(node) {
        if (!node || !node.title) {
            throw new Error('Invalid node object or missing title');
        }

        const selectedLi = this._ul.querySelector('li.selected');
        if (!selectedLi) {
            console.warn('No node is selected');
            return false;
        }

        const selectedA = selectedLi.querySelector('a');
        if (selectedA) {
            selectedA.textContent = node.title;
            
            // Update internal nodes array
            const nodeIndex = this._nodes.findIndex(n => n.id === node.id);
            if (nodeIndex !== -1) {
                this._nodes[nodeIndex] = { ...this._nodes[nodeIndex], ...node };
            }
            
            return true;
        }
        
        return false;
    }

    removeNode() {
        const selectedLi = this._ul.querySelector('li.selected');
        
        if (!selectedLi) {
            console.warn('No node is selected');
            return false;
        }

        // Get node ID before removing
        const nodeId = selectedLi.dataset.nodeId;
        
        // Remove from internal nodes array
        if (nodeId) {
            this._removeNodeRecursive(parseInt(nodeId));
        }

        // Clean up event listeners
        this._cleanupEventListeners(selectedLi);
        
        // Remove from DOM
        const parentUl = selectedLi.parentElement;
        parentUl.removeChild(selectedLi);
        
        // If parent ul is empty and not root, remove hasChild class
        if (parentUl !== this._ul && parentUl.children.length === 0) {
            const parentLi = parentUl.parentElement;
            if (parentLi) {
                parentLi.classList.remove('hasChild', 'hasHidden');
                parentUl.remove();
            }
        }
        
        return true;
    }

    _removeNodeRecursive(nodeId) {
        // Find and remove all child nodes first
        const children = this._nodes.filter(n => n.parentId === nodeId);
        children.forEach(child => this._removeNodeRecursive(child.id));
        
        // Remove the node itself
        this._nodes = this._nodes.filter(n => n.id !== nodeId);
    }

    _createLi(node) {
        const li = document.createElement('li');
        li.dataset.nodeId = node.id; // Store node ID for reference
        li.dataset.title = node.title;
        li.dataset.parentId = node.parentId;
        
        const a = document.createElement('a');
        a.href = "#";
        a.textContent = node.title;
        a.draggable = true;
        
        // Add optional class to the anchor element
        if (node.class) {
            a.className = node.class;
        }

        // Click handler for selection
        const clickHandler = (event) => {
            event.preventDefault();
            this._selectNode(li);
            
            const nodeClickEvent = new CustomEvent('nodeClick', { 
                detail: { 
                    element: a, 
                    node: node,
                    path: this._getNodePath(node.id)
                }
            });
            this._ul.dispatchEvent(nodeClickEvent);
        };
        
        a.addEventListener('click', clickHandler);
        
        // Toggle handler for expand/collapse - på li elementet
        const toggleHandler = (event) => {
            // Kolla om klicket var på li-elementet direkt (dvs pilen)
            // och inte på länken
            if (event.target === li && li.classList.contains('hasChild')) {
                event.preventDefault();
                event.stopPropagation();
                
                li.classList.toggle('hasHidden');
                const ul = li.querySelector('ul');
                if (ul) {
                    ul.classList.toggle('hidden');
                }
            }
        };
        
        li.addEventListener('click', toggleHandler);
        
        // Store event listeners for cleanup
        this._eventListeners.set(li, { clickHandler, toggleHandler });
        
        li.appendChild(a);

        // Dispatch nodeAdded event
        const nodeAddedEvent = new CustomEvent('nodeAdded', { 
            detail: { node: node, element: li }
        });
        this._ul.dispatchEvent(nodeAddedEvent);
        
        return li;
    }

    _selectNode(li) {
        // Remove previous selection
        const selected = this._ul.querySelectorAll('.selected');
        selected.forEach(el => el.classList.remove('selected'));
        
        // Add selection to new node
        li.classList.add('selected');
    }

    _cleanupEventListeners(element) {
        // Remove event listeners from the element and all its children
        const allElements = [element, ...element.querySelectorAll('li')];
        
        allElements.forEach(el => {
            const listeners = this._eventListeners.get(el);
            if (listeners) {
                // In practice, we can't remove listeners without references
                // But we track them for potential future use
                this._eventListeners.delete(el);
            }
        });
    }

    getSelectedNode() {
        const selectedLi = this._ul.querySelector('li.selected');
        if (!selectedLi) return null;
        
        const nodeId = parseInt(selectedLi.dataset.nodeId);
        return this._nodes.find(n => n.id === nodeId) || null;
    }

    _getNodePath(nodeId) {
        const path = [];
        
        // Find the li element with the given nodeId
        let currentLi = this._ul.querySelector(`li.selected`);
        
        // Traverse up the tree from the current li to root
        while (currentLi && currentLi.tagName === 'LI') {
            path.unshift({
                id: parseInt(currentLi.dataset.nodeId),
                parentId: parseInt(currentLi.dataset.parentId),
                title: currentLi.dataset.title
            });
            
            // Move to parent li element
            const parentUl = currentLi.parentElement;
            if (parentUl && parentUl !== this._ul) {
                currentLi = parentUl.parentElement;
            } else {
                currentLi = null;
            }
        }
        
        return path;
    }

    expandAndSelectByPath(path) {
        if (!Array.isArray(path) || path.length === 0) {
            console.warn('Path must be a non-empty array');
            return false;
        }

        // Iterate through each node in the path
        for (let i = 0; i < path.length; i++) {
            const node = path[i];
            
            // Use querySelectorAll to get all li elements with this id
            // and find the right one by checking the parent hierarchy
            const allLisWithId = Array.from(
                this._ul.querySelectorAll(`li[data-node-id="${node.id}"]`)
            );
            
            let li = null;
            
            if (allLisWithId.length === 1) {
                // Only one match, use it
                li = allLisWithId[0];
            } else if (allLisWithId.length > 1) {
                // Multiple matches - find the correct one by verifying parent path
                for (const candidate of allLisWithId) {
                    // Verify this li has the correct parent by checking parentId
                    if (i === 0) {
                        // Root level node - should be direct child of this._ul
                        if (candidate.parentElement === this._ul) {
                            li = candidate;
                            break;
                        }
                    } else {
                        // Check if parent node id matches
                        const parentLi = candidate.parentElement?.parentElement;
                        if (parentLi && 
                            parentLi.tagName === 'LI' && 
                            parseInt(parentLi.dataset.nodeId) === path[i-1].id) {
                            li = candidate;
                            break;
                        }
                    }
                }
            }
            
            if (!li) {
                console.warn(`Node with id ${node.id} not found in correct position`);
                return false;
            }

            // If this is not the last node in path, expand it
            if (i < path.length - 1) {
                if (li.classList.contains('hasHidden')) {
                    // Expand the node
                    li.classList.remove('hasHidden');
                    const ul = li.querySelector('ul');
                    if (ul) {
                        ul.classList.remove('hidden');
                    }
                }
            } else {
                // Last node in path - select it
                this._selectNode(li);
            }
        }

        return true;
    }

    destroy() {
        // Clean up all event listeners
        const allLis = this._ul.querySelectorAll('li');
        allLis.forEach(li => this._cleanupEventListeners(li));
        
        // Clear the tree
        this._ul.innerHTML = '';
        this._nodes = [];
    }
}