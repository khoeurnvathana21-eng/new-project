# ============================================================
# BootZone Server - Models Architecture
# File: server/models/README.md
#
# BootZone uses a "query-first" architecture with mysql2/promise
# rather than an ORM. SQL queries live inside controllers for
# transparency and performance. This directory is reserved for
# shared model helpers and complex query builders.
# ============================================================

## Shared Query Helpers

See `queryBuilder.js` for reusable WHERE-clause and pagination helpers
used across product, order, and user controllers.
