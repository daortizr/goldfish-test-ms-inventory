import axios from 'axios';
import { productServiceClient } from '../../utils/productServiceClient';

interface QueryProductQuantityData {
  productId?: string;
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

interface ProductsListResponse {
  message: string;
  data: Array<{
    id: string;
    name: string;
    description?: string | null;
    price: number;
    inventory: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface ProductQuantityResult {
  productId: string;
  productName: string;
  quantity: number;
}

interface QueryProductQuantityResult {
  products: ProductQuantityResult[];
  message: string;
}

const queryProductQuantityUseCase = async (
  data?: QueryProductQuantityData
): Promise<QueryProductQuantityResult> => {
  try {
    // Get authenticated axios client
    const client = await productServiceClient.getClient();

    if (data?.productId) {
      // Query specific product quantity
      const productResponse = await client.get<ProductResponse>(
        `/api/products/${data.productId}`
      );

      if (!productResponse.data || !productResponse.data.data) {
        throw new Error('Product not found');
      }

      const product = productResponse.data.data;

      return {
        products: [
          {
            productId: product.id,
            productName: product.name,
            quantity: product.inventory
          }
        ],
        message: `Product quantity retrieved successfully`
      };
    } else {
      // Query all products quantities
      const productsResponse = await client.get<ProductsListResponse>(
        `/api/products`
      );

      if (!productsResponse.data || !productsResponse.data.data) {
        throw new Error('Failed to retrieve products');
      }

      const products = productsResponse.data.data;

      const productQuantities: ProductQuantityResult[] = products.map((product) => ({
        productId: product.id,
        productName: product.name,
        quantity: product.inventory
      }));

      return {
        products: productQuantities,
        message: `Retrieved quantities for ${productQuantities.length} product(s)`
      };
    }
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
        throw new Error(`Failed to query product quantity: ${errorMessage}`);
      }
      throw new Error(`Failed to query product quantity: ${error.message}`);
    }
    throw error;
  }
};

export default queryProductQuantityUseCase;

