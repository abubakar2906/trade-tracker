import prisma from './src/db/client.js';

async function test() {
  try {
    const insights = await prisma.aIInsight.findMany({
      take: 1
    });
    console.log("Success:", insights);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
