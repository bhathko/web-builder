"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchProject = fetchProject;
const axios_1 = require("axios");
const environment = process.env.NODE_ENV || 'dev';
let API_HOST = '';
if (environment === 'dev') {
    API_HOST = 'http://localhost:3000';
}
else if (environment === 'prod') {
    API_HOST = 'https://api.example.com';
}
function fetchProject(id) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Fetching project for ID:', id);
        const url = `${API_HOST}/api/project/${id}`;
        try {
            const response = yield axios_1.default.get(url);
            console.log('Response from fetchProject:', response.data);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching project:', error);
            throw new Error('Failed to fetch project');
        }
    });
}
//# sourceMappingURL=api.handler.js.map