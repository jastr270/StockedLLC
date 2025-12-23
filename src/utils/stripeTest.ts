export const testStripeConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Test publishable key format
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      return {
        success: false,
        message: 'VITE_STRIPE_PUBLISHABLE_KEY is not set in .env file'
      };
    }

    if (!publishableKey.startsWith('pk_')) {
      return {
        success: false,
        message: 'Invalid publishable key format. Should start with pk_test_ or pk_live_'
      };
    }

    // Test secret key format (frontend can only check format, not functionality)
    const secretKey = import.meta.env.VITE_STRIPE_SECRET_KEY;
    if (!secretKey) {
      return {
        success: false,
        message: 'VITE_STRIPE_SECRET_KEY is not set in .env file'
      };
    }

    if (!secretKey.startsWith('sk_')) {
      return {
        success: false,
        message: 'Invalid secret key format. Should start with sk_test_ or sk_live_'
      };
    }

    // Check if keys match environment (both test or both live)
    const isPublishableTest = publishableKey.startsWith('pk_test_');
    const isSecretTest = secretKey.startsWith('sk_test_');
    
    if (isPublishableTest !== isSecretTest) {
      return {
        success: false,
        message: 'Key mismatch: Both keys must be test keys or both must be live keys'
      };
    }

    return {
      success: true,
      message: `Stripe keys configured correctly (${isPublishableTest ? 'test' : 'live'} mode)`
    };

  } catch (error) {
    return {
      success: false,
      message: `Stripe connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};