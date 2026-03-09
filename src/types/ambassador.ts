export interface Ambassador {
  id: string;
  auth_user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  heard_about_us: string | null;
  hospitality_connection: string | null;
  agreed_to_terms: boolean;
  status: "pending" | "approved" | "active" | "rejected";
  approval_token: string;
  referral_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  ambassador_id: string;
  referral_date: string;
  contact_name: string;
  business_name: string;
  business_type: string;
  location: string;
  client_email: string;
  phone: string | null;
  website: string | null;
  relationship: string;
  discussed_revolution: string;
  services_needed: string[];
  additional_context: string | null;
  status: "pending" | "contacted" | "in_progress" | "successful" | "unsuccessful";
  commission_amount: number | null;
  commission_paid: boolean;
  commission_paid_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AmbassadorStats {
  totalReferrals: number;
  pendingReferrals: number;
  successfulReferrals: number;
  totalCommission: number;
  paidCommission: number;
}
