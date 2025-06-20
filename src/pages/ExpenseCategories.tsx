import React, { useEffect, useState } from 'react';
import { getCategories, getExpensesDetail } from '../api';
import useToken from '../contexts/TokenContext';

interface Category {
  id: number;
  name: string;
}

interface ExpenseDetail {
  id: number;
  date: string;
  category: { id: number; name: string };
  amount: number;
}

const TAB_CATEGORIES = 0;
const TAB_SEARCH = 1;

const ExpenseCategories: React.FC = () => {
  const { token } = useToken();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [details, setDetails] = useState<ExpenseDetail[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  const [tab, setTab] = useState<number>(TAB_SEARCH);

  useEffect(() => {
    if (!token) {
      setError('Debes iniciar sesión para ver las categorías.');
      setLoading(false);
      return;
    }
    const fetchCategories = async () => {
      const result = await getCategories(token);
      if (result.success) {
        setCategories(result.data);
        setError(null);
      } else {
        setError(result.error ?? null);
      }
      setLoading(false);
    };
    fetchCategories();
  }, [token]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setDetails(null);

    if (!year || !month || !categoryId) {
      setSearchError('Completa todos los campos.');
      return;
    }
    if (!token) {
      setSearchError('Debes iniciar sesión para buscar detalles.');
      return;
    }
    setSearching(true);
    const result = await getExpensesDetail(token, Number(year), Number(month), Number(categoryId));
    if (result.success) {
      setDetails(result.data);
      setSearchError(null);
    } else {
      setSearchError(result.error ?? 'Error al buscar detalles.');
    }
    setSearching(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando categorías...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#8B4C4C] justify-center px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl border border-[#cfa7a7]">
        {/* Tabs dentro del cuadro blanco */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              tab === TAB_SEARCH
                ? 'bg-[#8B4C4C] text-white'
                : 'bg-[#d6a6a6] text-black hover:bg-[#f2e6e6]'
            }`}
            onClick={() => setTab(TAB_SEARCH)}
          >
            Buscar detalle
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              tab === TAB_CATEGORIES
                ? 'bg-[#8B4C4C] text-white'
                : 'bg-[#d6a6a6] text-black hover:bg-[#f2e6e6]'
            }`}
            onClick={() => setTab(TAB_CATEGORIES)}
          >
            Categorías
          </button>
        </div>

        {/* Formulario de búsqueda */}
        {tab === TAB_SEARCH && (
          <>
            <h3 className="text-2xl font-bold text-black mb-6 text-center">Buscar detalle de gastos</h3>
            <form className="flex flex-col gap-4" onSubmit={handleSearch}>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="number"
                  min="2000"
                  max="2100"
                  placeholder="Año (YYYY)"
                  className="border rounded px-4 py-2 w-full border-[#8B4C4C] bg-[#f7eaea] text-[#8B4C4C] focus:ring-2 focus:ring-[#8B4C4C]"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                />
                <input
                  type="number"
                  min="1"
                  max="12"
                  placeholder="Mes (MM)"
                  className="border rounded px-4 py-2 w-full border-[#8B4C4C] bg-[#f7eaea] text-[#8B4C4C] focus:ring-2 focus:ring-[#8B4C4C]"
                  value={month}
                  onChange={e => setMonth(e.target.value)}
                />
                <select
                  className="border rounded px-4 py-2 w-full border-[#8B4C4C] bg-[#f7eaea] text-[#8B4C4C] focus:ring-2 focus:ring-[#8B4C4C]"
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                >
                  <option value="">Categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-[#8B4C4C] text-white rounded px-4 py-2 font-semibold hover:bg-[#a85d5d] transition-colors"
                disabled={searching}
              >
                {searching ? 'Buscando...' : 'Buscar'}
              </button>
            </form>
            {searchError && <div className="text-red-600 mt-2 text-center">{searchError}</div>}
          </>
        )}

        {/* Tabla de categorías */}
        {tab === TAB_CATEGORIES && (
          <>
            <h2 className="text-2xl font-bold text-black mb-6 text-center">Categorías de gastos</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-[#cfa7a7] rounded-lg shadow">
                <thead>
                  <tr className="bg-[#8B4C4C] text-white">
                    <th className="py-3 px-6 border border-[#cfa7a7] text-left text-lg font-semibold">#</th>
                    <th className="py-3 px-6 border border-[#cfa7a7] text-left text-lg font-semibold">Categoría</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={category.id} className="hover:bg-[#fbeaea] text-black">
                      <td className="py-2 px-6 border border-[#cfa7a7]">{index + 1}</td>
                      <td className="py-2 px-6 border border-[#cfa7a7]">{category.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Resultados */}
        {tab === TAB_SEARCH && details && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8 border border-[#cfa7a7]">
            <h4 className="text-lg font-bold mb-4 text-[#8B4C4C] text-center">Detalle de gastos</h4>
            {details.length > 0 ? (
              <table className="w-full border">
                <thead>
                  <tr className="bg-[#8B4C4C] text-white">
                    <th className="p-2 border border-[#a86b6b]">Fecha</th>
                    <th className="p-2 border border-[#a86b6b]">Categoría</th>
                    <th className="p-2 border border-[#a86b6b]">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map(item => (
                    <tr key={item.id} className="bg-[#f7eaea] text-black">
                      <td className="p-2 border border-[#a86b6b]">{item.date}</td>
                      <td className="p-2 border border-[#a86b6b]">{item.category.name}</td>
                      <td className="p-2 border border-[#a86b6b]">S/ {item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-gray-800">No hay gastos para esos parámetros.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseCategories;
