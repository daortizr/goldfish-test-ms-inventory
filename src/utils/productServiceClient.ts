import axios, { AxiosInstance } from 'axios';

/**
 * Client for making authenticated requests to the product service
 */
class ProductServiceClient {
  private client: AxiosInstance;
  private serviceToken: string | null = null;
  private tokenInitialization: Promise<void> | null = null;

  constructor() {
    const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3000';
    
    this.client = axios.create({
      baseURL: productServiceUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Check for token in environment first
    const envToken = process.env.PRODUCT_SERVICE_TOKEN;
    if (envToken) {
      this.serviceToken = envToken;
      this.client.defaults.headers.common['Authorization'] = `Bearer ${this.serviceToken}`;
    } else {
      // Initialize service token asynchronously
      this.tokenInitialization = this.initializeServiceToken();
    }
  }

  /**
   * Initialize service token by logging in to the product service
   */
  private async initializeServiceToken(): Promise<void> {
    try {
      const serviceEmail = process.env.SERVICE_EMAIL || 'service@inventory.goldfish.com';
      const servicePassword = process.env.SERVICE_PASSWORD || 'service-password';
      
      const loginResponse = await axios.post(
        `${process.env.PRODUCT_SERVICE_URL || 'http://localhost:3000'}/api/auth/login`,
        {
          email: serviceEmail,
          password: servicePassword
        }
      );

      if (loginResponse.data && loginResponse.data.token) {
        this.serviceToken = loginResponse.data.token;
        // Set default authorization header
        this.client.defaults.headers.common['Authorization'] = `Bearer ${this.serviceToken}`;
        console.log('Service token initialized successfully');
      }
    } catch (error) {
      console.warn('Failed to initialize service token via login. Ensure PRODUCT_SERVICE_TOKEN is set in environment.');
      // Token will remain null, requests will fail if not set via environment
    }
  }

  /**
   * Get the axios client with authentication
   * Ensures token is initialized before returning client
   */
  async getClient(): Promise<AxiosInstance> {
    // Wait for token initialization if in progress
    if (this.tokenInitialization) {
      await this.tokenInitialization;
      this.tokenInitialization = null;
    }

    // Ensure token is set
    if (this.serviceToken) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${this.serviceToken}`;
    } else {
      // Try to get from environment as fallback
      const envToken = process.env.PRODUCT_SERVICE_TOKEN;
      if (envToken) {
        this.serviceToken = envToken;
        this.client.defaults.headers.common['Authorization'] = `Bearer ${this.serviceToken}`;
      } else {
        throw new Error('Service token not available. Set PRODUCT_SERVICE_TOKEN in environment or configure SERVICE_EMAIL and SERVICE_PASSWORD.');
      }
    }
    return this.client;
  }

  /**
   * Update the service token
   */
  setToken(token: string): void {
    this.serviceToken = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.serviceToken;
  }
}

// Export singleton instance
export const productServiceClient = new ProductServiceClient();

