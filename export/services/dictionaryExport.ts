import { Account } from "@tago-io/sdk";
import { IExportHolder } from "../exportTypes";

async function dictionaryExport(account: Account, import_account: Account, export_holder: IExportHolder) {
  console.info("Exporting dictionaries: started");

  const list = await account.dictionaries.list({ amount: 99, fields: ["id", "slug", "languages", "name", "fallback"] });
  const import_list = await import_account.dictionaries.list({ amount: 99, fields: ["id", "slug", "languages", "name", "fallback"] });

  for (const item of list) {
    console.info(`Exporting dictionary ${item.name}`);
    let { id: target_id } = import_list.find((dict) => dict.slug === item.slug) || { id: null };

    if (!target_id) {
      ({ dictionary: target_id } = await import_account.dictionaries.create(item));
    } else {
      const new_item = { ...item } as any;
      delete new_item.id;
      await import_account.dictionaries.edit(target_id, new_item);
    }

    for (const lang of item.languages) {
      const dictionary = await account.dictionaries.languageInfo(item.id, lang.code);
      import_account.dictionaries.languageEdit(target_id, lang.code, { dictionary: dictionary as any, active: true });
    }
  }

  console.info("Exporting dictionaries: finished");
  return export_holder;
}

export default dictionaryExport;
