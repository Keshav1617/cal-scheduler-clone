-- Seed data for Cal.com-style scheduling app

-- user
INSERT INTO users (name, username, email, timezone)
VALUES ('Default Admin', 'admin', 'admin@example.com', 'Asia/Kolkata');

-- availability schedule for user_id = 1
INSERT INTO availability_schedules (user_id, name, timezone, is_default)
VALUES (1, 'Working Hours', 'Asia/Kolkata', TRUE);

-- assume the inserted schedule has id = 1

-- availability rules: Mon–Fri 09:00–17:00, Sat/Sun disabled
INSERT INTO availability_rules (schedule_id, day_of_week, start_time, end_time, is_enabled) VALUES
  (1, 1, '09:00:00', '17:00:00', TRUE), -- Monday
  (1, 2, '09:00:00', '17:00:00', TRUE), -- Tuesday
  (1, 3, '09:00:00', '17:00:00', TRUE), -- Wednesday
  (1, 4, '09:00:00', '17:00:00', TRUE), -- Thursday
  (1, 5, '09:00:00', '17:00:00', TRUE), -- Friday
  (1, 0, '09:00:00', '17:00:00', FALSE), -- Sunday disabled
  (1, 6, '09:00:00', '17:00:00', FALSE); -- Saturday disabled

-- event types for user_id = 1
INSERT INTO event_types (user_id, title, description, slug, duration, color, is_active) VALUES
  (1, '15-min Quick Chat', 'A short intro or quick check-in.', 'quick-chat-15', 15, '#006FEE', TRUE),
  (1, '30-min Coffee Chat', 'Casual 1:1 conversation over coffee.', 'coffee-chat-30', 30, '#22C55E', TRUE),
  (1, '60-min Strategy Session', 'Deep dive strategy meeting.', 'strategy-session-60', 60, '#F97316', TRUE);

-- bookings: past and upcoming, confirmed and cancelled
-- Note: adjust dates if needed when seeding to keep some in the future.
INSERT INTO bookings (
  event_type_id,
  booker_name,
  booker_email,
  start_time,
  end_time,
  status,
  uid,
  notes
) VALUES
  -- Past confirmed
  (1, 'Alice Past', 'alice.past@example.com', '2025-12-01 09:00:00', '2025-12-01 09:15:00', 'confirmed', '11111111-1111-1111-1111-111111111111', 'Past quick chat'),
  -- Past cancelled
  (2, 'Bob Cancelled', 'bob.cancelled@example.com', '2025-12-02 10:00:00', '2025-12-02 10:30:00', 'cancelled', '22222222-2222-2222-2222-222222222222', 'Cancelled coffee chat'),
  -- Upcoming confirmed
  (3, 'Charlie Future', 'charlie.future@example.com', '2026-04-01 11:00:00', '2026-04-01 12:00:00', 'confirmed', '33333333-3333-3333-3333-333333333333', 'Strategy session'),
  -- Upcoming confirmed
  (1, 'Dana Future', 'dana.future@example.com', '2026-04-02 15:00:00', '2026-04-02 15:15:00', 'confirmed', '44444444-4444-4444-4444-444444444444', 'Quick intro'),
  -- Upcoming cancelled
  (2, 'Evan Future', 'evan.future@example.com', '2026-04-03 16:00:00', '2026-04-03 16:30:00', 'cancelled', '55555555-5555-5555-5555-555555555555', 'Cancelled upcoming coffee chat');

