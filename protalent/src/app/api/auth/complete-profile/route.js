import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const data = await request.json();
    
    // Validar que el usuario existe
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        estudiante: true,
        egresado: true,
        empresa: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar los datos según el rol
    if (user.rol === 'estudiante') {
      await prisma.estudiante.upsert({
        where: { usuarioId: userId },
        update: {
          carrera: data.carrera,
          universidad: data.universidad,
          anioIngreso: parseInt(data.anioIngreso),
          telefono: data.telefono,
          direccion: data.direccion,
          perfilCompleto: true
        },
        create: {
          usuarioId: userId,
          carrera: data.carrera,
          universidad: data.universidad,
          anioIngreso: parseInt(data.anioIngreso),
          telefono: data.telefono,
          direccion: data.direccion,
          perfilCompleto: true
        }
      });
    } else if (user.rol === 'egresado') {
      await prisma.egresado.upsert({
        where: { usuarioId: userId },
        update: {
          carrera: data.carrera,
          universidad: data.universidad,
          anioEgreso: parseInt(data.anioEgreso),
          titulo: data.titulo,
          telefono: data.telefono,
          direccion: data.direccion,
          perfilCompleto: true
        },
        create: {
          usuarioId: userId,
          carrera: data.carrera,
          universidad: data.universidad,
          anioEgreso: parseInt(data.anioEgreso),
          titulo: data.titulo,
          telefono: data.telefono,
          direccion: data.direccion,
          perfilCompleto: true
        }
      });
    } else if (user.rol === 'empresa') {
      await prisma.empresa.upsert({
        where: { usuarioId: userId },
        update: {
          nombreEmpresa: data.nombreEmpresa,
          ruc: data.ruc,
          rubro: data.rubro,
          descripcion: data.descripcion,
          telefono: data.telefono,
          direccion: data.direccion,
          perfilCompleto: true
        },
        create: {
          usuarioId: userId,
          nombreEmpresa: data.nombreEmpresa,
          ruc: data.ruc,
          rubro: data.rubro,
          descripcion: data.descripcion,
          telefono: data.telefono,
          direccion: data.direccion,
          perfilCompleto: true
        }
      });
    }

    // Actualizar el estado del usuario a perfil completo
    await prisma.usuario.update({
      where: { id: userId },
      data: { perfilCompleto: true }
    });

    // Obtener los datos actualizados del usuario
    const updatedUser = await prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        estudiante: user.rol === 'estudiante',
        egresado: user.rol === 'egresado',
        empresa: user.rol === 'empresa'
      }
    });

    return NextResponse.json({
      message: 'Perfil actualizado correctamente',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error al completar perfil:', error);
    return NextResponse.json(
      { message: 'Error al actualizar el perfil', error: error.message },
      { status: 500 }
    );
  }
}
