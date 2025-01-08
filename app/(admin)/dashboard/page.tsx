import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";

import LogoutButtom from "./components/logoutButton";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-4">
      <h1>Bem-vindo ao Dashboard</h1>
      <p>Olá, {session.user.email}!</p>
      <LogoutButtom />
    </div>
  );
};

export default DashboardPage;
