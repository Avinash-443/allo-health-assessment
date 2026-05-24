import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest
){

    try{

        const body =
            await request.json();

        const {
            name,
            location
        } = body;

        const warehouse =
            await prisma.warehouse.create({

                data:{

                    name,
                    location

                }

            });

        return NextResponse.json(
            warehouse
        );

    }
    catch(error){

        console.log(error);

        return NextResponse.json(
            {
                error:
                "Warehouse creation failed"
            },
            {
                status:500
            }
        );

    }

}