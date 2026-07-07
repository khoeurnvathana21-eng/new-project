// ============================================================
// BootZone Server - Query Builder Helpers
// File: server/models/queryBuilder.js
// Reusable helpers for building dynamic SQL queries
// ============================================================

// Build a WHERE clause from a list of conditions
export const buildWhere = (conditions) => {
  const clauses = [];
  const params = [];
  for (const [clause, param] of conditions) {
    if (param !== null && param !== undefined && param !== '') {
      clauses.push(clause);
      if (Array.isArray(param)) {
        params.push(...param);
      } else {
        params.push(param);
      }
    }
  }
  return {
    where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
    params,
  };
};

// Build LIMIT/OFFSET for pagination
export const buildPagination = (page, limit) => {
  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(100, Math.max(1, Number(limit) || 20));
  return { limit: l, offset: (p - 1) * l, page: p };
};

// Map sort param to SQL ORDER BY
export const mapSort = (sort, allowed) => {
  return allowed[sort] || allowed.default || 'created_at DESC';
};

// Parse a JSON column safely
export const parseJSON = (value) => {
  if (!value) return null;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return null; }
  }
  return value;
};
