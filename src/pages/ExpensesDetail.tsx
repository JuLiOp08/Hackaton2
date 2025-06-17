// Nuevo archivo sugerido: src/pages/ExpensesDetail.tsx
import { useState } from "react";
import { getExpensesDetail } from "../api";
import useToken from "../contexts/TokenContext";

export default function ExpensesDetail() {
  const { token } = useToken();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [categoryId, setCategoryId] = useState<number>(1);
  const [detail, setDetail] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFetch() {
    if (!token) return;
    const result = await getExpensesDetail(token, year, month, categoryId);
    if (result.success) {
      setDetail(result.data);
      setError(null);
    } else {
      setError(result.error ?? null);
      setDetail(null);
    }
  }

  return (
    <div>
      <h2>Detalle de Gastos por Categoría</h2>
      <div>
        <input
          type="number"
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          placeholder="Año"
        />
        <input
          type="number"
          value={month}
          onChange={e => setMonth(Number(e.target.value))}
          placeholder="Mes"
          min={1}
          max={12}
        />
        <input
          type="number"
          value={categoryId}
          onChange={e => setCategoryId(Number(e.target.value))}
          placeholder="ID Categoría"
        />
        <button onClick={handleFetch}>Buscar</button>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {detail && <pre>{JSON.stringify(detail, null, 2)}</pre>}
    </div>
  );
}