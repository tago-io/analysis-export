import { Account } from "@tago-io/sdk";
import { DictionaryInfo } from "@tago-io/sdk/out/modules/Account/dictionaries.types";
import { queue } from "async";
import { IExportHolder } from "../exportTypes";

interface IQueue {
  item: DictionaryInfo;
  import_list: DictionaryInfo[];
  import_account: Account;
  account: Account;
}
async function updateDictionary({ item, import_list, account, import_account }: IQueue) {
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

async function dictionaryExport(account: Account, import_account: Account, export_holder: IExportHolder) {
  console.info("Exporting dictionaries: started");

  const list = await account.dictionaries.list({ amount: 99, fields: ["id", "slug", "languages", "name", "fallback"] });
  const import_list = await import_account.dictionaries.list({ amount: 99, fields: ["id", "slug", "languages", "name", "fallback"] });

  const dictionaryQueue = queue(updateDictionary, 5);
  dictionaryQueue.error((error) => console.log(error));

  list.forEach((item) => {
    dictionaryQueue.push({ item, import_account, import_list, account });
  });

  await dictionaryQueue.drain();

  console.info("Exporting dictionaries: finished");
  return export_holder;
}

export default dictionaryExport;
