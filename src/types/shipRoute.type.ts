export default interface ShipRoutePayload {
    id?: number;
    shipId: number;
    fromPortId: number;
    toPortId: number;
    shipScheduleId?: number | null;
    status?: boolean;
}