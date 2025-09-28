import { NextResponse } from 'next/server';
import lighthouse from '@lighthouse-web3/sdk';

const LIGHTHOUSE_API_KEY = process.env.LH_API_KEY;

export interface UploadRequest {
  category: string;
  companyName: string;
  dataName: string;
  dataDescription: string;
  ipfsHash: string;
  timestamp: string;
  fileSize: number;
  uploaderAddress: string;
}

export async function POST(request: Request) {
  try {
    // Get and validate request data
    const body: UploadRequest = await request.json();
    
    // Validate required fields
    const { category, companyName, dataName, dataDescription, ipfsHash, timestamp, fileSize, uploaderAddress } = body;
    if (!category || !companyName || !dataName || !dataDescription || !ipfsHash || !timestamp || !fileSize || !uploaderAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: category, companyName, dataName, dataDescription, ipfsHash, timestamp, fileSize, uploaderAddress' },
        { status: 400 }
      );
    }

    // Here you would typically save to your database
    // For now, we'll simulate a database save
    const datasetRecord = {
      id: `${companyName}-${Date.now()}`,
      category,
      companyName,
      dataName,
      dataDescription,
      ipfsHash,
      timestamp,
      fileSize,
      uploaderAddress,
      oydCost: Math.ceil(fileSize / (1024 * 1024)), // 1MB = 1 OYD datacoin
      downloads: 0,
      createdAt: new Date().toISOString()
    };

    // TODO: Save to actual database
    console.log('Dataset record to save:', datasetRecord);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Dataset successfully saved to database',
      dataset: datasetRecord,
      decryptUrl: `https://decrypt.mesh3.network/evm/${ipfsHash}`
    });

  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json(
      { error: 'Failed to save dataset record' },
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