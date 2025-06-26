
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums for better type safety
CREATE TYPE public.user_role AS ENUM ('bank', 'company', 'vendor');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'confirmed', 'failed');
CREATE TYPE public.loan_status AS ENUM ('active', 'completed', 'defaulted', 'disputed');
CREATE TYPE public.request_status AS ENUM ('pending', 'approved', 'rejected');

-- Create profiles table to extend auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL,
  company_name TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  registration_number TEXT,
  gst_number TEXT,
  pan_number TEXT,
  verified BOOLEAN DEFAULT FALSE,
  cat_balance DECIMAL(15,2) DEFAULT 0,
  total_cat_issued DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendors table
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  registration_number TEXT,
  gst_number TEXT,
  pan_number TEXT,
  verified BOOLEAN DEFAULT FALSE,
  cat_balance DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CAT tokens table
CREATE TABLE public.cat_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  purpose TEXT NOT NULL,
  issued_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tx_hash TEXT,
  block_number TEXT,
  gas_used TEXT,
  gas_price TEXT,
  status transaction_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CAT requests table
CREATE TABLE public.cat_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  requested_amount DECIMAL(15,2) NOT NULL,
  purpose TEXT NOT NULL,
  business_justification TEXT,
  requested_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status request_status DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create loans table
CREATE TABLE public.loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  interest_rate DECIMAL(5,2),
  term_months INTEGER,
  purpose TEXT,
  collateral_cat_amount DECIMAL(15,2),
  status loan_status DEFAULT 'active',
  disbursed_at TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  repaid_amount DECIMAL(15,2) DEFAULT 0,
  dispute_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table for comprehensive transaction tracking
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'token_issue', 'token_transfer', 'token_received', 'loan_disbursement', etc.
  amount DECIMAL(15,2) NOT NULL,
  from_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  to_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  from_company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  to_company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  from_vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  to_vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  purpose TEXT,
  tx_hash TEXT,
  block_number TEXT,
  gas_used TEXT,
  gas_price TEXT,
  status transaction_status DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cat_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cat_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Banks can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'bank'
    )
  );

-- Create RLS policies for companies
CREATE POLICY "Banks can manage all companies" ON public.companies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'bank'
    )
  );

CREATE POLICY "Company users can view their company" ON public.companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'company' AND company_name = companies.name
    )
  );

-- Create RLS policies for vendors
CREATE POLICY "Banks and companies can view vendors" ON public.vendors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      LEFT JOIN public.companies c ON p.company_name = c.name
      WHERE p.id = auth.uid() 
      AND (p.role = 'bank' OR (p.role = 'company' AND c.id = vendors.company_id))
    )
  );

CREATE POLICY "Companies can manage their vendors" ON public.vendors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      LEFT JOIN public.companies c ON p.company_name = c.name
      WHERE p.id = auth.uid() AND p.role = 'company' AND c.id = vendors.company_id
    )
  );

CREATE POLICY "Vendors can view themselves" ON public.vendors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'vendor' AND email = vendors.email
    )
  );

-- Create RLS policies for CAT tokens
CREATE POLICY "Banks can manage all CAT tokens" ON public.cat_tokens
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'bank'
    )
  );

CREATE POLICY "Companies can view their CAT tokens" ON public.cat_tokens
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      LEFT JOIN public.companies c ON p.company_name = c.name
      WHERE p.id = auth.uid() AND p.role = 'company' AND c.id = cat_tokens.company_id
    )
  );

-- Create RLS policies for CAT requests
CREATE POLICY "Banks can manage all CAT requests" ON public.cat_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'bank'
    )
  );

CREATE POLICY "Companies can manage their CAT requests" ON public.cat_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      LEFT JOIN public.companies c ON p.company_name = c.name
      WHERE p.id = auth.uid() AND p.role = 'company' AND c.id = cat_requests.company_id
    )
  );

-- Create RLS policies for loans
CREATE POLICY "Banks can view all loans" ON public.loans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'bank'
    )
  );

CREATE POLICY "Companies can view their loans" ON public.loans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      LEFT JOIN public.companies c ON p.company_name = c.name
      WHERE p.id = auth.uid() AND p.role = 'company' AND c.id = loans.company_id
    )
  );

CREATE POLICY "Vendors can view their loans" ON public.loans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      LEFT JOIN public.vendors v ON p.email = v.email
      WHERE p.id = auth.uid() AND p.role = 'vendor' AND v.id = loans.vendor_id
    )
  );

-- Create RLS policies for transactions
CREATE POLICY "Banks can view all transactions" ON public.transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'bank'
    )
  );

CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (
    auth.uid() = from_user_id OR auth.uid() = to_user_id
  );

CREATE POLICY "Companies can view their transactions" ON public.transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      LEFT JOIN public.companies c ON p.company_name = c.name
      WHERE p.id = auth.uid() AND p.role = 'company' 
      AND (c.id = from_company_id OR c.id = to_company_id)
    )
  );

-- Create storage policies for documents
CREATE POLICY "Users can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, company_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'company'),
    COALESCE(NEW.raw_user_meta_data->>'company_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for all tables
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.companies REPLICA IDENTITY FULL;
ALTER TABLE public.vendors REPLICA IDENTITY FULL;
ALTER TABLE public.cat_tokens REPLICA IDENTITY FULL;
ALTER TABLE public.cat_requests REPLICA IDENTITY FULL;
ALTER TABLE public.loans REPLICA IDENTITY FULL;
ALTER TABLE public.transactions REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.companies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vendors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cat_tokens;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cat_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.loans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;

-- Insert sample data for testing
INSERT INTO public.companies (name, email, phone, address, verified, cat_balance, total_cat_issued) VALUES
('TechCorp Industries', 'finance@techcorp.com', '+91-9876543210', '123 Tech Street, Mumbai, India', true, 5000000.00, 7500000.00),
('Manufacturing Inc', 'accounts@manufacturing.com', '+91-9876543211', '456 Factory Road, Delhi, India', true, 2500000.00, 5000000.00),
('Retail Solutions', 'finance@retail.com', '+91-9876543212', '789 Market Plaza, Bangalore, India', true, 1000000.00, 2500000.00);

-- Insert sample vendors
INSERT INTO public.vendors (name, email, phone, address, company_id, verified, cat_balance) VALUES
('Steel Supplies Co', 'vendor@supplies.com', '+91-9876543213', '321 Industrial Area, Chennai, India', 
 (SELECT id FROM public.companies WHERE name = 'TechCorp Industries'), true, 500000.00),
('Electronics Hub', 'contact@electronics.com', '+91-9876543214', '654 Tech Park, Hyderabad, India',
 (SELECT id FROM public.companies WHERE name = 'TechCorp Industries'), true, 300000.00),
('Raw Materials Ltd', 'info@rawmaterials.com', '+91-9876543215', '987 Supply Chain Blvd, Pune, India',
 (SELECT id FROM public.companies WHERE name = 'Manufacturing Inc'), true, 750000.00);
