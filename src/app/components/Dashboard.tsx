"use client";

import { Box, Button, Container, Typography, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { getShipmentList, addShipment, updateShipmentStatus } from '../utils/api';
import ShipmentDetails from './ShipmentDetails';
import StatusBadge from './StatusBadge';

import { Shipment, ShipmentStatus, ViewModes } from '../utils/types';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'origin', headerName: 'Origin', width: 150 },
  { field: 'destination', headerName: 'Destination', width: 150 },
  { field: 'carrier', headerName: 'Carrier', width: 150 },
  { field: 'shipDate', headerName: 'Ship Date', width: 150 },
  { field: 'eta', headerName: 'ETA', width: 150 },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
    renderCell: (params) => <StatusBadge status={params.value} />,
  },
];

export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [rows, setRows] = useState<{ id: number; origin: string; destination: string; carrier: string; status: string; shipDate: string; eta: string; }[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [refresh, setRefresh] = useState(false);

  const handleSubmitShipment = async (shipment: Shipment) => {
    try {
      shipment.shipDate = new Date(shipment.shipDate).toISOString();
      shipment.eta = new Date(shipment.eta).toISOString();
      shipment.status = Number(shipment.status);

      const viewMode = shipment.id ? ViewModes.Update : ViewModes.Add; 
      if (viewMode === ViewModes.Add) {
        await addShipment(shipment);
      } else 
        await updateShipmentStatus(shipment.id, shipment.status);
      
      setRefresh(true);
    } catch (error) {
      console.error('Failed to fetch shipment:', error);
    }
  };

  const handleRowClick = (params: GridRowParams) => {
    const shipment = shipments.find((_, index) => index + 1 === params.id);
    if (shipment) {
      let selectedRow = params.row as Shipment;
      selectedRow = { ...selectedRow, status: getShipmentStatus(selectedRow.status.toString()) ?? ShipmentStatus.Pending };

      setSelectedShipment(selectedRow);
      setIsDialogOpen(true);
    }
  };

  function getShipmentStatus(status: string): ShipmentStatus | null {
    return Object.keys(ShipmentStatus).includes(status) 
        ? ShipmentStatus[status as keyof typeof ShipmentStatus] 
        : null;
  }

  useEffect(() => {
    const getData = (async () => {
      try {
        const data = await getShipmentList();
        setShipments(data);

        const list = data.map((shipment, index) => ({
          id: index + 1,
          origin: shipment.origin,
          destination: shipment.destination,
          carrier: shipment.carrier,
          status: ShipmentStatus[shipment.status],
          shipDate: shipment.shipDate ? new Date(shipment.shipDate).toISOString().split('T')[0] : '',
          eta: shipment.eta ? new Date(shipment.eta).toISOString().split('T')[0] : '',
        }));
        setRows(list);

        setRefresh(false); // Reset refresh state after fetching data
      } catch (error) {
        console.error('Failed to fetch shipments:', error);
      }
    });

    getData();
  }, [refresh]);

  return (
    <Container>
      <Box mt={4}>
        <Box mt={4} display="flex" flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between" alignItems={isMobile ? 'stretch' : 'center'} gap={isMobile ? 2 : 0}>
          <Typography variant="h4" component="h1" gutterBottom textAlign={isMobile ? 'center' : 'left'}>
            Shipment Dashboard
          </Typography>
          <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={isMobile ? 2 : 1}>
            <Button variant="outlined" color="primary" onClick={() => setRefresh(true)}>
              Refresh List
            </Button>
            <Button variant="outlined" color="primary" onClick={() => {
              const newShipment = { id: 0,
                origin: '',
                destination: '',
                carrier: '',
                shipDate: new Date().toISOString().split('T')[0],
                eta: new Date().toISOString().split('T')[0],
                status: ShipmentStatus.Pending, 
              }              

              setSelectedShipment(newShipment);
              setIsDialogOpen(true);

            }}>
              Add Shipment
            </Button>
          </Box>
        </Box>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            }
          }}
          pagination
          pageSizeOptions={[5, 10, 20]}
          onRowClick={handleRowClick}
        />
      </Box>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Shipment Details</DialogTitle>
        <DialogContent>
          <ShipmentDetails
            onSubmit={(newShipment) => {
              handleSubmitShipment(newShipment);
              setIsDialogOpen(false);
            }}
            shipment={selectedShipment || { id: 0, origin: '', destination: '', carrier: '', shipDate: new Date(), eta: new Date(), status: ShipmentStatus.Pending }} // Pass the selected shipment to the component
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
