const { PrismaClient } = require('@prisma/client');

async function main() {
    console.log("Initializing PrismaClient...");
    try {
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: "file:./dev.db"
                }
            }
        });
        console.log("PrismaClient initialized.");
        const events = await prisma.event.findMany();
        console.log("Events found:", events.length);
    } catch (e) {
        console.error("Error Message:", e.message);
        console.error("Stack:", e.stack);
    }
}

main();
