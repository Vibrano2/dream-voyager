import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import {
    getPackages,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage
} from '../controllers/packageController.js';

const router = express.Router();

router.get('/', getPackages);
router.get('/:id', getPackageById);

// Admin Routes
router.post('/', requireAuth, requireRole(['admin']), createPackage);
router.put('/:id', requireAuth, requireRole(['admin']), updatePackage);
router.delete('/:id', requireAuth, requireRole(['admin']), deletePackage);

export default router;
