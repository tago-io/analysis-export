import { Account } from "@tago-io/sdk";
import { DashboardInfo } from "@tago-io/sdk/out/modules/Account/dashboards.types";
import { TemplateObjDashboard } from "@tago-io/sdk/out/modules/Account/template.types";
import { IExportHolder } from "../exportTypes";
import filterExport from "../lib/filterExport";
import { insertWidgets, removeAllWidgets } from "./widgetsExport";

async function resolveDashboardTarget(import_account: Account, export_id: string, import_list: DashboardInfo[], content: DashboardInfo) {
  const import_dashboard = import_list.find((dash) => {
    const import_id = dash.tags?.find((tag) => tag.key === "export_id")?.value;
    return import_id && import_id === export_id;
  });

  if (import_dashboard) {
    const dashboard = await import_account.dashboards.info(import_dashboard.id);
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

  for (const { id: dash_id, label } of list) {
    console.info(`Exporting dashboard ${label}...`);
    const dashboard = await account.dashboards.info(dash_id);
    const export_id = dashboard.tags.find((tag) => tag.key === "export_id")?.value;
    if (!export_id) {
      continue;
    }

    const dash_target = await resolveDashboardTarget(import_account, export_id, import_list, dashboard);

    await removeAllWidgets(import_account, dash_target).catch(console.log);
    dash_target.arrangement = [];
    await insertWidgets(account, import_account, dashboard, dash_target, export_holder).catch(console.log);
    export_holder.dashboards[dash_id] = dash_target.id;
  }

  console.info("Exporting dashboard: finished");
  return export_holder;
}

export default dashboardExport;