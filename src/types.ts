export interface UserData {
  id: string;
  name: string;
  phone: string;
  problem?: string;
  address?: string;
  preferredTime?: string;
  timestamp: Date;
  type: 'ticket' | 'schedule' | 'human';
  status: 'pending' | 'in_progress' | 'completed';
  protocol: string;
}

export interface FlowNode {
  message: string;
  options?: { label: string; next: string }[];
  requiresInput?: boolean;
  inputPlaceholder?: string;
}

export interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
  options?: { label: string; next: string }[];
}