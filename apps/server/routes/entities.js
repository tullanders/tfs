import express from 'express';
import db from '../db/index.js';

const router = express.Router();

/**
 * GET /api/entities
 * Get all entities
 */
router.get('/', async (req, res) => {
  try {
    const entities = await db.findMany('entities');
    res.json(entities);
  } catch (error) {
    console.error('Error fetching entities:', error);
    res.status(500).json({ error: 'Failed to fetch entities', message: error.message });
  }
});

/**
 * GET /api/entities/:id
 * Get a single entity by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid entity ID' });
    }
    
    const entity = await db.findOne('entities', { id });
    
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    
    res.json(entity);
  } catch (error) {
    console.error('Error fetching entity:', error);
    res.status(500).json({ error: 'Failed to fetch entity', message: error.message });
  }
});

/**
 * POST /api/entities
 * Create a new entity
 */
router.post('/', async (req, res) => {
  try {
    const { name, entity_type, legal_type, registration_number, is_active } = req.body;
    
    if (!name || !entity_type) {
      return res.status(400).json({ error: 'name and entity_type are required' });
    }
    
    const entity = await db.insert('entities', {
      name,
      entity_type,
      legal_type: legal_type || null,
      registration_number: registration_number || null,
      is_active: is_active !== false
    });
    
    res.status(201).json(entity);
  } catch (error) {
    console.error('Error creating entity:', error);
    res.status(500).json({ error: 'Failed to create entity', message: error.message });
  }
});

/**
 * PUT /api/entities/:id
 * Update an entity
 */
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid entity ID' });
    }
    
    const { name, entity_type, legal_type, registration_number, is_active } = req.body;
    
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (entity_type !== undefined) updates.entity_type = entity_type;
    if (legal_type !== undefined) updates.legal_type = legal_type;
    if (registration_number !== undefined) updates.registration_number = registration_number;
    if (is_active !== undefined) updates.is_active = is_active;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    const entity = await db.update('entities', updates, { id });
    
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    
    res.json(entity);
  } catch (error) {
    console.error('Error updating entity:', error);
    res.status(500).json({ error: 'Failed to update entity', message: error.message });
  }
});

/**
 * DELETE /api/entities/:id
 * Delete an entity
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid entity ID' });
    }
    
    const count = await db.remove('entities', { id });
    
    if (count === 0) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    
    res.json({ success: true, deleted: count });
  } catch (error) {
    console.error('Error deleting entity:', error);
    res.status(500).json({ error: 'Failed to delete entity', message: error.message });
  }
});

export default router;
