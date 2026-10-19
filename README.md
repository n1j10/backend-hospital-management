# Hospital Management API (Express)

REST API ported from the Next.js server actions in
[`utils/actions`](https://github.com/n1j10/hospital-mangmeant-system/tree/main/utils/actions).
The Prisma schema and the Zod schemas come from the same repo.

## Layers

```
routes  ->  middlewares (auth / validate)  ->  controllers  ->  services  ->  models  ->  Prisma
```

- **routes** – URLs, roles and validation only.
- **controllers** – read `req`, call a service, send the response. No business logic.
- **services** – the logic ported from the actions (plus checks: the doctor belongs to the department, a patient can't be admitted twice, ...).
- **models** – every Prisma query lives here, so no controller touches the database directly.
- **validations** – the Zod schemas from `utils/schema.ts`.

## Setup

```bash
npm install
cp .env.example .env     # then set DATABASE_URL and JWT_SECRET
npx prisma migrate dev --name init
npm run seed             # optional: demo data, every password is "password123"
npm run dev
```

Seeded accounts: `admin@hospital.com` (ADMIN), `reception@hospital.com` (RECEPTIONIST),
`ali@hospital.com` / `sara@hospital.com` / ... (DOCTOR).

## Auth

The Next.js app saved a JWT in the `auth-token` cookie. Here `login` returns the token and
every protected request sends it as a header:

```
Authorization: Bearer <token>
```

Logout is done on the client by deleting the token. Passwords are hashed with bcrypt
(the Next.js app used sha256). Public `register` cannot create `ADMIN` accounts.

## Endpoints

`user` = any logged-in role (ADMIN, RECEPTIONIST, DOCTOR).

| Method | Path | Auth | Ported from |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | – | `registerAction` |
| POST | `/api/auth/login` | – | `loginAction` |
| GET | `/api/auth/me` | user | `getCurrentUser` |
| GET | `/api/users` | admin | `fetchUsers` |
| DELETE | `/api/users/:id` | admin | `deleteUserAction` |
| GET | `/api/dashboard/stats` | user | `fetchDashboardStats` |
| GET | `/api/dashboard/notifications` | user | `fetchNavbarNotifications` |
| GET | `/api/dashboard/recent-appointments` | user | `fetchRecentAppointments` |
| GET | `/api/departments` | user | `fetchDepartments` (`?search=`) |
| GET | `/api/departments/select` | user | `fetchAllDepartmentsForSelect` |
| GET | `/api/departments/:id` | user | `fetchSingleDepartment` |
| POST | `/api/departments` | admin | `createDepartmentAction` |
| PATCH | `/api/departments/:id` | admin | `updateDepartmentAction` |
| DELETE | `/api/departments/:id` | admin | `deleteDepartmentAction` |
| GET | `/api/doctors` | user | `fetchDoctors` (`?search=`) |
| GET | `/api/doctors/select` | user | `fetchAllDoctorsForSelect` |
| GET | `/api/doctors/:id` | user | `fetchSingleDoctor` |
| POST | `/api/doctors` | admin | `createDoctorAction` |
| DELETE | `/api/doctors/:id` | admin | `deleteDoctorAction` |
| GET | `/api/patients` | user | `fetchPatients` (`?search=`) |
| GET | `/api/patients/select` | user | `fetchAllPatientsForSelect` |
| GET | `/api/patients/:id` | user | `fetchSinglePatient` |
| POST | `/api/patients` | user | `createPatientAction` |
| PATCH | `/api/patients/:id` | user | `updatePatientAction` |
| DELETE | `/api/patients/:id` | admin | `deletePatientAction` |
| GET | `/api/appointments` | user | `fetchAppointments` (`?search=&status=`) |
| GET | `/api/appointments/without-consultation` | user | `fetchCompletedAppointmentsWithoutConsultation` |
| GET | `/api/appointments/:id` | user | `fetchSingleAppointment` |
| POST | `/api/appointments` | user | `createAppointmentAction` |
| PATCH | `/api/appointments/:id/status` | user | `updateAppointmentStatusAction` |
| DELETE | `/api/appointments/:id` | admin | `deleteAppointmentAction` |
| GET | `/api/consultations` | user | `fetchConsultations` (`?search=`) |
| GET | `/api/consultations/:id` | user | `fetchSingleConsultation` |
| POST | `/api/consultations` | user | `createConsultationAction` |
| GET | `/api/admissions` | user | `fetchAdmissions` (`?search=&status=`) |
| GET | `/api/admissions/:id` | user | `fetchSingleAdmission` |
| POST | `/api/admissions` | user | `createAdmissionAction` |
| PATCH | `/api/admissions/:id/discharge` | user | `dischargePatientAction` |
| GET | `/api/categories` | user | `fetchCategories` |
| POST | `/api/categories` | admin | `createCategoryAction` |
| DELETE | `/api/categories/:id` | admin | `deleteCategoryAction` |
| GET | `/api/medicines` | user | `fetchMedicines` (`?search=&categoryId=`) |
| GET | `/api/medicines/low-stock` | user | `fetchLowStockMedicines` |
| GET | `/api/medicines/expiring` | user | `fetchExpiringMedicines` |
| GET | `/api/medicines/:id` | user | `fetchSingleMedicine` |
| POST | `/api/medicines` | user | `createMedicineAction` |
| PATCH | `/api/medicines/:id` | user | `updateMedicineAction` |
| DELETE | `/api/medicines/:id` | admin | `deleteMedicineAction` |
| POST | `/api/prescriptions` | user | `addPrescriptionItemAction` |
| DELETE | `/api/prescriptions/:id` | user | `removePrescriptionItemAction` |

Every response has the same shape:

```json
{ "success": true, "message": "Success", "data": {} }
{ "success": false, "message": "Patient not found" }
```

Where an action used `redirect()` for a missing record, the API returns `404`.
