import express from 'express';
import db from '../db/index.js';

const router = express.Router();

/**
 * GET /api/hierarchy/tree
 * Get complete hierarchy tree with entity information
 */
router.get('/tree', async (req, res) => {
  try {
    const tree = await db.getTree();
    res.json(tree);
  } catch (error) {
    console.error('Error fetching tree:', error);
    res.status(500).json({ error: 'Failed to fetch tree', message: error.message });
  }
});

/**
 * GET /api/hierarchy/tree/:nodeId
 * Get hierarchy tree starting from a specific node
 */
router.get('/tree/:nodeId', async (req, res) => {
  try {
    const nodeId = parseInt(req.params.nodeId);
    
    if (isNaN(nodeId)) {
      return res.status(400).json({ error: 'Invalid node ID' });
    }
    
    const tree = await db.getTreeFromNode(nodeId);
    res.json(tree);
  } catch (error) {
    console.error('Error fetching tree from node:', error);
    res.status(500).json({ error: 'Failed to fetch tree from node', message: error.message });
  }
});

/**
 * GET /api/hierarchy/children/:parentId
 * Get direct children of a specific node
 */
router.get('/children/:parentId', async (req, res) => {
  try {
    const parentId = parseInt(req.params.parentId);
    
    if (isNaN(parentId)) {
      return res.status(400).json({ error: 'Invalid parent ID' });
    }
    
    const children = await db.getChildren(parentId);
    res.json(children);
  } catch (error) {
    console.error('Error fetching children:', error);
    res.status(500).json({ error: 'Failed to fetch children', message: error.message });
  }
});

/**
 * POST /api/hierarchy/node
 * Create a new hierarchy node
 */
router.post('/node', async (req, res) => {
  try {
    const { entity_id, parent_id, level } = req.body;
    
    if (!entity_id) {
      return res.status(400).json({ error: 'entity_id is required' });
    }
    
    const node = await db.insert('hierarchy', {
      entity_id,
      parent_id: parent_id || null,
      level: level || 0
    });
    
    res.status(201).json(node);
  } catch (error) {
    console.error('Error creating node:', error);
    res.status(500).json({ error: 'Failed to create node', message: error.message });
  }
});

/**
 * DELETE /api/hierarchy/node/:nodeId
 * Delete a hierarchy node
 */
router.delete('/node/:nodeId', async (req, res) => {
  try {
    const nodeId = parseInt(req.params.nodeId);
    
    if (isNaN(nodeId)) {
      return res.status(400).json({ error: 'Invalid node ID' });
    }
    
    const count = await db.remove('hierarchy', { id: nodeId });
    
    if (count === 0) {
      return res.status(404).json({ error: 'Node not found' });
    }
    
    res.json({ success: true, deleted: count });
  } catch (error) {
    console.error('Error deleting node:', error);
    res.status(500).json({ error: 'Failed to delete node', message: error.message });
  }
});

export default router;
