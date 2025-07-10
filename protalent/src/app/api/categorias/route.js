import { NextResponse } from 'next/server';

const API_URL = 'http://localhost:5000/api';

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/categorias`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Error al obtener las categorías');
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
