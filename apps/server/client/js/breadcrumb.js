(function () {
    'use strict';

    /**
     * Creates a breadcrumb navigation from a path array
     * @param {Array} path - Array of objects with id, parentId, and title
     * @returns {HTMLUListElement} - A ul element containing the breadcrumb items
     */
    function createBreadcrumb(path) {
        if (!Array.isArray(path)) {
            throw new Error('Path must be an array');
        }

        const ul = document.createElement('ul');
        ul.className = 'breadcrumb';

        path.forEach((node, index) => {
            const li = document.createElement('li');
            li.className = 'breadcrumb-item';
            
            // Store data attributes
            li.dataset.nodeId = node.id;
            li.dataset.parentId = node.parentId;
            li.dataset.title = node.title;

            // Create link or span depending on if it's the last item
            const isLast = index === path.length - 1;
            
            if (isLast) {
                // Last item is not clickable
                const span = document.createElement('span');
                span.textContent = node.title;
                span.className = 'breadcrumb-current';
                li.appendChild(span);
            } else {
                // Other items are clickable links
                const a = document.createElement('a');
                a.href = '#';
                a.textContent = node.title;
                a.dataset.nodeId = node.id;
                
                // Add optional class if present
                if (node.class) {
                    a.className = node.class;
                }
                
                // Add click event that can be listened to
                a.addEventListener('click', function(event) {
                    event.preventDefault();
                    
                    // Build path up to this node (not including nodes after it)
                    const pathToNode = path.slice(0, index + 1);
                    
                    const clickEvent = new CustomEvent('breadcrumbClick', {
                        detail: {
                            node: {
                                id: node.id,
                                parentId: node.parentId,
                                title: node.title,
                                class: node.class || null
                            },
                            path: pathToNode,
                            element: a,
                            index: index
                        }
                    });
                    ul.dispatchEvent(clickEvent);
                });
                
                li.appendChild(a);
            }

            ul.appendChild(li);
        });

        return ul;
    }

    // Export to global scope
    if (typeof window !== 'undefined') {
        window.createBreadcrumb = createBreadcrumb;
    } else if (typeof global !== 'undefined') {
        global.createBreadcrumb = createBreadcrumb;
    }

}());