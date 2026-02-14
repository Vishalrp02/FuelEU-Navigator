-- Routes table
CREATE TABLE IF NOT EXISTS routes (
  id SERIAL PRIMARY KEY,
  route_id VARCHAR(20) UNIQUE NOT NULL,
  year INTEGER NOT NULL,
  vessel_type VARCHAR(20) NOT NULL,
  fuel_type VARCHAR(20) NOT NULL,
  ghg_intensity NUMERIC NOT NULL,
  fuel_consumption_t NUMERIC NOT NULL,
  distance_km NUMERIC NOT NULL,
  total_emissions_t NUMERIC NOT NULL,
  is_baseline BOOLEAN NOT NULL DEFAULT FALSE
);

-- Ship compliance snapshots
CREATE TABLE IF NOT EXISTS ship_compliance (
  id SERIAL PRIMARY KEY,
  ship_id VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  cb_gco2eq NUMERIC NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Banking entries
CREATE TABLE IF NOT EXISTS bank_entries (
  id SERIAL PRIMARY KEY,
  ship_id VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  amount_gco2eq NUMERIC NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Pools registry
CREATE TABLE IF NOT EXISTS pools (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Pool members allocation
CREATE TABLE IF NOT EXISTS pool_members (
  id SERIAL PRIMARY KEY,
  pool_id INTEGER NOT NULL REFERENCES pools(id) ON DELETE CASCADE,
  ship_id VARCHAR(50) NOT NULL,
  cb_before NUMERIC NOT NULL,
  cb_after NUMERIC NOT NULL
);
