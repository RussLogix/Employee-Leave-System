import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    const employeePassword = await bcrypt.hash(
      "employee123",
      10,
    );

    const managerPassword = await bcrypt.hash(
      "manager123",
      10,
    );

    await User.deleteMany({
      email: {
        $in: [
          "employee@test.com",
          "manager@test.com",
        ],
      },
    });

    await User.create([
      {
        name: "Emily Employee",
        email: "employee@test.com",
        password: employeePassword,
        role: "Employee",
      },
      {
        name: "Mark Manager",
        email: "manager@test.com",
        password: managerPassword,
        role: "Manager",
      },
    ]);

    console.log("Demo users created.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();