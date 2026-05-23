import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

    const products = await prisma.product.findMany({
        include: {
            inventories: {
                include: {
                    warehouse: true
                }
            }
        }
    });

    const formattedProducts = products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,

        inventories: product.inventories.map((inventory) => ({
            warehouseId: inventory.warehouseId,
            warehouseName: inventory.warehouse.name,

            totalUnits: inventory.totalUnits,

            reservedUnits: inventory.reservedUnits,

            availableUnits:
                inventory.totalUnits -
                inventory.reservedUnits
        }))
    }));

    return NextResponse.json(formattedProducts);
}