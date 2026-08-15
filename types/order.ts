export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Ready"
  | "Out for Delivery"
  | "Delivered"
  | "Picked Up"
  | "Cancelled";

export type OrderType = "Delivery" | "Pickup";
export type PaymentMethod = "Cash on Delivery";
export type PaymentStatus = "Pending" | "Paid" | "Refunded";

export interface OrderItemOption {
  groupName: string;
  choiceName: string;
  price: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  image: string;
  basePrice: number;
  selectedOptions: OrderItemOption[];
  optionTotal: number;
  quantity: number;
  finalUnitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
}

export interface Order {
  orderId: string; // e.g. JACK-20260731-001
  customerId?: string;
  customerName: string;
  phone: string;
  email?: string;
  branchId: string;
  orderType: OrderType;
  deliveryAddress?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: number;
  updatedAt: number;
}
