import { InstallButton } from "@/components/shared/install-button";
import { PageHeader } from "@/components/shared/page-header";

import { CustomerBreakdown } from "./customer-breakdown";
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
      <ProjectPipelineChart />
      <CustomerBreakdown />
      <RecentCustomers />
    </div>
  );
}
