"use server"

import { Shipment, ShipmentStatus } from "./types";

const API_URL = process.env.API_URL || 'http://localhost:5248/api';

export const getShipmentList = async (): Promise<Shipment[]> => {
  const response = await fetch(`${API_URL}/Shipments`);
  if (!response.ok) {
    throw new Error('Failed to fetch shipment list');
  }
  return await response.json();
};

export const addShipment = async (shipment: Shipment) => {
  const response = await fetch(`${API_URL}/Shipments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shipment),
  });
  if (!response.ok) {
    throw new Error('Failed to add shipment');
  }
  return await response.json();
};

export const updateShipmentStatus = async (id: number, status: ShipmentStatus) => {
  const statusString = Number(status).toString()

  const response = await fetch(`${API_URL}/Shipments/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: statusString,
  });

  if (!response.ok) {
    throw new Error('Failed to update shipment status');
  }
  return await response.text();
};
