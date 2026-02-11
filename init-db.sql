-- Initialize database schemas
CREATE SCHEMA IF NOT EXISTS producto;
CREATE SCHEMA IF NOT EXISTS inventario;

-- Grant permissions
GRANT ALL PRIVILEGES ON SCHEMA producto TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA inventario TO postgres;

