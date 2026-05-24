import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest
){

    try{

        const body =
            await request.json();

        const{
            name,
            description,
            warehouseId,
            totalUnits
        } = body;

        const product =
        await prisma.product.create({

            data:{

                name,
                description

            }

        });

        await prisma.inventory.create({

            data:{

                productId:
                product.id,

                warehouseId,

                totalUnits:
                Number(
                    totalUnits
                ),

                reservedUnits:0

            }

        });

        await redis.del(
            "products"
        );

        return NextResponse.json(
            product
        );

    }
    catch(error){

        console.log(
            error
        );

        return NextResponse.json(
            {
                error:
                "Product creation failed"
            },
            {
                status:500
            }
        );

    }

}