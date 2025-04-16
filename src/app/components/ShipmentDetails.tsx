"use client";

import { Box, Button, Container, MenuItem, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Shipment, ShipmentStatus, ViewModes } from '../utils/types';

interface ShipmentDetailsProps {
  onSubmit: (shipment: Shipment) => void;
  shipment: Shipment;
}

export default function ShipmentDetails({ onSubmit, shipment }: ShipmentDetailsProps) {
  const [formData, setFormData] = useState<Shipment>({
    id: 0,
    origin: '', 
    destination: '',
    carrier: '',
    shipDate: new Date(),
    eta: new Date(),
    status: ShipmentStatus.Pending, 
  });

  const viewMode = shipment.id ? ViewModes.Update : ViewModes.Add; 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  useEffect(() => {
    setFormData(shipment);
  }, [shipment]);

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          {viewMode === ViewModes.Add ? 'Add' : 'Update'} Shipment
        </Typography>
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="id" value={formData.id} />
          <TextField
            label="Origin"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            slotProps={{ input: { readOnly: viewMode === ViewModes.Update } }}
          />
          <TextField
            label="Destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            slotProps={{ input: { readOnly: viewMode === ViewModes.Update } }}
          />
          <TextField
            label="Carrier"
            name="carrier"
            value={formData.carrier}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            slotProps={{ input: { readOnly: viewMode === ViewModes.Update } }}
          />
          <TextField
            label="Ship Date"
            name="shipDate"
            id="shipDate"
            type="date"
            value={formData.shipDate}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            slotProps={{ input: { readOnly: viewMode === ViewModes.Update }, inputLabel: { shrink: true } }}
          />
          <TextField
            label="ETA"
            name="eta"
            id='eta'
            type="date"
            value={formData.eta}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            slotProps={{ input: { readOnly: viewMode === ViewModes.Update }, inputLabel: { shrink: true } }}
          />
          <TextField
            select
            label="Status"
            name="status"
            value={formData.status || ''}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          >
            <MenuItem value="">{"Select"}</MenuItem>
            <MenuItem value="0">Pending</MenuItem>
            <MenuItem value="1">Shipped</MenuItem>
            <MenuItem value="2">Delivered</MenuItem>
            <MenuItem value="3">Cancelled</MenuItem>
          
          </TextField>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
}
