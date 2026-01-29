export default interface ShipRoutePayload {
    id?: number;
    carrierCompanyId: number;
    fromPortId: number;
    toPortId: number;
    sailingDate?: any;
    arrivalDate?: any;
    shipScheduleId?: number;
    status?: boolean;
}