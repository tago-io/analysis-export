import { Account } from "@tago-io/sdk";
import { DashboardInfo } from "@tago-io/sdk/out/modules/Account/dashboards.types";
import { queue } from "async";
import { IExportHolder } from "../exportTypes";
import { insertWidgets, removeAllWidgets } from "./widgetsExport";

interface IQueue {
  label: string;
  dash_id: string;
  import_list: DashboardInfo[];
  export_holder: IExportHolder;
  import_account: Account;
  account: Account;
}
async function updateDashboard({ label, dash_id, import_list, export_holder, account, import_account }: IQueue) {
  console.info(`Exporting dashboard ${label}...`);
  const dashboard = await account.dashboards.info(dash_id);
  const export_id = dashboard.tags.find((tag) => tag.key === "export_id")?.value;
  if (!export_id) {
    return;
  }

  const dash_target = await resolveDashboardTarget(import_account, export_id, import_list, dashboard);

  await removeAllWidgets(import_account, dash_target).catch(console.log);
  dash_target.arrangement = [];
  await insertWidgets(account, import_account, dashboard, dash_target, export_holder).catch(console.log);
  export_holder.dashboards[dash_id] = dash_target.id;
}

async function resolveDashboardTarget(import_account: Account, export_id: string, import_list: DashboardInfo[], content: DashboardInfo) {
  const import_dashboard = import_list.find((dash) => {
    const import_id = dash.tags?.find((tag) => tag.key === "export_id")?.value;
    return import_id && import_id === export_id;
  });

  if (import_dashboard) {
    const dashboard = await import_account.dashboards.info(import_dashboard.id);
    await import_account.dashboards.edit(import_dashboard.id, {
      blueprint_device_behavior: content.blueprint_device_behavior,
      blueprint_devices: content.blueprint_devices,
      blueprint_selector_behavior: content.blueprint_selector_behavior,
      tabs: content.tabs,
      tags: content.tags,
      label: content.label,
    });
    return dashboard;
  }

  const { dashboard: dashboard_id } = await import_account.dashboards.create({ ...content, arrangement: null });
  await new Promise((resolve) => setTimeout(resolve, 800)); // sleep
  await import_account.dashboards.edit(dashboard_id, { ...content, arrangement: null });

  return import_account.dashboards.info(dashboard_id);
}

async function dashboardExport(account: Account, import_account: Account, export_holder: IExportHolder) {
  console.info("Exporting dashboard: started");
  const list = await account.dashboards.list({ page: 1, amount: 99, fields: ["id", "label", "tags"], filter: { tags: [{ key: "export_id" }] } });
  const import_list = await import_account.dashboards.list({ page: 1, amount: 99, fields: ["id", "label", "tags"], filter: { tags: [{ key: "export_id" }] } });

  const dashboardQueue = queue(updateDashboard, 3);
  dashboardQueue.error((error) => console.log(error));

  list.forEach(({ id: dash_id, label }) => {
    dashboardQueue.push({ dash_id, label, import_list, import_account, export_holder, account }).catch(null);
  });

  await dashboardQueue.drain();

  console.info("Exporting dashboard: finished");
  return export_holder;
}

export default dashboardExport;
