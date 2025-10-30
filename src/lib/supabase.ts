import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  wallet_address: string | null;
  email: string | null;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  free_scans_used: number;
  total_scans: number;
  created_at: string;
  updated_at: string;
};

export type ContractScan = {
  id: string;
  user_id: string;
  contract_name: string;
  contract_code: string;
  scan_type: 'file_upload' | 'github_repo' | 'deployed_contract';
  source_url: string | null;
  status: 'pending' | 'scanning' | 'completed' | 'failed';
  vulnerability_count: number;
  risk_score: number;
  vulnerabilities: any[];
  recommendations: any[];
  scan_duration: number | null;
  is_paid: boolean;
  created_at: string;
};

export type MonitoredContract = {
  id: string;
  user_id: string;
  contract_address: string;
  contract_name: string;
  network: 'polygon' | 'ethereum' | 'bsc' | 'avalanche';
  is_active: boolean;
  alert_threshold: number;
  last_checked: string;
  alerts_count: number;
  created_at: string;
};

export type SecurityAlert = {
  id: string;
  contract_id: string;
  user_id: string;
  alert_type: 'suspicious_transaction' | 'vulnerability_detected' | 'anomaly';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  transaction_hash: string | null;
  is_read: boolean;
  created_at: string;
};

export type Payment = {
  id: string;
  user_id: string;
  amount: number;
  currency: 'USD' | 'MATIC' | 'ETH';
  payment_type: 'scan' | 'subscription' | 'topup';
  transaction_hash: string | null;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
};
