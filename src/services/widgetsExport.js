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
exports.insertWidgets = exports.removeAllWidgets = void 0;
var replaceObj_1 = require("../lib/replaceObj");
function insertWidgets(account, import_account, dashboard, target, export_holder) {
    return __awaiter(this, void 0, void 0, function () {
        var widget_ids, widgets, hidden_tabs, arrangement, new_arrangement, widget_holder, _loop_1, _i, arrangement_1, widget_arrangement;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    widget_ids = dashboard.arrangement.map(function (x) { return x.widget_id; });
                    return [4 /*yield*/, Promise.all(widget_ids.map(function (x) { return account.dashboards.widgets.info(dashboard.id, x); }))];
                case 1:
                    widgets = _a.sent();
                    hidden_tabs = dashboard.tabs.filter(function (tab) { return !tab.hidden; }).map(function (tab) { return tab.key; });
                    arrangement = dashboard.arrangement.sort(function (a) { return (hidden_tabs.includes(a.tab) ? 1 : -1); });
                    new_arrangement = [];
                    widget_holder = {};
                    _loop_1 = function (widget_arrangement) {
                        var widget, new_widget, new_id;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    widget = widgets.find(function (wdgt) { return widget_arrangement.widget_id === wdgt.id; });
                                    new_widget = (0, replaceObj_1["default"])(widget, __assign(__assign(__assign({}, export_holder.analysis), export_holder.devices), widget_holder));
                                    if (new_widget.data) {
                                        new_widget.data = new_widget.data.map(function (x) {
                                            if (x.qty) {
                                                x.qty = Number(x.qty);
                                            }
                                            return x;
                                        });
                                    }
                                    return [4 /*yield*/, import_account.dashboards.widgets.create(target.id, new_widget)];
                                case 1:
                                    new_id = (_b.sent()).widget;
                                    new_arrangement.push(__assign(__assign({}, widget_arrangement), { widget_id: new_id }));
                                    widget_holder[widget.id] = new_id;
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, arrangement_1 = arrangement;
                    _a.label = 2;
                case 2:
                    if (!(_i < arrangement_1.length)) return [3 /*break*/, 5];
                    widget_arrangement = arrangement_1[_i];
                    return [5 /*yield**/, _loop_1(widget_arrangement)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, import_account.dashboards.edit(target.id, { arrangement: new_arrangement })];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.insertWidgets = insertWidgets;
function removeAllWidgets(import_account, dashboard) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(dashboard.arrangement.map(function (widget) { return import_account.dashboards.widgets["delete"](dashboard.id, widget.widget_id); }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.removeAllWidgets = removeAllWidgets;
