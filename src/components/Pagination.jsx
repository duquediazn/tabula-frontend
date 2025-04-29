export default function Pagination({ total, limit, offset, onPageChange }) {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  const handlePrevious = () => {
    if (offset > 0) onPageChange(offset - limit);
  };

  const handleNext = () => {
    if (offset + limit < total) onPageChange(offset + limit);
  };

  return (
    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 gap-2">
      <div>
        Página <span className="font-medium">{currentPage}</span> de{" "}
        <span className="font-medium">{totalPages}</span> — Mostrando{" "}
        <span className="font-medium">{offset + 1}</span> a{" "}
        <span className="font-medium">{Math.min(offset + limit, total)}</span>{" "}
        de <span className="font-medium">{total}</span> resultados
      </div>
      <div className="flex gap-2">
        <button
          role="button"
          onClick={handlePrevious}
          disabled={offset === 0}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          role="button"
          onClick={handleNext}
          disabled={offset + limit >= total}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
