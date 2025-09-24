import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:5000';
const EMPLOYEE_SERVICE_URL = process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:5001';
const PAYROLL_SERVICE_URL = process.env.PAYROLL_SERVICE_URL || 'http://localhost:5005';
const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:4004';

app.use('/api/auth', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
}));

app.use(['/api/emp/details', '/api/emp/docs', '/api/hr'], createProxyMiddleware({
  target: EMPLOYEE_SERVICE_URL,
  changeOrigin: true,
}));

app.use('/api/payroll', createProxyMiddleware({
  target: PAYROLL_SERVICE_URL,
  changeOrigin: true,
}));

app.use(['/api/rag/qa', '/api/rag/company-qa'], createProxyMiddleware({
  target: RAG_SERVICE_URL,
  changeOrigin: true,
}));

app.get('/', (req: Request, res: Response) => {
  res.send('Gateway Service Running');
});

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});