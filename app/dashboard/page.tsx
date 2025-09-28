'use client';

import { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import { useBuyDataset } from '@/app/hooks/useBuyDataset';
import { useDataAccess } from '@/app/hooks/useDataAccess';

interface Dataset {
  id: string;
  name: string;
  description: string;
  category: string;
  size: string;
  timestamp: string;
  ipfsHash: string;
  seller: string;
  downloads: number;
  oydCost: number; // Cost in OYD datacoins (1MB = 1 OYD)
}

// Categories for the marketplace
const categories = [
  {
    id: 'supermart',
    name: 'Supermart',
    description: 'Consumer behavior data from major supermarket chains',
    companies: ['Flipkart', 'Amazon']
  },
  {
    id: 'groceries',
    name: 'Groceries and Food',
    description: 'Food delivery and grocery shopping patterns',
    companies: ['Zepto', 'Blinkit', 'Swiggy', 'Zomato']
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    description: 'Healthcare and medicine purchase behavior',
    companies: ['1mg']
  },
  {
    id: 'apparels',
    name: 'Apparels',
    description: 'Fashion and clothing shopping trends',
    companies: ['Myntra', 'Ajio']
  }
];

// Company datasets organized by category
const companyDatasets: { [key: string]: Dataset[] } = {
  supermart: [
    {
      id: 'flipkart-1',
      name: 'Flipkart',
      description: 'Consumer purchase patterns, product preferences, and seasonal shopping trends from Flipkart marketplace.',
      category: 'Supermart',
      size: '2.5 GB',
      timestamp: '2024-01-20T10:30:00Z',
      ipfsHash: 'QmFlipkart1BnNjpGhJ2fR4vL9mX5sT7uE1wP6qA3nB8dC9fG2h',
      seller: '0xFlip...kart',
      downloads: 156,
      oydCost: 2560 // 2.5 GB = ~2560 MB = 2560 OYD
    },
    {
      id: 'amazon-1',
      name: 'Amazon',
      description: 'Comprehensive shopping behavior data including cart abandonment, product reviews, and purchase history.',
      category: 'Supermart',
      size: '4.2 GB',
      timestamp: '2024-01-18T14:45:00Z',
      ipfsHash: 'QmAmazon1BnNjpGhJ3fR5vL0mX6sT8uE2wP7qA4nB9dC0fG3h',
      seller: '0xAmaz...ozon',
      downloads: 203,
      oydCost: 4300 // 4.2 GB = ~4300 MB = 4300 OYD
    }
  ],
  groceries: [
    {
      id: 'zepto-1',
      name: 'Zepto',
      description: 'Quick commerce data with delivery preferences, time-based ordering patterns, and product demand.',
      category: 'Groceries and Food',
      size: '1.8 GB',
      timestamp: '2024-01-22T09:15:00Z',
      ipfsHash: 'QmZepto1BnNjpGhJ4fR6vL1mX7sT9uE3wP8qA5nB0dC1fG4h',
      seller: '0xZept...opto',
      downloads: 89,
      oydCost: 1840 // 1.8 GB = ~1840 MB = 1840 OYD
    },
    {
      id: 'blinkit-1',
      name: 'Blinkit',
      description: 'Instant grocery delivery patterns, peak hour analysis, and customer retention data.',
      category: 'Groceries and Food',
      size: '1.5 GB',
      timestamp: '2024-01-21T16:20:00Z',
      ipfsHash: 'QmBlinkit1BnNjpGhJ5fR7vL2mX8sT0uE4wP9qA6nB1dC2fG5h',
      seller: '0xBlin...nkit',
      downloads: 67,
      oydCost: 1536 // 1.5 GB = ~1536 MB = 1536 OYD
    },
    {
      id: 'swiggy-1',
      name: 'Swiggy',
      description: 'Food delivery preferences, restaurant ratings impact, and order timing patterns.',
      category: 'Groceries and Food',
      size: '3.1 GB',
      timestamp: '2024-01-19T12:30:00Z',
      ipfsHash: 'QmSwiggy1BnNjpGhJ6fR8vL3mX9sT1uE5wP0qA7nB2dC3fG6h',
      seller: '0xSwig...iggy',
      downloads: 134,
      oydCost: 3174 // 3.1 GB = ~3174 MB = 3174 OYD
    },
    {
      id: 'zomato-1',
      name: 'Zomato',
      description: 'Restaurant discovery patterns, user reviews analysis, and dining preferences data.',
      category: 'Groceries and Food',
      size: '2.7 GB',
      timestamp: '2024-01-17T11:45:00Z',
      ipfsHash: 'QmZomato1BnNjpGhJ7fR9vL4mX0sT2uE6wP1qA8nB3dC4fG7h',
      seller: '0xZoma...mato',
      downloads: 98,
      oydCost: 2765 // 2.7 GB = ~2765 MB = 2765 OYD
    }
  ],
  pharmacy: [
    {
      id: '1mg-1',
      name: '1mg',
      description: 'Healthcare product purchase behavior, prescription patterns, and wellness product preferences.',
      category: 'Pharmacy',
      size: '900 MB',
      timestamp: '2024-01-23T08:00:00Z',
      ipfsHash: 'Qm1mg1BnNjpGhJ8fR0vL5mX1sT3uE7wP2qA9nB4dC5fG8h',
      seller: '0x1mg1...mg11',
      downloads: 45,
      oydCost: 900 // 900 MB = 900 OYD
    }
  ],
  apparels: [
    {
      id: 'myntra-1',
      name: 'Myntra',
      description: 'Fashion trends, seasonal clothing preferences, brand loyalty, and size-based purchase patterns.',
      category: 'Apparels',
      size: '2.1 GB',
      timestamp: '2024-01-16T15:30:00Z',
      ipfsHash: 'QmMyntra1BnNjpGhJ9fR1vL6mX2sT4uE8wP3qA0nB5dC6fG9h',
      seller: '0xMynt...ntra',
      downloads: 112,
      oydCost: 2150 // 2.1 GB = ~2150 MB = 2150 OYD
    },
    {
      id: 'ajio-1',
      name: 'Ajio',
      description: 'Youth fashion preferences, discount sensitivity analysis, and social media influenced purchases.',
      category: 'Apparels',
      size: '1.6 GB',
      timestamp: '2024-01-15T13:15:00Z',
      ipfsHash: 'QmAjio1BnNjpGhJ0fR2vL7mX3sT5uE9wP4qA1nB6dC7fG0h',
      seller: '0xAjio...jio1',
      downloads: 78,
      oydCost: 1638 // 1.6 GB = ~1638 MB = 1638 OYD
    }
  ]
};

export default function Dashboard() {
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { buyDataset, isLoading, error, hasPurchased } = useBuyDataset();
  const { generateAccess } = useDataAccess();

  const handleBuyDataset = async (dataset: Dataset) => {
    // For now, we'll use ETH as the currency type since the hook expects it
    // In a real implementation, you'd update the hook to support OYD
    const success = await buyDataset(dataset.id, dataset.oydCost.toString(), 'ETH');

    if (success) {
      await generateAccess(dataset.id, dataset.ipfsHash);
      setSelectedDataset(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Supermart: 'from-blue-500 to-indigo-500',
      'Groceries and Food': 'from-emerald-500 to-green-500',
      Pharmacy: 'from-rose-500 to-pink-500',
      Apparels: 'from-purple-500 to-violet-500'
    };
    return colors[category as keyof typeof colors] || 'from-slate-500 to-slate-600';
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      Supermart: 'bg-blue-100 text-blue-700 border-blue-200',
      'Groceries and Food': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Pharmacy: 'bg-rose-100 text-rose-700 border-rose-200',
      Apparels: 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return colors[category as keyof typeof colors] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="lg:ml-64 transition-all duration-300 pt-16 lg:pt-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Ecommerce Consumer Behaviour</h1>
              <p className="text-slate-600">
                {selectedCategory 
                  ? `Browse ${selectedCategory} datasets from leading companies`
                  : 'Discover consumer behavior datasets from top ecommerce platforms'
                }
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  ← Back to Categories
                </button>
              )}
              <div className="bg-white rounded-lg px-4 py-2 border border-slate-200 shadow-sm">
                <div className="text-sm text-slate-500">
                  {selectedCategory ? 'Companies' : 'Categories'}
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {selectedCategory 
                    ? Array.from(new Set(companyDatasets[selectedCategory]?.map(dataset => dataset.name) || [])).length
                    : categories.length
                  }
                </div>
              </div>
              {selectedCategory && (
                <div className="bg-white rounded-lg px-4 py-2 border border-slate-200 shadow-sm">
                  <div className="text-sm text-slate-500">Total Datasets</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {companyDatasets[selectedCategory]?.length || 0}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category or Company Grid */}
        {!selectedCategory ? (
          // Show Categories
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
              >
                <div className={`h-24 bg-gradient-to-r ${getCategoryColor(category.name)} relative`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                  <div className="absolute bottom-3 left-4 text-white">
                    <h3 className="text-lg font-bold">{category.name}</h3>
          </div>
                  <div className="absolute top-3 right-4 text-white text-sm bg-black/20 px-2 py-1 rounded">
                    {category.companies.length} companies
        </div>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {category.companies.map((company, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Show Companies in Selected Category with Individual Tables
          <div className="space-y-8">
            {/* Get unique companies in the selected category */}
            {Array.from(new Set(companyDatasets[selectedCategory]?.map(dataset => dataset.name) || [])).map((companyName) => {
              const companyData = companyDatasets[selectedCategory]?.filter(dataset => dataset.name === companyName) || [];
              
              return (
                <div key={companyName} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Company Header */}
                  <div className={`bg-gradient-to-r ${getCategoryColor(companyData[0]?.category || '')} px-6 py-4`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">{companyName}</h3>
                        <p className="text-white/80 text-sm">{companyData.length} dataset{companyData.length !== 1 ? 's' : ''} available</p>
                </div>
                      <div className="text-white/80 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border border-white/30 bg-white/10`}>
                          {companyData[0]?.category}
                        </span>
                    </div>
                    </div>
                  </div>

                  {/* Company Data Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left py-3 px-6 font-semibold text-slate-700 text-sm">Data Name</th>
                          <th className="text-left py-3 px-6 font-semibold text-slate-700 text-sm">Description</th>
                          <th className="text-left py-3 px-6 font-semibold text-slate-700 text-sm">Timestamp</th>
                          <th className="text-left py-3 px-6 font-semibold text-slate-700 text-sm">Size</th>
                          <th className="text-left py-3 px-6 font-semibold text-slate-700 text-sm">IPFS Hash</th>
                          <th className="text-left py-3 px-6 font-semibold text-slate-700 text-sm">Downloads</th>
                          <th className="text-left py-3 px-6 font-semibold text-slate-700 text-sm">Cost (OYD)</th>
                          <th className="text-left py-3 px-6 font-semibold text-slate-700 text-sm">Seller</th>
                          <th className="text-left py-3 px-6 font-semibold text-slate-700 text-sm">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {companyData.map((dataset, index) => (
                          <tr key={dataset.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-4 px-6">
                              <div className="font-semibold text-slate-900 text-sm">{dataset.name}</div>
                            </td>
                            <td className="py-4 px-6 max-w-xs">
                              <div className="text-sm text-slate-600 line-clamp-2" title={dataset.description}>
                                {dataset.description}
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-slate-700 whitespace-nowrap">
                              {formatTimestamp(dataset.timestamp)}
                            </td>
                            <td className="py-4 px-6 text-sm font-semibold text-slate-700">
                              {dataset.size}
                            </td>
                            <td className="py-4 px-6 text-xs font-mono text-slate-700">
                              <div className="flex items-center space-x-2">
                                <span>{dataset.ipfsHash.slice(0, 12)}...</span>
                                <button
                                  onClick={() => navigator.clipboard.writeText(dataset.ipfsHash)}
                                  className="text-blue-600 hover:text-blue-800 transition-colors"
                                  title="Copy full hash"
                                >
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                                  </svg>
                                </button>
                    </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-slate-700">
                              <div className="flex items-center space-x-1">
                                <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                                </svg>
                                <span>{dataset.downloads}</span>
                  </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-1">
                                <span className="text-lg font-bold text-blue-600">{dataset.oydCost}</span>
                                <span className="text-xs text-slate-500">OYD</span>
                </div>
                            </td>
                            <td className="py-4 px-6 text-xs font-mono text-slate-600">
                              {dataset.seller}
                            </td>
                            <td className="py-4 px-6">
                {hasPurchased(dataset.id) ? (
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                                  Owned
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedDataset(dataset)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  >
                                  Buy
                  </button>
                )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Company Summary Footer */}
                  <div className="bg-slate-50 px-6 py-3 border-t border-slate-200">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <div>
                        Total Datasets: <span className="font-semibold text-slate-900">{companyData.length}</span>
                      </div>
                      <div>
                        Total Downloads: <span className="font-semibold text-slate-900">
                          {companyData.reduce((sum, dataset) => sum + dataset.downloads, 0)}
                        </span>
                      </div>
                      <div>
                        Total Size: <span className="font-semibold text-slate-900">
                          {(() => {
                            const totalMB = companyData.reduce((sum, dataset) => {
                              const sizeInMB = parseFloat(dataset.size.replace(/[^\d.]/g, '')) * 
                                (dataset.size.includes('GB') ? 1024 : 1);
                              return sum + sizeInMB;
                            }, 0);
                            return totalMB > 1024 ? `${(totalMB / 1024).toFixed(1)} GB` : `${totalMB.toFixed(0)} MB`;
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* No data message */}
            {(!companyDatasets[selectedCategory] || companyDatasets[selectedCategory].length === 0) && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-center py-16">
                  <div className="text-slate-500 text-xl mb-2">No datasets available</div>
                  <div className="text-slate-400 text-sm">Companies in this category haven't uploaded any datasets yet</div>
                </div>
              </div>
            )}
            </div>
        )}

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
                    <span className="text-blue-600 font-bold text-lg">
                      {selectedDataset.oydCost} OYD datacoins
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-600 font-medium">Size:</span>
                    <span className="text-slate-900 font-semibold">{selectedDataset.size}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-600 font-medium">Timestamp:</span>
                    <span className="text-slate-900 text-sm">{formatTimestamp(selectedDataset.timestamp)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-600 font-medium">IPFS Hash:</span>
                    <span className="text-slate-900 font-mono text-sm">{selectedDataset.ipfsHash.slice(0, 20)}...</span>
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