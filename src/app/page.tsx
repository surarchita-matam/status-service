import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import StatusPage from "@/components/StatusPage";
import AdminDashboard from "@/components/AdminDashboard";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";

  return (
    <main className="container mx-auto px-4 py-8">
      {isAdmin ? <AdminDashboard /> : <StatusPage />}
    </main>
  );
}
