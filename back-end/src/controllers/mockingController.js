import { generateMockProducts } from '../models/mocking.js';

export const getMockProducts = (req, res) => {
    const mockProducts = generateMockProducts();
    res.status(200).json(mockProducts);
};

export default { getMockProducts };