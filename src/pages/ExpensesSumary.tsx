import { useEffect, useState, useMemo } from "react";
import { getExpensesSummary } from "../api";
import { useToken } from "../contexts/TokenContext";

export default function ExpensesSummary() {
  const { token } = useToken();
  const [summary, setSummary] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchSummary() {
      if (!token) return;
      try {
        setLoading(true);
        const result = await getExpensesSummary(token);
        if (result.success) {
          setSummary(result.data);
        } else {
          setError(result.error ?? "Error al cargar los datos");
        }
      } catch (err) {
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, [token]);

  // Ordenar los gastos por año y mes (más reciente primero)
  const sortedExpenses = useMemo(() => {
    return [...summary].sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [summary]);

  // Calcular los gastos paginados
  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedExpenses.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedExpenses, currentPage]);

  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);

  const formatMonth = (monthNumber: number) => {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return months[monthNumber - 1] || monthNumber;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  
  if (loading) {
    return (
      <div className="flex flex-col items-center mt-8 text-lg text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-500 mb-4" />
        Cargando resumen...
      </div>
    );
  }

  if (summary.length === 0) {
    return <div className="p-4 text-gray-500">No hay datos de gastos disponibles</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Resumen de Gastos</h2>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mes/Año
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedExpenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {expense.expenseCategory.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatMonth(expense.month)} {expense.year}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          
          <span className="text-white">
            Página {currentPage} de {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}