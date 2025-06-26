
import { supabase } from '@/integrations/supabase/client';
import { GlobalTransaction } from '@/contexts/GlobalTransactionContext';

export interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  verified: boolean;
  cat_balance: number;
  total_cat_issued: number;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company_id: string;
  verified: boolean;
  cat_balance: number;
  created_at: string;
  updated_at: string;
}

export interface CATToken {
  id: string;
  company_id: string;
  amount: number;
  purpose: string;
  issued_by?: string;
  tx_hash?: string;
  block_number?: string;
  gas_used?: string;
  gas_price?: string;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface CATRequest {
  id: string;
  company_id: string;
  requested_amount: number;
  purpose: string;
  business_justification?: string;
  requested_by?: string;
  reviewed_by?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Loan {
  id: string;
  vendor_id: string;
  company_id: string;
  amount: number;
  interest_rate?: number;
  term_months?: number;
  purpose?: string;
  collateral_cat_amount?: number;
  status: 'active' | 'completed' | 'defaulted' | 'disputed';
  disbursed_at?: string;
  due_date?: string;
  repaid_amount: number;
  dispute_reason?: string;
  created_at: string;
  updated_at: string;
}

// Company operations
export const companyService = {
  async getAll() {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Company[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Company;
  },

  async updateBalance(id: string, amount: number) {
    const { error } = await supabase
      .from('companies')
      .update({ 
        cat_balance: amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Vendor operations
export const vendorService = {
  async getAll() {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Vendor[];
  },

  async getByCompany(companyId: string) {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Vendor[];
  }
};

// CAT Token operations
export const catTokenService = {
  async create(tokenData: Omit<CATToken, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('cat_tokens')
      .insert([tokenData])
      .select()
      .single();
    
    if (error) throw error;
    return data as CATToken;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('cat_tokens')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as CATToken[];
  },

  async getByCompany(companyId: string) {
    const { data, error } = await supabase
      .from('cat_tokens')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as CATToken[];
  }
};

// CAT Request operations
export const catRequestService = {
  async create(requestData: Omit<CATRequest, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('cat_requests')
      .insert([requestData])
      .select()
      .single();
    
    if (error) throw error;
    return data as CATRequest;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('cat_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as CATRequest[];
  },

  async updateStatus(id: string, status: CATRequest['status'], adminNotes?: string) {
    const { error } = await supabase
      .from('cat_requests')
      .update({ 
        status, 
        admin_notes: adminNotes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Loan operations
export const loanService = {
  async getAll() {
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Loan[];
  },

  async getByStatus(status: Loan['status']) {
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Loan[];
  }
};

// Transaction operations
export const transactionService = {
  async create(transactionData: {
    type: string;
    amount: number;
    from_user_id?: string;
    to_user_id?: string;
    from_company_id?: string;
    to_company_id?: string;
    from_vendor_id?: string;
    to_vendor_id?: string;
    purpose?: string;
    tx_hash?: string;
    block_number?: string;
    gas_used?: string;
    gas_price?: string;
    status?: 'pending' | 'confirmed' | 'failed';
    metadata?: any;
  }) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transactionData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getRecent(limit: number = 10) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
};
