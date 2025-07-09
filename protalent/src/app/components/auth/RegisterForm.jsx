'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/auth/AuthContext';
import { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import Link from 'next/link';
import { cn } from '../../../lib/utils';
import StudentForm from './StudentForm';
import AlumniForm from './AlumniForm';
import CompanyForm from './CompanyForm';

// Esquema base común a todos los roles
const baseRegisterSchema = z.object({
  nombre: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
  email: z.string().email({ message: 'Ingresa un correo electrónico válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres y contener al menos una letra y un número' }),
  rol: z.enum(['estudiante', 'egresado', 'empresa'], {
    required_error: 'Debes seleccionar un rol para continuar con el registro',
    invalid_type_error: 'Rol no válido, por favor selecciona una opción válida'
  })
});

const estudianteSchema = baseRegisterSchema.extend({
  tipo: z.literal('estudiante'),
  rol: z.literal('estudiante'),
  carrera: z.string().min(3, 'La carrera es obligatoria'),
  anioIngreso: z.coerce
    .number()
    .int('Debe ser un número entero')
    .min(1900, 'Año no válido')
    .max(new Date().getFullYear(), 'El año no puede ser mayor al actual')
    .optional()
    .or(z.literal('')),
  telefono: z.string()
    .regex(/^[0-9]{9,15}$/, 'Teléfono no válido')
    .optional()
    .or(z.literal(''))
});

const egresadoSchema = baseRegisterSchema.extend({
  tipo: z.literal('egresado'),
  rol: z.literal('egresado').default('egresado'),
  carrera: z.string().min(3, 'La carrera es obligatoria'),
  año_egreso: z.coerce
    .number({
      required_error: 'Año de egreso es requerido',
      invalid_type_error: 'Debe ser un año válido'
    })
    .int('Debe ser un número entero')
    .min(1900, 'Año no válido')
    .max(new Date().getFullYear(), 'El año no puede ser mayor al actual'),
  telefono: z.string()
    .regex(/^[0-9]{9,15}$/, 'Teléfono no válido')
    .optional()
    .or(z.literal(''))
});

const empresaSchema = baseRegisterSchema.extend({
  // Para empresas, el tipo debe ser 'empresa' o vacío
  tipo: z.union([z.literal('empresa'), z.literal('')])
    .transform(val => val === '' ? 'empresa' : val)
    .default('empresa'),
  
  rol: z.literal('empresa').default('empresa'),
  
  nombreEmpresa: z.string().min(3, { message: 'El nombre de la empresa es obligatorio' }),
  
  ruc: z.string()
    .min(11, { message: 'El RUC debe tener 11 dígitos' })
    .max(11, { message: 'El RUC no puede tener más de 11 dígitos' })
    .regex(/^[0-9]+$/, { message: 'El RUC solo puede contener números' }),
    
  rubro: z.string().min(3, { message: 'El rubro es obligatorio' }),
  
  // Hacer opcionales los campos que no son necesarios para empresas
  carrera: z.string().optional().default(''),
  anioIngreso: z.string().optional().default(''),
  año_egreso: z.string().optional().default(''),
  telefono: z.string().optional().default('')
});

export default function RegisterForm() {
  const [selectedRole, setSelectedRole] = useState('estudiante');
  const [submitError, setSubmitError] = useState('');
  const { register: registerUser, registerWithGoogle } = useAuth();

  const getCurrentSchema = () => {
    switch (selectedRole) {
      case 'estudiante':
        return estudianteSchema;
      case 'egresado':
        return egresadoSchema;
      case 'empresa':
        return empresaSchema;
      default:
        return estudianteSchema;
    }
  };

  // Inicializar el formulario con un esquema básico
  const { 
    register, 
    handleSubmit, 
    formState: { errors, touchedFields, isSubmitting }, 
    watch,
    setValue,
    trigger,
    reset,
    clearErrors,
    control,
    getValues
  } = useForm({
    resolver: zodResolver(getCurrentSchema()),
    mode: 'onChange',
    defaultValues: { 
      tipo: 'estudiante',
      rol: 'estudiante',
      anioIngreso: '',
      año_egreso: '',
      telefono: '',
      nombre: '', 
      email: '', 
      password: '', 
      carrera: '', 
      ruc: '', 
      nombreEmpresa: '', 
      rubro: '' 
    } 
  });

  // Actualizar el esquema cuando cambia el rol
  useEffect(() => {
    console.log('Rol cambiado a:', selectedRole);
    
    // Actualizar el esquema de validación
    const schema = getCurrentSchema();
    
    const defaultValues = {
      nombre: '',
      email: '',
      password: '',
      carrera: '',
      rol: selectedRole, // Asegurar que el rol se actualice
      tipo: selectedRole === 'empresa' ? '' : selectedRole,
      telefono: '',
      anioIngreso: '',
      año_egreso: '',
      ruc: '',
      nombreEmpresa: '',
      rubro: ''
    };
    
    // Si es estudiante o egresado, forzar el tipo
    if (selectedRole === 'estudiante' || selectedRole === 'egresado') {
      defaultValues.tipo = selectedRole;
    }
    
    console.log('Valores por defecto:', defaultValues);
    
    // Actualizar el formulario con los nuevos valores por defecto
    reset(defaultValues);
    
    // Forzar la actualización del valor del rol
    setValue('rol', selectedRole, { shouldValidate: true });
    
    // Limpiar errores
    clearErrors();
    
  }, [selectedRole, reset, clearErrors, setValue]);
  
  // Observar cambios en el tipo para forzar validación
  const currentTipo = watch('tipo');
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (selectedRole === 'estudiante' || selectedRole === 'egresado') {
      trigger('tipo');
    }
  }, [currentTipo, selectedRole, trigger]);

  // Función para verificar si se debe mostrar el error
  const shouldShowError = (fieldName) => {
    return (touchedFields[fieldName] || formSubmitted) && errors[fieldName];
  };

  const onSubmit = async (data) => {
    console.log('=== INICIO DE ONSUBMIT ===');
    console.log('Datos del formulario:', data);
    setSubmitError('');
    setFormSubmitted(true);
    
    try {
      console.log('=== DATOS DEL FORMULARIO CRUDOS ===', data);
      console.log('Rol seleccionado:', selectedRole);
      
      // Preparar los datos según el rol
      let userData = {
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        rol: data.rol || selectedRole,
      };

      console.log('Datos base del usuario:', userData);
      
      // Agregar campos específicos según el rol
      if (selectedRole === 'estudiante' || selectedRole === 'egresado') {
        userData = { 
          ...userData, 
          carrera: data.carrera, 
          tipo: selectedRole,
          telefono: data.telefono || null
        };
        
        console.log('Datos después de agregar campos de estudiante/egresado:', userData);
        
        if (selectedRole === 'estudiante') {
          console.log('Procesando datos de estudiante...');
          if (data.anioIngreso) {
            userData.anioIngreso = parseInt(data.anioIngreso);
            console.log('Año de ingreso procesado:', userData.anioIngreso);
          }
        }
        
        if (selectedRole === 'egresado' && data.año_egreso) {
          userData.año_egreso = parseInt(data.año_egreso);
          console.log('Año de egreso procesado:', userData.año_egreso);
        }
      } 
      
      if (selectedRole === 'empresa') {
        userData = { 
          ...userData, 
          ruc: data.ruc, 
          nombre_empresa: data.nombreEmpresa, 
          rubro: data.rubro 
        };
        console.log('Datos de empresa procesados:', userData);
      }
      
      console.log('=== DATOS FINALES A ENVIAR ===', JSON.stringify(userData, null, 2));
      
      // Validar que todos los campos requeridos estén presentes
      const requiredFields = ['nombre', 'email', 'password', 'rol'];
      const missingFields = requiredFields.filter(field => !userData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Faltan campos requeridos: ${missingFields.join(', ')}`);
      }
      
      if (selectedRole === 'estudiante' && !userData.carrera) {
        throw new Error('La carrera es obligatoria para estudiantes');
      }
      
      console.log('Enviando datos al servidor...');
      const response = await registerUser(userData);
      console.log('Respuesta del servidor:', response);
      
    } catch (error) {
      console.error('=== ERROR EN EL REGISTRO ===');
      console.error('Mensaje de error:', error.message);
      console.error('Error completo:', error);
      
      if (error.response) {
        console.error('Datos de respuesta del servidor:', error.response.data);
        console.error('Estado HTTP:', error.response.status);
        console.error('Cabeceras:', error.response.headers);
      }
      
      setSubmitError(
        error.response?.data?.error || 
        error.message || 
        'Ocurrió un error al procesar el registro. Por favor, inténtalo de nuevo.'
      );
    } finally {
      console.log('=== FIN DEL PROCESO DE REGISTRO ===');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      if (!selectedRole) {
        throw new Error('Por favor selecciona un tipo de cuenta (estudiante, egresado o empresa)');
      }
      
      await registerWithGoogle({
        credential: credentialResponse.credential,
        rol: selectedRole
      });
    } catch (error) {
      console.error('Error en registro con Google:', error);
      setSubmitError(error.message || 'Error al registrarse con Google');
    }
  };

  const handleGoogleError = () => {
    console.error('Google Register Falló');
    setSubmitError('Error al registrarse con Google');
  };

  const tipo = watch('tipo');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#3b82f6] mb-2">
            Únete a Protalent
          </h1>
          <p className="text-gray-300">Crea una cuenta para comenzar tu experiencia</p>
        </div>
        
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="bg-white/5 border border-[#38bdf8]/20 rounded-2xl p-6 sm:p-8 shadow-2xl transition-all duration-300 backdrop-blur-sm"
        >
          {/* Selector de rol */}
          <div className="grid grid-cols-3 gap-2 mb-8 p-1 rounded-2xl bg-white/5 border border-[#38bdf8]/20 shadow-inner overflow-hidden">
            <button
              type="button"
              onClick={() => setSelectedRole('estudiante')}
              className={cn(
                "py-3 px-4 rounded-xl text-sm sm:text-base font-semibold text-center transition-all duration-300 focus:outline-none relative z-10",
                selectedRole === 'estudiante'
                  ? "bg-[#38bdf8] text-[#062056] shadow-md border border-[#38bdf8]"
                  : "text-gray-300 hover:text-white"
              )}
            >
              Estudiante
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('egresado')}
              className={cn(
                "py-3 px-4 rounded-xl text-sm sm:text-base font-semibold text-center transition-all duration-300 focus:outline-none relative z-10",
                selectedRole === 'egresado'
                  ? "bg-[#38bdf8] text-[#062056] shadow-md border border-[#38bdf8]"
                  : "text-gray-300 hover:text-white"
              )}
            >
              Egresado
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('empresa')}
              className={cn(
                "py-3 px-4 rounded-xl text-sm sm:text-base font-semibold text-center transition-all duration-300 focus:outline-none relative z-10",
                selectedRole === 'empresa'
                  ? "bg-[#38bdf8] text-[#062056] shadow-md border border-[#38bdf8]"
                  : "text-gray-300 hover:text-white"
              )}
            >
              Empresa
            </button>
          </div>

          {/* Campos ocultos para tipo y rol */}
          <input type="hidden" {...register('tipo')} value={selectedRole === 'empresa' ? '' : selectedRole} />
              <input
            type="hidden" 
            {...register('rol')} 
            value={selectedRole} 
            onChange={(e) => {
              // Forzar la actualización del valor del rol
              setValue('rol', selectedRole, { shouldValidate: true });
            }}
          />
          
          {/* Renderizar el formulario correspondiente según el rol seleccionado */}
          {selectedRole === 'estudiante' && (
            <StudentForm 
              register={register} 
              errors={errors} 
              touchedFields={touchedFields} 
              formSubmitted={formSubmitted} 
              selectedRole={selectedRole} 
            />
          )}

          {selectedRole === 'egresado' && (
            <AlumniForm 
              register={register} 
              errors={errors} 
              touchedFields={touchedFields} 
              formSubmitted={formSubmitted} 
              selectedRole={selectedRole} 
            />
          )}

          {selectedRole === 'empresa' && (
            <CompanyForm 
              register={register} 
              errors={errors} 
              touchedFields={touchedFields} 
              formSubmitted={formSubmitted} 
              selectedRole={selectedRole} 
            />
          )}

          {submitError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {submitError}
            </div>
          )}

          <div className="mt-6">
            <button
              type="button"
              onClick={async (e) => {
                console.log('=== INICIO DEL PROCESO DE ENVÍO ===');
                e.preventDefault();
                
                try {
                  // 1. Obtener valores actuales
                  const currentValues = getValues();
                  console.log('1. Valores actuales del formulario:', JSON.stringify(currentValues, null, 2));
                  
                  // 2. Forzar validación
                  console.log('2. Validando formulario...');
                  const isValid = await trigger(undefined, { shouldFocus: true });
                  console.log('3. Formulario válido:', isValid);
                  
                  if (!isValid) {
                    // Crear un objeto simple con los mensajes de error
                    const errorMessages = {};
                    Object.entries(errors).forEach(([field, error]) => {
                      if (error) {
                        errorMessages[field] = error.message || 'Error de validación';
                        console.error(`Error en campo ${field}:`, error.message || 'Error de validación');
                      }
                    });
                    
                    console.log('4. Errores de validación:', errorMessages);
                    console.log('5. Campos tocados:', Object.keys(touchedFields).filter(field => touchedFields[field]));
                    return;
                  }
                  
                  // 3. Obtener valores después de la validación
                  const formValues = getValues();
                  console.log('4. Valores después de validar:', JSON.stringify(formValues, null, 2));
                  
                  // 4. Verificar campos requeridos
                  const requiredFields = ['nombre', 'email', 'password', 'rol'];
                  const missingFields = requiredFields.filter(field => !formValues[field]);
                  
                  if (missingFields.length > 0) {
                    console.error('5. Campos requeridos faltantes:', missingFields);
                    return;
                  }
                  
                  // 5. Iniciar envío
                  console.log('6. Iniciando envío...');
                  await onSubmit(formValues);
                  console.log('7. Envío completado');
                  
                } catch (error) {
                  console.error('ERROR EN EL PROCESO DE ENVÍO:', error);
                  if (error.response) {
                    console.error('Detalles del error:', error.response.data);
                  }
                } finally {
                  console.log('=== FIN DEL PROCESO DE ENVÍO ===');
                }
              }}
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:ring-opacity-50 mb-4 ${
                isSubmitting ? 'bg-[#38bdf8]/70 cursor-not-allowed' : 'bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#062056]'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </div>
              ) : 'Registrarse'}
            </button>
          </div>

          <div className="flex justify-center mb-6">
            <GoogleLogin
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              cookiePolicy="single_host_origin"
              theme="filled_blue"
              text="signup_with"
              shape="rectangular"
              width="350"
              locale="es"
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/auth/login" className="text-[#38bdf8] font-medium hover:text-[#0ea5e9] transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
