export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cat_requests: {
        Row: {
          admin_notes: string | null
          business_justification: string | null
          company_id: string | null
          created_at: string | null
          id: string
          purpose: string
          requested_amount: number
          requested_by: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["request_status"] | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          business_justification?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          purpose: string
          requested_amount: number
          requested_by?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          business_justification?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          purpose?: string
          requested_amount?: number
          requested_by?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cat_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      cat_tokens: {
        Row: {
          amount: number
          block_number: string | null
          company_id: string | null
          created_at: string | null
          gas_price: string | null
          gas_used: string | null
          id: string
          issued_by: string | null
          purpose: string
          status: Database["public"]["Enums"]["transaction_status"] | null
          tx_hash: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          block_number?: string | null
          company_id?: string | null
          created_at?: string | null
          gas_price?: string | null
          gas_used?: string | null
          id?: string
          issued_by?: string | null
          purpose: string
          status?: Database["public"]["Enums"]["transaction_status"] | null
          tx_hash?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          block_number?: string | null
          company_id?: string | null
          created_at?: string | null
          gas_price?: string | null
          gas_used?: string | null
          id?: string
          issued_by?: string | null
          purpose?: string
          status?: Database["public"]["Enums"]["transaction_status"] | null
          tx_hash?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cat_tokens_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          cat_balance: number | null
          created_at: string | null
          email: string
          gst_number: string | null
          id: string
          name: string
          pan_number: string | null
          phone: string | null
          registration_number: string | null
          total_cat_issued: number | null
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          address?: string | null
          cat_balance?: number | null
          created_at?: string | null
          email: string
          gst_number?: string | null
          id?: string
          name: string
          pan_number?: string | null
          phone?: string | null
          registration_number?: string | null
          total_cat_issued?: number | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          address?: string | null
          cat_balance?: number | null
          created_at?: string | null
          email?: string
          gst_number?: string | null
          id?: string
          name?: string
          pan_number?: string | null
          phone?: string | null
          registration_number?: string | null
          total_cat_issued?: number | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      loans: {
        Row: {
          amount: number
          collateral_cat_amount: number | null
          company_id: string | null
          created_at: string | null
          disbursed_at: string | null
          dispute_reason: string | null
          due_date: string | null
          id: string
          interest_rate: number | null
          purpose: string | null
          repaid_amount: number | null
          status: Database["public"]["Enums"]["loan_status"] | null
          term_months: number | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          amount: number
          collateral_cat_amount?: number | null
          company_id?: string | null
          created_at?: string | null
          disbursed_at?: string | null
          dispute_reason?: string | null
          due_date?: string | null
          id?: string
          interest_rate?: number | null
          purpose?: string | null
          repaid_amount?: number | null
          status?: Database["public"]["Enums"]["loan_status"] | null
          term_months?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          collateral_cat_amount?: number | null
          company_id?: string | null
          created_at?: string | null
          disbursed_at?: string | null
          dispute_reason?: string | null
          due_date?: string | null
          id?: string
          interest_rate?: number | null
          purpose?: string | null
          repaid_amount?: number | null
          status?: Database["public"]["Enums"]["loan_status"] | null
          term_months?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          company_name: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          block_number: string | null
          created_at: string | null
          from_company_id: string | null
          from_user_id: string | null
          from_vendor_id: string | null
          gas_price: string | null
          gas_used: string | null
          id: string
          metadata: Json | null
          purpose: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          to_company_id: string | null
          to_user_id: string | null
          to_vendor_id: string | null
          tx_hash: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          block_number?: string | null
          created_at?: string | null
          from_company_id?: string | null
          from_user_id?: string | null
          from_vendor_id?: string | null
          gas_price?: string | null
          gas_used?: string | null
          id?: string
          metadata?: Json | null
          purpose?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          to_company_id?: string | null
          to_user_id?: string | null
          to_vendor_id?: string | null
          tx_hash?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          block_number?: string | null
          created_at?: string | null
          from_company_id?: string | null
          from_user_id?: string | null
          from_vendor_id?: string | null
          gas_price?: string | null
          gas_used?: string | null
          id?: string
          metadata?: Json | null
          purpose?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          to_company_id?: string | null
          to_user_id?: string | null
          to_vendor_id?: string | null
          tx_hash?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_from_company_id_fkey"
            columns: ["from_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_from_vendor_id_fkey"
            columns: ["from_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_to_company_id_fkey"
            columns: ["to_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_to_vendor_id_fkey"
            columns: ["to_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          cat_balance: number | null
          company_id: string | null
          created_at: string | null
          email: string
          gst_number: string | null
          id: string
          name: string
          pan_number: string | null
          phone: string | null
          registration_number: string | null
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          address?: string | null
          cat_balance?: number | null
          company_id?: string | null
          created_at?: string | null
          email: string
          gst_number?: string | null
          id?: string
          name: string
          pan_number?: string | null
          phone?: string | null
          registration_number?: string | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          address?: string | null
          cat_balance?: number | null
          company_id?: string | null
          created_at?: string | null
          email?: string
          gst_number?: string | null
          id?: string
          name?: string
          pan_number?: string | null
          phone?: string | null
          registration_number?: string | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      loan_status: "active" | "completed" | "defaulted" | "disputed"
      request_status: "pending" | "approved" | "rejected"
      transaction_status: "pending" | "confirmed" | "failed"
      user_role: "bank" | "company" | "vendor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      loan_status: ["active", "completed", "defaulted", "disputed"],
      request_status: ["pending", "approved", "rejected"],
      transaction_status: ["pending", "confirmed", "failed"],
      user_role: ["bank", "company", "vendor"],
    },
  },
} as const
