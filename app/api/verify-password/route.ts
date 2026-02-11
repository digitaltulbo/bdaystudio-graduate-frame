import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();
        const correctPassword = process.env.ACCESS_PASSWORD;

        // If no password is set in env, default to allowing access (or deny? User said "ACCESS_PASSWORD" needed.)
        // Safer to deny if not set, or maybe log a warning. 
        // User said "Vercel Env Vars needed".

        if (!correctPassword) {
            console.error('ACCESS_PASSWORD environment variable is not set');
            return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
        }

        if (password === correctPassword) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    }
}
