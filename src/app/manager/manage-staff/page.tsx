import { StaffClientPage } from "@/components/manager/staff-client-page";
import { getStaff } from "@/lib/actions/staff.actions";

export default async function ManageStaffPage() {
  const { admins, managers } = await getStaff();
  return <StaffClientPage initialAdmins={admins} initialManagers={managers} />;
}
