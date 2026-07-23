import { InstallButton } from "@/components/shared/install-button";
import { PageHeader } from "@/components/shared/page-header";

import { CustomerBreakdown } from "./customer-breakdown";
import { ProjectFollowUp } from "./project-follow-up";
import { ProjectPipelineChart } from "./project-pipeline-chart";
import { QuotationAlert } from "./quotation-alert";
import { RecentCustomers } from "./recent-customers";
import { StatCards } from "./stat-cards";

export function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Ringkasan data pelanggan Anda."
        action={<InstallButton />}
      />

      <StatCards />
      <QuotationAlert />
      <ProjectFollowUp />
      <ProjectPipelineChart />
      <CustomerBreakdown />
      <RecentCustomers />
    </div>
  );
}
