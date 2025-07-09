'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiBriefcase, FiEdit2, FiSave, FiX, FiUpload, FiLinkedin, FiTwitter, FiFacebook, FiInstagram } from 'react-icons/fi';

export default function PerfilPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    ruc: '',
    descripcion: '',
    industria: '',
    tamano: '',
    fundacion: '',
    telefono: '',
    email: '',
    sitioWeb: '',
    direccion: '',
    ciudad: '',
    pais: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
    sobreLaEmpresa: '',
    mision: '',
    vision: '',
    valores: [],
    beneficios: [],
  });

  // Cargar datos de la empresa (simulado)
  useEffect(() => {
    const timer = setTimeout(() => {
      setFormData({
        nombre: 'Tech Solutions S.A.',
        ruc: '20123456789',
        descripcion: 'Soluciones tecnológicas innovadoras para empresas',
        industria: 'Tecnología',
        tamano: '51-200 empleados',
        fundacion: '2015',
        telefono: '+51 1 2345678',
        email: 'contacto@techsolutions.com',
        sitioWeb: 'https://techsolutions.com',
        direccion: 'Av. Javier Prado 1234',
        ciudad: 'Lima',
        pais: 'Perú',
        linkedin: 'tech-solutions-sa',
        twitter: 'techsolutions',
        facebook: 'techsolutions',
        instagram: 'techsolutions',
        sobreLaEmpresa: 'Somos una empresa líder en desarrollo de software con más de 8 años de experiencia en el mercado, especializados en soluciones empresariales a medida.',
        mision: 'Brindar soluciones tecnológicas innovadoras que impulsen el crecimiento de nuestros clientes, superando sus expectativas con calidad y compromiso.',
        vision: 'Ser reconocidos como la empresa de tecnología más confiable y vanguardista de Latinoamérica para el 2030.',
        valores: ['Innovación', 'Calidad', 'Compromiso', 'Trabajo en equipo', 'Ética'],
        beneficios: ['Seguro médico', 'Capacitaciones', 'Horario flexible', 'Trabajo remoto', 'Bonos por desempeño'],
      });
      setPreviewImage('/images/company-placeholder.jpg');
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambios en arrays (valores, beneficios)
  const handleArrayChange = (arrayName, value, index) => {
    const newArray = [...formData[arrayName]];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [arrayName]: newArray
    }));
  };

  // Agregar nuevo ítem a un array
  const addArrayItem = (arrayName, defaultValue = '') => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultValue]
    }));
  };

  // Eliminar ítem de un array
  const removeArrayItem = (arrayName, index) => {
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      [arrayName]: newArray
    }));
  };

  // Manejar carga de imagen
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Guardar cambios
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simular envío de datos
    setTimeout(() => {
      console.log('Datos guardados:', formData);
      setIsSaving(false);
      setIsEditing(false);
      // Aquí iría la lógica para guardar en la API
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Perfil de la Empresa</h1>
          <div className="mt-4 md:mt-0">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiEdit2 className="mr-2 h-4 w-4" />
                Editar Perfil
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiX className="mr-2 h-4 w-4" />
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {/* Sección de encabezado con foto de perfil */}
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden">
                    {previewImage ? (
                      <img className="h-full w-full object-cover" src={previewImage} alt="Logo de la empresa" />
                    ) : (
                      <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                        <FiBriefcase className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <div className="absolute bottom-0 right-0">
                      <label className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white cursor-pointer hover:bg-blue-700">
                        <FiUpload className="h-4 w-4" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  )}
                </div>
                <div className="ml-6">
                  {isEditing ? (
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-gray-900">{formData.nombre}</h2>
                  )}
                  {isEditing ? (
                    <input
                      type="text"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      className="mt-1 text-sm text-gray-500 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent w-full"
                      placeholder="Breve descripción de la empresa"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">{formData.descripcion}</p>
                  )}
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-4">
                <a 
                  href={`https://linkedin.com/company/${formData.linkedin}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600"
                >
                  <FiLinkedin className="h-6 w-6" />
                </a>
                <a 
                  href={`https://twitter.com/${formData.twitter}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400"
                >
                  <FiTwitter className="h-6 w-6" />
                </a>
                <a 
                  href={`https://facebook.com/${formData.facebook}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-800"
                >
                  <FiFacebook className="h-6 w-6" />
                </a>
                <a 
                  href={`https://instagram.com/${formData.instagram}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-600"
                >
                  <FiInstagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Sección de información básica */}
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Información Básica</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">RUC</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="ruc"
                    value={formData.ruc}
                    onChange={handleChange}
                    className="mt-1 block w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{formData.ruc}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Industria</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="industria"
                    value={formData.industria}
                    onChange={handleChange}
                    className="mt-1 block w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{formData.industria}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Tamaño</label>
                {isEditing ? (
                  <select
                    name="tamano"
                    value={formData.tamano}
                    onChange={handleChange}
                    className="mt-1 block w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                  >
                    <option value="">Seleccionar tamaño</option>
                    <option value="1-10 empleados">1-10 empleados</option>
                    <option value="11-50 empleados">11-50 empleados</option>
                    <option value="51-200 empleados">51-200 empleados</option>
                    <option value="201-500 empleados">201-500 empleados</option>
                    <option value="501-1000 empleados">501-1000 empleados</option>
                    <option value="1001-5000 empleados">1001-5000 empleados</option>
                    <option value="5000+ empleados">5000+ empleados</option>
                  </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{formData.tamano}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Año de Fundación</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fundacion"
                    value={formData.fundacion}
                    onChange={handleChange}
                    className="mt-1 block w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{formData.fundacion}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sección de información de contacto */}
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Información de Contacto</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Teléfono</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="mt-1 block w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <div className="flex items-center mt-1">
                    <FiPhone className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">{formData.telefono}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Correo Electrónico</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <div className="flex items-center mt-1">
                    <FiMail className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">{formData.email}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Sitio Web</label>
                {isEditing ? (
                  <input
                    type="url"
                    name="sitioWeb"
                    value={formData.sitioWeb}
                    onChange={handleChange}
                    className="mt-1 block w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <div className="flex items-center mt-1">
                    <FiGlobe className="h-4 w-4 text-gray-400 mr-2" />
                    <a 
                      href={formData.sitioWeb.startsWith('http') ? formData.sitioWeb : `https://${formData.sitioWeb}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {formData.sitioWeb.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Dirección</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="mt-1 block w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <div className="flex items-start mt-1">
                    <FiMapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-900">{formData.direccion}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Ciudad</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    className="mt-1 block w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{formData.ciudad}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">País</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="pais"
                    value={formData.pais}
                    onChange={handleChange}
                    className="mt-1 block w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{formData.pais}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sección de redes sociales */}
          {isEditing && (
            <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Redes Sociales</h3>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">LinkedIn</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      linkedin.com/company/
                    </span>
                    <input
                      type="text"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="nombre-empresa"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Twitter</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      twitter.com/
                    </span>
                    <input
                      type="text"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="usuario"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Facebook</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      facebook.com/
                    </span>
                    <input
                      type="text"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="usuario"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Instagram</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      instagram.com/
                    </span>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="usuario"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sección de información corporativa */}
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Información Corporativa</h3>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-500">Sobre la Empresa</label>
              {isEditing ? (
                <textarea
                  name="sobreLaEmpresa"
                  value={formData.sobreLaEmpresa}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{formData.sobreLaEmpresa}</p>
              )}
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Misión</label>
                {isEditing ? (
                  <textarea
                    name="mision"
                    value={formData.mision}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{formData.mision}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Visión</label>
                {isEditing ? (
                  <textarea
                    name="vision"
                    value={formData.vision}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{formData.vision}</p>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-500">Valores</label>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => addArrayItem('valores', '')}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      + Agregar valor
                    </button>
                  )}
                </div>
                {formData.valores.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {formData.valores.map((valor, index) => (
                      <li key={index} className="flex items-center">
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              value={valor}
                              onChange={(e) => handleArrayChange('valores', e.target.value, index)}
                              className="flex-1 block w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem('valores', index)}
                              className="ml-2 text-red-600 hover:text-red-800"
                            >
                              <FiX className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {valor}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-sm text-gray-500 italic">No se han definido valores</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-500">Beneficios</label>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => addArrayItem('beneficios', '')}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      + Agregar beneficio
                    </button>
                  )}
                </div>
                {formData.beneficios.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {formData.beneficios.map((beneficio, index) => (
                      <li key={index} className="flex items-center">
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              value={beneficio}
                              onChange={(e) => handleArrayChange('beneficios', e.target.value, index)}
                              className="flex-1 block w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem('beneficios', index)}
                              className="ml-2 text-red-600 hover:text-red-800"
                            >
                              <FiX className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <span className="inline-flex items-center">
                            <svg className="h-4 w-4 text-green-500 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {beneficio}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-sm text-gray-500 italic">No se han definido beneficios</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
