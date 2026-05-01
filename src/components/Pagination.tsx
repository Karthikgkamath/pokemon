import React from "react";
import "./Pagination.css";

interface Props {
  page: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}
export const Pagination= ({
  page,
  totalCount,
  pageSize,
  onPageChange,
}:Props) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  if (totalPages <= 1) return null;
  const getPages = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    const delta = 2;
    const left = page - delta;
    const right = page + delta;
    for (let i = 0; i < totalPages; i++) {
      if (i === 0 || i === totalPages - 1 || (i >= left && i <= right)) {
        pages.push(i);
      } else if (
        (i === left - 1 && left > 1) ||
        (i === right + 1 && right < totalPages - 2)
      ) {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="page-btn nav-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        aria-label="Previous page"
      >
        ← Prev
      </button>

      <div className="page-numbers">
        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="ellipsis">
              …
            </span>
          ) : (
            <button
              key={p}
              className={`page-btn number-btn ${p === page ? "active" : ""}`}
              onClick={() => onPageChange(p as number)}
            >
              {(p as number) + 1}
            </button>
          )
        )}
      </div>

      <button
        className="page-btn nav-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        aria-label="Next page"
      >
        Next →
      </button>
    </div>
  );
};
