const express = require('express');
const cors = require('cors');

const errorMiddleware = require('./middlewares/errorMiddleware');

// routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Register routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/admin', adminRoutes);

// Error handler (last)
app.use(errorMiddleware);

module.exports = app;
