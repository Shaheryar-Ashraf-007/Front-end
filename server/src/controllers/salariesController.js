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

export const updateSalary = async (req, res) => {
  const { userId } = req.params;

  try {
    const {
      name,
      phoneNumber,
      salaryAmount,
      paidAmount,
      remainingAmount,
      startDate,
      endDate,
      petrolExpense,
      otherExpense
    } = req.body;

    const updated = await prisma.salaries.update({
      where: { userId },
      data: {
        name,
        phoneNumber,
        salaryAmount: salaryAmount !== undefined ? parseFloat(salaryAmount) : undefined,
        paidAmount: paidAmount !== undefined ? parseFloat(paidAmount) : undefined,
        remainingAmount: remainingAmount !== undefined ? parseFloat(remainingAmount) : undefined,
        startDate,
        endDate,
        petrolExpense: petrolExpense !== undefined ? parseInt(petrolExpense) : undefined,
        otherExpense,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};