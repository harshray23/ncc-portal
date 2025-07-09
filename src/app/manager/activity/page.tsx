import { ActivityClientPage } from "@/components/manager/activity-client-page";
import { getAuditLogs } from "@/lib/actions/activity.actions";

export default async function ActivityMonitorPage() {
  const activities = await getAuditLogs();
  
  return <ActivityClientPage initialActivities={activities} />;
}
