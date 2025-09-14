import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { Request, Response } from 'express';

const app = express();
const PORT = 3000;

app.use(cors({
  origin: [
    "http://localhost:5173"
  ],
  credentials: true,
}));

// Proxy /api/auth/* to auth-service
app.use('/api/auth', createProxyMiddleware({
  target: 'http://localhost:5000', // auth-service port
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/api/auth',
  },
}));

// Proxy /api/emp/details/* to employee_crud_service
app.use('/api/emp/details', createProxyMiddleware({
  target: 'http://localhost:5001', // employee_crud_service port
  changeOrigin: true,
  pathRewrite: {
    '^/api/emp/details': '/api/emp/details',
  },
}));

// Proxy /api/emp/docs/* to employee_crud_service
app.use('/api/emp/docs', createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/emp/docs': '/api/emp/docs',
  },
}));

// Proxy /api/hr/* to employee_crud_service
app.use('/api/hr', createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/hr': '/api/hr',
  },
}));

app.get('/', (req: Request, res: Response) => {
  res.send('Gateway Service Running');
});

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});
