import { useState, useEffect, useMemo } from "react";
import { getExpensesDetail } from "../api";
import { useToken } from "../contexts/TokenContext";

export default function ExpensesDetail() {
  const { token } = useToken();
  const currentDate = new Date();
  
  // Estados para los filtros
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [categoryInput, setCategoryInput] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<{id: number, name: string} | null>(null);
  
  // Estados para los datos
  const [details, setDetails] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener categorías disponibles
  useEffect(() => {
    // Simulación de API - en una app real harías una llamada aquí
    const mockCategories = [
      { id: 1, name: "Alimentación" },
      { id: 2, name: "Transporte" },
      { id: 3, name: "Entretenimiento" },
      { id: 4, name: "Tecnología" },
      { id: 5, name: "Hogar" },
      { id: 6, name: "Salud" },
      { id: 7, name: "Educación" },
      { id: 8, name: "Ropa" },
    ];
    setCategories(mockCategories);
  }, []);

  // Filtramos categorías según lo que el usuario escribe
  const filteredCategories = useMemo(() => {
    if (!categoryInput) return categories;
    return categories.filter(cat =>
      cat.name.toLowerCase().includes(categoryInput.toLowerCase())
    );
  }, [categoryInput, categories]);

  // Manejar selección de categoría
  const handleCategorySelect = (category: {id: number, name: string}) => {
    setSelectedCategory(category);
    setCategoryInput(category.name);
  };

  // Manejar entrada manual
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryInput(e.target.value);
    setSelectedCategory(null);
  };

  // Buscar detalles
  const fetchDetails = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Si no hay categoría seleccionada pero hay texto, buscar por nombre
      const categoryParam = selectedCategory 
        ? selectedCategory.id 
        : categoryInput;
      
      const result = await getExpensesDetail(
        token, 
        year, 
        month, 
        categoryParam
      );
      
      if (result.success) {
        setDetails(Array.isArray(result.data) ? result.data : [result.data]);
      } else {
        setError(result.error || "Error al obtener los detalles");
        setDetails([]);
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      setDetails([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Validación del formulario
  const isFormValid = year > 2000 && year < 2100 && 
                     month >= 1 && month <= 12 && 
                     (selectedCategory || categoryInput.trim());

  // Formateadores
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Detalle de Gastos</h2>
      
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Selector de Año */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Año
            </label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
            >
              {Array.from({ length: 10 }, (_, i) => currentDate.getFullYear() - i).map((y) => (
              <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Selector de Mes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mes
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(2000, m - 1, 1).toLocaleString('es-ES', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Categoría con autocompletado */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <input
              type="text"
              value={categoryInput}
              onChange={handleCategoryChange}
              placeholder="Escribe o selecciona una categoría"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
            />
            {categoryInput && !selectedCategory && filteredCategories.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleCategorySelect(cat)}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botón de búsqueda */}
          <div className="flex items-end">
            <button
              onClick={fetchDetails}
              disabled={!isFormValid || isLoading}
              className={`w-full py-2 px-4 rounded-md text-white ${isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              {isLoading ? 'Buscando...' : 'Buscar Gastos'}
            </button>
          </div>
        </div>
      </div>

      {/* Resto del componente (igual que antes) */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando detalles...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {details.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="text-lg font-medium text-gray-800">
              Gastos {selectedCategory ? `de ${selectedCategory.name}` : `con "${categoryInput}"`} 
              en {new Date(year, month - 1).toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {details.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(expense.date)}
                      </div>
                    </td>
              
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${expense.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(expense.amount)}
                      </div>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {details.length === 0 && !isLoading && !error && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No hay datos disponibles. Realice una búsqueda.</p>
        </div>
      )}
    </div>
  );
}