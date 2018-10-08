CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "fname" VARCHAR(100),
  "lname" VARCHAR(100),
  "email" VARCHAR(100),
  "password" VARCHAR(100),
  "user_type" VARCHAR(20),
  "is_admin" BOOLEAN,
  "phone" VARCHAR(100),
  "employee_id" VARCHAR(100),
  "student_number" VARCHAR(100)
);

CREATE TABLE "batches" (
  "id" SERIAL PRIMARY KEY,
  "batches" INT
);

CREATE TABLE "year_levels" (
  "id" SERIAL PRIMARY KEY,
  "year_levels" VARCHAR(20)
);

CREATE TABLE "sections" (
  "id" SERIAL PRIMARY KEY,
  "sections" INT
);

CREATE TABLE "classes" (
  "id" SERIAL PRIMARY KEY,
  "batch_id" INT REFERENCES batches(id),
  "year_level_id" INT REFERENCES year_levels(id),
  "adviser_id" INT REFERENCES users(id),
  "section_id" INT REFERENCES sections(id)
);

CREATE TABLE "class_students" (
  "id" SERIAL PRIMARY KEY,
  "class_id" INT REFERENCES classes(id),
  "student_id" INT REFERENCES users(id)
);

