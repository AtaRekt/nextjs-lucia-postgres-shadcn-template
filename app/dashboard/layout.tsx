import { redirect } from "next/navigation"
import Sidebar from "@/components/dashboard/sidebar"
import SecondaryNav from "@/components/dashboard/secondary-nav"
import { validateRequest } from "@/lib/validate-request";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <SecondaryNav user={{
          name: user.username,
          email: user.email,
          username: user.username
        }} />
        <main className="p-6 container mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
