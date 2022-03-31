"use strict";
exports.__esModule = true;
function replaceObj(original, replacer) {
    var string_obj = JSON.stringify(original);
    for (var key in replacer) {
        string_obj = string_obj.replace(new RegExp(key, "g"), replacer[key]);
    }
    return JSON.parse(string_obj);
}
exports["default"] = replaceObj;
