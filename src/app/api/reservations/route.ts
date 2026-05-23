import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {

    const reservations =
        await prisma.reservation.findMany({
            include: {
                product: true,
                warehouse: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

    return NextResponse.json(
        reservations
    );
}


export async function POST(request: NextRequest) {
    try {

        const body = await request.json();

        const {
            productId,
            warehouseId,
            quantity
        } = body;

        const inventory = await prisma.inventory.findMany();

        console.log("Received:");
        console.log({
            productId,
            warehouseId
        });

        console.log("Database:");
        console.log(inventory);

        const selectedInventory = inventory.find(
            (item) =>
                item.productId === productId &&
                item.warehouseId === warehouseId
        );

        if (!selectedInventory) {
            return NextResponse.json(
                {
                    error: "Inventory not found"
                },
                {
                    status: 404
                }
            );
        }

        const availableUnits =
            selectedInventory.totalUnits -
            selectedInventory.reservedUnits;

        if (availableUnits < quantity) {
            return NextResponse.json(
                { error: "Not enough stock" },
                { status: 409 }
            );
        }

        await prisma.inventory.update({
            where: {
                id: selectedInventory.id
            },
            data: {
                reservedUnits: {
                    increment: quantity
                }
            }
        });

        const expiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );

        const reservation =
            await prisma.reservation.create({
                data: {
                    productId,
                    warehouseId,
                    quantity,
                    expiresAt,
                    status: "PENDING"
                }
            });

        return NextResponse.json(
            reservation
        );

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                error: "Reservation failed"
            },
            {
                status: 500
            }
        );
    }
}