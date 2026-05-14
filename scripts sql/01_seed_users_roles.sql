INSERT INTO roles (role_name, description)
VALUES
  ('admin', 'Administrador del sistema'),
  ('user', 'Usuario normal'),
  ('doctor', 'Doctor del sistema')
ON CONFLICT (role_name) DO NOTHING;