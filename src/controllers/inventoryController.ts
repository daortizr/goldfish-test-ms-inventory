import { Request, Response, NextFunction } from 'express';
import addProductUseCase from '../useCases/inventory/addProductUseCase';
import processBuyUseCase from '../useCases/inventory/processBuyUseCase';
import queryProductQuantityUseCase from '../useCases/inventory/queryProductQuantityUseCase';

export const inventoryController = {
  getAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // TODO: Implement get all inventory items
      res.json({
        message: 'Get all inventory items',
        data: []
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      // TODO: Implement get inventory item by id
      res.json({
        message: `Get inventory item with id: ${id}`,
        data: null
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await addProductUseCase(req.body);
      res.status(201).json({
        message: result.message,
        data: result
      });
    } catch (error) {
      const err = error as Error;
      const statusCode = err.message === 'Product not found' ? 404 : 400;
      res.status(statusCode).json({
        error: 'Validation error',
        message: err.message
      });
    }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      // TODO: Implement update inventory item
      res.json({
        message: `Update inventory item with id: ${id}`,
        data: null
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      // TODO: Implement delete inventory item
      res.json({
        message: `Delete inventory item with id: ${id}`,
        data: null
      });
    } catch (error) {
      next(error);
    }
  },

  processBuy: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await processBuyUseCase(req.body);
      res.json({
        message: result.message,
        data: result
      });
    } catch (error) {
      const err = error as Error;
      let statusCode = 400;
      
      if (err.message === 'Product not found') {
        statusCode = 404;
      } else if (err.message.includes('Insufficient inventory')) {
        statusCode = 409; // Conflict
      } else if (err.message.includes('unavailable')) {
        statusCode = 503; // Service Unavailable
      }
      
      res.status(statusCode).json({
        error: statusCode === 404 ? 'Not found' : 'Validation error',
        message: err.message
      });
    }
  },

  queryProductQuantity: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { productId } = req.query;
      const result = await queryProductQuantityUseCase(
        productId ? { productId: productId as string } : undefined
      );
      res.json({
        message: result.message,
        data: result.products
      });
    } catch (error) {
      const err = error as Error;
      const statusCode = err.message === 'Product not found' ? 404 : 400;
      res.status(statusCode).json({
        error: statusCode === 404 ? 'Not found' : 'Validation error',
        message: err.message
      });
    }
  }
};

