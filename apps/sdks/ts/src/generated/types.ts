/**
 * API Types
 * AUTO-GENERATED - Do not edit manually
 *
 * Re-exports Database types copied from apps/api.
 */

/**
 * API Types
 * 
 * This file contains only the types exposed through the API.
 * 
 * Generated from packages/shared/src/database.ts - only includes:
 * - Exposed enums (63 enums)
 * - Exposed tables (20 tables)
 * - Exposed functions (306 functions)
 * 
 * DO NOT EDIT MANUALLY - This file is auto-generated
 * Run: npm run generate:api-types
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          account_id: string
          balance: number
          created_at: string
          currency_code: APIEnums["currency_code"]
          is_spi_account: boolean
          organization_id: string
          spi_account_balance: number | null
          spi_account_balance_sync_error: string | null
          spi_account_balance_synced_at: string | null
          spi_account_number: string | null
          spi_account_status:
            | APIEnums["spi_account_status"]
            | null
          spi_account_type:
            | APIEnums["spi_account_type"]
            | null
          updated_at: string
        }
        Insert: {
          account_id?: string
          balance?: number
          created_at?: string
          currency_code?: APIEnums["currency_code"]
          is_spi_account?: boolean
          organization_id: string
          spi_account_balance?: number | null
          spi_account_balance_sync_error?: string | null
          spi_account_balance_synced_at?: string | null
          spi_account_number?: string | null
          spi_account_status?:
            | APIEnums["spi_account_status"]
            | null
          spi_account_type?:
            | APIEnums["spi_account_type"]
            | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          balance?: number
          created_at?: string
          currency_code?: APIEnums["currency_code"]
          is_spi_account?: boolean
          organization_id?: string
          spi_account_balance?: number | null
          spi_account_balance_sync_error?: string | null
          spi_account_balance_synced_at?: string | null
          spi_account_number?: string | null
          spi_account_status?:
            | APIEnums["spi_account_status"]
            | null
          spi_account_type?:
            | APIEnums["spi_account_type"]
            | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "merchant_accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organizations: {
        Row: {
          allowed_currencies: APIEnums["currency_code"][]
          api_access_suspended: boolean
          arr: number
          created_at: string
          default_currency: APIEnums["currency_code"]
          deleted_at: string | null
          email: string
          employee_number: string | null
          industry: string | null
          is_deleted: boolean
          is_starter_business: boolean
          logo_url: string | null
          merchant_lifetime_value: number
          metadata: Json | null
          mrr: number
          name: string
          organization_id: string
          payout_pin_set_at: string | null
          phone_number: string
          pin_code_hash: string | null
          pricing_plan_last_changed_at: string | null
          pricing_plan_type:
            | APIEnums["pricing_plan_type"]
            | null
          public_id: string
          radar_enabled: boolean
          slug: string | null
          status: APIEnums["organization_status"]
          storefront_enabled: boolean
          total_customers: number | null
          total_merchants: number | null
          total_revenue: number | null
          total_transactions: number | null
          updated_at: string
          verification_status: APIEnums["organization_verification_status"]
          website_url: string | null
          whatsapp_number: string | null
        }
        Insert: {
          allowed_currencies?: APIEnums["currency_code"][]
          api_access_suspended?: boolean
          arr?: number
          created_at?: string
          default_currency?: APIEnums["currency_code"]
          deleted_at?: string | null
          email: string
          employee_number?: string | null
          industry?: string | null
          is_deleted?: boolean
          is_starter_business?: boolean
          logo_url?: string | null
          merchant_lifetime_value?: number
          metadata?: Json | null
          mrr?: number
          name: string
          organization_id?: string
          payout_pin_set_at?: string | null
          phone_number: string
          pin_code_hash?: string | null
          pricing_plan_last_changed_at?: string | null
          pricing_plan_type?:
            | APIEnums["pricing_plan_type"]
            | null
          public_id?: string
          radar_enabled?: boolean
          slug?: string | null
          status?: APIEnums["organization_status"]
          storefront_enabled?: boolean
          total_customers?: number | null
          total_merchants?: number | null
          total_revenue?: number | null
          total_transactions?: number | null
          updated_at?: string
          verification_status?: APIEnums["organization_verification_status"]
          website_url?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          allowed_currencies?: APIEnums["currency_code"][]
          api_access_suspended?: boolean
          arr?: number
          created_at?: string
          default_currency?: APIEnums["currency_code"]
          deleted_at?: string | null
          email?: string
          employee_number?: string | null
          industry?: string | null
          is_deleted?: boolean
          is_starter_business?: boolean
          logo_url?: string | null
          merchant_lifetime_value?: number
          metadata?: Json | null
          mrr?: number
          name?: string
          organization_id?: string
          payout_pin_set_at?: string | null
          phone_number?: string
          pin_code_hash?: string | null
          pricing_plan_last_changed_at?: string | null
          pricing_plan_type?:
            | APIEnums["pricing_plan_type"]
            | null
          public_id?: string
          radar_enabled?: boolean
          slug?: string | null
          status?: APIEnums["organization_status"]
          storefront_enabled?: boolean
          total_customers?: number | null
          total_merchants?: number | null
          total_revenue?: number | null
          total_transactions?: number | null
          updated_at?: string
          verification_status?: APIEnums["organization_verification_status"]
          website_url?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      merchants: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          deleted_at: string | null
          email: string
          is_deleted: boolean
          merchant_id: string
          metadata: Json | null
          name: string | null
          onboarded: boolean
          onboarding_status: APIEnums["onboarding_status"]
          phone_number: string | null
          preferred_language: string
          public_id: string
          referral_code: string | null
          retry_payment_every: number | null
          subscription_notifications: Json | null
          timezone: string
          total_retries: number | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          is_deleted?: boolean
          merchant_id?: string
          metadata?: Json | null
          name?: string | null
          onboarded?: boolean
          onboarding_status?: APIEnums["onboarding_status"]
          phone_number?: string | null
          preferred_language?: string
          public_id?: string
          referral_code?: string | null
          retry_payment_every?: number | null
          subscription_notifications?: Json | null
          timezone?: string
          total_retries?: number | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          is_deleted?: boolean
          merchant_id?: string
          metadata?: Json | null
          name?: string | null
          onboarded?: boolean
          onboarding_status?: APIEnums["onboarding_status"]
          phone_number?: string | null
          preferred_language?: string
          public_id?: string
          referral_code?: string | null
          retry_payment_every?: number | null
          subscription_notifications?: Json | null
          timezone?: string
          total_retries?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          created_by: string | null
          customer_id: string
          deleted_at: string | null
          email: string | null
          environment: string
          is_business: boolean
          is_deleted: boolean
          metadata: Json | null
          name: string
          organization_id: string
          phone_number: string | null
          postal_code: string | null
          provider_customer_id: string | null
          public_id: string
          spi_alias_mbno: string | null
          spi_alias_shid: string | null
          spi_primary_alias: string | null
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string
          deleted_at?: string | null
          email?: string | null
          environment?: string
          is_business?: boolean
          is_deleted?: boolean
          metadata?: Json | null
          name: string
          organization_id: string
          phone_number?: string | null
          postal_code?: string | null
          provider_customer_id?: string | null
          public_id?: string
          spi_alias_mbno?: string | null
          spi_alias_shid?: string | null
          spi_primary_alias?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string
          deleted_at?: string | null
          email?: string | null
          environment?: string
          is_business?: boolean
          is_deleted?: boolean
          metadata?: Json | null
          name?: string
          organization_id?: string
          phone_number?: string | null
          postal_code?: string | null
          provider_customer_id?: string | null
          public_id?: string
          spi_alias_mbno?: string | null
          spi_alias_shid?: string | null
          spi_primary_alias?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "fk_customers_spi_alias_shid"
            columns: ["spi_alias_shid"]
            isOneToOne: false
            referencedRelation: "spi_account_aliases"
            referencedColumns: ["alias_id"]
          },
        ]
      }
      payment_requests: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          currency_code: APIEnums["currency_code"]
          customer_id: string | null
          description: string | null
          environment: string
          expiry_date: string
          metadata: Json | null
          organization_id: string
          payment_link: string | null
          payment_reference: string | null
          public_id: string
          request_id: string
          spi_account_number: string | null
          spi_bulk_instruction_id: string | null
          spi_confirmation: boolean
          spi_date_envoi: string | null
          spi_date_irrevocabilite: string | null
          spi_date_limite_paiement: string | null
          spi_date_limite_reponse: string | null
          spi_date_rejet: string | null
          spi_debit_differe: boolean
          spi_end2end_id: string | null
          spi_payeur_alias: string | null
          spi_payeur_nom: string | null
          spi_payeur_pays: string | null
          spi_payment_request_category:
            | APIEnums["spi_payment_request_category"]
            | null
          spi_payment_status:
            | APIEnums["spi_payment_status"]
            | null
          spi_ref_doc_numero: string | null
          spi_ref_doc_type:
            | APIEnums["spi_document_type"]
            | null
          spi_rejection_reason:
            | APIEnums["spi_rejection_reason"]
            | null
          spi_remise_amount: number | null
          spi_remise_rate: number | null
          spi_tx_id: string | null
          status: APIEnums["transaction_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          currency_code: APIEnums["currency_code"]
          customer_id?: string | null
          description?: string | null
          environment?: string
          expiry_date: string
          metadata?: Json | null
          organization_id: string
          payment_link?: string | null
          payment_reference?: string | null
          public_id?: string
          request_id?: string
          spi_account_number?: string | null
          spi_bulk_instruction_id?: string | null
          spi_confirmation?: boolean
          spi_date_envoi?: string | null
          spi_date_irrevocabilite?: string | null
          spi_date_limite_paiement?: string | null
          spi_date_limite_reponse?: string | null
          spi_date_rejet?: string | null
          spi_debit_differe?: boolean
          spi_end2end_id?: string | null
          spi_payeur_alias?: string | null
          spi_payeur_nom?: string | null
          spi_payeur_pays?: string | null
          spi_payment_request_category?:
            | APIEnums["spi_payment_request_category"]
            | null
          spi_payment_status?:
            | APIEnums["spi_payment_status"]
            | null
          spi_ref_doc_numero?: string | null
          spi_ref_doc_type?:
            | APIEnums["spi_document_type"]
            | null
          spi_rejection_reason?:
            | APIEnums["spi_rejection_reason"]
            | null
          spi_remise_amount?: number | null
          spi_remise_rate?: number | null
          spi_tx_id?: string | null
          status?: APIEnums["transaction_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          currency_code?: APIEnums["currency_code"]
          customer_id?: string | null
          description?: string | null
          environment?: string
          expiry_date?: string
          metadata?: Json | null
          organization_id?: string
          payment_link?: string | null
          payment_reference?: string | null
          public_id?: string
          request_id?: string
          spi_account_number?: string | null
          spi_bulk_instruction_id?: string | null
          spi_confirmation?: boolean
          spi_date_envoi?: string | null
          spi_date_irrevocabilite?: string | null
          spi_date_limite_paiement?: string | null
          spi_date_limite_reponse?: string | null
          spi_date_rejet?: string | null
          spi_debit_differe?: boolean
          spi_end2end_id?: string | null
          spi_payeur_alias?: string | null
          spi_payeur_nom?: string | null
          spi_payeur_pays?: string | null
          spi_payment_request_category?:
            | APIEnums["spi_payment_request_category"]
            | null
          spi_payment_status?:
            | APIEnums["spi_payment_status"]
            | null
          spi_ref_doc_numero?: string | null
          spi_ref_doc_type?:
            | APIEnums["spi_document_type"]
            | null
          spi_rejection_reason?:
            | APIEnums["spi_rejection_reason"]
            | null
          spi_remise_amount?: number | null
          spi_remise_rate?: number | null
          spi_tx_id?: string | null
          status?: APIEnums["transaction_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "payment_requests_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "payment_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "payment_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      transactions: {
        Row: {
          available_at: string | null
          checkout_session_id: string | null
          created_at: string
          currency_code: APIEnums["currency_code"]
          customer_id: string
          description: string | null
          discount_amount: number
          environment: string
          fee_amount: number
          fee_structure_id: string | null
          gross_amount: number
          held_at: string | null
          held_by: string | null
          hold_reason: string | null
          integration_source: APIEnums["integration_source"]
          is_bnpl: boolean
          is_pos: boolean
          metadata: Json | null
          net_amount: number
          organization_id: string
          payment_method_code: APIEnums["payment_method_code"]
          price_id: string | null
          product_id: string | null
          provider_code: APIEnums["provider_code"]
          public_id: string
          quantity: number
          spi_account_number: string | null
          spi_bulk_instruction_id: string | null
          spi_date_envoi: string | null
          spi_date_irrevocabilite: string | null
          spi_discount_amount: number | null
          spi_discount_rate: number | null
          spi_end2end_id: string | null
          spi_payment_category:
            | APIEnums["spi_payment_category"]
            | null
          spi_payment_flow_type:
            | APIEnums["spi_payment_flow_type"]
            | null
          spi_payment_status:
            | APIEnums["spi_payment_status"]
            | null
          spi_rejection_reason:
            | APIEnums["spi_rejection_reason"]
            | null
          spi_tx_id: string | null
          status: APIEnums["transaction_status"]
          stripe_payment_intent_id: string | null
          subscription_id: string | null
          tier_fee_id: string | null
          transaction_id: string
          transaction_type: APIEnums["transaction_type"]
          updated_at: string
        }
        Insert: {
          available_at?: string | null
          checkout_session_id?: string | null
          created_at?: string
          currency_code?: APIEnums["currency_code"]
          customer_id: string
          description?: string | null
          discount_amount?: number
          environment?: string
          fee_amount: number
          fee_structure_id?: string | null
          gross_amount: number
          held_at?: string | null
          held_by?: string | null
          hold_reason?: string | null
          integration_source?: APIEnums["integration_source"]
          is_bnpl?: boolean
          is_pos?: boolean
          metadata?: Json | null
          net_amount: number
          organization_id: string
          payment_method_code: APIEnums["payment_method_code"]
          price_id?: string | null
          product_id?: string | null
          provider_code: APIEnums["provider_code"]
          public_id?: string
          quantity?: number
          spi_account_number?: string | null
          spi_bulk_instruction_id?: string | null
          spi_date_envoi?: string | null
          spi_date_irrevocabilite?: string | null
          spi_discount_amount?: number | null
          spi_discount_rate?: number | null
          spi_end2end_id?: string | null
          spi_payment_category?:
            | APIEnums["spi_payment_category"]
            | null
          spi_payment_flow_type?:
            | APIEnums["spi_payment_flow_type"]
            | null
          spi_payment_status?:
            | APIEnums["spi_payment_status"]
            | null
          spi_rejection_reason?:
            | APIEnums["spi_rejection_reason"]
            | null
          spi_tx_id?: string | null
          status?: APIEnums["transaction_status"]
          stripe_payment_intent_id?: string | null
          subscription_id?: string | null
          tier_fee_id?: string | null
          transaction_id?: string
          transaction_type: APIEnums["transaction_type"]
          updated_at?: string
        }
        Update: {
          available_at?: string | null
          checkout_session_id?: string | null
          created_at?: string
          currency_code?: APIEnums["currency_code"]
          customer_id?: string
          description?: string | null
          discount_amount?: number
          environment?: string
          fee_amount?: number
          fee_structure_id?: string | null
          gross_amount?: number
          held_at?: string | null
          held_by?: string | null
          hold_reason?: string | null
          integration_source?: APIEnums["integration_source"]
          is_bnpl?: boolean
          is_pos?: boolean
          metadata?: Json | null
          net_amount?: number
          organization_id?: string
          payment_method_code?: APIEnums["payment_method_code"]
          price_id?: string | null
          product_id?: string | null
          provider_code?: APIEnums["provider_code"]
          public_id?: string
          quantity?: number
          spi_account_number?: string | null
          spi_bulk_instruction_id?: string | null
          spi_date_envoi?: string | null
          spi_date_irrevocabilite?: string | null
          spi_discount_amount?: number | null
          spi_discount_rate?: number | null
          spi_end2end_id?: string | null
          spi_payment_category?:
            | APIEnums["spi_payment_category"]
            | null
          spi_payment_flow_type?:
            | APIEnums["spi_payment_flow_type"]
            | null
          spi_payment_status?:
            | APIEnums["spi_payment_status"]
            | null
          spi_rejection_reason?:
            | APIEnums["spi_rejection_reason"]
            | null
          spi_tx_id?: string | null
          status?: APIEnums["transaction_status"]
          stripe_payment_intent_id?: string | null
          subscription_id?: string | null
          tier_fee_id?: string | null
          transaction_id?: string
          transaction_type?: APIEnums["transaction_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_transactions_checkout_session"
            columns: ["checkout_session_id"]
            isOneToOne: false
            referencedRelation: "checkout_sessions"
            referencedColumns: ["checkout_session_id"]
          },
          {
            foreignKeyName: "transactions_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "transactions_fee_structure_id_fkey"
            columns: ["fee_structure_id"]
            isOneToOne: false
            referencedRelation: "organization_fee_structure"
            referencedColumns: ["fee_structure_id"]
          },
          {
            foreignKeyName: "transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "transactions_payment_method_code_provider_code_fkey"
            columns: ["payment_method_code", "provider_code"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["payment_method_code", "provider_code"]
          },
          {
            foreignKeyName: "transactions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["price_id"]
          },
          {
            foreignKeyName: "transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "transactions_provider_code_fkey"
            columns: ["provider_code"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "transactions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["subscription_id"]
          },
          {
            foreignKeyName: "transactions_tier_fee_id_fkey"
            columns: ["tier_fee_id"]
            isOneToOne: false
            referencedRelation: "tier_fee_structure"
            referencedColumns: ["tier_fee_id"]
          },
        ]
      }
      refunds: {
        Row: {
          amount: number
          created_at: string
          environment: string
          fee_amount: number
          metadata: Json | null
          public_id: string
          reason: string | null
          refund_id: string
          refunded_amount: number
          spi_account_number: string | null
          spi_end2end_id: string | null
          spi_fund_return_status:
            | APIEnums["spi_payment_status"]
            | null
          spi_motif_code:
            | APIEnums["spi_rejection_reason"]
            | null
          spi_rejection_reason:
            | APIEnums["spi_rejection_reason"]
            | null
          spi_retour_date_demande: string | null
          spi_retour_date_irrevocabilite: string | null
          spi_tx_id: string | null
          status: APIEnums["refund_status"]
          transaction_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          environment?: string
          fee_amount?: number
          metadata?: Json | null
          public_id?: string
          reason?: string | null
          refund_id?: string
          refunded_amount: number
          spi_account_number?: string | null
          spi_end2end_id?: string | null
          spi_fund_return_status?:
            | APIEnums["spi_payment_status"]
            | null
          spi_motif_code?:
            | APIEnums["spi_rejection_reason"]
            | null
          spi_rejection_reason?:
            | APIEnums["spi_rejection_reason"]
            | null
          spi_retour_date_demande?: string | null
          spi_retour_date_irrevocabilite?: string | null
          spi_tx_id?: string | null
          status?: APIEnums["refund_status"]
          transaction_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          environment?: string
          fee_amount?: number
          metadata?: Json | null
          public_id?: string
          reason?: string | null
          refund_id?: string
          refunded_amount?: number
          spi_account_number?: string | null
          spi_end2end_id?: string | null
          spi_fund_return_status?:
            | APIEnums["spi_payment_status"]
            | null
          spi_motif_code?:
            | APIEnums["spi_rejection_reason"]
            | null
          spi_rejection_reason?:
            | APIEnums["spi_rejection_reason"]
            | null
          spi_retour_date_demande?: string | null
          spi_retour_date_irrevocabilite?: string | null
          spi_tx_id?: string | null
          status?: APIEnums["refund_status"]
          transaction_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "refunds_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      products: {
        Row: {
          charge_day: number | null
          continue_selling_when_out_of_stock: boolean | null
          created_at: string
          created_by: string | null
          description: string | null
          display_on_storefront: boolean
          environment: string
          failed_payment_action:
            | APIEnums["failed_payment_action"]
            | null
          first_payment_type:
            | APIEnums["first_payment_type"]
            | null
          fulfillment_type: APIEnums["product_fulfillment_type"]
          image_type: string | null
          images: string[] | null
          inventory_quantity: number | null
          is_active: boolean
          license_key_enabled: boolean
          metadata: Json | null
          name: string
          organization_id: string
          product_id: string
          product_type: APIEnums["product_type"]
          public_id: string
          sku: string | null
          track_inventory: boolean | null
          trial_enabled: boolean
          trial_period_days: number | null
          updated_at: string
          usage_aggregation:
            | APIEnums["usage_aggregation"]
            | null
          usage_unit: string | null
        }
        Insert: {
          charge_day?: number | null
          continue_selling_when_out_of_stock?: boolean | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_on_storefront?: boolean
          environment?: string
          failed_payment_action?:
            | APIEnums["failed_payment_action"]
            | null
          first_payment_type?:
            | APIEnums["first_payment_type"]
            | null
          fulfillment_type?: APIEnums["product_fulfillment_type"]
          image_type?: string | null
          images?: string[] | null
          inventory_quantity?: number | null
          is_active?: boolean
          license_key_enabled?: boolean
          metadata?: Json | null
          name: string
          organization_id: string
          product_id?: string
          product_type?: APIEnums["product_type"]
          public_id?: string
          sku?: string | null
          track_inventory?: boolean | null
          trial_enabled?: boolean
          trial_period_days?: number | null
          updated_at?: string
          usage_aggregation?:
            | APIEnums["usage_aggregation"]
            | null
          usage_unit?: string | null
        }
        Update: {
          charge_day?: number | null
          continue_selling_when_out_of_stock?: boolean | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_on_storefront?: boolean
          environment?: string
          failed_payment_action?:
            | APIEnums["failed_payment_action"]
            | null
          first_payment_type?:
            | APIEnums["first_payment_type"]
            | null
          fulfillment_type?: APIEnums["product_fulfillment_type"]
          image_type?: string | null
          images?: string[] | null
          inventory_quantity?: number | null
          is_active?: boolean
          license_key_enabled?: boolean
          metadata?: Json | null
          name?: string
          organization_id?: string
          product_id?: string
          product_type?: APIEnums["product_type"]
          public_id?: string
          sku?: string | null
          track_inventory?: boolean | null
          trial_enabled?: boolean
          trial_period_days?: number | null
          updated_at?: string
          usage_aggregation?:
            | APIEnums["usage_aggregation"]
            | null
          usage_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_products_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          created_by: string | null
          customer_id: string
          end_date: string | null
          environment: string
          metadata: Json | null
          next_billing_date: string | null
          organization_id: string
          price_id: string | null
          product_id: string
          provider_payment_method_id: string | null
          public_id: string
          start_date: string
          status: APIEnums["subscription_status"]
          subscription_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_id: string
          end_date?: string | null
          environment?: string
          metadata?: Json | null
          next_billing_date?: string | null
          organization_id: string
          price_id?: string | null
          product_id: string
          provider_payment_method_id?: string | null
          public_id?: string
          start_date: string
          status?: APIEnums["subscription_status"]
          subscription_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_id?: string
          end_date?: string | null
          environment?: string
          metadata?: Json | null
          next_billing_date?: string | null
          organization_id?: string
          price_id?: string | null
          product_id?: string
          provider_payment_method_id?: string | null
          public_id?: string
          start_date?: string
          status?: APIEnums["subscription_status"]
          subscription_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_subscriptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "merchant_subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "subscriptions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["price_id"]
          },
          {
            foreignKeyName: "subscriptions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      discount_coupons: {
        Row: {
          applies_to_product_types:
            | APIEnums["product_type"][]
            | null
          code: string
          coupon_id: string
          created_at: string
          current_uses: number
          customer_type: APIEnums["customer_type"]
          description: string | null
          discount_fixed_amount: number | null
          discount_percentage: number | null
          discount_type: APIEnums["discount_type"]
          environment: string
          expires_at: string | null
          is_active: boolean
          max_quantity_per_use: number | null
          max_uses: number | null
          organization_id: string
          public_id: string
          scope_type: string
          updated_at: string
          usage_frequency_limit: APIEnums["usage_frequency"]
          usage_limit_value: number | null
          valid_from: string | null
        }
        Insert: {
          applies_to_product_types?:
            | APIEnums["product_type"][]
            | null
          code: string
          coupon_id?: string
          created_at?: string
          current_uses?: number
          customer_type?: APIEnums["customer_type"]
          description?: string | null
          discount_fixed_amount?: number | null
          discount_percentage?: number | null
          discount_type?: APIEnums["discount_type"]
          environment?: string
          expires_at?: string | null
          is_active?: boolean
          max_quantity_per_use?: number | null
          max_uses?: number | null
          organization_id: string
          public_id?: string
          scope_type?: string
          updated_at?: string
          usage_frequency_limit?: APIEnums["usage_frequency"]
          usage_limit_value?: number | null
          valid_from?: string | null
        }
        Update: {
          applies_to_product_types?:
            | APIEnums["product_type"][]
            | null
          code?: string
          coupon_id?: string
          created_at?: string
          current_uses?: number
          customer_type?: APIEnums["customer_type"]
          description?: string | null
          discount_fixed_amount?: number | null
          discount_percentage?: number | null
          discount_type?: APIEnums["discount_type"]
          environment?: string
          expires_at?: string | null
          is_active?: boolean
          max_quantity_per_use?: number | null
          max_uses?: number | null
          organization_id?: string
          public_id?: string
          scope_type?: string
          updated_at?: string
          usage_frequency_limit?: APIEnums["usage_frequency"]
          usage_limit_value?: number | null
          valid_from?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discount_coupons_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      checkout_sessions: {
        Row: {
          allow_coupon_code: boolean
          allow_quantity: boolean
          amount: number
          cancel_url: string | null
          checkout_session_id: string
          created_at: string
          created_by: string | null
          currency_code: APIEnums["currency_code"]
          customer_address: string | null
          customer_city: string | null
          customer_country: string | null
          customer_email: string | null
          customer_id: string | null
          customer_invoice_id: string | null
          customer_name: string | null
          customer_phone: string | null
          customer_postal_code: string | null
          description: string | null
          environment: string
          expires_at: string
          installment_plan_id: string | null
          integration_source: APIEnums["integration_source"]
          is_pos: boolean
          is_spi: boolean
          metadata: Json | null
          organization_id: string
          payment_link_id: string | null
          payment_request_id: string | null
          price_id: string | null
          product_id: string | null
          public_id: string
          qr_code_data: Json | null
          qr_code_type: APIEnums["qr_code_type"] | null
          quantity: number
          require_billing_address: boolean
          require_email: boolean
          require_name: boolean
          require_phone: boolean
          spi_account_number: string | null
          spi_qr_code_id: string | null
          status: APIEnums["checkout_session_status"]
          subscription_id: string | null
          success_url: string | null
          title: string | null
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          allow_coupon_code?: boolean
          allow_quantity?: boolean
          amount: number
          cancel_url?: string | null
          checkout_session_id?: string
          created_at?: string
          created_by?: string | null
          currency_code: APIEnums["currency_code"]
          customer_address?: string | null
          customer_city?: string | null
          customer_country?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_invoice_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          customer_postal_code?: string | null
          description?: string | null
          environment?: string
          expires_at: string
          installment_plan_id?: string | null
          integration_source?: APIEnums["integration_source"]
          is_pos?: boolean
          is_spi?: boolean
          metadata?: Json | null
          organization_id: string
          payment_link_id?: string | null
          payment_request_id?: string | null
          price_id?: string | null
          product_id?: string | null
          public_id?: string
          qr_code_data?: Json | null
          qr_code_type?: APIEnums["qr_code_type"] | null
          quantity?: number
          require_billing_address?: boolean
          require_email?: boolean
          require_name?: boolean
          require_phone?: boolean
          spi_account_number?: string | null
          spi_qr_code_id?: string | null
          status?: APIEnums["checkout_session_status"]
          subscription_id?: string | null
          success_url?: string | null
          title?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          allow_coupon_code?: boolean
          allow_quantity?: boolean
          amount?: number
          cancel_url?: string | null
          checkout_session_id?: string
          created_at?: string
          created_by?: string | null
          currency_code?: APIEnums["currency_code"]
          customer_address?: string | null
          customer_city?: string | null
          customer_country?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_invoice_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          customer_postal_code?: string | null
          description?: string | null
          environment?: string
          expires_at?: string
          installment_plan_id?: string | null
          integration_source?: APIEnums["integration_source"]
          is_pos?: boolean
          is_spi?: boolean
          metadata?: Json | null
          organization_id?: string
          payment_link_id?: string | null
          payment_request_id?: string | null
          price_id?: string | null
          product_id?: string | null
          public_id?: string
          qr_code_data?: Json | null
          qr_code_type?: APIEnums["qr_code_type"] | null
          quantity?: number
          require_billing_address?: boolean
          require_email?: boolean
          require_name?: boolean
          require_phone?: boolean
          spi_account_number?: string | null
          spi_qr_code_id?: string | null
          status?: APIEnums["checkout_session_status"]
          subscription_id?: string | null
          success_url?: string | null
          title?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checkout_sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "checkout_sessions_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "checkout_sessions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "checkout_sessions_customer_invoice_id_fkey"
            columns: ["customer_invoice_id"]
            isOneToOne: false
            referencedRelation: "customer_invoices"
            referencedColumns: ["customer_invoice_id"]
          },
          {
            foreignKeyName: "checkout_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "checkout_sessions_payment_link_id_fkey"
            columns: ["payment_link_id"]
            isOneToOne: false
            referencedRelation: "payment_links"
            referencedColumns: ["link_id"]
          },
          {
            foreignKeyName: "checkout_sessions_payment_request_id_fkey"
            columns: ["payment_request_id"]
            isOneToOne: false
            referencedRelation: "payment_requests"
            referencedColumns: ["request_id"]
          },
          {
            foreignKeyName: "checkout_sessions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["price_id"]
          },
          {
            foreignKeyName: "checkout_sessions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "checkout_sessions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["subscription_id"]
          },
          {
            foreignKeyName: "fk_checkout_sessions_installment_plan"
            columns: ["installment_plan_id"]
            isOneToOne: false
            referencedRelation: "installment_plans"
            referencedColumns: ["plan_id"]
          },
          {
            foreignKeyName: "fk_checkout_sessions_spi_qr_code_id"
            columns: ["spi_qr_code_id"]
            isOneToOne: false
            referencedRelation: "spi_qr_codes"
            referencedColumns: ["qr_code_id"]
          },
        ]
      }
      payment_links: {
        Row: {
          allow_coupon_code: boolean
          allow_quantity: boolean
          amount: number | null
          cancel_url: string | null
          created_at: string
          created_by: string | null
          currency_code: APIEnums["currency_code"]
          description: string | null
          environment: string
          expires_at: string | null
          is_active: boolean
          link_id: string
          link_type: APIEnums["link_type"]
          metadata: Json | null
          organization_id: string
          price_id: string | null
          product_id: string | null
          public_id: string
          quantity: number
          require_billing_address: boolean
          require_email: boolean
          require_name: boolean
          require_phone: boolean
          success_url: string | null
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          allow_coupon_code?: boolean
          allow_quantity?: boolean
          amount?: number | null
          cancel_url?: string | null
          created_at?: string
          created_by?: string | null
          currency_code: APIEnums["currency_code"]
          description?: string | null
          environment?: string
          expires_at?: string | null
          is_active?: boolean
          link_id?: string
          link_type: APIEnums["link_type"]
          metadata?: Json | null
          organization_id: string
          price_id?: string | null
          product_id?: string | null
          public_id?: string
          quantity?: number
          require_billing_address?: boolean
          require_email?: boolean
          require_name?: boolean
          require_phone?: boolean
          success_url?: string | null
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          allow_coupon_code?: boolean
          allow_quantity?: boolean
          amount?: number | null
          cancel_url?: string | null
          created_at?: string
          created_by?: string | null
          currency_code?: APIEnums["currency_code"]
          description?: string | null
          environment?: string
          expires_at?: string | null
          is_active?: boolean
          link_id?: string
          link_type?: APIEnums["link_type"]
          metadata?: Json | null
          organization_id?: string
          price_id?: string | null
          product_id?: string | null
          public_id?: string
          quantity?: number
          require_billing_address?: boolean
          require_email?: boolean
          require_name?: boolean
          require_phone?: boolean
          success_url?: string | null
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_links_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "payment_links_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "payment_links_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "payment_links_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["price_id"]
          },
          {
            foreignKeyName: "payment_links_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      payouts: {
        Row: {
          account_id: string
          amount: number
          created_at: string
          created_by: string | null
          currency_code: APIEnums["currency_code"]
          environment: string
          metadata: Json | null
          organization_id: string
          payment_method_code:
            | APIEnums["payment_method_code"]
            | null
          payout_id: string
          payout_method_id: string | null
          provider_code: APIEnums["provider_code"] | null
          public_id: string
          status: APIEnums["payout_status"]
          updated_at: string
        }
        Insert: {
          account_id: string
          amount: number
          created_at?: string
          created_by?: string | null
          currency_code: APIEnums["currency_code"]
          environment?: string
          metadata?: Json | null
          organization_id: string
          payment_method_code?:
            | APIEnums["payment_method_code"]
            | null
          payout_id?: string
          payout_method_id?: string | null
          provider_code?: APIEnums["provider_code"] | null
          public_id?: string
          status?: APIEnums["payout_status"]
          updated_at?: string
        }
        Update: {
          account_id?: string
          amount?: number
          created_at?: string
          created_by?: string | null
          currency_code?: APIEnums["currency_code"]
          environment?: string
          metadata?: Json | null
          organization_id?: string
          payment_method_code?:
            | APIEnums["payment_method_code"]
            | null
          payout_id?: string
          payout_method_id?: string | null
          provider_code?: APIEnums["provider_code"] | null
          public_id?: string
          status?: APIEnums["payout_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "payouts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "merchant_balance_summary"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "payouts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "payouts_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "payouts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "payouts_payout_method_id_fkey"
            columns: ["payout_method_id"]
            isOneToOne: false
            referencedRelation: "payout_methods"
            referencedColumns: ["payout_method_id"]
          },
        ]
      }
      beneficiary_payouts: {
        Row: {
          account_id: string
          amount: number
          created_at: string
          created_by: string | null
          currency_code: APIEnums["currency_code"]
          metadata: Json | null
          organization_id: string
          payment_method_code:
            | APIEnums["payment_method_code"]
            | null
          payout_id: string
          payout_method_id: string | null
          provider_code: APIEnums["provider_code"] | null
          spi_bulk_instruction_id: string | null
          status: APIEnums["payout_status"]
          updated_at: string
        }
        Insert: {
          account_id: string
          amount: number
          created_at?: string
          created_by?: string | null
          currency_code: APIEnums["currency_code"]
          metadata?: Json | null
          organization_id: string
          payment_method_code?:
            | APIEnums["payment_method_code"]
            | null
          payout_id?: string
          payout_method_id?: string | null
          provider_code?: APIEnums["provider_code"] | null
          spi_bulk_instruction_id?: string | null
          status?: APIEnums["payout_status"]
          updated_at?: string
        }
        Update: {
          account_id?: string
          amount?: number
          created_at?: string
          created_by?: string | null
          currency_code?: APIEnums["currency_code"]
          metadata?: Json | null
          organization_id?: string
          payment_method_code?:
            | APIEnums["payment_method_code"]
            | null
          payout_id?: string
          payout_method_id?: string | null
          provider_code?: APIEnums["provider_code"] | null
          spi_bulk_instruction_id?: string | null
          status?: APIEnums["payout_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "beneficiary_payouts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "beneficiary_payouts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "merchant_balance_summary"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "beneficiary_payouts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "beneficiary_payouts_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "beneficiary_payouts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "beneficiary_payouts_payout_method_id_fkey"
            columns: ["payout_method_id"]
            isOneToOne: false
            referencedRelation: "payout_methods"
            referencedColumns: ["payout_method_id"]
          },
        ]
      }
      providers: {
        Row: {
          code: APIEnums["provider_code"]
          description: string | null
          name: string
        }
        Insert: {
          code: APIEnums["provider_code"]
          description?: string | null
          name: string
        }
        Update: {
          code?: APIEnums["provider_code"]
          description?: string | null
          name?: string
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          authorized_events: APIEnums["webhook_event"][]
          created_at: string
          created_by: string | null
          deleted_at: string | null
          environment: string
          is_active: boolean
          last_payload: Json | null
          last_response_body: string | null
          last_response_status: number | null
          last_triggered_at: string | null
          metadata: Json | null
          organization_id: string
          public_id: string
          retry_count: number | null
          spi_event_types: string[] | null
          supports_spi: boolean
          updated_at: string
          url: string
          verification_token: string
          webhook_id: string
        }
        Insert: {
          authorized_events?: APIEnums["webhook_event"][]
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          environment?: string
          is_active?: boolean
          last_payload?: Json | null
          last_response_body?: string | null
          last_response_status?: number | null
          last_triggered_at?: string | null
          metadata?: Json | null
          organization_id: string
          public_id?: string
          retry_count?: number | null
          spi_event_types?: string[] | null
          supports_spi?: boolean
          updated_at?: string
          url: string
          verification_token: string
          webhook_id?: string
        }
        Update: {
          authorized_events?: APIEnums["webhook_event"][]
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          environment?: string
          is_active?: boolean
          last_payload?: Json | null
          last_response_body?: string | null
          last_response_status?: number | null
          last_triggered_at?: string | null
          metadata?: Json | null
          organization_id?: string
          public_id?: string
          retry_count?: number | null
          spi_event_types?: string[] | null
          supports_spi?: boolean
          updated_at?: string
          url?: string
          verification_token?: string
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "webhooks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      webhook_delivery_logs: {
        Row: {
          amount: number | null
          attempt_number: number
          compte_paye: string | null
          compte_payeur: string | null
          created_at: string
          event_type: string
          headers: Json | null
          ip_address: string | null
          log_id: string
          organization_id: string
          payload: Json
          request_duration_ms: number | null
          response_body: string | null
          response_status: number | null
          spi_event_code:
            | APIEnums["spi_webhook_event_code"]
            | null
          spi_tx_id: string | null
          success: boolean
          user_agent: string | null
          webhook_id: string
        }
        Insert: {
          amount?: number | null
          attempt_number?: number
          compte_paye?: string | null
          compte_payeur?: string | null
          created_at?: string
          event_type: string
          headers?: Json | null
          ip_address?: string | null
          log_id?: string
          organization_id: string
          payload: Json
          request_duration_ms?: number | null
          response_body?: string | null
          response_status?: number | null
          spi_event_code?:
            | APIEnums["spi_webhook_event_code"]
            | null
          spi_tx_id?: string | null
          success?: boolean
          user_agent?: string | null
          webhook_id: string
        }
        Update: {
          amount?: number | null
          attempt_number?: number
          compte_paye?: string | null
          compte_payeur?: string | null
          created_at?: string
          event_type?: string
          headers?: Json | null
          ip_address?: string | null
          log_id?: string
          organization_id?: string
          payload?: Json
          request_duration_ms?: number | null
          response_body?: string | null
          response_status?: number | null
          spi_event_code?:
            | APIEnums["spi_webhook_event_code"]
            | null
          spi_tx_id?: string | null
          success?: boolean
          user_agent?: string | null
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_webhook"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["webhook_id"]
          },
          {
            foreignKeyName: "webhook_delivery_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "webhook_delivery_logs_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["webhook_id"]
          },
        ]
      }
      api_interactions: {
        Row: {
          actor_organization_id: string | null
          api_key: string
          created_at: string
          endpoint: string
          interaction_id: string
          network_account_id: string | null
          network_membership_id: string | null
          organization_id: string
          request_id: string | null
          request_method: string
          request_payload: Json | null
          response_payload: Json | null
          response_status: number | null
          response_time: number | null
          target_organization_id: string | null
        }
        Insert: {
          actor_organization_id?: string | null
          api_key: string
          created_at?: string
          endpoint: string
          interaction_id?: string
          network_account_id?: string | null
          network_membership_id?: string | null
          organization_id: string
          request_id?: string | null
          request_method: string
          request_payload?: Json | null
          response_payload?: Json | null
          response_status?: number | null
          response_time?: number | null
          target_organization_id?: string | null
        }
        Update: {
          actor_organization_id?: string | null
          api_key?: string
          created_at?: string
          endpoint?: string
          interaction_id?: string
          network_account_id?: string | null
          network_membership_id?: string | null
          organization_id?: string
          request_id?: string | null
          request_method?: string
          request_payload?: Json | null
          response_payload?: Json | null
          response_status?: number | null
          response_time?: number | null
          target_organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_interactions_actor_organization_id_fkey"
            columns: ["actor_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "api_interactions_api_key_fkey"
            columns: ["api_key"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["api_key"]
          },
          {
            foreignKeyName: "api_interactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "api_interactions_target_organization_id_fkey"
            columns: ["target_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "fk_api_interactions_network_account"
            columns: ["network_account_id"]
            isOneToOne: false
            referencedRelation: "network_accounts"
            referencedColumns: ["network_account_id"]
          },
          {
            foreignKeyName: "fk_api_interactions_network_membership"
            columns: ["network_membership_id"]
            isOneToOne: false
            referencedRelation: "network_memberships"
            referencedColumns: ["network_membership_id"]
          },
        ]
      }
      api_error_logs: {
        Row: {
          api_key: string | null
          context: Json | null
          created_at: string
          endpoint: string | null
          error_id: string
          error_message: string
          error_type: string
          organization_id: string | null
          request_id: string | null
          request_method: string | null
          response_status: number | null
          stack_trace: string | null
        }
        Insert: {
          api_key?: string | null
          context?: Json | null
          created_at?: string
          endpoint?: string | null
          error_id?: string
          error_message: string
          error_type: string
          organization_id?: string | null
          request_id?: string | null
          request_method?: string | null
          response_status?: number | null
          stack_trace?: string | null
        }
        Update: {
          api_key?: string | null
          context?: Json | null
          created_at?: string
          endpoint?: string | null
          error_id?: string
          error_message?: string
          error_type?: string
          organization_id?: string | null
          request_id?: string | null
          request_method?: string | null
          response_status?: number | null
          stack_trace?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_error_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      webhook_delivery_attempts: {
        Row: {
          attempt_id: string
          attempt_number: number
          created_at: string
          dispatch_id: string
          error_message: string | null
          request_duration_ms: number | null
          response_body: string | null
          response_status: number | null
        }
        Insert: {
          attempt_id?: string
          attempt_number: number
          created_at?: string
          dispatch_id: string
          error_message?: string | null
          request_duration_ms?: number | null
          response_body?: string | null
          response_status?: number | null
        }
        Update: {
          attempt_id?: string
          attempt_number?: number
          created_at?: string
          dispatch_id?: string
          error_message?: string | null
          request_duration_ms?: number | null
          response_body?: string | null
          response_status?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_delivery_attempts_dispatch_id_fkey"
            columns: ["dispatch_id"]
            isOneToOne: false
            referencedRelation: "webhook_delivery_dispatches"
            referencedColumns: ["dispatch_id"]
          },
        ]
      }
    };
    Functions: {
      lookup_api_idempotency_record: {
        Args: {
          p_endpoint_route: string
          p_environment: string
          p_idempotency_key: string
          p_organization_id: string
        }
        Returns: {
          request_fingerprint: string
          response_payload: Json
        }[]
      }
      record_api_idempotency_record: {
        Args: {
          p_endpoint_route: string
          p_environment: string
          p_idempotency_key: string
          p_organization_id: string
          p_request_fingerprint: string
          p_response_payload: Json
        }
        Returns: undefined
      }
      resolve_network_request_context: {
        Args: {
          p_actor_organization_id: string
          p_environment?: string | null
          p_lomi_account?: string | null
          p_required_capability?: string | null
        }
        Returns: {
          actor_organization_id: string
          allowed: boolean
          authorized_capability_key: string
          environment: string
          is_network_request: boolean
          message: string
          network_account_id: string
          network_membership_id: string
          public_account_id: string
          target_organization_id: string
        }[]
      }
      verify_api_key: {
        Args: {
          p_api_key: string
          p_endpoint: string
          p_ip_address?: string | null
          p_request_method?: string | null
        }
        Returns: {
          environment: string
          is_valid: boolean
          merchant_id: string
          message: string
          organization_id: string
          rate_limited: boolean
        }[]
      }
      verify_api_key_context: {
        Args: {
          p_api_key: string
          p_endpoint: string
          p_ip_address?: string | null
          p_lomi_account?: string | null
          p_request_method?: string | null
          p_required_capability?: string | null
        }
        Returns: {
          actor_organization_id: string
          environment: string
          is_network_request: boolean
          is_valid: boolean
          merchant_id: string
          message: string
          network_account_id: string
          network_capability_key: string
          network_membership_id: string
          organization_id: string
          public_account_id: string
          rate_limited: boolean
          target_organization_id: string
        }[]
      }
      verify_dashboard_org_access: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_permission_key?: string | null
        }
        Returns: boolean
      }
      verify_partner_management_key: {
        Args: { p_management_key: string }
        Returns: {
          is_valid: boolean
          management_key_id: string
          message: string
          partner_id: string
          partner_name: string
          partner_slug: string
          partner_status: APIEnums["platform_partner_status"]
        }[]
      }
      verify_provisioning_key: {
        Args: {
          p_endpoint?: string | null
          p_ip_address?: string | null
          p_provisioning_key: string
        }
        Returns: {
          environment: string
          is_valid: boolean
          message: string
          partner_name: string
          provisioning_key_id: string
          rate_limit_per_minute: number
        }[]
      }
      verify_provisioning_merchant_access: {
        Args: { p_merchant_id: string; p_provisioning_key_id: string }
        Returns: boolean
      }
      fetch_logs: {
        Args: {
          p_end_date?: string | null
          p_event?: APIEnums["event_type"] | null
          p_events?: APIEnums["event_type"][] | null
          p_exclude_delivery_noise?: boolean | null
          p_limit?: number | null
          p_merchant_id: string
          p_offset?: number | null
          p_severities?: string[] | null
          p_severity?: string | null
          p_start_date?: string | null
        }
        Returns: {
          browser: string
          created_at: string
          details: Json
          event: APIEnums["event_type"]
          ip_address: string
          location_city: string
          location_country: string
          log_id: string
          operating_system: string
          request_method: string
          request_url: string
          response_status: number
          severity: string
          total_count: number
        }[]
      }
      get_activity_log: {
        Args: {
          p_log_id: string
          p_merchant_id: string
          p_organization_id: string
        }
        Returns: {
          browser: string
          created_at: string
          details: Json
          event: APIEnums["event_type"]
          ip_address: string
          location_city: string
          location_country: string
          log_id: string
          operating_system: string
          request_method: string
          request_url: string
          response_status: number
          severity: string
        }[]
      }
      get_api_error_log: {
        Args: { p_error_id: string; p_organization_id: string }
        Returns: {
          api_key: string
          context: Json
          created_at: string
          endpoint: string
          error_id: string
          error_message: string
          error_type: string
          organization_id: string
          request_id: string
          request_method: string
          response_status: number
        }[]
      }
      get_api_error_logs: {
        Args: {
          p_end_date?: string | null
          p_limit?: number | null
          p_offset?: number | null
          p_organization_id: string
          p_severity?: string | null
          p_start_date?: string | null
          p_status_codes?: number[]
        }
        Returns: {
          api_key: string
          context: Json
          created_at: string
          endpoint: string
          error_id: string
          error_message: string
          error_type: string
          organization_id: string
          request_id: string
          request_method: string
          response_status: number
          total_count: number
        }[]
      }
      get_api_request_log: {
        Args: {
          p_environment?: string | null
          p_interaction_id: string
          p_organization_id: string
        }
        Returns: {
          actor_organization_id: string
          api_key: string
          created_at: string
          endpoint: string
          interaction_id: string
          member_organization_name: string
          network_account_id: string
          network_membership_id: string
          organization_id: string
          public_account_id: string
          request_id: string
          request_method: string
          request_payload: Json
          response_payload: Json
          response_status: number
          response_time: number
          target_organization_id: string
        }[]
      }
      get_api_request_logs: {
        Args: {
          p_end_date?: string | null
          p_environment?: string | null
          p_limit?: number | null
          p_offset?: number | null
          p_organization_id: string
          p_start_date?: string | null
          p_status_codes?: number[]
        }
        Returns: {
          actor_organization_id: string
          api_key: string
          created_at: string
          endpoint: string
          interaction_id: string
          member_organization_name: string
          network_account_id: string
          network_membership_id: string
          organization_id: string
          public_account_id: string
          request_id: string
          request_method: string
          request_payload: Json
          response_payload: Json
          response_status: number
          response_time: number
          target_organization_id: string
          total_count: number
        }[]
      }
      log_api_error: {
        Args: {
          p_api_key?: string | null
          p_context?: Json | null
          p_endpoint?: string | null
          p_error_message: string
          p_error_type: string
          p_organization_id?: string | null
          p_request_id?: string | null
          p_request_method?: string | null
          p_response_status?: number | null
          p_stack_trace?: string | null
        }
        Returns: string
      }
      log_api_interaction: {
        Args: {
          p_api_key: string
          p_endpoint: string
          p_organization_id: string
          p_request_method: string
          p_request_payload?: Json | null
          p_response_payload?: Json | null
          p_response_status?: number | null
          p_response_time?: number | null
        }
        Returns: string
      }
      log_api_interaction_context: {
        Args: {
          p_actor_organization_id: string
          p_api_key: string
          p_endpoint: string
          p_network_account_id?: string | null
          p_network_membership_id?: string | null
          p_request_id?: string | null
          p_request_method: string
          p_request_payload?: Json | null
          p_response_payload?: Json | null
          p_response_status?: number | null
          p_response_time?: number | null
          p_target_organization_id: string
        }
        Returns: string
      }
      log_wide_event: {
        Args: {
          p_attributes?: Json | null
          p_category?: APIEnums["event_category"] | null
          p_correlation_id?: string | null
          p_customer_id?: string | null
          p_environment?: string | null
          p_event_name: string
          p_message?: string | null
          p_organization_id?: string | null
          p_session_id?: string | null
          p_severity?: APIEnums["event_severity"] | null
          p_source?: string | null
          p_url?: string | null
          p_user_agent?: string | null
          p_user_id?: string | null
        }
        Returns: string
      }
      check_merchant_available_balance: {
        Args: {
          p_currency_code: APIEnums["currency_code"]
          p_merchant_id: string
        }
        Returns: number
      }
      fetch_account_balance: {
        Args: {
          p_currency_code?: string | null
          p_merchant_id: string
          p_organization_id: string
        }
        Returns: {
          balance: number
          currency_code: string
          last_updated: string
        }[]
      }
      fetch_balance_breakdown: {
        Args: {
          p_merchant_id: string
          p_organization_id?: string | null
          p_target_currency?: APIEnums["currency_code"] | null
        }
        Returns: {
          available_balance: number
          converted_available_balance: number
          converted_pending_balance: number
          converted_total_balance: number
          converted_unavailable_balance: number
          currency_code: APIEnums["currency_code"]
          pending_balance: number
          target_currency: APIEnums["currency_code"]
          total_balance: number
          unavailable_balance: number
        }[]
      }
      fetch_organization_details: {
        Args: { p_merchant_id: string; p_organization_id?: string }
        Returns: {
          arr: number
          city: string
          country: string
          default_currency: APIEnums["currency_code"]
          district: string
          email: string
          has_payout_pin: boolean
          logo_url: string
          mrr: number
          name: string
          organization_id: string
          postal_code: string
          region: string
          slug: string
          storefront_enabled: boolean
          street: string
          total_customers: number
          total_merchants: number
          total_revenue: number
          total_transactions: number
          updated_at: string
          verification_status: APIEnums["organization_verification_status"]
          website_url: string
        }[]
      }
      get_account: {
        Args: { p_account_id: string; p_organization_id: string }
        Returns: {
          account_id: string
          balance: number
          created_at: string
          currency_code: APIEnums["currency_code"]
          is_spi_account: boolean
          organization_id: string
          spi_account_balance: number
          spi_account_balance_sync_error: string
          spi_account_balance_synced_at: string
          spi_account_number: string
          spi_account_status: APIEnums["spi_account_status"]
          spi_account_type: APIEnums["spi_account_type"]
          updated_at: string
        }[]
      }
      get_merchant_arr: {
        Args: { p_merchant_id: string; p_organization_id?: string }
        Returns: {
          arr: number
          currency_code: string
          merchant_id: string
        }[]
      }
      get_merchant_balance: {
        Args: {
          p_currency_code: APIEnums["currency_code"]
          p_merchant_id: string
          p_organization_id: string
        }
        Returns: {
          as_of_date: string
          balance: number
          currency_code: APIEnums["currency_code"]
          merchant_id: string
        }[]
      }
      get_merchant_details: {
        Args: { p_merchant_id: string; p_organization_id?: string }
        Returns: {
          arr: number
          country: string
          created_at: string
          email: string
          merchant_id: string
          merchant_lifetime_value: number
          metadata: Json
          mrr: number
          name: string
          organization_id: string
          phone_number: string
          retry_payment_every: number
          total_retries: number
          updated_at: string
        }[]
      }
      get_merchant_from_organization: {
        Args: { p_organization_id: string }
        Returns: string
      }
      get_merchant_mrr: {
        Args: { p_merchant_id: string; p_organization_id?: string }
        Returns: {
          currency_code: string
          merchant_id: string
          mrr: number
        }[]
      }
      list_accounts: {
        Args: { p_limit?: number; p_offset?: number; p_organization_id: string }
        Returns: {
          account_id: string
          balance: number
          created_at: string
          currency_code: APIEnums["currency_code"]
          is_spi_account: boolean
          organization_id: string
          spi_account_balance: number
          spi_account_balance_sync_error: string
          spi_account_balance_synced_at: string
          spi_account_number: string
          spi_account_status: APIEnums["spi_account_status"]
          spi_account_type: APIEnums["spi_account_type"]
          updated_at: string
        }[]
      }
      list_organizations: {
        Args: { p_organization_id: string }
        Returns: {
          arr: number
          created_at: string
          default_currency: APIEnums["currency_code"]
          email: string
          employee_number: string
          has_payout_pin: boolean
          industry: string
          is_starter_business: boolean
          logo_url: string
          mrr: number
          name: string
          organization_id: string
          phone_number: string
          slug: string
          status: string
          storefront_enabled: boolean
          total_customers: number
          total_merchants: number
          total_revenue: number
          total_transactions: number
          updated_at: string
          verification_status: string
          website_url: string
        }[]
      }
      complete_customer_portal_payment_method_setup: {
        Args: {
          p_card_details?: Json | null
          p_customer_id: string
          p_organization_id: string
          p_stripe_payment_method_id: string
        }
        Returns: Json
      }
      create_customer: {
        Args: {
          p_address?: string | null
          p_city?: string | null
          p_country?: string | null
          p_email: string
          p_environment?: string | null
          p_is_business?: boolean | null
          p_merchant_id: string
          p_name: string
          p_organization_id: string
          p_phone_number?: string | null
          p_postal_code?: string | null
          p_whatsapp_number?: string | null
        }
        Returns: string
      }
      create_customer_portal_launch_session: {
        Args: {
          p_customer_id: string
          p_environment?: string | null
          p_flow_after_completion_url?: string | null
          p_flow_subscription_id?: string | null
          p_flow_type?: string | null
          p_merchant_id: string
          p_organization_id: string
          p_return_url?: string | null
        }
        Returns: {
          launch_token: string
        }[]
      }
      create_or_update_customer: {
        Args: {
          p_address: string
          p_city: string
          p_country: string
          p_custom_fields_metadata?: Json | null
          p_email: string
          p_environment?: string | null
          p_merchant_id: string
          p_name: string
          p_organization_id: string
          p_phone_number: string
          p_postal_code: string
          p_whatsapp_number: string
        }
        Returns: string
      }
      customer_portal_list_payment_methods: {
        Args: { p_session_token: string }
        Returns: {
          card_brand: string
          exp_month: number
          exp_year: number
          is_default: boolean
          last4: string
          payment_method_id: string
          stripe_payment_method_id: string
        }[]
      }
      customer_portal_list_subscriptions: {
        Args: {
          p_limit?: number | null
          p_offset?: number | null
          p_session_token: string
          p_status?: string | null
        }
        Returns: {
          amount: number
          billing_interval: APIEnums["billing_interval"]
          cancel_at_period_end: boolean
          currency_code: APIEnums["currency_code"]
          end_date: string
          next_billing_date: string
          product_id: string
          product_name: string
          scheduled_cancel_date: string
          subscription_id: string
          subscription_status: APIEnums["subscription_status"]
          total_count: number
        }[]
      }
      customer_portal_list_transactions: {
        Args: {
          p_limit?: number | null
          p_offset?: number | null
          p_session_token: string
          p_status?: string | null
        }
        Returns: {
          created_at: string
          currency_code: APIEnums["currency_code"]
          description: string
          gross_amount: number
          invoice_id: string
          invoice_number: string
          invoice_url: string
          provider_code: APIEnums["provider_code"]
          refunded_amount: number
          status: APIEnums["transaction_status"]
          total_count: number
          transaction_id: string
        }[]
      }
      customer_portal_manage_subscription: {
        Args: {
          p_action: string
          p_cancellation_reason?: string | null
          p_session_token: string
          p_subscription_id: string
        }
        Returns: Json
      }
      customer_portal_set_default_payment_method: {
        Args: { p_payment_method_id: string; p_session_token: string }
        Returns: Json
      }
      customer_portal_validate_session: {
        Args: { p_session_token: string }
        Returns: {
          customer_email: string
          customer_id: string
          customer_name: string
          environment: string
          org_slug: string
          organization_id: string
        }[]
      }
      delete_customer: {
        Args: { p_acting_merchant_id?: string; p_customer_id: string }
        Returns: undefined
      }
      fetch_customer_transactions: {
        Args: { p_customer_id: string; p_environment?: string }
        Returns: {
          created_at: string
          currency_code: APIEnums["currency_code"]
          description: string
          gross_amount: number
          gross_amount_xof: number
          metadata: Json
          payment_method_code: APIEnums["payment_method_code"]
          product_id: string
          product_name: string
          provider_code: APIEnums["provider_code"]
          refunded_amount: number
          refunded_amount_xof: number
          status: string
          subscription_id: string
          transaction_id: string
        }[]
      }
      fetch_customers: {
        Args: {
          p_customer_type?: string | null
          p_environment?: string | null
          p_limit?: number | null
          p_merchant_id: string
          p_offset?: number | null
          p_organization_id?: string | null
          p_search_term?: string | null
          p_segment?: string | null
        }
        Returns: {
          address: string
          city: string
          country: string
          created_at: string
          customer_id: string
          dispute_losses: number
          email: string
          is_business: boolean
          last_payment_date: string
          name: string
          payments_count: number
          phone_number: string
          postal_code: string
          primary_payment_method: string
          primary_provider: string
          public_id: string
          refund_amount: number
          spend_currency: APIEnums["currency_code"]
          total_count: number
          total_spend: number
          updated_at: string
          whatsapp_number: string
        }[]
      }
      fetch_customers_with_status: {
        Args: {
          p_activity_status?: string | null
          p_customer_type?: string | null
          p_environment?: string | null
          p_limit?: number | null
          p_merchant_id: string
          p_offset?: number | null
          p_organization_id?: string | null
          p_search_term?: string | null
        }
        Returns: {
          address: string
          city: string
          country: string
          created_at: string
          customer_id: string
          email: string
          has_transactions: boolean
          is_business: boolean
          name: string
          phone_number: string
          postal_code: string
          total_count: number
          updated_at: string
          whatsapp_number: string
        }[]
      }
      get_customer: {
        Args: { p_customer_id: string; p_merchant_id: string }
        Returns: {
          address: string
          city: string
          country: string
          created_at: string
          customer_id: string
          email: string
          is_business: boolean
          metadata: Json
          name: string
          phone_number: string
          postal_code: string
          updated_at: string
          whatsapp_number: string
        }[]
      }
      get_customer_by_organization: {
        Args: { p_customer_id: string; p_organization_id: string }
        Returns: {
          address: string
          city: string
          country: string
          created_at: string
          customer_id: string
          email: string
          environment: string
          is_business: boolean
          metadata: Json
          name: string
          organization_id: string
          phone_number: string
          postal_code: string
          updated_at: string
          whatsapp_number: string
        }[]
      }
      get_customer_invoice_api: {
        Args: { p_invoice_id: string; p_organization_id: string }
        Returns: Json
      }
      get_customer_spi_alias: {
        Args: { p_customer_id: string }
        Returns: string
      }
      get_customer_subscription: {
        Args: { p_merchant_id: string; p_subscription_id: string }
        Returns: {
          created_at: string
          customer_email: string
          customer_id: string
          customer_name: string
          end_date: string
          merchant_id: string
          metadata: Json
          next_billing_date: string
          organization_id: string
          plan_amount: number
          plan_billing_frequency: APIEnums["billing_interval"]
          plan_currency_code: APIEnums["currency_code"]
          plan_description: string
          plan_name: string
          product_id: string
          start_date: string
          status: APIEnums["subscription_status"]
          subscription_id: string
          updated_at: string
        }[]
      }
      merchant_list_customer_portal_audit_events: {
        Args: {
          p_customer_id?: string | null
          p_event_type?: string | null
          p_limit?: number | null
          p_merchant_id: string
          p_offset?: number | null
          p_organization_id: string
        }
        Returns: {
          created_at: string
          customer_id: string
          event_id: string
          event_type: string
          metadata: Json
          organization_id: string
          total_count: number
        }[]
      }
      update_customer: {
        Args: {
          p_acting_merchant_id?: string | null
          p_address?: string | null
          p_city?: string | null
          p_country?: string | null
          p_customer_id: string
          p_email: string
          p_is_business?: boolean | null
          p_name: string
          p_phone_number?: string | null
          p_postal_code?: string | null
          p_whatsapp_number?: string | null
        }
        Returns: undefined
      }
      update_customer_invoice_api: {
        Args: {
          p_invoice_id: string
          p_merchant_id?: string | null
          p_organization_id: string
          p_update_data: Json
        }
        Returns: Json
      }
      update_customer_metadata: {
        Args: {
          p_customer_id: string
          p_metadata: Json
          p_organization_id: string
        }
        Returns: undefined
      }
      update_customer_subscription: {
        Args: {
          p_end_date?: string | null
          p_merchant_id: string
          p_metadata?: Json | null
          p_next_billing_date?: string | null
          p_start_date?: string | null
          p_status?: APIEnums["subscription_status"] | null
          p_subscription_id: string
        }
        Returns: boolean
      }
      create_checkout_session: {
        Args: {
          p_allow_coupon_code?: boolean | null
          p_allow_quantity?: boolean | null
          p_amount: number
          p_cancel_url?: string | null
          p_created_by?: string | null
          p_currency_code?: APIEnums["currency_code"] | null
          p_customer_address?: string | null
          p_customer_city?: string | null
          p_customer_country?: string | null
          p_customer_email?: string | null
          p_customer_id?: string | null
          p_customer_name?: string | null
          p_customer_phone?: string | null
          p_customer_postal_code?: string | null
          p_description?: string | null
          p_environment?: string | null
          p_expiration_minutes?: number | null
          p_idempotency_body_hash?: string | null
          p_idempotency_key?: string | null
          p_metadata?: Json | null
          p_organization_id: string
          p_payment_link_id?: string | null
          p_price_id?: string | null
          p_product_id?: string | null
          p_quantity?: number | null
          p_require_billing_address?: boolean | null
          p_require_email?: boolean | null
          p_require_name?: boolean | null
          p_require_phone?: boolean | null
          p_subscription_id?: string | null
          p_success_url?: string | null
          p_title?: string | null
        }
        Returns: Json
      }
      create_checkout_session_with_line_items: {
        Args: {
          p_allow_coupon_code?: boolean | null
          p_cancel_url?: string | null
          p_created_by: string
          p_currency_code?: APIEnums["currency_code"] | null
          p_customer_address?: string | null
          p_customer_city?: string | null
          p_customer_country?: string | null
          p_customer_email?: string | null
          p_customer_id?: string | null
          p_customer_name?: string | null
          p_customer_phone?: string | null
          p_customer_postal_code?: string | null
          p_description?: string | null
          p_environment?: string | null
          p_expiration_minutes?: number | null
          p_idempotency_body_hash?: string | null
          p_idempotency_key?: string | null
          p_line_items: Json
          p_metadata?: Json | null
          p_organization_id: string
          p_payment_link_id?: string | null
          p_require_billing_address?: boolean | null
          p_require_email?: boolean | null
          p_require_name?: boolean | null
          p_require_phone?: boolean | null
          p_shipping_amount?: number | null
          p_success_url?: string | null
          p_tax_amount?: number | null
          p_title?: string | null
        }
        Returns: Json
      }
      get_checkout_session_api: {
        Args: { p_checkout_session_id: string; p_organization_id: string }
        Returns: {
          amount: number
          cancel_url: string
          checkout_session_id: string
          created_at: string
          currency_code: APIEnums["currency_code"]
          customer_email: string
          customer_id: string
          customer_name: string
          customer_phone: string
          description: string
          expires_at: string
          merchant_id: string
          metadata: Json
          organization_id: string
          payment_link_id: string
          product_id: string
          status: APIEnums["checkout_session_status"]
          subscription_id: string
          success_url: string
          title: string
          updated_at: string
        }[]
      }
      get_checkout_session_by_wave_id: {
        Args: { p_wave_session_id: string }
        Returns: {
          checkout_session_id: string
          created_at: string
          customer_id: string
          merchant_id: string
          metadata: Json
          organization_id: string
          transaction_id: string
        }[]
      }
      list_checkout_sessions: {
        Args: {
          p_limit?: number | null
          p_merchant_id: string
          p_offset?: number | null
          p_status?: APIEnums["checkout_session_status"] | null
        }
        Returns: {
          amount: number
          cancel_url: string
          checkout_session_id: string
          created_at: string
          currency_code: APIEnums["currency_code"]
          customer_email: string
          customer_id: string
          customer_name: string
          customer_phone: string
          description: string
          expires_at: string
          merchant_id: string
          metadata: Json
          organization_id: string
          payment_link_id: string
          product_id: string
          status: APIEnums["checkout_session_status"]
          subscription_id: string
          success_url: string
          title: string
          updated_at: string
        }[]
      }
      resolve_checkout_catalog_amount: {
        Args: {
          p_organization_id: string
          p_price_id?: string | null
          p_product_id?: string | null
          p_quantity?: number | null
        }
        Returns: number
      }
      create_invoice_checkout_session: {
        Args: {
          p_created_by?: string | null
          p_expiration_minutes?: number | null
          p_invoice_id: string
        }
        Returns: Json
      }
      create_invoice_receivable: {
        Args: {
          p_amount: number
          p_billing_period_end?: string | null
          p_billing_period_start?: string | null
          p_checkout_session_id?: string | null
          p_created_by?: string | null
          p_currency_code?: APIEnums["currency_code"] | null
          p_customer_details?: Json | null
          p_customer_id: string
          p_description?: string | null
          p_due_date?: string | null
          p_environment?: string | null
          p_invoice_number?: string | null
          p_line_items?: Json | null
          p_metadata?: Json | null
          p_organization_id: string
          p_origin?: string | null
          p_payment_details?: Json | null
          p_price_id?: string | null
          p_product_id?: string | null
          p_source_key?: string | null
          p_status?: APIEnums["invoice_status"] | null
          p_subscription_id?: string | null
          p_template?: Json | null
          p_transaction_id?: string | null
        }
        Returns: Json
      }
      get_blocking_customer_obligations: {
        Args: {
          p_customer_id?: string | null
          p_environment?: string | null
          p_organization_id: string
          p_product_id?: string | null
          p_subscription_id?: string | null
        }
        Returns: {
          amount_remaining: number
          checkout_url: string
          currency_code: APIEnums["currency_code"]
          due_date: string
          invoice_id: string
          invoice_number: string
          origin: string
          payment_url: string
          product_id: string
          subscription_id: string
        }[]
      }
      list_customer_invoices_api: {
        Args: {
          p_customer_id?: string | null
          p_environment?: string | null
          p_limit?: number | null
          p_merchant_id?: string | null
          p_offset?: number | null
          p_organization_id: string
          p_search?: string | null
          p_status?: APIEnums["invoice_status"] | null
        }
        Returns: {
          amount: number
          amount_due: number
          amount_paid: number
          amount_remaining: number
          billing_period_end: string
          billing_period_start: string
          checkout_session_id: string
          created_at: string
          currency_code: APIEnums["currency_code"]
          customer: Json
          customer_id: string
          customer_invoice_id: string
          description: string
          due_date: string
          invoice_number: string
          line_items: Json
          metadata: Json
          organization_id: string
          origin: string
          paid_at: string
          payment_url: string
          price_id: string
          product_id: string
          public_id: string
          sent_at: string
          status: APIEnums["invoice_status"]
          subscription_id: string
          total_count: number
          transaction_id: string
          updated_at: string
        }[]
      }
      create_payment_link: {
        Args: {
          p_allow_coupon_code?: boolean | null
          p_allow_quantity?: boolean | null
          p_cancel_url?: string | null
          p_created_by?: string | null
          p_currency_code?: APIEnums["currency_code"] | null
          p_description?: string | null
          p_environment?: string | null
          p_expires_at?: string | null
          p_line_items?: Json | null
          p_link_type: APIEnums["link_type"]
          p_metadata?: Json | null
          p_organization_id: string
          p_price?: number | null
          p_price_id?: string | null
          p_product_id?: string | null
          p_require_billing_address?: boolean | null
          p_require_email?: boolean | null
          p_require_name?: boolean | null
          p_require_phone?: boolean | null
          p_success_url?: string | null
          p_title: string
        }
        Returns: string
      }
      create_payment_request_api: {
        Args: {
          p_amount: number
          p_created_by: string
          p_currency_code?: APIEnums["currency_code"] | null
          p_customer_id: string
          p_description: string
          p_environment?: string | null
          p_expiry_date: string
          p_idempotency_body_hash?: string | null
          p_idempotency_key?: string | null
          p_metadata?: Json | null
          p_organization_id: string
          p_payment_reference: string
        }
        Returns: {
          amount: number
          created_at: string
          created_by: string
          currency_code: APIEnums["currency_code"]
          customer_id: string
          description: string
          environment: string
          expiry_date: string
          organization_id: string
          payment_link: string
          payment_reference: string
          request_id: string
          status: APIEnums["transaction_status"]
          updated_at: string
        }[]
      }
      get_payment_link_api: {
        Args: { p_link_id: string; p_organization_id: string }
        Returns: {
          allow_coupon_code: boolean
          allow_quantity: boolean
          amount: number
          cancel_url: string
          created_at: string
          created_by: string
          currency_code: APIEnums["currency_code"]
          description: string
          environment: string
          expires_at: string
          is_active: boolean
          line_items: Json
          link_id: string
          link_type: APIEnums["link_type"]
          metadata: Json
          organization_id: string
          price_id: string
          product_id: string
          quantity: number
          require_billing_address: boolean
          success_url: string
          title: string
          updated_at: string
          url: string
        }[]
      }
      get_payment_request_api: {
        Args: { p_organization_id: string; p_request_id: string }
        Returns: {
          amount: number
          created_at: string
          created_by: string
          currency_code: APIEnums["currency_code"]
          customer_id: string
          description: string
          environment: string
          expiry_date: string
          metadata: Json
          organization_id: string
          payment_link: string
          payment_reference: string
          request_id: string
          status: string
          updated_at: string
        }[]
      }
      list_payment_links: {
        Args: {
          p_is_active?: boolean | null
          p_limit?: number | null
          p_link_type?: string | null
          p_offset?: number | null
          p_organization_id: string
        }
        Returns: {
          allow_coupon_code: boolean
          allow_quantity: boolean
          amount: number
          cancel_url: string
          created_at: string
          created_by: string
          currency_code: APIEnums["currency_code"]
          description: string
          environment: string
          expires_at: string
          is_active: boolean
          link_id: string
          link_type: APIEnums["link_type"]
          metadata: Json
          organization_id: string
          price_id: string
          product_id: string
          quantity: number
          require_billing_address: boolean
          success_url: string
          title: string
          updated_at: string
          url: string
        }[]
      }
      list_payment_requests: {
        Args: {
          p_customer_id?: string | null
          p_limit?: number | null
          p_offset?: number | null
          p_organization_id: string
          p_status?: string | null
        }
        Returns: {
          amount: number
          created_at: string
          created_by: string
          currency_code: APIEnums["currency_code"]
          customer_id: string
          description: string
          environment: string
          expiry_date: string
          metadata: Json
          organization_id: string
          payment_link: string
          payment_reference: string
          request_id: string
          status: string
          updated_at: string
        }[]
      }
      create_discount_coupon: {
        Args: {
          p_code: string
          p_customer_type?: APIEnums["customer_type"] | null
          p_description?: string | null
          p_discount_fixed_amount?: number | null
          p_discount_percentage?: number | null
          p_discount_type?: APIEnums["discount_type"] | null
          p_environment?: string | null
          p_expires_at?: string | null
          p_is_active?: boolean | null
          p_max_quantity_per_use?: number | null
          p_max_uses?: number | null
          p_merchant_id?: string | null
          p_organization_id: string
          p_product_ids?: string[] | null
          p_scope_type?: string | null
          p_usage_frequency_limit?: APIEnums["usage_frequency"] | null
          p_usage_limit_value?: number | null
          p_valid_from?: string | null
        }
        Returns: string
      }
      create_price: {
        Args: {
          p_amount: number
          p_billing_interval?: APIEnums["billing_interval"] | null
          p_currency_code: APIEnums["currency_code"]
          p_is_default?: boolean | null
          p_maximum_amount?: number | null
          p_merchant_id?: string | null
          p_metadata?: Json | null
          p_minimum_amount?: number | null
          p_organization_id: string
          p_pricing_model?: APIEnums["pricing_model"] | null
          p_product_id: string
        }
        Returns: string
      }
      create_product: {
        Args: {
          p_charge_day?: number | null
          p_continue_selling_when_out_of_stock?: boolean | null
          p_description: string
          p_display_on_storefront?: boolean | null
          p_environment?: string | null
          p_failed_payment_action?: APIEnums["failed_payment_action"] | null
          p_fee_type_ids?: string[] | null
          p_first_payment_type?: APIEnums["first_payment_type"] | null
          p_fulfillment_type?: APIEnums["product_fulfillment_type"] | null
          p_images?: string[] | null
          p_inventory_quantity?: number | null
          p_is_active?: boolean | null
          p_merchant_id: string
          p_metadata?: Json | null
          p_meter_code?: string | null
          p_name: string
          p_organization_id: string
          p_prices?: Json | null
          p_product_type?: APIEnums["product_type"] | null
          p_sku?: string | null
          p_track_inventory?: boolean | null
          p_trial_enabled?: boolean | null
          p_trial_period_days?: number | null
          p_usage_aggregation?: APIEnums["usage_aggregation"] | null
          p_usage_unit?: string | null
        }
        Returns: string
      }
      fetch_products: {
        Args: {
          p_environment?: string | null
          p_is_active?: boolean | null
          p_limit?: number | null
          p_merchant_id: string
          p_offset?: number | null
          p_organization_id?: string | null
          p_search?: string | null
        }
        Returns: {
          continue_selling_when_out_of_stock: boolean
          created_at: string
          created_by: string
          description: string
          display_on_storefront: boolean
          fees: Json
          file_count: number
          fulfillment_type: APIEnums["product_fulfillment_type"]
          has_commerce_usage: boolean
          images: string[]
          inventory_quantity: number
          is_active: boolean
          license_key_enabled: boolean
          metadata: Json
          name: string
          organization_id: string
          prices: Json
          product_id: string
          product_type: APIEnums["product_type"]
          public_id: string
          sku: string
          total_count: number
          track_inventory: boolean
          updated_at: string
        }[]
      }
      get_coupon_details_for_management: {
        Args: {
          p_coupon_id?: string | null
          p_merchant_id?: string | null
          p_organization_id: string
        }
        Returns: {
          code: string
          coupon_id: string
          created_at: string
          current_uses: number
          customer_type: APIEnums["customer_type"]
          description: string
          discount_fixed_amount: number
          discount_percentage: number
          discount_type: APIEnums["discount_type"]
          expires_at: string
          is_active: boolean
          max_quantity_per_use: number
          max_uses: number
          organization_id: string
          plan_links: Json
          product_links: Json
          scope_type: string
          updated_at: string
          usage_frequency_limit: APIEnums["usage_frequency"]
          usage_limit_value: number
          valid_from: string
        }[]
      }
      get_coupon_performance: {
        Args: { p_coupon_id: string }
        Returns: {
          average_discount: number
          total_discounts: number
          total_revenue: number
          total_uses: number
          unique_customers: number
        }[]
      }
      get_organization_coupons: {
        Args: { p_environment?: string; p_organization_id: string }
        Returns: {
          applies_to_product_types: APIEnums["product_type"][]
          code: string
          completed_redemptions: number
          coupon_id: string
          created_at: string
          current_uses: number
          customer_type: APIEnums["customer_type"]
          description: string
          discount_fixed_amount: number
          discount_percentage: number
          discount_type: APIEnums["discount_type"]
          distinct_customers_completed: number
          expires_at: string
          is_active: boolean
          max_quantity_per_use: number
          max_uses: number
          product_links: Json
          scope_type: string
          updated_at: string
          usage_frequency_limit: APIEnums["usage_frequency"]
          usage_limit_value: number
          valid_from: string
        }[]
      }
      get_price_api: {
        Args: { p_organization_id: string; p_price_id: string }
        Returns: {
          amount: number
          billing_interval: APIEnums["billing_interval"]
          created_at: string
          currency_code: APIEnums["currency_code"]
          is_default: boolean
          maximum_amount: number
          metadata: Json
          minimum_amount: number
          organization_id: string
          price_id: string
          pricing_model: APIEnums["pricing_model"]
          product_id: string
          updated_at: string
        }[]
      }
      get_product_api: {
        Args: { p_organization_id: string; p_product_id: string }
        Returns: {
          created_at: string
          created_by: string
          description: string
          display_on_storefront: boolean
          has_commerce_usage: boolean
          images: string[]
          is_active: boolean
          metadata: Json
          name: string
          organization_id: string
          product_id: string
          product_type: APIEnums["product_type"]
          updated_at: string
        }[]
      }
      get_product_fees_api: {
        Args: { p_organization_id: string; p_product_id: string }
        Returns: {
          fee_fixed_amount: number
          fee_is_enabled: boolean
          fee_name: string
          fee_percentage: number
          fee_type_id: string
        }[]
      }
      get_product_prices_api: {
        Args: { p_organization_id: string; p_product_id: string }
        Returns: {
          amount: number
          billing_interval: APIEnums["billing_interval"]
          created_at: string
          currency_code: APIEnums["currency_code"]
          is_default: boolean
          organization_id: string
          price_id: string
          product_id: string
          updated_at: string
        }[]
      }
      set_default_price: {
        Args: { p_price_id: string; p_product_id: string }
        Returns: undefined
      }
      build_merchant_subscription_webhook_payload: {
        Args: { p_subscription_id: string; p_transaction_id?: string }
        Returns: Json
      }
      calculate_renewal_charge_amount: {
        Args: {
          p_base_amount: number
          p_currency_code: APIEnums["currency_code"]
          p_organization_id: string
        }
        Returns: number
      }
      cancel_customer_subscription: {
        Args: {
          p_cancel_at_period_end?: boolean | null
          p_cancellation_reason?: string | null
          p_merchant_id: string
          p_subscription_id: string
        }
        Returns: boolean
      }
      complete_stripe_deferred_subscription_setup: {
        Args: {
          p_checkout_session_id: string
          p_customer_id: string
          p_merchant_id: string
          p_organization_id: string
          p_price_id: string
          p_product_id: string
          p_stripe_payment_method_id: string
        }
        Returns: string
      }
      fallback_subscription_renewal_to_manual_checkout: {
        Args: { p_subscription_id: string }
        Returns: string
      }
      fetch_subscriptions: {
        Args: {
          p_environment?: string | null
          p_merchant_id?: string | null
          p_organization_id: string
          p_page?: number | null
          p_page_size?: number | null
        }
        Returns: {
          amount: number
          created_at: string
          currency_code: APIEnums["currency_code"]
          customer_id: string
          customer_name: string
          end_date: string
          metadata: Json
          next_billing_date: string
          product_id: string
          product_name: string
          start_date: string
          status: APIEnums["subscription_status"]
          subscription_id: string
          updated_at: string
        }[]
      }
      fetch_subscriptions_for_customer: {
        Args: { p_customer_id: string; p_environment?: string }
        Returns: {
          product_description: string
          product_id: string
          product_name: string
          product_type: APIEnums["product_type"]
          subscription_end_date: string
          subscription_id: string
          subscription_next_billing_date: string
          subscription_status: APIEnums["subscription_status"]
        }[]
      }
      finalize_subscription_renewal_after_retries: {
        Args: { p_error?: string; p_subscription_id: string }
        Returns: string
      }
      get_active_subscriptions_for_renewal: {
        Args: { p_due_date: string }
        Returns: {
          customer_email: string
          customer_id: string
          customer_name: string
          environment: string
          next_billing_date: string
          organization_id: string
          price_amount: number
          price_billing_interval: APIEnums["billing_interval"]
          price_currency_code: string
          provider_customer_id: string
          provider_payment_method_id: string
          status: APIEnums["subscription_status"]
          subscription_id: string
        }[]
      }
      handle_subscription_renewal_payment_failure: {
        Args: { p_error?: string; p_subscription_id: string }
        Returns: Json
      }
      manage_subscription: {
        Args: {
          p_action: string
          p_actor?: string | null
          p_cancellation_reason?: string | null
          p_merchant_id?: string | null
          p_new_price_id?: string | null
          p_session_token?: string | null
          p_source?: string | null
          p_subscription_id: string
        }
        Returns: Json
      }
      record_subscription_renewal: {
        Args: {
          p_amount_minor_units: number
          p_billing_period_end?: string | null
          p_currency: string
          p_status?: APIEnums["transaction_status"] | null
          p_stripe_payment_intent_id: string
          p_subscription_id: string
        }
        Returns: string
      }
      subscription_renewal_already_processed: {
        Args: { p_billing_date: string; p_subscription_id: string }
        Returns: boolean
      }
      apply_mtn_partial_refund_charges: {
        Args: {
          p_processing_fee_percentage?: number | null
          p_refund_amount: number
          p_refund_id: string
          p_subscription_action?: string | null
          p_transaction_id: string
        }
        Returns: {
          error_message: string
          subscription_action: Json
          success: boolean
        }[]
      }
      apply_stripe_dispute_lost_effects: {
        Args: { p_stripe_dispute_id: string }
        Returns: Json
      }
      apply_wave_partial_refund_charges: {
        Args: {
          p_processing_fee_percentage?: number | null
          p_refund_amount: number
          p_refund_id: string
          p_subscription_action?: string | null
          p_transaction_id: string
        }
        Returns: {
          error_message: string
          subscription_action: Json
          success: boolean
        }[]
      }
      create_manual_refund_request_api: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_processing_fee_percentage?: number | null
          p_reason?: string | null
          p_refund_amount: number
          p_subscription_action?: string | null
          p_transaction_id: string
        }
        Returns: Json
      }
      create_mtn_refund_request_api: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_processing_fee_percentage?: number | null
          p_reason?: string | null
          p_refund_amount: number
          p_subscription_action?: string | null
          p_transaction_id: string
        }
        Returns: Json
      }
      create_mtn_transaction: {
        Args: {
          p_amount: number
          p_checkout_session_id?: string | null
          p_currency_code: APIEnums["currency_code"]
          p_customer_id: string
          p_defer_test_settlement?: boolean | null
          p_description?: string | null
          p_environment?: string | null
          p_merchant_id: string
          p_metadata?: Json | null
          p_organization_id: string
          p_product_id?: string | null
          p_quantity?: number | null
          p_subscription_id?: string | null
        }
        Returns: {
          external_id: string
          transaction_id: string
        }[]
      }
      create_refund: {
        Args: {
          p_amount: number
          p_created_by?: string | null
          p_metadata?: Json | null
          p_provider_code?: APIEnums["provider_code"] | null
          p_provider_merchant_id?: string | null
          p_provider_transaction_id?: string | null
          p_reason?: string | null
          p_subscription_action?: string | null
          p_transaction_id: string
        }
        Returns: string
      }
      create_stripe_card_refund: {
        Args: {
          p_processing_fee_percentage?: number | null
          p_reason?: string | null
          p_refund_amount: number
          p_stripe_charge_id?: string | null
          p_stripe_refund_id?: string | null
          p_subscription_action?: string | null
          p_transaction_id: string
        }
        Returns: Json
      }
      create_stripe_card_refund_api: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_processing_fee_percentage?: number | null
          p_reason?: string | null
          p_refund_amount: number
          p_stripe_charge_id?: string | null
          p_stripe_refund_id?: string | null
          p_subscription_action?: string | null
          p_transaction_id: string
        }
        Returns: Json
      }
      create_stripe_transaction: {
        Args: {
          p_amount: number
          p_checkout_session_id?: string | null
          p_currency_code: APIEnums["currency_code"]
          p_customer_id: string
          p_description?: string | null
          p_environment?: string | null
          p_merchant_id: string
          p_metadata?: Json | null
          p_organization_id: string
          p_price_id?: string | null
          p_product_id?: string | null
          p_provider_transaction_id: string
          p_quantity?: number | null
          p_subscription_id?: string | null
        }
        Returns: string
      }
      create_wave_refund_request_api: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_processing_fee_percentage?: number | null
          p_reason?: string | null
          p_refund_amount: number
          p_subscription_action?: string | null
          p_transaction_id: string
        }
        Returns: Json
      }
      evaluate_radar_for_charge: {
        Args: {
          p_amount: number
          p_currency_code: APIEnums["currency_code"]
          p_customer_id: string
          p_environment?: string | null
          p_metadata?: Json | null
          p_organization_id: string
          p_rail: string
          p_transaction_id?: string | null
        }
        Returns: Json
      }
      fetch_transactions: {
        Args: {
          p_currency?: APIEnums["currency_code"][] | null
          p_display_in_xof?: boolean | null
          p_end_date?: string | null
          p_environment?: string | null
          p_is_pos?: boolean | null
          p_merchant_id?: string | null
          p_organization_id: string
          p_page?: number | null
          p_page_size?: number | null
          p_payment_method?: APIEnums["payment_method_code"][] | null
          p_product_linkage?: string[] | null
          p_provider_code?: APIEnums["provider_code"] | null
          p_search_term?: string | null
          p_start_date?: string | null
          p_status?: APIEnums["transaction_status"][] | null
          p_type?: APIEnums["transaction_type"][] | null
        }
        Returns: {
          coupon_code: string
          coupon_usage_details: Json
          created_at: string
          currency_code: APIEnums["currency_code"]
          customer_address: string
          customer_city: string
          customer_country: string
          customer_email: string
          customer_id: string
          customer_name: string
          customer_phone: string
          customer_postal_code: string
          fee_amount: number
          fee_amount_xof: number
          fee_category: APIEnums["fee_category"]
          fee_name: string
          fee_structure_id: string
          fee_subcategory: APIEnums["fee_subcategory"]
          gross_amount: number
          gross_amount_xof: number
          integration_source: APIEnums["integration_source"]
          metadata: Json
          net_amount: number
          net_amount_xof: number
          organization_id: string
          payment_method_code: APIEnums["payment_method_code"]
          product_description: string
          product_id: string
          product_name: string
          product_price: number
          provider_checkout_id: string
          provider_code: APIEnums["provider_code"]
          provider_transaction_id: string
          public_id: string
          qr_code_id: string
          qr_code_name: string
          qr_code_product_id: string
          qr_code_type: APIEnums["qr_code_type"]
          quantity: number
          refunded_amount: number
          refunded_amount_xof: number
          spi_payment_category: APIEnums["spi_payment_category"]
          spi_rejection_reason: APIEnums["spi_rejection_reason"]
          status: APIEnums["transaction_status"]
          subscription_id: string
          subscription_next_billing_date: string
          subscription_price_billing_interval: string
          subscription_product_description: string
          subscription_product_name: string
          subscription_status: string
          transaction_id: string
          transaction_type: APIEnums["transaction_type"]
        }[]
      }
      get_effective_other_fee_config: {
        Args: {
          p_currency_code: APIEnums["currency_code"]
          p_organization_id: string
          p_payment_method_code?: APIEnums["payment_method_code"] | null
          p_provider_code?: APIEnums["provider_code"] | null
          p_subcategory: APIEnums["fee_subcategory"]
        }
        Returns: {
          fee_name: string
          fixed_amount: number
          percentage: number
          tier_name: string
        }[]
      }
      get_mtn_transaction_by_external_id: {
        Args: { p_external_id: string }
        Returns: {
          merchant_id: string
          organization_id: string
          transaction_id: string
        }[]
      }
      get_mtn_transaction_by_reference_id: {
        Args: { p_reference_id: string }
        Returns: {
          merchant_id: string
          organization_id: string
          transaction_id: string
        }[]
      }
      get_refund: {
        Args: { p_organization_id: string; p_refund_id: string }
        Returns: {
          amount: number
          created_at: string
          fee_amount: number
          metadata: Json
          reason: string
          refund_id: string
          refunded_amount: number
          status: APIEnums["refund_status"]
          transaction_id: string
          updated_at: string
        }[]
      }
      get_stripe_provider_charge_id: {
        Args: { p_transaction_id: string }
        Returns: string
      }
      get_transaction: {
        Args: { p_organization_id?: string; p_transaction_id: string }
        Returns: {
          created_at: string
          currency_code: APIEnums["currency_code"]
          customer_id: string
          description: string
          environment: string
          fee_amount: number
          fee_category: APIEnums["fee_category"]
          fee_name: string
          fee_structure_id: string
          fee_subcategory: APIEnums["fee_subcategory"]
          gross_amount: number
          metadata: Json
          net_amount: number
          organization_id: string
          payment_method_code: APIEnums["payment_method_code"]
          product_id: string
          provider_code: APIEnums["provider_code"]
          refunded_amount: number
          status: APIEnums["transaction_status"]
          subscription_id: string
          transaction_id: string
          transaction_type: APIEnums["transaction_type"]
          updated_at: string
        }[]
      }
      get_transaction_by_stripe_intent: {
        Args: { p_payment_intent_id: string }
        Returns: Json
      }
      handle_stripe_dispute_created: {
        Args: {
          p_amount: number
          p_currency: string
          p_dispute_data?: Json | null
          p_payment_intent_id: string
          p_reason: string
          p_stripe_charge_id: string
          p_stripe_dispute_id: string
        }
        Returns: Json
      }
      handle_stripe_dispute_updated: {
        Args: {
          p_dispute_data?: Json | null
          p_status: string
          p_stripe_dispute_id: string
        }
        Returns: Json
      }
      handle_stripe_refund: {
        Args: {
          p_payment_intent_id: string
          p_reason?: string | null
          p_refund_amount: number
          p_refund_id: string
          p_stripe_charge_id: string
        }
        Returns: Json
      }
      list_refunds: {
        Args: {
          p_end_date?: string | null
          p_limit?: number | null
          p_offset?: number | null
          p_organization_id: string
          p_start_date?: string | null
          p_status?: APIEnums["refund_status"] | null
        }
        Returns: {
          amount: number
          created_at: string
          fee_amount: number
          metadata: Json
          reason: string
          refund_id: string
          refunded_amount: number
          status: APIEnums["refund_status"]
          transaction_id: string
          updated_at: string
        }[]
      }
      merge_stripe_radar_signals: {
        Args: {
          p_stripe_risk_level: string
          p_stripe_risk_score?: number | null
          p_transaction_id: string
        }
        Returns: undefined
      }
      prepare_stripe_payment_amount: {
        Args: { p_amount: number; p_currency: string }
        Returns: {
          original_amount_xof: number
          rate_xof_to_eur: number
          stripe_amount_cents: number
          stripe_currency: string
        }[]
      }
      rollback_mtn_refund: {
        Args: { p_reason?: string; p_refund_id: string }
        Returns: Json
      }
      rollback_wave_refund: {
        Args: { p_reason?: string; p_refund_id: string }
        Returns: Json
      }
      transaction_has_pending_dispute: {
        Args: { p_transaction_id: string }
        Returns: boolean
      }
      update_balances_for_transaction: {
        Args: { p_transaction_id: string }
        Returns: boolean
      }
      update_mtn_provider_reference: {
        Args: { p_provider_reference_id: string; p_transaction_id: string }
        Returns: boolean
      }
      update_organization_balance_for_refund: {
        Args: {
          p_processing_fee_percentage?: number | null
          p_refund_amount: number
          p_transaction_id: string
        }
        Returns: {
          error_message: string
          success: boolean
        }[]
      }
      update_stripe_checkout_status: {
        Args: {
          p_error_code?: string | null
          p_error_message?: string | null
          p_metadata?: Json | null
          p_payment_status?: APIEnums["provider_payment_status"] | null
          p_stripe_charge_id?: string | null
          p_stripe_payment_intent_id: string
          p_stripe_payment_method_id?: string | null
        }
        Returns: Json
      }
      update_transaction_fee_metadata: {
        Args: {
          p_card_details: Json
          p_is_international: boolean
          p_payment_method_id: string
          p_stripe_payment_intent_id: string
        }
        Returns: Json
      }
      update_transaction_status: {
        Args: {
          p_metadata?: Json | null
          p_status: APIEnums["transaction_status"]
          p_transaction_id: string
        }
        Returns: boolean
      }
      create_beneficiary_payout: {
        Args: {
          p_amount: number
          p_bypass_payout_pin?: boolean | null
          p_currency_code: APIEnums["currency_code"]
          p_merchant_id: string
          p_metadata?: Json | null
          p_payment_method_code?: APIEnums["payment_method_code"] | null
          p_payout_method_id?: string | null
          p_payout_pin?: string | null
          p_payout_pin_session?: string | null
          p_provider_code?: APIEnums["provider_code"] | null
          p_status?: APIEnums["payout_status"] | null
        }
        Returns: {
          fee_amount: number
          message: string
          payout_id: string
          status: APIEnums["payout_status"]
          total_deduction: number
        }[]
      }
      fetch_beneficiary_payouts: {
        Args: {
          p_currency_code?: APIEnums["currency_code"] | null
          p_end_date?: string | null
          p_merchant_id: string
          p_organization_id?: string | null
          p_page_number?: number | null
          p_page_size?: number | null
          p_start_date?: string | null
          p_statuses?: string[] | null
        }
        Returns: {
          account_id: string
          amount: number
          created_at: string
          created_by: string
          currency_code: APIEnums["currency_code"]
          metadata: Json
          organization_id: string
          payment_method_code: APIEnums["payment_method_code"]
          payout_id: string
          payout_method_id: string
          provider_code: APIEnums["provider_code"]
          status: APIEnums["payout_status"]
          updated_at: string
        }[]
      }
      fetch_payout_method_details: {
        Args: { p_organization_id?: string; p_payout_method_id: string }
        Returns: {
          account_name: string
          account_number: string
          auto_withdrawal_enabled: boolean
          auto_withdrawal_method: string
          auto_withdrawal_mobile_provider: APIEnums["provider_code"]
          bank_code: string
          bank_name: string
          branch_code: string
          country: string
          eligible_for_platform_withdrawal_at: string
          is_default: boolean
          is_spi_enabled: boolean
          is_uemoa: boolean
          is_valid: boolean
          organization_id: string
          payout_method_id: string
          payout_method_type: string
          spi_account_number: string
          spi_alias_mbno: string
          spi_alias_shid: string
          spi_alias_type: string
        }[]
      }
      fetch_payouts: {
        Args: {
          p_end_date?: string | null
          p_environment?: string | null
          p_merchant_id: string
          p_organization_id?: string | null
          p_page_number?: number | null
          p_page_size?: number | null
          p_start_date?: string | null
          p_statuses?: APIEnums["payout_status"][] | null
        }
        Returns: {
          account_id: string
          amount: number
          created_at: string
          currency_code: APIEnums["currency_code"]
          merchant_id: string
          metadata: Json
          organization_id: string
          payout_id: string
          payout_method_id: string
          provider_code: APIEnums["provider_code"]
          status: APIEnums["payout_status"]
          updated_at: string
        }[]
      }
      fetch_settlement_periods: {
        Args: {
          p_currency?: APIEnums["currency_code"] | null
          p_end_date?: string | null
          p_environment?: string | null
          p_merchant_id?: string | null
          p_organization_id: string
          p_page?: number | null
          p_page_size?: number | null
          p_start_date?: string | null
        }
        Returns: {
          currency_code: APIEnums["currency_code"]
          fee_amount: number
          gross_amount: number
          net_amount: number
          settlement_date: string
          settlement_id: string
          status: string
          total_count: number
          transaction_count: number
        }[]
      }
      fetch_settlement_transactions: {
        Args: {
          p_environment?: string | null
          p_merchant_id?: string | null
          p_organization_id: string
          p_page?: number | null
          p_page_size?: number | null
          p_settlement_id: string
        }
        Returns: {
          available_at: string
          created_at: string
          currency_code: APIEnums["currency_code"]
          customer_id: string
          fee_amount: number
          gross_amount: number
          net_amount: number
          payment_method_code: APIEnums["payment_method_code"]
          provider_code: APIEnums["provider_code"]
          status: APIEnums["transaction_status"]
          subscription_id: string
          total_count: number
          transaction_id: string
          transaction_type: APIEnums["transaction_type"]
        }[]
      }
      fetch_wave_provider_settings: {
        Args: { p_organization_id: string }
        Returns: {
          is_connected: boolean
          is_phone_verified: boolean
          metadata: Json
          organization_id: string
          phone_number: string
          provider_code: APIEnums["provider_code"]
          provider_merchant_id: string
        }[]
      }
      get_beneficiary_payout_api: {
        Args: { p_organization_id: string; p_payout_id: string }
        Returns: {
          account_id: string
          amount: number
          created_at: string
          created_by: string
          currency_code: APIEnums["currency_code"]
          metadata: Json
          organization_id: string
          payment_method_code: APIEnums["payment_method_code"]
          payout_id: string
          payout_method_id: string
          provider_code: APIEnums["provider_code"]
          status: APIEnums["payout_status"]
          updated_at: string
        }[]
      }
      get_payout_api: {
        Args: { p_organization_id: string; p_payout_id: string }
        Returns: {
          account_id: string
          amount: number
          created_at: string
          currency_code: APIEnums["currency_code"]
          metadata: Json
          organization_id: string
          payment_method_code: APIEnums["payment_method_code"]
          payout_id: string
          payout_method_id: string
          provider_code: APIEnums["provider_code"]
          status: APIEnums["payout_status"]
          updated_at: string
        }[]
      }
      get_payout_details: {
        Args: { p_organization_id?: string; p_payout_id: string }
        Returns: {
          metadata: Json
          payout_id: string
          status: string
        }[]
      }
      initiate_spi_payout: {
        Args: {
          p_amount: number
          p_bypass_payout_pin?: boolean | null
          p_currency_code: APIEnums["currency_code"]
          p_merchant_id: string
          p_organization_id: string
          p_payout_method_id: string
          p_payout_pin?: string | null
          p_payout_pin_session?: string | null
        }
        Returns: {
          message: string
          payout_id: string
          spi_tx_id: string
          status: APIEnums["payout_status"]
        }[]
      }
      initiate_withdrawal_api: {
        Args: {
          p_amount: number
          p_bypass_payout_pin?: boolean | null
          p_currency_code?: APIEnums["currency_code"] | null
          p_merchant_id: string
          p_organization_id: string
          p_payout_method_id: string
          p_payout_pin?: string | null
          p_payout_pin_session?: string | null
          p_provider_code?: APIEnums["provider_code"] | null
        }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      update_spi_payout_status: {
        Args: {
          p_payout_id: string
          p_spi_tx_id: string
          p_status: APIEnums["payout_status"]
        }
        Returns: undefined
      }
      claim_inbound_provider_webhook_event: {
        Args: {
          p_metadata?: Json | null
          p_provider: APIEnums["provider_code"]
          p_provider_event_id: string
        }
        Returns: boolean
      }
      create_webhook: {
        Args: {
          p_authorized_events: APIEnums["webhook_event"][]
          p_environment?: string | null
          p_merchant_id: string
          p_metadata?: Json | null
          p_organization_id: string
          p_url: string
        }
        Returns: string
      }
      delete_webhook: {
        Args: { p_merchant_id: string; p_webhook_id: string }
        Returns: boolean
      }
      fetch_organization_providers_settings_api: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_provider_code?: APIEnums["provider_code"] | null
        }
        Returns: {
          is_connected: boolean
          is_phone_verified: boolean
          metadata: Json
          onboarding_status: APIEnums["onboarding_status"]
          organization_id: string
          phone_number: string
          provider_code: APIEnums["provider_code"]
          provider_merchant_id: string
        }[]
      }
      fetch_organization_webhooks: {
        Args: {
          p_environment?: string | null
          p_event?: APIEnums["webhook_event"] | null
          p_is_active?: boolean | null
          p_merchant_id: string
          p_organization_id?: string | null
          p_search_term?: string | null
        }
        Returns: {
          authorized_events: APIEnums["webhook_event"][]
          created_at: string
          created_by: string | null
          deleted_at: string | null
          environment: string
          is_active: boolean
          last_payload: Json | null
          last_response_body: string | null
          last_response_status: number | null
          last_triggered_at: string | null
          metadata: Json | null
          organization_id: string
          public_id: string
          retry_count: number | null
          spi_event_types: string[] | null
          supports_spi: boolean
          updated_at: string
          url: string
          verification_token: string
          webhook_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "webhooks"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      find_wave_transaction_by_provider_txn_id: {
        Args: { p_wave_transaction_id: string }
        Returns: {
          status: APIEnums["transaction_status"]
          transaction_id: string
        }[]
      }
      get_wave_transaction_by_checkout_id: {
        Args: { p_provider_checkout_id: string }
        Returns: {
          created_at: string
          merchant_id: string
          organization_id: string
          transaction_id: string
        }[]
      }
      get_webhook: {
        Args: { p_merchant_id: string; p_webhook_id: string }
        Returns: {
          authorized_events: APIEnums["webhook_event"][]
          created_at: string
          created_by: string | null
          deleted_at: string | null
          environment: string
          is_active: boolean
          last_payload: Json | null
          last_response_body: string | null
          last_response_status: number | null
          last_triggered_at: string | null
          metadata: Json | null
          organization_id: string
          public_id: string
          retry_count: number | null
          spi_event_types: string[] | null
          supports_spi: boolean
          updated_at: string
          url: string
          verification_token: string
          webhook_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "webhooks"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_webhook_by_id: {
        Args: { p_webhook_id: string }
        Returns: {
          authorized_events: APIEnums["webhook_event"][]
          created_at: string
          created_by: string | null
          deleted_at: string | null
          environment: string
          is_active: boolean
          last_payload: Json | null
          last_response_body: string | null
          last_response_status: number | null
          last_triggered_at: string | null
          metadata: Json | null
          organization_id: string
          public_id: string
          retry_count: number | null
          spi_event_types: string[] | null
          supports_spi: boolean
          updated_at: string
          url: string
          verification_token: string
          webhook_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "webhooks"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_webhook_delivery_log: {
        Args: { p_log_id: string; p_merchant_id: string }
        Returns: {
          attempt_number: number
          created_at: string
          event_type: string
          headers: Json
          ip_address: string
          log_id: string
          organization_id: string
          payload: Json
          request_duration_ms: number
          response_body: string
          response_status: number
          success: boolean
          user_agent: string
          webhook_id: string
        }[]
      }
      get_webhook_delivery_log_with_attempts: {
        Args: {
          p_environment?: string | null
          p_log_id: string
          p_organization_id: string
        }
        Returns: {
          attempt_number: number
          attempts: Json
          created_at: string
          event_type: string
          headers: Json
          ip_address: string
          log_id: string
          organization_id: string
          payload: Json
          request_duration_ms: number
          response_body: string
          response_status: number
          success: boolean
          user_agent: string
          webhook_id: string
          webhook_url: string
        }[]
      }
      get_webhook_delivery_logs: {
        Args: {
          p_failed_only?: boolean | null
          p_limit?: number | null
          p_merchant_id: string
          p_offset?: number | null
          p_success_only?: boolean | null
          p_webhook_id: string
        }
        Returns: {
          attempt_number: number
          created_at: string
          event_type: string
          headers: Json
          ip_address: string
          log_id: string
          organization_id: string
          payload: Json
          request_duration_ms: number
          response_body: string
          response_status: number
          success: boolean
          user_agent: string
          webhook_id: string
        }[]
      }
      get_webhook_delivery_logs_with_attempts: {
        Args: {
          p_end_date?: string | null
          p_environment?: string | null
          p_failed_only?: boolean | null
          p_limit?: number | null
          p_offset?: number | null
          p_organization_id: string
          p_start_date?: string | null
          p_success_only?: boolean | null
          p_webhook_id?: string | null
        }
        Returns: {
          attempt_number: number
          attempts: Json
          created_at: string
          event_type: string
          headers: Json
          ip_address: string
          log_id: string
          organization_id: string
          payload: Json
          request_duration_ms: number
          response_body: string
          response_status: number
          success: boolean
          total_count: number
          user_agent: string
          webhook_id: string
          webhook_url: string
        }[]
      }
      log_webhook_delivery: {
        Args: {
          p_attempt_number?: number | null
          p_event_type: string
          p_headers?: Json | null
          p_ip_address?: string | null
          p_merchant_id: string
          p_organization_id: string
          p_payload: Json
          p_request_duration_ms?: number | null
          p_response_body: string
          p_response_status: number
          p_user_agent?: string | null
          p_webhook_id: string
        }
        Returns: string
      }
      mark_webhook_dispatch_dead_letter: {
        Args: { p_dispatch_id: string; p_reason: string }
        Returns: undefined
      }
      mark_webhook_dispatch_delivered: {
        Args: { p_dispatch_id: string }
        Returns: undefined
      }
      record_webhook_delivery_attempt: {
        Args: {
          p_attempt_number: number
          p_dispatch_id: string
          p_error_message: string
          p_request_duration_ms: number
          p_response_body: string
          p_response_status: number
        }
        Returns: string
      }
      recover_missing_wave_transaction: {
        Args: {
          p_amount?: number | null
          p_client_reference: string
          p_currency?: string | null
          p_wave_session_id: string
          p_wave_transaction_id?: string | null
        }
        Returns: {
          r_organization_id: string
          r_status: APIEnums["transaction_status"]
          r_transaction_id: string
          r_was_recovered: boolean
        }[]
      }
      update_webhook: {
        Args: {
          p_authorized_events?: APIEnums["webhook_event"][] | null
          p_is_active?: boolean | null
          p_merchant_id: string
          p_metadata?: Json | null
          p_url?: string | null
          p_webhook_id: string
        }
        Returns: boolean
      }
      update_webhook_delivery_status: {
        Args: {
          p_last_payload: Json
          p_last_response_body: string
          p_last_response_status: number
          p_webhook_id: string
        }
        Returns: undefined
      }
      webhook_dispatch_ensure: {
        Args: { p_outbox_id: string; p_webhook_id: string }
        Returns: string
      }
      webhook_dispatch_should_process: {
        Args: { p_dispatch_id: string }
        Returns: boolean
      }
      webhook_outbox_upsert_event: {
        Args: {
          p_event_type: APIEnums["webhook_event"]
          p_idempotency_key: string
          p_organization_id: string
          p_payload: Json
        }
        Returns: string
      }
      complete_spi_payment: {
        Args: {
          p_metadata?: Json | null
          p_spi_payment_status: APIEnums["spi_payment_status"]
          p_spi_tx_id: string
        }
        Returns: Json
      }
      create_spi_account_alias: {
        Args: {
          p_account_number: string
          p_alias_key: string
          p_alias_type: APIEnums["spi_alias_type"]
          p_organization_id: string
        }
        Returns: Json
      }
      fail_spi_payout: {
        Args: { p_error?: string; p_payout_id: string; p_spi_tx_id?: string }
        Returns: undefined
      }
      finalize_invoice_spi_rtp_initiated: {
        Args: {
          p_metadata?: Json | null
          p_payment_request_id: string
          p_spi_payment_status?: APIEnums["spi_payment_status"] | null
        }
        Returns: undefined
      }
      finalize_pos_spi_payment_initiated: {
        Args: {
          p_checkout_session_id: string
          p_qr_payload?: string | null
          p_spi_date_limite_paiement?: string | null
          p_spi_date_limite_reponse?: string | null
          p_spi_error_message?: string | null
          p_spi_init_success?: boolean | null
          p_spi_payment_status: APIEnums["spi_payment_status"]
          p_spi_tx_id: string
        }
        Returns: Json
      }
      get_checkout_spi_payment_status: {
        Args: { p_checkout_session_id: string }
        Returns: Json
      }
      get_invoice_spi_payment_status: {
        Args: { p_invoice_id: string; p_organization_id: string }
        Returns: Json
      }
      get_pos_spi_payment_status: {
        Args: { p_checkout_session_id: string; p_organization_id: string }
        Returns: Json
      }
      get_spi_account_alias: {
        Args: { p_account_number: string; p_alias_type: string }
        Returns: string
      }
      get_spi_account_number: {
        Args: { p_currency_code: string; p_organization_id: string }
        Returns: string
      }
      get_spi_account_snapshot: {
        Args: {
          p_currency_code?: APIEnums["currency_code"] | null
          p_organization_id: string
        }
        Returns: {
          is_spi_account: boolean
          spi_account_balance: number
          spi_account_balance_synced_at: string
          spi_account_number: string
        }[]
      }
      get_spi_payout_method_destination: {
        Args: { p_organization_id: string; p_payout_method_id: string }
        Returns: {
          spi_account_number: string
          spi_alias_mbno: string
          spi_alias_shid: string
        }[]
      }
      get_spi_provider_connection: {
        Args: { p_organization_id: string }
        Returns: {
          is_connected: boolean
          metadata: Json
        }[]
      }
      get_spi_provider_metadata: {
        Args: { p_organization_id: string }
        Returns: Json
      }
      list_orgs_missing_spi_account: {
        Args: never
        Returns: {
          currency_code: APIEnums["currency_code"]
          organization_id: string
          organization_name: string
        }[]
      }
      list_spi_accounts_for_balance_sync: {
        Args: never
        Returns: {
          currency_code: APIEnums["currency_code"]
          organization_id: string
        }[]
      }
      prepare_checkout_spi_payment: {
        Args: { p_checkout_session_id: string }
        Returns: Json
      }
      prepare_invoice_spi_rtp: {
        Args: { p_invoice_id: string; p_payeur_alias?: string }
        Returns: Json
      }
      prepare_pos_spi_payment: {
        Args: {
          p_amount: number
          p_checkout_session_id?: string | null
          p_currency_code?: APIEnums["currency_code"] | null
          p_merchant_id: string
          p_metadata?: Json | null
          p_organization_id: string
          p_product_id?: string | null
        }
        Returns: Json
      }
      provision_spi_account: {
        Args: {
          p_account_number: string
          p_account_type?: APIEnums["spi_account_type"] | null
          p_currency_code?: APIEnums["currency_code"] | null
          p_organization_id: string
        }
        Returns: Json
      }
      update_spi_account_balance: {
        Args: {
          p_balance: number
          p_currency_code: APIEnums["currency_code"]
          p_organization_id: string
          p_synced_at?: string | null
        }
        Returns: undefined
      }
      create_gim_transaction: {
        Args: {
          p_amount: number
          p_amount_minor: number
          p_checkout_session_id?: string | null
          p_currency_code: APIEnums["currency_code"]
          p_customer_id: string
          p_date_time_local_trxn?: string | null
          p_description?: string | null
          p_environment?: string | null
          p_merchant_id: string
          p_merchant_reference: string
          p_metadata?: Json | null
          p_organization_id: string
          p_pan_masked: string
          p_product_id?: string | null
          p_quantity?: number | null
          p_subscription_id?: string | null
        }
        Returns: string
      }
      finalize_gim_payment: {
        Args: {
          p_action_code?: string | null
          p_auth_code?: string | null
          p_gateway_message?: string | null
          p_merchant_reference: string
          p_network_reference?: string | null
          p_return_hash_valid?: boolean | null
          p_status: string
          p_system_reference?: number | null
          p_three_ds_required?: boolean | null
        }
        Returns: Json
      }
      prepare_checkout_gim_payment: {
        Args: { p_checkout_session_id: string }
        Returns: Json
      }
      calculate_network_operator_fee: {
        Args: {
          p_amount: number
          p_currency_code: APIEnums["currency_code"]
          p_fee_rule_id: string
        }
        Returns: number
      }
      create_network_account_session: {
        Args: {
          p_client_secret_hash: string
          p_components: Json
          p_environment: string
          p_operator_organization_id: string
          p_public_account_id: string
          p_ttl_minutes?: number | null
        }
        Returns: Json
      }
      create_network_enrollment_session: {
        Args: {
          p_created_by: string
          p_expires_at?: string | null
          p_intended_email?: string | null
          p_metadata?: Json | null
          p_operator_organization_id: string
          p_requested_capabilities?: string[] | null
          p_terms_version?: string | null
        }
        Returns: {
          enrollment_session_id: string
          enrollment_token: string
        }[]
      }
      create_network_transfer_for_api: {
        Args: {
          p_actor_merchant_id?: string | null
          p_amount: number
          p_api_key?: string | null
          p_currency_code: APIEnums["currency_code"]
          p_description?: string | null
          p_destination_account: string
          p_environment?: string | null
          p_idempotency_key?: string | null
          p_metadata?: Json | null
          p_operator_organization_id: string
          p_source_transaction_id?: string | null
          p_transfer_group?: string | null
        }
        Returns: Json
      }
      enqueue_network_webhook_event: {
        Args: {
          p_event: APIEnums["webhook_event"]
          p_idempotency_key: string
          p_operator_organization_id: string
          p_payload: Json
        }
        Returns: string
      }
      fetch_network_balance_for_api: {
        Args: {
          p_currency_code?: string | null
          p_environment?: string | null
          p_network_membership_id: string
        }
        Returns: {
          balance: number
          currency_code: string
          environment: string
          last_updated: string
          public_account_id: string
        }[]
      }
      fetch_network_customer_transactions_for_api: {
        Args: {
          p_customer_id: string
          p_environment?: string | null
          p_network_membership_id: string
        }
        Returns: {
          created_at: string
          currency_code: APIEnums["currency_code"]
          description: string
          gross_amount: number
          metadata: Json
          payment_method_code: APIEnums["payment_method_code"]
          provider_code: APIEnums["provider_code"]
          refunded_amount: number
          status: string
          transaction_id: string
        }[]
      }
      fetch_network_customers: {
        Args: {
          p_environment?: string | null
          p_member_organization_id?: string | null
          p_operator_organization_id: string
          p_page?: number | null
          p_page_size?: number | null
          p_search_term?: string | null
        }
        Returns: {
          country: string
          created_at: string
          customer_id: string
          email: string
          environment: string
          is_business: boolean
          member_organization_id: string
          member_organization_name: string
          name: string
          network_membership_id: string
          phone_number: string
          public_account_id: string
          total_count: number
          transaction_count: number
        }[]
      }
      fetch_network_customers_for_api: {
        Args: {
          p_activity_status?: string | null
          p_customer_type?: string | null
          p_environment?: string | null
          p_limit?: number | null
          p_network_membership_id: string
          p_offset?: number | null
          p_search_term?: string | null
        }
        Returns: {
          address: string
          city: string
          country: string
          created_at: string
          customer_id: string
          email: string
          environment: string
          has_transactions: boolean
          is_business: boolean
          metadata: Json
          name: string
          organization_id: string
          phone_number: string
          postal_code: string
          total_count: number
          updated_at: string
          whatsapp_number: string
        }[]
      }
      fetch_network_enrollments: {
        Args: {
          p_limit?: number | null
          p_offset?: number | null
          p_operator_organization_id: string
          p_status?: APIEnums["network_enrollment_status"][] | null
        }
        Returns: {
          accepted_terms_at: string
          completed_at: string
          created_at: string
          enrollment_session_id: string
          enrollment_token: string
          expires_at: string
          intended_email: string
          member_organization_id: string
          member_organization_name: string
          metadata: Json
          network_account_id: string
          network_membership_id: string
          public_account_id: string
          requested_capabilities: string[]
          status: APIEnums["network_enrollment_status"]
          terms_version: string
        }[]
      }
      fetch_network_member_balance: {
        Args: {
          p_environment?: string | null
          p_network_membership_id: string
          p_operator_organization_id: string
        }
        Returns: {
          balance: number
          currency_code: string
          last_updated: string
        }[]
      }
      fetch_network_members: {
        Args: {
          p_limit?: number | null
          p_offset?: number | null
          p_operator_organization_id: string
          p_search_term?: string | null
          p_status?: APIEnums["network_membership_status"][] | null
        }
        Returns: {
          accepted_at: string
          activated_at: string
          business_identifier: string
          contact_email: string
          contact_phone: string
          country: string
          granted_capabilities: string[]
          last_activity_at: string
          legal_name: string
          member_logo_url: string
          member_organization_id: string
          member_organization_name: string
          metadata: Json
          network_account_id: string
          network_membership_id: string
          operator_fee_rule_id: string
          public_account_id: string
          registry_identifier: string
          status: APIEnums["network_membership_status"]
          tax_identifier: string
          terms_version: string
          verification_status: string
          onboarding_completed: boolean
          has_payout_method: boolean
          live_grants: string[]
          test_grants: string[]
          terms_currency: string
          balance_live: number
          balance_test: number
          health_status: string
          actions_required: string[]
        }[]
      }
      fetch_network_operator_fee_entries: {
        Args: {
          p_limit?: number | null
          p_offset?: number | null
          p_operator_organization_id: string
          p_status?: APIEnums["network_fee_entry_status"][] | null
        }
        Returns: {
          amount: number
          created_at: string
          currency_code: APIEnums["currency_code"]
          description: string
          entry_type: APIEnums["network_fee_entry_type"]
          fee_rule_id: string
          member_organization_id: string
          member_organization_name: string
          metadata: Json
          network_membership_id: string
          network_transaction_context_id: string
          operator_fee_entry_id: string
          posted_at: string
          refund_id: string
          reversed_at: string
          status: APIEnums["network_fee_entry_status"]
          transaction_id: string
        }[]
      }
      fetch_network_operator_fee_rules: {
        Args: { p_operator_organization_id: string }
        Returns: {
          created_at: string
          currency_code: APIEnums["currency_code"]
          fee_rule_id: string
          fee_type: APIEnums["network_operator_fee_type"]
          fixed_amount: number
          max_amount: number | null
          metadata: Json
          min_amount: number | null
          name: string
          operator_organization_id: string
          percent_bps: number
          status: APIEnums["network_fee_rule_status"]
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "network_operator_fee_rules"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      fetch_network_organization_context: {
        Args: { p_organization_id: string }
        Returns: {
          active_member_count: number
          approved_at: string
          branding: Json
          charge_model: string
          connected_operator_count: number
          default_capabilities: string[]
          default_fee_rule_id: string
          default_terms_version: string
          fees_collector: string
          is_member: boolean
          live_rejected_reason: string
          live_requested_at: string
          losses_collector: string
          member_dashboard: string
          network_account_id: string
          onboarding_mode: string
          operator_live_status: string
          operator_profile_id: string
          operator_status: string
          platform_type: string
          profile: Json
          public_account_id: string
          responsibilities_acknowledged_at: string
          risk_tier: string
        }[]
      }
      fetch_network_provider_settings_for_api: {
        Args: {
          p_environment?: string | null
          p_network_membership_id: string
          p_provider_code: APIEnums["provider_code"]
        }
        Returns: {
          is_connected: boolean
          is_phone_verified: boolean
          metadata: Json
          onboarding_status: APIEnums["onboarding_status"]
          organization_id: string
          phone_number: string
          provider_code: APIEnums["provider_code"]
          provider_merchant_id: string
        }[]
      }
      fetch_network_refunds_for_api: {
        Args: {
          p_end_date?: string | null
          p_environment?: string | null
          p_limit?: number | null
          p_network_membership_id: string
          p_offset?: number | null
          p_read_scope?: string | null
          p_start_date?: string | null
          p_status?: APIEnums["refund_status"] | null
        }
        Returns: {
          amount: number
          created_at: string
          fee_amount: number
          metadata: Json
          reason: string
          refund_id: string
          refunded_amount: number
          status: APIEnums["refund_status"]
          transaction_id: string
          updated_at: string
        }[]
      }
      fetch_network_transactions: {
        Args: {
          p_currency?: APIEnums["currency_code"][] | null
          p_end_date?: string | null
          p_environment?: string | null
          p_operator_organization_id: string
          p_page?: number | null
          p_page_size?: number | null
          p_search_term?: string | null
          p_start_date?: string | null
          p_status?: APIEnums["transaction_status"][] | null
        }
        Returns: {
          capability_key: string
          created_at: string
          currency_code: APIEnums["currency_code"]
          customer_email: string
          customer_id: string
          customer_name: string
          fee_amount: number
          gross_amount: number
          member_organization_id: string
          member_organization_name: string
          metadata: Json
          net_amount: number
          network_account_id: string
          network_membership_id: string
          operator_fee_amount: number
          operator_fee_currency: APIEnums["currency_code"]
          operator_organization_id: string
          organization_id: string
          payment_method_code: APIEnums["payment_method_code"]
          provider_checkout_id: string
          provider_code: APIEnums["provider_code"]
          provider_transaction_id: string
          public_account_id: string
          refunded_amount: number
          status: APIEnums["transaction_status"]
          transaction_id: string
          transaction_type: APIEnums["transaction_type"]
        }[]
      }
      fetch_network_transactions_for_api: {
        Args: {
          p_currency?: APIEnums["currency_code"][] | null
          p_end_date?: string | null
          p_environment?: string | null
          p_is_pos?: boolean | null
          p_network_membership_id: string
          p_page?: number | null
          p_page_size?: number | null
          p_payment_method?: APIEnums["payment_method_code"][] | null
          p_provider_code?: APIEnums["provider_code"] | null
          p_read_scope?: string | null
          p_start_date?: string | null
          p_status?: APIEnums["transaction_status"][] | null
          p_type?: APIEnums["transaction_type"][] | null
        }
        Returns: {
          capability_key: string
          created_at: string
          currency_code: APIEnums["currency_code"]
          customer_email: string
          customer_id: string
          customer_name: string
          fee_amount: number
          gross_amount: number
          member_organization_id: string
          member_organization_name: string
          metadata: Json
          net_amount: number
          network_account_id: string
          network_membership_id: string
          operator_fee_amount: number
          operator_fee_currency: APIEnums["currency_code"]
          operator_organization_id: string
          organization_id: string
          payment_method_code: APIEnums["payment_method_code"]
          provider_checkout_id: string
          provider_code: APIEnums["provider_code"]
          provider_transaction_id: string
          public_account_id: string
          refunded_amount: number
          status: APIEnums["transaction_status"]
          transaction_id: string
          transaction_type: APIEnums["transaction_type"]
        }[]
      }
      fetch_network_transfers: {
        Args: {
          p_environment?: string | null
          p_limit?: number | null
          p_member_organization_id?: string | null
          p_offset?: number | null
          p_organization_id: string
        }
        Returns: Json[]
      }
      fetch_network_transfers_for_api: {
        Args: {
          p_destination_account?: string | null
          p_environment?: string | null
          p_limit?: number | null
          p_offset?: number | null
          p_operator_organization_id: string
          p_source_transaction_id?: string | null
          p_transfer_group?: string | null
          p_transfer_types?: string[] | null
        }
        Returns: Json[]
      }
      get_network_customer_for_api: {
        Args: {
          p_customer_id: string
          p_environment?: string | null
          p_network_membership_id: string
        }
        Returns: {
          address: string
          city: string
          country: string
          created_at: string
          customer_id: string
          email: string
          environment: string
          is_business: boolean
          metadata: Json
          name: string
          organization_id: string
          phone_number: string
          postal_code: string
          updated_at: string
          whatsapp_number: string
        }[]
      }
      get_network_membership_operator_fee_rule_id: {
        Args: { p_network_membership_id: string }
        Returns: string
      }
      get_network_operator_fee_entry_summary: {
        Args: { p_operator_fee_entry_id: string }
        Returns: {
          amount: number
          currency_code: APIEnums["currency_code"]
        }[]
      }
      get_network_refund_for_api: {
        Args: {
          p_environment?: string | null
          p_network_membership_id: string
          p_read_scope?: string | null
          p_refund_id: string
        }
        Returns: {
          amount: number
          created_at: string
          fee_amount: number
          metadata: Json
          reason: string
          refund_id: string
          refunded_amount: number
          status: APIEnums["refund_status"]
          transaction_id: string
          updated_at: string
        }[]
      }
      get_network_transaction_for_api: {
        Args: {
          p_environment?: string | null
          p_network_membership_id: string
          p_read_scope?: string | null
          p_transaction_id: string
        }
        Returns: {
          capability_key: string
          created_at: string
          currency_code: APIEnums["currency_code"]
          customer_email: string
          customer_id: string
          customer_name: string
          fee_amount: number
          gross_amount: number
          member_organization_id: string
          member_organization_name: string
          metadata: Json
          net_amount: number
          network_account_id: string
          network_membership_id: string
          operator_fee_amount: number
          operator_fee_currency: APIEnums["currency_code"]
          operator_organization_id: string
          organization_id: string
          payment_method_code: APIEnums["payment_method_code"]
          provider_checkout_id: string
          provider_code: APIEnums["provider_code"]
          provider_transaction_id: string
          public_account_id: string
          refunded_amount: number
          status: APIEnums["transaction_status"]
          transaction_id: string
          transaction_type: APIEnums["transaction_type"]
        }[]
      }
      get_network_transfer_for_api: {
        Args: { p_operator_organization_id: string; p_transfer_id: string }
        Returns: Json
      }
      get_network_webhook_enrichment: {
        Args: { p_member_organization_id: string; p_transaction_id: string }
        Returns: {
          customer_id: string
          member_organization_name: string
        }[]
      }
      move_network_funds: {
        Args: {
          p_actor_merchant_id?: string | null
          p_allow_negative?: boolean | null
          p_amount: number
          p_api_key?: string | null
          p_currency_code: APIEnums["currency_code"]
          p_description?: string | null
          p_environment: string
          p_from_organization_id: string
          p_idempotency_key?: string | null
          p_metadata?: Json | null
          p_network_membership_id: string
          p_network_transaction_context_id?: string | null
          p_operator_fee_entry_id?: string | null
          p_refund_id?: string | null
          p_reversed_transfer_id?: string | null
          p_source_transaction_id?: string | null
          p_to_organization_id: string
          p_transfer_group?: string | null
          p_transfer_type: APIEnums["network_transfer_type"]
        }
        Returns: string
      }
      network_member_health: {
        Args: { p_network_membership_id: string }
        Returns: {
          actions_required: string[]
          health_status: string
        }[]
      }
      record_network_login_link: {
        Args: {
          p_actor_merchant_id?: string | null
          p_api_key?: string | null
          p_environment?: string | null
          p_metadata?: Json | null
          p_network_membership_id: string
          p_operator_organization_id: string
        }
        Returns: Json
      }
      record_network_operator_fee_entry: {
        Args: {
          p_amount: number
          p_currency_code: APIEnums["currency_code"]
          p_description?: string | null
          p_entry_type?: APIEnums["network_fee_entry_type"] | null
          p_fee_rule_id?: string | null
          p_metadata?: Json | null
          p_network_membership_id: string
          p_network_transaction_context_id?: string | null
          p_refund_id?: string | null
          p_transaction_id?: string | null
        }
        Returns: string
      }
      record_network_operator_fee_reversal: {
        Args: {
          p_metadata?: Json | null
          p_network_membership_id: string
          p_refund_amount: number
          p_refund_id: string
          p_transaction_id: string
        }
        Returns: string
      }
      record_network_transaction_context: {
        Args: {
          p_actor_merchant_id?: string | null
          p_api_key?: string | null
          p_capability_key?: string | null
          p_checkout_session_id?: string | null
          p_environment?: string | null
          p_metadata?: Json | null
          p_network_membership_id: string
          p_operator_fee_amount?: number | null
          p_operator_fee_currency?: APIEnums["currency_code"] | null
          p_refund_id?: string | null
          p_transaction_id?: string | null
          p_charge_type?: string | null
          p_application_fee_amount?: number | null
          p_transfer_amount?: number | null
          p_transfer_group?: string | null
        }
        Returns: string
      }
      request_network_operator_live: {
        Args: { p_note?: string; p_organization_id: string }
        Returns: string
      }
      resolve_network_account_session: {
        Args: { p_client_secret_hash: string }
        Returns: Json
      }
      resolve_network_member_merchant_id: {
        Args: { p_network_membership_id: string }
        Returns: string
      }
      reverse_network_transfer_for_api: {
        Args: {
          p_actor_merchant_id?: string | null
          p_amount?: number | null
          p_api_key?: string | null
          p_description?: string | null
          p_idempotency_key?: string | null
          p_metadata?: Json | null
          p_operator_organization_id: string
          p_transfer_id: string
        }
        Returns: Json
      }
      set_network_capability_grant: {
        Args: {
          p_capability_key: string
          p_environment: string
          p_granted_by?: string | null
          p_metadata?: Json | null
          p_network_membership_id: string
          p_status?: APIEnums["network_capability_status"] | null
        }
        Returns: string
      }
      set_network_membership_fee_rule: {
        Args: {
          p_actor_merchant_id?: string | null
          p_fee_rule_id?: string | null
          p_network_membership_id: string
        }
        Returns: boolean
      }
      set_network_membership_status: {
        Args: {
          p_actor_merchant_id?: string | null
          p_metadata?: Json | null
          p_network_membership_id: string
          p_status: APIEnums["network_membership_status"]
        }
        Returns: boolean
      }
      set_network_operator_default_fee_rule: {
        Args: {
          p_actor_merchant_id?: string | null
          p_fee_rule_id?: string | null
          p_operator_organization_id: string
        }
        Returns: boolean
      }
      settle_network_refund: {
        Args: {
          p_refund_application_fee?: boolean | null
          p_refund_id: string
          p_reverse_transfer?: boolean | null
        }
        Returns: Json
      }
      settle_network_transaction: {
        Args: { p_transaction_id: string }
        Returns: boolean
      }
      setup_network_operator_profile: {
        Args: {
          p_acknowledge_responsibilities?: boolean | null
          p_branding?: Json | null
          p_charge_model: string
          p_default_capabilities?: string[] | null
          p_fees_collector?: string | null
          p_losses_collector?: string | null
          p_member_dashboard?: string | null
          p_onboarding_mode?: string | null
          p_organization_id: string
          p_platform_type: string
          p_profile?: Json | null
        }
        Returns: string
      }
      update_network_operator_profile: {
        Args: {
          p_branding?: Json | null
          p_charge_model?: string | null
          p_fees_collector?: string | null
          p_losses_collector?: string | null
          p_member_dashboard?: string | null
          p_onboarding_mode?: string | null
          p_organization_id: string
          p_platform_type?: string | null
          p_profile?: Json | null
        }
        Returns: string
      }
      upsert_network_customer_metadata_for_api: {
        Args: {
          p_customer_id: string
          p_metadata?: Json | null
          p_network_membership_id: string
          p_public_account_id?: string | null
        }
        Returns: {
          address: string
          city: string
          country: string
          created_at: string
          customer_id: string
          email: string
          environment: string
          is_business: boolean
          metadata: Json
          name: string
          organization_id: string
          phone_number: string
          postal_code: string
          updated_at: string
          whatsapp_number: string
        }[]
      }
      upsert_network_operator_fee_rule: {
        Args: {
          p_currency_code?: APIEnums["currency_code"] | null
          p_fee_rule_id?: string | null
          p_fee_type?: APIEnums["network_operator_fee_type"] | null
          p_fixed_amount?: number | null
          p_max_amount?: number | null
          p_metadata?: Json | null
          p_min_amount?: number | null
          p_name?: string | null
          p_operator_organization_id: string
          p_percent_bps?: number | null
          p_status?: APIEnums["network_fee_rule_status"] | null
        }
        Returns: string
      }
      check_entitlement: {
        Args: { p_customer_id: string; p_feature_key: string }
        Returns: Json
      }
      create_entitlement: {
        Args: {
          p_description?: string | null
          p_feature_key: string
          p_name: string
          p_organization_id: string
        }
        Returns: string
      }
      create_meter: {
        Args: {
          p_aggregation?: Json | null
          p_filter?: Json | null
          p_name: string
          p_organization_id: string
          p_product_id?: string | null
        }
        Returns: string
      }
      create_usage_subscription: {
        Args: {
          p_customer_id: string
          p_environment?: string | null
          p_merchant_id: string
          p_metadata?: Json | null
          p_organization_id: string
          p_price_id?: string | null
          p_product_id: string
        }
        Returns: string
      }
      credit_usage_wallet: {
        Args: {
          p_customer_id: string
          p_meter_id: string
          p_reason?: string | null
          p_units: number
        }
        Returns: Json
      }
      enqueue_usage_event: {
        Args: {
          p_code: string
          p_created_by?: string | null
          p_customer_id: string
          p_environment?: string | null
          p_organization_id: string
          p_properties?: Json | null
          p_quantity?: number | null
          p_subscription_id?: string | null
          p_timestamp?: string | null
          p_transaction_id: string
        }
        Returns: string
      }
      fetch_combined_revenue_metrics: {
        Args: {
          p_end_date: string
          p_environment?: string | null
          p_organization_id: string
          p_start_date: string
        }
        Returns: Json
      }
      get_meter_api: {
        Args: { p_meter_id: string; p_organization_id: string }
        Returns: {
          aggregation: Json
          created_at: string
          filter: Json
          is_active: boolean
          meter_id: string
          name: string
          organization_id: string
          product_id: string | null
          public_id: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "meters"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_meter_balance_api: {
        Args: {
          p_customer_id: string
          p_meter_id: string
          p_organization_id: string
        }
        Returns: {
          balance: number
          balance_id: string
          consumed_units: number
          credited_units: number
          customer_id: string
          last_event_id: string
          meter_id: string
          updated_at: string
        }[]
      }
      get_partner_usage_summary: {
        Args: { p_partner_id: string }
        Returns: {
          accounts_created_today: number
          accounts_created_total: number
          active_keys: number
          daily_limit: number
          partner_id: string
        }[]
      }
      get_subscription_usage_api: {
        Args: { p_organization_id: string; p_subscription_id: string }
        Returns: Json
      }
      get_usage_event_api: {
        Args: { p_event_id: string; p_organization_id: string }
        Returns: {
          code: string | null
          created_at: string
          created_by: string | null
          customer_id: string | null
          environment: string
          error_message: string | null
          event_data: Json | null
          event_id: string
          event_name: string
          metadata: Json | null
          meter_id: string | null
          occurred_at: string
          organization_id: string | null
          processing_status: APIEnums["event_processing_status"]
          product_id: string | null
          properties: Json
          quantity: number
          subscription_id: string | null
          transaction_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "events"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      list_billing_periods_api: {
        Args: {
          p_environment?: string | null
          p_limit?: number | null
          p_offset?: number | null
          p_organization_id: string
          p_subscription_id?: string | null
        }
        Returns: {
          billing_period_id: string
          created_at: string
          customer_id: string
          customer_invoice_id: string
          period_end: string
          period_start: string
          product_id: string
          status: APIEnums["billing_period_status"]
          subscription_id: string
          total_count: number
        }[]
      }
      list_meters_api: {
        Args: {
          p_is_active?: boolean | null
          p_organization_id: string
          p_product_id?: string | null
        }
        Returns: {
          aggregation: Json
          created_at: string
          filter: Json
          is_active: boolean
          meter_id: string
          name: string
          organization_id: string
          product_id: string | null
          public_id: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "meters"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      list_stale_pending_usage_events: {
        Args: { p_limit?: number; p_stale_after_seconds?: number }
        Returns: {
          code: string
          customer_id: string
          event_id: string
          organization_id: string
        }[]
      }
      list_usage_events_api: {
        Args: {
          p_code?: string | null
          p_customer_id?: string | null
          p_environment?: string | null
          p_limit?: number | null
          p_offset?: number | null
          p_organization_id: string
          p_status?: string | null
        }
        Returns: {
          code: string
          created_at: string
          customer_id: string
          error_message: string
          event_id: string
          meter_id: string
          occurred_at: string
          processing_status: APIEnums["event_processing_status"]
          quantity: number
          subscription_id: string
          total_count: number
          transaction_id: string
        }[]
      }
      process_usage_billing_cycle: {
        Args: { p_as_of_date?: string | null }
        Returns: Json
      }
      process_usage_event: { Args: { p_event_id: string }; Returns: Json }
      process_usage_invoice_dunning: {
        Args: { p_grace_days?: number | null }
        Returns: number
      }
      update_meter_api: {
        Args: {
          p_aggregation?: Json | null
          p_filter?: Json | null
          p_is_active?: boolean | null
          p_meter_id: string
          p_organization_id: string
        }
        Returns: string
      }
      fetch_disputes: {
        Args: {
          p_end_date?: string | null
          p_organization_id: string
          p_page?: number | null
          p_page_size?: number | null
          p_start_date?: string | null
          p_status?: APIEnums["dispute_status"] | null
        }
        Returns: {
          amount: number
          created_at: string
          currency_code: APIEnums["currency_code"]
          customer_email: string
          customer_id: string
          customer_name: string
          dispute_id: string
          fee_amount: number
          reason: string
          resolution_date: string
          resolution_details: string
          status: APIEnums["dispute_status"]
          stripe_charge_id: string
          stripe_dispute_id: string
          transaction_id: string
          updated_at: string
        }[]
      }
      fetch_risk_assessments: {
        Args: {
          p_decision?: APIEnums["radar_decision"] | null
          p_end_date?: string | null
          p_organization_id: string
          p_page?: number | null
          p_page_size?: number | null
          p_rail?: APIEnums["radar_rail"] | null
          p_start_date?: string | null
        }
        Returns: {
          amount: number | null
          assessment_id: string
          created_at: string
          currency_code: APIEnums["currency_code"] | null
          customer_id: string | null
          decision: APIEnums["radar_decision"]
          metadata: Json
          organization_id: string
          provider: APIEnums["radar_signal_provider"]
          rail: APIEnums["radar_rail"]
          risk_score: number
          signals: Json
          transaction_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "risk_assessments"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_dispute_api: {
        Args: { p_dispute_id: string; p_organization_id: string }
        Returns: {
          amount: number
          created_at: string
          currency_code: APIEnums["currency_code"]
          customer_email: string
          customer_id: string
          customer_name: string
          dispute_id: string
          evidence_details: Json
          fee_amount: number
          reason: string
          resolution_date: string
          resolution_details: string
          status: APIEnums["dispute_status"]
          stripe_charge_id: string
          stripe_dispute_id: string
          transaction_gross_amount: number
          transaction_id: string
          transaction_status: APIEnums["transaction_status"]
          updated_at: string
        }[]
      }
      get_dispute_by_stripe_id: {
        Args: { p_stripe_dispute_id: string }
        Returns: {
          dispute_id: string
          organization_id: string
        }[]
      }
      get_dispute_webhook_payload: {
        Args: { p_dispute_id: string }
        Returns: Json
      }
      get_organization_radar_settings_api: {
        Args: { p_organization_id: string }
        Returns: {
          enabled: boolean
          mode: APIEnums["radar_mode"]
          organization_id: string
          radar_meter_id: string
          stripe_radar_passthrough: boolean
        }[]
      }
      get_risk_assessment_api: {
        Args: { p_assessment_id: string; p_organization_id: string }
        Returns: {
          amount: number | null
          assessment_id: string
          created_at: string
          currency_code: APIEnums["currency_code"] | null
          customer_id: string | null
          decision: APIEnums["radar_decision"]
          metadata: Json
          organization_id: string
          provider: APIEnums["radar_signal_provider"]
          rail: APIEnums["radar_rail"]
          risk_score: number
          signals: Json
          transaction_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "risk_assessments"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      update_organization_radar_settings_api: {
        Args: {
          p_enabled?: boolean | null
          p_mode?: APIEnums["radar_mode"] | null
          p_organization_id: string
          p_stripe_radar_passthrough?: boolean | null
        }
        Returns: {
          enabled: boolean
          mode: APIEnums["radar_mode"]
          organization_id: string
          radar_meter_id: string
          stripe_radar_passthrough: boolean
        }[]
      }
      create_agent_event_subscription: {
        Args: {
          p_channel: string
          p_organization_id: string
          p_topics: string[]
          p_webhook_url?: string | null
        }
        Returns: {
          channel: string
          created_at: string
          organization_id: string
          subscription_id: string
          topics: string[]
          webhook_url: string
        }[]
      }
      create_agent_handoff: {
        Args: {
          p_context?: Json | null
          p_organization_id: string
          p_task: string
          p_to_agent: string
          p_trace_id?: string | null
        }
        Returns: {
          context: Json
          created_at: string
          handoff_id: string
          organization_id: string
          status: string
          task: string
          to_agent: string
          trace_id: string
        }[]
      }
      create_agent_workflow_run: {
        Args: {
          p_idempotency_key?: string | null
          p_name: string
          p_organization_id: string
          p_steps: Json
        }
        Returns: {
          created_at: string
          idempotency_key: string
          name: string
          organization_id: string
          run_id: string
          status: string
          steps: Json
          updated_at: string
        }[]
      }
      delete_agent_event_subscription: {
        Args: { p_organization_id: string; p_subscription_id: string }
        Returns: boolean
      }
      get_agent_event_subscription: {
        Args: { p_organization_id: string; p_subscription_id: string }
        Returns: {
          channel: string
          created_at: string
          organization_id: string
          subscription_id: string
          topics: string[]
          webhook_url: string
        }[]
      }
      get_agent_handoff: {
        Args: { p_handoff_id: string; p_organization_id: string }
        Returns: {
          context: Json
          created_at: string
          handoff_id: string
          organization_id: string
          status: string
          task: string
          to_agent: string
          trace_id: string
        }[]
      }
      get_agent_workflow_run: {
        Args: { p_organization_id: string; p_run_id: string }
        Returns: {
          created_at: string
          idempotency_key: string
          name: string
          organization_id: string
          run_id: string
          status: string
          steps: Json
          updated_at: string
        }[]
      }
      list_agent_event_subscriptions: {
        Args: { p_organization_id: string }
        Returns: {
          channel: string
          created_at: string
          organization_id: string
          subscription_id: string
          topics: string[]
          webhook_url: string
        }[]
      }
      update_agent_workflow_run_step: {
        Args: {
          p_organization_id: string
          p_run_id: string
          p_status: string
          p_step_id: string
        }
        Returns: {
          created_at: string
          idempotency_key: string
          name: string
          organization_id: string
          run_id: string
          status: string
          steps: Json
          updated_at: string
        }[]
      }
      oauth_create_authorization_code: {
        Args: {
          p_api_key?: string | null
          p_client_id: string
          p_code_challenge: string
          p_code_challenge_method: string
          p_grant_type?: string | null
          p_organization_id?: string | null
          p_provisioning_key_id?: string | null
          p_redirect_uri: string
          p_resource: string
          p_scope: string
          p_ttl_seconds?: number | null
          p_user_id: string
        }
        Returns: {
          code: string
          expires_at: string
        }[]
      }
      oauth_exchange_authorization_code: {
        Args: {
          p_client_id: string
          p_code: string
          p_code_verifier: string
          p_redirect_uri: string
        }
        Returns: {
          access_level: string
          access_token: string
          connection_key: string
          expires_in: number
          grant_type: string
          organization_id: string
          provisioning_key: string
          refresh_token: string
          scope: string
          token_type: string
        }[]
      }
      oauth_get_client: {
        Args: { p_client_id: string }
        Returns: {
          client_id: string
          client_name: string
          grant_types: string[]
          is_active: boolean
          redirect_uris: string[]
          response_types: string[]
          scopes: string[]
          token_endpoint_auth_method: string
        }[]
      }
      oauth_introspect_token: {
        Args: { p_token: string }
        Returns: {
          access_level: string
          active: boolean
          client_id: string
          connection_key: string
          exp: number
          grant_type: string
          organization_id: string
          provisioning_key: string
          provisioning_key_id: string
          scope: string
          sub: string
          token_type: string
          username: string
        }[]
      }
      oauth_mint_merchant_connection_key: {
        Args: {
          p_access_level: string
          p_client_name: string
          p_environment?: string | null
          p_merchant_id: string
          p_organization_id: string
        }
        Returns: {
          api_key: string
        }[]
      }
      oauth_refresh_access_token: {
        Args: { p_client_id: string; p_refresh_token: string }
        Returns: {
          access_level: string
          access_token: string
          connection_key: string
          expires_in: number
          grant_type: string
          organization_id: string
          provisioning_key: string
          refresh_token: string
          scope: string
          token_type: string
        }[]
      }
      oauth_register_client: {
        Args: {
          p_client_name: string
          p_grant_types?: string[] | null
          p_redirect_uris: string[]
          p_response_types?: string[] | null
          p_scopes?: string[] | null
          p_token_endpoint_auth_method?: string | null
        }
        Returns: {
          client_id: string
          client_name: string
          client_secret: string
          grant_types: string[]
          redirect_uris: string[]
          response_types: string[]
          scopes: string[]
          token_endpoint_auth_method: string
        }[]
      }
      oauth_revoke_token: { Args: { p_token: string }; Returns: boolean }
      oauth_verify_client_secret: {
        Args: { p_client_id: string; p_client_secret: string }
        Returns: boolean
      }
      check_provisioning_daily_quota: {
        Args: { p_provisioning_key_id: string }
        Returns: {
          accounts_created_today: number
          allowed: boolean
          daily_limit: number
          message: string
        }[]
      }
      complete_onboarding: {
        Args: {
          p_address_proof_url?: string | null
          p_avatar_url: string
          p_business_description?: string | null
          p_business_registration_url?: string | null
          p_country: string
          p_document_extraction?: Json | null
          p_first_name: string
          p_id_document_number?: string | null
          p_identity_proof_url?: string | null
          p_is_authorized_signatory?: boolean | null
          p_is_starter_business?: boolean | null
          p_last_name: string
          p_legal_city?: string | null
          p_legal_country?: string | null
          p_legal_organization_name?: string | null
          p_legal_postal_code?: string | null
          p_legal_region?: string | null
          p_legal_street?: string | null
          p_logo_url: string
          p_merchant_id: string
          p_org_city: string
          p_org_country: string
          p_org_district: string
          p_org_email: string
          p_org_employee_number: string
          p_org_industry: string
          p_org_name: string
          p_org_phone_number: string
          p_org_postal_code: string
          p_org_region: string
          p_org_street: string
          p_org_website_url: string
          p_organization_position: string
          p_phone_number: string
          p_preferred_language: string
          p_proof_of_business?: string | null
          p_proof_of_business_url?: string | null
          p_signatory_email?: string | null
          p_signatory_name?: string | null
          p_tax_number?: string | null
        }
        Returns: undefined
      }
      get_active_merchant_organization: {
        Args: { p_merchant_id: string }
        Returns: {
          organization_id: string
          role: string
          team_status: string
        }[]
      }
      get_active_partner_provisioning_key: {
        Args: { p_external_user_ref: string; p_partner_id: string }
        Returns: {
          provisioning_key: string
          provisioning_key_id: string
        }[]
      }
      get_live_activation_status: {
        Args: { p_merchant_id: string; p_provisioning_key_id: string }
        Returns: Json
      }
      get_or_create_self_service_partner: {
        Args: { p_email: string; p_user_id: string }
        Returns: string
      }
      get_organization_kyc_status: {
        Args: { p_merchant_id: string; p_organization_id: string }
        Returns: {
          approved_at: string
          business_description: string
          created_at: string
          legal_representative_id_url: string
          status: APIEnums["kyc_status"]
        }[]
      }
      increment_provisioning_daily_usage: {
        Args: { p_provisioning_key_id: string }
        Returns: undefined
      }
      log_provisioning_audit: {
        Args: {
          p_action: string
          p_ip_address?: string | null
          p_merchant_id?: string | null
          p_metadata?: Json | null
          p_organization_id?: string | null
          p_provisioning_key_id: string
        }
        Returns: string
      }
      partner_list_provisioning_keys: {
        Args: {
          p_include_inactive?: boolean | null
          p_limit?: number | null
          p_offset?: number | null
          p_partner_id: string
        }
        Returns: {
          accounts_created_today: number
          created_at: string
          daily_account_limit: number
          environment: string
          external_user_ref: string
          is_active: boolean
          key_kind: APIEnums["provisioning_key_kind"]
          key_prefix: string
          name: string
          provisioning_key_id: string
          rate_limit_per_minute: number
        }[]
      }
      partner_mint_provisioning_key: {
        Args: {
          p_daily_account_limit?: number | null
          p_environment?: string | null
          p_external_user_ref?: string | null
          p_key_kind?: APIEnums["provisioning_key_kind"] | null
          p_name: string
          p_partner_id: string
          p_rate_limit_per_minute?: number | null
        }
        Returns: {
          environment: string
          external_user_ref: string
          key_kind: APIEnums["provisioning_key_kind"]
          name: string
          partner_name: string
          provisioning_key: string
          provisioning_key_id: string
        }[]
      }
      partner_revoke_provisioning_key: {
        Args: { p_partner_id: string; p_provisioning_key_id: string }
        Returns: boolean
      }
      provisioning_fetch_api_keys: {
        Args: { p_merchant_id: string; p_provisioning_key_id: string }
        Returns: {
          api_key: string
          environment: string
          is_active: boolean
          key_type: string
          name: string
        }[]
      }
      provisioning_get_onboarding_status: {
        Args: { p_merchant_id: string; p_provisioning_key_id: string }
        Returns: Json
      }
      provisioning_link_organization: {
        Args: { p_merchant_id: string; p_organization_id: string }
        Returns: undefined
      }
      register_provisioning_merchant_account: {
        Args: {
          p_merchant_id: string
          p_provisioning_key_id: string
          p_terms_accepted_at: string
          p_terms_version: string
        }
        Returns: undefined
      }
      request_live_activation: {
        Args: {
          p_merchant_id: string
          p_metadata?: Json | null
          p_provisioning_key_id: string
        }
        Returns: Json
      }
      complete_mtn_refund_provider: {
        Args: {
          p_mtn_metadata?: Json | null
          p_mtn_refund_reference_id?: string | null
          p_reason?: string | null
          p_refund_id: string
          p_transaction_id: string
        }
        Returns: Json
      }
      fetch_pending_webhook_outbox_jobs: {
        Args: { p_outbox_id: string }
        Returns: {
          authorized_events: APIEnums["webhook_event"][]
          created_by: string
          dispatch_id: string
          event_type: APIEnums["webhook_event"]
          is_active: boolean
          merchant_id: string
          organization_id: string
          outbox_id: string
          payload: Json
          url: string
          verification_token: string
          webhook_id: string
          webhook_organization_id: string
        }[]
      }
      get_organization_uemoa_country_code: {
        Args: { p_organization_id: string }
        Returns: string
      }
      list_customer_subscriptions: {
        Args: {
          p_customer_id?: string | null
          p_limit?: number | null
          p_merchant_id: string
          p_offset?: number | null
          p_status?: APIEnums["subscription_status"] | null
        }
        Returns: {
          created_at: string
          customer_email: string
          customer_id: string
          customer_name: string
          end_date: string
          merchant_id: string
          metadata: Json
          next_billing_date: string
          organization_id: string
          plan_amount: number
          plan_billing_frequency: APIEnums["billing_interval"]
          plan_currency_code: APIEnums["currency_code"]
          plan_name: string
          product_id: string
          start_date: string
          status: APIEnums["subscription_status"]
          subscription_id: string
          updated_at: string
        }[]
      }
    };
    Enums: {
      billing_interval:
        | "day"
        | "week"
        | "bi-weekly"
        | "month"
        | "bi-monthly"
        | "quarterly"
        | "semi-annual"
        | "year"
        | "lifetime"
        | "unit"
;
      billing_period_status: "open" | "closing" | "closed" | "invoiced" | "void";
      checkout_session_status: "open" | "completed" | "expired";
      currency_code: "XOF" | "USD" | "EUR";
      customer_type: "all" | "new" | "returning";
      discount_type: "percentage" | "fixed";
      dispute_status: "pending" | "resolved" | "closed";
      event_category:
        | "checkout"
        | "payment"
        | "auth"
        | "api"
        | "webhook"
        | "catalog"
        | "customer"
        | "subscription"
        | "system"
        | "onboarding"
;
      event_processing_status: "pending" | "processed" | "failed";
      event_severity: "info" | "warning" | "error" | "critical";
      event_type:
        | "validate_api_key"
        | "create_api_key"
        | "edit_api_key"
        | "remove_api_key"
        | "user_login"
        | "edit_user_password"
        | "create_pin"
        | "edit_pin"
        | "edit_user_details"
        | "authorize_user_2fa"
        | "create_user_2fa"
        | "remove_user_2fa"
        | "edit_user_phone"
        | "set_callback_url"
        | "update_webhook"
        | "add_bank_account"
        | "remove_bank_account"
        | "create_payout"
        | "beneficiary_payout_created"
        | "mass_beneficiary_payout_created"
        | "payout_status_change"
        | "process_payment"
        | "payment_status_change"
        | "create_refund"
        | "refund_status_change"
        | "create_dispute"
        | "dispute_status_change"
        | "list_checkout_sessions"
        | "update_subscription_plan"
        | "create_subscription"
        | "cancel_subscription"
        | "subscription_status_change"
        | "subscription_payment_failed"
        | "archive_plan"
        | "create_product"
        | "update_product"
        | "delete_product"
        | "archive_product"
        | "provider_status_change"
        | "provider_connection_error"
        | "provider_integration_success"
        | "system_maintenance"
        | "system_update"
        | "compliance_update"
        | "api_status_change"
        | "kyc_status_auto_updated"
        | "kyc_documents_submitted"
        | "customer_verification_required"
        | "customer_verification_success"
        | "customer_verification_failed"
        | "subscription_update"
        | "pause_subscription"
        | "resume_subscription"
        | "update_subscription_status"
;
      failed_payment_action: "cancel" | "pause" | "continue";
      fee_category: "payment_processing" | "payout" | "other";
      fee_subcategory:
        | "pos"
        | "bnpl"
        | "cards"
        | "mobile_money"
        | "bank_transfer_local"
        | "bank_transfer_international"
        | "bank_transfer_beneficiary"
        | "mobile_money_payout"
        | "mobile_money_beneficiary"
        | "refund"
        | "partial_refund"
        | "chargeback"
        | "currency_conversion"
        | "international_cards"
        | "subscription_payments"
;
      first_payment_type: "initial" | "non_initial" | "prorated";
      integration_source:
        | "system"
        | "shopify"
        | "woocommerce"
        | "prestashop"
        | "magento"
        | "odoo"
        | "bubble"
;
      invoice_status: "sent" | "paid" | "overdue" | "cancelled" | "draft";
      kyc_status:
        | "not_submitted"
        | "pending"
        | "not_authorized"
        | "approved"
        | "rejected"
        | "starter_business"
;
      link_type: "instant" | "product";
      network_capability_status:
        | "requested"
        | "active"
        | "restricted"
        | "revoked"
;
      network_enrollment_status:
        | "created"
        | "opened"
        | "submitted"
        | "approved"
        | "completed"
        | "expired"
        | "cancelled"
;
      network_fee_entry_status: "pending" | "posted" | "reversed" | "voided";
      network_fee_entry_type: "charge" | "refund_reversal" | "adjustment";
      network_transfer_status: "pending" | "posted" | "reversed" | "failed";
      network_transfer_type:
        | "destination"
        | "separate"
        | "operator_fee"
        | "processing_fee_cover"
        | "fee_reversal"
        | "transfer_reversal"
        | "loss_cover"
;
      network_fee_rule_status: "active" | "inactive" | "archived";
      network_membership_status:
        | "invited"
        | "pending_member_acceptance"
        | "pending_review"
        | "active"
        | "restricted"
        | "suspended"
        | "terminated"
;
      network_operator_fee_type: "fixed" | "percentage" | "blended";
      onboarding_status:
        | "pending"
        | "completed"
        | "skipped"
        | "failed"
        | "in_progress"
;
      organization_status: "active" | "inactive" | "suspended";
      organization_verification_status: "unverified" | "starter" | "verified";
      payment_method_code:
        | "CARDS"
        | "MOBILE_MONEY"
        | "BANK_TRANSFER"
        | "BNPL"
        | "FREE"
;
      payout_status: "pending" | "processing" | "completed" | "failed";
      platform_partner_status: "pending" | "active" | "suspended";
      pricing_model: "standard" | "pay_what_you_want" | "tiered" | "volume";
      pricing_plan_type: "fixed" | "volume_tiered" | "custom";
      product_fulfillment_type: "digital" | "physical" | "hybrid";
      product_type: "one_time" | "recurring" | "usage_based";
      provider_code:
        | "WAVE"
        | "JUMBO"
        | "MTN"
        | "STRIPE"
        | "SPI"
        | "CYBERSOURCE"
        | "FREE"
        | "GIM"
;
      provider_payment_status:
        | "processing"
        | "cancelled"
        | "succeeded"
        | "expired"
        | "refunded"
;
      provisioning_key_kind:
        | "platform"
        | "partner_subkey"
        | "self_service"
        | "bootstrap"
;
      qr_code_type: "static" | "dynamic";
      radar_decision: "allow" | "flag" | "block";
      radar_mode: "monitor" | "block";
      radar_rail: "card" | "mtn" | "wave";
      radar_signal_provider: "lomi" | "stripe";
      refund_status: "pending" | "completed" | "failed";
      spi_account_status: "OUVERT" | "BLOQUE" | "CLOTURE";
      spi_account_type:
        | "CACC"
        | "CARD"
        | "CASH"
        | "CHAR"
        | "CISH"
        | "CURR"
        | "DPST"
        | "SVGS"
        | "ULAA"
;
      spi_alias_type: "SHID" | "MBNO" | "MCOD";
      spi_document_type:
        | "CINV"
        | "CMCN"
        | "DISP"
        | "PUOR"
        | "CONT"
        | "INVC"
        | "PMNT"
        | "TPMT"
;
      spi_payment_category:
        | "631"
        | "000"
        | "400"
        | "733"
        | "300"
        | "999"
        | "500"
        | "521"
        | "401"
;
      spi_payment_flow_type:
        | "BANK_TO_BANK"
        | "BANK_TO_WALLET"
        | "WALLET_TO_BANK"
        | "WALLET_TO_WALLET"
        | "INTRA_ACCOUNT"
;
      spi_payment_request_category: "500" | "521" | "401";
      spi_payment_status: "INITIE" | "ENVOYE" | "IRREVOCABLE" | "REJETE";
      spi_rejection_reason:
        | "BE23"
        | "DU03"
        | "AC04"
        | "AC06"
        | "AEXR"
        | "AG03"
        | "AG10"
        | "AG11"
        | "ALAC"
        | "AM02"
        | "AM09"
        | "AM14"
        | "APAR"
        | "RR07"
        | "FR01"
        | "AB03"
        | "AB04"
        | "AB08"
        | "AB09"
        | "AC03"
        | "AG01"
        | "AM04"
        | "RR04"
        | "CUST"
        | "ARDT"
;
      spi_webhook_event_code:
        | "PAIEMENT_RECU"
        | "PAIEMENT_ENVOYE"
        | "PAIEMENT_REJETE"
        | "RTP_RECU"
        | "RTP_REJETE"
        | "RETOUR_ENVOYE"
        | "RETOUR_REJETE"
        | "RETOUR_RECU"
        | "ANNULATION_DEMANDE"
        | "ANNULATION_REJETE"
;
      subscription_status:
        | "pending"
        | "active"
        | "paused"
        | "cancelled"
        | "expired"
        | "past_due"
        | "trial"
;
      transaction_status:
        | "pending"
        | "completed"
        | "failed"
        | "refunded"
        | "expired"
        | "held"
;
      transaction_type: "payment" | "instalment";
      usage_aggregation: "sum" | "max" | "last_during_period" | "last_ever";
      usage_frequency:
        | "total"
        | "per_customer"
        | "per_day"
        | "per_week"
        | "per_month"
;
      webhook_event:
        | "PAYMENT_CREATED"
        | "PAYMENT_SUCCEEDED"
        | "PAYMENT_FAILED"
        | "PURCHASE_FULFILLED"
        | "REFUND_CREATED"
        | "REFUND_COMPLETED"
        | "REFUND_FAILED"
        | "SUBSCRIPTION_CREATED"
        | "SUBSCRIPTION_RENEWED"
        | "SUBSCRIPTION_CANCELLED"
        | "SUBSCRIPTION_UPDATED"
        | "NETWORK_ENROLLMENT_CREATED"
        | "NETWORK_ENROLLMENT_COMPLETED"
        | "NETWORK_MEMBERSHIP_ACTIVE"
        | "NETWORK_MEMBERSHIP_RESTRICTED"
        | "NETWORK_MEMBERSHIP_TERMINATED"
        | "NETWORK_PAYMENT_CREATED"
        | "NETWORK_OPERATOR_FEE_CREATED"
        | "NETWORK_OPERATOR_FEE_REVERSED"
        | "NETWORK_TRANSFER_CREATED"
        | "NETWORK_TRANSFER_REVERSED"
        | "NETWORK_MEMBER_PAYOUT_PAID"
        | "USAGE_RECORDED"
        | "USAGE_INVOICE_CREATED"
        | "USAGE_INVOICE_PAID"
        | "USAGE_INVOICE_OVERDUE"
        | "SUBSCRIPTION_USAGE_PERIOD_CLOSED"
        | "DISPUTE_CREATED"
        | "DISPUTE_UPDATED"
        | "DISPUTE_CLOSED"
        | "PAYMENT_RISK_FLAGGED"
        | "PAYMENT_RISK_BLOCKED"
        | "PAYOUT_CREATED"
        | "PAYOUT_COMPLETED"
        | "PAYOUT_FAILED"
;
    };
  };
};

/**
 * API Enums - Exposed enum types for API usage
 */
export type APIEnums = Database["public"]["Enums"];

export type BillingInterval = APIEnums["billing_interval"];
export type BillingPeriodStatus = APIEnums["billing_period_status"];
export type CheckoutSessionStatus = APIEnums["checkout_session_status"];
export type CurrencyCode = APIEnums["currency_code"];
export type CustomerType = APIEnums["customer_type"];
export type DiscountType = APIEnums["discount_type"];
export type DisputeStatus = APIEnums["dispute_status"];
export type EventCategory = APIEnums["event_category"];
export type EventProcessingStatus = APIEnums["event_processing_status"];
export type EventSeverity = APIEnums["event_severity"];
export type EventType = APIEnums["event_type"];
export type FailedPaymentAction = APIEnums["failed_payment_action"];
export type FeeCategory = APIEnums["fee_category"];
export type FeeSubcategory = APIEnums["fee_subcategory"];
export type FirstPaymentType = APIEnums["first_payment_type"];
export type IntegrationSource = APIEnums["integration_source"];
export type InvoiceStatus = APIEnums["invoice_status"];
export type KycStatus = APIEnums["kyc_status"];
export type LinkType = APIEnums["link_type"];
export type NetworkCapabilityStatus = APIEnums["network_capability_status"];
export type NetworkEnrollmentStatus = APIEnums["network_enrollment_status"];
export type NetworkFeeEntryStatus = APIEnums["network_fee_entry_status"];
export type NetworkFeeEntryType = APIEnums["network_fee_entry_type"];
export type NetworkTransferStatus = APIEnums["network_transfer_status"];
export type NetworkTransferType = APIEnums["network_transfer_type"];
export type NetworkFeeRuleStatus = APIEnums["network_fee_rule_status"];
export type NetworkMembershipStatus = APIEnums["network_membership_status"];
export type NetworkOperatorFeeType = APIEnums["network_operator_fee_type"];
export type OnboardingStatus = APIEnums["onboarding_status"];
export type OrganizationStatus = APIEnums["organization_status"];
export type OrganizationVerificationStatus = APIEnums["organization_verification_status"];
export type PaymentMethodCode = APIEnums["payment_method_code"];
export type PayoutStatus = APIEnums["payout_status"];
export type PlatformPartnerStatus = APIEnums["platform_partner_status"];
export type PricingModel = APIEnums["pricing_model"];
export type PricingPlanType = APIEnums["pricing_plan_type"];
export type ProductFulfillmentType = APIEnums["product_fulfillment_type"];
export type ProductType = APIEnums["product_type"];
export type ProviderCode = APIEnums["provider_code"];
export type ProviderPaymentStatus = APIEnums["provider_payment_status"];
export type ProvisioningKeyKind = APIEnums["provisioning_key_kind"];
export type QrCodeType = APIEnums["qr_code_type"];
export type RadarDecision = APIEnums["radar_decision"];
export type RadarMode = APIEnums["radar_mode"];
export type RadarRail = APIEnums["radar_rail"];
export type RadarSignalProvider = APIEnums["radar_signal_provider"];
export type RefundStatus = APIEnums["refund_status"];
export type SpiAccountStatus = APIEnums["spi_account_status"];
export type SpiAccountType = APIEnums["spi_account_type"];
export type SpiAliasType = APIEnums["spi_alias_type"];
export type SpiDocumentType = APIEnums["spi_document_type"];
export type SpiPaymentCategory = APIEnums["spi_payment_category"];
export type SpiPaymentFlowType = APIEnums["spi_payment_flow_type"];
export type SpiPaymentRequestCategory = APIEnums["spi_payment_request_category"];
export type SpiPaymentStatus = APIEnums["spi_payment_status"];
export type SpiRejectionReason = APIEnums["spi_rejection_reason"];
export type SpiWebhookEventCode = APIEnums["spi_webhook_event_code"];
export type SubscriptionStatus = APIEnums["subscription_status"];
export type TransactionStatus = APIEnums["transaction_status"];
export type TransactionType = APIEnums["transaction_type"];
export type UsageAggregation = APIEnums["usage_aggregation"];
export type UsageFrequency = APIEnums["usage_frequency"];
export type WebhookEvent = APIEnums["webhook_event"];

