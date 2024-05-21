import faker from 'faker'
export const generateMockProducts = () => {
    const mockProducts = [];
    for (let i = 0; i < 100; i++) {
        const product = {
            _id: faker.datatype.uuid(),
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            category: faker.commerce.department(),
            stock: faker.datatype.number({ min: 0, max: 100 }),
            createdAt: faker.date.past(),
            updatedAt: faker.date.recent()
        };
        mockProducts.push(product);
    }
    return mockProducts;
};
