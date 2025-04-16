import { Chip } from '@mui/material';
import { ShipmentStatus } from '../utils/types';

interface StatusBadgeProps {
  status: ShipmentStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getColor = () => {
    switch (status) {
      case ShipmentStatus.Pending:
        return 'warning';
      case ShipmentStatus.Shipped:
        return 'info';
      case ShipmentStatus.Delivered:
        return 'success';
      case ShipmentStatus.Cancelled:
        return 'error';
      default:
        return 'default';
    }
  };

  return <Chip label={status} color={getColor()} />;
}
