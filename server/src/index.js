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
import { toggleProductVerification } from './controllers/verifyController.js';

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
app.get('/products',middleware, getProducts);
app.post('/products',middleware, createProduct);
app.put('/verify-imei', middleware, toggleProductVerification);
app.delete('/products/:productId', middleware,deleteProduct);
app.get('/salaries',middleware, getSalaries);
app.post('/salaries',middleware, createSalaries);
app.delete('/salaries/:userId',middleware, deleteSalaries);
app.get('/expenses',middleware, getExpensesByCategory);
app.post('/expenses',middleware, createExpense);
app.delete('/expenses/:expenseId',middleware, deleteExpense);
app.get('/users',middleware, getUsers);
app.post('/users',middleware, createUsers);
app.delete('/users/:userId',middleware, deleteUsers);

app.get('/', (req, res) => {
  res.send('Inventory Management System API');
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${port}`);
});
