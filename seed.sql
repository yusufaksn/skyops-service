-- Mevcut verileri temizle
TRUNCATE drones, missions, maintenance_logs CASCADE;

-- 1. DRONES SEED (20 Adet)
INSERT INTO drones (id, serial_number, model, status, total_flight_hours, last_maintenance_date, next_maintenance_due, created_at)
VALUES 
  ('6619d9bd-ffa3-479e-96a6-e5ce08e1db97', 'DRN-2026-X01', 'DJI Matrice 300 RTK', 'AVAILABLE', 142.50, '2026-06-15 10:00:00', '2026-08-15 10:00:00', NOW()),
  ('3b92c4e1-22a8-48f1-9d33-9118d0b2e811', 'DRN-2026-X02', 'DJI Mavic 3 Enterprise', 'IN_MISSION', 88.10, '2026-05-20 14:30:00', '2026-07-30 14:30:00', NOW()),
  ('a1b2c3d4-e5f6-4a7b-8c9d-0123456789ab', 'DRN-2026-X03', 'Autel Robotics EVO II Dual', 'AVAILABLE', 210.00, '2026-04-10 09:00:00', '2026-08-10 09:00:00', NOW()),
  ('b2c3d4e5-f6a7-4b8c-9d0e-123456789abc', 'DRN-2026-X04', 'WingtraOne GEN II', 'MAINTENANCE', 315.40, '2026-07-01 11:00:00', '2026-07-28 11:00:00', NOW()),
  ('c3d4e5f6-a7b8-4c9d-0e1f-23456789abcd', 'DRN-2026-X05', 'Parrot Anafi USA', 'AVAILABLE', 65.20, '2026-06-25 15:00:00', '2026-09-25 15:00:00', NOW()),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3456789abcde', 'DRN-2026-X06', 'DJI Inspire 3', 'IN_MISSION', 178.90, '2026-05-12 08:30:00', '2026-08-12 08:30:00', NOW()),
  ('e5f6a7b8-c9d0-4e1f-2a3b-456789abcdef', 'DRN-2026-X07', 'Skydio X2E', 'AVAILABLE', 92.00, '2026-06-02 10:00:00', '2026-09-02 10:00:00', NOW()),
  ('f6a7b8c9-d0e1-4f2a-3b4c-56789abcdef0', 'DRN-2026-X08', 'DJI Matrice 300 RTK', 'RETIRED', 540.10, '2025-12-01 10:00:00', '2026-03-01 10:00:00', NOW()),
  ('a7b8c9d0-e1f2-4a3b-4c5d-6789abcdef01', 'DRN-2026-X09', 'DJI Mavic 3 Enterprise', 'AVAILABLE', 45.60, '2026-07-10 13:00:00', '2026-10-10 13:00:00', NOW()),
  ('b8c9d0e1-f2a3-4b4c-5d6e-789abcdef012', 'DRN-2026-X10', 'Autel Robotics EVO II Dual', 'IN_MISSION', 123.80, '2026-06-18 16:00:00', '2026-08-18 16:00:00', NOW()),
  ('c9d0e1f2-a3b4-4c5d-6e7f-89abcdef0123', 'DRN-2026-X11', 'WingtraOne GEN II', 'AVAILABLE', 198.30, '2026-05-05 09:00:00', '2026-08-05 09:00:00', NOW()),
  ('d0e1f2a3-b4c5-4d6e-7f8a-9abcdef01234', 'DRN-2026-X12', 'Parrot Anafi USA', 'MAINTENANCE', 87.50, '2026-07-20 10:00:00', '2026-08-01 10:00:00', NOW()),
  ('e1f2a3b4-c5d6-4e7f-8a9b-abcdef012345', 'DRN-2026-X13', 'DJI Inspire 3', 'AVAILABLE', 230.10, '2026-06-10 11:30:00', '2026-09-10 11:30:00', NOW()),
  ('f2a3b4c5-d6e7-4f8a-9b0c-bcdef0123456', 'DRN-2026-X14', 'Skydio X2E', 'AVAILABLE', 112.40, '2026-06-30 14:00:00', '2026-09-30 14:00:00', NOW()),
  ('a3b4c5d6-e7f8-4a9b-0c1d-cdef01234567', 'DRN-2026-X15', 'DJI Matrice 300 RTK', 'IN_MISSION', 165.70, '2026-05-28 08:00:00', '2026-08-28 08:00:00', NOW()),
  ('b4c5d6e7-f8a9-4b0c-1d2e-def012345678', 'DRN-2026-X16', 'DJI Mavic 3 Enterprise', 'AVAILABLE', 76.90, '2026-07-05 09:30:00', '2026-10-05 09:30:00', NOW()),
  ('c5d6e7f8-a9b0-4c1d-2e3f-ef0123456789', 'DRN-2026-X17', 'Autel Robotics EVO II Dual', 'AVAILABLE', 144.20, '2026-06-12 10:15:00', '2026-09-12 10:15:00', NOW()),
  ('d6e7f8a9-b0c1-4d2e-3f4a-f01234567890', 'DRN-2026-X18', 'WingtraOne GEN II', 'RETIRED', 620.00, '2025-10-15 12:00:00', '2026-01-15 12:00:00', NOW()),
  ('e7f8a9b0-c1d2-4e3f-4a5b-012345678901', 'DRN-2026-X19', 'Parrot Anafi USA', 'AVAILABLE', 53.10, '2026-07-15 15:45:00', '2026-10-15 15:45:00', NOW()),
  ('f8a9b0c1-d2e3-4f4a-5b6c-123456789012', 'DRN-2026-X20', 'DJI Inspire 3', 'IN_MISSION', 290.80, '2026-05-18 11:00:00', '2026-08-18 11:00:00', NOW());


-- 2. MISSIONS SEED (55 Adet - Dronelar ile ilişkili)
INSERT INTO missions (id, drone_id, name, pilot_name, site_location, mission_type, status, planned_start, planned_end, actual_start, actual_end, flight_hours_logged, abort_reason, pre_flight_checked, created_at)
VALUES 
  (gen_random_uuid(), '6619d9bd-ffa3-479e-96a6-e5ce08e1db97', 'Güneş Santrali Isıl Haritalama', 'Ahmet Yılmaz', 'Ankara - Polatlı GES', 'INSPECTION', 'COMPLETED', '2026-07-10 08:00:00', '2026-07-10 12:00:00', '2026-07-10 08:15:00', '2026-07-10 11:45:00', 3.50, NULL, true, NOW()),
  (gen_random_uuid(), '6619d9bd-ffa3-479e-96a6-e5ce08e1db97', 'Şantiye İlerleme Taraması', 'Mehmet Demir', 'İstanbul - Finans Merkezi', 'MAPPING', 'IN_PROGRESS', '2026-07-25 09:00:00', '2026-07-25 18:00:00', '2026-07-25 09:30:00', NULL, 0.00, NULL, true, NOW()),
  (gen_random_uuid(), '6619d9bd-ffa3-479e-96a6-e5ce08e1db97', 'Rüzgar Tribünü Kanat Kontrolü', 'Ayşe Kaya', 'Izmir - Alaçatı RES', 'INSPECTION', 'COMPLETED', '2026-06-01 10:00:00', '2026-06-01 14:00:00', '2026-06-01 10:05:00', '2026-06-01 13:50:00', 3.75, NULL, true, NOW()),
  (gen_random_uuid(), '3b92c4e1-22a8-48f1-9d33-9118d0b2e811', 'Sınır Güvenlik Devriyesi', 'Ayşe Kaya', 'Edirne - Sınır Hattı', 'SURVEILLANCE', 'COMPLETED', '2026-07-01 22:00:00', '2026-07-02 04:00:00', '2026-07-01 22:05:00', '2026-07-02 03:50:00', 5.75, NULL, true, NOW()),
  (gen_random_uuid(), '3b92c4e1-22a8-48f1-9d33-9118d0b2e811', 'Liman Lojistik Devriyesi', 'Caner Tekin', 'Izmir - Port Logistics', 'SURVEILLANCE', 'IN_PROGRESS', '2026-07-25 12:00:00', '2026-07-25 18:00:00', '2026-07-25 12:10:00', NULL, 0.00, NULL, true, NOW()),
  (gen_random_uuid(), 'a1b2c3d4-e5f6-4a7b-8c9d-0123456789ab', 'Orman Yangın Risk Analizi', 'Elif Şahin', 'Antalya - Kemer Forest', 'SURVEILLANCE', 'COMPLETED', '2026-07-05 06:00:00', '2026-07-05 12:00:00', '2026-07-05 06:00:00', '2026-07-05 11:30:00', 5.50, NULL, true, NOW()),
  (gen_random_uuid(), 'a1b2c3d4-e5f6-4a7b-8c9d-0123456789ab', 'Otoyol Hız ve Trafik Taraması', 'Burak Çelik', 'Bursa - Otoyol Şantiyesi', 'SURVEILLANCE', 'ABORTED', '2026-07-12 14:00:00', '2026-07-12 18:00:00', '2026-07-12 14:10:00', '2026-07-12 14:40:00', 0.50, 'Aşırı Rüzgar (Fırtına Uyarısı)', true, NOW()),
  (gen_random_uuid(), 'b2c3d4e5-f6a7-4b8c-9d0e-123456789abc', 'Maden Sahası 3D Hacim Ölçümü', 'Zeynep Arslan', 'Kocaeli - Dilovası OSB', 'MAPPING', 'COMPLETED', '2026-06-20 09:00:00', '2026-06-20 17:00:00', '2026-06-20 09:15:00', '2026-06-20 16:45:00', 7.50, NULL, true, NOW()),
  (gen_random_uuid(), 'c3d4e5f6-a7b8-4c9d-0e1f-23456789abcd', 'Acil Tıbbi Malzeme Taşıma', 'Deniz Öztürk', 'Muğla - Bodrum Adalar', 'DELIVERY', 'COMPLETED', '2026-07-18 10:00:00', '2026-07-18 11:00:00', '2026-07-18 10:02:00', '2026-07-18 10:48:00', 0.75, NULL, true, NOW()),
  (gen_random_uuid(), 'd4e5f6a7-b8c9-4d0e-1f2a-3456789abcde', 'Film Seti Hava Çekimleri', 'Ahmet Yılmaz', 'İstanbul - Balat', 'MAPPING', 'IN_PROGRESS', '2026-07-25 15:00:00', '2026-07-25 21:00:00', '2026-07-25 15:15:00', NULL, 0.00, NULL, true, NOW()),
  (gen_random_uuid(), 'e5f6a7b8-c9d0-4e1f-2a3b-456789abcdef', 'Arama Kurtarma Tatbikatı', 'Mehmet Demir', 'Rize - Kaçkar Dağları', 'SEARCH_AND_RESCUE', 'COMPLETED', '2026-06-10 07:00:00', '2026-06-10 15:00:00', '2026-06-10 07:10:00', '2026-06-10 14:30:00', 7.33, NULL, true, NOW()),
  (gen_random_uuid(), 'f6a7b8c9-d0e1-4f2a-3b4c-56789abcdef0', 'Eski Baraj Sürveyansı', 'Ayşe Kaya', 'Artvin - Deriner Barajı', 'INSPECTION', 'COMPLETED', '2025-11-15 09:00:00', '2025-11-15 13:00:00', '2025-11-15 09:00:00', '2025-11-15 12:40:00', 3.66, NULL, true, NOW()),
  (gen_random_uuid(), 'a7b8c9d0-e1f2-4a3b-4c5d-6789abcdef01', 'Tarımsal Rekolte Tespiti', 'Caner Tekin', 'Adana - Çukurova', 'MAPPING', 'COMPLETED', '2026-07-11 06:00:00', '2026-07-11 13:00:00', '2026-07-11 06:10:00', '2026-07-11 12:50:00', 6.66, NULL, true, NOW()),
  (gen_random_uuid(), 'b8c9d0e1-f2a3-4b4c-5d6e-789abcdef012', 'Boru Hattı Kaçak Kontrolü', 'Elif Şahin', 'Eskişehir - BOTAŞ Hattı', 'INSPECTION', 'IN_PROGRESS', '2026-07-25 08:00:00', '2026-07-25 16:00:00', '2026-07-25 08:05:00', NULL, 0.00, NULL, true, NOW()),
  (gen_random_uuid(), 'c9d0e1f2-a3b4-4c5d-6e7f-89abcdef0123', 'Köprü Statik Fotogrametrisi', 'Burak Çelik', 'Çanakkale - 1915 Köprüsü', 'MAPPING', 'COMPLETED', '2026-05-20 09:00:00', '2026-05-20 15:00:00', '2026-05-20 09:10:00', '2026-05-20 14:40:00', 5.50, NULL, true, NOW()),
  (gen_random_uuid(), 'd0e1f2a3-b4c5-4d6e-7f8a-9abcdef01234', 'Şehir Parkı Ağaç Sayımı', 'Zeynep Arslan', 'Ankara - Gençlik Parkı', 'MAPPING', 'SCHEDULED', '2026-07-30 09:00:00', '2026-07-30 13:00:00', NULL, NULL, 0.00, NULL, false, NOW()),
  (gen_random_uuid(), 'e1f2a3b4-c5d6-4e7f-8a9b-abcdef012345', 'Stadyum Etkinlik Güvenliği', 'Deniz Öztürk', 'İstanbul - Nef Stadyumu', 'SURVEILLANCE', 'COMPLETED', '2026-06-18 18:00:00', '2026-06-18 23:00:00', '2026-06-18 18:10:00', '2026-06-18 22:50:00', 4.66, NULL, true, NOW()),
  (gen_random_uuid(), 'f2a3b4c5-d6e7-4f8a-9b0c-bcdef0123456', 'Kıyı Erozyonu Tespiti', 'Ahmet Yılmaz', 'Samsun - Çarşamba Sahili', 'MAPPING', 'COMPLETED', '2026-07-02 08:00:00', '2026-07-02 12:00:00', '2026-07-02 08:00:00', '2026-07-02 11:30:00', 3.50, NULL, true, NOW()),
  (gen_random_uuid(), 'a3b4c5d6-e7f8-4a9b-0c1d-cdef01234567', 'Çatı Güneş Paneli Yıkama Kontrolü', 'Mehmet Demir', 'Gaziantep - OSB', 'INSPECTION', 'IN_PROGRESS', '2026-07-25 10:00:00', '2026-07-25 17:00:00', '2026-07-25 10:20:00', NULL, 0.00, NULL, true, NOW()),
  (gen_random_uuid(), 'b4c5d6e7-f8a9-4b0c-1d2e-def012345678', 'Tarihi Eser 3D Modelleme', 'Ayşe Kaya', 'Nevşehir - Kapadokya', 'MAPPING', 'COMPLETED', '2026-07-14 05:30:00', '2026-07-14 10:30:00', '2026-07-14 05:30:00', '2026-07-14 10:00:00', 4.50, NULL, true, NOW()),
  (gen_random_uuid(), 'c5d6e7f8-a9b0-4c1d-2e3f-ef0123456789', 'Enerji Nakil Hattı Taraması', 'Caner Tekin', 'Kayseri - Erciyes Hattı', 'INSPECTION', 'COMPLETED', '2026-06-14 09:00:00', '2026-06-14 16:00:00', '2026-06-14 09:15:00', '2026-06-14 15:45:00', 6.50, NULL, true, NOW()),
  (gen_random_uuid(), 'd6e7f8a9-b0c1-4d2e-3f4a-f01234567890', 'Eski Fabrika Yıkım Sürveyansı', 'Elif Şahin', 'Kocaeli - Izmit', 'INSPECTION', 'COMPLETED', '2025-09-10 10:00:00', '2025-09-10 14:00:00', '2025-09-10 10:00:00', '2025-09-10 13:30:00', 3.50, NULL, true, NOW()),
  (gen_random_uuid(), 'e7f8a9b0-c1d2-4e3f-4a5b-012345678901', 'Kentsel Dönüşüm Bölge Tespiti', 'Burak Çelik', 'İzmir - Karabağlar', 'MAPPING', 'COMPLETED', '2026-07-16 09:00:00', '2026-07-16 14:00:00', '2026-07-16 09:00:00', '2026-07-16 13:30:00', 4.50, NULL, true, NOW()),
  (gen_random_uuid(), 'f8a9b0c1-d2e3-4f4a-5b6c-123456789012', 'Afet Bölgesi Hasar Tespiti', 'Zeynep Arslan', 'Hatay - Antakya', 'SEARCH_AND_RESCUE', 'IN_PROGRESS', '2026-07-25 07:00:00', '2026-07-25 19:00:00', '2026-07-25 07:10:00', NULL, 0.00, NULL, true, NOW());

-- Kalan 31 Adet Görevi Hızlıca Rastgele Oluştur
INSERT INTO missions (id, drone_id, name, pilot_name, site_location, mission_type, status, planned_start, planned_end, actual_start, actual_end, flight_hours_logged, abort_reason, pre_flight_checked, created_at)
SELECT 
  gen_random_uuid(),
  d.id,
  'Saha Rutin Devriye Görevi #' || gs,
  (ARRAY['Ahmet Yılmaz', 'Mehmet Demir', 'Ayşe Kaya', 'Caner Tekin', 'Elif Şahin'])[floor(random() * 5 + 1)],
  (ARRAY['Ankara GES', 'İstanbul Şantiye', 'Izmir Liman', 'Bursa Otoyol', 'Antalya Orman'])[floor(random() * 5 + 1)],
  (ARRAY['INSPECTION', 'MAPPING', 'SURVEILLANCE'])[floor(random() * 3 + 1)],
  'COMPLETED',
  NOW() - (gs || ' days')::INTERVAL,
  NOW() - (gs || ' days')::INTERVAL + '4 hours'::INTERVAL,
  NOW() - (gs || ' days')::INTERVAL + '10 minutes'::INTERVAL,
  NOW() - (gs || ' days')::INTERVAL + '3 hours 50 minutes'::INTERVAL,
  3.66,
  NULL,
  true,
  NOW()
FROM generate_series(25, 55) gs
CROSS JOIN LATERAL (SELECT id FROM drones ORDER BY random() LIMIT 1) d;


-- 3. MAINTENANCE LOGS SEED (35 Adet - Dronelar ile ilişkili)
INSERT INTO maintenance_logs (id, drone_id, type, technician_name, notes, date_performed, flight_hours_at_maintenance, created_at, updated_at)
VALUES 
  (gen_random_uuid(), '6619d9bd-ffa3-479e-96a6-e5ce08e1db97', 'ROUTINE', 'Ali Rıza Koç', 'Pervane seti yenilendi, motor kalibrasyonu yapıldı.', '2026-06-15 10:00:00', 120.00, NOW(), NOW()),
  (gen_random_uuid(), '6619d9bd-ffa3-479e-96a6-e5ce08e1db97', 'REPAIR', 'Selin Öztürk', 'Gimbal esnek kablosu lehimlendi ve test edildi.', '2026-04-10 14:00:00', 85.50, NOW(), NOW()),
  (gen_random_uuid(), '6619d9bd-ffa3-479e-96a6-e5ce08e1db97', 'FIRMWARE_UPDATE', 'Ali Rıza Koç', 'v02.04.0100 yazılım güncellemesi yüklendi.', '2026-02-01 09:30:00', 40.00, NOW(), NOW()),
  (gen_random_uuid(), '3b92c4e1-22a8-48f1-9d33-9118d0b2e811', 'ROUTINE', 'Hasan Hüseyin Akyol', 'Batarya döngü seviyeleri ölçüldü, sensör temizliği yapıldı.', '2026-05-20 14:30:00', 60.00, NOW(), NOW()),
  (gen_random_uuid(), 'a1b2c3d4-e5f6-4a7b-8c9d-0123456789ab', 'ROUTINE', 'Murat Yıldırım', 'Periyodik 200 saat bakımı tamamlandı.', '2026-04-10 09:00:00', 200.00, NOW(), NOW()),
  (gen_random_uuid(), 'b2c3d4e5-f6a7-4b8c-9d0e-123456789abc', 'EMERGENCY', 'Ali Rıza Koç', 'Sert iniş sonrası sağ arka kol ve motor değiştirildi.', '2026-07-01 11:00:00', 310.00, NOW(), NOW()),
  (gen_random_uuid(), 'c3d4e5f6-a7b8-4c9d-0e1f-23456789abcd', 'ROUTINE', 'Selin Öztürk', 'Periyodik kontrol.', '2026-06-25 15:00:00', 50.00, NOW(), NOW()),
  (gen_random_uuid(), 'd4e5f6a7-b8c9-4d0e-1f2a-3456789abcde', 'FIRMWARE_UPDATE', 'Hasan Hüseyin Akyol', 'GPS modülü yazılım yaması uygulandı.', '2026-05-12 08:30:00', 150.00, NOW(), NOW()),
  (gen_random_uuid(), 'e5f6a7b8-c9d0-4e1f-2a3b-456789abcdef', 'ROUTINE', 'Murat Yıldırım', 'Genel yağlama ve toz temizliği.', '2026-06-02 10:00:00', 80.00, NOW(), NOW()),
  (gen_random_uuid(), 'f6a7b8c9-d0e1-4f2a-3b4c-56789abcdef0', 'REPAIR', 'Ali Rıza Koç', 'Eskiyen batarya konnektörleri yenilendi.', '2025-12-01 10:00:00', 500.00, NOW(), NOW());

-- Kalan 25 Adet Bakım Kaydını Hızlıca Rastgele Oluştur
INSERT INTO maintenance_logs (id, drone_id, type, technician_name, notes, date_performed, flight_hours_at_maintenance, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  d.id,
  (ARRAY['ROUTINE', 'REPAIR', 'FIRMWARE_UPDATE', 'EMERGENCY'])[floor(random() * 4 + 1)],
  (ARRAY['Ali Rıza Koç', 'Selin Öztürk', 'Hasan Hüseyin Akyol', 'Murat Yıldırım'])[floor(random() * 4 + 1)],
  'Genel periyodik kontrol ve sistem taramaları başarıyla gerçekleştirildi.',
  NOW() - (gs * 3 || ' days')::INTERVAL,
  floor(random() * 100 + 20)::numeric(10,2),
  NOW(),
  NOW()
FROM generate_series(11, 35) gs
CROSS JOIN LATERAL (SELECT id FROM drones ORDER BY random() LIMIT 1) d;