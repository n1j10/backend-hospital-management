require("dotenv").config();
const bcrypt = require("bcryptjs");
const { prisma } = require("../src/config/db");

const daysFromNow = (days, hour = 10) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date;
};

const departments = [
  { name: "Cardiology", description: "Heart and blood vessel care." },
  { name: "Pediatrics", description: "Medical care for infants and children." },
  { name: "Orthopedics", description: "Bones, joints and muscles." },
  { name: "Emergency", description: "Urgent and critical care, open 24/7." },
];

const doctors = [
  { name: "Dr. Ali Hassan", email: "ali@hospital.com", specialization: "Cardiologist", department: "Cardiology" },
  { name: "Dr. Sara Kareem", email: "sara@hospital.com", specialization: "Pediatrician", department: "Pediatrics" },
  { name: "Dr. Omar Saleh", email: "omar@hospital.com", specialization: "Orthopedic Surgeon", department: "Orthopedics" },
  { name: "Dr. Noor Ahmed", email: "noor@hospital.com", specialization: "Emergency Physician", department: "Emergency" },
];

const patients = [
  { fullName: "Hussein Ali", gender: "MALE", dateOfBirth: new Date("1985-03-12"), phone: "07701234567", address: "Baghdad", bloodType: "A+" },
  { fullName: "Zainab Mohammed", gender: "FEMALE", dateOfBirth: new Date("1992-07-25"), phone: "07801234567", address: "Basra", bloodType: "O+" },
  { fullName: "Yusuf Kadhim", gender: "MALE", dateOfBirth: new Date("2016-01-09"), phone: "07501234567", address: "Najaf", bloodType: "B+" },
  { fullName: "Maryam Jasim", gender: "FEMALE", dateOfBirth: new Date("1970-11-30"), phone: "07901234567", address: "Erbil", bloodType: "AB-" },
];

const categories = ["Antibiotics", "Painkillers", "Cardiac", "Vitamins"];

const medicines = [
  { name: "Amoxicillin 500mg", category: "Antibiotics", quantity: 120, unit: "box", price: 4.5, expiryDays: 365 },
  { name: "Azithromycin 250mg", category: "Antibiotics", quantity: 6, unit: "box", price: 7.25, expiryDays: 200 },
  { name: "Paracetamol 500mg", category: "Painkillers", quantity: 300, unit: "strip", price: 1.0, expiryDays: 20 },
  { name: "Ibuprofen 400mg", category: "Painkillers", quantity: 8, unit: "strip", price: 1.75, expiryDays: 400 },
  { name: "Aspirin 81mg", category: "Cardiac", quantity: 90, unit: "box", price: 2.5, expiryDays: 500 },
  { name: "Vitamin D3 1000IU", category: "Vitamins", quantity: 40, unit: "bottle", price: 6.0, expiryDays: 15 },
];

async function main() {
  console.log("Clearing existing data...");
  await prisma.$transaction([
    prisma.prescriptionItem.deleteMany(),
    prisma.consultation.deleteMany(),
    prisma.admission.deleteMany(),
    prisma.appointment.deleteMany(),
    prisma.medicine.deleteMany(),
    prisma.medicineCategory.deleteMany(),
    prisma.patient.deleteMany(),
    prisma.doctor.deleteMany(),
    prisma.department.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const password = await bcrypt.hash("password123", 10);

  console.log("Creating users...");
  await prisma.user.create({
    data: { name: "Admin", email: "admin@hospital.com", password, role: "ADMIN" },
  });
  await prisma.user.create({
    data: { name: "Reception", email: "reception@hospital.com", password, role: "RECEPTIONIST" },
  });

  console.log("Creating departments and doctors...");
  const departmentByName = {};
  for (const department of departments) {
    departmentByName[department.name] = await prisma.department.create({ data: department });
  }

  const createdDoctors = [];
  for (const doctor of doctors) {
    const department = departmentByName[doctor.department];
    const user = await prisma.user.create({
      data: {
        name: doctor.name,
        email: doctor.email,
        password,
        role: "DOCTOR",
        doctor: {
          create: { specialization: doctor.specialization, departmentId: department.id },
        },
      },
      include: { doctor: true },
    });
    createdDoctors.push(user.doctor);
  }

  console.log("Creating patients...");
  const createdPatients = [];
  for (const patient of patients) {
    createdPatients.push(await prisma.patient.create({ data: patient }));
  }

  console.log("Creating pharmacy...");
  const categoryByName = {};
  for (const name of categories) {
    categoryByName[name] = await prisma.medicineCategory.create({ data: { name } });
  }

  const createdMedicines = [];
  for (const medicine of medicines) {
    createdMedicines.push(
      await prisma.medicine.create({
        data: {
          name: medicine.name,
          categoryId: categoryByName[medicine.category].id,
          quantity: medicine.quantity,
          unit: medicine.unit,
          price: medicine.price,
          expiryDate: daysFromNow(medicine.expiryDays),
        },
      }),
    );
  }

  console.log("Creating appointments, consultations and admissions...");
  const appointmentPlan = [
    { patient: 0, doctor: 0, days: -3, status: "COMPLETED", reason: "Chest pain follow-up" },
    { patient: 1, doctor: 1, days: 0, status: "CONFIRMED", reason: "Child vaccination" },
    { patient: 2, doctor: 1, days: 0, status: "PENDING", reason: "Fever and cough" },
    { patient: 3, doctor: 2, days: 2, status: "PENDING", reason: "Knee pain" },
    { patient: 0, doctor: 3, days: -1, status: "CANCELLED", reason: "Minor injury" },
  ];

  const createdAppointments = [];
  for (const plan of appointmentPlan) {
    const doctor = createdDoctors[plan.doctor];
    createdAppointments.push(
      await prisma.appointment.create({
        data: {
          patientId: createdPatients[plan.patient].id,
          doctorId: doctor.id,
          departmentId: doctor.departmentId,
          scheduledAt: daysFromNow(plan.days),
          status: plan.status,
          reason: plan.reason,
        },
      }),
    );
  }

  const completed = createdAppointments[0];
  await prisma.consultation.create({
    data: {
      appointmentId: completed.id,
      patientId: completed.patientId,
      doctorId: completed.doctorId,
      diagnosis: "Stable angina",
      notes: "Reduce salt intake, follow up in 2 weeks.",
      prescriptions: {
        create: [
          { medicineId: createdMedicines[4].id, quantity: 1, dosage: "1 tablet daily" },
          { medicineId: createdMedicines[2].id, quantity: 2, dosage: "1 tablet when needed" },
        ],
      },
    },
  });

  await prisma.admission.create({
    data: {
      patientId: createdPatients[3].id,
      doctorId: createdDoctors[2].id,
      departmentId: createdDoctors[2].departmentId,
      reason: "Knee surgery",
    },
  });

  console.log("Seed done. Every account uses the password: password123");
  console.log("  admin@hospital.com (ADMIN), reception@hospital.com (RECEPTIONIST)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
