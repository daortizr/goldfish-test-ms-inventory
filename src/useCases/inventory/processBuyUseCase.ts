import axios from 'axios';
import { productServiceClient } from '../../utils/productServiceClient';

interface ProcessBuyData {
  productId: string;
  quantity: number;
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

interface ProcessBuyResult {
  productId: string;
  productName: string;
  quantityPurchased: number;
  previousInventory: number;
  newInventory: number;
  message: string;
}

const processBuyUseCase = async (data: ProcessBuyData): Promise<ProcessBuyResult> => {
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
    
    // First, get the current product information
    const getProductResponse = await client.get<ProductResponse>(
      `/api/products/${data.productId}`
    );

    if (!getProductResponse.data || !getProductResponse.data.data) {
      throw new Error('Product not found');
    }

    const product = getProductResponse.data.data;
    const previousInventory = product.inventory;

    // Check if there's enough inventory
    if (previousInventory < data.quantity) {
      throw new Error(`Insufficient inventory. Available: ${previousInventory}, Requested: ${data.quantity}`);
    }

    // Calculate new inventory quantity
    const newInventory = previousInventory - data.quantity;

    // Update product inventory via PUT request
    const updateProductResponse = await client.put<ProductResponse>(
      `/api/products/${data.productId}`,
      {
        inventory: newInventory
      }
    );

    if (!updateProductResponse.data || !updateProductResponse.data.data) {
      throw new Error('Failed to update product inventory');
    }

    const updatedProduct = updateProductResponse.data.data;

    return {
      productId: product.id,
      productName: product.name,
      quantityPurchased: data.quantity,
      previousInventory,
      newInventory: updatedProduct.inventory,
      message: `Purchase processed successfully. ${data.quantity} units of ${product.name} sold.`
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
      if (status && status >= 400) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Failed to process buy: ${errorMessage}`);
      }
      throw new Error(`Failed to process buy: ${error.message}`);
    }
    throw error;
  }
};

export default processBuyUseCase;

