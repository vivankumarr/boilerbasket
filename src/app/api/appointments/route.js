// app/api/appointments/route.js
import { NextResponse } from "next/server";
import { confirmBooking } from "@/app/book/actions";

export async function POST(request) {
    try {
        const payload = await request.json();

        // call the server-side booking logic
        const result = await confirmBooking(payload);

        // success
        if (result && result.success) {
        return NextResponse.json(result, { status: 201 });
        }

        // conflict (client exists but incoming data differs)
        if (result && result.conflict) {
        return NextResponse.json(result, { status: 409 });
        }

        // validation / expected error
        return NextResponse.json(
        { success: false, error: result?.error || "Invalid request" },
        { status: 400 }
        );
    } catch (err) {
        // unexpected error
        console.error("Error in /api/appointments:", err);
        return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
        );
    }
}