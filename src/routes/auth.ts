import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener token JWT
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login exitoso"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        error: 'Error de validación',
        message: 'Email y contraseña son requeridos'
      });
      return;
    }

    // TODO: Replace with actual user lookup from database
    // This is a simple example - in production, query your user database
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    
    // Example: Simple hardcoded user for demonstration
    // In production, you should:
    // 1. Query user from database by email
    // 2. Compare password using bcrypt.compare
    // 3. Generate JWT token
    
    // For now, we'll create a simple token for any valid email/password
    // Replace this with actual authentication logic
    const user = {
      id: '1',
      email: email,
      role: 'admin' // Get from database
    };

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role 
      },
      JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
      }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      error: 'Error interno del servidor',
      message: err.message
    });
  }
});

export default router;

