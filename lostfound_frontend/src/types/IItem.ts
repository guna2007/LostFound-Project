export interface IItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  status: 'LOST' | 'FOUND';
  is_flagged: boolean;
  ai_category: string;
  reporter_id: string;
  location?: string;
  date?: string; // ISO date string for lost/found date
  contact_info?: string;
  flagged_reason?: string;
}

export interface IItemCreate {
  title: string;
  description: string;
  image_url: string;
  status: 'LOST' | 'FOUND';
  ai_category: string;
  reporter_id: string;
  is_flagged?: boolean;
  location?: string;
  date?: string;
  contact_info?: string;
  flagged_reason?: string;
}

export interface IAdminAction {
  id: number;
  item_id: number;
  admin_id: number;
  action: 'APPROVE' | 'REJECT';
  timestamp: string;
}


