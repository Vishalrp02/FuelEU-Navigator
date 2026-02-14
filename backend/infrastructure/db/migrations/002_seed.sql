-- Seed five routes and set baseline
INSERT INTO routes (route_id, year, vessel_type, fuel_type, ghg_intensity, fuel_consumption_t, distance_km, total_emissions_t, is_baseline)
VALUES
('R001', 2024, 'Container', 'HFO', 91.0, 5000, 12000, 4500, TRUE),
('R002', 2024, 'BulkCarrier', 'LNG', 88.0, 4800, 11500, 4200, FALSE),
('R003', 2024, 'Tanker', 'MGO', 93.5, 5100, 12500, 4700, FALSE),
('R004', 2025, 'RoRo', 'HFO', 89.2, 4900, 11800, 4300, FALSE),
('R005', 2025, 'Container', 'LNG', 90.5, 4950, 11900, 4400, FALSE)
ON CONFLICT (route_id) DO NOTHING;
