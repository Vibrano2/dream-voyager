import express from 'express';
import {
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
} from '../controllers/blogController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getBlogs);
router.get('/:id', getBlogById);

// Admin routes
router.post('/', requireAuth, requireRole(['admin']), createBlog);
router.put('/:id', requireAuth, requireRole(['admin']), updateBlog);
router.delete('/:id', requireAuth, requireRole(['admin']), deleteBlog);

export default router;
