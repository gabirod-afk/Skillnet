import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface Professor {
  first_name?: string;
  last_name?: string;
  username?: string;
  profile_picture?: string;
  profile_picture_url?: string;
  avatar_url?: string;
}

interface Course {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  short_description?: string;
  price?: number | string;
  original_price?: number | string;
  is_on_sale?: boolean;
  category?: string;
  level?: string;
  language?: string;
  duration_hours?: number;
  duration_minutes?: number;
  average_rating?: number;
  rating_average?: number;
  enrollment_count?: number;
  image_file_url?: string;
  image_url?: string;
  thumbnail_url?: string;
  professor?: Professor;
}

function formatMoney(value: string | number) {
  const n = Number(value) || 0;
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
}

function formatDuration(course: Course) {
  const h = Number(course.duration_hours || 0);
  const m = Number(course.duration_minutes || 0);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h} horas`;
  if (m > 0) return `${m} min`;
  return 'Duración no especificada';
}

export default function CourseDetailsPage() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) {
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'courses', courseId));
        if (!snap.exists()) {
          setCourse(null);
          return;
        }
        setCourse({ id: snap.id, ...(snap.data() as Omit<Course, 'id'>) });
      } catch (error) {
        console.error('Error loading course details:', error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    void loadCourse();
  }, [courseId]);

  const instructorName = useMemo(() => {
    if (!course?.professor) return 'Instructor';
    const fullName = `${course.professor.first_name || ''} ${course.professor.last_name || ''}`.trim();
    return fullName || course.professor.username || 'Instructor';
  }, [course?.professor]);

  const imageUrl =
    course?.image_file_url ||
    course?.image_url ||
    course?.thumbnail_url ||
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAF6]">
        <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-[#FFC847] animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAF6] px-4">
        <div className="text-center">
          <h1 className="text-3xl font-black text-black mb-2">Course not found</h1>
          <p className="text-gray-600 mb-6">No encontramos el curso o producto solicitado.</p>
          <Link to="/marketplace" className="inline-block bg-black text-white px-5 py-2.5 rounded-lg no-underline">
            Volver al Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFAF6]">
      <section className="bg-[#121D31] text-white">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 grid lg:grid-cols-[1fr_420px] gap-8 items-start">
          <div className="space-y-5">
            <Link to="/marketplace" className="inline-flex items-center gap-2 text-white/80 hover:text-[#FFC847] no-underline text-sm">
              <i className="ri-arrow-left-line" />
              Volver al Marketplace
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#FFC847] text-black px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide">
                {course.category || 'Curso'}
              </span>
              <span className="bg-white/10 text-white px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide">
                Rating {(course.average_rating || course.rating_average || 0).toFixed(1)}
              </span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-black leading-tight">{course.title}</h1>
            <p className="text-white/80 text-base leading-relaxed max-w-3xl">
              {course.short_description || course.description || 'Detalle del curso.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-[11px] text-[#FFC847] font-bold uppercase">Nivel</p>
                <p className="font-semibold text-sm">{course.level || 'Intermedio'}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-[11px] text-[#FFC847] font-bold uppercase">Duración</p>
                <p className="font-semibold text-sm">{formatDuration(course)}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-[11px] text-[#FFC847] font-bold uppercase">Idioma</p>
                <p className="font-semibold text-sm">{course.language || 'Español'}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-[11px] text-[#FFC847] font-bold uppercase">Estudiantes</p>
                <p className="font-semibold text-sm">{course.enrollment_count || 0}</p>
              </div>
            </div>
          </div>

          <aside className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xl">
            <img src={imageUrl} alt={course.title} className="w-full aspect-video object-cover" />
            <div className="p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">Infoproductor</p>
              <p className="text-black font-bold mb-4">{instructorName}</p>

              <div className="flex items-end gap-2 mb-5">
                <span className="text-3xl font-black text-[#3D5AFE]">{formatMoney(course.price || 0)}</span>
                {course.is_on_sale && course.original_price ? (
                  <span className="text-sm text-gray-400 line-through">{formatMoney(course.original_price)}</span>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => navigate('/checkout', { state: { directCourse: course } })}
                className="w-full bg-black text-white py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:text-[#ffc847] transition-all shadow-md active:scale-[0.98]"
              >
                Comprar ahora
              </button>
            </div>
          </aside>
        </div>
      </section>

      <section className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white border border-[#FFC847] rounded-xl p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.06)]">
          <h2 className="text-2xl font-black text-[#0B1529] mb-4">Descripción del curso</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {course.description || 'Este curso aún no tiene una descripción extendida.'}
          </p>
        </div>
      </section>
    </div>
  );
}
