export type AdminNotificationType =
  | 'PATIENT_CREATED'
  | 'APPOINTMENT_CREATED'
  | 'APPOINTMENT_UPDATED'
  | 'APPOINTMENT_APPROVED'
  | 'APPOINTMENT_CANCELLED'
  | 'BILL_CREATED'
  | 'BILL_PAID'
  | 'ROOM_ASSIGNED'
  | 'ROOM_RELEASED';

export type AdminNotificationPayload = {
  id: string;
  type: AdminNotificationType;
  title: string;
  message: string;
  href?: string;
  createdAt: string;
  entity?: {
    type: 'patient' | 'appointment' | 'bill' | 'room';
    id?: number;
  };
};

export type CreateAdminNotificationPayload = Omit<
  AdminNotificationPayload,
  'id' | 'createdAt'
>;