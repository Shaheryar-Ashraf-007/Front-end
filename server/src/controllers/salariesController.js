import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// GET: Fetch all salaries with optional search
export const getSalaries = async (req, res) => {
  try {
    const search = req.query.search?.toString() || '';

    const salaries = await prisma.salaries.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    res.status(200).json(salaries);
  } catch (error) {
    console.error("Error retrieving salaries:", error);
    res.status(500).json({ message: "Error retrieving salaries", error: error.message });
  }
};

// POST: Create new salary entry
export const createSalaries = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      salaryAmount,
      paidAmount,
      remainingAmount,
      startDate,
      endDate,
      timeStamp,
      petrolExpense,
      otherExpense,
    } = req.body;

    if (!name || !salaryAmount) {
      return res.status(400).json({ message: "Name and salary amount are required" });
    }

    const newSalary = await prisma.salaries.create({
      data: {
        name,
        phoneNumber: phoneNumber || null,
        salaryAmount,
        paidAmount: paidAmount || 0,
        remainingAmount: remainingAmount || (salaryAmount - (paidAmount || 0)),
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        timestamp: timeStamp || new Date().toISOString(),
        petrolExpense: petrolExpense || 0,
        otherExpense: otherExpense || 0,
      },
    });

    res.status(201).json(newSalary);
  } catch (error) {
    console.error("Error creating salary:", error);
    res.status(500).json({ message: "Error creating salary", error: error.message });
  }
};

// DELETE: Remove a salary record by userId
export const deleteSalaries = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const existingSalary = await prisma.salaries.findUnique({
      where: { userId },
    });

    if (!existingSalary) {
      return res.status(404).json({ message: `Salary with ID ${userId} not found` });
    }

    const deletedSalary = await prisma.salaries.delete({
      where: { userId },
    });

    res.status(200).json({
      message: "Salary deleted successfully",
      data: deletedSalary,
    });
  } catch (error) {
    console.error("Error deleting salary:", error);

    if (error.code === 'P2025') {
      return res.status(404).json({
        message: "Record to delete does not exist",
        error: error.message,
      });
    }

    res.status(500).json({
      message: "Failed to delete salary",
      error: error.message,
    });
  }
};
