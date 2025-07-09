import { getCadets } from "@/lib/actions/user.actions";
import { ManageYearClientPage } from "@/components/admin/manage-year-client-page";

export default async function ManageCadetYearPage() {
  const initialCadets = await getCadets();

  return <ManageYearClientPage initialCadets={initialCadets} />;
}
