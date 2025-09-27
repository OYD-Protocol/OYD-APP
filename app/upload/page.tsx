'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import Navbar from '@/app/components/Navbar';
import { useDatasetRegistry } from '@/app/hooks/useDatasetRegistry';

interface UploadFormData {
  name: string;
  description: string;
  priceETH: string;
  priceUSDC: string;
  category: string;
  file: File | null;
}

export default function UploadPage() {
  const { address, isConnected } = useAccount();
  const { registerDataset, isLoading: isRegistering, error: registryError, isConfirmed, transactionHash } = useDatasetRegistry();

  const [formData, setFormData] = useState<UploadFormData>({
    name: '',
    description: '',
    priceETH: '',
    priceUSDC: '',
    category: '',
    file: null,
  });

  const [uploadStatus, setUploadStatus] = useState<{
    step: 'idle' | 'uploading' | 'uploaded' | 'registering' | 'completed' | 'error';
    message: string;
    ipfsHash?: string;
    error?: string;
  }>({
    step: 'idle',
    message: '',
  });

  const categories = [
    'Environmental',
    'Business',
    'Healthcare',
    'Finance',
    'Technology',
    'Education',
    'Research',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      setUploadStatus({
        step: 'error',
        message: 'Please connect your wallet first',
        error: 'Wallet not connected'
      });
      return;
    }

    if (!formData.file) {
      setUploadStatus({
        step: 'error',
        message: 'Please select a file to upload',
        error: 'No file selected'
      });
      return;
    }

    try {
      // Step 1: Upload to IPFS
      setUploadStatus({
        step: 'uploading',
        message: 'Uploading dataset to IPFS...'
      });

      // Read file content
      const fileContent = await formData.file.text();
      let parsedData;

      try {
        parsedData = JSON.parse(fileContent);
      } catch {
        // If not JSON, treat as plain text
        parsedData = { content: fileContent };
      }

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: parsedData,
          metadata: {
            name: formData.name,
            description: formData.description,
            priceETH: formData.priceETH,
            priceUSDC: formData.priceUSDC,
            category: formData.category,
          }
        }),
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || 'Failed to upload to IPFS');
      }

      // Step 2: Register on blockchain
      setUploadStatus({
        step: 'uploaded',
        message: 'File uploaded to IPFS successfully. Registering on blockchain...',
        ipfsHash: uploadResult.hash
      });

      const success = await registerDataset(uploadResult.hash, {
        name: formData.name,
        description: formData.description,
        priceETH: formData.priceETH,
        priceUSDC: formData.priceUSDC,
        category: formData.category,
      });

      if (success) {
        setUploadStatus({
          step: 'registering',
          message: 'Transaction submitted. Waiting for confirmation...',
          ipfsHash: uploadResult.hash
        });
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({
        step: 'error',
        message: 'Failed to upload dataset',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  // Watch for transaction confirmation and errors
  if (isConfirmed && uploadStatus.step === 'registering') {
    setUploadStatus({
      step: 'completed',
      message: 'Dataset successfully uploaded and registered on blockchain!',
      ipfsHash: uploadStatus.ipfsHash
    });
  }

  // Handle registry errors
  if (registryError && uploadStatus.step === 'registering') {
    setUploadStatus({
      step: 'error',
      message: 'Blockchain registration failed',
      error: registryError,
      ipfsHash: uploadStatus.ipfsHash
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="lg:ml-64 transition-all duration-300 pt-16 lg:pt-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Upload Dataset</h1>
          <p className="text-slate-600">Upload your dataset to IPFS and register it on the blockchain</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dataset Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Dataset Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter dataset name"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your dataset"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Pricing */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="priceETH" className="block text-sm font-medium text-slate-700 mb-2">
                  Price in ETH *
                </label>
                <input
                  type="number"
                  step="0.001"
                  id="priceETH"
                  name="priceETH"
                  value={formData.priceETH}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.5"
                />
              </div>
              <div>
                <label htmlFor="priceUSDC" className="block text-sm font-medium text-slate-700 mb-2">
                  Price in USDC *
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="priceUSDC"
                  name="priceUSDC"
                  value={formData.priceUSDC}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1250"
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-slate-700 mb-2">
                Dataset File *
              </label>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                required
                accept=".json,.csv,.txt,.xml"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-slate-500 mt-1">
                Supported formats: JSON, CSV, TXT, XML
              </p>
            </div>

            {/* Upload Status */}
            {uploadStatus.step !== 'idle' && (
              <div className={`p-4 rounded-lg border ${
                uploadStatus.step === 'error'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : uploadStatus.step === 'completed'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {uploadStatus.step === 'uploading' || uploadStatus.step === 'registering' ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : uploadStatus.step === 'completed' ? (
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : uploadStatus.step === 'error' ? (
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : null}
                    <div>
                      <p className="font-medium">{uploadStatus.message}</p>
                      {uploadStatus.ipfsHash && (
                        <p className="text-sm mt-1">IPFS Hash: {uploadStatus.ipfsHash}</p>
                      )}
                      {transactionHash && (
                        <p className="text-sm mt-1">Transaction: {transactionHash}</p>
                      )}
                      {uploadStatus.error && (
                        <p className="text-sm mt-1">{uploadStatus.error}</p>
                      )}
                    </div>
                  </div>

                  {/* Retry Button for Failed Blockchain Registration */}
                  {uploadStatus.step === 'error' && uploadStatus.ipfsHash && (
                    <button
                      onClick={async () => {
                        if (!uploadStatus.ipfsHash) return;

                        setUploadStatus({
                          step: 'registering',
                          message: 'Retrying blockchain registration...',
                          ipfsHash: uploadStatus.ipfsHash
                        });

                        await registerDataset(uploadStatus.ipfsHash, {
                          name: formData.name,
                          description: formData.description,
                          priceETH: formData.priceETH,
                          priceUSDC: formData.priceUSDC,
                          category: formData.category,
                        });
                      }}
                      className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Retry Registration
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isConnected || uploadStatus.step === 'uploading' || uploadStatus.step === 'registering' || isRegistering}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {!isConnected ? 'Connect Wallet First' :
               uploadStatus.step === 'uploading' ? 'Uploading to IPFS...' :
               uploadStatus.step === 'registering' || isRegistering ? 'Registering on Blockchain...' :
               'Upload Dataset'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}