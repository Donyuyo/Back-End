import { Router } from 'express';
import { getMockProducts } from '../controllers/mockingController.js';

const mockingRouter = Router();

mockingRouter.get('/mockingproducts', getMockProducts);

export default mockingRouter;
