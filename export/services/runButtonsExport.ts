import { Account } from "@tago-io/sdk";
import { IExportHolder } from "../exportTypes";

interface ISidebarButton {
  color: string;
  href: string;
  iconUrl: string;
  text: string;
  type: string;
  value?: string;
}

async function runButtonsExport(account: Account, import_account: Account, export_holder: IExportHolder) {
  console.info("Run Buttons: started");

  const run_info = await account.run.info();
  const import_run_info = await import_account.run.info();

  const sidebar_buttons: ISidebarButton[] = run_info.sidebar_buttons;
  for (const btn of sidebar_buttons) {
    if (btn.type !== "dashboard") continue;

    btn.value = export_holder.dashboards[btn.value as string];
  }

  import_run_info.sidebar_buttons = sidebar_buttons;
  await import_account.run.edit(import_run_info);

  console.info("Run Buttons: finished");
  return export_holder;
}

export default runButtonsExport;
