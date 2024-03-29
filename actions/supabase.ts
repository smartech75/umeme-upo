'use server';

import {
  createSupabaseServerClient,
  createSupabaseServerComponentClient,
} from '@/lib/supabase/server-client';
import { timeSince } from '@/lib/utils';
import {
  Locations,
  FetchLocationsResponse,
  fetchStatusResponse,
} from '@/types/general';
import { Database } from '@/types/supabase';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

const fetchStatus = async (
  location: string
): Promise<fetchStatusResponse | Error> => {
  try {
    const table = `${location}_logs`;
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1)
      .order('created_at', { ascending: false })
      .single();

    if (error) {
      console.log(error);
      return new Error(error.message ?? 'Unknown error');
    }

    // console.log('the data is ', data);
    const lastUpdated = new Date(data.created_at);
    console.log('the last updated of ', location, 'is ', lastUpdated);
    const now = new Date();
    const difference = Math.abs(now.getTime() - lastUpdated.getTime()) / 60000;
    // console.log('the total difference in minutes ', difference);

    const lastTimeOnline = timeSince(lastUpdated);
    console.log('the last online is ', lastTimeOnline);

    // console log the last updated and now in easier to read format
    // console.log('the last updated is ', lastUpdated.toLocaleString());
    // console.log('the now is ', now.toLocaleString());

    // if the difference is more than 6 minutes, return offline
    if (difference > 10) {
      console.log('the status is offline');
      return {
        lastTimeOnline: lastTimeOnline,
        status: 'off',
      };
    }
    console.log('the status is online');
    return {
      lastTimeOnline: lastTimeOnline,
      status: 'on',
    };
  } catch (error) {
    console.log('the error is ', error);
    return new Error('Unknown error');
  }
};

async function fetchLocations(): Promise<FetchLocationsResponse> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('locations').select('*');
    console.log('Locations data is ', data);

    if (error) {
      return {
        locations: [],
        success: false,
        error: error.message,
      };
    }

    return {
      locations: data as Locations,
      success: true,
    };
  } catch (error) {
    console.log('the error is ', error);
    return {
      locations: [],
      success: false,
      error: 'Unknown error',
    };
  }
}

export { fetchStatus, fetchLocations };
