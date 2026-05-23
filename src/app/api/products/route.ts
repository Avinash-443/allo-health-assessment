import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET() {

    // Check Redis cache first
    const cachedProducts =
        await redis.get("products");

    if (cachedProducts) {

        console.log(
            "Serving products from Redis"
        );

        return NextResponse.json(
            cachedProducts
        );
    }

    console.log(
        "Serving products from Database"
    );

    // Get products from database
    const products =
        await prisma.product.findMany({
            include: {
                inventories: {
                    include: {
                        warehouse: true
                    }
                }
            }
        });

    // Format response
    const formattedProducts =
        products.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description,

            inventories:
                product.inventories.map(
                    (inventory) => ({
                        warehouseId:
                            inventory.warehouseId,

                        warehouseName:
                            inventory.warehouse.name,

                        totalUnits:
                            inventory.totalUnits,

                        reservedUnits:
                            inventory.reservedUnits,

                        availableUnits:
                            inventory.totalUnits -
                            inventory.reservedUnits
                    })
                )
        }));


    // Save in Redis for 60 seconds
    await redis.set(
        "products",
        formattedProducts,
        {
            ex: 60
        }
    );

    return NextResponse.json(
        formattedProducts
    );
}