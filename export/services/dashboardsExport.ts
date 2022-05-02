import { Account } from "@tago-io/sdk";
import { DashboardInfo } from "@tago-io/sdk/out/modules/Account/dashboards.types";
import { TemplateObjDashboard } from "@tago-io/sdk/out/modules/Account/template.types";
import { IExportHolder } from "../exportTypes";
import filterExport from "../lib/filterExport";
import { insertWidgets, removeAllWidgets } from "./widgetsExport";

// async function fixTemplates(account: Account, import_list: DashboardInfo[]) {
//   console.info("Updating dashboard templates");

//   for (const { id: dashboard_id } of import_list) {
//     const devices = await account.dashboards.listDevicesRelated(dashboard_id);
//     const analysis = await account.dashboards.listAnalysisRelated(dashboard_id);

//     const template: TemplateObjDashboard = {
//       dashboard: dashboard_id,
//       image_logo: "",
//       image_main: "",
//       name: "Exported Dashboard",
//       setup: {
//         analysis: [],
//         config: devices.map((device_id) => ({ conditions: [], id: device_id, name: "", description: "" })),
//       },
//     };

//     await account.template.generateTemplate(template);
//   }
// }

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
  await import_account.dashboards.edit(dashboard_id, { ...content, arrangement: null });

  return import_account.dashboards.info(dashboard_id);
}

async function dashboardExport(account: Account, import_account: Account, export_holder: IExportHolder) {
  console.info("Exporting dashboard: started");
  const list = await account.dashboards.list({ page: 1, amount: 99, fields: ["id", "label", "tags"], filter: { tags: [{ key: "export_id" }] } });
  const import_list = await import_account.dashboards.list({ page: 1, amount: 99, fields: ["id", "label", "tags"], filter: { tags: [{ key: "export_id" }] } });

  // await Promise.all(import_list.map((dash) => account.dashboards.delete(dash.id)));

  // await fixTemplates(account, import_list);

  for (const { id: dash_id, label } of list) {
    console.info(`Exporting dashboard ${label}...`);
    const dashboard = await account.dashboards.info(dash_id);
    const export_id = dashboard.tags.find((tag) => tag.key === "export_id")?.value;
    if (!export_id) {
      continue;
    }

    const dash_target = await resolveDashboardTarget(import_account, export_id, import_list, dashboard);

    await removeAllWidgets(import_account, dash_target);
    dash_target.arrangement = [];
    await insertWidgets(account, import_account, dashboard, dash_target, export_holder);
    export_holder.dashboards[dash_id] = dash_target.id;
  }

  console.info("Exporting dashboard: finished");
  return export_holder;
}

export default dashboardExport;
