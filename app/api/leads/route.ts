import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

const LEADS_FILE = path.join(process.cwd(), "..", "data", "leads.json");

// Ensure the data directory exists
async function ensureDir() {
    const dir = path.dirname(LEADS_FILE);
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch {
        // already exists
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.nombre || !body.email) {
            return NextResponse.json(
                { error: "nombre and email are required" },
                { status: 400 },
            );
        }

        // Sanitize
        const lead = {
            nombre: String(body.nombre).trim().slice(0, 200),
            email: String(body.email).trim().toLowerCase().slice(0, 200),
            negocio: String(body.negocio ?? "").trim().slice(0, 200),
            etapa: String(body.etapa ?? "").trim().slice(0, 100),
            ts: String(body.ts ?? new Date().toISOString()),
            ip: request.headers.get("x-forwarded-for") ?? "—",
        };

        await ensureDir();

        // Read existing leads
        let leads: typeof lead[] = [];
        try {
            const raw = await fs.readFile(LEADS_FILE, "utf8");
            leads = JSON.parse(raw);
        } catch {
            // file doesn't exist yet
        }

        // Append and write
        leads.push(lead);
        await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf8");

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[leads API]", err);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
