import prisma from './src/db/client.js';
console.log(Object.keys(prisma).filter(k => k.toLowerCase().includes('insight')));
