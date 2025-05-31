import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const incidents = await prisma.incident.findMany({
            include: {
                service: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(incidents);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching incidents" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, status, serviceId } = body;

        const incident = await prisma.incident.create({
            data: {
                title,
                description,
                status,
                serviceId
            }
        });

        // Update service status
        await prisma.service.update({
            where: { id: serviceId },
            data: { status }
        });

        return NextResponse.json(incident);
    } catch (error) {
        return NextResponse.json({ error: "Error creating incident" }, { status: 500 });
    }
} 