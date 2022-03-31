"use strict";
exports.__esModule = true;
function validation(validation_var, device, show_markdown) {
    return function _(message, type) {
        if (!message || !type) {
            throw "Missing message or type";
        }
        device.sendData({
            variable: validation_var,
            value: message,
            metadata: {
                type: ["success", "danger", "warning"].includes(type) ? type : null,
                color: !["success", "danger", "warning"].includes(type) ? type : null,
                show_markdown: show_markdown
            }
        });
        return message;
    };
}
exports["default"] = validation;
