"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = void 0;
const config_1 = __importDefault(require("../config/config"));
const sendSMS = async (smsOptions) => {
    const messageType = 'text';
    const url = `${config_1.default.smsUrl}?api_key=${config_1.default.smsKey}&type=${messageType}&phone=${smsOptions.phoneNumber}&senderid=${config_1.default.smsSenderId}&message=${smsOptions.message}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error:', error.message);
        return { error: error.message };
    }
};
exports.sendSMS = sendSMS;
