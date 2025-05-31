import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const services = await prisma.service.findMany({
            include: {
                incidents: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            }
        });
        return NextResponse.json(services);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching services" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, description, status } = body;

        const service = await prisma.service.create({
            data: {
                name,
                description,
                status
            }
        });

        return NextResponse.json(service);
    } catch (error) {
        return NextResponse.json({ error: "Error creating service" }, { status: 500 });
    }
} 