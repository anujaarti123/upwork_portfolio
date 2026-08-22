import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getAdminSiteData } from "@/lib/data/site";
import { DEFAULT_SITE_DATA } from "@/lib/data/defaults";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const siteData = (await getAdminSiteData()) ?? DEFAULT_SITE_DATA;

  return (
    <ThemeProvider settings={siteData.settings}>
      <AdminDashboard initialData={siteData} />
    </ThemeProvider>
  );
}
