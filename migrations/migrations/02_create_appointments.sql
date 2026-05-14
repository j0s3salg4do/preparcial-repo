CREATE TYPE appointment_status AS ENUM ('pending', 'done');

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL,
  datetime TIMESTAMP NOT NULL,
  reason VARCHAR NOT NULL,
  status appointment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT now(),

  CONSTRAINT fk_appointments_patient
    FOREIGN KEY (patient_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_appointments_doctor
    FOREIGN KEY (doctor_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);
