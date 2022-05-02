import { Account } from "@tago-io/sdk";
import { DashboardInfo, WidgetInfo } from "@tago-io/sdk/out/modules/Account/dashboards.types";
import { IExportHolder } from "../exportTypes";
import replaceObj from "../lib/replaceObj";

async function insertWidgets(account: Account, import_account: Account, dashboard: DashboardInfo, target: DashboardInfo, export_holder: IExportHolder) {
  const widget_ids = dashboard.arrangement.map((x) => x.widget_id);
  const widgets = await Promise.all(widget_ids.map((x) => account.dashboards.widgets.info(dashboard.id, x)));
  const hidden_tabs = dashboard.tabs.filter((tab: any) => !tab.hidden).map((tab: any) => tab.key);
  const arrangement = dashboard.arrangement.sort((a) => (hidden_tabs.includes(a.tab) ? 1 : -1));

  const new_arrangement: any = [];
  const widget_holder: { [key: string]: string } = {};
  for (const widget_arrangement of arrangement) {
    const widget = widgets.find((wdgt) => widget_arrangement.widget_id === wdgt.id);

    const new_widget = replaceObj(widget, { ...export_holder.analysis, ...export_holder.devices, ...widget_holder });

    const { widget: new_id } = await import_account.dashboards.widgets.create(target.id, new_widget);
    new_arrangement.push({ ...widget_arrangement, widget_id: new_id });

    widget_holder[widget.id] = new_id;
  }

  await import_account.dashboards.edit(target.id, { arrangement: new_arrangement });
}

async function removeAllWidgets(import_account: Account, dashboard: DashboardInfo) {
  await Promise.all(dashboard.arrangement.map((widget) => import_account.dashboards.widgets.delete(dashboard.id, widget.widget_id)));
}

export { removeAllWidgets, insertWidgets };
