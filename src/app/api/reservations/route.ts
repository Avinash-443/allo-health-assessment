import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {

    const reservations =
    await prisma.reservation.findMany({

        include:{

            product:true,
            warehouse:true

        },

        orderBy:{
            createdAt:"desc"
        }

    });

    return NextResponse.json(
        reservations
    );

}


export async function POST(
    request:NextRequest
){

    try{

        const body =
        await request.json();

        const{

            productId,
            warehouseId,
            quantity

        } = body;


        const expiresAt =
        new Date(

            Date.now()
            +
            10*60*1000

        );


        const reservation =

        await prisma.$transaction(

        async(tx)=>{

            const inventory =
            await tx.inventory.findFirst({

                where:{

                    productId,
                    warehouseId

                }

            });


            if(!inventory){

                throw new Error(
                    "Inventory not found"
                );

            }


            const availableUnits =

            inventory.totalUnits
            -
            inventory.reservedUnits;


            if(
                availableUnits
                <
                quantity
            ){

                throw new Error(
                    "Not enough stock"
                );

            }


            /*
            Strong optimistic locking
            */

            const result =

            await tx.inventory.updateMany({

                where:{

                    id:inventory.id,

                    reservedUnits:
                    inventory.reservedUnits

                },

                data:{

                    reservedUnits:{

                        increment:
                        quantity

                    }

                }

            });


            if(
                result.count===0
            ){

                throw new Error(
                    "Inventory changed. Please try again."
                );

            }


            return await tx.reservation.create({

                data:{

                    productId,
                    warehouseId,
                    quantity,
                    expiresAt,
                    status:"PENDING"

                }

            });

        });


        await redis.del(
            "products"
        );


        return NextResponse.json(
            reservation
        );

    }
    catch(error){

        console.log(error);

        return NextResponse.json(

            {

                error:
                error instanceof Error
                ?
                error.message
                :
                "Reservation failed"

            },

            {

                status:409

            }

        );

    }

}