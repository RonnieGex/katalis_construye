import { NextResponse } from "next/server";

interface LeadPayload {
  nombre?: unknown;
  email?: unknown;
  negocio?: unknown;
  etapa?: unknown;
  ts?: unknown;
}

function sanitizeLead(body: LeadPayload, request: Request) {
  return {
    nombre: String(body.nombre ?? "").trim().slice(0, 200),
    email: String(body.email ?? "").trim().toLowerCase().slice(0, 200),
    negocio: String(body.negocio ?? "").trim().slice(0, 200),
    etapa: String(body.etapa ?? "").trim().slice(0, 100),
    ts: String(body.ts ?? new Date().toISOString()),
    ip: request.headers.get("x-forwarded-for") ?? "-",
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadPayload;

    if (!body.nombre || !body.email) {
      return NextResponse.json({ error: "nombre and email are required" }, { status: 400 });
    }

    const lead = sanitizeLead(body, request);

    const webhookUrl = process.env.LEADS_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead),
        });
      } catch (webhookError) {
        console.error("[leads API] webhook delivery failed", webhookError);
      }
    } else {
      console.info("[leads API] lead received (no webhook configured)", {
        email: lead.email,
        ts: lead.ts,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[leads API]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
