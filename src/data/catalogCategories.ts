export interface CatalogCategory {
  id: string;
  title: string;
  subcategories: string[];
}

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  {
    id: 'finanzas',
    title: 'Finanzas y Negocios',
    subcategories: ['Contabilidad', 'Finanzas', 'Inversiones', 'Emprendimiento', 'Administración'],
  },
  {
    id: 'gestion',
    title: 'Gestión y Operaciones',
    subcategories: ['Gestión de proyectos', 'Productividad', 'Gestión de operaciones', 'Gestión de procesos', 'Gestión de calidad'],
  },
  {
    id: 'marketing',
    title: 'Marketing y Ventas',
    subcategories: [
      'Marketing',
      'Marketing digital',
      'Trade marketing',
      'Branding',
      'Ventas',
      'E-commerce',
      'Gestión comercial',
      'Experiencia al cliente',
      'Redes sociales',
    ],
  },
  {
    id: 'tecnologia',
    title: 'Tecnología y Data',
    subcategories: [
      'Programación',
      'Desarrollo de software',
      'Desarrollo web',
      'Data analytics',
      'Machine learning',
      'Informática',
      'Inteligencia artificial',
      'Automatización',
      'Transformación digital',
    ],
  },
  {
    id: 'desarrollo',
    title: 'Desarrollo Profesional',
    subcategories: ['Liderazgo', 'Mindset', 'Habilidades blandas', 'People management'],
  },
  {
    id: 'creatividad',
    title: 'Creatividad y Diseño',
    subcategories: ['Diseño gráfico', 'Creatividad aplicada', 'UX/UI', 'Producto digital', 'Fotografía y video'],
  },
];

export function getCategoryById(categoryId?: string) {
  return CATALOG_CATEGORIES.find((c) => c.id === categoryId);
}
