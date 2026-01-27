
export default interface ContainerPayload {
  name: string;
  code?: string;
    description?: string;
    lengthFt?: number;
    heightFt?: number;
    widthFt?: number;
    internalVolumeCbm?: number;
    maxPayloadKg?: number;
    tareWeightKg?: number;
    containerClass?: 'DRY' | 'HIGH_CUBE' | 'REEFER' | 'OPEN_TOP' | 'FLAT_RACK';
    isReefer?: boolean;
    isHazmatAllowed?: boolean;
    isActive?: boolean;
}
