import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const categories = [
        "Computer Science",
        "Music",
        "Fitness",
        "Photography",
        "Accounting",
        "Engineering",
        "Filming",
    ];

    for (const category of categories) {
        await prisma.category.create({
            data: {
                name: category,
            },
        });
    }

    console.log("Categories seeded successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 