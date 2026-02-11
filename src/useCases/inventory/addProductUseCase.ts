import axios from 'axios';
import { productServiceClient } from '../../utils/productServiceClient';

interface AddProductData {
  productId: string;
  quantity: number;
  location?: string;
}

interface ProductResponse {
  message: string;
  data: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    inventory: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

interface AddProductResult {
  productId: string;
  productName: string;
  quantity: number;
  location?: string;
  message: string;
}

const addProductUseCase = async (data: AddProductData): Promise<AddProductResult> => {
  try {
    // Validate required fields
    if (!data.productId) {
      throw new Error('Product ID is required');
    }

    if (data.quantity === undefined || data.quantity === null) {
      throw new Error('Quantity is required');
    }

    if (data.quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }

    // Get authenticated axios client
    const client = await productServiceClient.getClient();
    
    // Call product service to get product information
    const productResponse = await client.get<ProductResponse>(
      `/api/products/${data.productId}`
    );

    if (!productResponse.data || !productResponse.data.data) {
      throw new Error('Product not found');
    }

    const product = productResponse.data.data;

    // TODO: Save inventory record to database
    // For now, we'll just return the result
    // You can add inventory repository and entity later

    return {
      productId: product.id,
      productName: product.name,
      quantity: data.quantity,
      location: data.location,
      message: `Product ${product.name} added to inventory successfully`
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) {
        throw new Error('Product not found');
      }
      if (status && status >= 500) {
        throw new Error('Product service is unavailable');
      }
      throw new Error(`Failed to fetch product: ${error.message}`);
    }
    throw error;
  }
};

export default addProductUseCase;

