CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_name varchar NOT NULL UNIQUE,
  description varchar,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email varchar NOT NULL UNIQUE,
  password varchar NOT NULL,
  name varchar NOT NULL,
  phone varchar,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users_roles (
  users_id uuid NOT NULL,
  roles_id uuid NOT NULL,
  PRIMARY KEY (users_id, roles_id),
  CONSTRAINT fk_users_roles_users
    FOREIGN KEY (users_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_users_roles_roles
    FOREIGN KEY (roles_id)
    REFERENCES roles(id)
    ON DELETE CASCADE
);