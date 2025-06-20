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

  // Para el formulario de búsqueda
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [details, setDetails] = useState<ExpenseDetail[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  // Tab control
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

  // Divide las categorías en dos columnas para el panel pequeño
  const mid = Math.ceil(categories.length / 2);
  const col1 = categories.slice(0, mid);
  const col2 = categories.slice(mid);

  return (
    <div className="flex min-h-screen bg-[#8B4C4C]">
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center py-12 px-2">
        {/* Tabs */}
        <div className="flex mb-8 space-x-2">
          <button
            className={`px-6 py-2 rounded-t-lg font-semibold transition-colors ${
              tab === TAB_SEARCH
                ? 'bg-white text-[#8B4C4C] border-b-2 border-[#8B4C4C]'
                : 'bg-[#e7bcbc] text-[#8B4C4C] hover:bg-white'
            }`}
            onClick={() => setTab(TAB_SEARCH)}
          >
            Buscar detalle
          </button>
          <button
            className={`px-6 py-2 rounded-t-lg font-semibold transition-colors ${
              tab === TAB_CATEGORIES
                ? 'bg-white text-[#8B4C4C] border-b-2 border-[#8B4C4C]'
                : 'bg-[#e7bcbc] text-[#8B4C4C] hover:bg-white'
            }`}
            onClick={() => setTab(TAB_CATEGORIES)}
          >
            Categorías
          </button>
        </div>

        {/* Página de búsqueda */}
        {tab === TAB_SEARCH && (
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl mb-8 border border-[#cfa7a7]">
            <h3 className="text-xl font-semibold mb-4 text-center text-[#8B4C4C]">Buscar detalle de gastos</h3>
            <form className="flex flex-col gap-4" onSubmit={handleSearch}>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="number"
                  min="2000"
                  max="2100"
                  placeholder="Año (YYYY)"
                  className="border rounded px-3 py-2 w-full border-[#cfa7a7] focus:ring-2 focus:ring-[#8B4C4C]"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                />
                <input
                  type="number"
                  min="1"
                  max="12"
                  placeholder="Mes (MM)"
                  className="border rounded px-3 py-2 w-full border-[#cfa7a7] focus:ring-2 focus:ring-[#8B4C4C]"
                  value={month}
                  onChange={e => setMonth(e.target.value)}
                />
                <select
                  className="border rounded px-3 py-2 w-full border-[#cfa7a7] focus:ring-2 focus:ring-[#8B4C4C]"
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
                className="bg-[#8B4C4C] text-black rounded px-4 py-2 font-semibold hover:bg-[#a85d5d] transition-colors"
                disabled={searching}
              >
                {searching ? 'Buscando...' : 'Buscar'}
              </button>
            </form>
            {searchError && <div className="text-red-600 mt-2 text-center">{searchError}</div>}
          </div>
        )}

        {/* Página de categorías: ahora SIEMPRE centrada */}
        {tab === TAB_CATEGORIES && (
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mb-8 border border-[#cfa7a7]">
            <h2 className="text-2xl font-bold mb-6 text-center text-[#8B4C4C]">Categorías de gastos</h2>
            <div className="grid grid-cols-2 gap-2">
              <ul className="space-y-2">
                {col1.map((category) => (
                  <li
                    key={category.id}
                    className="py-2 px-4 bg-[#f7eaea] rounded hover:bg-[#e7bcbc] transition-colors text-[#8B4C4C] text-center"
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {col2.map((category) => (
                  <li
                    key={category.id}
                    className="py-2 px-4 bg-[#f7eaea] rounded hover:bg-[#e7bcbc] transition-colors text-[#8B4C4C] text-center"
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Resultados */}
        {tab === TAB_SEARCH && details && (
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl border border-[#cfa7a7]">
            <h4 className="text-lg font-bold mb-4 text-[#8B4C4C] text-center">Detalle de gastos</h4>
            {details.length > 0 ? (
              <table className="w-full border">
                <thead>
                  <tr className="bg-[#f7eaea]">
                    <th className="p-2 border border-[#cfa7a7]">Fecha</th>
                    <th className="p-2 border border-[#cfa7a7]">Categoría</th>
                    <th className="p-2 border border-[#cfa7a7]">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map(item => (
                    <tr key={item.id} className="hover:bg-[#fbeaea]">
                      <td className="p-2 border border-[#cfa7a7]">{item.date}</td>
                      <td className="p-2 border border-[#cfa7a7]">{item.category.name}</td>
                      <td className="p-2 border border-[#cfa7a7]">S/ {item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-gray-500">No hay gastos para esos parámetros.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseCategories;