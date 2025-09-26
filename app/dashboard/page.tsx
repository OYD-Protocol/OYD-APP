'use client';

import { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import { useBuyDataset } from '@/app/hooks/useBuyDataset';
import { useDataAccess } from '@/app/hooks/useDataAccess';

interface Dataset {
  id: string;
  name: string;
  description: string;
  priceETH: string;
  priceUSDC: string;
  category: string;
  size: string;
  lastUpdated: string;
  ipfsHash: string;
  seller: string;
  downloads: number;
  rating: number;
}

const mockDatasets: Dataset[] = [
  {
    id: '1',
    name: 'Global Climate Data 2024',
    description: 'Comprehensive climate measurements from weather stations worldwide, including temperature, humidity, and precipitation data.',
    priceETH: '0.5',
    priceUSDC: '1250',
    category: 'Environmental',
    size: '2.3 GB',
    lastUpdated: '2024-01-15',
    ipfsHash: 'QmYx8K3BnNjpGhJ2fR4vL9mX5sT7uE1wP6qA3nB8dC9fG2h',
    seller: '0x1234...5678',
    downloads: 142,
    rating: 4.8
  },
  {
    id: '2',
    name: 'E-commerce User Behavior',
    description: 'Anonymized user interaction data from major e-commerce platforms, perfect for ML training and behavior analysis.',
    priceETH: '1.2',
    priceUSDC: '3000',
    category: 'Business',
    size: '5.7 GB',
    lastUpdated: '2024-01-10',
    ipfsHash: 'QmZx9K4BnNjpGhJ3fR5vL0mX6sT8uE2wP7qA4nB9dC0fG3h',
    seller: '0x2345...6789',
    downloads: 89,
    rating: 4.6
  },
  {
    id: '3',
    name: 'Medical Research Dataset',
    description: 'De-identified patient data for cardiovascular research, including diagnostic imaging and treatment outcomes.',
    priceETH: '2.0',
    priceUSDC: '5000',
    category: 'Healthcare',
    size: '12.1 GB',
    lastUpdated: '2024-01-08',
    ipfsHash: 'QmAx7K5BnNjpGhJ4fR6vL1mX7sT9uE3wP8qA5nB0dC1fG4h',
    seller: '0x3456...7890',
    downloads: 45,
    rating: 4.9
  },
  {
    id: '4',
    name: 'Financial Market Indicators',
    description: 'Real-time financial data including stock prices, trading volumes, and market sentiment indicators.',
    priceETH: '0.8',
    priceUSDC: '2000',
    category: 'Finance',
    size: '800 MB',
    lastUpdated: '2024-01-20',
    ipfsHash: 'QmBx6K6BnNjpGhJ5fR7vL2mX8sT0uE4wP9qA6nB1dC2fG5h',
    seller: '0x4567...8901',
    downloads: 203,
    rating: 4.7
  }
];

export default function Dashboard() {
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [currency, setCurrency] = useState<'ETH' | 'USDC'>('ETH');
  const [showSuccess, setShowSuccess] = useState(false);
  const { buyDataset, isLoading, error, hasPurchased } = useBuyDataset();
  const { generateAccess } = useDataAccess();

  const handleBuyDataset = async (dataset: Dataset) => {
    const price = currency === 'ETH' ? dataset.priceETH : dataset.priceUSDC;
    const success = await buyDataset(dataset.id, price, currency);

    if (success) {
      await generateAccess(dataset.id, dataset.ipfsHash);
      setSelectedDataset(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Environmental: 'from-emerald-500 to-green-500',
      Business: 'from-blue-500 to-indigo-500',
      Healthcare: 'from-rose-500 to-pink-500',
      Finance: 'from-amber-500 to-orange-500'
    };
    return colors[category as keyof typeof colors] || 'from-slate-500 to-slate-600';
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      Environmental: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Business: 'bg-blue-100 text-blue-700 border-blue-200',
      Healthcare: 'bg-rose-100 text-rose-700 border-rose-200',
      Finance: 'bg-amber-100 text-amber-700 border-amber-200'
    };
    return colors[category as keyof typeof colors] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-amber-400' : 'text-slate-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-xs text-slate-500 font-medium">({rating})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="lg:ml-64 transition-all duration-300 pt-16 lg:pt-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Dataset Marketplace</h1>
              <p className="text-slate-600">Discover and purchase premium datasets from verified sources</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white rounded-lg px-4 py-2 border border-slate-200 shadow-sm">
                <div className="text-sm text-slate-500">Total Datasets</div>
                <div className="text-2xl font-bold text-slate-900">4</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <select className="bg-white border border-slate-300 text-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm min-w-[150px]">
            <option>All Categories</option>
            <option>Environmental</option>
            <option>Business</option>
            <option>Healthcare</option>
            <option>Finance</option>
          </select>

          <select className="bg-white border border-slate-300 text-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm min-w-[160px]">
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Most Popular</option>
            <option>Newest</option>
          </select>

          <div className="flex bg-white border border-slate-300 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setCurrency('ETH')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currency === 'ETH'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              ETH
            </button>
            <button
              onClick={() => setCurrency('USDC')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currency === 'USDC'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              USDC
            </button>
          </div>
        </div>

        {/* Dataset Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDatasets.map((dataset) => (
            <div
              key={dataset.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Header with gradient and category */}
              <div className={`h-24 bg-gradient-to-r ${getCategoryColor(dataset.category)} relative`}>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryBadgeColor(dataset.category)}`}>
                    {dataset.category}
                  </span>
                </div>
                <div className="absolute bottom-3 right-4 text-white text-sm font-medium bg-black/20 px-2 py-1 rounded">
                  {dataset.size}
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {dataset.name}
                  </h3>
                  {renderStars(dataset.rating)}
                </div>

                <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-3">
                  {dataset.description}
                </p>

                <div className="flex justify-between items-center mb-6">
                  <div className="text-xs text-slate-500 space-y-1">
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {dataset.downloads} downloads
                    </div>
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {dataset.lastUpdated}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">
                      {currency === 'ETH' ? `${dataset.priceETH} ETH` : `$${dataset.priceUSDC}`}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">{dataset.seller}</div>
                  </div>
                </div>

                {hasPurchased(dataset.id) ? (
                  <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 py-3 px-4 rounded-xl font-semibold text-center text-sm">
                    <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Purchased
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedDataset(dataset)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-sm hover:shadow-md"
                  >
                    Purchase Dataset
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Purchase Modal */}
        {selectedDataset && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Purchase Dataset</h3>
                <button
                  onClick={() => setSelectedDataset(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">{selectedDataset.name}</h4>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{selectedDataset.description}</p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-600 font-medium">Price:</span>
                    <span className="text-slate-900 font-bold text-lg">
                      {currency === 'ETH'
                        ? `${selectedDataset.priceETH} ETH`
                        : `$${selectedDataset.priceUSDC} USDC`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-600 font-medium">Size:</span>
                    <span className="text-slate-900 font-semibold">{selectedDataset.size}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Seller:</span>
                    <span className="text-slate-900 font-mono text-sm">{selectedDataset.seller}</span>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedDataset(null)}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 px-4 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleBuyDataset(selectedDataset)}
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : 'Confirm Purchase'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Notification */}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-white border border-emerald-200 shadow-xl rounded-xl p-4 z-50 animate-in slide-in-from-right duration-300">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-slate-900">Purchase Successful!</div>
                <div className="text-sm text-slate-600">Access your dataset from My Datasets</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}