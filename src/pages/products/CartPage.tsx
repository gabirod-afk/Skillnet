import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useEffect } from 'react';

interface RecommendationCourse {
  id: string;
  title: string;
  price?: number | string;
  image_file_url?: string;
  image_url?: string;
  thumbnail_url?: string;
}

function formatMoney(value: number | string) {
  const n = Number(value) || 0;
  return `US$ ${n.toFixed(2)}`;
}

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const [coupon, setCoupon] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [recommended, setRecommended] = useState<RecommendationCourse[]>([]);

  useEffect(() => {
    if (items.length > 0 && selectedItems.length === 0) {
      setSelectedItems(items.map((i) => i.id));
    }
  }, [items, selectedItems.length]);

  useEffect(() => {
    const loadRecommended = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'courses'));
        const cartIds = new Set(items.map((i) => i.id));
        const courses = querySnapshot.docs
          .map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Omit<RecommendationCourse, 'id'>) }))
          .filter((course) => !cartIds.has(course.id))
          .slice(0, 4);
        setRecommended(courses);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      }
    };
    void loadRecommended();
  }, [items]);

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const selectedProducts = items.filter((item) => selectedItems.includes(item.id));
  const subtotal = useMemo(
    () => selectedProducts.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [selectedProducts],
  );
  const discount = 0;
  const total = subtotal - discount;

  return (
    <div className="max-w-[1450px] mx-auto px-4 py-8">
      <div className="flex items-center gap-2.5 mb-8">
        <i className="ri-shopping-cart-2-line text-2xl font-bold" />
        <h1 className="text-2xl font-bold">Carrito de compras</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        <div className="flex-1 w-full">
          <div className="border border-black rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[min-content_3fr_1fr_1fr] px-4 py-3 pr-16 border-b border-black font-semibold text-[13px] gap-2.5">
              <div />
              <span>Producto</span>
              <span className="text-center">Cantidad</span>
              <span className="text-right">Total</span>
            </div>

            {items.length === 0 ? (
              <div className="p-10 text-center text-gray-500">Tu carrito está vacío</div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="relative grid grid-cols-[min-content_3fr_1fr_1fr] items-center px-4 py-3 pr-16 border-b border-black gap-2.5 group"
                  style={{ background: selectedItems.includes(item.id) ? '#FFFBEB' : '#FFF' }}
                >
                  <div onClick={() => toggleSelect(item.id)} className="cursor-pointer flex">
                    {selectedItems.includes(item.id) ? (
                      <div className="w-[10px] h-[10px] rounded-full border-2 border-[#FFC847] flex items-center justify-center">
                        <div className="w-[10px] h-[10px] rounded-full bg-[#FFC847]" />
                      </div>
                    ) : (
                      <div className="w-[10px] h-[10px] rounded-full border-[1.5px] border-black" />
                    )}
                  </div>

                  <div className="flex gap-3 items-center">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=500&auto=format&fit=crop'}
                      alt={item.title}
                      className="w-20 h-[54px] rounded-md object-cover"
                    />
                    <span className="font-semibold text-[13px] max-w-[300px]">{item.title}</span>
                  </div>

                  <div className="flex justify-center">
                    <div className="flex items-center border border-black rounded-[20px] px-2 py-0.5 gap-2 text-[13px]">
                      <button type="button" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right font-bold text-[15px]">{formatMoney(item.price * item.quantity)}</div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-red-100 text-red-500 border-none w-8 h-8 rounded-full items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity flex"
                  >
                    <i className="ri-delete-bin-line text-[16px]" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="w-full lg:w-[300px] shrink-0">
          <div className="border border-black rounded-2xl p-5 bg-white">
            <h3 className="text-[16px] font-bold mb-4">Resumen de Compra</h3>

            <div className="flex gap-2.5 mb-5">
              <input
                type="text"
                placeholder="Código de descuento"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-[13px] bg-white text-black"
              />
              <button type="button" className="bg-black text-white rounded-lg px-4 py-2 text-[12px]">
                Aplicar
              </button>
            </div>

            <div className="flex justify-between mb-2 text-[13px] text-[#333]">
              <span>Sub Total</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between mb-4 text-[13px] text-[#333]">
              <span>Descuento (0%)</span>
              <span>-{formatMoney(discount)}</span>
            </div>
            <div className="h-px bg-[#EEE] mb-4" />
            <div className="flex justify-between mb-6 text-[15px] font-bold">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>

            <button
              type="button"
              disabled={selectedProducts.length === 0}
              onClick={() => navigate('/checkout', { state: { directCourse: selectedProducts[0] } })}
              className="w-full bg-black text-white py-3 rounded-[24px] border-none font-bold text-[13px] disabled:opacity-50"
            >
              Comprar ahora
            </button>
          </div>
        </div>
      </div>

      {recommended.length > 0 && (
        <div className="mt-[60px]">
          <h2 className="text-[22px] font-bold mb-6 text-black">Quizás también te interese</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommended.map((course) => (
              <button
                key={course.id}
                type="button"
                onClick={() => navigate(`/marketplace/course/${course.id}`)}
                className="text-left bg-white border border-[#FFC847] rounded-xl overflow-hidden"
              >
                <img
                  src={
                    course.image_file_url ||
                    course.thumbnail_url ||
                    course.image_url ||
                    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=500&auto=format&fit=crop'
                  }
                  alt={course.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="p-3">
                  <p className="font-bold text-sm line-clamp-2 mb-1">{course.title}</p>
                  <p className="text-[#3D5AFE] font-extrabold text-sm">{formatMoney(course.price || 0)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
