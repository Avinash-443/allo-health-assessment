import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { ReservationStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {

    try {

        const expiredReservations =
        await prisma.reservation.findMany({

            where: {

                status:
                ReservationStatus.PENDING,

                expiresAt:{
                    lte:new Date()
                }

            }

        });


        for(const reservation of expiredReservations){

            await prisma.inventory.updateMany({

                where:{

                    productId:
                    reservation.productId,

                    warehouseId:
                    reservation.warehouseId

                },

                data:{

                    reservedUnits:{
                        decrement:
                        reservation.quantity
                    }

                }

            });


            await prisma.reservation.update({

                where:{
                    id:reservation.id
                },

                data:{
                    status:
                    ReservationStatus.RELEASED
                }

            });

        }

        await redis.del(
            "products"
        );

        return NextResponse.json({

            success:true,
            cleaned:
            expiredReservations.length

        });

    }
    catch(error){

        console.log(error);

        return NextResponse.json(

            {
                error:
                "Cleanup failed"
            },

            {
                status:500
            }

        );

    }

}