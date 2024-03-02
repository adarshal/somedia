"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require('dotenv').config();
const error_1 = require("./middleware/error");
exports.app = (0, express_1.default)();
const whitelist = process.env.ORIGINS ? process.env.ORIGINS.split(',') : [];
console.log(whitelist);
const options = {
    origin: whitelist,
    credentials: true
};
exports.app.use((0, cors_1.default)(options));
//body parser
exports.app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_1.default.json());
//enable CORS
// const whitelist = process.env.ORIGINS;
// var corsOptions = {
//     origin: function (origin:any, callback:any) {
//         if (!!whitelist.filter((wl:any)=> wl === origin).length) {
//             return callback(null, true);
//             }
//             else{
//                 console.log('Origin is not allowed')
//                 return callback('Origin is not allowed');
//                 }
//                 },
//   }
// app.use(cors(corsOptions));;
//uses router this router need to be used after passport so rotes can use paaport
exports.app.use('/', require('./routes')); // /router.index.js can also used bu ir directly fect index so used it
exports.app.all('*', (req, res, next) => {
    const err = new Error(`Router address ${req.originalUrl} not found `);
    err.statusCode = 404;
    next(err);
}); //1.12.39
exports.app.use(error_1.errorMiddleware);
