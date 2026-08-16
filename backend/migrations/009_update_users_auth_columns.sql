ALTER TABLE users
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
ADD COLUMN IF NOT EXISTS phone VARCHAR(32),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS role_id INTEGER DEFAULT 1;

UPDATE users
SET
  first_name = COALESCE(first_name, ''),
  last_name = COALESCE(last_name, ''),
  phone = COALESCE(phone, ''),
  role_id = COALESCE(role_id, 1)
WHERE first_name IS NULL
   OR last_name IS NULL
   OR phone IS NULL
   OR role_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone_column ON users (phone);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_column ON users (email);
