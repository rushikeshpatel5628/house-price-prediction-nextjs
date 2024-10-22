import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { get_location_names, loadSavedArtifacts } from '../../../../helper/locations';  // Adjust the import according to your folder structure

export async function GET() {
  try {
    // Load saved artifacts (if not already loaded)
    loadSavedArtifacts();

    // Get location names
    const locations = get_location_names();

    return NextResponse.json({ locations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json({ error: "Failed to load locations" }, { status: 500 });
  }
}
