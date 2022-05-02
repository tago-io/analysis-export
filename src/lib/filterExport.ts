import { TagsObj } from "@tago-io/sdk/out/common/common.types";

function filterExport(dashboard: { [key: string]: any }) {
  const export_tag = dashboard.tags.find((tag: TagsObj) => tag.key === "export_id");

  if (!export_tag) {
    return false;
  }
  return true;
}

export default filterExport;
