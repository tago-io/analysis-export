"use strict";
exports.__esModule = true;
exports.parseTagoObject = void 0;
function parseTagoObject(body, serie) {
    if (!serie) {
        serie = String(new Date().getTime());
    }
    return Object.keys(body)
        .map(function (item) {
        return {
            variable: item,
            value: body[item] instanceof Object ? body[item].value : body[item],
            serie: serie,
            time: body[item] instanceof Object ? body[item].time : null,
            location: body[item] instanceof Object ? body[item].location : null,
            metadata: body[item] instanceof Object ? body[item].metadata : null
        };
    })
        .filter(function (item) { return item.value !== null && item.value !== undefined; });
}
exports.parseTagoObject = parseTagoObject;
