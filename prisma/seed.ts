import { prisma } from "../src/lib/prisma";

async function main() {

  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: "Chennai Warehouse",
      location: "Chennai"
    }
  });

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: "Bangalore Warehouse",
      location: "Bangalore"
    }
  });

  const laptop = await prisma.product.create({
    data: {
      name: "Gaming Laptop",
      description: "High performance laptop"
    }
  });

  const phone = await prisma.product.create({
    data: {
      name: "Smart Phone",
      description: "Latest smartphone"
    }
  });

  await prisma.inventory.createMany({
    data: [
      {
        productId: laptop.id,
        warehouseId: warehouse1.id,
        totalUnits: 10,
        reservedUnits: 0
      },
      {
        productId: laptop.id,
        warehouseId: warehouse2.id,
        totalUnits: 5,
        reservedUnits: 0
      },
      {
        productId: phone.id,
        warehouseId: warehouse1.id,
        totalUnits: 8,
        reservedUnits: 0
      },
      {
        productId: phone.id,
        warehouseId: warehouse2.id,
        totalUnits: 12,
        reservedUnits: 0
      }
    ]
  });

  console.log("Seed completed");
}

main()
.catch(console.error)
.finally(async ()=> {
    await prisma.$disconnect();
});