import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { syncGoogleCalendar } from "@/lib/googleCalendar";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        googleAccessToken: true,
        googleRefreshToken: true,
        lastGoogleCalendarSync: true,
      },
    });

    return Response.json({
      connected: Boolean(user?.googleRefreshToken || user?.googleAccessToken),
      lastSync: user?.lastGoogleCalendarSync || null,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await syncGoogleCalendar(session.user.id);
    return Response.json(result);
  } catch (error) {
    if (error.message === "GOOGLE_CALENDAR_NOT_CONNECTED") {
      return Response.json(
        {
          error: "Google Calendar is not connected. Please connect your Google account.",
          code: "NOT_CONNECTED",
        },
        { status: 400 }
      );
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        googleAccessToken: null,
        googleRefreshToken: null,
        googleTokenExpiry: null,
      },
    });

    return Response.json({ success: true, message: "Google Calendar disconnected." });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
