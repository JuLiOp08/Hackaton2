import { useEffect, useState } from "react";
import { getExpensesSummary } from "../api";
import { useToken } from "../contexts/TokenContext";

export default function ExpensesSummary() {
  const { token } = useToken();
  const [summary, setSummary] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      if (!token) return;
      const result = await getExpensesSummary(token);
      if (result.success) {
        setSummary(result.data);
      } else {
        setError(result.error ?? null);
      }
    }
    fetchSummary();
  }, [token]);

  if (error) return <div>Error: {error}</div>;
  if (!summary) return <div>Cargando resumen...</div>;

  return (
    <div>
      <h2>Resumen de Gastos</h2>
      <pre>{JSON.stringify(summary, null, 2)}</pre>
    </div>
  );
}