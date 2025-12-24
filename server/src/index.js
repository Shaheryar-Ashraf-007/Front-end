import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createProduct, deleteProduct, getProducts } from './controllers/productController.js';
import { createSalaries, deleteSalaries, getSalaries } from './controllers/salariesController.js';
import { createUsers, deleteUsers, getUsers } from './controllers/userController.js';
import { createExpense, deleteExpense, getExpensesByCategory } from './controllers/expenseController.js';
import { getDashboardMetrics } from './controllers/dashboardController.js';
import bodyParser from 'body-parser';
import { loginController } from './controllers/loginController.js';
import { middleware } from "../src/middleware/middleware.js";
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 8000;

// Body parsers
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.post('/login', loginController); // <-- Remove middleware here

app.get('/dashboard', middleware, getDashboardMetrics); // Protected route
app.get('/products', getProducts);
app.post('/products', createProduct);
app.delete('/products/:productId', deleteProduct);
app.get('/salaries', getSalaries);
app.post('/salaries', createSalaries);
app.delete('/salaries/:userId', deleteSalaries);
app.get('/expenses', getExpensesByCategory);
app.post('/expenses', createExpense);
app.delete('/expenses/:expenseId', deleteExpense);
app.get('/users', getUsers);
app.post('/users', createUsers);
app.delete('/users/:userId', deleteUsers);

app.get('/', (req, res) => {
  res.send('Inventory Management System API');
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${port}`);
});
