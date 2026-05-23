import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ReservationStatus } from "@prisma/client";

export async function POST() {
    try {

        const expiredReservations =
            await prisma.reservation.findMany({
                where: {
                    status: ReservationStatus.PENDING,
                    expiresAt: {
                        lte: new Date()
                    }
                }
            });

        for (const reservation of expiredReservations) {

            const inventory =
                await prisma.inventory.findFirst({
                    where: {
                        productId: reservation.productId,
                        warehouseId: reservation.warehouseId
                    }
                });

            if (inventory) {
                await prisma.inventory.update({
                    where: {
                        id: inventory.id
                    },
                    data: {
                        reservedUnits: {
                            decrement: reservation.quantity
                        }
                    }
                });
            }

            await prisma.reservation.update({
                where: {
                    id: reservation.id
                },
                data: {
                    status: ReservationStatus.RELEASED
                }
            });
        }

        return NextResponse.json({
            message: "Cleanup completed",
            expiredCount: expiredReservations.length
        });

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                error: "Cleanup failed"
            },
            {
                status: 500
            }
        );
    }
}