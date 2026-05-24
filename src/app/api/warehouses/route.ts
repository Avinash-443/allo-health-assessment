import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

    try {

        const warehouses =
            await prisma.warehouse.findMany({

                orderBy:{
                    name:"asc"
                }

            });

        return NextResponse.json(
            warehouses
        );

    }
    catch(error){

        console.log(
            error
        );

        return NextResponse.json(

            {
                error:
                "Failed to load warehouses"
            },

            {
                status:500
            }

        );

    }

}