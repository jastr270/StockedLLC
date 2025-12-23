import React, { useState } from 'react';
import { CreditCard, CheckCircle, XCircle, Loader } from 'lucide-react';
import { testStripeConnection } from '../utils/stripeTest';

export function StripeTestButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTest = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    const result = await testStripeConnection();
    setTestResult(result);
    setIsLoading(false);
  };

  return (
    <div className="glass-effect rounded-2xl shadow-elegant p-6 mb-8 border border-white/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
          <CreditCard className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-white">Stripe Connection Test</h3>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleTest}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-xl hover:scale-105 transition-all duration-300 font-semibold shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <CreditCard className="w-4 h-4" />
          )}
          {isLoading ? 'Testing...' : 'Test Stripe Keys'}
        </button>

        {testResult && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            testResult.success 
              ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
              : 'bg-red-500/20 text-red-300 border border-red-400/30'
          }`}>
            {testResult.success ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            <span className="text-sm font-semibold">{testResult.message}</span>
          </div>
        )}
      </div>

      <p className="text-white/60 text-sm mt-3 font-medium">
        This will verify your Stripe keys are properly configured and formatted correctly.
      </p>
    </div>
  );
}