import { getCadets } from "@/lib/actions/user.actions";
import { CadetsClientPage } from "@/components/admin/cadets-client-page";

export default async function ManageCadetsPage() {
  const initialCadets = await getCadets();

  return <CadetsClientPage initialCadets={initialCadets} />;
}
