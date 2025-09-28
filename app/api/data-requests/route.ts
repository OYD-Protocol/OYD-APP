import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export interface DataRequestPayload {
  datasetId: string;
  datasetName: string;
  datasetDescription: string;
  cid: string;
  requesterAddress: string;
  uploaderAddress: string;
  category: string;
  size: string;
  oydCost: number;
}

// Get data requests for a specific uploader
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uploaderAddress = searchParams.get('uploaderAddress');

    if (!uploaderAddress) {
      return NextResponse.json(
        { error: 'uploaderAddress parameter is required' },
        { status: 400 }
      );
    }

    const { data: requests, error } = await supabase
      .from('data_requests')
      .select('*')
      .eq('uploader_address', uploaderAddress)
      .order('requested_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch data requests' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      requests: requests || []
    });
  } catch (error) {
    console.error('Get data requests error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data requests' },
      { status: 500 }
    );
  }
}

// Create a new data request
export async function POST(request: Request) {
  try {
    const payload: DataRequestPayload = await request.json();
    
    const requestRecord = {
      id: `req-${Date.now()}`,
      dataset_id: payload.datasetId,
      dataset_name: payload.datasetName,
      dataset_description: payload.datasetDescription,
      cid: payload.cid,
      requester_address: payload.requesterAddress,
      uploader_address: payload.uploaderAddress,
      category: payload.category,
      size: payload.size,
      oyd_cost: payload.oydCost,
      status: 'pending',
      requested_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('data_requests')
      .insert([requestRecord])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to create data request' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Data request created successfully',
      request: data
    });
  } catch (error) {
    console.error('Create data request error:', error);
    return NextResponse.json(
      { error: 'Failed to create data request' },
      { status: 500 }
    );
  }
}

// Update request status
export async function PUT(request: Request) {
  try {
    const { requestId, status } = await request.json();

    if (!requestId || !status) {
      return NextResponse.json(
        { error: 'requestId and status are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('data_requests')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json(
        { error: 'Failed to update request status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Request status updated successfully',
      request: data
    });
  } catch (error) {
    console.error('Update request status error:', error);
    return NextResponse.json(
      { error: 'Failed to update request status' },
      { status: 500 }
    );
  }
}
