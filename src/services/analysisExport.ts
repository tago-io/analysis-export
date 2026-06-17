import zlib from "zlib";
import { Account } from "@tago-io/sdk";

import { IExportHolder } from "../exportTypes";
import replaceObj from "../lib/replaceObj";

// The SDK still types runtime/language as the legacy "node" | "python", but the API accepts the
// full set below. We propagate the source runtime as-is so a "deno-rt2025" analysis is not
// recreated as legacy "node".
type AnalysisRuntime = "node-legacy" | "python-legacy" | "node-rt2025" | "python-rt2025" | "deno-rt2025" | "node" | "python" | "other";

async function analysisExport(account: Account, import_account: Account, export_holder: IExportHolder) {
  console.info("Exporting analysis: started");

  const list = await account.analysis.list({ amount: 99, fields: ["id", "name", "tags"], filter: { tags: [{ key: "export_id" }] } }).then((r) => r.reverse());
  const import_list = await import_account.analysis.list({ amount: 99, fields: ["id", "tags"], filter: { tags: [{ key: "export_id" }] } });

  for (const { id: analysis_id, name } of list) {
    console.info(`Exporting analysis ${name}...`);
    const analysis = await account.analysis.info(analysis_id);
    const export_id = analysis.tags?.find((tag) => tag.key === "export_id")?.value;

    let { id: target_id } = import_list.find((analysis) => analysis.tags?.find((tag) => tag.key === "export_id" && tag.value == export_id)) || { id: null };

    const new_analysis = replaceObj(analysis, { ...export_holder.devices, ...export_holder.tokens });
    const runtime: AnalysisRuntime = (analysis as any).runtime ?? "node";
    if (!target_id) {
      ({ id: target_id } = await import_account.analysis.create({ ...new_analysis, runtime } as any));
    } else {
      await import_account.analysis.edit(target_id, {
        name: new_analysis.name,
        tags: new_analysis.tags,
        active: new_analysis.active,
        variables: new_analysis.variables,
        runtime,
      } as any);
    }
    const script = await account.analysis.downloadScript(analysis_id);
    const response = await fetch(script.url);
    const arrayBuffer = await response.arrayBuffer();
    const script_base64 = zlib.gunzipSync(Buffer.from(arrayBuffer)).toString("base64");

    await import_account.analysis.uploadScript(target_id, { content: script_base64, language: runtime, name: "script.js" } as any);

    export_holder.analysis[analysis_id] = target_id;
  }

  console.info("Exporting analysis: finished");
  return export_holder;
}

export { analysisExport };
