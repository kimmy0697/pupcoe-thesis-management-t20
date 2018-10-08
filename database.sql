CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "fname" VARCHAR(80),
  "lname" VARCHAR(80),
  "email" VARCHAR(80),
  "password" VARCHAR(80),
  "user_type" VARCHAR(80),
  "is_admin" BOOLEAN,
  "phone" INT,
  "employee_id" INT,
  "student_number" INT
);

CREATE TABLE "classes" (
  "id" SERIAL PRIMARY KEY,
  "batch" INT,
  "year_level" VARCHAR(20),
  "adviser_id" INT REFERENCES users(id),
  "section" VARCHAR(20)
);

CREATE TABLE "class_students" (
  "id" SERIAL PRIMARY KEY,
  "class_id" INT REFERENCES classes(id),
  "student_id" INT REFERENCES users(id)
);