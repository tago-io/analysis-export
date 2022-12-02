import { Account } from "@tago-io/sdk";
import { IExportHolder } from "../exportTypes";
import replaceObj from "../lib/replaceObj";

interface ISidebarButton {
  color: string;
  href: string;
  iconUrl: string;
  text: string;
  type: string;
  value?: string;
}

interface ISigninButton {
  label: string;
  type: "link";
  url: string;
}

async function runButtonsExport(account: Account, import_account: Account, export_holder: IExportHolder) {
  console.info("Run Buttons: started");

  const run_info = await account.run.info();
  const import_run_info = await import_account.run.info();

  // Sidebar Buttons
  const sidebar_buttons: ISidebarButton[] = run_info.sidebar_buttons;
  for (const btn of sidebar_buttons) {
    if (btn.type !== "dashboard") {
      continue;
    }

    btn.value = export_holder.dashboards[btn.value as string];
  }

  import_run_info.sidebar_buttons = sidebar_buttons;

  // Sign-in Buttons
  const signin_buttons: ISigninButton[] = (run_info as any).signin_buttons || [];
  for (let btn of signin_buttons) {
    btn = replaceObj(btn, export_holder.dashboards);
  }

  // Email Templates
  for (const template_name of Object.keys(run_info.email_templates)) {
    const email_obj = run_info.email_templates[template_name];
    import_run_info.email_templates[template_name] = email_obj;
  }

  await import_account.run.edit(import_run_info).then(console.log);

  console.info("Run Buttons: finished");
  return export_holder;
}

export default runButtonsExport;
