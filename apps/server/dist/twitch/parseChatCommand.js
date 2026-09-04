"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseChatCommand = parseChatCommand;
function parseChatCommand(message) {
    const trimmed = message.trim()
        .toLowerCase();
    if (trimmed === "!join") {
        return {
            type: "JOIN_GAME",
        };
    }
    if (trimmed.startsWith("!")) {
        return {
            type: "CHAT_MESSAGE",
            payload: {
                message: trimmed,
            },
        };
    }
    return null;
}
