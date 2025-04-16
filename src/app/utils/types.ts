export enum ShipmentStatus {
  Pending, //[0] The shipment is pending and has not been shipped yet.
  Shipped, //[1] The shipment has been shipped and is in transit.
  Delivered, //[2] The shipment has been delivered to the destination.
  Cancelled, //[3] The shipment has been cancelled.
}

export enum ViewModes {
  View, 
  Add,
  Update,
}

export interface Shipment {
  id: number;
  origin: string;
  destination: string;
  carrier: string;
  shipDate: Date | string;
  eta: Date | string; 
  status: ShipmentStatus;
}