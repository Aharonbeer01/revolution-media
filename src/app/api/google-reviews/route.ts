import { NextResponse } from "next/server";

const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
  if (!GOOGLE_PLACE_ID || !GOOGLE_API_KEY) {
    return NextResponse.json(
      { reviews: [], error: "Google Places API not configured" },
      { status: 200 }
    );
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url, { next: { revalidate: 86400 } });
    const data = await response.json();

    if (data.status !== "OK" || !data.result) {
      console.error("[Google Reviews] API error:", data.status);
      return NextResponse.json({ reviews: [], rating: 0, totalReviews: 0 }, { status: 200 });
    }

    const reviews = (data.result.reviews || [])
      .filter((r: { rating: number }) => r.rating >= 4)
      .slice(0, 6);

    return NextResponse.json({
      reviews,
      rating: data.result.rating || 0,
      totalReviews: data.result.user_ratings_total || 0,
    });
  } catch (error) {
    console.error("[Google Reviews] Fetch error:", error);
    return NextResponse.json({ reviews: [], rating: 0, totalReviews: 0 }, { status: 200 });
  }
}
