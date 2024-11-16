import { validateRequest } from "@/lib/validate-request";

import { Playfair_Display } from "next/font/google";

const playfair_DisplayVariable = Playfair_Display({
    weight: ["400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
});

export default async function DashboardPage() {
  const { user } = await validateRequest();

  if (!user) {
    return null; // The layout will handle the redirect
  }

  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold ${playfair_DisplayVariable.className}`}>Dashboard</h1>
    </div>
  )
}
