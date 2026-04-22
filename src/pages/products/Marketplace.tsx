import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Vista marketplace (solo presentación).
 * Navbar y Footer: `MainLayout` ya renderiza `src/components/Navbar` y `Footer`.
 */

function formatMoney(value: string | number, _currency?: string) {
  const n = Number(value) || 0;
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
}

interface Professor {
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
  avatar_url?: string;
  profile_picture_url?: string;
  username?: string;
}

interface Course {
  id: number | string;
  title: string;
  slug: string;
  price?: number | string;
  original_price?: number | string;
  is_on_sale?: boolean;
  image_file_url?: string;
  image_url?: string;
  category?: string;
  average_rating?: number;
  enrollment_count?: number;
  professor?: Professor;
  status?: string;
  reviews_count?: number;
  rating_count?: number;
  rating_average?: number;
  thumbnail_url?: string;
  author?: { name: string; avatar_url?: string };
  ally?: string;
  video_file_url?: string;
  video_url?: string;
  short_description?: string;
  description?: string;
  currency?: string;
}

const MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: 'Auditor Líder ISO 39001 — Seguridad vial',
    slug: 'curso-demo-1',
    price: 1299,
    original_price: 1899,
    is_on_sale: true,
    category: 'Gestión y Operaciones',
    average_rating: 4.8,
    enrollment_count: 420,
    status: 'published',
    reviews_count: 128,
    ally: 'intercert',
    image_file_url:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop',
    video_file_url: 'https://dnnuvgwtrg1xr.cloudfront.net/assets/videos/home-lerny.mp4',
    professor: { first_name: 'María', last_name: 'García', profile_picture_url: undefined },
    short_description: 'Transformación profesional e impacto social con estándares internacionales.',
  },
  {
    id: 2,
    title: 'Finanzas para emprendedores',
    slug: 'curso-demo-2',
    price: 899,
    category: 'Finanzas y Negocios',
    rating_average: 4.6,
    enrollment_count: 310,
    status: 'published',
    reviews_count: 90,
    image_url:
      'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=400&auto=format&fit=crop',
    video_url: 'https://dnnuvgwtrg1xr.cloudfront.net/assets/videos/home-lerny.mp4',
    professor: { first_name: 'Carlos', last_name: 'Ruiz' },
  },
  {
    id: 3,
    title: 'Marketing digital integral',
    slug: 'curso-demo-3',
    price: 749,
    category: 'Marketing y Ventas',
    average_rating: 4.9,
    enrollment_count: 512,
    status: 'published',
    rating_count: 200,
    thumbnail_url:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop',
    video_file_url: 'https://dnnuvgwtrg1xr.cloudfront.net/assets/videos/home-lerny.mp4',
    author: { name: 'INTERCERT ACADEMY' },
  },
  {
    id: 4,
    title: 'Python para análisis de datos',
    slug: 'curso-demo-4',
    price: 1099,
    is_on_sale: false,
    category: 'Tecnología y Data',
    average_rating: 4.7,
    enrollment_count: 880,
    status: 'published',
    reviews_count: 240,
    image_file_url:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop',
    video_file_url: 'https://dnnuvgwtrg1xr.cloudfront.net/assets/videos/home-lerny.mp4',
    professor: { username: 'DataLab' },
  },
  {
    id: 5,
    title: 'Liderazgo y equipos remotos',
    slug: 'curso-demo-5',
    price: 649,
    category: 'Desarrollo Profesional',
    rating_average: 4.5,
    enrollment_count: 210,
    status: 'published',
    reviews_count: 55,
    image_url:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 6,
    title: 'UX/UI desde cero',
    slug: 'curso-demo-6',
    price: 999,
    original_price: 1200,
    is_on_sale: true,
    category: 'Creatividad y Diseño',
    average_rating: 4.95,
    enrollment_count: 340,
    status: 'published',
    reviews_count: 180,
    thumbnail_url:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=400&auto=format&fit=crop',
    video_file_url: 'https://dnnuvgwtrg1xr.cloudfront.net/assets/videos/home-lerny.mp4',
    professor: { first_name: 'Ana', last_name: 'López' },
  },
  {
    id: 7,
    title: 'Excel avanzado para negocios',
    slug: 'curso-demo-7',
    price: 499,
    category: 'Finanzas y Negocios',
    average_rating: 4.4,
    enrollment_count: 1200,
    status: 'published',
    reviews_count: 400,
    image_file_url:
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 8,
    title: 'Branding y storytelling',
    slug: 'curso-demo-8',
    price: 859,
    category: 'Marketing y Ventas',
    average_rating: 4.85,
    enrollment_count: 190,
    status: 'published',
    reviews_count: 72,
    ally: 'intercert',
    thumbnail_url:
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400&auto=format&fit=crop',
    video_file_url: 'https://dnnuvgwtrg1xr.cloudfront.net/assets/videos/home-lerny.mp4',
  },
];

const OFFER_ITEMS = [
  { title: 'Cursos', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop' },
  { title: 'E-books', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop' },
  { title: 'Talleres', img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=400&auto=format&fit=crop' },
  { title: 'Software', img: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=400&auto=format&fit=crop' },
  { title: 'Imágenes', img: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=400&auto=format&fit=crop' },
  { title: 'Audiolibros', img: 'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?q=80&w=400&auto=format&fit=crop' },
  { title: 'Suscripciones', img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=400&auto=format&fit=crop' },
  { title: 'Eventos', img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=400&auto=format&fit=crop' },
];

/** Categorías estáticas (misma idea que el navbar principal; sin API). */
const MARKETPLACE_NAV_CATEGORIES = [
  {
    id: 'finanzas',
    title: 'Finanzas y Negocios',
    subcategories: ['Contabilidad', 'Finanzas', 'Inversiones', 'Emprendimiento', 'Administración'],
  },
  {
    id: 'gestion',
    title: 'Gestión y Operaciones',
    subcategories: [
      'Gestión de proyectos',
      'Productividad',
      'Gestión de operaciones',
      'Gestión de procesos',
      'Gestión de calidad',
    ],
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

function MarketplaceCategoryNav() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const active = hoveredId ? MARKETPLACE_NAV_CATEGORIES.find((c) => c.id === hoveredId) : null;

  return (
    <div
      style={{ position: 'relative', maxWidth: '1400px', margin: '0 auto' }}
      onMouseLeave={() => setHoveredId(null)}
    >
      <div
        className="marketplace-hide-scrollbar"
        style={{
          background: '#f0f0f0',
          overflowX: 'auto',
          padding: '10px 24px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <ul
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            gap: 'clamp(16px, 3vw, 36px)',
            justifyContent: 'center',
            minWidth: 'max-content',
          }}
        >
          {MARKETPLACE_NAV_CATEGORIES.map((cat) => {
            const isActive = hoveredId === cat.id;
            return (
              <li key={cat.id} style={{ flexShrink: 0 }}>
                <button
                  type="button"
                  onMouseEnter={() => setHoveredId(cat.id)}
                  style={{
                    whiteSpace: 'nowrap',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: isActive ? '2px solid #FFD147' : '2px solid transparent',
                    cursor: 'pointer',
                    padding: '6px 2px',
                    fontSize: '15px',
                    color: '#111',
                    fontWeight: isActive ? 700 : 400,
                    transition: 'font-weight 0.12s ease, border-color 0.12s ease',
                  }}
                >
                  {cat.title}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {active && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '100%',
            background: '#ffffff',
            padding: '10px 20px 14px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px 22px',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 14px 28px rgba(0,0,0,0.14)',
            zIndex: 40,
          }}
        >
          {active.subcategories.map((sub) => (
            <span key={sub} className="marketplace-subcat-item" style={{ fontSize: '13px', color: '#333', padding: '8px 10px', borderRadius: '4px', cursor: 'default' }}>
              {sub}
            </span>
          ))}
        </div>
      )}
      <style>{`
        .marketplace-hide-scrollbar::-webkit-scrollbar { display: none; }
        .marketplace-hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .marketplace-subcat-item:hover { background: #e0e0e0; }
      `}</style>
    </div>
  );
}

function IconButton({
  icon,
  activeIcon,
  activeColor,
  onClick,
}: {
  icon: string;
  activeIcon: string;
  activeColor?: string;
  onClick: (e: React.MouseEvent) => void;
}) {
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const baseIcon = icon.endsWith('-line') ? icon : `${icon}-line`;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsBtnHovered(true)}
      onMouseLeave={() => setIsBtnHovered(false)}
      style={{
        width: '34px',
        height: '34px',
        borderRadius: '8px',
        border: '1.2px solid #FFC847',
        background: isBtnHovered ? '#000000' : 'transparent',
        color: isBtnHovered ? activeColor || '#FFFFFF' : '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      <i className={isBtnHovered ? activeIcon : baseIcon} style={{ fontSize: '16px', color: 'inherit' }} />
    </button>
  );
}

type CourseCardProps = {
  course: Course;
  isAffiliate?: boolean;
  onOpenPreview?: (course: Course) => void;
};

function CourseCard({ course, isAffiliate = false, onOpenPreview }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<{
    url: string;
    title: string;
    price: string | number;
    rating: number;
    slug: string;
    instructor_name: string;
    instructor_avatar: string;
    currency?: string;
  } | null>(null);

  const videoUrl = course.video_file_url || course.video_url;

  return (
    <>
      {previewVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setPreviewVideo(null);
          }}
        >
          <div
            className="w-full max-w-[420px] overflow-hidden rounded-[24px] shadow-2xl animate-in zoom-in-95 duration-200 relative bg-[#FFC847]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center bg-black/20 hover:bg-black/40 text-white rounded-full transition-all"
              onClick={() => setPreviewVideo(null)}
            >
              <i className="ri-close-line text-xl font-bold" />
            </button>
            <div className="w-full aspect-video bg-black relative group overflow-hidden">
              <video src={previewVideo.url} controls autoPlay crossOrigin="anonymous" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex">
                <span className="bg-black/10 text-black/60 px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border border-black/5">
                  Cursos
                </span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <h2 className="text-xl font-black text-black leading-tight flex-1">{previewVideo.title}</h2>
                <div className="bg-black text-[#FFC847] px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold shadow-md h-fit">
                  <i className="ri-star-fill" />
                  {previewVideo.rating.toFixed(1)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gray-300 rounded-full border border-black/10 overflow-hidden shadow-sm">
                  <img src={previewVideo.instructor_avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-black opacity-80 uppercase tracking-tighter">{previewVideo.instructor_name}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-3xl font-black text-black">{formatMoney(previewVideo.price, previewVideo.currency)}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="w-[38px] h-[38px] rounded-[10px] border border-black bg-transparent flex items-center justify-center cursor-pointer transition-all hover:bg-black group/v"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="ri-heart-line text-lg text-black group-hover/v:text-[#FFC847]" />
                  </button>
                  <button
                    type="button"
                    className="w-[38px] h-[38px] rounded-[10px] border border-black bg-transparent flex items-center justify-center cursor-pointer transition-all hover:bg-black group/c"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="ri-shopping-cart-line text-lg text-black group-hover/c:text-[#FFC847]" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="w-full bg-black text-white py-3 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-black/90 transition-all shadow-md active:scale-[0.98]"
                onClick={() => setPreviewVideo(null)}
              >
                Ver más detalle
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpenPreview?.(course)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenPreview?.(course);
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '1.2px solid #FFC847',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          boxShadow: isHovered ? '0 8px 20px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.05)',
          cursor: 'pointer',
          width: '100%',
          maxWidth: '300px',
          height: '100%',
          transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
          position: 'relative',
        }}
      >
        <div style={{ padding: '8px 8px 0 8px' }}>
          <div
            style={{
              position: 'relative',
              aspectRatio: '16/9',
              background: '#F5F5F5',
              borderRadius: '14px',
              overflow: 'hidden',
            }}
          >
            {videoUrl && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0,0,0,0.1)',
                  zIndex: 10,
                  transition: 'background 0.3s ease',
                }}
                className="group/play"
                onClick={(e) => {
                  e.stopPropagation();
                  const professor = course.professor;
                  const author = course.author;
                  const instructorName = professor
                    ? `${professor.first_name || ''} ${professor.last_name || ''}`.trim() || professor.username
                    : author?.name || 'INTERCERT ACADEMY';
                  const instructorAvatar =
                    professor?.profile_picture_url ||
                    professor?.avatar_url ||
                    professor?.profile_picture ||
                    author?.avatar_url ||
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop';
                  setPreviewVideo({
                    url: course.video_file_url || course.video_url || '',
                    title: course.title,
                    price: course.price || '0.00',
                    rating: Number(course.average_rating || course.rating_average || 0),
                    slug: course.slug,
                    instructor_name: instructorName || 'INTERCERT ACADEMY',
                    instructor_avatar: instructorAvatar,
                    currency: course.currency,
                  });
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    background: 'rgba(255, 200, 71, 0.9)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    transform: 'scale(0.9)',
                    transition: 'transform 0.2s ease',
                  }}
                  className="group-hover/play:scale-110"
                >
                  <i className="ri-play-fill" style={{ fontSize: '24px', color: '#000', marginLeft: '3px' }} />
                </div>
              </div>
            )}
            <img
              src={
                course.image_file_url ||
                course.image_url ||
                course.thumbnail_url ||
                course.video_file_url ||
                course.video_url ||
                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop'
              }
              alt={course.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>

        <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
            <span
              style={{
                background: '#FFC847',
                color: '#000000',
                padding: '3px 8px',
                borderRadius: '5px',
                fontSize: '10px',
                fontWeight: '700',
              }}
            >
              {course.category || 'Creatividad y Diseño'}
            </span>
            <div
              style={{
                background: '#000000',
                color: '#FFFFFF',
                padding: '3px 6px',
                borderRadius: '5px',
                fontSize: '10px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <i className="ri-star-fill" style={{ color: '#FFC847' }} />
              {(course.average_rating != null && course.average_rating !== undefined) ||
              (course.rating_average != null && course.rating_average !== undefined)
                ? Number(course.average_rating || course.rating_average || 0).toFixed(1)
                : '0.0'}
            </div>
          </div>

          <h3
            style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#000000',
              marginBottom: '6px',
              lineHeight: '1.2',
              minHeight: '34px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {course.title}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', color: '#666', fontSize: '11px' }}>
            <i className="ri-user-line" style={{ fontSize: '12px' }} />
            <span style={{ fontWeight: '600' }}>{course.enrollment_count ?? '180'}</span>
          </div>

          <div style={{ height: '1px', background: '#EEE', marginBottom: '10px' }} />

          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px', fontWeight: '800', color: '#3D5AFE' }}>
              {formatMoney(course.price || '0.00', course.currency)}
            </span>
            {course.is_on_sale && course.original_price && (
              <span style={{ fontSize: '11px', color: '#999', textDecoration: 'line-through' }}>
                {formatMoney(course.original_price, course.currency)}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{
                flex: 1,
                background: isAffiliate ? '#000000' : '#FFC847',
                color: isAffiliate ? '#FFFFFF' : '#000000',
                border: 'none',
                padding: '8px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isAffiliate ? '#333333' : '#000000';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isAffiliate ? '#000000' : '#FFC847';
                e.currentTarget.style.color = isAffiliate ? '#FFFFFF' : '#000000';
              }}
            >
              {isAffiliate ? 'Afíliate y Promociona' : 'Comprar ahora'}
            </button>
            {!isAffiliate && (
              <>
                <IconButton
                  icon="ri-heart"
                  activeIcon="ri-heart-fill"
                  activeColor="#FF4B4B"
                  onClick={(e) => e.stopPropagation()}
                />
                <IconButton
                  icon="ri-shopping-cart-line"
                  activeIcon="ri-shopping-cart-fill"
                  onClick={(e) => e.stopPropagation()}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function CourseCarouselSection({
  title,
  courses,
  renderCard,
}: {
  title: string;
  courses: Course[];
  renderCard: (c: Course) => React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowPrev(scrollLeft > 10);
      setShowNext(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        direction === 'left' ? scrollRef.current.scrollLeft - scrollAmount : scrollRef.current.scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      const timer = window.setTimeout(handleScroll, 100);
      return () => {
        el.removeEventListener('scroll', handleScroll);
        window.clearTimeout(timer);
      };
    }
  }, [courses]);

  return (
    <div style={{ marginBottom: '60px', position: 'relative' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#000000', marginBottom: '15px' }}>{title}</h2>
      <div style={{ position: 'relative' }}>
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '30px',
            overflowX: 'auto',
            paddingBottom: '15px',
            paddingTop: '5px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {courses.map((course) => (
            <div key={course.id} style={{ minWidth: '300px', flex: '0 0 300px', scrollSnapAlign: 'start' }}>
              {renderCard(course)}
            </div>
          ))}
        </div>
        {showPrev && (
          <button
            type="button"
            onClick={() => scroll('left')}
            style={{
              position: 'absolute',
              left: '-20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              background: '#FFC847',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 10,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <i className="ri-arrow-left-s-line" style={{ fontSize: '24px', color: '#000', fontWeight: 'bold' }} />
          </button>
        )}
        {showNext && (
          <button
            type="button"
            onClick={() => scroll('right')}
            style={{
              position: 'absolute',
              right: '-20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              background: '#FFC847',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 10,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <i className="ri-arrow-right-s-line" style={{ fontSize: '24px', color: '#000', fontWeight: 'bold' }} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function Marketplace() {
  const published = MOCK_COURSES.filter((c) => c.status === 'published');
  const topRated = [...published]
    .filter((c) => (c.average_rating || c.rating_average || 0) >= 4.5)
    .sort((a, b) => (b.average_rating || b.rating_average || 0) - (a.average_rating || a.rating_average || 0))
    .slice(0, 8);
  const bestSelling = [...published]
    .sort((a, b) => (b.reviews_count || b.rating_count || 0) - (a.reviews_count || a.rating_count || 0))
    .slice(0, 8);
  const certified = published.filter((c) => c.ally === 'intercert').slice(0, 10);
  const trending = [...published].sort(() => 0.5 - Math.random()).slice(0, 10);

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [searchQuery] = useState('');
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (carouselRef.current) {
        const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
        if (carouselRef.current.scrollLeft >= maxScroll - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }
    }, 4000);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const filtered = published.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ minHeight: '100vh', paddingTop: '12px' }}>
      <div style={{ position: 'relative', zIndex: 30 }}>
        <MarketplaceCategoryNav />
      </div>
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1000px',
          margin: '16px auto 20px',
          padding: isMobile ? '0 16px' : '0 20px',
        }}
      >
        <div
          style={{
            position: 'relative',
            borderRadius: isMobile ? '16px' : '24px',
            overflow: 'hidden',
            aspectRatio: '16/9',
            background: '#000',
            width: '100%',
          }}
        >
          <video
            ref={(el) => {
              if (el) el.muted = true;
            }}
            src="https://dnnuvgwtrg1xr.cloudfront.net/assets/videos/home-lerny.mp4"
            autoPlay
            loop
            muted
            playsInline
            crossOrigin="anonymous"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              display: 'block',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: isMobile ? '10px' : '20px',
              left: isMobile ? '10px' : '20px',
              width: isMobile ? '80px' : '150px',
              height: isMobile ? '80px' : '150px',
              backgroundImage: 'radial-gradient(#FFC847 2px, transparent 2px)',
              backgroundSize: isMobile ? '10px 10px' : '15px 15px',
              opacity: 0.6,
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      <div
        style={{
          background: 'linear-gradient(180deg, #FFC847 0%, #FFFFFF 100%)',
          padding: '40px 0',
          marginBottom: '30px',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: isMobile ? '0 16px' : '0 40px',
            position: 'relative',
          }}
        >
          <div
            ref={carouselRef}
            style={{
              display: 'flex',
              gap: '24px',
              overflowX: 'auto',
              paddingBottom: '20px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory',
            }}
          >
            {OFFER_ITEMS.map((item, i) => (
              <div
                key={i}
                role="presentation"
                style={{
                  minWidth: '220px',
                  height: '140px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  scrollSnapAlign: 'start',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  const label = e.currentTarget.querySelector('.overlay-label') as HTMLElement;
                  if (label) {
                    label.style.background = '#FFC847';
                    label.style.color = '#000';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  const label = e.currentTarget.querySelector('.overlay-label') as HTMLElement;
                  if (label) {
                    label.style.background = '#000';
                    label.style.color = '#fff';
                  }
                }}
              >
                <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div
                  className="overlay-label"
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#000000',
                    color: '#FFFFFF',
                    padding: '8px 24px',
                    borderRadius: '30px',
                    fontSize: '14px',
                    fontWeight: '400',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: isMobile ? '24px 16px 32px' : '28px 24px 40px',
          textAlign: 'center',
        }}
      >
        <Link
          to="/register"
          style={{
            background: '#FFC847',
            color: '#000000',
            border: 'none',
            padding: '10px 40px',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(255, 200, 71, 0.3)',
            transition: 'transform 0.2s ease',
            display: 'inline-block',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ¡Regístrate ya!
        </Link>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(20px, 5vw, 40px) 40px' }}>
        <div style={{ minHeight: '400px' }}>
          <>
              {published.length > 0 && (
                <CourseCarouselSection
                  title="Nuevos lanzamientos"
                  courses={published.slice(0, 10)}
                  renderCard={(course) => (
                    <CourseCard key={course.id} course={course} onOpenPreview={setPreviewCourse} />
                  )}
                />
              )}
              {certified.length > 0 && (
                <CourseCarouselSection
                  title="Certificados por Intercert"
                  courses={certified}
                  renderCard={(course) => (
                    <CourseCard key={course.id} course={course} onOpenPreview={setPreviewCourse} />
                  )}
                />
              )}
              {bestSelling.length > 0 && (
                <CourseCarouselSection
                  title="Más vendidos"
                  courses={bestSelling}
                  renderCard={(course) => (
                    <CourseCard key={course.id} course={course} onOpenPreview={setPreviewCourse} />
                  )}
                />
              )}
              {topRated.length > 0 && (
                <CourseCarouselSection
                  title="Mejor valorados"
                  courses={topRated}
                  renderCard={(course) => (
                    <CourseCard key={course.id} course={course} onOpenPreview={setPreviewCourse} />
                  )}
                />
              )}
              {trending.length > 0 && (
                <CourseCarouselSection
                  title="En tendencia"
                  courses={trending}
                  renderCard={(course) => (
                    <CourseCard key={course.id} course={course} onOpenPreview={setPreviewCourse} />
                  )}
                />
              )}
              {published.length > 0 && (
                <CourseCarouselSection
                  title="Recomendados para ti"
                  courses={[...published].reverse().slice(0, 10)}
                  renderCard={(course) => (
                    <CourseCard key={course.id} course={course} onOpenPreview={setPreviewCourse} />
                  )}
                />
              )}
          </>

          <div style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#000000', marginBottom: '15px' }}>
              {searchQuery ? `Resultados para "${searchQuery}"` : 'Todos los productos'}
            </h2>
            <div
              className="all-products-container"
              style={{
                display: 'flex',
                gap: isMobile ? '20px' : '30px',
                overflowX: 'auto',
                paddingBottom: '20px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                scrollSnapType: isMobile ? 'x mandatory' : 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {filtered.slice(0, 3).map((course) => (
                <div
                  key={course.id}
                  style={{ minWidth: isMobile ? '260px' : '300px', flex: '0 0 auto', scrollSnapAlign: 'start' }}
                >
                  <CourseCard course={course} onOpenPreview={setPreviewCourse} />
                </div>
              ))}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1.2px dashed #000000',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  minWidth: isMobile ? '260px' : '300px',
                  maxWidth: '300px',
                  flex: '0 0 auto',
                  scrollSnapAlign: 'start',
                  height: 'auto',
                  minHeight: '350px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  marginLeft: isMobile ? '0' : 'auto',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F7FAFC';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FFFFFF';
                }}
              >
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #333 0%, #000 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '15px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                  }}
                >
                  <i className="ri-shopping-cart-2-fill" style={{ fontSize: '24px', color: '#FFC847' }} />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#000000', marginBottom: '8px', maxWidth: '280px', lineHeight: '1.2' }}>
                  Conoce todos nuestros productos
                </h3>
                <p style={{ fontSize: '13px', color: '#718096', marginBottom: '15px' }}>Explora nuestro catálogo</p>
                <span
                  style={{
                    background: '#FFC847',
                    color: '#000000',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  Ir al LernyMarket <i className="ri-arrow-right-line" />
                </span>
              </div>
            </div>
            <style>{`
              .all-products-container::-webkit-scrollbar { display: none; }
            `}</style>
          </div>
        </div>
      </div>

      {previewCourse && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setPreviewCourse(null)}
        >
          <div
            className="relative w-full max-w-[440px] flex flex-col rounded-[24px] overflow-hidden shadow-2xl bg-black border border-white/5"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'fadeIn 0.2s ease-out' }}
          >
            <button
              type="button"
              onClick={() => setPreviewCourse(null)}
              className="absolute top-4 right-4 z-50 text-white flex items-center justify-center w-[30px] h-[30px] bg-black/80 rounded-full backdrop-blur-md shadow-lg transition-transform hover:scale-110 active:scale-95 group"
            >
              <i className="ri-close-line text-[22px] leading-none group-hover:text-[#FFC847] transition-colors mt-[1px]" />
            </button>
            <div className="relative w-full h-[240px] bg-gray-900 flex-shrink-0 flex items-center justify-center">
              {previewCourse.image_file_url || previewCourse.image_url || previewCourse.thumbnail_url ? (
                <img
                  src={previewCourse.image_file_url || previewCourse.image_url || previewCourse.thumbnail_url}
                  alt={previewCourse.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
              ) : (
                <i className="ri-video-off-line text-4xl text-gray-500 relative z-10" />
              )}
            </div>
            <div className="flex flex-1 w-full flex-row items-stretch bg-black">
              <div className="w-[80px] flex-shrink-0 bg-black pointer-events-none" />
              <div className="flex-1 p-[24px] flex flex-col gap-4 bg-[#FFC847]">
                <div className="flex">
                  <span className="bg-black/10 text-black/60 px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border border-black/5">
                    {previewCourse.category || 'CURSOS'}
                  </span>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-[20px] font-black text-black leading-tight flex-1 line-clamp-3">{previewCourse.title}</h2>
                  <div className="bg-black text-[#FFC847] px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold shadow-md h-fit flex-shrink-0">
                    <i className="ri-star-fill" />
                    {Number(
                      previewCourse.average_rating ?? previewCourse.rating_average ?? 4,
                    ).toFixed(1)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gray-300 rounded-full border border-black/10 overflow-hidden shadow-sm flex-shrink-0">
                    <img
                      src="https://media.lernymart.com/user_profiles/WhatsApp_Image_2026-02-26_at_11.55.00.jpeg"
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-bold text-black opacity-80 uppercase tracking-tight">
                    {previewCourse.author?.name || previewCourse.professor?.first_name || 'INTERCERT ACADEMY'}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-[32px] font-black text-black tracking-tight leading-none">
                    {formatMoney(previewCourse.price || '0.00', previewCourse.currency)}
                  </span>
                  {(previewCourse.original_price || previewCourse.is_on_sale) && (
                    <span className="text-sm font-bold text-black/30 line-through">
                      {formatMoney(previewCourse.original_price || '500.00', previewCourse.currency)}
                    </span>
                  )}
                </div>
                <p className="text-[12px] font-semibold text-black/60 leading-relaxed line-clamp-3 text-justify">
                  {previewCourse.short_description ||
                    previewCourse.description ||
                    '¡Bienvenidos a la puerta de entrada a una transformación profesional y un impacto social real!'}
                </p>
                <button
                  type="button"
                  onClick={() => setPreviewCourse(null)}
                  className="w-full mt-2 bg-black text-white py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:text-[#ffc847] transition-all shadow-md active:scale-[0.98]"
                >
                  VER MÁS DETALLE
                </button>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.95) translateY(10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
