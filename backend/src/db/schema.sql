-- Schema for Cal.com-style scheduling app

-- users (default admin, single row for this assignment)
CREATE TABLE IF NOT EXISTS users (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(120) NOT NULL,
  username   VARCHAR(60)  NOT NULL UNIQUE,
  email      VARCHAR(255) NOT NULL UNIQUE,
  timezone   VARCHAR(60)  NOT NULL DEFAULT 'Asia/Kolkata',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- event_types
CREATE TABLE IF NOT EXISTS event_types (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  user_id     INT NOT NULL,
  title       VARCHAR(120) NOT NULL,
  description TEXT,
  slug        VARCHAR(80)  NOT NULL UNIQUE,
  duration    INT NOT NULL DEFAULT 30,   -- minutes
  color       VARCHAR(7)   DEFAULT '#006FEE',
  is_active   BOOLEAN      DEFAULT TRUE,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
 
-- availability_schedules (named schedules, e.g. 'Working Hours')
CREATE TABLE IF NOT EXISTS availability_schedules (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  user_id    INT NOT NULL,
  name       VARCHAR(80) NOT NULL DEFAULT 'Working Hours',
  timezone   VARCHAR(60) NOT NULL DEFAULT 'Asia/Kolkata',
  is_default BOOLEAN     DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
 
-- availability_rules (day-of-week time ranges per schedule)
CREATE TABLE IF NOT EXISTS availability_rules (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  schedule_id INT NOT NULL,
  day_of_week TINYINT NOT NULL,  -- 0=Sun … 6=Sat
  start_time  TIME    NOT NULL,  -- e.g. 09:00:00
  end_time    TIME    NOT NULL,  -- e.g. 17:00:00
  is_enabled  BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (schedule_id) REFERENCES availability_schedules(id) ON DELETE CASCADE
);
 
-- date_overrides (block a day or set custom hours)
CREATE TABLE IF NOT EXISTS date_overrides (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  schedule_id INT  NOT NULL,
  date        DATE NOT NULL,
  start_time  TIME,         -- NULL = blocked all day
  end_time    TIME,
  is_blocked  BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (schedule_id) REFERENCES availability_schedules(id) ON DELETE CASCADE
);
 
-- bookings
CREATE TABLE IF NOT EXISTS bookings (
  id             INT PRIMARY KEY AUTO_INCREMENT,
  event_type_id  INT NOT NULL,
  booker_name    VARCHAR(120) NOT NULL,
  booker_email   VARCHAR(255) NOT NULL,
  start_time     DATETIME NOT NULL,
  end_time       DATETIME NOT NULL,
  status         ENUM('confirmed','cancelled','rescheduled') DEFAULT 'confirmed',
  uid            VARCHAR(36) NOT NULL UNIQUE,  -- UUID for public link
  notes          TEXT,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_type_id) REFERENCES event_types(id) ON DELETE CASCADE,
  CONSTRAINT uq_booking_unique_slot UNIQUE (event_type_id, start_time)
);

