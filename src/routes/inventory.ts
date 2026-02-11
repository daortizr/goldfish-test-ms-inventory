import { Router } from 'express';
import { inventoryController } from '../controllers/inventoryController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all inventory routes
router.use(authenticate);

/**
 * @swagger
 * /api/inventory/quantities:
 *   get:
 *     summary: Consultar cantidades de productos
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del producto (opcional). Si no se proporciona, retorna todas las cantidades
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Cantidades de productos recuperadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductQuantityResponse'
 *             example:
 *               message: "Cantidades de productos recuperadas exitosamente"
 *               data:
 *                 - productId: "123e4567-e89b-12d3-a456-426614174000"
 *                   productName: "Laptop Dell XPS 15"
 *                   quantity: 50
 *                 - productId: "223e4567-e89b-12d3-a456-426614174001"
 *                   productName: "Mouse Logitech MX Master"
 *                   quantity: 100
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/quantities', inventoryController.queryProductQuantity);

router.get('/', inventoryController.getAll);

router.get('/:id', inventoryController.getById);

router.post('/', inventoryController.create);

/**
 * @swagger
 * /api/inventory/buy:
 *   post:
 *     summary: Procesar una compra y actualizar inventario
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProcessBuyRequest'
 *           example:
 *             productId: "123e4567-e89b-12d3-a456-426614174000"
 *             quantity: 5
 *     responses:
 *       200:
 *         description: Compra procesada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProcessBuyResponse'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "No encontrado"
 *               message: "Producto no encontrado"
 *       409:
 *         description: Inventario insuficiente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Error de validación"
 *               message: "Inventario insuficiente. Disponible: 10, Solicitado: 15"
 *       503:
 *         description: Servicio de productos no disponible
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Error de validación"
 *               message: "El servicio de productos no está disponible"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/buy', inventoryController.processBuy);

router.put('/:id', inventoryController.update);

router.delete('/:id', inventoryController.delete);

export default router;
