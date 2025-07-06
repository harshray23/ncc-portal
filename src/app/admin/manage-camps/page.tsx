import { getCamps } from "@/lib/actions/camp.actions";
import { CampsClientPage } from "@/components/admin/camps-client-page";

export default async function ManageCampsPage() {
  const initialCamps = await getCamps();

  return <CampsClientPage initialCamps={initialCamps} />;
}
