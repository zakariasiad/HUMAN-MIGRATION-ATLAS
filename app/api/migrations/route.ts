import { NextResponse } from "next/server";
import type { MigrationLayer, MigrationStory } from "@/data/migrations";

export const dynamic = "force-dynamic";

type MigrationRow = {
  slug: string;
  title: string;
  title_ar: string;
  period_start_years_before_present: number;
  period_end_years_before_present: number;
  origin_name: string;
  origin_name_ar: string;
  origin_lat: number;
  origin_lng: number;
  destination_name: string;
  destination_name_ar: string;
  destination_lat: number;
  destination_lng: number;
  layer: MigrationLayer;
  category: string;
  category_ar: string;
  summary: string;
  summary_ar: string;
  evidence_notes: string;
  evidence_notes_ar: string;
  confidence: MigrationStory["confidence"];
  visualization_color: string;
  migration_event_sources?: { migration_sources: { title: string; source_url: string | null } | null }[];
};

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // The bundled sample remains available until the project's environment is configured.
  if (!supabaseUrl || !publishableKey) {
    return NextResponse.json({ source: "demo", migrations: null });
  }

  const endpoint = new URL("/rest/v1/migration_events", supabaseUrl);
  endpoint.searchParams.set("select", "*,migration_event_sources(migration_sources(title,source_url))");
  endpoint.searchParams.set("publication_status", "eq.published");
  endpoint.searchParams.set("order", "period_start_years_before_present.desc");

  try {
    const response = await fetch(endpoint, {
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${publishableKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Supabase migration query failed:", response.status);
      return NextResponse.json({ error: "Migration data is temporarily unavailable." }, { status: 502 });
    }

    const rows = (await response.json()) as MigrationRow[];
    const migrations: MigrationStory[] = rows.map((row) => ({
      id: row.slug,
      title: row.title,
      titleAr: row.title_ar,
      periodStart: row.period_start_years_before_present,
      periodEnd: row.period_end_years_before_present,
      from: { name: row.origin_name, nameAr: row.origin_name_ar, lat: row.origin_lat, lng: row.origin_lng },
      to: { name: row.destination_name, nameAr: row.destination_name_ar, lat: row.destination_lat, lng: row.destination_lng },
      layer: row.layer,
      category: row.category,
      categoryAr: row.category_ar,
      summary: row.summary,
      summaryAr: row.summary_ar,
      evidence: row.evidence_notes,
      evidenceAr: row.evidence_notes_ar,
      confidence: row.confidence,
      color: row.visualization_color,
      sources: (row.migration_event_sources ?? [])
        .map((entry) => entry.migration_sources)
        .filter((source): source is { title: string; source_url: string | null } => Boolean(source?.source_url))
        .map((source) => ({ title: source.title, url: source.source_url as string })),
    }));

    return NextResponse.json({ source: "supabase", migrations });
  } catch (error) {
    console.error("Unable to reach Supabase migration data:", error);
    return NextResponse.json({ error: "Migration data is temporarily unavailable." }, { status: 502 });
  }
}
