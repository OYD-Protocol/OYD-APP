# Dataset Upload Setup Guide

This guide explains how to set up the complete dataset upload flow that combines IPFS storage via Lighthouse with blockchain registration.

## Overview

The upload flow consists of two main steps:
1. **IPFS Upload**: Dataset files are uploaded to IPFS via Lighthouse
2. **Blockchain Registration**: Dataset metadata and IPFS hash are stored on-chain

## Setup Instructions

### 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Lighthouse API Key (required for IPFS uploads)
LH_API_KEY=your_lighthouse_api_key_here

# Dataset Registry Contract Address (required for blockchain registration)
NEXT_PUBLIC_DATASET_REGISTRY_ADDRESS=0x1234567890123456789012345678901234567890
```

### 2. Smart Contract Deployment

Deploy the DatasetRegistry smart contract to your chosen network. The contract should implement:

- `registerDataset(string ipfsHash, string name, string description, uint256 priceETH, uint256 priceUSDC, string category)`
- `getDataset(string ipfsHash)`
- `getAllDatasets()`
- `getDatasetsByCompany(address company)`

Update the contract address in your environment variables after deployment.

### 3. Lighthouse API Key

1. Visit [Lighthouse.storage](https://lighthouse.storage)
2. Create an account and generate an API key
3. Add the API key to your `.env.local` file

## File Structure

```
app/
├── api/
│   └── upload.ts                 # API endpoint for IPFS uploads
├── contracts/
│   └── DatasetRegistry.json      # Smart contract ABI
├── hooks/
│   └── useDatasetRegistry.ts     # Hook for blockchain interactions
├── upload/
│   └── page.tsx                  # Upload page component
```

## How It Works

### 1. Upload Process

1. User fills out the upload form with dataset metadata
2. User selects a file (JSON, CSV, TXT, XML supported)
3. Form submission triggers the upload flow:
   - File is sent to `/api/upload` endpoint
   - API uploads file content to IPFS via Lighthouse
   - API returns IPFS hash and metadata
   - Frontend initiates blockchain transaction to register dataset
   - Transaction confirmation completes the process

### 2. Error Handling

- **IPFS Upload Failures**: User receives error message with details
- **Blockchain Transaction Failures**: User can retry registration with the existing IPFS hash
- **Network Issues**: Comprehensive error messages guide user to resolution

### 3. User Feedback

The upload process provides real-time status updates:
- "Uploading dataset to IPFS..."
- "File uploaded to IPFS successfully. Registering on blockchain..."
- "Transaction submitted. Waiting for confirmation..."
- "Dataset successfully uploaded and registered on blockchain!"

## Usage

1. Navigate to `/upload` in your application
2. Connect your wallet using the connect button
3. Fill out the dataset information form:
   - Dataset Name
   - Description
   - Category
   - Price in ETH
   - Price in USDC
   - Upload file
4. Click "Upload Dataset" to start the process
5. Confirm the blockchain transaction in your wallet
6. Wait for transaction confirmation

## Testing

To test the upload flow:

1. Ensure all environment variables are set correctly
2. Start your development server: `npm run dev`
3. Navigate to `/upload`
4. Connect a test wallet
5. Upload a sample JSON file with test data
6. Monitor the console for any errors during the process

## Supported File Formats

- JSON (.json)
- CSV (.csv)
- TXT (.txt)
- XML (.xml)

Files are automatically converted to JSON format for storage on IPFS.

## Security Considerations

- API keys are stored securely in environment variables
- Smart contract interactions require user wallet confirmation
- File uploads are validated on both client and server side
- IPFS hashes are immutable and provide content verification

## Troubleshooting

### Common Issues

1. **"Lighthouse API key not configured"**
   - Ensure `LH_API_KEY` is set in `.env.local`

2. **"Dataset registry contract address not configured"**
   - Ensure `NEXT_PUBLIC_DATASET_REGISTRY_ADDRESS` is set

3. **"Transaction rejected by user"**
   - User cancelled the wallet transaction
   - Can retry with "Retry Registration" button

4. **"Insufficient funds for transaction"**
   - User needs more ETH for gas fees

5. **Network connection issues**
   - Check internet connection
   - Verify RPC endpoint is working