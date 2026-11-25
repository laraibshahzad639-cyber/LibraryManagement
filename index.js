import express from 'express';
import dotenv from 'dotenv';
import { route } from './src/auth/auth.route.js';
import { router } from './src/user/user.route.js';
import cookieParser from 'cookie-parser';
import { notFoundMiddleware } from './src/middleware/notfound.middleware.js';
import { errorhandlerMiddleware } from './src/middleware/errorhandler.middleware.js';
import { router1 } from './src/book/book.route.js';
import { CategoryRoute } from './src/category/category.route.js';
import { borrowRoute } from './src/borrow/borrow.route.js';
import { dashboardRoute } from './src/dashboard/dashboard.route.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', route);
app.use('/api/users', router);
app.use('/api/books', router1);
app.use('/api/categories', CategoryRoute);
app.use('/api/borrow', borrowRoute);
app.use('/api/dashboard', dashboardRoute);
app.use(notFoundMiddleware);
app.use(errorhandlerMiddleware);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
