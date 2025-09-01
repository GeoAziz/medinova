import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { adminDb } from '@/lib/firebase-admin';
import '@/lib/firebase-admin'; // Ensure Firebase Admin SDK is initialized

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  console.log('[SESSION LOGIN] Received idToken:', idToken ? idToken.substring(0, 10) + '...' : 'undefined');
  try {
    if (!idToken) {
      console.error('[SESSION LOGIN] No idToken provided');
      return NextResponse.json({ error: 'No idToken provided' }, { status: 400 });
    }
    const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn });
    console.log('[SESSION LOGIN] Session cookie created');
    const response = NextResponse.json({ status: 'success' });
    response.headers.set('Set-Cookie', `__session=${sessionCookie}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${expiresIn / 1000}`);
    return response;
  } catch (error) {
    console.error('[SESSION LOGIN] Error creating session cookie:', error);
    return NextResponse.json({ error: 'Unauthorized', details: error?.message || error }, { status: 401 });
  }
}
