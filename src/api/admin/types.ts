export type AdminDashboardTrendPoint = {
  day: string;
  value: number;
};

export type AdminDashboardStats = {
  totalUsers: number;
  monthlyRevenue: number;
  activeServices: number;
  openComplaints: number;
  newTransactions: number;
  activeSitterShare: number;
  userGrowth: AdminDashboardTrendPoint[];
};

export type OrderStatus = 'ACTIVE' | 'COMPLETED' | 'DISPUTED' | 'CANCELLED';

export interface UserSnippet {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface AdminOrder {
  id: string;
  displayId: string;
  serviceName: string;
  serviceDetails: string;
  serviceIconType: 'WALK' | 'BOARDING' | 'SITTING' | 'TRAINING';
  client: UserSnippet;
  sitter: UserSnippet;
  dateStr: string;
  timeStr: string;
  amount: number;
  status: OrderStatus;
}

export interface ComplaintUser {
  id: string;
  name: string;
  avatarUrl?: string;
  role: 'owner' | 'sitter';
  description: string;
  isBlocked?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Evidence {
  photoUrl: string | null;
  lat: number;
  lng: number;
  distanceStatus: 'ok' | 'violation';
  distanceMeters: number;
  integrityStatus: string;
}

export interface ComplaintPhoto {
  photoUrl: string;
  timestamp: string | null;
  lat: number;
  lng: number;
  integrityStatus: string;
}

export interface AdminComplaint {
  id: string;
  bookingId?: string | null;
  ticketId: string;
  title: string;
  shortDesc: string;
  createdAt: string;
  status: 'active' | 'resolved' | 'rejected';
  owner: ComplaintUser;
  sitter: ComplaintUser;
  chatMessages: ChatMessage[];
  evidence: Evidence;
  photos: ComplaintPhoto[];
}

export interface AdminComplaintsPaginatedResponse {
  items: AdminComplaint[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export interface AdminComplaintsParams {
  page: number;
  limit: number;
  status?: 'active' | 'resolved' | 'rejected' | 'all';
  search?: string;
}

export interface AdminOrdersPaginatedResponse {
  items: AdminOrder[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export interface AdminOrdersParams {
  page: number;
  limit: number;
  status: string;
  search: string;
}

export interface ClientDetails extends UserSnippet {
  phone: string;
  address: string;
}

export interface SitterDetails extends UserSnippet {
  rating: number;
  reviewsCount: number;
}

export interface ServiceDetailedInfo {
  name: string;
  duration: string;
  petName: string;
  petBreed: string;
  date: string;
  time: string;
  totalAmount: number;
}

export interface TimelineItem {
  id: string;
  title: string;
  date: string;
  comment?: string;
  isLatest: boolean;
}

export interface DetailedAdminOrder {
  id: string;
  displayId: string;
  status: OrderStatus;
  client: ClientDetails;
  sitter: SitterDetails;
  serviceDetails: ServiceDetailedInfo;
  timeline: TimelineItem[];
  isRefunded: boolean;
  refundAmount?: number | null;
  refundComment?: string | null;
}

export interface RefundPayload {
  orderId: string;
  type: 'full' | 'partial';
  amount?: number;
  comment: string;
}
