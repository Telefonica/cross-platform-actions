"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formattedNow = void 0;
function formattedNow() {
    // Format YYYY-MM-DDTHH:MM
    return new Date().toJSON().slice(0, 16);
}
exports.formattedNow = formattedNow;
