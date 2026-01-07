"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const country_service_1 = require("./country.service");
const country_repository_1 = __importDefault(require("./country.repository"));
const responseHandler_1 = require("../../utils/responseHandler");
const withTransaction_1 = __importDefault(require("../../middleware/transactions/withTransaction"));
const countryService = new country_service_1.CountryService(country_repository_1.default);
class CountryController {
    constructor() {
        this.createCountry = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const { name, status, isoCode, ports, zone, isShippingCountry } = req.body;
                const payload = {
                    name,
                    status,
                    isoCode,
                    ports,
                    zone,
                    isShippingCountry,
                };
                const country = await countryService.createCountry(payload);
                const resDoc = (0, responseHandler_1.responseHandler)(201, 'Country Created successfully', country);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.getAllCountry = async (req, res, next) => {
            try {
                const countries = await countryService.getAllCountries();
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Countries retrieved successfully', countries);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getCountryForShipping = async (req, res, next) => {
            try {
                const country = await countryService.getCountryForShipping();
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Country for shipping retrieved successfully', country);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.exportCountryData = async (req, res, next) => {
            try {
                const exportResult = await countryService.exportCountryData();
                const resDoc = (0, responseHandler_1.responseHandler)(200, 'Country data exported successfully', exportResult);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
        this.getCountryWithPagination = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const payload = { page, limit };
            const countries = await countryService.getCountryWithPagination(payload, tx);
            const resDoc = (0, responseHandler_1.responseHandler)(200, 'Countries retrieved successfully with pagination', countries);
            res.status(resDoc.statusCode).json(resDoc);
        });
        this.updateCountry = (0, withTransaction_1.default)(async (req, res, next, tx) => {
            try {
                const id = parseInt(req.params.id, 10);
                const { name, status, isoCode, ports, zone, isShippingCountry } = req.body;
                const payload = {
                    name,
                    status,
                    isoCode,
                    ports,
                    zone,
                    isShippingCountry,
                };
                // Implement update logic here using countryService
                const updatedCountry = await countryService.updateCountry(id, payload, tx);
                const resDoc = (0, responseHandler_1.responseHandler)(200, `Country with id ${id} updated successfully`, updatedCountry);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteCountry = async (req, res, next) => {
            try {
                const id = parseInt(req.params.id, 10);
                // Implement delete logic here using countryService
                await countryService.deleteCountry(id);
                const resDoc = (0, responseHandler_1.responseHandler)(200, `Country with id ${id} deleted successfully`, null);
                res.status(resDoc.statusCode).json(resDoc);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = new CountryController();
