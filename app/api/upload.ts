import { NextResponse } from 'next/server';
import lighthouse from '@lighthouse-web3/sdk';

const LIGHTHOUSE_API_KEY = process.env.LH_API_KEY;

export interface UploadRequest {
  data: any;
  metadata: {
    name: string;
    description: string;
    priceETH: string;
    priceUSDC: string;
    category: string;
  };
}

export async function POST(request: Request) {
  try {
    // Validate API key
    if (!LIGHTHOUSE_API_KEY) {
      return NextResponse.json(
        { error: 'Lighthouse API key not configured' },
        { status: 500 }
      );
    }

    // Get and validate request data
    const body: UploadRequest = await request.json();
    if (!body.data) {
      return NextResponse.json(
        { error: 'No data provided' },
        { status: 400 }
      );
    }

    if (!body.metadata) {
      return NextResponse.json(
        { error: 'Dataset metadata is required' },
        { status: 400 }
      );
    }

    // Validate required metadata fields
    const { name, description, priceETH, priceUSDC, category } = body.metadata;
    if (!name || !description || !priceETH || !priceUSDC || !category) {
      return NextResponse.json(
        { error: 'Missing required metadata fields: name, description, priceETH, priceUSDC, category' },
        { status: 400 }
      );
    }

    // Prepare file for upload
    const file = new File(
      [JSON.stringify(body.data)],
      'dataset.json',
      { type: 'application/json' }
    );

    // Upload to IPFS via Lighthouse
    const response = await lighthouse.upload(file, LIGHTHOUSE_API_KEY);
    const ipfsHash = response.data.Hash;

    // Return success response with IPFS hash and metadata
    // The frontend will handle the blockchain transaction
    return NextResponse.json({
      success: true,
      url: `https://gateway.lighthouse.storage/ipfs/${ipfsHash}`,
      hash: ipfsHash,
      metadata: body.metadata,
      message: 'File uploaded to IPFS successfully. Please confirm blockchain transaction to complete registration.'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Prevent other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}