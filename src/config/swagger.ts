import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Microservicio de Inventario - Goldfish',
    version: '1.0.0',
    description: 'Documentación de la API REST para el microservicio de gestión de inventario',
    contact: {
      name: 'Soporte API',
      email: 'support@goldfish.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Servidor de desarrollo'
    },
    {
      url: 'https://api-inventory.goldfish.com',
      description: 'Servidor de producción'
    }
  ],
  tags: [
    {
      name: 'Inventario',
      description: 'Endpoints para la gestión de inventario (requiere autenticación)'
    },
    {
      name: 'Autenticación',
      description: 'Endpoints para autenticación y obtención de tokens'
    },
    {
      name: 'Health',
      description: 'Endpoints de salud del servicio'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingrese el token JWT obtenido del endpoint /api/auth/login'
      }
    },
    schemas: {
      AddProductRequest: {
        type: 'object',
        required: ['productId', 'quantity'],
        properties: {
          productId: {
            type: 'string',
            format: 'uuid',
            description: 'ID del producto a agregar al inventario',
            example: '123e4567-e89b-12d3-a456-426614174000'
          },
          quantity: {
            type: 'integer',
            description: 'Cantidad de productos a agregar',
            example: 10,
            minimum: 1
          },
          location: {
            type: 'string',
            description: 'Ubicación del inventario (opcional)',
            example: 'Almacén Principal'
          }
        }
      },
      ProcessBuyRequest: {
        type: 'object',
        required: ['productId', 'quantity'],
        properties: {
          productId: {
            type: 'string',
            format: 'uuid',
            description: 'ID del producto a comprar',
            example: '123e4567-e89b-12d3-a456-426614174000'
          },
          quantity: {
            type: 'integer',
            description: 'Cantidad de productos a comprar',
            example: 5,
            minimum: 1
          }
        }
      },
      AddProductResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Producto Laptop Dell XPS 15 agregado al inventario exitosamente'
          },
          data: {
            type: 'object',
            properties: {
              productId: {
                type: 'string',
                format: 'uuid',
                example: '123e4567-e89b-12d3-a456-426614174000'
              },
              productName: {
                type: 'string',
                example: 'Laptop Dell XPS 15'
              },
              quantity: {
                type: 'integer',
                example: 10
              },
              location: {
                type: 'string',
                example: 'Almacén Principal'
              },
              message: {
                type: 'string',
                example: 'Producto Laptop Dell XPS 15 agregado al inventario exitosamente'
              }
            }
          }
        }
      },
      ProcessBuyResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Compra procesada exitosamente. 5 unidades de Laptop Dell XPS 15 vendidas.'
          },
          data: {
            type: 'object',
            properties: {
              productId: {
                type: 'string',
                format: 'uuid',
                example: '123e4567-e89b-12d3-a456-426614174000'
              },
              productName: {
                type: 'string',
                example: 'Laptop Dell XPS 15'
              },
              quantityPurchased: {
                type: 'integer',
                example: 5
              },
              previousInventory: {
                type: 'integer',
                example: 100
              },
              newInventory: {
                type: 'integer',
                example: 95
              },
              message: {
                type: 'string',
                example: 'Compra procesada exitosamente. 5 unidades de Laptop Dell XPS 15 vendidas.'
              }
            }
          }
        }
      },
      ProductQuantity: {
        type: 'object',
        properties: {
          productId: {
            type: 'string',
            format: 'uuid',
            description: 'ID del producto',
            example: '123e4567-e89b-12d3-a456-426614174000'
          },
          productName: {
            type: 'string',
            description: 'Nombre del producto',
            example: 'Laptop Dell XPS 15'
          },
          quantity: {
            type: 'integer',
            description: 'Cantidad disponible en inventario',
            example: 50
          }
        }
      },
      ProductQuantityResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Cantidades de productos recuperadas exitosamente'
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ProductQuantity'
            }
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Error de validación'
          },
          message: {
            type: 'string',
            example: 'El ID del producto es requerido'
          }
        }
      }
    }
  }
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);

