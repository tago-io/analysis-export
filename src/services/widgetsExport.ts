import { queue } from "async";

import { Account, DashboardInfo, WidgetInfo } from "@tago-io/sdk";

import { IExportHolder } from "../exportTypes";
import replaceObj from "../lib/replaceObj";

/**
 * Orders widgets so the ones in hidden tabs are created first. A header button on a visible widget
 * references a hidden widget by id, and that reference is only remapped (via widget_holder) if the
 * hidden widget already exists when the referencing widget is created. A tab is hidden when its
 * `type` is "hidden".
 */
function sortHiddenWidgetsFirst(arrangement: any[], tabs: any[]) {
  const hiddenTabs = new Set((tabs || []).filter((tab: any) => tab.type === "hidden").map((tab: any) => tab.key));
  const isHidden = (item: any) => hiddenTabs.has(item.tab);
  return [...arrangement].sort((a, b) => Number(isHidden(b)) - Number(isHidden(a)));
}

async function insertWidgets(account: Account, import_account: Account, dashboard: DashboardInfo, target: DashboardInfo, export_holder: IExportHolder) {
  const widget_ids = dashboard.arrangement?.map((x) => x.widget_id);

  const widgets: WidgetInfo[] = [];
  const newWidgetQueue = queue(async (widget_id: string) => {
    const info = await account.dashboards.widgets.info(dashboard.id, widget_id);
    await new Promise((resolve) => setTimeout(resolve, 200)); // sleep
    if (info) {
      widgets.push(info);
    }
  }, 5);

  newWidgetQueue.error((error) => console.log(error));
  for (const x of widget_ids || []) {
    newWidgetQueue.push(x).catch(console.error);
  }

  await newWidgetQueue.drain();

  if (!dashboard.arrangement) {
    return;
  }
  const arrangement = sortHiddenWidgetsFirst(dashboard.arrangement, dashboard.tabs);

  const new_arrangement: any = [];
  const widget_holder: { [key: string]: string } = {};
  for (const widget_arrangement of arrangement) {
    const widget = widgets.find((wdgt) => widget_arrangement.widget_id === wdgt.id);
    if (!widget || !widget.id) {
      continue;
    }

    const new_widget = replaceObj(widget, { ...export_holder.analysis, ...export_holder.devices, ...widget_holder });
    if (new_widget.data) {
      new_widget.data = new_widget.data.map((x: any) => {
        if (x.qty) {
          x.qty = Number(x.qty);
        }
        return x;
      });
    }

    const { widget: new_id } = await import_account.dashboards.widgets.create(target.id, new_widget);
    new_arrangement.push({ ...widget_arrangement, widget_id: new_id });

    widget_holder[widget.id] = new_id;
  }

  await import_account.dashboards.edit(target.id, { arrangement: new_arrangement });
}

async function removeAllWidgets(import_account: Account, dashboard: DashboardInfo) {
  if (!dashboard.arrangement || dashboard.arrangement?.length === 0) {
    return;
  }

  const widgetQueue = queue(async (widget_id: string) => {
    await import_account.dashboards.widgets.delete(dashboard.id, widget_id).catch(() => null);
    await new Promise((resolve) => setTimeout(resolve, 100)); // sleep
    return;
  }, 5);

  widgetQueue.error(console.error);
  for (const x of dashboard.arrangement) {
    widgetQueue.push(x.widget_id).catch(console.error);
  }

  await widgetQueue.drain();
}

export { removeAllWidgets, insertWidgets, sortHiddenWidgetsFirst };
