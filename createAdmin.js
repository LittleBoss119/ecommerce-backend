import bcrypt from "bcryptjs";
import prisma from "../src/db.js"; // sesuaikan path

async function main() {
  const hashed = bcrypt.hashSync("password123", 10);

  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      password: hashed,
      role: "ADMIN"
    }
  });

  console.log("Admin created");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
