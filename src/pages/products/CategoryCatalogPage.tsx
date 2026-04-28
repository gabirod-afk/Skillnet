import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getCategoryById } from '../../data/catalogCategories';

interface Course {
  id: string;
  title: string;
  category?: string;
  subcategory?: string;
  price?: number | string;
  image_file_url?: string;
  image_url?: string;
  thumbnail_url?: string;
  description?: string;
  short_description?: string;
  average_rating?: number;
  rating_average?: number;
  status?: string;
}

function formatMoney(value: number | string | undefined) {
  const n = Number(value) || 0;
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
}

export default function CategoryCatalogPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSubcategory = searchParams.get('sub') || '';
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);

  const category = useMemo(() => getCategoryById(categoryId), [categoryId]);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'courses'));
        const allCourses = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Course, 'id'>),
        }));

        const categoryTitle = category?.title?.toLowerCase() || '';

        const filteredByCategory = allCourses.filter((course) => {
          if (course.status && course.status !== 'published') return false;
          const c = (course.category || '').toLowerCase();
          return categoryTitle ? c.includes(categoryTitle) : false;
        });

        const filteredBySub = selectedSubcategory
          ? filteredByCategory.filter((course) =>
              (course.subcategory || '').toLowerCase().includes(selectedSubcategory.toLowerCase()),
            )
          : filteredByCategory;

        setCourses(filteredBySub);
      } catch (error) {
        console.error('Error loading category catalog:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    void loadCourses();
  }, [category?.title, selectedSubcategory]);

  if (!category) {
    return (
      <div className="min-h-screen bg-[#FCFAF6] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-black mb-2">Categoría no encontrada</h1>
          <Link to="/marketplace" className="inline-block bg-black text-white px-5 py-2 rounded-lg no-underline">
            Volver al marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFAF6]">
      <section className="bg-white border-b border-gray-200">
        <div className="h-[56px] overflow-x-auto whitespace-nowrap">
          <ul className="flex items-center list-none m-0 p-0 pr-6 gap-2 min-w-max h-full">
            <li
              className="flex items-center bg-[#FFC847] px-6 ml-0 relative h-full z-[2]"
              style={{
                clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%)',
                filter: 'drop-shadow(black 1px 0px 0px) drop-shadow(black 0px 1px 0px) drop-shadow(black 0px -1px 0px)',
              }}
            >
              <div className="absolute left-[-100vw] top-0 bottom-0 w-[100vw] bg-[#FFC847] -z-10" />
              <button type="button" className="bg-transparent border-none cursor-pointer text-[14px] font-bold text-black py-4 whitespace-nowrap">
                {category.title}
              </button>
            </li>
            {category.subcategories.map((sub) => {
              const isActive = selectedSubcategory === sub;
              return (
                <li key={sub}>
                  <button
                    type="button"
                    onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.set('sub', sub);
                      setSearchParams(next);
                    }}
                    className={`bg-transparent border-none cursor-pointer text-[14px] py-4 px-3 whitespace-nowrap transition-all ${
                      isActive ? 'font-bold text-black' : 'font-normal text-[#555]'
                    }`}
                  >
                    {sub}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-black">{category.title}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {selectedSubcategory ? `Subcategoría: ${selectedSubcategory}` : 'Explora los infoproductos disponibles'}
          </p>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-[#FFC847] animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center">
            <p className="text-gray-600 font-medium">No encontramos productos para este filtro.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-[#FFC847] rounded-[18px] overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
                onClick={() => navigate(`/marketplace/course/${course.id}`)}
              >
                <img
                  src={
                    course.image_file_url ||
                    course.image_url ||
                    course.thumbnail_url ||
                    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop'
                  }
                  alt={course.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="p-3 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-[#FFC847] text-black text-[10px] font-bold px-2 py-1 rounded">
                      {course.subcategory || category.title}
                    </span>
                    <span className="bg-black text-[#FFC847] text-[10px] font-bold px-2 py-1 rounded">
                      {(course.average_rating || course.rating_average || 0).toFixed(1)}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-black line-clamp-2 min-h-[38px]">{course.title}</h3>
                  <p className="text-[12px] text-gray-600 mt-1 line-clamp-2">
                    {course.short_description || course.description || 'Infoproducto de formación profesional.'}
                  </p>
                  <div className="mt-auto pt-3">
                    <p className="text-[16px] font-black text-[#3D5AFE] mb-2">{formatMoney(course.price)}</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/marketplace/course/${course.id}`);
                      }}
                      className="w-full bg-black text-white py-3 rounded-xl font-black text-[11px] uppercase tracking-widest hover:text-[#ffc847] transition-all shadow-md active:scale-[0.98]"
                    >
                      VER MÁS DETALLE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
