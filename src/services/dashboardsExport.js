"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var widgetsExport_1 = require("./widgetsExport");
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
function resolveDashboardTarget(import_account, export_id, import_list, content) {
    return __awaiter(this, void 0, void 0, function () {
        var import_dashboard, dashboard, dashboard_id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    import_dashboard = import_list.find(function (dash) {
                        var _a, _b;
                        var import_id = (_b = (_a = dash.tags) === null || _a === void 0 ? void 0 : _a.find(function (tag) { return tag.key === "export_id"; })) === null || _b === void 0 ? void 0 : _b.value;
                        return import_id && import_id === export_id;
                    });
                    if (!import_dashboard) return [3 /*break*/, 2];
                    return [4 /*yield*/, import_account.dashboards.info(import_dashboard.id)];
                case 1:
                    dashboard = _a.sent();
                    return [2 /*return*/, dashboard];
                case 2: return [4 /*yield*/, import_account.dashboards.create(__assign(__assign({}, content), { arrangement: null }))];
                case 3:
                    dashboard_id = (_a.sent()).dashboard;
                    return [4 /*yield*/, import_account.dashboards.edit(dashboard_id, __assign(__assign({}, content), { arrangement: null }))];
                case 4:
                    _a.sent();
                    return [2 /*return*/, import_account.dashboards.info(dashboard_id)];
            }
        });
    });
}
function dashboardExport(account, import_account, export_holder) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var list, import_list, _i, list_1, _b, dash_id, label, dashboard, export_id, dash_target;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.info("Exporting dashboard: started");
                    return [4 /*yield*/, account.dashboards.list({ page: 1, amount: 99, fields: ["id", "label", "tags"], filter: { tags: [{ key: "export_id" }] } })];
                case 1:
                    list = _c.sent();
                    return [4 /*yield*/, import_account.dashboards.list({ page: 1, amount: 99, fields: ["id", "label", "tags"], filter: { tags: [{ key: "export_id" }] } })];
                case 2:
                    import_list = _c.sent();
                    _i = 0, list_1 = list;
                    _c.label = 3;
                case 3:
                    if (!(_i < list_1.length)) return [3 /*break*/, 9];
                    _b = list_1[_i], dash_id = _b.id, label = _b.label;
                    console.info("Exporting dashboard " + label + "...");
                    return [4 /*yield*/, account.dashboards.info(dash_id)];
                case 4:
                    dashboard = _c.sent();
                    export_id = (_a = dashboard.tags.find(function (tag) { return tag.key === "export_id"; })) === null || _a === void 0 ? void 0 : _a.value;
                    if (!export_id)
                        return [3 /*break*/, 8];
                    return [4 /*yield*/, resolveDashboardTarget(import_account, export_id, import_list, dashboard)];
                case 5:
                    dash_target = _c.sent();
                    return [4 /*yield*/, (0, widgetsExport_1.removeAllWidgets)(import_account, dash_target)];
                case 6:
                    _c.sent();
                    dash_target.arrangement = [];
                    return [4 /*yield*/, (0, widgetsExport_1.insertWidgets)(account, import_account, dashboard, dash_target, export_holder)];
                case 7:
                    _c.sent();
                    export_holder.dashboards[dash_id] = dash_target.id;
                    _c.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 3];
                case 9:
                    console.info("Exporting dashboard: finished");
                    return [2 /*return*/, export_holder];
            }
        });
    });
}
exports["default"] = dashboardExport;
