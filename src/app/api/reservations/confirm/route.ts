import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ReservationStatus } from "@prisma/client";

export async function POST(
    request: NextRequest
) {

    try {

        const body =
        await request.json();

        const {
            reservationId
        } = body;


        const reservation =
        await prisma.reservation.findUnique({

            where:{
                id:reservationId
            }

        });


        if(!reservation){

            return NextResponse.json(

                {
                    error:
                    "Reservation not found"
                },

                {
                    status:404
                }

            );

        }


        if(

            reservation.status !==
            ReservationStatus.PENDING

        ){

            return NextResponse.json(

                {
                    error:
                    "Reservation already processed"
                },

                {
                    status:400
                }

            );

        }


        const inventory =
        await prisma.inventory.findFirst({

            where:{

                productId:
                reservation.productId,

                warehouseId:
                reservation.warehouseId

            }

        });


        if(!inventory){

            return NextResponse.json(

                {
                    error:
                    "Inventory not found"
                },

                {
                    status:404
                }

            );

        }


        const newReserved =

        Math.max(

            0,

            inventory.reservedUnits
            -
            reservation.quantity

        );


        const newTotal =

        Math.max(

            0,

            inventory.totalUnits
            -
            reservation.quantity

        );


        await prisma.inventory.update({

            where:{
                id:inventory.id
            },

            data:{

                totalUnits:
                newTotal,

                reservedUnits:
                newReserved

            }

        });


        const updatedReservation =
        await prisma.reservation.update({

            where:{
                id:reservation.id
            },

            data:{

                status:
                ReservationStatus.CONFIRMED

            }

        });


        return NextResponse.json(
            updatedReservation
        );

    }
    catch(error){

        console.log(error);

        return NextResponse.json(

            {
                error:
                "Confirmation failed"
            },

            {
                status:500
            }

        );

    }

}