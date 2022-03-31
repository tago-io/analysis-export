"use strict";
exports.__esModule = true;
function filterExport(dashboard) {
    var export_tag = dashboard.tags.find(function (tag) { return tag.key === "export_id"; });
    if (!export_tag) {
        return false;
    }
    return true;
}
exports["default"] = filterExport;
