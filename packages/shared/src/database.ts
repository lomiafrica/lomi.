export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      account_balance_history: {
        Row: {
          account_id: string
          change_amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string | null
          history_id: string
          new_balance: number
          operation_type: string
          organization_id: string
          payment_request_id: string | null
          payout_id: string | null
          previous_balance: number
          reference_id: string | null
          reference_type: string | null
          refund_id: string | null
          spi_account_number: string | null
          spi_date_envoi: string | null
          spi_date_irrevocabilite: string | null
          spi_statut: Database["public"]["Enums"]["spi_payment_status"] | null
          spi_tx_id: string | null
          transaction_id: string | null
        }
        Insert: {
          account_id: string
          change_amount: number
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          history_id?: string
          new_balance: number
          operation_type: string
          organization_id: string
          payment_request_id?: string | null
          payout_id?: string | null
          previous_balance: number
          reference_id?: string | null
          reference_type?: string | null
          refund_id?: string | null
          spi_account_number?: string | null
          spi_date_envoi?: string | null
          spi_date_irrevocabilite?: string | null
          spi_statut?: Database["public"]["Enums"]["spi_payment_status"] | null
          spi_tx_id?: string | null
          transaction_id?: string | null
        }
        Update: {
          account_id?: string
          change_amount?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          history_id?: string
          new_balance?: number
          operation_type?: string
          organization_id?: string
          payment_request_id?: string | null
          payout_id?: string | null
          previous_balance?: number
          reference_id?: string | null
          reference_type?: string | null
          refund_id?: string | null
          spi_account_number?: string | null
          spi_date_envoi?: string | null
          spi_date_irrevocabilite?: string | null
          spi_statut?: Database["public"]["Enums"]["spi_payment_status"] | null
          spi_tx_id?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_balance_history_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "account_balance_history_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "merchant_balance_summary"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "account_balance_history_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "account_balance_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "account_balance_history_payment_request_id_fkey"
            columns: ["payment_request_id"]
            isOneToOne: false
            referencedRelation: "payment_requests"
            referencedColumns: ["request_id"]
          },
          {
            foreignKeyName: "account_balance_history_payout_id_fkey"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "payouts"
            referencedColumns: ["payout_id"]
          },
          {
            foreignKeyName: "account_balance_history_refund_id_fkey"
            columns: ["refund_id"]
            isOneToOne: false
            referencedRelation: "refunds"
            referencedColumns: ["refund_id"]
          },
          {
            foreignKeyName: "account_balance_history_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      account_top_ups: {
        Row: {
          admin_notes: string | null
          amount: number
          bank_instructions: Json
          completed_by: string | null
          created_at: string
          created_by: string
          credited_at: string | null
          currency_code: Database["public"]["Enums"]["currency_code"]
          expires_at: string
          matched_bank_reference: string | null
          organization_id: string
          reference_code: string
          status: Database["public"]["Enums"]["account_top_up_status"]
          top_up_id: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          bank_instructions: Json
          completed_by?: string | null
          created_at?: string
          created_by: string
          credited_at?: string | null
          currency_code?: Database["public"]["Enums"]["currency_code"]
          expires_at: string
          matched_bank_reference?: string | null
          organization_id: string
          reference_code: string
          status?: Database["public"]["Enums"]["account_top_up_status"]
          top_up_id?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          bank_instructions?: Json
          completed_by?: string | null
          created_at?: string
          created_by?: string
          credited_at?: string | null
          currency_code?: Database["public"]["Enums"]["currency_code"]
          expires_at?: string
          matched_bank_reference?: string | null
          organization_id?: string
          reference_code?: string
          status?: Database["public"]["Enums"]["account_top_up_status"]
          top_up_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_top_ups_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "account_top_ups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "account_top_ups_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "account_top_ups_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      accounts: {
        Row: {
          account_id: string
          balance: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          is_spi_account: boolean
          organization_id: string
          spi_account_balance: number | null
          spi_account_balance_sync_error: string | null
          spi_account_balance_synced_at: string | null
          spi_account_number: string | null
          spi_account_status:
            | Database["public"]["Enums"]["spi_account_status"]
            | null
          spi_account_type:
            | Database["public"]["Enums"]["spi_account_type"]
            | null
          updated_at: string
        }
        Insert: {
          account_id?: string
          balance?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          is_spi_account?: boolean
          organization_id: string
          spi_account_balance?: number | null
          spi_account_balance_sync_error?: string | null
          spi_account_balance_synced_at?: string | null
          spi_account_number?: string | null
          spi_account_status?:
            | Database["public"]["Enums"]["spi_account_status"]
            | null
          spi_account_type?:
            | Database["public"]["Enums"]["spi_account_type"]
            | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          balance?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          is_spi_account?: boolean
          organization_id?: string
          spi_account_balance?: number | null
          spi_account_balance_sync_error?: string | null
          spi_account_balance_synced_at?: string | null
          spi_account_number?: string | null
          spi_account_status?:
            | Database["public"]["Enums"]["spi_account_status"]
            | null
          spi_account_type?:
            | Database["public"]["Enums"]["spi_account_type"]
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
      agent_event_subscriptions: {
        Row: {
          channel: string
          created_at: string
          organization_id: string
          subscription_id: string
          topics: string[]
          webhook_url: string | null
        }
        Insert: {
          channel: string
          created_at?: string
          organization_id: string
          subscription_id?: string
          topics?: string[]
          webhook_url?: string | null
        }
        Update: {
          channel?: string
          created_at?: string
          organization_id?: string
          subscription_id?: string
          topics?: string[]
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_event_subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      agent_handoffs: {
        Row: {
          context: Json
          created_at: string
          handoff_id: string
          organization_id: string
          status: string
          task: string
          to_agent: string
          trace_id: string | null
        }
        Insert: {
          context?: Json
          created_at?: string
          handoff_id?: string
          organization_id: string
          status: string
          task: string
          to_agent: string
          trace_id?: string | null
        }
        Update: {
          context?: Json
          created_at?: string
          handoff_id?: string
          organization_id?: string
          status?: string
          task?: string
          to_agent?: string
          trace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_handoffs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      agent_workflow_runs: {
        Row: {
          created_at: string
          idempotency_key: string | null
          name: string
          organization_id: string
          run_id: string
          status: string
          steps: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          idempotency_key?: string | null
          name: string
          organization_id: string
          run_id?: string
          status: string
          steps?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          idempotency_key?: string | null
          name?: string
          organization_id?: string
          run_id?: string
          status?: string
          steps?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_workflow_runs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      analytics_shares: {
        Row: {
          chart_type: string | null
          created_at: string
          id: string
          image_url: string | null
          organization_id: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          chart_type?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          organization_id?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          chart_type?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          organization_id?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      api_idempotency_records: {
        Row: {
          actor_organization_id: string | null
          created_at: string
          endpoint_route: string
          environment: string
          expires_at: string
          idempotency_key: string
          idempotency_record_id: string
          network_account_id: string | null
          network_membership_id: string | null
          organization_id: string
          request_fingerprint: string
          response_payload: Json
          status: string
          target_organization_id: string | null
        }
        Insert: {
          actor_organization_id?: string | null
          created_at?: string
          endpoint_route: string
          environment: string
          expires_at?: string
          idempotency_key: string
          idempotency_record_id?: string
          network_account_id?: string | null
          network_membership_id?: string | null
          organization_id: string
          request_fingerprint: string
          response_payload?: Json
          status?: string
          target_organization_id?: string | null
        }
        Update: {
          actor_organization_id?: string | null
          created_at?: string
          endpoint_route?: string
          environment?: string
          expires_at?: string
          idempotency_key?: string
          idempotency_record_id?: string
          network_account_id?: string | null
          network_membership_id?: string | null
          organization_id?: string
          request_fingerprint?: string
          response_payload?: Json
          status?: string
          target_organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_idempotency_records_actor_organization_id_fkey"
            columns: ["actor_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "api_idempotency_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "api_idempotency_records_target_organization_id_fkey"
            columns: ["target_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "fk_api_idempotency_records_network_account"
            columns: ["network_account_id"]
            isOneToOne: false
            referencedRelation: "network_accounts"
            referencedColumns: ["network_account_id"]
          },
          {
            foreignKeyName: "fk_api_idempotency_records_network_membership"
            columns: ["network_membership_id"]
            isOneToOne: false
            referencedRelation: "network_memberships"
            referencedColumns: ["network_membership_id"]
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
      api_keys: {
        Row: {
          access_level: string
          api_key: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          environment: string
          expiration_date: string | null
          is_active: boolean
          key_type: string
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          access_level?: string
          api_key: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          environment?: string
          expiration_date?: string | null
          is_active?: boolean
          key_type?: string
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          access_level?: string
          api_key?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          environment?: string
          expiration_date?: string | null
          is_active?: boolean
          key_type?: string
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "api_keys_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      api_rate_limit_policies: {
        Row: {
          api_key: string | null
          created_at: string
          endpoint_pattern: string
          environment: string
          is_active: boolean
          organization_id: string | null
          policy_id: string
          priority: number
          requests_per_day: number
          requests_per_minute: number
          scope_type: string
          updated_at: string
        }
        Insert: {
          api_key?: string | null
          created_at?: string
          endpoint_pattern: string
          environment: string
          is_active?: boolean
          organization_id?: string | null
          policy_id?: string
          priority?: number
          requests_per_day: number
          requests_per_minute: number
          scope_type: string
          updated_at?: string
        }
        Update: {
          api_key?: string | null
          created_at?: string
          endpoint_pattern?: string
          environment?: string
          is_active?: boolean
          organization_id?: string | null
          policy_id?: string
          priority?: number
          requests_per_day?: number
          requests_per_minute?: number
          scope_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_rate_limit_policies_api_key_fkey"
            columns: ["api_key"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["api_key"]
          },
          {
            foreignKeyName: "api_rate_limit_policies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      api_rate_limits: {
        Row: {
          api_key: string
          current_usage: number
          endpoint: string
          last_reset_at: string
          organization_id: string
          requests_limit: number
          time_window: string
        }
        Insert: {
          api_key: string
          current_usage?: number
          endpoint: string
          last_reset_at?: string
          organization_id: string
          requests_limit: number
          time_window: string
        }
        Update: {
          api_key?: string
          current_usage?: number
          endpoint?: string
          last_reset_at?: string
          organization_id?: string
          requests_limit?: number
          time_window?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_rate_limits_api_key_fkey"
            columns: ["api_key"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["api_key"]
          },
          {
            foreignKeyName: "api_rate_limits_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      api_request_events: {
        Row: {
          actor_organization_id: string | null
          api_key: string
          endpoint: string
          event_id: string
          ip_address: string | null
          network_account_id: string | null
          network_membership_id: string | null
          occurred_at: string
          organization_id: string
          request_method: string | null
          target_organization_id: string | null
        }
        Insert: {
          actor_organization_id?: string | null
          api_key: string
          endpoint: string
          event_id?: string
          ip_address?: string | null
          network_account_id?: string | null
          network_membership_id?: string | null
          occurred_at?: string
          organization_id: string
          request_method?: string | null
          target_organization_id?: string | null
        }
        Update: {
          actor_organization_id?: string | null
          api_key?: string
          endpoint?: string
          event_id?: string
          ip_address?: string | null
          network_account_id?: string | null
          network_membership_id?: string | null
          occurred_at?: string
          organization_id?: string
          request_method?: string | null
          target_organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_request_events_actor_organization_id_fkey"
            columns: ["actor_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "api_request_events_organization_id_api_key_fkey"
            columns: ["organization_id", "api_key"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["organization_id", "api_key"]
          },
          {
            foreignKeyName: "api_request_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "api_request_events_target_organization_id_fkey"
            columns: ["target_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "fk_api_request_events_network_account"
            columns: ["network_account_id"]
            isOneToOne: false
            referencedRelation: "network_accounts"
            referencedColumns: ["network_account_id"]
          },
          {
            foreignKeyName: "fk_api_request_events_network_membership"
            columns: ["network_membership_id"]
            isOneToOne: false
            referencedRelation: "network_memberships"
            referencedColumns: ["network_membership_id"]
          },
        ]
      }
      api_runtime_config: {
        Row: {
          config_key: string
          config_value: Json
          updated_at: string
        }
        Insert: {
          config_key: string
          config_value?: Json
          updated_at?: string
        }
        Update: {
          config_key?: string
          config_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      api_usage: {
        Row: {
          api_key: string
          endpoint: string
          ip_address: string | null
          last_request_at: string
          organization_id: string
          request_count: number
          request_method: string | null
          response_status: number | null
          response_time: number | null
        }
        Insert: {
          api_key: string
          endpoint: string
          ip_address?: string | null
          last_request_at?: string
          organization_id: string
          request_count?: number
          request_method?: string | null
          response_status?: number | null
          response_time?: number | null
        }
        Update: {
          api_key?: string
          endpoint?: string
          ip_address?: string | null
          last_request_at?: string
          organization_id?: string
          request_count?: number
          request_method?: string | null
          response_status?: number | null
          response_time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_api_key_fkey"
            columns: ["api_key"]
            isOneToOne: true
            referencedRelation: "api_keys"
            referencedColumns: ["api_key"]
          },
          {
            foreignKeyName: "api_usage_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      app_config: {
        Row: {
          created_at: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      assistant_conversations: {
        Row: {
          conversation_id: string
          created_at: string
          deleted_at: string | null
          is_deleted: boolean
          last_message_at: string
          merchant_id: string
          metadata: Json | null
          organization_id: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          conversation_id?: string
          created_at?: string
          deleted_at?: string | null
          is_deleted?: boolean
          last_message_at?: string
          merchant_id: string
          metadata?: Json | null
          organization_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          deleted_at?: string | null
          is_deleted?: boolean
          last_message_at?: string
          merchant_id?: string
          metadata?: Json | null
          organization_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assistant_conversations_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "assistant_conversations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      assistant_feedback: {
        Row: {
          created_at: string
          id: string
          merchant_id: string
          message: string
          sentiment: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          merchant_id: string
          message: string
          sentiment: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          merchant_id?: string
          message?: string
          sentiment?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assistant_feedback_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
        ]
      }
      assistant_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          message_id: string
          message_index: number
          metadata: Json | null
          model_used: string | null
          response_time_ms: number | null
          role: string
          tokens_used: number | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          message_id?: string
          message_index: number
          metadata?: Json | null
          model_used?: string | null
          response_time_ms?: number | null
          role: string
          tokens_used?: number | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          message_id?: string
          message_index?: number
          metadata?: Json | null
          model_used?: string | null
          response_time_ms?: number | null
          role?: string
          tokens_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assistant_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "assistant_conversations"
            referencedColumns: ["conversation_id"]
          },
        ]
      }
      assistant_org_settings: {
        Row: {
          assistant_enabled: boolean
          auto_approved_tool_ids: string[]
          disabled_tool_ids: string[]
          monthly_message_limit: number | null
          organization_id: string
          updated_at: string
          updated_by: string | null
          write_tools_enabled: boolean
        }
        Insert: {
          assistant_enabled?: boolean
          auto_approved_tool_ids?: string[]
          disabled_tool_ids?: string[]
          monthly_message_limit?: number | null
          organization_id: string
          updated_at?: string
          updated_by?: string | null
          write_tools_enabled?: boolean
        }
        Update: {
          assistant_enabled?: boolean
          auto_approved_tool_ids?: string[]
          disabled_tool_ids?: string[]
          monthly_message_limit?: number | null
          organization_id?: string
          updated_at?: string
          updated_by?: string | null
          write_tools_enabled?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "assistant_org_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "assistant_org_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
        ]
      }
      assistant_runs: {
        Row: {
          conversation_id: string
          created_at: string
          environment: string
          merchant_id: string
          messages_snapshot: Json
          mode: string
          organization_id: string
          pending_gate: Json | null
          run_id: string
          session_approved_tools: string[]
          status: string
          updated_at: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          environment?: string
          merchant_id: string
          messages_snapshot?: Json
          mode?: string
          organization_id: string
          pending_gate?: Json | null
          run_id?: string
          session_approved_tools?: string[]
          status?: string
          updated_at?: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          environment?: string
          merchant_id?: string
          messages_snapshot?: Json
          mode?: string
          organization_id?: string
          pending_gate?: Json | null
          run_id?: string
          session_approved_tools?: string[]
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assistant_runs_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "assistant_conversations"
            referencedColumns: ["conversation_id"]
          },
          {
            foreignKeyName: "assistant_runs_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "assistant_runs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      assistant_tool_audit: {
        Row: {
          approval_source: string | null
          audit_id: string
          conversation_id: string | null
          created_at: string
          merchant_id: string
          organization_id: string
          result_summary: string | null
          run_id: string | null
          success: boolean
          tool_args: Json
          tool_id: string
        }
        Insert: {
          approval_source?: string | null
          audit_id?: string
          conversation_id?: string | null
          created_at?: string
          merchant_id: string
          organization_id: string
          result_summary?: string | null
          run_id?: string | null
          success: boolean
          tool_args?: Json
          tool_id: string
        }
        Update: {
          approval_source?: string | null
          audit_id?: string
          conversation_id?: string | null
          created_at?: string
          merchant_id?: string
          organization_id?: string
          result_summary?: string | null
          run_id?: string | null
          success?: boolean
          tool_args?: Json
          tool_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assistant_tool_audit_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "assistant_conversations"
            referencedColumns: ["conversation_id"]
          },
          {
            foreignKeyName: "assistant_tool_audit_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "assistant_tool_audit_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "assistant_tool_audit_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "assistant_runs"
            referencedColumns: ["run_id"]
          },
        ]
      }
      assistant_usage_counters: {
        Row: {
          message_count: number
          organization_id: string
          period_month: string
          updated_at: string
        }
        Insert: {
          message_count?: number
          organization_id: string
          period_month: string
          updated_at?: string
        }
        Update: {
          message_count?: number
          organization_id?: string
          period_month?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assistant_usage_counters_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      assistant_user_preferences: {
        Row: {
          auto_approved_tool_ids: string[]
          disabled_tool_ids: string[]
          merchant_id: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          auto_approved_tool_ids?: string[]
          disabled_tool_ids?: string[]
          merchant_id: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          auto_approved_tool_ids?: string[]
          disabled_tool_ids?: string[]
          merchant_id?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assistant_user_preferences_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "assistant_user_preferences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      auth_trusted_devices: {
        Row: {
          created_at: string
          device_id: string
          device_name: string
          expires_at: string
          id: string
          last_used_at: string | null
          merchant_id: string
        }
        Insert: {
          created_at?: string
          device_id: string
          device_name?: string
          expires_at: string
          id?: string
          last_used_at?: string | null
          merchant_id: string
        }
        Update: {
          created_at?: string
          device_id?: string
          device_name?: string
          expires_at?: string
          id?: string
          last_used_at?: string | null
          merchant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auth_trusted_devices_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
        ]
      }
      beneficiary_payouts: {
        Row: {
          account_id: string
          amount: number
          created_at: string
          created_by: string | null
          currency_code: Database["public"]["Enums"]["currency_code"]
          metadata: Json | null
          organization_id: string
          payment_method_code:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          payout_id: string
          payout_method_id: string | null
          provider_code: Database["public"]["Enums"]["provider_code"] | null
          spi_bulk_instruction_id: string | null
          status: Database["public"]["Enums"]["payout_status"]
          updated_at: string
        }
        Insert: {
          account_id: string
          amount: number
          created_at?: string
          created_by?: string | null
          currency_code: Database["public"]["Enums"]["currency_code"]
          metadata?: Json | null
          organization_id: string
          payment_method_code?:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          payout_id?: string
          payout_method_id?: string | null
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          spi_bulk_instruction_id?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
        }
        Update: {
          account_id?: string
          amount?: number
          created_at?: string
          created_by?: string | null
          currency_code?: Database["public"]["Enums"]["currency_code"]
          metadata?: Json | null
          organization_id?: string
          payment_method_code?:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          payout_id?: string
          payout_method_id?: string | null
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          spi_bulk_instruction_id?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
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
      billing_period_usages: {
        Row: {
          amount: number
          billing_period_id: string
          billing_period_usage_id: string
          consumed_units: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          meter_id: string
          meter_name: string
          unit_price: number
        }
        Insert: {
          amount?: number
          billing_period_id: string
          billing_period_usage_id?: string
          consumed_units?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          meter_id: string
          meter_name: string
          unit_price?: number
        }
        Update: {
          amount?: number
          billing_period_id?: string
          billing_period_usage_id?: string
          consumed_units?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          meter_id?: string
          meter_name?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "billing_period_usages_billing_period_id_fkey"
            columns: ["billing_period_id"]
            isOneToOne: false
            referencedRelation: "billing_periods"
            referencedColumns: ["billing_period_id"]
          },
          {
            foreignKeyName: "billing_period_usages_meter_id_fkey"
            columns: ["meter_id"]
            isOneToOne: false
            referencedRelation: "meters"
            referencedColumns: ["meter_id"]
          },
        ]
      }
      billing_periods: {
        Row: {
          billing_period_id: string
          created_at: string
          customer_id: string
          customer_invoice_id: string | null
          environment: string
          metadata: Json
          organization_id: string
          period_end: string
          period_start: string
          price_id: string | null
          product_id: string
          status: Database["public"]["Enums"]["billing_period_status"]
          subscription_id: string
          updated_at: string
        }
        Insert: {
          billing_period_id?: string
          created_at?: string
          customer_id: string
          customer_invoice_id?: string | null
          environment?: string
          metadata?: Json
          organization_id: string
          period_end: string
          period_start: string
          price_id?: string | null
          product_id: string
          status?: Database["public"]["Enums"]["billing_period_status"]
          subscription_id: string
          updated_at?: string
        }
        Update: {
          billing_period_id?: string
          created_at?: string
          customer_id?: string
          customer_invoice_id?: string | null
          environment?: string
          metadata?: Json
          organization_id?: string
          period_end?: string
          period_start?: string
          price_id?: string | null
          product_id?: string
          status?: Database["public"]["Enums"]["billing_period_status"]
          subscription_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_periods_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "billing_periods_customer_invoice_id_fkey"
            columns: ["customer_invoice_id"]
            isOneToOne: false
            referencedRelation: "customer_invoices"
            referencedColumns: ["customer_invoice_id"]
          },
          {
            foreignKeyName: "billing_periods_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "billing_periods_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["price_id"]
          },
          {
            foreignKeyName: "billing_periods_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "billing_periods_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["subscription_id"]
          },
        ]
      }
      bnpl_configurations: {
        Row: {
          config_id: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_interest_rate: number
          installment_frequency: Database["public"]["Enums"]["billing_interval"]
          is_active: boolean
          max_installments: number
          max_product_amount: number | null
          merchant_processing_fixed_amount: number
          merchant_processing_percentage: number
          min_installments: number
          min_product_amount: number
          organization_id: string
          require_credit_check: boolean
          require_customer_verification: boolean
          updated_at: string
        }
        Insert: {
          config_id?: string
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_interest_rate?: number
          installment_frequency?: Database["public"]["Enums"]["billing_interval"]
          is_active?: boolean
          max_installments?: number
          max_product_amount?: number | null
          merchant_processing_fixed_amount?: number
          merchant_processing_percentage?: number
          min_installments?: number
          min_product_amount?: number
          organization_id: string
          require_credit_check?: boolean
          require_customer_verification?: boolean
          updated_at?: string
        }
        Update: {
          config_id?: string
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          customer_interest_rate?: number
          installment_frequency?: Database["public"]["Enums"]["billing_interval"]
          is_active?: boolean
          max_installments?: number
          max_product_amount?: number | null
          merchant_processing_fixed_amount?: number
          merchant_processing_percentage?: number
          min_installments?: number
          min_product_amount?: number
          organization_id?: string
          require_credit_check?: boolean
          require_customer_verification?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bnpl_configurations_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "bnpl_configurations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      bnpl_fee_tracking: {
        Row: {
          amount: number
          charged_to_customer_id: string | null
          collected_at: string | null
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string | null
          fee_payer: Database["public"]["Enums"]["fee_payer_type"]
          fee_tracking_id: string
          fee_type: Database["public"]["Enums"]["bnpl_fee_type"]
          installment_id: string | null
          metadata: Json | null
          organization_id: string
          plan_id: string
          status: Database["public"]["Enums"]["bnpl_status"]
          transaction_id: string | null
        }
        Insert: {
          amount: number
          charged_to_customer_id?: string | null
          collected_at?: string | null
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          fee_payer: Database["public"]["Enums"]["fee_payer_type"]
          fee_tracking_id?: string
          fee_type: Database["public"]["Enums"]["bnpl_fee_type"]
          installment_id?: string | null
          metadata?: Json | null
          organization_id: string
          plan_id: string
          status?: Database["public"]["Enums"]["bnpl_status"]
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          charged_to_customer_id?: string | null
          collected_at?: string | null
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          fee_payer?: Database["public"]["Enums"]["fee_payer_type"]
          fee_tracking_id?: string
          fee_type?: Database["public"]["Enums"]["bnpl_fee_type"]
          installment_id?: string | null
          metadata?: Json | null
          organization_id?: string
          plan_id?: string
          status?: Database["public"]["Enums"]["bnpl_status"]
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bnpl_fee_tracking_charged_to_customer_id_fkey"
            columns: ["charged_to_customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "bnpl_fee_tracking_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "bnpl_fee_tracking_installment_id_fkey"
            columns: ["installment_id"]
            isOneToOne: false
            referencedRelation: "installment_payments"
            referencedColumns: ["installment_id"]
          },
          {
            foreignKeyName: "bnpl_fee_tracking_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "bnpl_fee_tracking_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "installment_plans"
            referencedColumns: ["plan_id"]
          },
          {
            foreignKeyName: "bnpl_fee_tracking_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      bookable_services: {
        Row: {
          buffer_minutes: number
          created_at: string
          created_by: string | null
          currency_code: Database["public"]["Enums"]["currency_code"]
          deposit_type:
            | Database["public"]["Enums"]["service_deposit_type"]
            | null
          deposit_value: number | null
          description: string | null
          display_on_storefront: boolean
          duration_minutes: number
          environment: string
          images: string[] | null
          is_active: boolean
          name: string
          organization_id: string
          payment_mode: Database["public"]["Enums"]["service_payment_mode"]
          price: number
          public_id: string
          service_id: string
          updated_at: string
        }
        Insert: {
          buffer_minutes?: number
          created_at?: string
          created_by?: string | null
          currency_code: Database["public"]["Enums"]["currency_code"]
          deposit_type?:
            | Database["public"]["Enums"]["service_deposit_type"]
            | null
          deposit_value?: number | null
          description?: string | null
          display_on_storefront?: boolean
          duration_minutes?: number
          environment?: string
          images?: string[] | null
          is_active?: boolean
          name: string
          organization_id: string
          payment_mode?: Database["public"]["Enums"]["service_payment_mode"]
          price: number
          public_id?: string
          service_id?: string
          updated_at?: string
        }
        Update: {
          buffer_minutes?: number
          created_at?: string
          created_by?: string | null
          currency_code?: Database["public"]["Enums"]["currency_code"]
          deposit_type?:
            | Database["public"]["Enums"]["service_deposit_type"]
            | null
          deposit_value?: number | null
          description?: string | null
          display_on_storefront?: boolean
          duration_minutes?: number
          environment?: string
          images?: string[] | null
          is_active?: boolean
          name?: string
          organization_id?: string
          payment_mode?: Database["public"]["Enums"]["service_payment_mode"]
          price?: number
          public_id?: string
          service_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookable_services_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "bookable_services_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_id: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          deposit_amount: number | null
          ends_at: string
          notes: string | null
          organization_id: string
          payment_link_id: string | null
          payment_mode: Database["public"]["Enums"]["service_payment_mode"]
          service_id: string
          starts_at: string
          status: Database["public"]["Enums"]["booking_status"]
          total_price: number
          updated_at: string
        }
        Insert: {
          booking_id?: string
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          deposit_amount?: number | null
          ends_at: string
          notes?: string | null
          organization_id: string
          payment_link_id?: string | null
          payment_mode: Database["public"]["Enums"]["service_payment_mode"]
          service_id: string
          starts_at: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price: number
          updated_at?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          deposit_amount?: number | null
          ends_at?: string
          notes?: string | null
          organization_id?: string
          payment_link_id?: string | null
          payment_mode?: Database["public"]["Enums"]["service_payment_mode"]
          service_id?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "bookings_payment_link_id_fkey"
            columns: ["payment_link_id"]
            isOneToOne: false
            referencedRelation: "payment_links"
            referencedColumns: ["link_id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "bookable_services"
            referencedColumns: ["service_id"]
          },
        ]
      }
      browser_session_handoffs: {
        Row: {
          aal: string
          consumed_at: string | null
          created_at: string
          expires_at: string
          from_audience: string
          handoff_id: string
          supabase_refresh_ciphertext: string | null
          to_audience: string
          token_hash: string
          user_email: string | null
          user_id: string
        }
        Insert: {
          aal?: string
          consumed_at?: string | null
          created_at?: string
          expires_at: string
          from_audience: string
          handoff_id?: string
          supabase_refresh_ciphertext?: string | null
          to_audience: string
          token_hash: string
          user_email?: string | null
          user_id: string
        }
        Update: {
          aal?: string
          consumed_at?: string | null
          created_at?: string
          expires_at?: string
          from_audience?: string
          handoff_id?: string
          supabase_refresh_ciphertext?: string | null
          to_audience?: string
          token_hash?: string
          user_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      browser_sessions: {
        Row: {
          aal: string
          audience: string
          created_at: string
          expires_at: string
          idle_expires_at: string
          last_seen_at: string
          revoked_at: string | null
          session_id: string
          supabase_refresh_ciphertext: string | null
          token_hash: string
          user_email: string | null
          user_id: string
        }
        Insert: {
          aal?: string
          audience: string
          created_at?: string
          expires_at: string
          idle_expires_at: string
          last_seen_at?: string
          revoked_at?: string | null
          session_id?: string
          supabase_refresh_ciphertext?: string | null
          token_hash: string
          user_email?: string | null
          user_id: string
        }
        Update: {
          aal?: string
          audience?: string
          created_at?: string
          expires_at?: string
          idle_expires_at?: string
          last_seen_at?: string
          revoked_at?: string | null
          session_id?: string
          supabase_refresh_ciphertext?: string | null
          token_hash?: string
          user_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      checkout_session_line_items: {
        Row: {
          checkout_session_id: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          line_item_id: string
          metadata: Json | null
          price_id: string
          product_id: string
          quantity: number
          unit_amount: number
        }
        Insert: {
          checkout_session_id: string
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          line_item_id?: string
          metadata?: Json | null
          price_id: string
          product_id: string
          quantity?: number
          unit_amount: number
        }
        Update: {
          checkout_session_id?: string
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          line_item_id?: string
          metadata?: Json | null
          price_id?: string
          product_id?: string
          quantity?: number
          unit_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "checkout_session_line_items_checkout_session_id_fkey"
            columns: ["checkout_session_id"]
            isOneToOne: false
            referencedRelation: "checkout_sessions"
            referencedColumns: ["checkout_session_id"]
          },
          {
            foreignKeyName: "checkout_session_line_items_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "checkout_session_line_items_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["price_id"]
          },
          {
            foreignKeyName: "checkout_session_line_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
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
          currency_code: Database["public"]["Enums"]["currency_code"]
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
          integration_source: Database["public"]["Enums"]["integration_source"]
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
          qr_code_type: Database["public"]["Enums"]["qr_code_type"] | null
          quantity: number
          require_billing_address: boolean
          require_email: boolean
          require_name: boolean
          require_phone: boolean
          spi_account_number: string | null
          spi_qr_code_id: string | null
          status: Database["public"]["Enums"]["checkout_session_status"]
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
          currency_code: Database["public"]["Enums"]["currency_code"]
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
          integration_source?: Database["public"]["Enums"]["integration_source"]
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
          qr_code_type?: Database["public"]["Enums"]["qr_code_type"] | null
          quantity?: number
          require_billing_address?: boolean
          require_email?: boolean
          require_name?: boolean
          require_phone?: boolean
          spi_account_number?: string | null
          spi_qr_code_id?: string | null
          status?: Database["public"]["Enums"]["checkout_session_status"]
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
          currency_code?: Database["public"]["Enums"]["currency_code"]
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
          integration_source?: Database["public"]["Enums"]["integration_source"]
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
          qr_code_type?: Database["public"]["Enums"]["qr_code_type"] | null
          quantity?: number
          require_billing_address?: boolean
          require_email?: boolean
          require_name?: boolean
          require_phone?: boolean
          spi_account_number?: string | null
          spi_qr_code_id?: string | null
          status?: Database["public"]["Enums"]["checkout_session_status"]
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
      checkout_upsells: {
        Row: {
          created_at: string
          discount_type: Database["public"]["Enums"]["discount_type"] | null
          discount_value: number | null
          is_active: boolean
          metadata: Json
          organization_id: string
          sort_order: number
          source_product_id: string | null
          target_product_id: string
          updated_at: string
          upsell_id: string
          upsell_type: string
        }
        Insert: {
          created_at?: string
          discount_type?: Database["public"]["Enums"]["discount_type"] | null
          discount_value?: number | null
          is_active?: boolean
          metadata?: Json
          organization_id: string
          sort_order?: number
          source_product_id?: string | null
          target_product_id: string
          updated_at?: string
          upsell_id?: string
          upsell_type?: string
        }
        Update: {
          created_at?: string
          discount_type?: Database["public"]["Enums"]["discount_type"] | null
          discount_value?: number | null
          is_active?: boolean
          metadata?: Json
          organization_id?: string
          sort_order?: number
          source_product_id?: string | null
          target_product_id?: string
          updated_at?: string
          upsell_id?: string
          upsell_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkout_upsells_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "checkout_upsells_source_product_id_fkey"
            columns: ["source_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "checkout_upsells_target_product_id_fkey"
            columns: ["target_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      cli_device_requests: {
        Row: {
          created_at: string
          device_code: string
          expires_at: string
          interval: number
          merchant_id: string | null
          organization_id: string | null
          status: Database["public"]["Enums"]["cli_device_request_status"]
          user_code: string
        }
        Insert: {
          created_at?: string
          device_code: string
          expires_at: string
          interval?: number
          merchant_id?: string | null
          organization_id?: string | null
          status?: Database["public"]["Enums"]["cli_device_request_status"]
          user_code: string
        }
        Update: {
          created_at?: string
          device_code?: string
          expires_at?: string
          interval?: number
          merchant_id?: string | null
          organization_id?: string | null
          status?: Database["public"]["Enums"]["cli_device_request_status"]
          user_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "cli_device_requests_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "cli_device_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      coupon_product_links: {
        Row: {
          coupon_id: string
          created_at: string
          link_id: string
          product_id: string
        }
        Insert: {
          coupon_id: string
          created_at?: string
          link_id?: string
          product_id: string
        }
        Update: {
          coupon_id?: string
          created_at?: string
          link_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_product_links_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "discount_coupons"
            referencedColumns: ["coupon_id"]
          },
          {
            foreignKeyName: "coupon_product_links_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      coupon_usage: {
        Row: {
          checkout_session_id: string | null
          coupon_id: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string | null
          discount_amount: number
          final_amount: number
          organization_id: string
          original_amount: number
          transaction_id: string | null
          usage_id: string
          used_at: string
        }
        Insert: {
          checkout_session_id?: string | null
          coupon_id: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id?: string | null
          discount_amount: number
          final_amount: number
          organization_id: string
          original_amount: number
          transaction_id?: string | null
          usage_id?: string
          used_at?: string
        }
        Update: {
          checkout_session_id?: string | null
          coupon_id?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          customer_id?: string | null
          discount_amount?: number
          final_amount?: number
          organization_id?: string
          original_amount?: number
          transaction_id?: string | null
          usage_id?: string
          used_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usage_checkout_session_id_fkey"
            columns: ["checkout_session_id"]
            isOneToOne: false
            referencedRelation: "checkout_sessions"
            referencedColumns: ["checkout_session_id"]
          },
          {
            foreignKeyName: "coupon_usage_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "discount_coupons"
            referencedColumns: ["coupon_id"]
          },
          {
            foreignKeyName: "coupon_usage_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "coupon_usage_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "coupon_usage_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "coupon_usage_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      currencies: {
        Row: {
          code: Database["public"]["Enums"]["currency_code"]
          name: string
        }
        Insert: {
          code: Database["public"]["Enums"]["currency_code"]
          name: string
        }
        Update: {
          code?: Database["public"]["Enums"]["currency_code"]
          name?: string
        }
        Relationships: []
      }
      currency_conversion_history: {
        Row: {
          conversion_rate: number
          conversion_type: Database["public"]["Enums"]["conversion_type"]
          converted_amount: number
          created_at: string
          created_by: string | null
          from_currency: Database["public"]["Enums"]["currency_code"]
          id: string
          organization_id: string
          original_amount: number
          payout_id: string | null
          refund_id: string | null
          to_currency: Database["public"]["Enums"]["currency_code"]
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          conversion_rate: number
          conversion_type: Database["public"]["Enums"]["conversion_type"]
          converted_amount: number
          created_at?: string
          created_by?: string | null
          from_currency: Database["public"]["Enums"]["currency_code"]
          id?: string
          organization_id: string
          original_amount: number
          payout_id?: string | null
          refund_id?: string | null
          to_currency: Database["public"]["Enums"]["currency_code"]
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          conversion_rate?: number
          conversion_type?: Database["public"]["Enums"]["conversion_type"]
          converted_amount?: number
          created_at?: string
          created_by?: string | null
          from_currency?: Database["public"]["Enums"]["currency_code"]
          id?: string
          organization_id?: string
          original_amount?: number
          payout_id?: string | null
          refund_id?: string | null
          to_currency?: Database["public"]["Enums"]["currency_code"]
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "currency_conversion_history_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "currency_conversion_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "currency_conversion_history_payout_id_fkey"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "payouts"
            referencedColumns: ["payout_id"]
          },
          {
            foreignKeyName: "currency_conversion_history_refund_id_fkey"
            columns: ["refund_id"]
            isOneToOne: false
            referencedRelation: "refunds"
            referencedColumns: ["refund_id"]
          },
          {
            foreignKeyName: "currency_conversion_history_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      currency_conversion_rates: {
        Row: {
          created_at: string
          effective_at: string
          from_currency: Database["public"]["Enums"]["currency_code"]
          id: string
          inverse_rate: number
          rate: number
          source: string | null
          to_currency: Database["public"]["Enums"]["currency_code"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          effective_at?: string
          from_currency: Database["public"]["Enums"]["currency_code"]
          id?: string
          inverse_rate: number
          rate: number
          source?: string | null
          to_currency: Database["public"]["Enums"]["currency_code"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          effective_at?: string
          from_currency?: Database["public"]["Enums"]["currency_code"]
          id?: string
          inverse_rate?: number
          rate?: number
          source?: string | null
          to_currency?: Database["public"]["Enums"]["currency_code"]
          updated_at?: string
        }
        Relationships: []
      }
      customer_invoices: {
        Row: {
          amount: number | null
          amount_due: number | null
          amount_paid: number
          amount_remaining: number | null
          billing_period_end: string | null
          billing_period_start: string | null
          checkout_session_id: string | null
          created_at: string
          created_by: string | null
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_details: Json | null
          customer_id: string | null
          customer_invoice_id: string
          date: string | null
          description: string | null
          due_date: string
          environment: string
          file_path: string[] | null
          from_details: Json | null
          internal_note: string | null
          invoice_number: string | null
          line_items: Json | null
          metadata: Json | null
          note: string | null
          organization_id: string
          origin: string
          paid_at: string | null
          payment_details: Json | null
          payment_metadata: Json
          payment_request_id: string | null
          payment_url: string | null
          pdf_url: string | null
          price_id: string | null
          product_id: string | null
          public_id: string
          recurrence_rule_id: string | null
          recurring_sequence: number | null
          scheduled_at: string | null
          sent_at: string | null
          source_key: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          subscription_id: string | null
          template: Json | null
          token: string | null
          transaction_id: string | null
          updated_at: string
          viewed_at: string | null
        }
        Insert: {
          amount?: number | null
          amount_due?: number | null
          amount_paid?: number
          amount_remaining?: number | null
          billing_period_end?: string | null
          billing_period_start?: string | null
          checkout_session_id?: string | null
          created_at?: string
          created_by?: string | null
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_details?: Json | null
          customer_id?: string | null
          customer_invoice_id?: string
          date?: string | null
          description?: string | null
          due_date: string
          environment?: string
          file_path?: string[] | null
          from_details?: Json | null
          internal_note?: string | null
          invoice_number?: string | null
          line_items?: Json | null
          metadata?: Json | null
          note?: string | null
          organization_id: string
          origin?: string
          paid_at?: string | null
          payment_details?: Json | null
          payment_metadata?: Json
          payment_request_id?: string | null
          payment_url?: string | null
          pdf_url?: string | null
          price_id?: string | null
          product_id?: string | null
          public_id?: string
          recurrence_rule_id?: string | null
          recurring_sequence?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          source_key?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subscription_id?: string | null
          template?: Json | null
          token?: string | null
          transaction_id?: string | null
          updated_at?: string
          viewed_at?: string | null
        }
        Update: {
          amount?: number | null
          amount_due?: number | null
          amount_paid?: number
          amount_remaining?: number | null
          billing_period_end?: string | null
          billing_period_start?: string | null
          checkout_session_id?: string | null
          created_at?: string
          created_by?: string | null
          currency_code?: Database["public"]["Enums"]["currency_code"]
          customer_details?: Json | null
          customer_id?: string | null
          customer_invoice_id?: string
          date?: string | null
          description?: string | null
          due_date?: string
          environment?: string
          file_path?: string[] | null
          from_details?: Json | null
          internal_note?: string | null
          invoice_number?: string | null
          line_items?: Json | null
          metadata?: Json | null
          note?: string | null
          organization_id?: string
          origin?: string
          paid_at?: string | null
          payment_details?: Json | null
          payment_metadata?: Json
          payment_request_id?: string | null
          payment_url?: string | null
          pdf_url?: string | null
          price_id?: string | null
          product_id?: string | null
          public_id?: string
          recurrence_rule_id?: string | null
          recurring_sequence?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          source_key?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subscription_id?: string | null
          template?: Json | null
          token?: string | null
          transaction_id?: string | null
          updated_at?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_invoices_checkout_session_id_fkey"
            columns: ["checkout_session_id"]
            isOneToOne: false
            referencedRelation: "checkout_sessions"
            referencedColumns: ["checkout_session_id"]
          },
          {
            foreignKeyName: "customer_invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "customer_invoices_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "customer_invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "customer_invoices_payment_request_id_fkey"
            columns: ["payment_request_id"]
            isOneToOne: false
            referencedRelation: "payment_requests"
            referencedColumns: ["request_id"]
          },
          {
            foreignKeyName: "customer_invoices_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["price_id"]
          },
          {
            foreignKeyName: "customer_invoices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "customer_invoices_recurrence_rule_id_fkey"
            columns: ["recurrence_rule_id"]
            isOneToOne: false
            referencedRelation: "invoice_recurrence_rules"
            referencedColumns: ["recurrence_rule_id"]
          },
          {
            foreignKeyName: "customer_invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["subscription_id"]
          },
          {
            foreignKeyName: "customer_invoices_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      customer_payment_methods: {
        Row: {
          card_brand: string | null
          country: string | null
          created_at: string
          customer_id: string
          exp_month: number | null
          exp_year: number | null
          fingerprint: string | null
          is_default: boolean | null
          is_international: boolean | null
          last4: string | null
          payment_method_id: string
          stripe_payment_method_id: string
          type: string | null
          updated_at: string
        }
        Insert: {
          card_brand?: string | null
          country?: string | null
          created_at?: string
          customer_id: string
          exp_month?: number | null
          exp_year?: number | null
          fingerprint?: string | null
          is_default?: boolean | null
          is_international?: boolean | null
          last4?: string | null
          payment_method_id?: string
          stripe_payment_method_id: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          card_brand?: string | null
          country?: string | null
          created_at?: string
          customer_id?: string
          exp_month?: number | null
          exp_year?: number | null
          fingerprint?: string | null
          is_default?: boolean | null
          is_international?: boolean | null
          last4?: string | null
          payment_method_id?: string
          stripe_payment_method_id?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_payment_methods_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      customer_portal_access_challenges: {
        Row: {
          attempts: number
          challenge_id: string
          channel: string
          consumed_at: string | null
          created_at: string
          customer_id: string
          destination_hash: string
          environment: string
          expires_at: string
          ip_hash: string | null
          max_attempts: number
          organization_id: string
          resolution_portal_session_token: string | null
          secret_hash: string
        }
        Insert: {
          attempts?: number
          challenge_id?: string
          channel: string
          consumed_at?: string | null
          created_at?: string
          customer_id: string
          destination_hash: string
          environment?: string
          expires_at: string
          ip_hash?: string | null
          max_attempts?: number
          organization_id: string
          resolution_portal_session_token?: string | null
          secret_hash: string
        }
        Update: {
          attempts?: number
          challenge_id?: string
          channel?: string
          consumed_at?: string | null
          created_at?: string
          customer_id?: string
          destination_hash?: string
          environment?: string
          expires_at?: string
          ip_hash?: string | null
          max_attempts?: number
          organization_id?: string
          resolution_portal_session_token?: string | null
          secret_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_portal_access_challenges_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_portal_access_challenges_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      customer_portal_audit_events: {
        Row: {
          created_at: string
          customer_id: string | null
          event_id: string
          event_type: string
          metadata: Json
          organization_id: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          event_id?: string
          event_type: string
          metadata?: Json
          organization_id?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          event_id?: string
          event_type?: string
          metadata?: Json
          organization_id?: string | null
        }
        Relationships: []
      }
      customer_portal_launch_sessions: {
        Row: {
          consumed_at: string | null
          created_at: string
          created_by_merchant_id: string
          customer_id: string | null
          environment: string
          expires_at: string
          flow_after_completion_url: string | null
          flow_subscription_id: string | null
          flow_type: string | null
          launch_session_id: string
          organization_id: string
          return_url: string | null
          token_hash: string
        }
        Insert: {
          consumed_at?: string | null
          created_at?: string
          created_by_merchant_id: string
          customer_id?: string | null
          environment?: string
          expires_at: string
          flow_after_completion_url?: string | null
          flow_subscription_id?: string | null
          flow_type?: string | null
          launch_session_id?: string
          organization_id: string
          return_url?: string | null
          token_hash: string
        }
        Update: {
          consumed_at?: string | null
          created_at?: string
          created_by_merchant_id?: string
          customer_id?: string | null
          environment?: string
          expires_at?: string
          flow_after_completion_url?: string | null
          flow_subscription_id?: string | null
          flow_type?: string | null
          launch_session_id?: string
          organization_id?: string
          return_url?: string | null
          token_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_portal_launch_sessions_created_by_merchant_id_fkey"
            columns: ["created_by_merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "customer_portal_launch_sessions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_portal_launch_sessions_flow_subscription_id_fkey"
            columns: ["flow_subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["subscription_id"]
          },
          {
            foreignKeyName: "customer_portal_launch_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      customer_portal_rate_limit_buckets: {
        Row: {
          bucket_key: string
          hit_count: number
          window_started_at: string
        }
        Insert: {
          bucket_key: string
          hit_count?: number
          window_started_at?: string
        }
        Update: {
          bucket_key?: string
          hit_count?: number
          window_started_at?: string
        }
        Relationships: []
      }
      customer_portal_sessions: {
        Row: {
          created_at: string
          customer_id: string
          environment: string
          expires_at: string
          last_seen_at: string
          organization_id: string
          portal_session_id: string
          revoked_at: string | null
          token_hash: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          environment: string
          expires_at: string
          last_seen_at?: string
          organization_id: string
          portal_session_id?: string
          revoked_at?: string | null
          token_hash: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          environment?: string
          expires_at?: string
          last_seen_at?: string
          organization_id?: string
          portal_session_id?: string
          revoked_at?: string | null
          token_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_portal_sessions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "customer_portal_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
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
      discount_coupons: {
        Row: {
          applies_to_product_types:
            | Database["public"]["Enums"]["product_type"][]
            | null
          code: string
          coupon_id: string
          created_at: string
          current_uses: number
          customer_type: Database["public"]["Enums"]["customer_type"]
          description: string | null
          discount_fixed_amount: number | null
          discount_percentage: number | null
          discount_type: Database["public"]["Enums"]["discount_type"]
          environment: string
          expires_at: string | null
          is_active: boolean
          max_quantity_per_use: number | null
          max_uses: number | null
          organization_id: string
          public_id: string
          scope_type: string
          updated_at: string
          usage_frequency_limit: Database["public"]["Enums"]["usage_frequency"]
          usage_limit_value: number | null
          valid_from: string | null
        }
        Insert: {
          applies_to_product_types?:
            | Database["public"]["Enums"]["product_type"][]
            | null
          code: string
          coupon_id?: string
          created_at?: string
          current_uses?: number
          customer_type?: Database["public"]["Enums"]["customer_type"]
          description?: string | null
          discount_fixed_amount?: number | null
          discount_percentage?: number | null
          discount_type?: Database["public"]["Enums"]["discount_type"]
          environment?: string
          expires_at?: string | null
          is_active?: boolean
          max_quantity_per_use?: number | null
          max_uses?: number | null
          organization_id: string
          public_id?: string
          scope_type?: string
          updated_at?: string
          usage_frequency_limit?: Database["public"]["Enums"]["usage_frequency"]
          usage_limit_value?: number | null
          valid_from?: string | null
        }
        Update: {
          applies_to_product_types?:
            | Database["public"]["Enums"]["product_type"][]
            | null
          code?: string
          coupon_id?: string
          created_at?: string
          current_uses?: number
          customer_type?: Database["public"]["Enums"]["customer_type"]
          description?: string | null
          discount_fixed_amount?: number | null
          discount_percentage?: number | null
          discount_type?: Database["public"]["Enums"]["discount_type"]
          environment?: string
          expires_at?: string | null
          is_active?: boolean
          max_quantity_per_use?: number | null
          max_uses?: number | null
          organization_id?: string
          public_id?: string
          scope_type?: string
          updated_at?: string
          usage_frequency_limit?: Database["public"]["Enums"]["usage_frequency"]
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
      disputes: {
        Row: {
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          dispute_id: string
          evidence_details: Json | null
          fee_amount: number
          public_id: string
          reason: string
          resolution_date: string | null
          resolution_details: string | null
          status: Database["public"]["Enums"]["dispute_status"]
          stripe_charge_id: string | null
          stripe_dispute_id: string | null
          transaction_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          dispute_id?: string
          evidence_details?: Json | null
          fee_amount?: number
          public_id?: string
          reason: string
          resolution_date?: string | null
          resolution_details?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          stripe_charge_id?: string | null
          stripe_dispute_id?: string | null
          transaction_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          customer_id?: string
          dispute_id?: string
          evidence_details?: Json | null
          fee_amount?: number
          public_id?: string
          reason?: string
          resolution_date?: string | null
          resolution_details?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          stripe_charge_id?: string | null
          stripe_dispute_id?: string | null
          transaction_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "disputes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "disputes_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      download_access_tokens: {
        Row: {
          created_at: string
          entitlement_id: string
          expires_at: string
          token_hash: string
          token_id: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          entitlement_id: string
          expires_at: string
          token_hash: string
          token_id?: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          entitlement_id?: string
          expires_at?: string
          token_hash?: string
          token_id?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "download_access_tokens_entitlement_id_fkey"
            columns: ["entitlement_id"]
            isOneToOne: false
            referencedRelation: "purchase_entitlements"
            referencedColumns: ["entitlement_id"]
          },
        ]
      }
      entitlements: {
        Row: {
          created_at: string
          description: string | null
          entitlement_id: string
          feature_key: string
          name: string
          organization_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          entitlement_id?: string
          feature_key: string
          name: string
          organization_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          entitlement_id?: string
          feature_key?: string
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entitlements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      events: {
        Row: {
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
          processing_status: Database["public"]["Enums"]["event_processing_status"]
          product_id: string | null
          properties: Json
          quantity: number
          subscription_id: string | null
          transaction_id: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          environment?: string
          error_message?: string | null
          event_data?: Json | null
          event_id?: string
          event_name: string
          metadata?: Json | null
          meter_id?: string | null
          occurred_at?: string
          organization_id?: string | null
          processing_status?: Database["public"]["Enums"]["event_processing_status"]
          product_id?: string | null
          properties?: Json
          quantity?: number
          subscription_id?: string | null
          transaction_id?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          environment?: string
          error_message?: string | null
          event_data?: Json | null
          event_id?: string
          event_name?: string
          metadata?: Json | null
          meter_id?: string | null
          occurred_at?: string
          organization_id?: string | null
          processing_status?: Database["public"]["Enums"]["event_processing_status"]
          product_id?: string | null
          properties?: Json
          quantity?: number
          subscription_id?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "events_meter_id_fkey"
            columns: ["meter_id"]
            isOneToOne: false
            referencedRelation: "meters"
            referencedColumns: ["meter_id"]
          },
          {
            foreignKeyName: "events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "events_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["subscription_id"]
          },
          {
            foreignKeyName: "fk_events_customer_id"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "fk_events_organization_id"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      export_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string
          environment: string
          error_message: string | null
          expires_at: string | null
          filters: Json
          job_id: string
          job_type: string
          organization_id: string
          progress: number
          progress_step: string | null
          result_filename: string | null
          result_path: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by: string
          environment?: string
          error_message?: string | null
          expires_at?: string | null
          filters?: Json
          job_id?: string
          job_type: string
          organization_id: string
          progress?: number
          progress_step?: string | null
          result_filename?: string | null
          result_path?: string | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string
          environment?: string
          error_message?: string | null
          expires_at?: string | null
          filters?: Json
          job_id?: string
          job_type?: string
          organization_id?: string
          progress?: number
          progress_step?: string | null
          result_filename?: string | null
          result_path?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "export_jobs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "export_jobs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string
          created_by: string
          id: string
          message: string
          organization_id: string
          sentiment: string | null
          status: Database["public"]["Enums"]["feedback_status"]
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          message: string
          organization_id: string
          sentiment?: string | null
          status?: Database["public"]["Enums"]["feedback_status"]
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          message?: string
          organization_id?: string
          sentiment?: string | null
          status?: Database["public"]["Enums"]["feedback_status"]
        }
        Relationships: [
          {
            foreignKeyName: "feedback_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "feedback_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      fraud_alerts: {
        Row: {
          alert_id: string
          created_at: string
          metadata: Json | null
          organization_id: string
          payout_id: string | null
          rule_id: string
          status: Database["public"]["Enums"]["fraud_alert_status"]
          transaction_id: string | null
          triggering_value: string
        }
        Insert: {
          alert_id?: string
          created_at?: string
          metadata?: Json | null
          organization_id: string
          payout_id?: string | null
          rule_id: string
          status?: Database["public"]["Enums"]["fraud_alert_status"]
          transaction_id?: string | null
          triggering_value: string
        }
        Update: {
          alert_id?: string
          created_at?: string
          metadata?: Json | null
          organization_id?: string
          payout_id?: string | null
          rule_id?: string
          status?: Database["public"]["Enums"]["fraud_alert_status"]
          transaction_id?: string | null
          triggering_value?: string
        }
        Relationships: [
          {
            foreignKeyName: "fraud_alerts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "fraud_alerts_payout_id_fkey"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "payouts"
            referencedColumns: ["payout_id"]
          },
          {
            foreignKeyName: "fraud_alerts_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "fraud_rules"
            referencedColumns: ["rule_id"]
          },
          {
            foreignKeyName: "fraud_alerts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      fraud_rules: {
        Row: {
          created_at: string
          default_action: Database["public"]["Enums"]["fraud_action"]
          default_threshold: number
          default_time_window_seconds: number | null
          description: string | null
          is_active: boolean
          rule_id: string
          rule_name: string
          type: Database["public"]["Enums"]["fraud_rule_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_action?: Database["public"]["Enums"]["fraud_action"]
          default_threshold: number
          default_time_window_seconds?: number | null
          description?: string | null
          is_active?: boolean
          rule_id?: string
          rule_name: string
          type: Database["public"]["Enums"]["fraud_rule_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_action?: Database["public"]["Enums"]["fraud_action"]
          default_threshold?: number
          default_time_window_seconds?: number | null
          description?: string | null
          is_active?: boolean
          rule_id?: string
          rule_name?: string
          type?: Database["public"]["Enums"]["fraud_rule_type"]
          updated_at?: string
        }
        Relationships: []
      }
      gim_payments: {
        Row: {
          action_code: string | null
          amount_base: number
          amount_minor: number
          auth_code: string | null
          checkout_session_id: string | null
          created_at: string
          currency_code: string
          date_time_local_trxn: string
          gateway_message: string | null
          id: string
          merchant_id: string
          merchant_reference: string
          network_reference: string | null
          organization_id: string
          pan_masked: string | null
          receipt_number: string | null
          return_hash_valid: boolean | null
          status: string
          system_reference: number | null
          three_ds_required: boolean
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          action_code?: string | null
          amount_base: number
          amount_minor: number
          auth_code?: string | null
          checkout_session_id?: string | null
          created_at?: string
          currency_code?: string
          date_time_local_trxn: string
          gateway_message?: string | null
          id?: string
          merchant_id: string
          merchant_reference: string
          network_reference?: string | null
          organization_id: string
          pan_masked?: string | null
          receipt_number?: string | null
          return_hash_valid?: boolean | null
          status?: string
          system_reference?: number | null
          three_ds_required?: boolean
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          action_code?: string | null
          amount_base?: number
          amount_minor?: number
          auth_code?: string | null
          checkout_session_id?: string | null
          created_at?: string
          currency_code?: string
          date_time_local_trxn?: string
          gateway_message?: string | null
          id?: string
          merchant_id?: string
          merchant_reference?: string
          network_reference?: string | null
          organization_id?: string
          pan_masked?: string | null
          receipt_number?: string | null
          return_hash_valid?: boolean | null
          status?: string
          system_reference?: number | null
          three_ds_required?: boolean
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gim_payments_checkout_session_id_fkey"
            columns: ["checkout_session_id"]
            isOneToOne: false
            referencedRelation: "checkout_sessions"
            referencedColumns: ["checkout_session_id"]
          },
          {
            foreignKeyName: "gim_payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "gim_payments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      growth_agent_runs: {
        Row: {
          agent_name: string
          error: string | null
          finished_at: string | null
          id: string
          run_type: string
          started_at: string
          stats: Json | null
        }
        Insert: {
          agent_name: string
          error?: string | null
          finished_at?: string | null
          id?: string
          run_type: string
          started_at?: string
          stats?: Json | null
        }
        Update: {
          agent_name?: string
          error?: string | null
          finished_at?: string | null
          id?: string
          run_type?: string
          started_at?: string
          stats?: Json | null
        }
        Relationships: []
      }
      growth_contacts: {
        Row: {
          created_at: string
          email: string | null
          employer_changed_at: string | null
          employer_company: string | null
          full_name: string
          id: string
          lead_id: string | null
          linkedin_url: string | null
          organization_id: string | null
          phone: string | null
          raw_payload: Json | null
          role: Database["public"]["Enums"]["growth_contact_role"]
          title: string | null
          updated_at: string
          watch_enabled: boolean
        }
        Insert: {
          created_at?: string
          email?: string | null
          employer_changed_at?: string | null
          employer_company?: string | null
          full_name: string
          id?: string
          lead_id?: string | null
          linkedin_url?: string | null
          organization_id?: string | null
          phone?: string | null
          raw_payload?: Json | null
          role?: Database["public"]["Enums"]["growth_contact_role"]
          title?: string | null
          updated_at?: string
          watch_enabled?: boolean
        }
        Update: {
          created_at?: string
          email?: string | null
          employer_changed_at?: string | null
          employer_company?: string | null
          full_name?: string
          id?: string
          lead_id?: string | null
          linkedin_url?: string | null
          organization_id?: string | null
          phone?: string | null
          raw_payload?: Json | null
          role?: Database["public"]["Enums"]["growth_contact_role"]
          title?: string | null
          updated_at?: string
          watch_enabled?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "growth_contacts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "growth_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "growth_contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      growth_deals: {
        Row: {
          amount_xof: number | null
          buying_trigger: string | null
          churned: boolean
          closed_at: string | null
          created_at: string
          currency: string
          cycle_days: number | null
          expansion_amount_xof: number | null
          id: string
          lead_id: string
          name: string
          notes: string | null
          owner_email: string | null
          pain_proxy: string | null
          source_channel:
            | Database["public"]["Enums"]["growth_outbound_channel"]
            | null
          stage: Database["public"]["Enums"]["growth_deal_stage"]
          updated_at: string
          won_rank_score: number | null
        }
        Insert: {
          amount_xof?: number | null
          buying_trigger?: string | null
          churned?: boolean
          closed_at?: string | null
          created_at?: string
          currency?: string
          cycle_days?: number | null
          expansion_amount_xof?: number | null
          id?: string
          lead_id: string
          name: string
          notes?: string | null
          owner_email?: string | null
          pain_proxy?: string | null
          source_channel?:
            | Database["public"]["Enums"]["growth_outbound_channel"]
            | null
          stage?: Database["public"]["Enums"]["growth_deal_stage"]
          updated_at?: string
          won_rank_score?: number | null
        }
        Update: {
          amount_xof?: number | null
          buying_trigger?: string | null
          churned?: boolean
          closed_at?: string | null
          created_at?: string
          currency?: string
          cycle_days?: number | null
          expansion_amount_xof?: number | null
          id?: string
          lead_id?: string
          name?: string
          notes?: string | null
          owner_email?: string | null
          pain_proxy?: string | null
          source_channel?:
            | Database["public"]["Enums"]["growth_outbound_channel"]
            | null
          stage?: Database["public"]["Enums"]["growth_deal_stage"]
          updated_at?: string
          won_rank_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "growth_deals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "growth_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      growth_icp_profiles: {
        Row: {
          anti_icp: Json
          created_at: string
          hard_filters: Json
          id: string
          is_active: boolean
          markdown: string
          soft_signals: Json
          updated_at: string
          verified_winner_pass_rate: number | null
          version: number
        }
        Insert: {
          anti_icp?: Json
          created_at?: string
          hard_filters?: Json
          id?: string
          is_active?: boolean
          markdown?: string
          soft_signals?: Json
          updated_at?: string
          verified_winner_pass_rate?: number | null
          version: number
        }
        Update: {
          anti_icp?: Json
          created_at?: string
          hard_filters?: Json
          id?: string
          is_active?: boolean
          markdown?: string
          soft_signals?: Json
          updated_at?: string
          verified_winner_pass_rate?: number | null
          version?: number
        }
        Relationships: []
      }
      growth_leads: {
        Row: {
          city: string | null
          country: string
          created_at: string
          email: string | null
          external_place_id: string | null
          heyreach_campaign_id: string | null
          icp_tags: string[] | null
          id: string
          instantly_campaign_id: string | null
          last_outbound_at: string | null
          last_outbound_event: string | null
          last_outbound_provider: string | null
          name: string
          notes: string | null
          organization_id: string | null
          phone: string | null
          raw_payload: Json | null
          score: number | null
          score_reasons: Json | null
          scored_at: string | null
          sector: string | null
          source: Database["public"]["Enums"]["growth_lead_source"]
          status: Database["public"]["Enums"]["growth_lead_status"]
          synced_to_heyreach_at: string | null
          synced_to_instantly_at: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          city?: string | null
          country?: string
          created_at?: string
          email?: string | null
          external_place_id?: string | null
          heyreach_campaign_id?: string | null
          icp_tags?: string[] | null
          id?: string
          instantly_campaign_id?: string | null
          last_outbound_at?: string | null
          last_outbound_event?: string | null
          last_outbound_provider?: string | null
          name: string
          notes?: string | null
          organization_id?: string | null
          phone?: string | null
          raw_payload?: Json | null
          score?: number | null
          score_reasons?: Json | null
          scored_at?: string | null
          sector?: string | null
          source: Database["public"]["Enums"]["growth_lead_source"]
          status?: Database["public"]["Enums"]["growth_lead_status"]
          synced_to_heyreach_at?: string | null
          synced_to_instantly_at?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          city?: string | null
          country?: string
          created_at?: string
          email?: string | null
          external_place_id?: string | null
          heyreach_campaign_id?: string | null
          icp_tags?: string[] | null
          id?: string
          instantly_campaign_id?: string | null
          last_outbound_at?: string | null
          last_outbound_event?: string | null
          last_outbound_provider?: string | null
          name?: string
          notes?: string | null
          organization_id?: string | null
          phone?: string | null
          raw_payload?: Json | null
          score?: number | null
          score_reasons?: Json | null
          scored_at?: string | null
          sector?: string | null
          source?: Database["public"]["Enums"]["growth_lead_source"]
          status?: Database["public"]["Enums"]["growth_lead_status"]
          synced_to_heyreach_at?: string | null
          synced_to_instantly_at?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "growth_leads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      growth_lookalike_runs: {
        Row: {
          candidates: Json
          created_at: string
          criteria: Json
          id: string
          seed_deal_id: string | null
          verified_pass_rate: number | null
        }
        Insert: {
          candidates?: Json
          created_at?: string
          criteria?: Json
          id?: string
          seed_deal_id?: string | null
          verified_pass_rate?: number | null
        }
        Update: {
          candidates?: Json
          created_at?: string
          criteria?: Json
          id?: string
          seed_deal_id?: string | null
          verified_pass_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "growth_lookalike_runs_seed_deal_id_fkey"
            columns: ["seed_deal_id"]
            isOneToOne: false
            referencedRelation: "growth_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      growth_outbound_events: {
        Row: {
          created_at: string
          event_type: string
          external_key: string | null
          id: string
          lead_id: string | null
          payload: Json
          provider: string
        }
        Insert: {
          created_at?: string
          event_type: string
          external_key?: string | null
          id?: string
          lead_id?: string | null
          payload?: Json
          provider: string
        }
        Update: {
          created_at?: string
          event_type?: string
          external_key?: string | null
          id?: string
          lead_id?: string | null
          payload?: Json
          provider?: string
        }
        Relationships: [
          {
            foreignKeyName: "growth_outbound_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "growth_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      growth_outbound_touches: {
        Row: {
          body: string | null
          channel: Database["public"]["Enums"]["growth_outbound_channel"]
          contact_id: string | null
          contacted_at: string
          created_at: string
          deal_id: string | null
          direction: Database["public"]["Enums"]["growth_outbound_direction"]
          external_id: string | null
          id: string
          lead_id: string | null
          meeting_booked: boolean
          metadata: Json
          replied: boolean
          sequence_id: string | null
          subject: string | null
          won: boolean
        }
        Insert: {
          body?: string | null
          channel: Database["public"]["Enums"]["growth_outbound_channel"]
          contact_id?: string | null
          contacted_at?: string
          created_at?: string
          deal_id?: string | null
          direction?: Database["public"]["Enums"]["growth_outbound_direction"]
          external_id?: string | null
          id?: string
          lead_id?: string | null
          meeting_booked?: boolean
          metadata?: Json
          replied?: boolean
          sequence_id?: string | null
          subject?: string | null
          won?: boolean
        }
        Update: {
          body?: string | null
          channel?: Database["public"]["Enums"]["growth_outbound_channel"]
          contact_id?: string | null
          contacted_at?: string
          created_at?: string
          deal_id?: string | null
          direction?: Database["public"]["Enums"]["growth_outbound_direction"]
          external_id?: string | null
          id?: string
          lead_id?: string | null
          meeting_booked?: boolean
          metadata?: Json
          replied?: boolean
          sequence_id?: string | null
          subject?: string | null
          won?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "growth_outbound_touches_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "growth_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "growth_outbound_touches_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "growth_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "growth_outbound_touches_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "growth_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "growth_outbound_touches_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "growth_sequences"
            referencedColumns: ["id"]
          },
        ]
      }
      growth_reply_drafts: {
        Row: {
          agent_name: string | null
          approved_at: string | null
          created_at: string
          draft_text: string
          error_message: string | null
          id: string
          metadata: Json | null
          original_text: string | null
          platform: Database["public"]["Enums"]["growth_reply_platform"]
          posted_at: string | null
          posted_external_id: string | null
          status: Database["public"]["Enums"]["growth_reply_status"]
          target_author: string | null
          target_url: string | null
          updated_at: string
        }
        Insert: {
          agent_name?: string | null
          approved_at?: string | null
          created_at?: string
          draft_text: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          original_text?: string | null
          platform: Database["public"]["Enums"]["growth_reply_platform"]
          posted_at?: string | null
          posted_external_id?: string | null
          status?: Database["public"]["Enums"]["growth_reply_status"]
          target_author?: string | null
          target_url?: string | null
          updated_at?: string
        }
        Update: {
          agent_name?: string | null
          approved_at?: string | null
          created_at?: string
          draft_text?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          original_text?: string | null
          platform?: Database["public"]["Enums"]["growth_reply_platform"]
          posted_at?: string | null
          posted_external_id?: string | null
          status?: Database["public"]["Enums"]["growth_reply_status"]
          target_author?: string | null
          target_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      growth_sequences: {
        Row: {
          channels: Database["public"]["Enums"]["growth_outbound_channel"][]
          created_at: string
          id: string
          name: string
          status: Database["public"]["Enums"]["growth_sequence_status"]
          steps: Json
          updated_at: string
        }
        Insert: {
          channels?: Database["public"]["Enums"]["growth_outbound_channel"][]
          created_at?: string
          id?: string
          name: string
          status?: Database["public"]["Enums"]["growth_sequence_status"]
          steps?: Json
          updated_at?: string
        }
        Update: {
          channels?: Database["public"]["Enums"]["growth_outbound_channel"][]
          created_at?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["growth_sequence_status"]
          steps?: Json
          updated_at?: string
        }
        Relationships: []
      }
      growth_signal_events: {
        Row: {
          company_name: string
          created_at: string
          fired_at: string
          id: string
          lead_id: string | null
          payload: Json
          signal_id: string | null
          status: Database["public"]["Enums"]["growth_signal_event_status"]
        }
        Insert: {
          company_name: string
          created_at?: string
          fired_at?: string
          id?: string
          lead_id?: string | null
          payload?: Json
          signal_id?: string | null
          status?: Database["public"]["Enums"]["growth_signal_event_status"]
        }
        Update: {
          company_name?: string
          created_at?: string
          fired_at?: string
          id?: string
          lead_id?: string | null
          payload?: Json
          signal_id?: string | null
          status?: Database["public"]["Enums"]["growth_signal_event_status"]
        }
        Relationships: [
          {
            foreignKeyName: "growth_signal_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "growth_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "growth_signal_events_signal_id_fkey"
            columns: ["signal_id"]
            isOneToOne: false
            referencedRelation: "growth_signals"
            referencedColumns: ["id"]
          },
        ]
      }
      growth_signals: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          lift: number | null
          metadata: Json
          name: string
          proven_angle: string | null
          slug: string
          updated_at: string
          window_days: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          lift?: number | null
          metadata?: Json
          name: string
          proven_angle?: string | null
          slug: string
          updated_at?: string
          window_days?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          lift?: number | null
          metadata?: Json
          name?: string
          proven_angle?: string | null
          slug?: string
          updated_at?: string
          window_days?: number | null
        }
        Relationships: []
      }
      inbound_provider_webhook_events: {
        Row: {
          metadata: Json | null
          provider: Database["public"]["Enums"]["provider_code"]
          provider_event_id: string
          received_at: string
        }
        Insert: {
          metadata?: Json | null
          provider: Database["public"]["Enums"]["provider_code"]
          provider_event_id: string
          received_at?: string
        }
        Update: {
          metadata?: Json | null
          provider?: Database["public"]["Enums"]["provider_code"]
          provider_event_id?: string
          received_at?: string
        }
        Relationships: []
      }
      installment_payments: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          installment_id: string
          interest_amount: number | null
          paid_at: string | null
          payment_link: string | null
          payment_method_code:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          plan_id: string
          principal_amount: number | null
          processing_fee: number | null
          provider_code: Database["public"]["Enums"]["provider_code"] | null
          sequence_number: number
          spi_payment_request_id: string | null
          spi_tx_id: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: string
          installment_id?: string
          interest_amount?: number | null
          paid_at?: string | null
          payment_link?: string | null
          payment_method_code?:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          plan_id: string
          principal_amount?: number | null
          processing_fee?: number | null
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          sequence_number: number
          spi_payment_request_id?: string | null
          spi_tx_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          installment_id?: string
          interest_amount?: number | null
          paid_at?: string | null
          payment_link?: string | null
          payment_method_code?:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          plan_id?: string
          principal_amount?: number | null
          processing_fee?: number | null
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          sequence_number?: number
          spi_payment_request_id?: string | null
          spi_tx_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_installment_payments_spi_payment_request_id"
            columns: ["spi_payment_request_id"]
            isOneToOne: false
            referencedRelation: "payment_requests"
            referencedColumns: ["request_id"]
          },
          {
            foreignKeyName: "installment_payments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "installment_plans"
            referencedColumns: ["plan_id"]
          },
          {
            foreignKeyName: "installment_payments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      installment_plans: {
        Row: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          environment: string
          installment_count: number
          is_spi_bnpl: boolean
          organization_id: string
          plan_id: string
          product_id: string | null
          spi_payment_request_ids: string[] | null
          status: Database["public"]["Enums"]["transaction_status"]
          subscription_id: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          environment?: string
          installment_count: number
          is_spi_bnpl?: boolean
          organization_id: string
          plan_id?: string
          product_id?: string | null
          spi_payment_request_ids?: string[] | null
          status?: Database["public"]["Enums"]["transaction_status"]
          subscription_id?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          customer_id?: string
          environment?: string
          installment_count?: number
          is_spi_bnpl?: boolean
          organization_id?: string
          plan_id?: string
          product_id?: string | null
          spi_payment_request_ids?: string[] | null
          status?: Database["public"]["Enums"]["transaction_status"]
          subscription_id?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "installment_plans_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "installment_plans_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "installment_plans_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "installment_plans_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "installment_plans_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["subscription_id"]
          },
        ]
      }
      integrations: {
        Row: {
          connected_at: string | null
          connection_metadata: Json | null
          created_at: string
          integration: string
          is_connected: boolean
          organization_id: string
          updated_at: string
        }
        Insert: {
          connected_at?: string | null
          connection_metadata?: Json | null
          created_at?: string
          integration: string
          is_connected?: boolean
          organization_id: string
          updated_at?: string
        }
        Update: {
          connected_at?: string | null
          connection_metadata?: Json | null
          created_at?: string
          integration?: string
          is_connected?: boolean
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integrations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          amount: number
          billing_period_end: string | null
          billing_period_start: string | null
          created_at: string
          description: string
          invoice_id: string
          item_id: string
          metadata: Json | null
          organization_id: string
          price_id: string | null
          product_id: string | null
          quantity: number
          subscription_id: string | null
          unit_price: number
          updated_at: string
        }
        Insert: {
          amount?: number
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string
          description: string
          invoice_id: string
          item_id?: string
          metadata?: Json | null
          organization_id: string
          price_id?: string | null
          product_id?: string | null
          quantity?: number
          subscription_id?: string | null
          unit_price?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string
          description?: string
          invoice_id?: string
          item_id?: string
          metadata?: Json | null
          organization_id?: string
          price_id?: string | null
          product_id?: string | null
          quantity?: number
          subscription_id?: string | null
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "customer_invoices"
            referencedColumns: ["customer_invoice_id"]
          },
          {
            foreignKeyName: "invoice_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "invoice_items_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["price_id"]
          },
          {
            foreignKeyName: "invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "invoice_items_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["subscription_id"]
          },
        ]
      }
      invoice_number_counters: {
        Row: {
          next_number: number
          organization_id: string
          updated_at: string
        }
        Insert: {
          next_number?: number
          organization_id: string
          updated_at?: string
        }
        Update: {
          next_number?: number
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_number_counters_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      invoice_recurrence_rules: {
        Row: {
          amount: number | null
          consecutive_failures: number
          created_at: string
          created_by: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_details: Json | null
          customer_id: string | null
          due_date_offset: number
          end_count: number | null
          end_date: string | null
          end_type: Database["public"]["Enums"]["invoice_recurrence_end_type"]
          environment: string
          frequency: Database["public"]["Enums"]["invoice_recurrence_frequency"]
          frequency_day: number | null
          frequency_interval: number | null
          frequency_week: number | null
          from_details: Json | null
          invoices_generated: number
          last_generated_at: string | null
          line_items: Json | null
          metadata: Json
          next_scheduled_at: string | null
          note: string | null
          organization_id: string
          payment_details: Json | null
          recurrence_rule_id: string
          status: Database["public"]["Enums"]["invoice_recurrence_status"]
          template: Json | null
          timezone: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          consecutive_failures?: number
          created_at?: string
          created_by: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          customer_details?: Json | null
          customer_id?: string | null
          due_date_offset?: number
          end_count?: number | null
          end_date?: string | null
          end_type?: Database["public"]["Enums"]["invoice_recurrence_end_type"]
          environment?: string
          frequency: Database["public"]["Enums"]["invoice_recurrence_frequency"]
          frequency_day?: number | null
          frequency_interval?: number | null
          frequency_week?: number | null
          from_details?: Json | null
          invoices_generated?: number
          last_generated_at?: string | null
          line_items?: Json | null
          metadata?: Json
          next_scheduled_at?: string | null
          note?: string | null
          organization_id: string
          payment_details?: Json | null
          recurrence_rule_id?: string
          status?: Database["public"]["Enums"]["invoice_recurrence_status"]
          template?: Json | null
          timezone?: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          consecutive_failures?: number
          created_at?: string
          created_by?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          customer_details?: Json | null
          customer_id?: string | null
          due_date_offset?: number
          end_count?: number | null
          end_date?: string | null
          end_type?: Database["public"]["Enums"]["invoice_recurrence_end_type"]
          environment?: string
          frequency?: Database["public"]["Enums"]["invoice_recurrence_frequency"]
          frequency_day?: number | null
          frequency_interval?: number | null
          frequency_week?: number | null
          from_details?: Json | null
          invoices_generated?: number
          last_generated_at?: string | null
          line_items?: Json | null
          metadata?: Json
          next_scheduled_at?: string | null
          note?: string | null
          organization_id?: string
          payment_details?: Json | null
          recurrence_rule_id?: string
          status?: Database["public"]["Enums"]["invoice_recurrence_status"]
          template?: Json | null
          timezone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_recurrence_rules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "invoice_recurrence_rules_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "invoice_recurrence_rules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      invoice_templates: {
        Row: {
          created_at: string | null
          from_details: Json | null
          is_default: boolean | null
          name: string
          note_details: Json | null
          organization_id: string
          payment_details: Json | null
          template: Json | null
          template_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          from_details?: Json | null
          is_default?: boolean | null
          name: string
          note_details?: Json | null
          organization_id: string
          payment_details?: Json | null
          template?: Json | null
          template_id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          from_details?: Json | null
          is_default?: boolean | null
          name?: string
          note_details?: Json | null
          organization_id?: string
          payment_details?: Json | null
          template?: Json | null
          template_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      ip_location_cache: {
        Row: {
          city: string | null
          country: string | null
          ip_address: string
          last_updated: string | null
          lookup_count: number | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          ip_address: string
          last_updated?: string | null
          lookup_count?: number | null
        }
        Update: {
          city?: string | null
          country?: string | null
          ip_address?: string
          last_updated?: string | null
          lookup_count?: number | null
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          created_at: string
          email: string
          github_url: string | null
          id: string
          job_id: string | null
          linkedin_url: string | null
          moving_forward: boolean | null
          name: string
          project_note: string | null
          resume_url: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          github_url?: string | null
          id?: string
          job_id?: string | null
          linkedin_url?: string | null
          moving_forward?: boolean | null
          name: string
          project_note?: string | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          github_url?: string | null
          id?: string
          job_id?: string | null
          linkedin_url?: string | null
          moving_forward?: boolean | null
          name?: string
          project_note?: string | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          about_description: string
          applying_description: string
          created_at: string
          department: string
          id: string
          is_active: boolean | null
          location: string
          responsibilities: string[] | null
          role_description: string
          slug: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          about_description: string
          applying_description: string
          created_at?: string
          department: string
          id?: string
          is_active?: boolean | null
          location: string
          responsibilities?: string[] | null
          role_description: string
          slug: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          about_description?: string
          applying_description?: string
          created_at?: string
          department?: string
          id?: string
          is_active?: boolean | null
          location?: string
          responsibilities?: string[] | null
          role_description?: string
          slug?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      kyc_ai_reviews: {
        Row: {
          applied_status: Database["public"]["Enums"]["kyc_status"] | null
          confidence: number | null
          created_at: string
          decision: string
          error: string | null
          id: string
          id_type: string | null
          model: string
          organization_id: string
          raw_response: Json | null
          reasons: Json | null
          rejection_reason: string | null
        }
        Insert: {
          applied_status?: Database["public"]["Enums"]["kyc_status"] | null
          confidence?: number | null
          created_at?: string
          decision: string
          error?: string | null
          id?: string
          id_type?: string | null
          model: string
          organization_id: string
          raw_response?: Json | null
          reasons?: Json | null
          rejection_reason?: string | null
        }
        Update: {
          applied_status?: Database["public"]["Enums"]["kyc_status"] | null
          confidence?: number | null
          created_at?: string
          decision?: string
          error?: string | null
          id?: string
          id_type?: string | null
          model?: string
          organization_id?: string
          raw_response?: Json | null
          reasons?: Json | null
          rejection_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_ai_reviews_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      live_activation_requests: {
        Row: {
          created_at: string
          is_starter_business: boolean
          merchant_approved_at: string | null
          merchant_approved_by: string | null
          merchant_id: string
          metadata: Json
          organization_id: string
          platform_approved_at: string | null
          provisioning_key_id: string | null
          rejection_reason: string | null
          request_id: string
          status: Database["public"]["Enums"]["live_activation_request_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          is_starter_business?: boolean
          merchant_approved_at?: string | null
          merchant_approved_by?: string | null
          merchant_id: string
          metadata?: Json
          organization_id: string
          platform_approved_at?: string | null
          provisioning_key_id?: string | null
          rejection_reason?: string | null
          request_id?: string
          status?: Database["public"]["Enums"]["live_activation_request_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          is_starter_business?: boolean
          merchant_approved_at?: string | null
          merchant_approved_by?: string | null
          merchant_id?: string
          metadata?: Json
          organization_id?: string
          platform_approved_at?: string | null
          provisioning_key_id?: string | null
          rejection_reason?: string | null
          request_id?: string
          status?: Database["public"]["Enums"]["live_activation_request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_activation_requests_merchant_approved_by_fkey"
            columns: ["merchant_approved_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "live_activation_requests_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "live_activation_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "live_activation_requests_provisioning_key_id_fkey"
            columns: ["provisioning_key_id"]
            isOneToOne: false
            referencedRelation: "platform_provisioning_keys"
            referencedColumns: ["provisioning_key_id"]
          },
        ]
      }
      logs: {
        Row: {
          browser: string | null
          created_at: string
          details: Json | null
          event: Database["public"]["Enums"]["event_type"]
          ip_address: string | null
          location_city: string | null
          location_country: string | null
          log_id: string
          merchant_id: string | null
          operating_system: string | null
          request_method: string | null
          request_url: string | null
          response_status: number | null
          severity: string
        }
        Insert: {
          browser?: string | null
          created_at?: string
          details?: Json | null
          event: Database["public"]["Enums"]["event_type"]
          ip_address?: string | null
          location_city?: string | null
          location_country?: string | null
          log_id?: string
          merchant_id?: string | null
          operating_system?: string | null
          request_method?: string | null
          request_url?: string | null
          response_status?: number | null
          severity: string
        }
        Update: {
          browser?: string | null
          created_at?: string
          details?: Json | null
          event?: Database["public"]["Enums"]["event_type"]
          ip_address?: string | null
          location_city?: string | null
          location_country?: string | null
          log_id?: string
          merchant_id?: string | null
          operating_system?: string | null
          request_method?: string | null
          request_url?: string | null
          response_status?: number | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "logs_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
        ]
      }
      mcp_device_requests: {
        Row: {
          created_at: string
          device_code: string
          expires_at: string
          interval: number
          merchant_id: string | null
          organization_id: string | null
          status: Database["public"]["Enums"]["cli_device_request_status"]
          user_code: string
        }
        Insert: {
          created_at?: string
          device_code: string
          expires_at: string
          interval?: number
          merchant_id?: string | null
          organization_id?: string | null
          status?: Database["public"]["Enums"]["cli_device_request_status"]
          user_code: string
        }
        Update: {
          created_at?: string
          device_code?: string
          expires_at?: string
          interval?: number
          merchant_id?: string | null
          organization_id?: string | null
          status?: Database["public"]["Enums"]["cli_device_request_status"]
          user_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "mcp_device_requests_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "mcp_device_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      merchant_organization_links: {
        Row: {
          action: Database["public"]["Enums"]["permission_action"] | null
          allow_staff_impersonation: boolean
          category: Database["public"]["Enums"]["permission_category"] | null
          created_at: string
          invitation_email: string | null
          invitation_token: string | null
          invited_role_id: string | null
          merchant_id: string | null
          merchant_org_id: string
          organization_id: string
          organization_position: string | null
          role: Database["public"]["Enums"]["member_role"]
          staff_impersonation_consent_at: string | null
          team_status: Database["public"]["Enums"]["team_status"]
          updated_at: string
        }
        Insert: {
          action?: Database["public"]["Enums"]["permission_action"] | null
          allow_staff_impersonation?: boolean
          category?: Database["public"]["Enums"]["permission_category"] | null
          created_at?: string
          invitation_email?: string | null
          invitation_token?: string | null
          invited_role_id?: string | null
          merchant_id?: string | null
          merchant_org_id?: string
          organization_id: string
          organization_position?: string | null
          role: Database["public"]["Enums"]["member_role"]
          staff_impersonation_consent_at?: string | null
          team_status?: Database["public"]["Enums"]["team_status"]
          updated_at?: string
        }
        Update: {
          action?: Database["public"]["Enums"]["permission_action"] | null
          allow_staff_impersonation?: boolean
          category?: Database["public"]["Enums"]["permission_category"] | null
          created_at?: string
          invitation_email?: string | null
          invitation_token?: string | null
          invited_role_id?: string | null
          merchant_id?: string | null
          merchant_org_id?: string
          organization_id?: string
          organization_position?: string | null
          role?: Database["public"]["Enums"]["member_role"]
          staff_impersonation_consent_at?: string | null
          team_status?: Database["public"]["Enums"]["team_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_organization_links_invited_role_id_fkey"
            columns: ["invited_role_id"]
            isOneToOne: false
            referencedRelation: "organization_roles"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "merchant_organization_links_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "merchant_organization_links_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      merchant_preferences: {
        Row: {
          created_at: string
          extra_settings: Json
          last_visited_organization_id: string | null
          merchant_id: string
          portal_theme: string
          receive_product_marketing_emails: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          extra_settings?: Json
          last_visited_organization_id?: string | null
          merchant_id: string
          portal_theme?: string
          receive_product_marketing_emails?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          extra_settings?: Json
          last_visited_organization_id?: string | null
          merchant_id?: string
          portal_theme?: string
          receive_product_marketing_emails?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_preferences_last_visited_organization_id_fkey"
            columns: ["last_visited_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "merchant_preferences_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: true
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
        ]
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
          onboarding_status: Database["public"]["Enums"]["onboarding_status"]
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
          onboarding_status?: Database["public"]["Enums"]["onboarding_status"]
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
          onboarding_status?: Database["public"]["Enums"]["onboarding_status"]
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
      meter_balances: {
        Row: {
          balance: number
          balance_id: string
          billable_organization_id: string | null
          consumed_units: number
          created_at: string
          credited_units: number
          customer_id: string | null
          last_event_id: string | null
          meter_id: string
          updated_at: string
        }
        Insert: {
          balance?: number
          balance_id?: string
          billable_organization_id?: string | null
          consumed_units?: number
          created_at?: string
          credited_units?: number
          customer_id?: string | null
          last_event_id?: string | null
          meter_id: string
          updated_at?: string
        }
        Update: {
          balance?: number
          balance_id?: string
          billable_organization_id?: string | null
          consumed_units?: number
          created_at?: string
          credited_units?: number
          customer_id?: string | null
          last_event_id?: string | null
          meter_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_customer_meters_customer_id"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "fk_customer_meters_meter_id"
            columns: ["meter_id"]
            isOneToOne: false
            referencedRelation: "meters"
            referencedColumns: ["meter_id"]
          },
          {
            foreignKeyName: "meter_balances_billable_organization_id_fkey"
            columns: ["billable_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "meter_balances_last_event_id_fkey"
            columns: ["last_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
        ]
      }
      meters: {
        Row: {
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
        Insert: {
          aggregation: Json
          created_at?: string
          filter: Json
          is_active?: boolean
          meter_id?: string
          name: string
          organization_id: string
          product_id?: string | null
          public_id?: string
          updated_at?: string
        }
        Update: {
          aggregation?: Json
          created_at?: string
          filter?: Json
          is_active?: boolean
          meter_id?: string
          name?: string
          organization_id?: string
          product_id?: string | null
          public_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_meters_organization_id"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "meters_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      network_account_documents: {
        Row: {
          document_id: string
          document_type: string
          file_name: string | null
          member_organization_id: string
          metadata: Json
          mime_type: string | null
          network_account_id: string
          status: string
          storage_path: string
          updated_at: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          document_id?: string
          document_type: string
          file_name?: string | null
          member_organization_id: string
          metadata?: Json
          mime_type?: string | null
          network_account_id: string
          status?: string
          storage_path: string
          updated_at?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          document_id?: string
          document_type?: string
          file_name?: string | null
          member_organization_id?: string
          metadata?: Json
          mime_type?: string | null
          network_account_id?: string
          status?: string
          storage_path?: string
          updated_at?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "network_account_documents_member_organization_id_fkey"
            columns: ["member_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "network_account_documents_network_account_id_fkey"
            columns: ["network_account_id"]
            isOneToOne: false
            referencedRelation: "network_accounts"
            referencedColumns: ["network_account_id"]
          },
          {
            foreignKeyName: "network_account_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
        ]
      }
      network_accounts: {
        Row: {
          business_identifier: string | null
          contact_email: string | null
          contact_phone: string | null
          country: string | null
          created_at: string
          created_by: string | null
          display_name: string | null
          legal_name: string | null
          metadata: Json
          network_account_id: string
          organization_id: string
          public_account_id: string
          registry_identifier: string | null
          status: Database["public"]["Enums"]["network_account_status"]
          tax_identifier: string | null
          updated_at: string
        }
        Insert: {
          business_identifier?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          display_name?: string | null
          legal_name?: string | null
          metadata?: Json
          network_account_id?: string
          organization_id: string
          public_account_id?: string
          registry_identifier?: string | null
          status?: Database["public"]["Enums"]["network_account_status"]
          tax_identifier?: string | null
          updated_at?: string
        }
        Update: {
          business_identifier?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          display_name?: string | null
          legal_name?: string | null
          metadata?: Json
          network_account_id?: string
          organization_id?: string
          public_account_id?: string
          registry_identifier?: string | null
          status?: Database["public"]["Enums"]["network_account_status"]
          tax_identifier?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "network_accounts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "network_accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      network_audit_events: {
        Row: {
          actor_merchant_id: string | null
          api_key: string | null
          created_at: string
          environment: string | null
          event_type: string
          member_organization_id: string | null
          metadata: Json
          network_account_id: string | null
          network_audit_event_id: string
          network_membership_id: string | null
          operator_organization_id: string | null
        }
        Insert: {
          actor_merchant_id?: string | null
          api_key?: string | null
          created_at?: string
          environment?: string | null
          event_type: string
          member_organization_id?: string | null
          metadata?: Json
          network_account_id?: string | null
          network_audit_event_id?: string
          network_membership_id?: string | null
          operator_organization_id?: string | null
        }
        Update: {
          actor_merchant_id?: string | null
          api_key?: string | null
          created_at?: string
          environment?: string | null
          event_type?: string
          member_organization_id?: string | null
          metadata?: Json
          network_account_id?: string | null
          network_audit_event_id?: string
          network_membership_id?: string | null
          operator_organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "network_audit_events_actor_merchant_id_fkey"
            columns: ["actor_merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "network_audit_events_member_organization_id_fkey"
            columns: ["member_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "network_audit_events_network_account_id_fkey"
            columns: ["network_account_id"]
            isOneToOne: false
            referencedRelation: "network_accounts"
            referencedColumns: ["network_account_id"]
          },
          {
            foreignKeyName: "network_audit_events_network_membership_id_fkey"
            columns: ["network_membership_id"]
            isOneToOne: false
            referencedRelation: "network_memberships"
            referencedColumns: ["network_membership_id"]
          },
          {
            foreignKeyName: "network_audit_events_operator_organization_id_fkey"
            columns: ["operator_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      network_capabilities: {
        Row: {
          capability_key: string
          created_at: string
          description: string
          domain: string
          is_active: boolean
        }
        Insert: {
          capability_key: string
          created_at?: string
          description: string
          domain: string
          is_active?: boolean
        }
        Update: {
          capability_key?: string
          created_at?: string
          description?: string
          domain?: string
          is_active?: boolean
        }
        Relationships: []
      }
      network_capability_grants: {
        Row: {
          capability_grant_id: string
          capability_key: string
          created_at: string
          environment: string
          granted_at: string
          granted_by: string | null
          metadata: Json
          network_membership_id: string
          restricted_at: string | null
          status: Database["public"]["Enums"]["network_capability_status"]
          updated_at: string
        }
        Insert: {
          capability_grant_id?: string
          capability_key: string
          created_at?: string
          environment: string
          granted_at?: string
          granted_by?: string | null
          metadata?: Json
          network_membership_id: string
          restricted_at?: string | null
          status?: Database["public"]["Enums"]["network_capability_status"]
          updated_at?: string
        }
        Update: {
          capability_grant_id?: string
          capability_key?: string
          created_at?: string
          environment?: string
          granted_at?: string
          granted_by?: string | null
          metadata?: Json
          network_membership_id?: string
          restricted_at?: string | null
          status?: Database["public"]["Enums"]["network_capability_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "network_capability_grants_capability_key_fkey"
            columns: ["capability_key"]
            isOneToOne: false
            referencedRelation: "network_capabilities"
            referencedColumns: ["capability_key"]
          },
          {
            foreignKeyName: "network_capability_grants_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "network_capability_grants_network_membership_id_fkey"
            columns: ["network_membership_id"]
            isOneToOne: false
            referencedRelation: "network_memberships"
            referencedColumns: ["network_membership_id"]
          },
        ]
      }
      network_data_sharing_consents: {
        Row: {
          accepted_at: string
          accepted_by_merchant_id: string | null
          accepted_ip: string | null
          accepted_user_agent: string | null
          consent_id: string
          created_at: string
          enrollment_session_id: string | null
          member_organization_id: string
          metadata: Json
          network_account_id: string
          network_membership_id: string
          operator_organization_id: string
          terms_version: string
        }
        Insert: {
          accepted_at?: string
          accepted_by_merchant_id?: string | null
          accepted_ip?: string | null
          accepted_user_agent?: string | null
          consent_id?: string
          created_at?: string
          enrollment_session_id?: string | null
          member_organization_id: string
          metadata?: Json
          network_account_id: string
          network_membership_id: string
          operator_organization_id: string
          terms_version: string
        }
        Update: {
          accepted_at?: string
          accepted_by_merchant_id?: string | null
          accepted_ip?: string | null
          accepted_user_agent?: string | null
          consent_id?: string
          created_at?: string
          enrollment_session_id?: string | null
          member_organization_id?: string
          metadata?: Json
          network_account_id?: string
          network_membership_id?: string
          operator_organization_id?: string
          terms_version?: string
        }
        Relationships: [
          {
            foreignKeyName: "network_data_sharing_consents_accepted_by_merchant_id_fkey"
            columns: ["accepted_by_merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "network_data_sharing_consents_enrollment_session_id_fkey"
            columns: ["enrollment_session_id"]
            isOneToOne: false
            referencedRelation: "network_enrollment_sessions"
            referencedColumns: ["enrollment_session_id"]
          },
          {
            foreignKeyName: "network_data_sharing_consents_member_organization_id_fkey"
            columns: ["member_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "network_data_sharing_consents_network_account_id_fkey"
            columns: ["network_account_id"]
            isOneToOne: false
            referencedRelation: "network_accounts"
            referencedColumns: ["network_account_id"]
          },
          {
            foreignKeyName: "network_data_sharing_consents_network_membership_id_fkey"
            columns: ["network_membership_id"]
            isOneToOne: false
            referencedRelation: "network_memberships"
            referencedColumns: ["network_membership_id"]
          },
          {
            foreignKeyName: "network_data_sharing_consents_operator_organization_id_fkey"
            columns: ["operator_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      network_enrollment_sessions: {
        Row: {
          accepted_by_merchant_id: string | null
          accepted_terms_at: string | null
          completed_at: string | null
          created_at: string
          created_by_merchant_id: string | null
          enrollment_session_id: string
          enrollment_token: string
          expires_at: string
          intended_email: string | null
          member_organization_id: string | null
          metadata: Json
          network_account_id: string | null
          network_membership_id: string | null
          opened_at: string | null
          operator_organization_id: string
          requested_capabilities: string[]
          status: Database["public"]["Enums"]["network_enrollment_status"]
          submitted_at: string | null
          terms_version: string | null
          updated_at: string
        }
        Insert: {
          accepted_by_merchant_id?: string | null
          accepted_terms_at?: string | null
          completed_at?: string | null
          created_at?: string
          created_by_merchant_id?: string | null
          enrollment_session_id?: string
          enrollment_token?: string
          expires_at?: string
          intended_email?: string | null
          member_organization_id?: string | null
          metadata?: Json
          network_account_id?: string | null
          network_membership_id?: string | null
          opened_at?: string | null
          operator_organization_id: string
          requested_capabilities?: string[]
          status?: Database["public"]["Enums"]["network_enrollment_status"]
          submitted_at?: string | null
          terms_version?: string | null
          updated_at?: string
        }
        Update: {
          accepted_by_merchant_id?: string | null
          accepted_terms_at?: string | null
          completed_at?: string | null
          created_at?: string
          created_by_merchant_id?: string | null
          enrollment_session_id?: string
          enrollment_token?: string
          expires_at?: string
          intended_email?: string | null
          member_organization_id?: string | null
          metadata?: Json
          network_account_id?: string | null
          network_membership_id?: string | null
          opened_at?: string | null
          operator_organization_id?: string
          requested_capabilities?: string[]
          status?: Database["public"]["Enums"]["network_enrollment_status"]
          submitted_at?: string | null
          terms_version?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_network_enrollment_sessions_membership"
            columns: ["network_membership_id"]
            isOneToOne: false
            referencedRelation: "network_memberships"
            referencedColumns: ["network_membership_id"]
          },
          {
            foreignKeyName: "network_enrollment_sessions_accepted_by_merchant_id_fkey"
            columns: ["accepted_by_merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "network_enrollment_sessions_created_by_merchant_id_fkey"
            columns: ["created_by_merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "network_enrollment_sessions_member_organization_id_fkey"
            columns: ["member_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "network_enrollment_sessions_network_account_id_fkey"
            columns: ["network_account_id"]
            isOneToOne: false
            referencedRelation: "network_accounts"
            referencedColumns: ["network_account_id"]
          },
          {
            foreignKeyName: "network_enrollment_sessions_operator_organization_id_fkey"
            columns: ["operator_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      network_external_identifiers: {
        Row: {
          created_at: string
          created_by: string | null
          external_identifier_id: string
          identifier_type: string
          identifier_value: string
          label: string | null
          member_organization_id: string
          metadata: Json
          network_account_id: string
          network_membership_id: string
          operator_organization_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          external_identifier_id?: string
          identifier_type: string
          identifier_value: string
          label?: string | null
          member_organization_id: string
          metadata?: Json
          network_account_id: string
          network_membership_id: string
          operator_organization_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          external_identifier_id?: string
          identifier_type?: string
          identifier_value?: string
          label?: string | null
          member_organization_id?: string
          metadata?: Json
          network_account_id?: string
          network_membership_id?: string
          operator_organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "network_external_identifiers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "network_external_identifiers_member_organization_id_fkey"
            columns: ["member_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "network_external_identifiers_network_account_id_fkey"
            columns: ["network_account_id"]
            isOneToOne: false
            referencedRelation: "network_accounts"
            referencedColumns: ["network_account_id"]
          },
          {
            foreignKeyName: "network_external_identifiers_network_membership_id_fkey"
            columns: ["network_membership_id"]
            isOneToOne: false
            referencedRelation: "network_memberships"
            referencedColumns: ["network_membership_id"]
          },
          {
            foreignKeyName: "network_external_identifiers_operator_organization_id_fkey"
            columns: ["operator_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      network_memberships: {
        Row: {
          accepted_at: string | null
          accepted_by_merchant_id: string | null
          activated_at: string | null
          created_at: string
          created_by_merchant_id: string | null
          enrollment_session_id: string | null
          member_organization_id: string
          metadata: Json
          network_account_id: string
          network_membership_id: string
          operator_fee_rule_id: string | null
          operator_organization_id: string
          restricted_at: string | null
          status: Database["public"]["Enums"]["network_membership_status"]
          suspended_at: string | null
          terminated_at: string | null
          terms_version: string | null
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by_merchant_id?: string | null
          activated_at?: string | null
          created_at?: string
          created_by_merchant_id?: string | null
          enrollment_session_id?: string | null
          member_organization_id: string
          metadata?: Json
          network_account_id: string
          network_membership_id?: string
          operator_fee_rule_id?: string | null
          operator_organization_id: string
          restricted_at?: string | null
          status?: Database["public"]["Enums"]["network_membership_status"]
          suspended_at?: string | null
          terminated_at?: string | null
          terms_version?: string | null
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by_merchant_id?: string | null
          activated_at?: string | null
          created_at?: string
          created_by_merchant_id?: string | null
          enrollment_session_id?: string | null
          member_organization_id?: string
          metadata?: Json
          network_account_id?: string
          network_membership_id?: string
          operator_fee_rule_id?: string | null
          operator_organization_id?: string
          restricted_at?: string | null
          status?: Database["public"]["Enums"]["network_membership_status"]
          suspended_at?: string | null
          terminated_at?: string | null
          terms_version?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "network_memberships_accepted_by_merchant_id_fkey"
            columns: ["accepted_by_merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "network_memberships_account_org_fkey"
            columns: ["network_account_id", "member_organization_id"]
            isOneToOne: false
            referencedRelation: "network_accounts"
            referencedColumns: ["network_account_id", "organization_id"]
          },
          {
            foreignKeyName: "network_memberships_created_by_merchant_id_fkey"
            columns: ["created_by_merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "network_memberships_enrollment_session_id_fkey"
            columns: ["enrollment_session_id"]
            isOneToOne: false
            referencedRelation: "network_enrollment_sessions"
            referencedColumns: ["enrollment_session_id"]
          },
          {
            foreignKeyName: "network_memberships_member_organization_id_fkey"
            columns: ["member_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "network_memberships_network_account_id_fkey"
            columns: ["network_account_id"]
            isOneToOne: false
            referencedRelation: "network_accounts"
            referencedColumns: ["network_account_id"]
          },
          {
            foreignKeyName: "network_memberships_operator_fee_rule_id_fkey"
            columns: ["operator_fee_rule_id"]
            isOneToOne: false
            referencedRelation: "network_operator_fee_rules"
            referencedColumns: ["fee_rule_id"]
          },
          {
            foreignKeyName: "network_memberships_operator_organization_id_fkey"
            columns: ["operator_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      network_operator_fee_entries: {
        Row: {
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string | null
          entry_type: Database["public"]["Enums"]["network_fee_entry_type"]
          fee_rule_id: string | null
          member_organization_id: string
          metadata: Json
          network_membership_id: string
          network_transaction_context_id: string | null
          operator_fee_entry_id: string
          operator_organization_id: string
          posted_at: string | null
          refund_id: string | null
          reversed_at: string | null
          status: Database["public"]["Enums"]["network_fee_entry_status"]
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          entry_type?: Database["public"]["Enums"]["network_fee_entry_type"]
          fee_rule_id?: string | null
          member_organization_id: string
          metadata?: Json
          network_membership_id: string
          network_transaction_context_id?: string | null
          operator_fee_entry_id?: string
          operator_organization_id: string
          posted_at?: string | null
          refund_id?: string | null
          reversed_at?: string | null
          status?: Database["public"]["Enums"]["network_fee_entry_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          entry_type?: Database["public"]["Enums"]["network_fee_entry_type"]
          fee_rule_id?: string | null
          member_organization_id?: string
          metadata?: Json
          network_membership_id?: string
          network_transaction_context_id?: string | null
          operator_fee_entry_id?: string
          operator_organization_id?: string
          posted_at?: string | null
          refund_id?: string | null
          reversed_at?: string | null
          status?: Database["public"]["Enums"]["network_fee_entry_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "network_operator_fee_entries_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "network_operator_fee_entries_fee_rule_id_fkey"
            columns: ["fee_rule_id"]
            isOneToOne: false
            referencedRelation: "network_operator_fee_rules"
            referencedColumns: ["fee_rule_id"]
          },
          {
            foreignKeyName: "network_operator_fee_entries_member_organization_id_fkey"
            columns: ["member_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "network_operator_fee_entries_network_membership_id_fkey"
            columns: ["network_membership_id"]
            isOneToOne: false
            referencedRelation: "network_memberships"
            referencedColumns: ["network_membership_id"]
          },
          {
            foreignKeyName: "network_operator_fee_entries_network_transaction_context_i_fkey"
            columns: ["network_transaction_context_id"]
            isOneToOne: false
            referencedRelation: "network_transaction_contexts"
            referencedColumns: ["network_transaction_context_id"]
          },
          {
            foreignKeyName: "network_operator_fee_entries_operator_organization_id_fkey"
            columns: ["operator_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "network_operator_fee_entries_refund_id_fkey"
            columns: ["refund_id"]
            isOneToOne: false
            referencedRelation: "refunds"
            referencedColumns: ["refund_id"]
          },
          {
            foreignKeyName: "network_operator_fee_entries_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      network_operator_fee_rules: {
        Row: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          fee_rule_id: string
          fee_type: Database["public"]["Enums"]["network_operator_fee_type"]
          fixed_amount: number
          max_amount: number | null
          metadata: Json
          min_amount: number | null
          name: string
          operator_organization_id: string
          percent_bps: number
          status: Database["public"]["Enums"]["network_fee_rule_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          fee_rule_id?: string
          fee_type?: Database["public"]["Enums"]["network_operator_fee_type"]
          fixed_amount?: number
          max_amount?: number | null
          metadata?: Json
          min_amount?: number | null
          name: string
          operator_organization_id: string
          percent_bps?: number
          status?: Database["public"]["Enums"]["network_fee_rule_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          fee_rule_id?: string
          fee_type?: Database["public"]["Enums"]["network_operator_fee_type"]
          fixed_amount?: number
          max_amount?: number | null
          metadata?: Json
          min_amount?: number | null
          name?: string
          operator_organization_id?: string
          percent_bps?: number
          status?: Database["public"]["Enums"]["network_fee_rule_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "network_operator_fee_rules_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "network_operator_fee_rules_operator_organization_id_fkey"
            columns: ["operator_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      network_operator_profiles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          default_capabilities: string[]
          default_fee_rule_id: string | null
          metadata: Json
          operator_profile_id: string
          organization_id: string
          risk_tier: string
          status: Database["public"]["Enums"]["network_operator_status"]
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          default_capabilities?: string[]
          default_fee_rule_id?: string | null
          metadata?: Json
          operator_profile_id?: string
          organization_id: string
          risk_tier?: string
          status?: Database["public"]["Enums"]["network_operator_status"]
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          default_capabilities?: string[]
          default_fee_rule_id?: string | null
          metadata?: Json
          operator_profile_id?: string
          organization_id?: string
          risk_tier?: string
          status?: Database["public"]["Enums"]["network_operator_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_network_operator_profiles_default_fee_rule"
            columns: ["default_fee_rule_id"]
            isOneToOne: false
            referencedRelation: "network_operator_fee_rules"
            referencedColumns: ["fee_rule_id"]
          },
          {
            foreignKeyName: "network_operator_profiles_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "network_operator_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      network_transaction_contexts: {
        Row: {
          actor_merchant_id: string | null
          api_key: string | null
          capability_key: string | null
          checkout_session_id: string | null
          created_at: string
          environment: string
          member_organization_id: string
          metadata: Json
          network_account_id: string
          network_membership_id: string
          network_transaction_context_id: string
          operator_fee_amount: number
          operator_fee_currency:
            | Database["public"]["Enums"]["currency_code"]
            | null
          operator_organization_id: string
          refund_id: string | null
          transaction_id: string | null
        }
        Insert: {
          actor_merchant_id?: string | null
          api_key?: string | null
          capability_key?: string | null
          checkout_session_id?: string | null
          created_at?: string
          environment: string
          member_organization_id: string
          metadata?: Json
          network_account_id: string
          network_membership_id: string
          network_transaction_context_id?: string
          operator_fee_amount?: number
          operator_fee_currency?:
            | Database["public"]["Enums"]["currency_code"]
            | null
          operator_organization_id: string
          refund_id?: string | null
          transaction_id?: string | null
        }
        Update: {
          actor_merchant_id?: string | null
          api_key?: string | null
          capability_key?: string | null
          checkout_session_id?: string | null
          created_at?: string
          environment?: string
          member_organization_id?: string
          metadata?: Json
          network_account_id?: string
          network_membership_id?: string
          network_transaction_context_id?: string
          operator_fee_amount?: number
          operator_fee_currency?:
            | Database["public"]["Enums"]["currency_code"]
            | null
          operator_organization_id?: string
          refund_id?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "network_transaction_contexts_actor_merchant_id_fkey"
            columns: ["actor_merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "network_transaction_contexts_capability_key_fkey"
            columns: ["capability_key"]
            isOneToOne: false
            referencedRelation: "network_capabilities"
            referencedColumns: ["capability_key"]
          },
          {
            foreignKeyName: "network_transaction_contexts_checkout_session_id_fkey"
            columns: ["checkout_session_id"]
            isOneToOne: false
            referencedRelation: "checkout_sessions"
            referencedColumns: ["checkout_session_id"]
          },
          {
            foreignKeyName: "network_transaction_contexts_member_organization_id_fkey"
            columns: ["member_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "network_transaction_contexts_network_account_id_fkey"
            columns: ["network_account_id"]
            isOneToOne: false
            referencedRelation: "network_accounts"
            referencedColumns: ["network_account_id"]
          },
          {
            foreignKeyName: "network_transaction_contexts_network_membership_id_fkey"
            columns: ["network_membership_id"]
            isOneToOne: false
            referencedRelation: "network_memberships"
            referencedColumns: ["network_membership_id"]
          },
          {
            foreignKeyName: "network_transaction_contexts_operator_fee_currency_fkey"
            columns: ["operator_fee_currency"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "network_transaction_contexts_operator_organization_id_fkey"
            columns: ["operator_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "network_transaction_contexts_refund_id_fkey"
            columns: ["refund_id"]
            isOneToOne: false
            referencedRelation: "refunds"
            referencedColumns: ["refund_id"]
          },
          {
            foreignKeyName: "network_transaction_contexts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      notification_outbox: {
        Row: {
          attempt_count: number
          channel: string
          created_at: string
          dead_lettered_at: string | null
          idempotency_key: string
          last_error: string | null
          outbox_id: string
          payload: Json
          status: string
          updated_at: string
        }
        Insert: {
          attempt_count?: number
          channel: string
          created_at?: string
          dead_lettered_at?: string | null
          idempotency_key: string
          last_error?: string | null
          outbox_id?: string
          payload: Json
          status?: string
          updated_at?: string
        }
        Update: {
          attempt_count?: number
          channel?: string
          created_at?: string
          dead_lettered_at?: string | null
          idempotency_key?: string
          last_error?: string | null
          outbox_id?: string
          payload?: Json
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          environment: string
          event_key: string | null
          is_archived: boolean | null
          is_read: boolean | null
          merchant_id: string | null
          message: string
          metadata: Json | null
          notification_id: string
          organization_id: string
          severity: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          created_at?: string | null
          environment?: string
          event_key?: string | null
          is_archived?: boolean | null
          is_read?: boolean | null
          merchant_id?: string | null
          message: string
          metadata?: Json | null
          notification_id?: string
          organization_id: string
          severity?: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          created_at?: string | null
          environment?: string
          event_key?: string | null
          is_archived?: boolean | null
          is_read?: boolean | null
          merchant_id?: string | null
          message?: string
          metadata?: Json | null
          notification_id?: string
          organization_id?: string
          severity?: string
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notifications_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      oauth_access_tokens: {
        Row: {
          api_key: string | null
          client_id: string
          created_at: string
          expires_at: string
          grant_type: string
          organization_id: string | null
          provisioning_key_id: string | null
          resource: string | null
          revoked_at: string | null
          scope: string
          token_hash: string
          token_id: string
          user_id: string
        }
        Insert: {
          api_key?: string | null
          client_id: string
          created_at?: string
          expires_at: string
          grant_type?: string
          organization_id?: string | null
          provisioning_key_id?: string | null
          resource?: string | null
          revoked_at?: string | null
          scope?: string
          token_hash: string
          token_id?: string
          user_id: string
        }
        Update: {
          api_key?: string | null
          client_id?: string
          created_at?: string
          expires_at?: string
          grant_type?: string
          organization_id?: string | null
          provisioning_key_id?: string | null
          resource?: string | null
          revoked_at?: string | null
          scope?: string
          token_hash?: string
          token_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oauth_access_tokens_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "oauth_clients"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "oauth_access_tokens_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "oauth_access_tokens_provisioning_key_id_fkey"
            columns: ["provisioning_key_id"]
            isOneToOne: false
            referencedRelation: "platform_provisioning_keys"
            referencedColumns: ["provisioning_key_id"]
          },
        ]
      }
      oauth_authorization_codes: {
        Row: {
          api_key: string | null
          client_id: string
          code_challenge: string
          code_challenge_method: string
          code_hash: string
          code_id: string
          created_at: string
          expires_at: string
          grant_type: string
          organization_id: string | null
          provisioning_key_id: string | null
          redirect_uri: string
          resource: string | null
          scope: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          api_key?: string | null
          client_id: string
          code_challenge: string
          code_challenge_method?: string
          code_hash: string
          code_id?: string
          created_at?: string
          expires_at: string
          grant_type?: string
          organization_id?: string | null
          provisioning_key_id?: string | null
          redirect_uri: string
          resource?: string | null
          scope?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          api_key?: string | null
          client_id?: string
          code_challenge?: string
          code_challenge_method?: string
          code_hash?: string
          code_id?: string
          created_at?: string
          expires_at?: string
          grant_type?: string
          organization_id?: string | null
          provisioning_key_id?: string | null
          redirect_uri?: string
          resource?: string | null
          scope?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oauth_authorization_codes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "oauth_clients"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "oauth_authorization_codes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "oauth_authorization_codes_provisioning_key_id_fkey"
            columns: ["provisioning_key_id"]
            isOneToOne: false
            referencedRelation: "platform_provisioning_keys"
            referencedColumns: ["provisioning_key_id"]
          },
        ]
      }
      oauth_clients: {
        Row: {
          client_id: string
          client_name: string
          client_secret_hash: string | null
          created_at: string
          grant_types: string[]
          is_active: boolean
          redirect_uris: string[]
          response_types: string[]
          scopes: string[]
          token_endpoint_auth_method: string
          updated_at: string
        }
        Insert: {
          client_id: string
          client_name: string
          client_secret_hash?: string | null
          created_at?: string
          grant_types?: string[]
          is_active?: boolean
          redirect_uris?: string[]
          response_types?: string[]
          scopes?: string[]
          token_endpoint_auth_method?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          client_name?: string
          client_secret_hash?: string | null
          created_at?: string
          grant_types?: string[]
          is_active?: boolean
          redirect_uris?: string[]
          response_types?: string[]
          scopes?: string[]
          token_endpoint_auth_method?: string
          updated_at?: string
        }
        Relationships: []
      }
      oauth_refresh_tokens: {
        Row: {
          access_token_id: string
          client_id: string
          created_at: string
          expires_at: string
          revoked_at: string | null
          token_hash: string
          token_id: string
          user_id: string
        }
        Insert: {
          access_token_id: string
          client_id: string
          created_at?: string
          expires_at: string
          revoked_at?: string | null
          token_hash: string
          token_id?: string
          user_id: string
        }
        Update: {
          access_token_id?: string
          client_id?: string
          created_at?: string
          expires_at?: string
          revoked_at?: string | null
          token_hash?: string
          token_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oauth_refresh_tokens_access_token_id_fkey"
            columns: ["access_token_id"]
            isOneToOne: false
            referencedRelation: "oauth_access_tokens"
            referencedColumns: ["token_id"]
          },
          {
            foreignKeyName: "oauth_refresh_tokens_access_token_id_fkey"
            columns: ["access_token_id"]
            isOneToOne: false
            referencedRelation: "oauth_merchant_connections"
            referencedColumns: ["token_id"]
          },
          {
            foreignKeyName: "oauth_refresh_tokens_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "oauth_clients"
            referencedColumns: ["client_id"]
          },
        ]
      }
      organization_addresses: {
        Row: {
          city: string | null
          country: string
          created_at: string
          district: string | null
          organization_id: string
          postal_code: string | null
          region: string | null
          street: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          country: string
          created_at?: string
          district?: string | null
          organization_id: string
          postal_code?: string | null
          region?: string | null
          street?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          country?: string
          created_at?: string
          district?: string | null
          organization_id?: string
          postal_code?: string | null
          region?: string | null
          street?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_addresses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_checkout_settings: {
        Row: {
          allowed_embed_origins: string[]
          appearance_billing_address: string
          appearance_border_radius: string
          appearance_theme: string
          apple_pay_enabled: boolean
          created_at: string
          custom_fields: Json
          customer_notifications: Json
          default_cancel_url: string | null
          default_card_currency: Database["public"]["Enums"]["currency_code"]
          default_language: string
          default_success_url: string | null
          display_coupon_field: boolean
          ga4_measurement_id: string | null
          google_pay_enabled: boolean
          merchant_post_transaction_notifications: Json
          merchant_recipients: Json
          meta_pixel_id: string | null
          organization_id: string
          pass_processing_fees_to_customer: boolean
          pay_button_bg_color: string
          payment_link_duration: number
          require_billing_address: boolean
          require_email: boolean
          require_name: boolean
          require_phone: boolean
          updated_at: string
        }
        Insert: {
          allowed_embed_origins?: string[]
          appearance_billing_address?: string
          appearance_border_radius?: string
          appearance_theme?: string
          apple_pay_enabled?: boolean
          created_at?: string
          custom_fields?: Json
          customer_notifications?: Json
          default_cancel_url?: string | null
          default_card_currency?: Database["public"]["Enums"]["currency_code"]
          default_language?: string
          default_success_url?: string | null
          display_coupon_field?: boolean
          ga4_measurement_id?: string | null
          google_pay_enabled?: boolean
          merchant_post_transaction_notifications?: Json
          merchant_recipients?: Json
          meta_pixel_id?: string | null
          organization_id: string
          pass_processing_fees_to_customer?: boolean
          pay_button_bg_color?: string
          payment_link_duration?: number
          require_billing_address?: boolean
          require_email?: boolean
          require_name?: boolean
          require_phone?: boolean
          updated_at?: string
        }
        Update: {
          allowed_embed_origins?: string[]
          appearance_billing_address?: string
          appearance_border_radius?: string
          appearance_theme?: string
          apple_pay_enabled?: boolean
          created_at?: string
          custom_fields?: Json
          customer_notifications?: Json
          default_cancel_url?: string | null
          default_card_currency?: Database["public"]["Enums"]["currency_code"]
          default_language?: string
          default_success_url?: string | null
          display_coupon_field?: boolean
          ga4_measurement_id?: string | null
          google_pay_enabled?: boolean
          merchant_post_transaction_notifications?: Json
          merchant_recipients?: Json
          meta_pixel_id?: string | null
          organization_id?: string
          pass_processing_fees_to_customer?: boolean
          pay_button_bg_color?: string
          payment_link_duration?: number
          require_billing_address?: boolean
          require_email?: boolean
          require_name?: boolean
          require_phone?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_checkout_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_customer_portal_policies: {
        Row: {
          allow_cancel: boolean
          allow_email_auth: boolean
          allow_email_change: boolean
          allow_invoice_edit: boolean
          allow_pause: boolean
          allow_payment_method_update: boolean
          allow_plan_change: boolean
          allow_resume: boolean
          allow_sms_auth: boolean
          allow_trusted_launch: boolean
          collect_cancellation_reason: boolean
          created_at: string
          organization_id: string
          portal_session_ttl_seconds: number
          return_url_allowlist: string[] | null
          show_metered_usage: boolean
          updated_at: string
          verification_max_attempts: number
        }
        Insert: {
          allow_cancel?: boolean
          allow_email_auth?: boolean
          allow_email_change?: boolean
          allow_invoice_edit?: boolean
          allow_pause?: boolean
          allow_payment_method_update?: boolean
          allow_plan_change?: boolean
          allow_resume?: boolean
          allow_sms_auth?: boolean
          allow_trusted_launch?: boolean
          collect_cancellation_reason?: boolean
          created_at?: string
          organization_id: string
          portal_session_ttl_seconds?: number
          return_url_allowlist?: string[] | null
          show_metered_usage?: boolean
          updated_at?: string
          verification_max_attempts?: number
        }
        Update: {
          allow_cancel?: boolean
          allow_email_auth?: boolean
          allow_email_change?: boolean
          allow_invoice_edit?: boolean
          allow_pause?: boolean
          allow_payment_method_update?: boolean
          allow_plan_change?: boolean
          allow_resume?: boolean
          allow_sms_auth?: boolean
          allow_trusted_launch?: boolean
          collect_cancellation_reason?: boolean
          created_at?: string
          organization_id?: string
          portal_session_ttl_seconds?: number
          return_url_allowlist?: string[] | null
          show_metered_usage?: boolean
          updated_at?: string
          verification_max_attempts?: number
        }
        Relationships: [
          {
            foreignKeyName: "organization_customer_portal_policies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_domains: {
        Row: {
          created_at: string
          dns_records: Json | null
          domain: string
          domain_id: string
          organization_id: string
          payment_status: Database["public"]["Enums"]["domain_payment_status"]
          ssl_status: string | null
          status: Database["public"]["Enums"]["domain_verification_status"]
          type: Database["public"]["Enums"]["domain_type"]
          updated_at: string
          verification_errors: Json | null
        }
        Insert: {
          created_at?: string
          dns_records?: Json | null
          domain: string
          domain_id?: string
          organization_id: string
          payment_status?: Database["public"]["Enums"]["domain_payment_status"]
          ssl_status?: string | null
          status?: Database["public"]["Enums"]["domain_verification_status"]
          type?: Database["public"]["Enums"]["domain_type"]
          updated_at?: string
          verification_errors?: Json | null
        }
        Update: {
          created_at?: string
          dns_records?: Json | null
          domain?: string
          domain_id?: string
          organization_id?: string
          payment_status?: Database["public"]["Enums"]["domain_payment_status"]
          ssl_status?: string | null
          status?: Database["public"]["Enums"]["domain_verification_status"]
          type?: Database["public"]["Enums"]["domain_type"]
          updated_at?: string
          verification_errors?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_domains_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_fee_links: {
        Row: {
          created_at: string
          fee_link_id: string
          fee_type_id: string
          organization_id: string
          product_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          fee_link_id?: string
          fee_type_id: string
          organization_id: string
          product_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          fee_link_id?: string
          fee_type_id?: string
          organization_id?: string
          product_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_fee_links_fee_type_id_fkey"
            columns: ["fee_type_id"]
            isOneToOne: false
            referencedRelation: "organization_fees"
            referencedColumns: ["fee_type_id"]
          },
          {
            foreignKeyName: "organization_fee_links_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_fee_links_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      organization_fee_structure: {
        Row: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string | null
          fee_category: Database["public"]["Enums"]["fee_category"]
          fee_payer: Database["public"]["Enums"]["fee_payer_type"]
          fee_structure_id: string
          fee_subcategory: Database["public"]["Enums"]["fee_subcategory"]
          fixed_amount: number | null
          is_active: boolean
          is_visible: boolean
          metadata: Json | null
          name: string
          organization_id: string
          payment_method_code:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          percentage: number | null
          provider_code: Database["public"]["Enums"]["provider_code"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          fee_category: Database["public"]["Enums"]["fee_category"]
          fee_payer?: Database["public"]["Enums"]["fee_payer_type"]
          fee_structure_id?: string
          fee_subcategory: Database["public"]["Enums"]["fee_subcategory"]
          fixed_amount?: number | null
          is_active?: boolean
          is_visible?: boolean
          metadata?: Json | null
          name: string
          organization_id: string
          payment_method_code?:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          percentage?: number | null
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          fee_category?: Database["public"]["Enums"]["fee_category"]
          fee_payer?: Database["public"]["Enums"]["fee_payer_type"]
          fee_structure_id?: string
          fee_subcategory?: Database["public"]["Enums"]["fee_subcategory"]
          fixed_amount?: number | null
          is_active?: boolean
          is_visible?: boolean
          metadata?: Json | null
          name?: string
          organization_id?: string
          payment_method_code?:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          percentage?: number | null
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_fee_structure_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "organization_fee_structure_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_fee_structure_provider_code_fkey"
            columns: ["provider_code"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["code"]
          },
        ]
      }
      organization_fees: {
        Row: {
          apply_once_per_order: boolean
          apply_to_direct_charges: boolean
          created_at: string
          deleted_at: string | null
          fee_type_id: string
          fixed_amount: number | null
          is_enabled: boolean
          name: string
          organization_id: string
          percentage: number
          updated_at: string
        }
        Insert: {
          apply_once_per_order?: boolean
          apply_to_direct_charges?: boolean
          created_at?: string
          deleted_at?: string | null
          fee_type_id?: string
          fixed_amount?: number | null
          is_enabled?: boolean
          name: string
          organization_id: string
          percentage?: number
          updated_at?: string
        }
        Update: {
          apply_once_per_order?: boolean
          apply_to_direct_charges?: boolean
          created_at?: string
          deleted_at?: string | null
          fee_type_id?: string
          fixed_amount?: number | null
          is_enabled?: boolean
          name?: string
          organization_id?: string
          percentage?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_fees_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_fraud_settings: {
        Row: {
          created_at: string
          custom_action: Database["public"]["Enums"]["fraud_action"] | null
          custom_threshold: number | null
          is_enabled: boolean
          organization_id: string
          rule_id: string
          setting_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_action?: Database["public"]["Enums"]["fraud_action"] | null
          custom_threshold?: number | null
          is_enabled?: boolean
          organization_id: string
          rule_id: string
          setting_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_action?: Database["public"]["Enums"]["fraud_action"] | null
          custom_threshold?: number | null
          is_enabled?: boolean
          organization_id?: string
          rule_id?: string
          setting_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_fraud_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_fraud_settings_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "fraud_rules"
            referencedColumns: ["rule_id"]
          },
        ]
      }
      organization_kyc: {
        Row: {
          address_proof_url: string | null
          approved_at: string | null
          authorized_signatory_email: string | null
          authorized_signatory_name: string | null
          business_description: string | null
          business_registration_url: string | null
          created_at: string | null
          created_by: string | null
          document_extraction: Json | null
          id_document_number: string | null
          legal_city: string | null
          legal_country: string | null
          legal_locked_at: string | null
          legal_organization_name: string | null
          legal_postal_code: string | null
          legal_region: string | null
          legal_representative_id_url: string | null
          legal_street: string | null
          organization_id: string
          proof_of_business: string | null
          proof_of_business_url: string | null
          status: Database["public"]["Enums"]["kyc_status"]
          tax_number: string | null
          updated_at: string | null
        }
        Insert: {
          address_proof_url?: string | null
          approved_at?: string | null
          authorized_signatory_email?: string | null
          authorized_signatory_name?: string | null
          business_description?: string | null
          business_registration_url?: string | null
          created_at?: string | null
          created_by?: string | null
          document_extraction?: Json | null
          id_document_number?: string | null
          legal_city?: string | null
          legal_country?: string | null
          legal_locked_at?: string | null
          legal_organization_name?: string | null
          legal_postal_code?: string | null
          legal_region?: string | null
          legal_representative_id_url?: string | null
          legal_street?: string | null
          organization_id: string
          proof_of_business?: string | null
          proof_of_business_url?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          tax_number?: string | null
          updated_at?: string | null
        }
        Update: {
          address_proof_url?: string | null
          approved_at?: string | null
          authorized_signatory_email?: string | null
          authorized_signatory_name?: string | null
          business_description?: string | null
          business_registration_url?: string | null
          created_at?: string | null
          created_by?: string | null
          document_extraction?: Json | null
          id_document_number?: string | null
          legal_city?: string | null
          legal_country?: string | null
          legal_locked_at?: string | null
          legal_organization_name?: string | null
          legal_postal_code?: string | null
          legal_region?: string | null
          legal_representative_id_url?: string | null
          legal_street?: string | null
          organization_id?: string
          proof_of_business?: string | null
          proof_of_business_url?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          tax_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_kyc_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "organization_kyc_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_member_roles: {
        Row: {
          assigned_by: string | null
          created_at: string
          merchant_org_id: string
          role_id: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          merchant_org_id: string
          role_id: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          merchant_org_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_member_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "organization_member_roles_merchant_org_id_fkey"
            columns: ["merchant_org_id"]
            isOneToOne: false
            referencedRelation: "merchant_organization_links"
            referencedColumns: ["merchant_org_id"]
          },
          {
            foreignKeyName: "organization_member_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "organization_roles"
            referencedColumns: ["role_id"]
          },
        ]
      }
      organization_payment_method_settings: {
        Row: {
          created_at: string
          is_visible: boolean
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          provider_code: Database["public"]["Enums"]["provider_code"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          is_visible?: boolean
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          provider_code: Database["public"]["Enums"]["provider_code"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          is_visible?: boolean
          organization_id?: string
          payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          provider_code?: Database["public"]["Enums"]["provider_code"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_payment_method_s_payment_method_code_provider_fkey"
            columns: ["payment_method_code", "provider_code"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["payment_method_code", "provider_code"]
          },
          {
            foreignKeyName: "organization_payment_method_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_payment_settings: {
        Row: {
          availability_delay_hours: number
          created_at: string
          is_active: boolean
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          provider_code: Database["public"]["Enums"]["provider_code"]
          updated_at: string
        }
        Insert: {
          availability_delay_hours?: number
          created_at?: string
          is_active?: boolean
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          provider_code: Database["public"]["Enums"]["provider_code"]
          updated_at?: string
        }
        Update: {
          availability_delay_hours?: number
          created_at?: string
          is_active?: boolean
          organization_id?: string
          payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          provider_code?: Database["public"]["Enums"]["provider_code"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_payment_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_permissions: {
        Row: {
          created_at: string
          description: string
          domain: string
          permission_key: string
        }
        Insert: {
          created_at?: string
          description: string
          domain: string
          permission_key: string
        }
        Update: {
          created_at?: string
          description?: string
          domain?: string
          permission_key?: string
        }
        Relationships: []
      }
      organization_providers_settings: {
        Row: {
          created_at: string
          is_connected: boolean
          is_phone_verified: boolean
          metadata: Json | null
          onboarding_status:
            | Database["public"]["Enums"]["onboarding_status"]
            | null
          organization_id: string
          phone_number: string | null
          provider_business_type:
            | Database["public"]["Enums"]["provider_business_type"]
            | null
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_merchant_id: string | null
          updated_at: string
          withdrawal_limit_max: number | null
          withdrawal_limit_min: number | null
          withdrawal_limit_monthly: number | null
        }
        Insert: {
          created_at?: string
          is_connected?: boolean
          is_phone_verified?: boolean
          metadata?: Json | null
          onboarding_status?:
            | Database["public"]["Enums"]["onboarding_status"]
            | null
          organization_id: string
          phone_number?: string | null
          provider_business_type?:
            | Database["public"]["Enums"]["provider_business_type"]
            | null
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_merchant_id?: string | null
          updated_at?: string
          withdrawal_limit_max?: number | null
          withdrawal_limit_min?: number | null
          withdrawal_limit_monthly?: number | null
        }
        Update: {
          created_at?: string
          is_connected?: boolean
          is_phone_verified?: boolean
          metadata?: Json | null
          onboarding_status?:
            | Database["public"]["Enums"]["onboarding_status"]
            | null
          organization_id?: string
          phone_number?: string | null
          provider_business_type?:
            | Database["public"]["Enums"]["provider_business_type"]
            | null
          provider_code?: Database["public"]["Enums"]["provider_code"]
          provider_merchant_id?: string | null
          updated_at?: string
          withdrawal_limit_max?: number | null
          withdrawal_limit_min?: number | null
          withdrawal_limit_monthly?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_providers_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_providers_settings_provider_code_fkey"
            columns: ["provider_code"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["code"]
          },
        ]
      }
      organization_radar_rule_settings: {
        Row: {
          created_at: string
          custom_action: Database["public"]["Enums"]["fraud_action"] | null
          custom_threshold: number | null
          is_enabled: boolean
          organization_id: string
          rule_id: string
          setting_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_action?: Database["public"]["Enums"]["fraud_action"] | null
          custom_threshold?: number | null
          is_enabled?: boolean
          organization_id: string
          rule_id: string
          setting_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_action?: Database["public"]["Enums"]["fraud_action"] | null
          custom_threshold?: number | null
          is_enabled?: boolean
          organization_id?: string
          rule_id?: string
          setting_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_radar_rule_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_radar_rule_settings_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "radar_rules"
            referencedColumns: ["rule_id"]
          },
        ]
      }
      organization_radar_settings: {
        Row: {
          created_at: string
          enabled: boolean
          mode: Database["public"]["Enums"]["radar_mode"]
          organization_id: string
          radar_meter_id: string | null
          stripe_radar_passthrough: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          mode?: Database["public"]["Enums"]["radar_mode"]
          organization_id: string
          radar_meter_id?: string | null
          stripe_radar_passthrough?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          mode?: Database["public"]["Enums"]["radar_mode"]
          organization_id?: string
          radar_meter_id?: string | null
          stripe_radar_passthrough?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_radar_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_radar_settings_radar_meter_id_fkey"
            columns: ["radar_meter_id"]
            isOneToOne: false
            referencedRelation: "meters"
            referencedColumns: ["meter_id"]
          },
        ]
      }
      organization_revenue_cache: {
        Row: {
          calculation_period_end: string
          calculation_period_start: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          current_month_revenue: number | null
          current_tier_id: string | null
          last_calculated_at: string | null
          organization_id: string
          previous_month_revenue: number | null
          tier_determination_revenue: number | null
          tier_effective_date: string
          updated_at: string | null
        }
        Insert: {
          calculation_period_end: string
          calculation_period_start: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          current_month_revenue?: number | null
          current_tier_id?: string | null
          last_calculated_at?: string | null
          organization_id: string
          previous_month_revenue?: number | null
          tier_determination_revenue?: number | null
          tier_effective_date: string
          updated_at?: string | null
        }
        Update: {
          calculation_period_end?: string
          calculation_period_start?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          current_month_revenue?: number | null
          current_tier_id?: string | null
          last_calculated_at?: string | null
          organization_id?: string
          previous_month_revenue?: number | null
          tier_determination_revenue?: number | null
          tier_effective_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_revenue_cache_current_tier_id_fkey"
            columns: ["current_tier_id"]
            isOneToOne: false
            referencedRelation: "pricing_tiers"
            referencedColumns: ["tier_id"]
          },
          {
            foreignKeyName: "organization_revenue_cache_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_role_permissions: {
        Row: {
          created_at: string
          permission_key: string
          role_id: string
        }
        Insert: {
          created_at?: string
          permission_key: string
          role_id: string
        }
        Update: {
          created_at?: string
          permission_key?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_role_permissions_permission_key_fkey"
            columns: ["permission_key"]
            isOneToOne: false
            referencedRelation: "organization_permissions"
            referencedColumns: ["permission_key"]
          },
          {
            foreignKeyName: "organization_role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "organization_roles"
            referencedColumns: ["role_id"]
          },
        ]
      }
      organization_roles: {
        Row: {
          created_at: string
          is_active: boolean
          is_system: boolean
          key: string
          organization_id: string
          role_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          is_active?: boolean
          is_system?: boolean
          key: string
          organization_id: string
          role_id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          is_active?: boolean
          is_system?: boolean
          key?: string
          organization_id?: string
          role_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_test_balances: {
        Row: {
          balance: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          organization_id: string
          organization_test_balance_id: string
          updated_at: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          organization_id: string
          organization_test_balance_id?: string
          updated_at?: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          organization_id?: string
          organization_test_balance_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_test_balances_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "organization_test_balances_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_workflows: {
        Row: {
          created_at: string
          environment: string
          is_enabled: boolean
          name: string
          organization_id: string
          steps: Json
          trigger_config: Json
          updated_at: string
          workflow_id: string
          workflow_type: string
        }
        Insert: {
          created_at?: string
          environment?: string
          is_enabled?: boolean
          name: string
          organization_id: string
          steps?: Json
          trigger_config?: Json
          updated_at?: string
          workflow_id?: string
          workflow_type?: string
        }
        Update: {
          created_at?: string
          environment?: string
          is_enabled?: boolean
          name?: string
          organization_id?: string
          steps?: Json
          trigger_config?: Json
          updated_at?: string
          workflow_id?: string
          workflow_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_workflows_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organizations: {
        Row: {
          allowed_currencies: Database["public"]["Enums"]["currency_code"][]
          api_access_suspended: boolean
          arr: number
          created_at: string
          default_currency: Database["public"]["Enums"]["currency_code"]
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
            | Database["public"]["Enums"]["pricing_plan_type"]
            | null
          public_id: string
          radar_enabled: boolean
          slug: string | null
          status: Database["public"]["Enums"]["organization_status"]
          storefront_enabled: boolean
          total_customers: number | null
          total_merchants: number | null
          total_revenue: number | null
          total_transactions: number | null
          updated_at: string
          verification_status: Database["public"]["Enums"]["organization_verification_status"]
          website_url: string | null
          whatsapp_number: string | null
        }
        Insert: {
          allowed_currencies?: Database["public"]["Enums"]["currency_code"][]
          api_access_suspended?: boolean
          arr?: number
          created_at?: string
          default_currency?: Database["public"]["Enums"]["currency_code"]
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
            | Database["public"]["Enums"]["pricing_plan_type"]
            | null
          public_id?: string
          radar_enabled?: boolean
          slug?: string | null
          status?: Database["public"]["Enums"]["organization_status"]
          storefront_enabled?: boolean
          total_customers?: number | null
          total_merchants?: number | null
          total_revenue?: number | null
          total_transactions?: number | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["organization_verification_status"]
          website_url?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          allowed_currencies?: Database["public"]["Enums"]["currency_code"][]
          api_access_suspended?: boolean
          arr?: number
          created_at?: string
          default_currency?: Database["public"]["Enums"]["currency_code"]
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
            | Database["public"]["Enums"]["pricing_plan_type"]
            | null
          public_id?: string
          radar_enabled?: boolean
          slug?: string | null
          status?: Database["public"]["Enums"]["organization_status"]
          storefront_enabled?: boolean
          total_customers?: number | null
          total_merchants?: number | null
          total_revenue?: number | null
          total_transactions?: number | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["organization_verification_status"]
          website_url?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      orphan_signup_cleanup_state: {
        Row: {
          created_at: string
          user_id: string
          warning_sent_at: string
        }
        Insert: {
          created_at?: string
          user_id: string
          warning_sent_at?: string
        }
        Update: {
          created_at?: string
          user_id?: string
          warning_sent_at?: string
        }
        Relationships: []
      }
      partner_management_keys: {
        Row: {
          created_at: string
          is_active: boolean
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          management_key_id: string
          name: string
          partner_id: string
        }
        Insert: {
          created_at?: string
          is_active?: boolean
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          management_key_id?: string
          name: string
          partner_id: string
        }
        Update: {
          created_at?: string
          is_active?: boolean
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          management_key_id?: string
          name?: string
          partner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_management_keys_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "platform_partners"
            referencedColumns: ["partner_id"]
          },
        ]
      }
      payment_link_items: {
        Row: {
          created_at: string | null
          id: string
          payment_link_id: string
          price_id: string | null
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          payment_link_id: string
          price_id?: string | null
          product_id: string
          quantity?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          payment_link_id?: string
          price_id?: string | null
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "payment_link_items_payment_link_id_fkey"
            columns: ["payment_link_id"]
            isOneToOne: false
            referencedRelation: "payment_links"
            referencedColumns: ["link_id"]
          },
          {
            foreignKeyName: "payment_link_items_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["price_id"]
          },
          {
            foreignKeyName: "payment_link_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
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
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string | null
          environment: string
          expires_at: string | null
          is_active: boolean
          link_id: string
          link_type: Database["public"]["Enums"]["link_type"]
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
          currency_code: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          environment?: string
          expires_at?: string | null
          is_active?: boolean
          link_id?: string
          link_type: Database["public"]["Enums"]["link_type"]
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
          currency_code?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          environment?: string
          expires_at?: string | null
          is_active?: boolean
          link_id?: string
          link_type?: Database["public"]["Enums"]["link_type"]
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
      payment_methods: {
        Row: {
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          provider_code: Database["public"]["Enums"]["provider_code"]
        }
        Insert: {
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          provider_code: Database["public"]["Enums"]["provider_code"]
        }
        Update: {
          payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          provider_code?: Database["public"]["Enums"]["provider_code"]
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_provider_code_fkey"
            columns: ["provider_code"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["code"]
          },
        ]
      }
      payment_provider_fees: {
        Row: {
          cost_fix: number
          cost_pct: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          id: string
          is_active: boolean
          price_fix: number
          price_pct: number
          provider_code: Database["public"]["Enums"]["provider_code"]
          updated_at: string
        }
        Insert: {
          cost_fix?: number
          cost_pct?: number
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          id?: string
          is_active?: boolean
          price_fix?: number
          price_pct?: number
          provider_code: Database["public"]["Enums"]["provider_code"]
          updated_at?: string
        }
        Update: {
          cost_fix?: number
          cost_pct?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          id?: string
          is_active?: boolean
          price_fix?: number
          price_pct?: number
          provider_code?: Database["public"]["Enums"]["provider_code"]
          updated_at?: string
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          currency_code: Database["public"]["Enums"]["currency_code"]
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
            | Database["public"]["Enums"]["spi_payment_request_category"]
            | null
          spi_payment_status:
            | Database["public"]["Enums"]["spi_payment_status"]
            | null
          spi_ref_doc_numero: string | null
          spi_ref_doc_type:
            | Database["public"]["Enums"]["spi_document_type"]
            | null
          spi_rejection_reason:
            | Database["public"]["Enums"]["spi_rejection_reason"]
            | null
          spi_remise_amount: number | null
          spi_remise_rate: number | null
          spi_tx_id: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          currency_code: Database["public"]["Enums"]["currency_code"]
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
            | Database["public"]["Enums"]["spi_payment_request_category"]
            | null
          spi_payment_status?:
            | Database["public"]["Enums"]["spi_payment_status"]
            | null
          spi_ref_doc_numero?: string | null
          spi_ref_doc_type?:
            | Database["public"]["Enums"]["spi_document_type"]
            | null
          spi_rejection_reason?:
            | Database["public"]["Enums"]["spi_rejection_reason"]
            | null
          spi_remise_amount?: number | null
          spi_remise_rate?: number | null
          spi_tx_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          currency_code?: Database["public"]["Enums"]["currency_code"]
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
            | Database["public"]["Enums"]["spi_payment_request_category"]
            | null
          spi_payment_status?:
            | Database["public"]["Enums"]["spi_payment_status"]
            | null
          spi_ref_doc_numero?: string | null
          spi_ref_doc_type?:
            | Database["public"]["Enums"]["spi_document_type"]
            | null
          spi_rejection_reason?:
            | Database["public"]["Enums"]["spi_rejection_reason"]
            | null
          spi_remise_amount?: number | null
          spi_remise_rate?: number | null
          spi_tx_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
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
      payout_methods: {
        Row: {
          account_name: string
          account_number: string
          auto_withdrawal_day: number | null
          auto_withdrawal_enabled: boolean
          auto_withdrawal_last_run: string | null
          auto_withdrawal_method: string | null
          auto_withdrawal_mobile_provider:
            | Database["public"]["Enums"]["provider_code"]
            | null
          bank_code: string | null
          bank_name: string
          branch_code: string | null
          country: string | null
          created_at: string
          eligible_for_platform_withdrawal_at: string | null
          is_default: boolean
          is_main: boolean | null
          is_primary: boolean
          is_spi_enabled: boolean
          is_uemoa: boolean
          is_valid: boolean
          organization_id: string
          payout_method_id: string
          payout_method_type: string | null
          provider_code: Database["public"]["Enums"]["provider_code"] | null
          spi_account_number: string | null
          spi_alias_mbno: string | null
          spi_alias_shid: string | null
          spi_alias_type: string | null
          updated_at: string
          verification_status: string | null
        }
        Insert: {
          account_name: string
          account_number: string
          auto_withdrawal_day?: number | null
          auto_withdrawal_enabled?: boolean
          auto_withdrawal_last_run?: string | null
          auto_withdrawal_method?: string | null
          auto_withdrawal_mobile_provider?:
            | Database["public"]["Enums"]["provider_code"]
            | null
          bank_code?: string | null
          bank_name: string
          branch_code?: string | null
          country?: string | null
          created_at?: string
          eligible_for_platform_withdrawal_at?: string | null
          is_default?: boolean
          is_main?: boolean | null
          is_primary?: boolean
          is_spi_enabled?: boolean
          is_uemoa?: boolean
          is_valid?: boolean
          organization_id: string
          payout_method_id?: string
          payout_method_type?: string | null
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          spi_account_number?: string | null
          spi_alias_mbno?: string | null
          spi_alias_shid?: string | null
          spi_alias_type?: string | null
          updated_at?: string
          verification_status?: string | null
        }
        Update: {
          account_name?: string
          account_number?: string
          auto_withdrawal_day?: number | null
          auto_withdrawal_enabled?: boolean
          auto_withdrawal_last_run?: string | null
          auto_withdrawal_method?: string | null
          auto_withdrawal_mobile_provider?:
            | Database["public"]["Enums"]["provider_code"]
            | null
          bank_code?: string | null
          bank_name?: string
          branch_code?: string | null
          country?: string | null
          created_at?: string
          eligible_for_platform_withdrawal_at?: string | null
          is_default?: boolean
          is_main?: boolean | null
          is_primary?: boolean
          is_spi_enabled?: boolean
          is_uemoa?: boolean
          is_valid?: boolean
          organization_id?: string
          payout_method_id?: string
          payout_method_type?: string | null
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          spi_account_number?: string | null
          spi_alias_mbno?: string | null
          spi_alias_shid?: string | null
          spi_alias_type?: string | null
          updated_at?: string
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payout_methods_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "payout_methods_spi_alias_shid_fkey"
            columns: ["spi_alias_shid"]
            isOneToOne: false
            referencedRelation: "spi_account_aliases"
            referencedColumns: ["alias_id"]
          },
        ]
      }
      payout_pin_attempts: {
        Row: {
          failed_count: number
          locked_until: string | null
          merchant_id: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          failed_count?: number
          locked_until?: string | null
          merchant_id: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          failed_count?: number
          locked_until?: string | null
          merchant_id?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_pin_attempts_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "payout_pin_attempts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      payout_pin_sessions: {
        Row: {
          created_at: string
          expires_at: string
          merchant_id: string
          organization_id: string
          session_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          merchant_id: string
          organization_id: string
          session_id?: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          merchant_id?: string
          organization_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_pin_sessions_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "payout_pin_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      payouts: {
        Row: {
          account_id: string
          amount: number
          created_at: string
          created_by: string | null
          currency_code: Database["public"]["Enums"]["currency_code"]
          environment: string
          metadata: Json | null
          organization_id: string
          payment_method_code:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          payout_id: string
          payout_method_id: string | null
          provider_code: Database["public"]["Enums"]["provider_code"] | null
          public_id: string
          status: Database["public"]["Enums"]["payout_status"]
          updated_at: string
        }
        Insert: {
          account_id: string
          amount: number
          created_at?: string
          created_by?: string | null
          currency_code: Database["public"]["Enums"]["currency_code"]
          environment?: string
          metadata?: Json | null
          organization_id: string
          payment_method_code?:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          payout_id?: string
          payout_method_id?: string | null
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          public_id?: string
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
        }
        Update: {
          account_id?: string
          amount?: number
          created_at?: string
          created_by?: string | null
          currency_code?: Database["public"]["Enums"]["currency_code"]
          environment?: string
          metadata?: Json | null
          organization_id?: string
          payment_method_code?:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          payout_id?: string
          payout_method_id?: string | null
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          public_id?: string
          status?: Database["public"]["Enums"]["payout_status"]
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
      plan_entitlements: {
        Row: {
          created_at: string
          entitlement_id: string
          limit_value: number | null
          plan_entitlement_id: string
          product_id: string
        }
        Insert: {
          created_at?: string
          entitlement_id: string
          limit_value?: number | null
          plan_entitlement_id?: string
          product_id: string
        }
        Update: {
          created_at?: string
          entitlement_id?: string
          limit_value?: number | null
          plan_entitlement_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_entitlements_entitlement_id_fkey"
            columns: ["entitlement_id"]
            isOneToOne: false
            referencedRelation: "entitlements"
            referencedColumns: ["entitlement_id"]
          },
          {
            foreignKeyName: "plan_entitlements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      platform_channel_balance_history: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          beneficiary_payout_id: string | null
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string | null
          fee_amount: number | null
          history_id: string
          operation_type: string
          payout_id: string | null
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_cost: number
          transaction_id: string | null
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          beneficiary_payout_id?: string | null
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          fee_amount?: number | null
          history_id?: string
          operation_type: string
          payout_id?: string | null
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_cost?: number
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          beneficiary_payout_id?: string | null
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          fee_amount?: number | null
          history_id?: string
          operation_type?: string
          payout_id?: string | null
          provider_code?: Database["public"]["Enums"]["provider_code"]
          provider_cost?: number
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_channel_balance_history_beneficiary_payout_id_fkey"
            columns: ["beneficiary_payout_id"]
            isOneToOne: false
            referencedRelation: "beneficiary_payouts"
            referencedColumns: ["payout_id"]
          },
          {
            foreignKeyName: "platform_channel_balance_history_payout_id_fkey"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "payouts"
            referencedColumns: ["payout_id"]
          },
          {
            foreignKeyName: "platform_channel_balance_history_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      platform_channel_balances: {
        Row: {
          balance_id: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          current_balance: number | null
          gross_inflow: number
          last_inflow_txn_id: string | null
          last_outflow_payout_id: string | null
          outflow_total: number
          payout_count: number
          platform_revenue: number
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_cost_total: number
          required_float: number
          transaction_count: number
          updated_at: string
        }
        Insert: {
          balance_id?: string
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          current_balance?: number | null
          gross_inflow?: number
          last_inflow_txn_id?: string | null
          last_outflow_payout_id?: string | null
          outflow_total?: number
          payout_count?: number
          platform_revenue?: number
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_cost_total?: number
          required_float?: number
          transaction_count?: number
          updated_at?: string
        }
        Update: {
          balance_id?: string
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          current_balance?: number | null
          gross_inflow?: number
          last_inflow_txn_id?: string | null
          last_outflow_payout_id?: string | null
          outflow_total?: number
          payout_count?: number
          platform_revenue?: number
          provider_code?: Database["public"]["Enums"]["provider_code"]
          provider_cost_total?: number
          required_float?: number
          transaction_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_channel_balances_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "platform_channel_balances_last_inflow_txn_id_fkey"
            columns: ["last_inflow_txn_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
          {
            foreignKeyName: "platform_channel_balances_last_outflow_payout_id_fkey"
            columns: ["last_outflow_payout_id"]
            isOneToOne: false
            referencedRelation: "payouts"
            referencedColumns: ["payout_id"]
          },
        ]
      }
      platform_default_fees: {
        Row: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          default_fee_id: string
          description: string | null
          fee_category: Database["public"]["Enums"]["fee_category"]
          fee_payer: Database["public"]["Enums"]["fee_payer_type"]
          fee_subcategory: Database["public"]["Enums"]["fee_subcategory"]
          fixed_amount: number | null
          is_active: boolean
          is_visible: boolean
          metadata: Json | null
          name: string
          payment_method_code:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          percentage: number | null
          provider_code: Database["public"]["Enums"]["provider_code"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          default_fee_id?: string
          description?: string | null
          fee_category: Database["public"]["Enums"]["fee_category"]
          fee_payer?: Database["public"]["Enums"]["fee_payer_type"]
          fee_subcategory: Database["public"]["Enums"]["fee_subcategory"]
          fixed_amount?: number | null
          is_active?: boolean
          is_visible?: boolean
          metadata?: Json | null
          name: string
          payment_method_code?:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          percentage?: number | null
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          default_fee_id?: string
          description?: string | null
          fee_category?: Database["public"]["Enums"]["fee_category"]
          fee_payer?: Database["public"]["Enums"]["fee_payer_type"]
          fee_subcategory?: Database["public"]["Enums"]["fee_subcategory"]
          fixed_amount?: number | null
          is_active?: boolean
          is_visible?: boolean
          metadata?: Json | null
          name?: string
          payment_method_code?:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          percentage?: number | null
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_default_fees_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "platform_default_fees_provider_code_fkey"
            columns: ["provider_code"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["code"]
          },
        ]
      }
      platform_expenses: {
        Row: {
          amount: number
          apr_amount: number | null
          aug_amount: number | null
          category: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          dec_amount: number | null
          expense_id: string
          feb_amount: number | null
          frequency: string
          is_active: boolean
          jan_amount: number | null
          jul_amount: number | null
          jun_amount: number | null
          mar_amount: number | null
          may_amount: number | null
          name: string
          nov_amount: number | null
          oct_amount: number | null
          sep_amount: number | null
          updated_at: string
        }
        Insert: {
          amount: number
          apr_amount?: number | null
          aug_amount?: number | null
          category: string
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          dec_amount?: number | null
          expense_id?: string
          feb_amount?: number | null
          frequency: string
          is_active?: boolean
          jan_amount?: number | null
          jul_amount?: number | null
          jun_amount?: number | null
          mar_amount?: number | null
          may_amount?: number | null
          name: string
          nov_amount?: number | null
          oct_amount?: number | null
          sep_amount?: number | null
          updated_at?: string
        }
        Update: {
          amount?: number
          apr_amount?: number | null
          aug_amount?: number | null
          category?: string
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          dec_amount?: number | null
          expense_id?: string
          feb_amount?: number | null
          frequency?: string
          is_active?: boolean
          jan_amount?: number | null
          jul_amount?: number | null
          jun_amount?: number | null
          mar_amount?: number | null
          may_amount?: number | null
          name?: string
          nov_amount?: number | null
          oct_amount?: number | null
          sep_amount?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      platform_investments: {
        Row: {
          amount: number
          category: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          date: string
          description: string | null
          investment_id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          date: string
          description?: string | null
          investment_id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          date?: string
          description?: string | null
          investment_id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      platform_invoices: {
        Row: {
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string | null
          due_date: string | null
          metadata: Json | null
          organization_id: string
          platform_invoice_id: string
          status: Database["public"]["Enums"]["invoice_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          due_date?: string | null
          metadata?: Json | null
          organization_id: string
          platform_invoice_id?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          due_date?: string | null
          metadata?: Json | null
          organization_id?: string
          platform_invoice_id?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_invoices_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "platform_invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      platform_main_account: {
        Row: {
          available_balance: number
          balance_id: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          total_balance: number
          updated_at: string
        }
        Insert: {
          available_balance?: number
          balance_id?: string
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          total_balance?: number
          updated_at?: string
        }
        Update: {
          available_balance?: number
          balance_id?: string
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          total_balance?: number
          updated_at?: string
        }
        Relationships: []
      }
      platform_metrics: {
        Row: {
          created_at: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          metadata: Json | null
          metric_date: string
          metric_id: string
          metric_name: string
          metric_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          metadata?: Json | null
          metric_date: string
          metric_id?: string
          metric_name: string
          metric_value: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          entity_type?: Database["public"]["Enums"]["entity_type"]
          metadata?: Json | null
          metric_date?: string
          metric_id?: string
          metric_name?: string
          metric_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      platform_partners: {
        Row: {
          allowed_environments: string[]
          approved_at: string | null
          approved_by: string | null
          contact_email: string | null
          created_at: string
          default_daily_account_limit: number
          default_rate_limit_per_minute: number
          max_active_keys: number
          metadata: Json
          name: string
          owner_user_id: string | null
          partner_id: string
          partner_type: Database["public"]["Enums"]["platform_partner_type"]
          slug: string
          status: Database["public"]["Enums"]["platform_partner_status"]
          updated_at: string
        }
        Insert: {
          allowed_environments?: string[]
          approved_at?: string | null
          approved_by?: string | null
          contact_email?: string | null
          created_at?: string
          default_daily_account_limit?: number
          default_rate_limit_per_minute?: number
          max_active_keys?: number
          metadata?: Json
          name: string
          owner_user_id?: string | null
          partner_id?: string
          partner_type?: Database["public"]["Enums"]["platform_partner_type"]
          slug: string
          status?: Database["public"]["Enums"]["platform_partner_status"]
          updated_at?: string
        }
        Update: {
          allowed_environments?: string[]
          approved_at?: string | null
          approved_by?: string | null
          contact_email?: string | null
          created_at?: string
          default_daily_account_limit?: number
          default_rate_limit_per_minute?: number
          max_active_keys?: number
          metadata?: Json
          name?: string
          owner_user_id?: string | null
          partner_id?: string
          partner_type?: Database["public"]["Enums"]["platform_partner_type"]
          slug?: string
          status?: Database["public"]["Enums"]["platform_partner_status"]
          updated_at?: string
        }
        Relationships: []
      }
      platform_provisioning_audit_log: {
        Row: {
          action: string
          audit_id: string
          created_at: string
          ip_address: string | null
          merchant_id: string | null
          metadata: Json
          organization_id: string | null
          provisioning_key_id: string
        }
        Insert: {
          action: string
          audit_id?: string
          created_at?: string
          ip_address?: string | null
          merchant_id?: string | null
          metadata?: Json
          organization_id?: string | null
          provisioning_key_id: string
        }
        Update: {
          action?: string
          audit_id?: string
          created_at?: string
          ip_address?: string | null
          merchant_id?: string | null
          metadata?: Json
          organization_id?: string | null
          provisioning_key_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_provisioning_audit_log_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "platform_provisioning_audit_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "platform_provisioning_audit_log_provisioning_key_id_fkey"
            columns: ["provisioning_key_id"]
            isOneToOne: false
            referencedRelation: "platform_provisioning_keys"
            referencedColumns: ["provisioning_key_id"]
          },
        ]
      }
      platform_provisioning_daily_usage: {
        Row: {
          accounts_created: number
          provisioning_key_id: string
          usage_date: string
        }
        Insert: {
          accounts_created?: number
          provisioning_key_id: string
          usage_date?: string
        }
        Update: {
          accounts_created?: number
          provisioning_key_id?: string
          usage_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_provisioning_daily_usage_provisioning_key_id_fkey"
            columns: ["provisioning_key_id"]
            isOneToOne: false
            referencedRelation: "platform_provisioning_keys"
            referencedColumns: ["provisioning_key_id"]
          },
        ]
      }
      platform_provisioning_keys: {
        Row: {
          created_at: string
          daily_account_limit: number
          environment: string
          external_user_ref: string | null
          is_active: boolean
          key_kind: Database["public"]["Enums"]["provisioning_key_kind"]
          name: string
          partner_id: string | null
          partner_name: string
          provisioning_key: string
          provisioning_key_id: string
          rate_limit_per_minute: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          daily_account_limit?: number
          environment?: string
          external_user_ref?: string | null
          is_active?: boolean
          key_kind?: Database["public"]["Enums"]["provisioning_key_kind"]
          name: string
          partner_id?: string | null
          partner_name: string
          provisioning_key: string
          provisioning_key_id?: string
          rate_limit_per_minute?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          daily_account_limit?: number
          environment?: string
          external_user_ref?: string | null
          is_active?: boolean
          key_kind?: Database["public"]["Enums"]["provisioning_key_kind"]
          name?: string
          partner_id?: string | null
          partner_name?: string
          provisioning_key?: string
          provisioning_key_id?: string
          rate_limit_per_minute?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_provisioning_keys_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "platform_partners"
            referencedColumns: ["partner_id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          created_at: string
          description: string | null
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      pos_devices: {
        Row: {
          created_at: string
          device_id: string
          last_seen_at: string
          merchant_id: string | null
          nickname: string | null
          organization_id: string
          platform: string | null
          pos_device_id: string
        }
        Insert: {
          created_at?: string
          device_id: string
          last_seen_at?: string
          merchant_id?: string | null
          nickname?: string | null
          organization_id: string
          platform?: string | null
          pos_device_id?: string
        }
        Update: {
          created_at?: string
          device_id?: string
          last_seen_at?: string
          merchant_id?: string | null
          nickname?: string | null
          organization_id?: string
          platform?: string | null
          pos_device_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_devices_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "pos_devices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      price_tiers: {
        Row: {
          created_at: string
          flat_amount: number
          from_units: number
          organization_id: string
          price_id: string
          tier_id: string
          to_units: number | null
          unit_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          flat_amount?: number
          from_units?: number
          organization_id: string
          price_id: string
          tier_id?: string
          to_units?: number | null
          unit_amount?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          flat_amount?: number
          from_units?: number
          organization_id?: string
          price_id?: string
          tier_id?: string
          to_units?: number | null
          unit_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_tiers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "price_tiers_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["price_id"]
          },
        ]
      }
      prices: {
        Row: {
          amount: number
          billing_interval:
            | Database["public"]["Enums"]["billing_interval"]
            | null
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          environment: string
          is_active: boolean
          is_default: boolean
          maximum_amount: number | null
          metadata: Json | null
          minimum_amount: number | null
          organization_id: string
          price_id: string
          pricing_model: Database["public"]["Enums"]["pricing_model"]
          product_id: string
          public_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          billing_interval?:
            | Database["public"]["Enums"]["billing_interval"]
            | null
          created_at?: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          environment?: string
          is_active?: boolean
          is_default?: boolean
          maximum_amount?: number | null
          metadata?: Json | null
          minimum_amount?: number | null
          organization_id: string
          price_id?: string
          pricing_model?: Database["public"]["Enums"]["pricing_model"]
          product_id: string
          public_id?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          billing_interval?:
            | Database["public"]["Enums"]["billing_interval"]
            | null
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
          environment?: string
          is_active?: boolean
          is_default?: boolean
          maximum_amount?: number | null
          metadata?: Json | null
          minimum_amount?: number | null
          organization_id?: string
          price_id?: string
          pricing_model?: Database["public"]["Enums"]["pricing_model"]
          product_id?: string
          public_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prices_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "prices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      pricing_tiers: {
        Row: {
          created_at: string | null
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string | null
          is_active: boolean | null
          max_monthly_revenue: number | null
          min_monthly_revenue: number
          tier_id: string
          tier_name: string
          tier_order: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency_code: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          is_active?: boolean | null
          max_monthly_revenue?: number | null
          min_monthly_revenue: number
          tier_id?: string
          tier_name: string
          tier_order: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency_code?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          is_active?: boolean | null
          max_monthly_revenue?: number | null
          min_monthly_revenue?: number
          tier_id?: string
          tier_name?: string
          tier_order?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      product_files: {
        Row: {
          created_at: string
          deleted_at: string | null
          file_checksum: string | null
          file_id: string
          filename: string
          mime_type: string | null
          organization_id: string
          product_id: string
          size_bytes: number
          sort_order: number
          storage_path: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          file_checksum?: string | null
          file_id?: string
          filename: string
          mime_type?: string | null
          organization_id: string
          product_id: string
          size_bytes?: number
          sort_order?: number
          storage_path: string
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          file_checksum?: string | null
          file_id?: string
          filename?: string
          mime_type?: string | null
          organization_id?: string
          product_id?: string
          size_bytes?: number
          sort_order?: number
          storage_path?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_files_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "product_files_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
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
            | Database["public"]["Enums"]["failed_payment_action"]
            | null
          first_payment_type:
            | Database["public"]["Enums"]["first_payment_type"]
            | null
          fulfillment_type: Database["public"]["Enums"]["product_fulfillment_type"]
          image_type: string | null
          images: string[] | null
          inventory_quantity: number | null
          is_active: boolean
          license_key_enabled: boolean
          metadata: Json | null
          name: string
          organization_id: string
          product_id: string
          product_type: Database["public"]["Enums"]["product_type"]
          public_id: string
          sku: string | null
          track_inventory: boolean | null
          trial_enabled: boolean
          trial_period_days: number | null
          updated_at: string
          usage_aggregation:
            | Database["public"]["Enums"]["usage_aggregation"]
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
            | Database["public"]["Enums"]["failed_payment_action"]
            | null
          first_payment_type?:
            | Database["public"]["Enums"]["first_payment_type"]
            | null
          fulfillment_type?: Database["public"]["Enums"]["product_fulfillment_type"]
          image_type?: string | null
          images?: string[] | null
          inventory_quantity?: number | null
          is_active?: boolean
          license_key_enabled?: boolean
          metadata?: Json | null
          name: string
          organization_id: string
          product_id?: string
          product_type?: Database["public"]["Enums"]["product_type"]
          public_id?: string
          sku?: string | null
          track_inventory?: boolean | null
          trial_enabled?: boolean
          trial_period_days?: number | null
          updated_at?: string
          usage_aggregation?:
            | Database["public"]["Enums"]["usage_aggregation"]
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
            | Database["public"]["Enums"]["failed_payment_action"]
            | null
          first_payment_type?:
            | Database["public"]["Enums"]["first_payment_type"]
            | null
          fulfillment_type?: Database["public"]["Enums"]["product_fulfillment_type"]
          image_type?: string | null
          images?: string[] | null
          inventory_quantity?: number | null
          is_active?: boolean
          license_key_enabled?: boolean
          metadata?: Json | null
          name?: string
          organization_id?: string
          product_id?: string
          product_type?: Database["public"]["Enums"]["product_type"]
          public_id?: string
          sku?: string | null
          track_inventory?: boolean | null
          trial_enabled?: boolean
          trial_period_days?: number | null
          updated_at?: string
          usage_aggregation?:
            | Database["public"]["Enums"]["usage_aggregation"]
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
      providers: {
        Row: {
          code: Database["public"]["Enums"]["provider_code"]
          description: string | null
          name: string
        }
        Insert: {
          code: Database["public"]["Enums"]["provider_code"]
          description?: string | null
          name: string
        }
        Update: {
          code?: Database["public"]["Enums"]["provider_code"]
          description?: string | null
          name?: string
        }
        Relationships: []
      }
      providers_transactions: {
        Row: {
          checkout_url: string | null
          created_at: string
          error_code: string | null
          error_message: string | null
          error_url: string | null
          ipn_callback_url: string | null
          metadata: Json | null
          notif_token: string | null
          organization_id: string
          pay_address: string | null
          pay_amount: number | null
          pay_currency: string | null
          pay_token: string | null
          provider_checkout_id: string | null
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_payment_status: Database["public"]["Enums"]["provider_payment_status"]
          provider_transaction_id: string | null
          spi_account_number: string | null
          spi_compte_paye: string | null
          spi_compte_payeur: string | null
          spi_confirmation: boolean
          spi_confirmation_status: string | null
          spi_confirmed_at: string | null
          spi_motif: string | null
          spi_paye_alias: string | null
          spi_paye_nom: string | null
          spi_paye_pays: string | null
          spi_payment_flow_type:
            | Database["public"]["Enums"]["spi_payment_flow_type"]
            | null
          spi_rejected_at: string | null
          success_url: string | null
          transaction_id: string
          updated_at: string
        }
        Insert: {
          checkout_url?: string | null
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          error_url?: string | null
          ipn_callback_url?: string | null
          metadata?: Json | null
          notif_token?: string | null
          organization_id: string
          pay_address?: string | null
          pay_amount?: number | null
          pay_currency?: string | null
          pay_token?: string | null
          provider_checkout_id?: string | null
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_payment_status?: Database["public"]["Enums"]["provider_payment_status"]
          provider_transaction_id?: string | null
          spi_account_number?: string | null
          spi_compte_paye?: string | null
          spi_compte_payeur?: string | null
          spi_confirmation?: boolean
          spi_confirmation_status?: string | null
          spi_confirmed_at?: string | null
          spi_motif?: string | null
          spi_paye_alias?: string | null
          spi_paye_nom?: string | null
          spi_paye_pays?: string | null
          spi_payment_flow_type?:
            | Database["public"]["Enums"]["spi_payment_flow_type"]
            | null
          spi_rejected_at?: string | null
          success_url?: string | null
          transaction_id: string
          updated_at?: string
        }
        Update: {
          checkout_url?: string | null
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          error_url?: string | null
          ipn_callback_url?: string | null
          metadata?: Json | null
          notif_token?: string | null
          organization_id?: string
          pay_address?: string | null
          pay_amount?: number | null
          pay_currency?: string | null
          pay_token?: string | null
          provider_checkout_id?: string | null
          provider_code?: Database["public"]["Enums"]["provider_code"]
          provider_payment_status?: Database["public"]["Enums"]["provider_payment_status"]
          provider_transaction_id?: string | null
          spi_account_number?: string | null
          spi_compte_paye?: string | null
          spi_compte_payeur?: string | null
          spi_confirmation?: boolean
          spi_confirmation_status?: string | null
          spi_confirmed_at?: string | null
          spi_motif?: string | null
          spi_paye_alias?: string | null
          spi_paye_nom?: string | null
          spi_paye_pays?: string | null
          spi_payment_flow_type?:
            | Database["public"]["Enums"]["spi_payment_flow_type"]
            | null
          spi_rejected_at?: string | null
          success_url?: string | null
          transaction_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "providers_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "providers_transactions_provider_code_fkey"
            columns: ["provider_code"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "providers_transactions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: true
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      provisioning_merchant_accounts: {
        Row: {
          created_at: string
          merchant_id: string
          organization_id: string | null
          provisioning_key_id: string
          terms_accepted_at: string
          terms_version: string
        }
        Insert: {
          created_at?: string
          merchant_id: string
          organization_id?: string | null
          provisioning_key_id: string
          terms_accepted_at: string
          terms_version: string
        }
        Update: {
          created_at?: string
          merchant_id?: string
          organization_id?: string | null
          provisioning_key_id?: string
          terms_accepted_at?: string
          terms_version?: string
        }
        Relationships: [
          {
            foreignKeyName: "provisioning_merchant_accounts_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: true
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "provisioning_merchant_accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "provisioning_merchant_accounts_provisioning_key_id_fkey"
            columns: ["provisioning_key_id"]
            isOneToOne: false
            referencedRelation: "platform_provisioning_keys"
            referencedColumns: ["provisioning_key_id"]
          },
        ]
      }
      purchase_entitlements: {
        Row: {
          customer_id: string
          download_count: number
          entitlement_id: string
          granted_at: string
          last_downloaded_at: string | null
          organization_id: string
          product_file_id: string
          product_id: string
          revoked_at: string | null
          transaction_id: string
        }
        Insert: {
          customer_id: string
          download_count?: number
          entitlement_id?: string
          granted_at?: string
          last_downloaded_at?: string | null
          organization_id: string
          product_file_id: string
          product_id: string
          revoked_at?: string | null
          transaction_id: string
        }
        Update: {
          customer_id?: string
          download_count?: number
          entitlement_id?: string
          granted_at?: string
          last_downloaded_at?: string | null
          organization_id?: string
          product_file_id?: string
          product_id?: string
          revoked_at?: string | null
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_entitlements_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "purchase_entitlements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "purchase_entitlements_product_file_id_fkey"
            columns: ["product_file_id"]
            isOneToOne: false
            referencedRelation: "product_files"
            referencedColumns: ["file_id"]
          },
          {
            foreignKeyName: "purchase_entitlements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "purchase_entitlements_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      purchase_license_entitlements: {
        Row: {
          customer_id: string
          granted_at: string
          license_entitlement_id: string
          license_key: string
          organization_id: string
          product_id: string
          revoked_at: string | null
          transaction_id: string
        }
        Insert: {
          customer_id: string
          granted_at?: string
          license_entitlement_id?: string
          license_key: string
          organization_id: string
          product_id: string
          revoked_at?: string | null
          transaction_id: string
        }
        Update: {
          customer_id?: string
          granted_at?: string
          license_entitlement_id?: string
          license_key?: string
          organization_id?: string
          product_id?: string
          revoked_at?: string | null
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_license_entitlements_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "purchase_license_entitlements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "purchase_license_entitlements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "purchase_license_entitlements_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      radar_rules: {
        Row: {
          applicable_rails: string[]
          created_at: string
          default_action: Database["public"]["Enums"]["fraud_action"]
          default_threshold: number
          default_time_window_seconds: number | null
          description: string | null
          is_active: boolean
          rule_id: string
          rule_name: string
          type: Database["public"]["Enums"]["fraud_rule_type"]
          updated_at: string
        }
        Insert: {
          applicable_rails?: string[]
          created_at?: string
          default_action?: Database["public"]["Enums"]["fraud_action"]
          default_threshold: number
          default_time_window_seconds?: number | null
          description?: string | null
          is_active?: boolean
          rule_id?: string
          rule_name: string
          type: Database["public"]["Enums"]["fraud_rule_type"]
          updated_at?: string
        }
        Update: {
          applicable_rails?: string[]
          created_at?: string
          default_action?: Database["public"]["Enums"]["fraud_action"]
          default_threshold?: number
          default_time_window_seconds?: number | null
          description?: string | null
          is_active?: boolean
          rule_id?: string
          rule_name?: string
          type?: Database["public"]["Enums"]["fraud_rule_type"]
          updated_at?: string
        }
        Relationships: []
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
            | Database["public"]["Enums"]["spi_payment_status"]
            | null
          spi_motif_code:
            | Database["public"]["Enums"]["spi_rejection_reason"]
            | null
          spi_rejection_reason:
            | Database["public"]["Enums"]["spi_rejection_reason"]
            | null
          spi_retour_date_demande: string | null
          spi_retour_date_irrevocabilite: string | null
          spi_tx_id: string | null
          status: Database["public"]["Enums"]["refund_status"]
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
            | Database["public"]["Enums"]["spi_payment_status"]
            | null
          spi_motif_code?:
            | Database["public"]["Enums"]["spi_rejection_reason"]
            | null
          spi_rejection_reason?:
            | Database["public"]["Enums"]["spi_rejection_reason"]
            | null
          spi_retour_date_demande?: string | null
          spi_retour_date_irrevocabilite?: string | null
          spi_tx_id?: string | null
          status?: Database["public"]["Enums"]["refund_status"]
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
            | Database["public"]["Enums"]["spi_payment_status"]
            | null
          spi_motif_code?:
            | Database["public"]["Enums"]["spi_rejection_reason"]
            | null
          spi_rejection_reason?:
            | Database["public"]["Enums"]["spi_rejection_reason"]
            | null
          spi_retour_date_demande?: string | null
          spi_retour_date_irrevocabilite?: string | null
          spi_tx_id?: string | null
          status?: Database["public"]["Enums"]["refund_status"]
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
      risk_assessments: {
        Row: {
          amount: number | null
          assessment_id: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"] | null
          customer_id: string | null
          decision: Database["public"]["Enums"]["radar_decision"]
          metadata: Json
          organization_id: string
          provider: Database["public"]["Enums"]["radar_signal_provider"]
          rail: Database["public"]["Enums"]["radar_rail"]
          risk_score: number
          signals: Json
          transaction_id: string | null
        }
        Insert: {
          amount?: number | null
          assessment_id?: string
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"] | null
          customer_id?: string | null
          decision?: Database["public"]["Enums"]["radar_decision"]
          metadata?: Json
          organization_id: string
          provider?: Database["public"]["Enums"]["radar_signal_provider"]
          rail: Database["public"]["Enums"]["radar_rail"]
          risk_score?: number
          signals?: Json
          transaction_id?: string | null
        }
        Update: {
          amount?: number | null
          assessment_id?: string
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"] | null
          customer_id?: string | null
          decision?: Database["public"]["Enums"]["radar_decision"]
          metadata?: Json
          organization_id?: string
          provider?: Database["public"]["Enums"]["radar_signal_provider"]
          rail?: Database["public"]["Enums"]["radar_rail"]
          risk_score?: number
          signals?: Json
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "risk_assessments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "risk_assessments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "risk_assessments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      service_availability_rules: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          is_active: boolean
          organization_id: string
          rule_id: string
          start_time: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          is_active?: boolean
          organization_id: string
          rule_id?: string
          start_time: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          is_active?: boolean
          organization_id?: string
          rule_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_availability_rules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      service_closed_dates: {
        Row: {
          closed_date: string
          closed_date_id: string
          created_at: string
          organization_id: string
          reason: string | null
        }
        Insert: {
          closed_date: string
          closed_date_id?: string
          created_at?: string
          organization_id: string
          reason?: string | null
        }
        Update: {
          closed_date?: string
          closed_date_id?: string
          created_at?: string
          organization_id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_closed_dates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      shopify_api_keys: {
        Row: {
          allow_coupon_code: boolean | null
          api_key_id: string
          created_at: string
          flat_shipping_fee: number | null
          lomi_api_key: string
          require_billing_address: boolean | null
          shipping_mode: Database["public"]["Enums"]["shopify_shipping_mode"]
          store_id: string
          updated_at: string
          webhook_secret: string | null
        }
        Insert: {
          allow_coupon_code?: boolean | null
          api_key_id?: string
          created_at?: string
          flat_shipping_fee?: number | null
          lomi_api_key: string
          require_billing_address?: boolean | null
          shipping_mode?: Database["public"]["Enums"]["shopify_shipping_mode"]
          store_id: string
          updated_at?: string
          webhook_secret?: string | null
        }
        Update: {
          allow_coupon_code?: boolean | null
          api_key_id?: string
          created_at?: string
          flat_shipping_fee?: number | null
          lomi_api_key?: string
          require_billing_address?: boolean | null
          shipping_mode?: Database["public"]["Enums"]["shopify_shipping_mode"]
          store_id?: string
          updated_at?: string
          webhook_secret?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopify_api_keys_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: true
            referencedRelation: "shopify_stores"
            referencedColumns: ["store_id"]
          },
        ]
      }
      shopify_pending_payments: {
        Row: {
          checkout_session_id: string | null
          created_at: string
          draft_order_id: string
          lomi_transaction_id: string | null
          shop_domain: string
          status: string
          updated_at: string
        }
        Insert: {
          checkout_session_id?: string | null
          created_at?: string
          draft_order_id: string
          lomi_transaction_id?: string | null
          shop_domain: string
          status?: string
          updated_at?: string
        }
        Update: {
          checkout_session_id?: string | null
          created_at?: string
          draft_order_id?: string
          lomi_transaction_id?: string | null
          shop_domain?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      shopify_sessions: {
        Row: {
          access_token: string
          account_owner: boolean
          associated_user_scope: string | null
          collaborator: boolean | null
          created_at: string
          email: string | null
          email_verified: boolean | null
          expires: string | null
          expires_in: number | null
          first_name: string | null
          id: string
          is_online: boolean
          last_name: string | null
          locale: string | null
          scope: string | null
          shop: string
          state: string
          updated_at: string
          user_id: number | null
        }
        Insert: {
          access_token: string
          account_owner?: boolean
          associated_user_scope?: string | null
          collaborator?: boolean | null
          created_at?: string
          email?: string | null
          email_verified?: boolean | null
          expires?: string | null
          expires_in?: number | null
          first_name?: string | null
          id: string
          is_online?: boolean
          last_name?: string | null
          locale?: string | null
          scope?: string | null
          shop: string
          state: string
          updated_at?: string
          user_id?: number | null
        }
        Update: {
          access_token?: string
          account_owner?: boolean
          associated_user_scope?: string | null
          collaborator?: boolean | null
          created_at?: string
          email?: string | null
          email_verified?: boolean | null
          expires?: string | null
          expires_in?: number | null
          first_name?: string | null
          id?: string
          is_online?: boolean
          last_name?: string | null
          locale?: string | null
          scope?: string | null
          shop?: string
          state?: string
          updated_at?: string
          user_id?: number | null
        }
        Relationships: []
      }
      shopify_stores: {
        Row: {
          access_token: string
          created_at: string
          installed_at: string | null
          metadata: Json | null
          organization_id: string
          scope: string[]
          shop_domain: string
          store_id: string
          uninstalled_at: string | null
          updated_at: string
        }
        Insert: {
          access_token: string
          created_at?: string
          installed_at?: string | null
          metadata?: Json | null
          organization_id: string
          scope?: string[]
          shop_domain: string
          store_id?: string
          uninstalled_at?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string
          created_at?: string
          installed_at?: string | null
          metadata?: Json | null
          organization_id?: string
          scope?: string[]
          shop_domain?: string
          store_id?: string
          uninstalled_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopify_stores_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      shopify_webhooks: {
        Row: {
          address: string
          created_at: string
          shopify_webhook_id: string
          store_id: string
          topic: string
          updated_at: string
          webhook_id: string
        }
        Insert: {
          address: string
          created_at?: string
          shopify_webhook_id: string
          store_id: string
          topic: string
          updated_at?: string
          webhook_id?: string
        }
        Update: {
          address?: string
          created_at?: string
          shopify_webhook_id?: string
          store_id?: string
          topic?: string
          updated_at?: string
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopify_webhooks_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "shopify_stores"
            referencedColumns: ["store_id"]
          },
        ]
      }
      spi_account_aliases: {
        Row: {
          account_number: string
          alias_id: string
          alias_key: string
          alias_type: Database["public"]["Enums"]["spi_alias_type"]
          created_at: string
          is_active: boolean
          is_default: boolean
          metadata: Json | null
          organization_id: string
          updated_at: string
        }
        Insert: {
          account_number: string
          alias_id?: string
          alias_key: string
          alias_type: Database["public"]["Enums"]["spi_alias_type"]
          created_at?: string
          is_active?: boolean
          is_default?: boolean
          metadata?: Json | null
          organization_id: string
          updated_at?: string
        }
        Update: {
          account_number?: string
          alias_id?: string
          alias_key?: string
          alias_type?: Database["public"]["Enums"]["spi_alias_type"]
          created_at?: string
          is_active?: boolean
          is_default?: boolean
          metadata?: Json | null
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "spi_account_aliases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      spi_payment_cancellation_requests: {
        Row: {
          cancellation_id: string
          compte_payeur: string
          created_at: string
          created_by: string | null
          environment: string
          metadata: Json | null
          organization_id: string
          payee_accepted: boolean | null
          payee_response_at: string | null
          spi_cancellation_status:
            | Database["public"]["Enums"]["spi_payment_status"]
            | null
          spi_motif_code:
            | Database["public"]["Enums"]["spi_rejection_reason"]
            | null
          spi_retour_statut:
            | Database["public"]["Enums"]["spi_payment_status"]
            | null
          spi_retour_tx_id: string | null
          spi_tx_id: string
          transaction_id: string
          updated_at: string
        }
        Insert: {
          cancellation_id?: string
          compte_payeur: string
          created_at?: string
          created_by?: string | null
          environment?: string
          metadata?: Json | null
          organization_id: string
          payee_accepted?: boolean | null
          payee_response_at?: string | null
          spi_cancellation_status?:
            | Database["public"]["Enums"]["spi_payment_status"]
            | null
          spi_motif_code?:
            | Database["public"]["Enums"]["spi_rejection_reason"]
            | null
          spi_retour_statut?:
            | Database["public"]["Enums"]["spi_payment_status"]
            | null
          spi_retour_tx_id?: string | null
          spi_tx_id: string
          transaction_id: string
          updated_at?: string
        }
        Update: {
          cancellation_id?: string
          compte_payeur?: string
          created_at?: string
          created_by?: string | null
          environment?: string
          metadata?: Json | null
          organization_id?: string
          payee_accepted?: boolean | null
          payee_response_at?: string | null
          spi_cancellation_status?:
            | Database["public"]["Enums"]["spi_payment_status"]
            | null
          spi_motif_code?:
            | Database["public"]["Enums"]["spi_rejection_reason"]
            | null
          spi_retour_statut?:
            | Database["public"]["Enums"]["spi_payment_status"]
            | null
          spi_retour_tx_id?: string | null
          spi_tx_id?: string
          transaction_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "spi_payment_cancellation_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "spi_payment_cancellation_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "spi_payment_cancellation_requests_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      spi_qr_codes: {
        Row: {
          amount: number | null
          categorie: Database["public"]["Enums"]["spi_payment_request_category"]
          checkout_session_id: string | null
          compte_paye: string
          created_at: string
          created_by: string | null
          currency_code: string
          environment: string
          expires_at: string | null
          is_active: boolean
          is_used: boolean
          metadata: Json | null
          name: string
          organization_id: string
          payeur_alias: string | null
          payment_request_id: string | null
          product_id: string | null
          qr_code_data: string
          qr_code_id: string
          qr_code_image_data: string | null
          qr_code_image_url: string | null
          qr_code_type: Database["public"]["Enums"]["qr_code_type"]
          updated_at: string
        }
        Insert: {
          amount?: number | null
          categorie: Database["public"]["Enums"]["spi_payment_request_category"]
          checkout_session_id?: string | null
          compte_paye: string
          created_at?: string
          created_by?: string | null
          currency_code?: string
          environment?: string
          expires_at?: string | null
          is_active?: boolean
          is_used?: boolean
          metadata?: Json | null
          name: string
          organization_id: string
          payeur_alias?: string | null
          payment_request_id?: string | null
          product_id?: string | null
          qr_code_data: string
          qr_code_id?: string
          qr_code_image_data?: string | null
          qr_code_image_url?: string | null
          qr_code_type: Database["public"]["Enums"]["qr_code_type"]
          updated_at?: string
        }
        Update: {
          amount?: number | null
          categorie?: Database["public"]["Enums"]["spi_payment_request_category"]
          checkout_session_id?: string | null
          compte_paye?: string
          created_at?: string
          created_by?: string | null
          currency_code?: string
          environment?: string
          expires_at?: string | null
          is_active?: boolean
          is_used?: boolean
          metadata?: Json | null
          name?: string
          organization_id?: string
          payeur_alias?: string | null
          payment_request_id?: string | null
          product_id?: string | null
          qr_code_data?: string
          qr_code_id?: string
          qr_code_image_data?: string | null
          qr_code_image_url?: string | null
          qr_code_type?: Database["public"]["Enums"]["qr_code_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "spi_qr_codes_checkout_session_id_fkey"
            columns: ["checkout_session_id"]
            isOneToOne: false
            referencedRelation: "checkout_sessions"
            referencedColumns: ["checkout_session_id"]
          },
          {
            foreignKeyName: "spi_qr_codes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "spi_qr_codes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "spi_qr_codes_payment_request_id_fkey"
            columns: ["payment_request_id"]
            isOneToOne: false
            referencedRelation: "payment_requests"
            referencedColumns: ["request_id"]
          },
          {
            foreignKeyName: "spi_qr_codes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      storefronts: {
        Row: {
          announcement_active: boolean
          announcement_text: string | null
          created_at: string
          created_by: string | null
          description: string | null
          is_active: boolean
          name: string
          organization_id: string
          shipping_config: Json | null
          storefront_id: string
          tax_config: Json | null
          updated_at: string
        }
        Insert: {
          announcement_active?: boolean
          announcement_text?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          is_active?: boolean
          name: string
          organization_id: string
          shipping_config?: Json | null
          storefront_id?: string
          tax_config?: Json | null
          updated_at?: string
        }
        Update: {
          announcement_active?: boolean
          announcement_text?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          is_active?: boolean
          name?: string
          organization_id?: string
          shipping_config?: Json | null
          storefront_id?: string
          tax_config?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "storefronts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "storefronts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      subscription_charges: {
        Row: {
          charge_id: string
          created_at: string
          is_active: boolean
          meter_id: string
          organization_id: string
          subscription_id: string
        }
        Insert: {
          charge_id?: string
          created_at?: string
          is_active?: boolean
          meter_id: string
          organization_id: string
          subscription_id: string
        }
        Update: {
          charge_id?: string
          created_at?: string
          is_active?: boolean
          meter_id?: string
          organization_id?: string
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_charges_meter_id_fkey"
            columns: ["meter_id"]
            isOneToOne: false
            referencedRelation: "meters"
            referencedColumns: ["meter_id"]
          },
          {
            foreignKeyName: "subscription_charges_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "subscription_charges_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["subscription_id"]
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
          status: Database["public"]["Enums"]["subscription_status"]
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
          status?: Database["public"]["Enums"]["subscription_status"]
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
          status?: Database["public"]["Enums"]["subscription_status"]
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
      support_requests: {
        Row: {
          category: Database["public"]["Enums"]["support_category"]
          created_at: string
          created_by: string | null
          image_url: string | null
          message: string
          organization_id: string
          priority: Database["public"]["Enums"]["support_priority"]
          resolution_message: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["support_status"]
          subject: string | null
          support_requests_id: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["support_category"]
          created_at?: string
          created_by?: string | null
          image_url?: string | null
          message: string
          organization_id: string
          priority?: Database["public"]["Enums"]["support_priority"]
          resolution_message?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["support_status"]
          subject?: string | null
          support_requests_id?: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["support_category"]
          created_at?: string
          created_by?: string | null
          image_url?: string | null
          message?: string
          organization_id?: string
          priority?: Database["public"]["Enums"]["support_priority"]
          resolution_message?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["support_status"]
          subject?: string | null
          support_requests_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
          {
            foreignKeyName: "support_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "support_requests_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_id"]
          },
        ]
      }
      tier_fee_structure: {
        Row: {
          created_at: string | null
          description: string | null
          fee_category: Database["public"]["Enums"]["fee_category"]
          fee_subcategory: Database["public"]["Enums"]["fee_subcategory"]
          fixed_amount: number | null
          is_active: boolean | null
          metadata: Json | null
          name: string
          payment_method_code:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          percentage: number | null
          provider_code: Database["public"]["Enums"]["provider_code"] | null
          tier_fee_id: string
          tier_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          fee_category: Database["public"]["Enums"]["fee_category"]
          fee_subcategory: Database["public"]["Enums"]["fee_subcategory"]
          fixed_amount?: number | null
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          payment_method_code?:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          percentage?: number | null
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          tier_fee_id?: string
          tier_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          fee_category?: Database["public"]["Enums"]["fee_category"]
          fee_subcategory?: Database["public"]["Enums"]["fee_subcategory"]
          fixed_amount?: number | null
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          payment_method_code?:
            | Database["public"]["Enums"]["payment_method_code"]
            | null
          percentage?: number | null
          provider_code?: Database["public"]["Enums"]["provider_code"] | null
          tier_fee_id?: string
          tier_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tier_fee_structure_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "pricing_tiers"
            referencedColumns: ["tier_id"]
          },
        ]
      }
      transactions: {
        Row: {
          available_at: string | null
          checkout_session_id: string | null
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
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
          integration_source: Database["public"]["Enums"]["integration_source"]
          is_bnpl: boolean
          is_pos: boolean
          metadata: Json | null
          net_amount: number
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          price_id: string | null
          product_id: string | null
          provider_code: Database["public"]["Enums"]["provider_code"]
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
            | Database["public"]["Enums"]["spi_payment_category"]
            | null
          spi_payment_flow_type:
            | Database["public"]["Enums"]["spi_payment_flow_type"]
            | null
          spi_payment_status:
            | Database["public"]["Enums"]["spi_payment_status"]
            | null
          spi_rejection_reason:
            | Database["public"]["Enums"]["spi_rejection_reason"]
            | null
          spi_tx_id: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          stripe_payment_intent_id: string | null
          subscription_id: string | null
          tier_fee_id: string | null
          transaction_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
        }
        Insert: {
          available_at?: string | null
          checkout_session_id?: string | null
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
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
          integration_source?: Database["public"]["Enums"]["integration_source"]
          is_bnpl?: boolean
          is_pos?: boolean
          metadata?: Json | null
          net_amount: number
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          price_id?: string | null
          product_id?: string | null
          provider_code: Database["public"]["Enums"]["provider_code"]
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
            | Database["public"]["Enums"]["spi_payment_category"]
            | null
          spi_payment_flow_type?:
            | Database["public"]["Enums"]["spi_payment_flow_type"]
            | null
          spi_payment_status?:
            | Database["public"]["Enums"]["spi_payment_status"]
            | null
          spi_rejection_reason?:
            | Database["public"]["Enums"]["spi_rejection_reason"]
            | null
          spi_tx_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          stripe_payment_intent_id?: string | null
          subscription_id?: string | null
          tier_fee_id?: string | null
          transaction_id?: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Update: {
          available_at?: string | null
          checkout_session_id?: string | null
          created_at?: string
          currency_code?: Database["public"]["Enums"]["currency_code"]
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
          integration_source?: Database["public"]["Enums"]["integration_source"]
          is_bnpl?: boolean
          is_pos?: boolean
          metadata?: Json | null
          net_amount?: number
          organization_id?: string
          payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          price_id?: string | null
          product_id?: string | null
          provider_code?: Database["public"]["Enums"]["provider_code"]
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
            | Database["public"]["Enums"]["spi_payment_category"]
            | null
          spi_payment_flow_type?:
            | Database["public"]["Enums"]["spi_payment_flow_type"]
            | null
          spi_payment_status?:
            | Database["public"]["Enums"]["spi_payment_status"]
            | null
          spi_rejection_reason?:
            | Database["public"]["Enums"]["spi_rejection_reason"]
            | null
          spi_tx_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          stripe_payment_intent_id?: string | null
          subscription_id?: string | null
          tier_fee_id?: string | null
          transaction_id?: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
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
      usage_dunning_tracker: {
        Row: {
          created_at: string
          customer_invoice_id: string
          last_action_at: string | null
          metadata: Json
          next_action_at: string | null
          organization_id: string
          status: string
          step_index: number
          subscription_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_invoice_id: string
          last_action_at?: string | null
          metadata?: Json
          next_action_at?: string | null
          organization_id: string
          status?: string
          step_index?: number
          subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_invoice_id?: string
          last_action_at?: string | null
          metadata?: Json
          next_action_at?: string | null
          organization_id?: string
          status?: string
          step_index?: number
          subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_dunning_tracker_customer_invoice_id_fkey"
            columns: ["customer_invoice_id"]
            isOneToOne: true
            referencedRelation: "customer_invoices"
            referencedColumns: ["customer_invoice_id"]
          },
          {
            foreignKeyName: "usage_dunning_tracker_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "usage_dunning_tracker_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["subscription_id"]
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
      webhook_delivery_dispatches: {
        Row: {
          attempt_count: number
          created_at: string
          dead_letter_reason: string | null
          dead_lettered_at: string | null
          dispatch_id: string
          last_attempt_at: string | null
          outbox_id: string
          status: string
          updated_at: string
          webhook_id: string
        }
        Insert: {
          attempt_count?: number
          created_at?: string
          dead_letter_reason?: string | null
          dead_lettered_at?: string | null
          dispatch_id?: string
          last_attempt_at?: string | null
          outbox_id: string
          status?: string
          updated_at?: string
          webhook_id: string
        }
        Update: {
          attempt_count?: number
          created_at?: string
          dead_letter_reason?: string | null
          dead_lettered_at?: string | null
          dispatch_id?: string
          last_attempt_at?: string | null
          outbox_id?: string
          status?: string
          updated_at?: string
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_delivery_dispatches_outbox_id_fkey"
            columns: ["outbox_id"]
            isOneToOne: false
            referencedRelation: "webhook_events_outbox"
            referencedColumns: ["outbox_id"]
          },
          {
            foreignKeyName: "webhook_delivery_dispatches_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["webhook_id"]
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
            | Database["public"]["Enums"]["spi_webhook_event_code"]
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
            | Database["public"]["Enums"]["spi_webhook_event_code"]
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
            | Database["public"]["Enums"]["spi_webhook_event_code"]
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
      webhook_events_outbox: {
        Row: {
          created_at: string
          dead_letter_reason: string | null
          dead_lettered_at: string | null
          event_type: Database["public"]["Enums"]["webhook_event"]
          idempotency_key: string
          organization_id: string
          outbox_id: string
          payload: Json
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dead_letter_reason?: string | null
          dead_lettered_at?: string | null
          event_type: Database["public"]["Enums"]["webhook_event"]
          idempotency_key: string
          organization_id: string
          outbox_id?: string
          payload: Json
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dead_letter_reason?: string | null
          dead_lettered_at?: string | null
          event_type?: Database["public"]["Enums"]["webhook_event"]
          idempotency_key?: string
          organization_id?: string
          outbox_id?: string
          payload?: Json
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_events_outbox_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      webhooks: {
        Row: {
          authorized_events: Database["public"]["Enums"]["webhook_event"][]
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
          authorized_events?: Database["public"]["Enums"]["webhook_event"][]
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
          authorized_events?: Database["public"]["Enums"]["webhook_event"][]
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
      whatsapp_business_connections: {
        Row: {
          catalog_id: string | null
          commerce_cart_enabled: boolean
          connected_at: string | null
          created_at: string
          disconnected_at: string | null
          display_phone_number: string | null
          kapso_connection_id: string | null
          organization_id: string
          phone_number_id: string
          settings: Json
          status: Database["public"]["Enums"]["whatsapp_connection_status"]
          updated_at: string
          waba_id: string
          webhook_verify_token_hash: string | null
        }
        Insert: {
          catalog_id?: string | null
          commerce_cart_enabled?: boolean
          connected_at?: string | null
          created_at?: string
          disconnected_at?: string | null
          display_phone_number?: string | null
          kapso_connection_id?: string | null
          organization_id: string
          phone_number_id: string
          settings?: Json
          status?: Database["public"]["Enums"]["whatsapp_connection_status"]
          updated_at?: string
          waba_id: string
          webhook_verify_token_hash?: string | null
        }
        Update: {
          catalog_id?: string | null
          commerce_cart_enabled?: boolean
          connected_at?: string | null
          created_at?: string
          disconnected_at?: string | null
          display_phone_number?: string | null
          kapso_connection_id?: string | null
          organization_id?: string
          phone_number_id?: string
          settings?: Json
          status?: Database["public"]["Enums"]["whatsapp_connection_status"]
          updated_at?: string
          waba_id?: string
          webhook_verify_token_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_business_connections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      whatsapp_catalog_items: {
        Row: {
          created_at: string
          id: string
          last_error: string | null
          last_synced_at: string | null
          meta_catalog_id: string
          meta_content_hash: string | null
          meta_product_id: string | null
          meta_snapshot: Json | null
          organization_id: string
          product_id: string | null
          product_retailer_id: string
          sync_status: Database["public"]["Enums"]["whatsapp_catalog_item_sync_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_error?: string | null
          last_synced_at?: string | null
          meta_catalog_id: string
          meta_content_hash?: string | null
          meta_product_id?: string | null
          meta_snapshot?: Json | null
          organization_id: string
          product_id?: string | null
          product_retailer_id: string
          sync_status?: Database["public"]["Enums"]["whatsapp_catalog_item_sync_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_error?: string | null
          last_synced_at?: string | null
          meta_catalog_id?: string
          meta_content_hash?: string | null
          meta_product_id?: string | null
          meta_snapshot?: Json | null
          organization_id?: string
          product_id?: string | null
          product_retailer_id?: string
          sync_status?: Database["public"]["Enums"]["whatsapp_catalog_item_sync_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_catalog_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "whatsapp_catalog_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      whatsapp_inbound_webhook_events: {
        Row: {
          metadata: Json | null
          phone_number_id: string
          provider_event_id: string
          received_at: string
        }
        Insert: {
          metadata?: Json | null
          phone_number_id: string
          provider_event_id: string
          received_at?: string
        }
        Update: {
          metadata?: Json | null
          phone_number_id?: string
          provider_event_id?: string
          received_at?: string
        }
        Relationships: []
      }
      whatsapp_orders: {
        Row: {
          catalog_id: string | null
          checkout_session_id: string | null
          created_at: string
          customer_phone_e164: string | null
          customer_wa_id: string
          failure_reason: string | null
          line_items_resolved: Json | null
          order_note: string | null
          organization_id: string
          payment_link_sent_at: string | null
          provider_message_id: string
          raw_order: Json
          source: Database["public"]["Enums"]["whatsapp_order_source"]
          status: Database["public"]["Enums"]["whatsapp_order_status"]
          transaction_id: string | null
          updated_at: string
          whatsapp_order_id: string
        }
        Insert: {
          catalog_id?: string | null
          checkout_session_id?: string | null
          created_at?: string
          customer_phone_e164?: string | null
          customer_wa_id: string
          failure_reason?: string | null
          line_items_resolved?: Json | null
          order_note?: string | null
          organization_id: string
          payment_link_sent_at?: string | null
          provider_message_id: string
          raw_order: Json
          source?: Database["public"]["Enums"]["whatsapp_order_source"]
          status?: Database["public"]["Enums"]["whatsapp_order_status"]
          transaction_id?: string | null
          updated_at?: string
          whatsapp_order_id?: string
        }
        Update: {
          catalog_id?: string | null
          checkout_session_id?: string | null
          created_at?: string
          customer_phone_e164?: string | null
          customer_wa_id?: string
          failure_reason?: string | null
          line_items_resolved?: Json | null
          order_note?: string | null
          organization_id?: string
          payment_link_sent_at?: string | null
          provider_message_id?: string
          raw_order?: Json
          source?: Database["public"]["Enums"]["whatsapp_order_source"]
          status?: Database["public"]["Enums"]["whatsapp_order_status"]
          transaction_id?: string | null
          updated_at?: string
          whatsapp_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_orders_checkout_session_id_fkey"
            columns: ["checkout_session_id"]
            isOneToOne: false
            referencedRelation: "checkout_sessions"
            referencedColumns: ["checkout_session_id"]
          },
          {
            foreignKeyName: "whatsapp_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "whatsapp_orders_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["transaction_id"]
          },
        ]
      }
      whatsapp_platform_config: {
        Row: {
          approved_count: number
          created_at: string
          last_checked_at: string | null
          missing_count: number
          pending_count: number
          phone_number_id: string | null
          ready: boolean
          rejected_count: number
          required_count: number
          summary: Json
          updated_at: string
          waba_id: string
        }
        Insert: {
          approved_count?: number
          created_at?: string
          last_checked_at?: string | null
          missing_count?: number
          pending_count?: number
          phone_number_id?: string | null
          ready?: boolean
          rejected_count?: number
          required_count?: number
          summary?: Json
          updated_at?: string
          waba_id: string
        }
        Update: {
          approved_count?: number
          created_at?: string
          last_checked_at?: string | null
          missing_count?: number
          pending_count?: number
          phone_number_id?: string | null
          ready?: boolean
          rejected_count?: number
          required_count?: number
          summary?: Json
          updated_at?: string
          waba_id?: string
        }
        Relationships: []
      }
      whatsapp_platform_template_status: {
        Row: {
          checked_at: string
          language: string
          meta_status: string | null
          status: string
          template_name: string
          waba_id: string
        }
        Insert: {
          checked_at?: string
          language: string
          meta_status?: string | null
          status: string
          template_name: string
          waba_id: string
        }
        Update: {
          checked_at?: string
          language?: string
          meta_status?: string | null
          status?: string
          template_name?: string
          waba_id?: string
        }
        Relationships: []
      }
      wide_events: {
        Row: {
          attributes: Json
          category: Database["public"]["Enums"]["event_category"]
          correlation_id: string | null
          created_at: string | null
          customer_id: string | null
          environment: string | null
          event_id: string
          event_name: string
          ip_address: unknown
          message: string | null
          organization_id: string | null
          session_id: string | null
          severity: Database["public"]["Enums"]["event_severity"]
          source: string | null
          url: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          attributes?: Json
          category?: Database["public"]["Enums"]["event_category"]
          correlation_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          environment?: string | null
          event_id?: string
          event_name: string
          ip_address?: unknown
          message?: string | null
          organization_id?: string | null
          session_id?: string | null
          severity?: Database["public"]["Enums"]["event_severity"]
          source?: string | null
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          attributes?: Json
          category?: Database["public"]["Enums"]["event_category"]
          correlation_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          environment?: string | null
          event_id?: string
          event_name?: string
          ip_address?: unknown
          message?: string | null
          organization_id?: string | null
          session_id?: string | null
          severity?: Database["public"]["Enums"]["event_severity"]
          source?: string | null
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wide_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "wide_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      withdrawal_notifications: {
        Row: {
          created_at: string
          email: string
          notification_id: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          notification_id?: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          notification_id?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_withdrawal_notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
    }
    Views: {
      merchant_balance_summary: {
        Row: {
          account_id: string | null
          balance_difference: number | null
          created_at: string | null
          currency_code: Database["public"]["Enums"]["currency_code"] | null
          is_spi_account: boolean | null
          organization_id: string | null
          revenue_balance: number | null
          spi_account_number: string | null
          spi_account_status:
            | Database["public"]["Enums"]["spi_account_status"]
            | null
          spi_account_type:
            | Database["public"]["Enums"]["spi_account_type"]
            | null
          spi_balance_last_synced: string | null
          spi_bank_balance: number | null
          spi_bank_balance_xof: number | null
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          balance_difference?: never
          created_at?: string | null
          currency_code?: Database["public"]["Enums"]["currency_code"] | null
          is_spi_account?: boolean | null
          organization_id?: string | null
          revenue_balance?: number | null
          spi_account_number?: string | null
          spi_account_status?:
            | Database["public"]["Enums"]["spi_account_status"]
            | null
          spi_account_type?:
            | Database["public"]["Enums"]["spi_account_type"]
            | null
          spi_balance_last_synced?: string | null
          spi_bank_balance?: number | null
          spi_bank_balance_xof?: never
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          balance_difference?: never
          created_at?: string | null
          currency_code?: Database["public"]["Enums"]["currency_code"] | null
          is_spi_account?: boolean | null
          organization_id?: string | null
          revenue_balance?: number | null
          spi_account_number?: string | null
          spi_account_status?:
            | Database["public"]["Enums"]["spi_account_status"]
            | null
          spi_account_type?:
            | Database["public"]["Enums"]["spi_account_type"]
            | null
          spi_balance_last_synced?: string | null
          spi_bank_balance?: number | null
          spi_bank_balance_xof?: never
          updated_at?: string | null
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
      oauth_merchant_connections: {
        Row: {
          access_level: string | null
          client_id: string | null
          client_name: string | null
          created_at: string | null
          environment: string | null
          expires_at: string | null
          is_active: boolean | null
          organization_id: string | null
          revoked_at: string | null
          scope: string | null
          token_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "oauth_access_tokens_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "oauth_clients"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "oauth_access_tokens_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
    }
    Functions: {
      _admin_broadcast_campaign_notification_ids: {
        Args: {
          p_broadcast_batch_id?: string
          p_legacy_event_key?: string
          p_legacy_message_en?: string
          p_legacy_sent_minute?: string
          p_organization_id?: string
        }
        Returns: string[]
      }
      _generate_partner_management_key_value: { Args: never; Returns: string }
      _generate_provisioning_key_value: { Args: never; Returns: string }
      _hash_oauth_secret: { Args: { p_value: string }; Returns: string }
      _hash_partner_management_key: { Args: { p_key: string }; Returns: string }
      _insert_bootstrap_api_key: {
        Args: {
          p_environment: string
          p_key_type: string
          p_merchant_id: string
          p_name: string
          p_organization_id: string
        }
        Returns: undefined
      }
      _rate_limit_resolver_applies_to_org: {
        Args: { p_organization_id: string }
        Returns: boolean
      }
      _transaction_digital_product_ids: {
        Args: { p_transaction_id: string }
        Returns: string[]
      }
      accept_team_invitation: {
        Args: { p_invitation_token: string; p_merchant_id: string }
        Returns: Json
      }
      add_assistant_message: {
        Args: {
          p_content: string
          p_conversation_id: string
          p_merchant_id: string
          p_message_index: number
          p_metadata?: Json
          p_model_used?: string
          p_response_time_ms?: number
          p_role: string
          p_tokens_used?: number
        }
        Returns: {
          message_id: string
        }[]
      }
      add_mobile_money_payout_method: {
        Args: {
          p_account_name: string
          p_account_number: string
          p_auto_withdrawal_mobile_provider: Database["public"]["Enums"]["provider_code"]
          p_bank_name: string
          p_country: string
          p_is_default?: boolean
          p_organization_id: string
        }
        Returns: string
      }
      add_organization_domain: {
        Args: {
          p_domain: string
          p_organization_id: string
          p_type: Database["public"]["Enums"]["domain_type"]
        }
        Returns: Json
      }
      add_withdrawal_notification_email: {
        Args: { p_email: string }
        Returns: boolean
      }
      admin_add_mobile_money_payout_method: {
        Args: {
          p_account_name: string
          p_account_number: string
          p_auto_withdrawal_mobile_provider: Database["public"]["Enums"]["provider_code"]
          p_bank_name: string
          p_country: string
          p_is_default?: boolean
          p_merchant_id: string
          p_organization_id: string
        }
        Returns: string
      }
      admin_approve_growth_reply: { Args: { p_id: string }; Returns: string }
      admin_check_payout_method_exists: {
        Args: {
          p_account_number: string
          p_auto_withdrawal_mobile_provider: Database["public"]["Enums"]["provider_code"]
          p_merchant_id: string
          p_organization_id: string
          p_payout_method_type?: string
        }
        Returns: {
          is_default: boolean
          payout_method_id: string
        }[]
      }
      admin_check_provider_payout_methods_exist: {
        Args: {
          p_auto_withdrawal_mobile_provider: Database["public"]["Enums"]["provider_code"]
          p_merchant_id: string
          p_organization_id: string
        }
        Returns: {
          is_default: boolean
          payout_method_id: string
        }[]
      }
      admin_complete_account_top_up: {
        Args: {
          p_bank_reference?: string
          p_notes?: string
          p_top_up_id: string
        }
        Returns: undefined
      }
      admin_create_partner: {
        Args: {
          p_allowed_environments?: string[]
          p_contact_email?: string
          p_default_daily_account_limit?: number
          p_default_rate_limit_per_minute?: number
          p_max_active_keys?: number
          p_metadata?: Json
          p_name: string
          p_owner_user_id?: string
          p_partner_type?: Database["public"]["Enums"]["platform_partner_type"]
          p_slug: string
        }
        Returns: {
          name: string
          partner_id: string
          partner_type: Database["public"]["Enums"]["platform_partner_type"]
          slug: string
          status: Database["public"]["Enums"]["platform_partner_status"]
        }[]
      }
      admin_create_tier_fee: {
        Args: {
          p_description: string
          p_fee_category: Database["public"]["Enums"]["fee_category"]
          p_fee_subcategory: Database["public"]["Enums"]["fee_subcategory"]
          p_fixed_amount?: number
          p_name: string
          p_payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          p_percentage?: number
          p_provider_code?: Database["public"]["Enums"]["provider_code"]
          p_tier_id: string
        }
        Returns: string
      }
      admin_delete_broadcast_campaign: {
        Args: {
          p_broadcast_batch_id?: string
          p_legacy_event_key?: string
          p_legacy_message_en?: string
          p_legacy_sent_minute?: string
        }
        Returns: Json
      }
      admin_delete_broadcast_campaign_for_org: {
        Args: {
          p_broadcast_batch_id?: string
          p_legacy_event_key?: string
          p_legacy_message_en?: string
          p_legacy_sent_minute?: string
          p_organization_id: string
        }
        Returns: Json
      }
      admin_get_organizations_pricing_status: {
        Args: { p_limit?: number; p_offset?: number; p_search?: string }
        Returns: {
          currency_code: Database["public"]["Enums"]["currency_code"]
          current_month_revenue: number
          current_tier_name: string
          email: string
          name: string
          organization_id: string
          pricing_plan_type: Database["public"]["Enums"]["pricing_plan_type"]
        }[]
      }
      admin_hold_transaction: {
        Args: { p_reason?: string; p_transaction_id: string }
        Returns: Json
      }
      admin_issue_partner_management_key: {
        Args: { p_name?: string; p_partner_id: string }
        Returns: {
          management_key: string
          management_key_id: string
          name: string
          partner_id: string
        }[]
      }
      admin_list_broadcast_campaign_recipients: {
        Args: {
          p_broadcast_batch_id?: string
          p_legacy_event_key?: string
          p_legacy_message_en?: string
          p_legacy_sent_minute?: string
        }
        Returns: {
          created_at: string
          is_archived: boolean
          is_read: boolean
          is_visible_in_sidebar: boolean
          notification_id: string
          organization_id: string
          organization_name: string
        }[]
      }
      admin_list_broadcast_campaigns: {
        Args: never
        Returns: {
          active_in_sidebar_count: number
          broadcast_batch_id: string
          event_key: string
          is_legacy: boolean
          legacy_event_key: string
          legacy_message_en: string
          legacy_sent_minute: string
          message_en: string
          message_fr: string
          notification_type: string
          organization_count: number
          sent_at: string
          severity: string
          title: string
        }[]
      }
      admin_list_checkout_sessions_for_disruption: {
        Args: { p_days_back?: number; p_organization_id: string }
        Returns: {
          amount: number
          checkout_session_id: string
          created_at: string
          currency_code: string
          customer_email: string
          customer_name: string
          disruption_email_sent_at: string
          expires_at: string
          has_completed_payment: boolean
          session_valid: boolean
          title: string
        }[]
      }
      admin_log_growth_outbound_touch: {
        Args: {
          p_body?: string
          p_channel: Database["public"]["Enums"]["growth_outbound_channel"]
          p_contact_id?: string
          p_direction?: Database["public"]["Enums"]["growth_outbound_direction"]
          p_lead_id: string
          p_meeting_booked?: boolean
          p_replied?: boolean
          p_sequence_id?: string
          p_subject?: string
          p_won?: boolean
        }
        Returns: string
      }
      admin_reject_account_top_up: {
        Args: { p_notes?: string; p_top_up_id: string }
        Returns: undefined
      }
      admin_reject_growth_reply: {
        Args: { p_id: string; p_reason?: string }
        Returns: undefined
      }
      admin_release_held_transaction: {
        Args: { p_transaction_id: string }
        Returns: Json
      }
      admin_resolve_live_activation_request: {
        Args: {
          p_approved: boolean
          p_rejection_reason?: string
          p_request_id: string
        }
        Returns: Json
      }
      admin_save_growth_icp: {
        Args: {
          p_activate?: boolean
          p_anti_icp?: Json
          p_hard_filters?: Json
          p_markdown: string
          p_soft_signals?: Json
          p_verified_winner_pass_rate?: number
        }
        Returns: string
      }
      admin_send_customer_payment_disruption: {
        Args: {
          p_checkout_session_ids: string[]
          p_extend_hours?: number
          p_force?: boolean
          p_payment_method_label?: string
        }
        Returns: Json
      }
      admin_set_assistant_org_message_limit: {
        Args: { p_monthly_message_limit?: number; p_organization_id: string }
        Returns: undefined
      }
      admin_set_partner_status: {
        Args: {
          p_partner_id: string
          p_status: Database["public"]["Enums"]["platform_partner_status"]
        }
        Returns: undefined
      }
      admin_sync_starter_tier_from_defaults: {
        Args: { p_currency_code?: Database["public"]["Enums"]["currency_code"] }
        Returns: number
      }
      admin_update_bank_payout_status: {
        Args: {
          p_notes?: string
          p_payout_id: string
          p_status: Database["public"]["Enums"]["payout_status"]
        }
        Returns: undefined
      }
      admin_update_broadcast_campaign: {
        Args: {
          p_broadcast_batch_id?: string
          p_legacy_event_key?: string
          p_legacy_message_en?: string
          p_legacy_sent_minute?: string
          p_message_en?: string
          p_message_fr?: string
          p_severity?: string
          p_title?: string
          p_type?: Database["public"]["Enums"]["notification_type"]
        }
        Returns: Json
      }
      admin_update_growth_lead_status: {
        Args: {
          p_id: string
          p_notes?: string
          p_status: Database["public"]["Enums"]["growth_lead_status"]
        }
        Returns: undefined
      }
      admin_update_growth_reply_draft: {
        Args: { p_draft_text: string; p_id: string }
        Returns: undefined
      }
      admin_update_payout_method_validity: {
        Args: { p_is_valid: boolean; p_payout_method_id: string }
        Returns: undefined
      }
      admin_update_platform_default_fee: {
        Args: {
          p_default_fee_id: string
          p_description?: string
          p_fixed_amount?: number
          p_name?: string
          p_percentage?: number
        }
        Returns: boolean
      }
      admin_update_pricing_tier: {
        Args: {
          p_max_revenue?: number
          p_min_revenue?: number
          p_tier_id: string
          p_tier_name?: string
        }
        Returns: boolean
      }
      admin_update_tier_fee: {
        Args: {
          p_fixed_amount?: number
          p_percentage?: number
          p_tier_fee_id: string
        }
        Returns: boolean
      }
      admin_upsert_growth_contact: {
        Args: {
          p_email?: string
          p_employer_company?: string
          p_full_name: string
          p_id?: string
          p_lead_id?: string
          p_linkedin_url?: string
          p_phone?: string
          p_role?: Database["public"]["Enums"]["growth_contact_role"]
          p_title?: string
          p_watch_enabled?: boolean
        }
        Returns: string
      }
      admin_upsert_growth_deal: {
        Args: {
          p_amount_xof?: number
          p_id?: string
          p_lead_id: string
          p_name: string
          p_notes?: string
          p_owner_email?: string
          p_source_channel?: Database["public"]["Enums"]["growth_outbound_channel"]
          p_stage?: Database["public"]["Enums"]["growth_deal_stage"]
        }
        Returns: string
      }
      advance_usage_subscription_billing_date: {
        Args: { p_subscription_id: string }
        Returns: string
      }
      allocate_public_id: {
        Args: { p_prefix: string; p_table: string }
        Returns: string
      }
      api_internal_base_url: { Args: never; Returns: string }
      api_rate_limit_endpoint_matches: {
        Args: { p_endpoint: string; p_pattern: string }
        Returns: boolean
      }
      apply_ai_starter_kyc_decision: {
        Args: {
          p_confidence: number
          p_decision: string
          p_error?: string
          p_id_type?: string
          p_model: string
          p_organization_id: string
          p_raw_response?: Json
          p_reasons?: Json
          p_rejection_reason?: string
        }
        Returns: Database["public"]["Enums"]["kyc_status"]
      }
      apply_beneficiary_payout_debit: {
        Args: { p_payout_id: string }
        Returns: undefined
      }
      apply_coupon: {
        Args: {
          p_checkout_session_id?: string
          p_coupon_id: string
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_customer_id?: string
          p_fees_amount?: number
          p_organization_id: string
          p_original_amount: number
          p_quantity?: number
          p_transaction_id?: string
        }
        Returns: {
          applied_coupon_id: string
          discount_amount: number
          final_amount: number
          message: string
          success: boolean
        }[]
      }
      apply_coupon_to_checkout: {
        Args: { p_checkout_session_id: string; p_coupon_code: string }
        Returns: {
          discount_amount: number
          message: string
          new_amount: number
          success: boolean
        }[]
      }
      apply_coupons_to_checkout: {
        Args: { p_checkout_session_id: string; p_coupon_codes: string[] }
        Returns: {
          breakdown: Json
          message: string
          new_amount: number
          success: boolean
          total_discount: number
        }[]
      }
      apply_mtn_partial_refund_charges: {
        Args: {
          p_processing_fee_percentage?: number
          p_refund_amount: number
          p_refund_id: string
          p_subscription_action?: string
          p_transaction_id: string
        }
        Returns: {
          error_message: string
          subscription_action: Json
          success: boolean
        }[]
      }
      apply_spi_payout_debit: {
        Args: { p_payout_id: string }
        Returns: undefined
      }
      apply_stripe_dispute_lost_effects: {
        Args: { p_stripe_dispute_id: string }
        Returns: Json
      }
      apply_subscription_refund_action: {
        Args: {
          p_initiated_by?: string
          p_is_full_refund: boolean
          p_refund_id: string
          p_subscription_action?: string
          p_transaction_id: string
        }
        Returns: Json
      }
      apply_wave_partial_refund_charges: {
        Args: {
          p_processing_fee_percentage?: number
          p_refund_amount: number
          p_refund_id: string
          p_subscription_action?: string
          p_transaction_id: string
        }
        Returns: {
          error_message: string
          subscription_action: Json
          success: boolean
        }[]
      }
      approve_cli_device_request: {
        Args: {
          p_device_code: string
          p_merchant_id: string
          p_organization_id: string
        }
        Returns: boolean
      }
      approve_mcp_device_request: {
        Args: {
          p_device_code: string
          p_merchant_id: string
          p_organization_id: string
        }
        Returns: boolean
      }
      approve_network_operator: {
        Args: {
          p_approved_by?: string
          p_default_capabilities?: string[]
          p_metadata?: Json
          p_operator_organization_id: string
          p_risk_tier?: string
        }
        Returns: string
      }
      archive_all_read_notifications: {
        Args: { p_merchant_id: string }
        Returns: undefined
      }
      archive_notification: {
        Args: { p_notification_id: string }
        Returns: undefined
      }
      archive_price: { Args: { p_price_id: string }; Returns: undefined }
      assert_assistant_merchant_permission: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_permission_key: string
        }
        Returns: undefined
      }
      assert_bnpl_eligible_product: {
        Args: { p_checkout_session_id?: string; p_product_id: string }
        Returns: undefined
      }
      assert_bnpl_merchant_eligible: {
        Args: { p_organization_id: string }
        Returns: undefined
      }
      assert_currency_allowed_for_organization: {
        Args: {
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_organization_id: string
        }
        Returns: undefined
      }
      assert_line_items_eligible: {
        Args: { p_line_items: Json }
        Returns: undefined
      }
      assert_org_member_with_permission: {
        Args: { p_organization_id: string; p_permission: string }
        Returns: undefined
      }
      assert_payout_pin_or_session: {
        Args: {
          p_bypass_payout_pin?: boolean
          p_merchant_id: string
          p_organization_id: string
          p_payout_pin?: string
          p_payout_pin_session?: string
        }
        Returns: undefined
      }
      assert_product_has_digital_deliverables: {
        Args: { p_product_id: string }
        Returns: undefined
      }
      assert_product_in_stock: {
        Args: { p_product_id: string; p_quantity?: number }
        Returns: undefined
      }
      assert_public_booking_slot_valid: {
        Args: {
          p_buffer_minutes: number
          p_duration_minutes: number
          p_org_id: string
          p_service_id: string
          p_starts_at: string
        }
        Returns: undefined
      }
      assert_pwyw_unit_amount: {
        Args: {
          p_maximum_amount: number
          p_minimum_amount: number
          p_unit_amount: number
        }
        Returns: undefined
      }
      assert_spi_qr_code_access: {
        Args: { p_permission?: string; p_qr_code_id: string }
        Returns: string
      }
      assign_member_role: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_role_id: string
        }
        Returns: boolean
      }
      assistant_merchant_has_permission: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_permission_key: string
        }
        Returns: boolean
      }
      attach_subscription_meter_charge: {
        Args: { p_meter_id: string; p_subscription_id: string }
        Returns: string
      }
      auth_mfa_satisfied: { Args: never; Returns: boolean }
      auto_connect_gim: {
        Args: { p_organization_id: string }
        Returns: undefined
      }
      auto_connect_spi: {
        Args: { p_organization_id: string }
        Returns: undefined
      }
      auto_connect_stripe: {
        Args: { p_organization_id: string }
        Returns: undefined
      }
      auto_disconnect_spi: {
        Args: { p_organization_id: string }
        Returns: undefined
      }
      auto_disconnect_stripe: {
        Args: { p_organization_id: string }
        Returns: undefined
      }
      billing_interval_period_days: {
        Args: {
          p_billing_interval: Database["public"]["Enums"]["billing_interval"]
        }
        Returns: number
      }
      booking_status_blocks_slot: {
        Args: {
          p_created_at: string
          p_status: Database["public"]["Enums"]["booking_status"]
        }
        Returns: boolean
      }
      broadcast_notification: {
        Args: {
          p_message_en: string
          p_message_fr: string
          p_severity?: string
          p_target_org_id?: string
          p_target_org_ids?: string[]
          p_title: string
          p_type?: Database["public"]["Enums"]["notification_type"]
        }
        Returns: Json
      }
      browser_handoff_consume: {
        Args: { p_token_hash: string }
        Returns: {
          aal: string
          from_audience: string
          handoff_id: string
          refresh_ciphertext: string
          to_audience: string
          user_email: string
          user_id: string
        }[]
      }
      browser_handoff_create: {
        Args: {
          p_aal: string
          p_expires_at: string
          p_from_audience: string
          p_refresh_ciphertext: string
          p_to_audience: string
          p_token_hash: string
          p_user_email: string
          p_user_id: string
        }
        Returns: string
      }
      browser_session_create: {
        Args: {
          p_aal: string
          p_audience: string
          p_expires_at: string
          p_idle_expires_at: string
          p_refresh_ciphertext: string
          p_token_hash: string
          p_user_email: string
          p_user_id: string
        }
        Returns: string
      }
      browser_session_revoke: {
        Args: { p_token_hash: string }
        Returns: boolean
      }
      browser_session_revoke_user: {
        Args: { p_audience?: string; p_user_id: string }
        Returns: number
      }
      browser_session_update_material: {
        Args: {
          p_aal: string
          p_refresh_ciphertext: string
          p_token_hash: string
        }
        Returns: boolean
      }
      browser_session_validate: {
        Args: {
          p_audience: string
          p_idle_extension?: string
          p_token_hash: string
        }
        Returns: {
          aal: string
          expires_at: string
          idle_expires_at: string
          refresh_ciphertext: string
          session_id: string
          user_email: string
          user_id: string
        }[]
      }
      build_merchant_subscription_webhook_payload: {
        Args: { p_subscription_id: string; p_transaction_id?: string }
        Returns: Json
      }
      calculate_beneficiary_payout_fee: {
        Args: {
          p_amount: number
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_merchant_id?: string
          p_provider_code?: Database["public"]["Enums"]["provider_code"]
        }
        Returns: {
          fee_amount: number
          fee_percentage: number
          total_amount: number
        }[]
      }
      calculate_bnpl_breakdown: {
        Args: {
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_installment_count: number
          p_organization_id: string
          p_product_amount: number
        }
        Returns: {
          customer_installment_amount: number
          customer_interest_per_installment: number
          customer_interest_total: number
          customer_principal: number
          customer_total: number
          merchant_processing_fee: number
          merchant_receives_immediately: number
          platform_financing_revenue: number
          platform_processing_revenue: number
          platform_total_revenue: number
        }[]
      }
      calculate_bnpl_financing: {
        Args: {
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_installment_count: number
          p_interest_rate?: number
          p_product_amount: number
        }
        Returns: {
          installment_amount: number
          interest_amount: number
          merchant_fee: number
          platform_revenue: number
          total_with_interest: number
        }[]
      }
      calculate_channel_provider_cost: {
        Args: {
          p_channel?: string
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_gross_amount: number
          p_provider_code: Database["public"]["Enums"]["provider_code"]
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: number
      }
      calculate_coupon_discount: {
        Args: {
          p_base_amount: number
          p_coupon_id: string
          p_fees_amount?: number
          p_quantity?: number
        }
        Returns: {
          discount_amount: number
          discount_type: Database["public"]["Enums"]["discount_type"]
          final_amount: number
          message: string
          success: boolean
        }[]
      }
      calculate_date_range: {
        Args: {
          p_custom_end: string
          p_custom_start: string
          p_date_range: string
        }
        Returns: {
          end_date: string
          start_date: string
        }[]
      }
      calculate_mass_payout_totals_and_balance: {
        Args: {
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_merchant_id: string
          p_payout_data: Json
          p_provider_code: Database["public"]["Enums"]["provider_code"]
        }
        Returns: {
          current_balance: number
          has_sufficient_balance: boolean
          message: string
          total_amount: number
          total_deduction: number
          total_fee: number
        }[]
      }
      calculate_multi_coupon_discount: {
        Args: {
          p_coupon_codes: string[]
          p_customer_id: string
          p_organization_id: string
          p_price_id: string
        }
        Returns: {
          breakdown: Json
          error_message: string
          is_valid: boolean
          total_discount: number
        }[]
      }
      calculate_network_operator_fee: {
        Args: {
          p_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_fee_rule_id: string
        }
        Returns: number
      }
      calculate_organization_mrr: {
        Args: { p_environment?: string; p_organization_id: string }
        Returns: {
          arr: number
          mrr: number
        }[]
      }
      calculate_passed_processing_fee: {
        Args: {
          p_base_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_is_pos?: boolean
          p_organization_id: string
          p_payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          p_provider_code: Database["public"]["Enums"]["provider_code"]
        }
        Returns: {
          payable: number
          surcharge: number
        }[]
      }
      calculate_payout_fee: {
        Args: {
          p_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_organization_id: string
          p_payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          p_provider_code: Database["public"]["Enums"]["provider_code"]
          p_subcategory?: Database["public"]["Enums"]["fee_subcategory"]
        }
        Returns: {
          fee_amount: number
          fee_name: string
          fee_structure_id: string
        }[]
      }
      calculate_renewal_charge_amount: {
        Args: {
          p_base_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_organization_id: string
        }
        Returns: number
      }
      calculate_subscription_first_charge_amount: {
        Args: {
          p_as_of_date?: string
          p_price_id: string
          p_product_id: string
        }
        Returns: number
      }
      calculate_transaction_fee: {
        Args: {
          p_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_is_pos?: boolean
          p_organization_id: string
          p_payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          p_provider_code: Database["public"]["Enums"]["provider_code"]
        }
        Returns: {
          fee_amount: number
          fee_name: string
          fee_structure_id: string
          tier_fee_id: string
        }[]
      }
      calculate_transaction_provider_cost: {
        Args: {
          p_channel: string
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_gross_amount: number
          p_provider_code: Database["public"]["Enums"]["provider_code"]
          p_target_currency: Database["public"]["Enums"]["currency_code"]
        }
        Returns: number
      }
      calculate_usage_charge: {
        Args: { p_price_id: string; p_units: number }
        Returns: number
      }
      calculate_volume_savings: {
        Args: { p_organization_id: string }
        Returns: {
          currency_code: Database["public"]["Enums"]["currency_code"]
          current_month_fees: number
          current_month_revenue: number
          current_tier_id: string
          current_tier_name: string
          is_volume_plan: boolean
          potential_monthly_savings: number
          previous_month_revenue: number
          pricing_plan_last_changed_at: string
          pricing_plan_type: Database["public"]["Enums"]["pricing_plan_type"]
          projected_annual_savings: number
          projected_tier_fees: number
          starter_vs_fixed_delta: number
          tier_determination_revenue: number
        }[]
      }
      cancel_account_top_up: {
        Args: { p_top_up_id: string }
        Returns: undefined
      }
      cancel_customer_invoice: {
        Args: {
          p_invoice_id: string
          p_merchant_id?: string
          p_organization_id: string
        }
        Returns: Json
      }
      cancel_customer_subscription: {
        Args: {
          p_cancel_at_period_end?: boolean
          p_cancellation_reason?: string
          p_merchant_id: string
          p_subscription_id: string
        }
        Returns: boolean
      }
      cancel_network_enrollment_session: {
        Args: { p_actor_merchant_id?: string; p_enrollment_session_id: string }
        Returns: boolean
      }
      check_assistant_usage_allowance: {
        Args: { p_merchant_id: string; p_organization_id: string }
        Returns: Json
      }
      check_entitlement: {
        Args: { p_customer_id: string; p_feature_key: string }
        Returns: Json
      }
      check_merchant_available_balance: {
        Args: {
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_merchant_id: string
        }
        Returns: number
      }
      check_merchant_balance_for_beneficiary_payout: {
        Args: {
          p_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_merchant_id: string
          p_provider_code?: Database["public"]["Enums"]["provider_code"]
        }
        Returns: {
          current_balance: number
          fee_amount: number
          has_sufficient_balance: boolean
          message: string
          required_amount: number
        }[]
      }
      check_mobile_money_platform_eligibility: {
        Args: { p_payout_method_id: string }
        Returns: {
          eligible_at: string
          is_eligible: boolean
        }[]
      }
      check_onboarding_status: {
        Args: { p_merchant_id: string }
        Returns: Json
      }
      check_organization_admin_access: {
        Args: { p_merchant_id: string }
        Returns: boolean
      }
      check_organization_api_usage: {
        Args: { p_organization_id: string }
        Returns: boolean
      }
      check_potential_duplicates_after_creation: {
        Args: { p_customer_id: string; p_similarity_threshold?: number }
        Returns: {
          customer_name: string
          duplicate_name: string
          match_reason: string
          match_score: number
          potential_duplicate_id: string
        }[]
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
      check_rate_limit: {
        Args: {
          p_api_key: string
          p_endpoint: string
          p_organization_id: string
        }
        Returns: boolean
      }
      check_user_organization_access: {
        Args: { p_organization_id: string; p_user_id: string }
        Returns: boolean
      }
      check_withdrawal_limits: {
        Args: {
          p_amount: number
          p_organization_id: string
          p_provider_code: Database["public"]["Enums"]["provider_code"]
        }
        Returns: boolean
      }
      checkout_session_is_renewal: {
        Args: { p_checkout_session_id: string }
        Returns: boolean
      }
      claim_api_idempotency_record: {
        Args: {
          p_endpoint_route: string
          p_environment: string
          p_idempotency_key: string
          p_organization_id: string
          p_request_fingerprint: string
        }
        Returns: {
          kind: string
          response_payload: Json
        }[]
      }
      claim_inbound_provider_webhook_event: {
        Args: {
          p_metadata?: Json
          p_provider: Database["public"]["Enums"]["provider_code"]
          p_provider_event_id: string
        }
        Returns: boolean
      }
      classify_subscription_transaction: {
        Args: { p_transaction_id: string }
        Returns: string
      }
      classify_transaction_channel: {
        Args: {
          p_is_pos: boolean
          p_metadata: Json
          p_payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          p_provider_code: Database["public"]["Enums"]["provider_code"]
          p_spi_payment_category: Database["public"]["Enums"]["spi_payment_category"]
        }
        Returns: string
      }
      cleanup_duplicate_wave_transactions: {
        Args: { p_deduplication_window?: string }
        Returns: number
      }
      cleanup_expired_payment_links: { Args: never; Returns: number }
      cleanup_old_notifications: { Args: never; Returns: undefined }
      cleanup_old_usage_events: {
        Args: { p_retention_months?: number }
        Returns: number
      }
      cleanup_old_wide_events: { Args: never; Returns: number }
      cleanup_stale_assistant_runs: {
        Args: { p_max_age_hours?: number }
        Returns: number
      }
      clear_subscription_renewal_dunning: {
        Args: { p_subscription_id: string }
        Returns: undefined
      }
      clear_subscription_stripe_renewal_failure: {
        Args: { p_subscription_id: string }
        Returns: undefined
      }
      close_usage_billing_period: {
        Args: { p_period_end?: string; p_subscription_id: string }
        Returns: string
      }
      compare_pricing_defaults_vs_starter: {
        Args: { p_currency_code?: Database["public"]["Enums"]["currency_code"] }
        Returns: {
          default_fixed_amount: number
          default_percentage: number
          fee_name: string
          fee_subcategory: Database["public"]["Enums"]["fee_subcategory"]
          is_starter_not_higher: boolean
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          starter_fixed_amount: number
          starter_percentage: number
        }[]
      }
      complete_api_idempotency_record: {
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
      complete_cli_device_request: {
        Args: { p_device_code: string }
        Returns: boolean
      }
      complete_customer_portal_payment_method_setup: {
        Args: {
          p_card_details?: Json
          p_customer_id: string
          p_organization_id: string
          p_stripe_payment_method_id: string
        }
        Returns: Json
      }
      complete_manual_refund_request: {
        Args: {
          p_completed_by?: string
          p_notes?: string
          p_refund_id: string
          p_stripe_refund_id?: string
        }
        Returns: Json
      }
      complete_mcp_device_request: {
        Args: { p_device_code: string }
        Returns: boolean
      }
      complete_mobile_starter_setup: {
        Args: {
          p_city?: string
          p_country?: string
          p_merchant_id: string
          p_org_name: string
          p_phone?: string
          p_region?: string
          p_street?: string
        }
        Returns: {
          organization_id: string
          store_handle: string
        }[]
      }
      complete_mtn_beneficiary_payout: {
        Args: {
          p_mtn_metadata?: Json
          p_payout_id: string
          p_status: Database["public"]["Enums"]["payout_status"]
        }
        Returns: Json
      }
      complete_mtn_refund_provider: {
        Args: {
          p_mtn_metadata?: Json
          p_mtn_refund_reference_id?: string
          p_reason?: string
          p_refund_id: string
          p_transaction_id: string
        }
        Returns: Json
      }
      complete_network_enrollment_session: {
        Args: {
          p_accepted_by_merchant_id: string
          p_enrollment_token: string
          p_member_organization_id: string
          p_terms_version?: string
        }
        Returns: {
          network_account_id: string
          network_membership_id: string
          public_account_id: string
        }[]
      }
      complete_network_enrollment_with_profile: {
        Args: {
          p_accepted_by_merchant_id: string
          p_accepted_ip?: string
          p_accepted_user_agent?: string
          p_business_identifier?: string
          p_contact_email?: string
          p_contact_phone?: string
          p_country?: string
          p_enrollment_token: string
          p_external_identifier_type?: string
          p_external_identifier_value?: string
          p_legal_name?: string
          p_member_organization_id: string
          p_metadata?: Json
          p_registry_identifier?: string
          p_tax_identifier?: string
          p_terms_version?: string
        }
        Returns: {
          network_account_id: string
          network_membership_id: string
          public_account_id: string
        }[]
      }
      complete_onboarding: {
        Args: {
          p_address_proof_url?: string
          p_avatar_url: string
          p_business_description?: string
          p_business_registration_url?: string
          p_country: string
          p_document_extraction?: Json
          p_first_name: string
          p_id_document_number?: string
          p_identity_proof_url?: string
          p_is_authorized_signatory?: boolean
          p_is_starter_business?: boolean
          p_last_name: string
          p_legal_city?: string
          p_legal_country?: string
          p_legal_organization_name?: string
          p_legal_postal_code?: string
          p_legal_region?: string
          p_legal_street?: string
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
          p_proof_of_business?: string
          p_proof_of_business_url?: string
          p_signatory_email?: string
          p_signatory_name?: string
          p_tax_number?: string
        }
        Returns: undefined
      }
      complete_pos_spi_payment: {
        Args: {
          p_metadata?: Json
          p_spi_payment_status: Database["public"]["Enums"]["spi_payment_status"]
          p_spi_tx_id: string
        }
        Returns: Json
      }
      complete_shopify_pending_payment: {
        Args: { p_draft_order_id: string; p_lomi_transaction_id?: string }
        Returns: boolean
      }
      complete_spi_bnpl_installment: {
        Args: {
          p_metadata?: Json
          p_spi_payment_status: Database["public"]["Enums"]["spi_payment_status"]
          p_spi_tx_id: string
        }
        Returns: Json
      }
      complete_spi_invoice_payment: {
        Args: {
          p_metadata?: Json
          p_spi_payment_status: Database["public"]["Enums"]["spi_payment_status"]
          p_spi_tx_id: string
        }
        Returns: Json
      }
      complete_spi_payment: {
        Args: {
          p_metadata?: Json
          p_spi_payment_status: Database["public"]["Enums"]["spi_payment_status"]
          p_spi_tx_id: string
        }
        Returns: Json
      }
      complete_spi_payout_payment: {
        Args: {
          p_metadata?: Json
          p_spi_payment_status: Database["public"]["Enums"]["spi_payment_status"]
          p_spi_tx_id: string
        }
        Returns: Json
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
      complete_stripe_trial_setup: {
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
      complete_subscription_signup_without_payment: {
        Args: {
          p_checkout_session_id?: string
          p_customer_id: string
          p_merchant_id: string
          p_metadata?: Json
          p_organization_id: string
          p_price_id?: string
          p_product_id: string
        }
        Returns: string
      }
      complete_wave_refund_provider: {
        Args: {
          p_reason?: string
          p_refund_id: string
          p_refund_type?: string
          p_transaction_id: string
          p_wave_metadata?: Json
          p_wave_refund_id?: string
        }
        Returns: Json
      }
      compute_service_deposit: {
        Args: {
          p_deposit_type: Database["public"]["Enums"]["service_deposit_type"]
          p_deposit_value: number
          p_payment_mode: Database["public"]["Enums"]["service_payment_mode"]
          p_price: number
        }
        Returns: number
      }
      compute_subscription_next_billing_date: {
        Args: {
          p_billing_interval: Database["public"]["Enums"]["billing_interval"]
          p_charge_day?: number
          p_from_date: string
        }
        Returns: string
      }
      compute_subscription_previous_attributes: {
        Args: {
          p_new: Database["public"]["Tables"]["subscriptions"]["Row"]
          p_old: Database["public"]["Tables"]["subscriptions"]["Row"]
        }
        Returns: Json
      }
      connect_default_providers: {
        Args: { p_organization_id: string }
        Returns: undefined
      }
      consume_customer_portal_launch_session: {
        Args: { p_token: string }
        Returns: {
          customer_id: string
          environment: string
          flow_after_completion_url: string
          flow_subscription_id: string
          flow_type: string
          org_name: string
          org_slug: string
          organization_id: string
          return_url: string
        }[]
      }
      convert_amount_for_stripe: {
        Args: {
          p_amount_xof: number
          p_apply_xof_rounding?: boolean
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          amount_in_cents: number
          amount_in_target_currency: number
          conversion_rate: number
        }[]
      }
      convert_currency: {
        Args: {
          p_amount: number
          p_conversion_type?: Database["public"]["Enums"]["conversion_type"]
          p_from_currency: Database["public"]["Enums"]["currency_code"]
          p_merchant_id?: string
          p_organization_id?: string
          p_reference_id?: string
          p_to_currency: Database["public"]["Enums"]["currency_code"]
        }
        Returns: number
      }
      convert_currency_for_display: {
        Args: {
          p_amount: number
          p_from_currency: Database["public"]["Enums"]["currency_code"]
          p_to_currency: Database["public"]["Enums"]["currency_code"]
        }
        Returns: number
      }
      convert_expired_trials: { Args: never; Returns: number }
      create_account_top_up: {
        Args: {
          p_amount: number
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_organization_id: string
        }
        Returns: {
          amount: number
          bank_instructions: Json
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          expires_at: string
          organization_id: string
          reference_code: string
          status: Database["public"]["Enums"]["account_top_up_status"]
          top_up_id: string
        }[]
      }
      create_admin_notification: {
        Args: {
          p_message_en: string
          p_message_fr: string
          p_organization_id: string
          p_severity?: string
          p_type?: Database["public"]["Enums"]["notification_type"]
        }
        Returns: string
      }
      create_agent_event_subscription: {
        Args: {
          p_channel: string
          p_organization_id: string
          p_topics: string[]
          p_webhook_url?: string
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
          p_context?: Json
          p_organization_id: string
          p_task: string
          p_to_agent: string
          p_trace_id?: string
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
          p_idempotency_key?: string
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
      create_analytics_share: {
        Args: {
          p_chart_type: string
          p_image_url: string
          p_organization_id: string
          p_title: string
          p_user_id: string
        }
        Returns: {
          id: string
        }[]
      }
      create_assistant_conversation: {
        Args: {
          p_merchant_id: string
          p_metadata?: Json
          p_organization_id?: string
          p_title?: string
        }
        Returns: {
          conversation_id: string
          created_at: string
          title: string
        }[]
      }
      create_assistant_feedback: {
        Args: { p_merchant_id: string; p_message: string; p_sentiment: string }
        Returns: undefined
      }
      create_assistant_run: {
        Args: {
          p_conversation_id: string
          p_environment: string
          p_merchant_id: string
          p_messages_snapshot: Json
          p_mode: string
          p_organization_id: string
          p_pending_gate: Json
          p_session_approved_tools?: string[]
        }
        Returns: string
      }
      create_beneficiary_payout: {
        Args: {
          p_amount: number
          p_bypass_payout_pin?: boolean
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_merchant_id: string
          p_metadata?: Json
          p_payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          p_payout_method_id?: string
          p_payout_pin?: string
          p_payout_pin_session?: string
          p_provider_code?: Database["public"]["Enums"]["provider_code"]
          p_status?: Database["public"]["Enums"]["payout_status"]
        }
        Returns: {
          fee_amount: number
          message: string
          payout_id: string
          status: Database["public"]["Enums"]["payout_status"]
          total_deduction: number
        }[]
      }
      create_beneficiary_payout_with_mtn: {
        Args: {
          p_amount: number
          p_bypass_payout_pin?: boolean
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_merchant_id: string
          p_metadata?: Json
          p_mtn_transfer_reference_id: string
          p_payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          p_payout_pin?: string
          p_payout_pin_session?: string
          p_provider_code?: Database["public"]["Enums"]["provider_code"]
          p_status?: Database["public"]["Enums"]["payout_status"]
        }
        Returns: {
          fee_amount: number
          message: string
          payout_id: string
          status: Database["public"]["Enums"]["payout_status"]
          total_deduction: number
        }[]
      }
      create_beneficiary_payout_with_wave: {
        Args: {
          p_amount: number
          p_bypass_payout_pin?: boolean
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_merchant_id: string
          p_metadata?: Json
          p_payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          p_payout_pin?: string
          p_payout_pin_session?: string
          p_provider_code?: Database["public"]["Enums"]["provider_code"]
          p_status?: Database["public"]["Enums"]["payout_status"]
          p_wave_payout_id: string
        }
        Returns: {
          fee_amount: number
          message: string
          payout_id: string
          status: Database["public"]["Enums"]["payout_status"]
          total_deduction: number
        }[]
      }
      create_bnpl_installment_plan: {
        Args: {
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_customer_id: string
          p_installment_count: number
          p_interest_rate?: number
          p_merchant_id: string
          p_organization_id: string
          p_product_amount: number
          p_product_id: string
        }
        Returns: string
      }
      create_bnpl_plan_with_spi: {
        Args: {
          p_checkout_session_id?: string
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_customer_id: string
          p_installment_count: number
          p_merchant_id: string
          p_organization_id: string
          p_product_amount: number
          p_product_id: string
          p_spi_account_number?: string
        }
        Returns: {
          customer_total: number
          initial_transaction_id: string
          merchant_receives: number
          payment_request_ids: string[]
          plan_id: string
        }[]
      }
      create_bookable_service: {
        Args: {
          p_buffer_minutes?: number
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_deposit_type?: Database["public"]["Enums"]["service_deposit_type"]
          p_deposit_value?: number
          p_description?: string
          p_display_on_storefront?: boolean
          p_duration_minutes?: number
          p_images?: string[]
          p_is_active?: boolean
          p_merchant_id: string
          p_name: string
          p_organization_id: string
          p_payment_mode?: Database["public"]["Enums"]["service_payment_mode"]
          p_price?: number
        }
        Returns: string
      }
      create_checkout_session: {
        Args: {
          p_allow_coupon_code?: boolean
          p_allow_quantity?: boolean
          p_amount: number
          p_cancel_url?: string
          p_created_by?: string
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_customer_address?: string
          p_customer_city?: string
          p_customer_country?: string
          p_customer_email?: string
          p_customer_id?: string
          p_customer_name?: string
          p_customer_phone?: string
          p_customer_postal_code?: string
          p_description?: string
          p_environment?: string
          p_expiration_minutes?: number
          p_idempotency_body_hash?: string
          p_idempotency_key?: string
          p_metadata?: Json
          p_organization_id: string
          p_payment_link_id?: string
          p_price_id?: string
          p_product_id?: string
          p_quantity?: number
          p_require_billing_address?: boolean
          p_require_email?: boolean
          p_require_name?: boolean
          p_require_phone?: boolean
          p_subscription_id?: string
          p_success_url?: string
          p_title?: string
        }
        Returns: Json
      }
      create_checkout_session_from_payment_link: {
        Args: {
          p_customer_address?: string
          p_customer_city?: string
          p_customer_country?: string
          p_customer_email?: string
          p_customer_id?: string
          p_customer_name?: string
          p_customer_phone?: string
          p_customer_postal_code?: string
          p_expiration_minutes?: number
          p_notify_customer?: boolean
          p_payment_link_id: string
          p_quantity?: number
        }
        Returns: Json
      }
      create_checkout_session_with_line_items: {
        Args: {
          p_allow_coupon_code?: boolean
          p_cancel_url?: string
          p_created_by: string
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_customer_address?: string
          p_customer_city?: string
          p_customer_country?: string
          p_customer_email?: string
          p_customer_id?: string
          p_customer_name?: string
          p_customer_phone?: string
          p_customer_postal_code?: string
          p_description?: string
          p_environment?: string
          p_expiration_minutes?: number
          p_idempotency_body_hash?: string
          p_idempotency_key?: string
          p_line_items: Json
          p_metadata?: Json
          p_organization_id: string
          p_payment_link_id?: string
          p_require_billing_address?: boolean
          p_require_email?: boolean
          p_require_name?: boolean
          p_require_phone?: boolean
          p_shipping_amount?: number
          p_success_url?: string
          p_tax_amount?: number
          p_title?: string
        }
        Returns: Json
      }
      create_cli_api_key: {
        Args: {
          p_api_key: string
          p_environment?: string
          p_key_name: string
          p_merchant_id: string
          p_organization_id: string
        }
        Returns: boolean
      }
      create_cli_device_request: {
        Args: {
          p_device_code: string
          p_expires_at: string
          p_interval: number
          p_user_code: string
        }
        Returns: undefined
      }
      create_customer: {
        Args: {
          p_address?: string
          p_city?: string
          p_country?: string
          p_email: string
          p_environment?: string
          p_is_business?: boolean
          p_merchant_id: string
          p_name: string
          p_organization_id: string
          p_phone_number?: string
          p_postal_code?: string
          p_whatsapp_number?: string
        }
        Returns: string
      }
      create_customer_invoice: {
        Args: {
          p_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_customer_details?: Json
          p_customer_id: string
          p_description?: string
          p_due_date: string
          p_invoice_number?: string
          p_line_items?: Json
          p_organization_id: string
          p_payment_details?: Json
          p_status?: Database["public"]["Enums"]["invoice_status"]
          p_template?: Json
        }
        Returns: {
          customer_invoice_id: string
          invoice_number: string
        }[]
      }
      create_customer_portal_launch_session: {
        Args: {
          p_customer_id: string
          p_environment?: string
          p_flow_after_completion_url?: string
          p_flow_subscription_id?: string
          p_flow_type?: string
          p_merchant_id: string
          p_organization_id: string
          p_return_url?: string
        }
        Returns: {
          launch_token: string
        }[]
      }
      create_discount_coupon: {
        Args: {
          p_code: string
          p_customer_type?: Database["public"]["Enums"]["customer_type"]
          p_description?: string
          p_discount_fixed_amount?: number
          p_discount_percentage?: number
          p_discount_type?: Database["public"]["Enums"]["discount_type"]
          p_environment?: string
          p_expires_at?: string
          p_is_active?: boolean
          p_max_quantity_per_use?: number
          p_max_uses?: number
          p_merchant_id?: string
          p_organization_id: string
          p_product_ids?: string[]
          p_scope_type?: string
          p_usage_frequency_limit?: Database["public"]["Enums"]["usage_frequency"]
          p_usage_limit_value?: number
          p_valid_from?: string
        }
        Returns: string
      }
      create_download_access_token: {
        Args: { p_entitlement_id: string; p_expires_minutes?: number }
        Returns: string
      }
      create_download_url: {
        Args: { p_entitlement_id: string; p_portal_session_token?: string }
        Returns: Json
      }
      create_entitlement: {
        Args: {
          p_description?: string
          p_feature_key: string
          p_name: string
          p_organization_id: string
        }
        Returns: string
      }
      create_export_job: {
        Args: {
          p_environment?: string
          p_filters?: Json
          p_job_type: string
          p_organization_id: string
        }
        Returns: string
      }
      create_feedback: {
        Args: { p_merchant_id: string; p_message: string; p_sentiment: string }
        Returns: string
      }
      create_gim_transaction: {
        Args: {
          p_amount: number
          p_amount_minor: number
          p_checkout_session_id?: string
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_customer_id: string
          p_date_time_local_trxn?: string
          p_description?: string
          p_environment?: string
          p_merchant_id: string
          p_merchant_reference: string
          p_metadata?: Json
          p_organization_id: string
          p_pan_masked: string
          p_product_id?: string
          p_quantity?: number
          p_subscription_id?: string
        }
        Returns: string
      }
      create_invoice_checkout_session: {
        Args: {
          p_created_by?: string
          p_expiration_minutes?: number
          p_invoice_id: string
        }
        Returns: Json
      }
      create_invoice_items_bulk: {
        Args: { p_invoice_id: string; p_items: Json; p_organization_id: string }
        Returns: undefined
      }
      create_invoice_receivable: {
        Args: {
          p_amount: number
          p_billing_period_end?: string
          p_billing_period_start?: string
          p_checkout_session_id?: string
          p_created_by?: string
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_customer_details?: Json
          p_customer_id: string
          p_description?: string
          p_due_date?: string
          p_environment?: string
          p_invoice_number?: string
          p_line_items?: Json
          p_metadata?: Json
          p_organization_id: string
          p_origin?: string
          p_payment_details?: Json
          p_price_id?: string
          p_product_id?: string
          p_source_key?: string
          p_status?: Database["public"]["Enums"]["invoice_status"]
          p_subscription_id?: string
          p_template?: Json
          p_transaction_id?: string
        }
        Returns: Json
      }
      create_invoice_template: {
        Args: {
          p_from_details?: Json
          p_is_default?: boolean
          p_name: string
          p_note_details?: Json
          p_organization_id: string
          p_payment_details?: Json
          p_template?: Json
        }
        Returns: {
          created_at: string | null
          from_details: Json | null
          is_default: boolean | null
          name: string
          note_details: Json | null
          organization_id: string
          payment_details: Json | null
          template: Json | null
          template_id: string
          updated_at: string | null
        }
        SetofOptions: {
          from: "*"
          to: "invoice_templates"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_job_application: {
        Args: {
          p_email: string
          p_github_url?: string
          p_job_id: string
          p_linkedin_url?: string
          p_name: string
          p_project_note?: string
          p_resume_url?: string
        }
        Returns: string
      }
      create_manual_refund_request: {
        Args: {
          p_processing_fee_percentage?: number
          p_reason?: string
          p_refund_amount: number
          p_subscription_action?: string
          p_transaction_id: string
        }
        Returns: Json
      }
      create_manual_refund_request_api: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_processing_fee_percentage?: number
          p_reason?: string
          p_refund_amount: number
          p_subscription_action?: string
          p_transaction_id: string
        }
        Returns: Json
      }
      create_mass_beneficiary_payout: {
        Args: {
          p_bypass_payout_pin?: boolean
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_merchant_id: string
          p_payout_data: Json
          p_payout_pin?: string
          p_payout_pin_session?: string
          p_provider_code: Database["public"]["Enums"]["provider_code"]
        }
        Returns: {
          message: string
          payout_id: string
          recipient_name: string
          recipient_phone: string
          status: Database["public"]["Enums"]["payout_status"]
        }[]
      }
      create_mass_beneficiary_payout_with_wave: {
        Args: {
          p_bypass_payout_pin?: boolean
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_merchant_id: string
          p_payout_data: Json
          p_payout_pin?: string
          p_payout_pin_session?: string
          p_provider_code: Database["public"]["Enums"]["provider_code"]
        }
        Returns: {
          message: string
          payout_id: string
          recipient_name: string
          recipient_phone: string
          status: Database["public"]["Enums"]["payout_status"]
          wave_payout_id: string
        }[]
      }
      create_mcp_device_request: {
        Args: {
          p_device_code: string
          p_expires_at: string
          p_interval: number
          p_user_code: string
        }
        Returns: undefined
      }
      create_meter: {
        Args: {
          p_aggregation?: Json
          p_filter?: Json
          p_name: string
          p_organization_id: string
          p_product_id?: string
        }
        Returns: string
      }
      create_mtn_refund_request: {
        Args: {
          p_processing_fee_percentage?: number
          p_reason?: string
          p_refund_amount: number
          p_subscription_action?: string
          p_transaction_id: string
        }
        Returns: Json
      }
      create_mtn_refund_request_api: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_processing_fee_percentage?: number
          p_reason?: string
          p_refund_amount: number
          p_subscription_action?: string
          p_transaction_id: string
        }
        Returns: Json
      }
      create_mtn_transaction: {
        Args: {
          p_amount: number
          p_checkout_session_id?: string
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_customer_id: string
          p_defer_test_settlement?: boolean
          p_description?: string
          p_environment?: string
          p_merchant_id: string
          p_metadata?: Json
          p_organization_id: string
          p_product_id?: string
          p_quantity?: number
          p_subscription_id?: string
        }
        Returns: {
          external_id: string
          transaction_id: string
        }[]
      }
      create_network_account: {
        Args: {
          p_created_by?: string
          p_display_name?: string
          p_metadata?: Json
          p_organization_id: string
        }
        Returns: {
          network_account_id: string
          organization_id: string
          public_account_id: string
          status: Database["public"]["Enums"]["network_account_status"]
        }[]
      }
      create_network_enrollment_session: {
        Args: {
          p_created_by: string
          p_expires_at?: string
          p_intended_email?: string
          p_metadata?: Json
          p_operator_organization_id: string
          p_requested_capabilities?: string[]
          p_terms_version?: string
        }
        Returns: {
          enrollment_session_id: string
          enrollment_token: string
        }[]
      }
      create_or_get_subscription_debt_invoice: {
        Args: { p_reason?: string; p_subscription_id: string }
        Returns: string
      }
      create_or_update_customer: {
        Args: {
          p_address: string
          p_city: string
          p_country: string
          p_custom_fields_metadata?: Json
          p_email: string
          p_environment?: string
          p_merchant_id: string
          p_name: string
          p_organization_id: string
          p_phone_number: string
          p_postal_code: string
          p_whatsapp_number: string
        }
        Returns: string
      }
      create_organization: {
        Args: {
          p_merchant_id: string
          p_name?: string
          p_role?: Database["public"]["Enums"]["member_role"]
        }
        Returns: {
          organization_id: string
          store_handle: string
        }[]
      }
      create_organization_webhook: {
        Args: {
          p_authorized_events: Database["public"]["Enums"]["webhook_event"][]
          p_environment?: string
          p_is_active?: boolean
          p_merchant_id: string
          p_metadata?: Json
          p_url: string
        }
        Returns: {
          authorized_events: Database["public"]["Enums"]["webhook_event"][]
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
        SetofOptions: {
          from: "*"
          to: "webhooks"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_payment_link: {
        Args: {
          p_allow_coupon_code?: boolean
          p_allow_quantity?: boolean
          p_cancel_url?: string
          p_created_by?: string
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_description?: string
          p_environment?: string
          p_expires_at?: string
          p_line_items?: Json
          p_link_type: Database["public"]["Enums"]["link_type"]
          p_metadata?: Json
          p_organization_id: string
          p_price?: number
          p_price_id?: string
          p_product_id?: string
          p_require_billing_address?: boolean
          p_require_email?: boolean
          p_require_name?: boolean
          p_require_phone?: boolean
          p_success_url?: string
          p_title: string
        }
        Returns: string
      }
      create_payment_request: {
        Args: {
          p_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_customer_id: string
          p_expiry_date: string
          p_organization_id: string
          p_spi_account_number: string
          p_spi_payeur_alias: string
          p_spi_payment_request_category: string
          p_spi_payment_status: string
          p_spi_tx_id: string
          p_status: string
        }
        Returns: {
          request_id: string
        }[]
      }
      create_payment_request_api: {
        Args: {
          p_amount: number
          p_created_by: string
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_customer_id: string
          p_description: string
          p_environment?: string
          p_expiry_date: string
          p_idempotency_body_hash?: string
          p_idempotency_key?: string
          p_metadata?: Json
          p_organization_id: string
          p_payment_reference: string
        }
        Returns: {
          amount: number
          created_at: string
          created_by: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          description: string
          environment: string
          expiry_date: string
          organization_id: string
          payment_link: string
          payment_reference: string
          request_id: string
          status: Database["public"]["Enums"]["transaction_status"]
          updated_at: string
        }[]
      }
      create_payout_method: {
        Args: {
          p_account_name: string
          p_account_number: string
          p_bank_code?: string
          p_bank_name: string
          p_branch_code?: string
          p_country: string
          p_is_default?: boolean
          p_is_spi_enabled?: boolean
          p_organization_id?: string
          p_payout_method_type?: string
          p_spi_account_number?: string
          p_spi_alias_mbno?: string
          p_spi_alias_shid?: string
          p_spi_alias_type?: string
        }
        Returns: string
      }
      create_payout_record: {
        Args: {
          p_account_id: string
          p_amount: number
          p_bypass_payout_pin?: boolean
          p_created_by: string
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_metadata?: Json
          p_organization_id: string
          p_payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          p_payout_method_id?: string
          p_payout_pin?: string
          p_payout_pin_session?: string
          p_provider_code: Database["public"]["Enums"]["provider_code"]
          p_status: Database["public"]["Enums"]["payout_status"]
        }
        Returns: string
      }
      create_pos_checkout_session: {
        Args: {
          p_amount?: number
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_expiration_minutes?: number
          p_metadata?: Json
          p_organization_id: string
          p_product_id?: string
          p_qr_code_type?: Database["public"]["Enums"]["qr_code_type"]
        }
        Returns: Json
      }
      create_preview_checkout_session: {
        Args: {
          p_organization_id: string
          p_price_id?: string
          p_product_id?: string
        }
        Returns: Json
      }
      create_price: {
        Args: {
          p_amount: number
          p_billing_interval?: Database["public"]["Enums"]["billing_interval"]
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_is_default?: boolean
          p_maximum_amount?: number
          p_merchant_id?: string
          p_metadata?: Json
          p_minimum_amount?: number
          p_organization_id: string
          p_pricing_model?: Database["public"]["Enums"]["pricing_model"]
          p_product_id: string
        }
        Returns: string
      }
      create_product: {
        Args: {
          p_charge_day?: number
          p_continue_selling_when_out_of_stock?: boolean
          p_description: string
          p_display_on_storefront?: boolean
          p_environment?: string
          p_failed_payment_action?: Database["public"]["Enums"]["failed_payment_action"]
          p_fee_type_ids?: string[]
          p_first_payment_type?: Database["public"]["Enums"]["first_payment_type"]
          p_fulfillment_type?: Database["public"]["Enums"]["product_fulfillment_type"]
          p_images?: string[]
          p_inventory_quantity?: number
          p_is_active?: boolean
          p_merchant_id: string
          p_metadata?: Json
          p_meter_code?: string
          p_name: string
          p_organization_id: string
          p_prices?: Json
          p_product_type?: Database["public"]["Enums"]["product_type"]
          p_sku?: string
          p_track_inventory?: boolean
          p_trial_enabled?: boolean
          p_trial_period_days?: number
          p_usage_aggregation?: Database["public"]["Enums"]["usage_aggregation"]
          p_usage_unit?: string
        }
        Returns: string
      }
      create_product_checkout: {
        Args: {
          p_allow_coupon_code?: boolean
          p_amount: number
          p_created_by?: string
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_description?: string
          p_display_on_storefront?: boolean
          p_environment?: string
          p_images?: string[]
          p_link_title?: string
          p_merchant_id: string
          p_name: string
          p_organization_id: string
        }
        Returns: Json
      }
      create_public_booking: {
        Args: {
          p_customer_email?: string
          p_customer_name: string
          p_customer_phone?: string
          p_notes?: string
          p_service_id: string
          p_starts_at: string
        }
        Returns: {
          booking_id: string
          currency_code: string
          deposit_amount: number
          payment_link_id: string
          status: Database["public"]["Enums"]["booking_status"]
        }[]
      }
      create_recurring_invoice_series: {
        Args: {
          p_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_customer_details?: Json
          p_customer_id: string
          p_description?: string
          p_due_date: string
          p_due_date_offset?: number
          p_end_count?: number
          p_end_date?: string
          p_end_type?: Database["public"]["Enums"]["invoice_recurrence_end_type"]
          p_environment?: string
          p_frequency?: Database["public"]["Enums"]["invoice_recurrence_frequency"]
          p_frequency_day?: number
          p_frequency_interval?: number
          p_frequency_week?: number
          p_from_details?: Json
          p_line_items?: Json
          p_next_scheduled_at?: string
          p_organization_id: string
          p_payment_details?: Json
          p_template?: Json
          p_timezone?: string
        }
        Returns: {
          customer_invoice_id: string
          invoice_number: string
          recurrence_rule_id: string
        }[]
      }
      create_refund: {
        Args: {
          p_amount: number
          p_created_by?: string
          p_metadata?: Json
          p_provider_code?: Database["public"]["Enums"]["provider_code"]
          p_provider_merchant_id?: string
          p_provider_transaction_id?: string
          p_reason?: string
          p_subscription_action?: string
          p_transaction_id: string
        }
        Returns: string
      }
      create_spi_account_alias: {
        Args: {
          p_account_number: string
          p_alias_key: string
          p_alias_type: Database["public"]["Enums"]["spi_alias_type"]
          p_organization_id: string
        }
        Returns: Json
      }
      create_spi_qr_code: {
        Args: {
          p_amount?: number
          p_categorie: string
          p_compte_paye: string
          p_currency_code?: string
          p_environment: string
          p_merchant_id: string
          p_metadata?: Json
          p_name: string
          p_organization_id: string
          p_product_id?: string
          p_qr_code_data: string
          p_qr_code_type: string
        }
        Returns: string
      }
      create_static_qr_code_for_product: {
        Args: {
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_metadata?: Json
          p_name: string
          p_organization_id: string
          p_product_id: string
        }
        Returns: Json
      }
      create_stripe_card_refund: {
        Args: {
          p_processing_fee_percentage?: number
          p_reason?: string
          p_refund_amount: number
          p_stripe_charge_id?: string
          p_stripe_refund_id?: string
          p_subscription_action?: string
          p_transaction_id: string
        }
        Returns: Json
      }
      create_stripe_card_refund_api: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_processing_fee_percentage?: number
          p_reason?: string
          p_refund_amount: number
          p_stripe_charge_id?: string
          p_stripe_refund_id?: string
          p_subscription_action?: string
          p_transaction_id: string
        }
        Returns: Json
      }
      create_stripe_checkout_transaction: {
        Args: {
          p_amount_xof: number
          p_checkout_session_id?: string
          p_customer_id: string
          p_description?: string
          p_environment?: string
          p_merchant_id: string
          p_metadata?: Json
          p_organization_id: string
          p_product_id?: string
          p_quantity?: number
          p_stripe_currency?: Database["public"]["Enums"]["currency_code"]
          p_stripe_payment_intent_id: string
          p_subscription_id?: string
        }
        Returns: string
      }
      create_stripe_transaction: {
        Args: {
          p_amount: number
          p_checkout_session_id?: string
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_customer_id: string
          p_description?: string
          p_environment?: string
          p_merchant_id: string
          p_metadata?: Json
          p_organization_id: string
          p_price_id?: string
          p_product_id?: string
          p_provider_transaction_id: string
          p_quantity?: number
          p_subscription_id?: string
        }
        Returns: string
      }
      create_subscription: {
        Args: {
          p_customer_id: string
          p_merchant_id: string
          p_organization_id: string
          p_price_id?: string
          p_product_id: string
          p_start_date: string
          p_status?: Database["public"]["Enums"]["subscription_status"]
        }
        Returns: string
      }
      create_subscription_checkout: {
        Args: {
          p_allow_coupon_code?: boolean
          p_amount: number
          p_billing_interval?: Database["public"]["Enums"]["billing_interval"]
          p_created_by?: string
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_description?: string
          p_environment?: string
          p_link_title?: string
          p_merchant_id: string
          p_name: string
          p_organization_id: string
        }
        Returns: Json
      }
      create_subscription_from_product: {
        Args: {
          p_customer_id: string
          p_merchant_id: string
          p_metadata?: Json
          p_organization_id: string
          p_price_id?: string
          p_product_id: string
        }
        Returns: string
      }
      create_support_request: {
        Args: {
          p_category: Database["public"]["Enums"]["support_category"]
          p_image_url?: string
          p_merchant_id: string
          p_message: string
          p_organization_id: string
          p_priority?: Database["public"]["Enums"]["support_priority"]
          p_subject?: string
        }
        Returns: string
      }
      create_team_invitation_notification: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_organization_name: string
          p_role: Database["public"]["Enums"]["member_role"]
        }
        Returns: undefined
      }
      create_transaction: {
        Args: {
          p_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_customer_id: string
          p_description?: string
          p_environment?: string
          p_is_pos?: boolean
          p_merchant_id: string
          p_metadata?: Json
          p_organization_id: string
          p_payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          p_price_id?: string
          p_product_id?: string
          p_provider_code: Database["public"]["Enums"]["provider_code"]
          p_quantity?: number
          p_subscription_id?: string
        }
        Returns: string
      }
      create_usage_period_invoice: {
        Args: { p_billing_period_id: string }
        Returns: string
      }
      create_usage_subscription: {
        Args: {
          p_customer_id: string
          p_environment?: string
          p_merchant_id: string
          p_metadata?: Json
          p_organization_id: string
          p_price_id?: string
          p_product_id: string
        }
        Returns: string
      }
      create_wave_checkout_transaction: {
        Args: {
          p_amount: number
          p_checkout_session_id?: string
          p_checkout_url: string
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_customer_id: string
          p_description?: string
          p_environment?: string
          p_error_url: string
          p_merchant_id: string
          p_metadata?: Json
          p_organization_id: string
          p_price_id?: string
          p_product_id?: string
          p_provider_checkout_id: string
          p_quantity?: number
          p_subscription_id?: string
          p_success_url: string
        }
        Returns: string
      }
      create_wave_payout_transaction: {
        Args: {
          p_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_description?: string
          p_destination_mobile?: string
          p_merchant_id: string
          p_metadata?: Json
          p_organization_id: string
          p_provider_checkout_id: string
        }
        Returns: string
      }
      create_wave_refund_request: {
        Args: {
          p_processing_fee_percentage?: number
          p_reason?: string
          p_refund_amount: number
          p_subscription_action?: string
          p_transaction_id: string
        }
        Returns: Json
      }
      create_wave_refund_request_api: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_processing_fee_percentage?: number
          p_reason?: string
          p_refund_amount: number
          p_subscription_action?: string
          p_transaction_id: string
        }
        Returns: Json
      }
      create_webhook: {
        Args: {
          p_authorized_events: Database["public"]["Enums"]["webhook_event"][]
          p_environment?: string
          p_merchant_id: string
          p_metadata?: Json
          p_organization_id: string
          p_url: string
        }
        Returns: string
      }
      create_whatsapp_commerce_checkout: {
        Args: {
          p_customer_phone?: string
          p_line_items: Json
          p_metadata_extra?: Json
          p_order_note?: string
          p_organization_id: string
          p_product_summary: string
          p_whatsapp_order_id: string
        }
        Returns: Json
      }
      credit_usage_wallet: {
        Args: {
          p_customer_id: string
          p_meter_id: string
          p_reason?: string
          p_units: number
        }
        Returns: Json
      }
      current_session_can_access_organization: {
        Args: { p_organization_id: string }
        Returns: boolean
      }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      customer_portal_attach_payment_method: {
        Args: {
          p_card_details?: Json
          p_session_token: string
          p_set_default?: boolean
          p_stripe_payment_method_id: string
        }
        Returns: Json
      }
      customer_portal_change_subscription_plan: {
        Args: {
          p_new_price_id: string
          p_session_token: string
          p_subscription_id: string
        }
        Returns: Json
      }
      customer_portal_cleanup_stale_rows: {
        Args: {
          p_challenge_older_than?: string
          p_launch_older_than?: string
          p_session_older_than?: string
        }
        Returns: {
          deleted_challenges: number
          deleted_launch_sessions: number
          deleted_sessions: number
        }[]
      }
      customer_portal_create_access_challenge: {
        Args: {
          p_channel: string
          p_customer_id: string
          p_destination_hash: string
          p_environment: string
          p_expires_at: string
          p_ip_hash?: string
          p_organization_id: string
          p_secret_hash: string
        }
        Returns: {
          challenge_id: string
        }[]
      }
      customer_portal_create_trusted_session: {
        Args: {
          p_customer_id: string
          p_environment: string
          p_organization_id: string
          p_source?: string
        }
        Returns: {
          portal_session_token: string
        }[]
      }
      customer_portal_customer_has_records: {
        Args: {
          p_customer_id: string
          p_environment?: string
          p_organization_id: string
        }
        Returns: boolean
      }
      customer_portal_detach_payment_method: {
        Args: { p_payment_method_id: string; p_session_token: string }
        Returns: Json
      }
      customer_portal_effective_policy: {
        Args: { p_organization_id: string }
        Returns: {
          allow_cancel: boolean
          allow_email_auth: boolean
          allow_email_change: boolean
          allow_invoice_edit: boolean
          allow_pause: boolean
          allow_payment_method_update: boolean
          allow_plan_change: boolean
          allow_resume: boolean
          allow_sms_auth: boolean
          allow_trusted_launch: boolean
          collect_cancellation_reason: boolean
          created_at: string
          organization_id: string
          portal_session_ttl_seconds: number
          return_url_allowlist: string[] | null
          show_metered_usage: boolean
          updated_at: string
          verification_max_attempts: number
        }
        SetofOptions: {
          from: "*"
          to: "organization_customer_portal_policies"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      customer_portal_get_subscription_detail: {
        Args: { p_session_token: string; p_subscription_id: string }
        Returns: {
          amount: number
          billing_interval: Database["public"]["Enums"]["billing_interval"]
          cancel_at_period_end: boolean
          currency_code: Database["public"]["Enums"]["currency_code"]
          end_date: string
          next_billing_date: string
          price_id: string
          product_id: string
          product_name: string
          scheduled_cancel_date: string
          subscription_id: string
          subscription_status: Database["public"]["Enums"]["subscription_status"]
        }[]
      }
      customer_portal_get_transaction_receipt: {
        Args: { p_session_token: string; p_transaction_id: string }
        Returns: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string
          gross_amount: number
          invoice_url: string
          payment_method_code: string
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_id: string
        }[]
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
      customer_portal_list_subscription_transactions: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_session_token: string
          p_subscription_id: string
        }
        Returns: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string
          gross_amount: number
          invoice_id: string
          invoice_number: string
          invoice_url: string
          status: Database["public"]["Enums"]["transaction_status"]
          total_count: number
          transaction_id: string
        }[]
      }
      customer_portal_list_subscriptions: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_session_token: string
          p_status?: string
        }
        Returns: {
          amount: number
          billing_interval: Database["public"]["Enums"]["billing_interval"]
          cancel_at_period_end: boolean
          currency_code: Database["public"]["Enums"]["currency_code"]
          end_date: string
          next_billing_date: string
          product_id: string
          product_name: string
          scheduled_cancel_date: string
          subscription_id: string
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          total_count: number
        }[]
      }
      customer_portal_list_transactions: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_session_token: string
          p_status?: string
        }
        Returns: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string
          gross_amount: number
          invoice_id: string
          invoice_number: string
          invoice_url: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          refunded_amount: number
          status: Database["public"]["Enums"]["transaction_status"]
          total_count: number
          transaction_id: string
        }[]
      }
      customer_portal_logout: {
        Args: { p_session_token: string }
        Returns: undefined
      }
      customer_portal_manage_subscription: {
        Args: {
          p_action: string
          p_cancellation_reason?: string
          p_session_token: string
          p_subscription_id: string
        }
        Returns: Json
      }
      customer_portal_rate_limit_allow: {
        Args: {
          p_bucket_key: string
          p_limit: number
          p_window_seconds: number
        }
        Returns: boolean
      }
      customer_portal_request_email_change: {
        Args: { p_new_email: string; p_session_token: string }
        Returns: Json
      }
      customer_portal_resolve_contact_status: {
        Args: {
          p_channel: string
          p_destination: string
          p_environment: string
          p_locked_customer_id?: string
          p_organization_id: string
        }
        Returns: Json
      }
      customer_portal_resolve_customer_for_contact: {
        Args: {
          p_channel: string
          p_destination: string
          p_environment: string
          p_locked_customer_id?: string
          p_organization_id: string
        }
        Returns: {
          customer_id: string
        }[]
      }
      customer_portal_resolve_stripe_context: {
        Args: { p_session_token: string }
        Returns: {
          customer_email: string
          customer_id: string
          customer_name: string
          environment: string
          organization_id: string
          provider_customer_id: string
        }[]
      }
      customer_portal_return_url_allowed: {
        Args: { p_organization_id: string; p_return_url: string }
        Returns: boolean
      }
      customer_portal_session_context: {
        Args: { p_session_token: string }
        Returns: {
          allow_cancel: boolean
          allow_email_auth: boolean
          allow_pause: boolean
          allow_resume: boolean
          allow_sms_auth: boolean
          customer_name: string
          org_name: string
          org_slug: string
        }[]
      }
      customer_portal_set_default_payment_method: {
        Args: { p_payment_method_id: string; p_session_token: string }
        Returns: Json
      }
      customer_portal_sync_subscription_payment_methods: {
        Args: { p_customer_id: string }
        Returns: undefined
      }
      customer_portal_token_hash: { Args: { p_token: string }; Returns: string }
      customer_portal_touch_session: {
        Args: { p_token: string }
        Returns: undefined
      }
      customer_portal_update_billing_profile: {
        Args: {
          p_billing_address?: Json
          p_company_name?: string
          p_session_token: string
          p_vat_number?: string
        }
        Returns: Json
      }
      customer_portal_validate_customer_access: {
        Args: {
          p_customer_id: string
          p_environment?: string
          p_organization_id: string
        }
        Returns: boolean
      }
      customer_portal_validate_retry_payment: {
        Args: { p_session_token: string; p_subscription_id: string }
        Returns: {
          customer_id: string
          environment: string
          next_billing_date: string
          organization_id: string
          price_amount: number
          price_currency_code: string
          provider_customer_id: string
          provider_payment_method_id: string
          status: Database["public"]["Enums"]["subscription_status"]
          subscription_id: string
        }[]
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
      customer_portal_verify_access_challenge: {
        Args: {
          p_challenge_id: string
          p_plain_secret: string
          p_session_ttl_seconds?: number
        }
        Returns: {
          portal_session_token: string
        }[]
      }
      customer_portal_write_audit: {
        Args: {
          p_customer_id: string
          p_event_type: string
          p_metadata?: Json
          p_organization_id: string
        }
        Returns: undefined
      }
      deactivate_organization_role: {
        Args: { p_role_id: string }
        Returns: boolean
      }
      debug_free_webhook: { Args: { p_transaction_id: string }; Returns: Json }
      debug_subscription_webhook: {
        Args: {
          p_event_type?: Database["public"]["Enums"]["webhook_event"]
          p_subscription_id: string
        }
        Returns: Json
      }
      delete_agent_event_subscription: {
        Args: { p_organization_id: string; p_subscription_id: string }
        Returns: boolean
      }
      delete_all_archived_notifications: {
        Args: { p_merchant_id: string }
        Returns: undefined
      }
      delete_api_key: {
        Args: { p_api_key: string; p_merchant_id?: string }
        Returns: undefined
      }
      delete_assistant_conversation: {
        Args: { p_conversation_id: string; p_merchant_id: string }
        Returns: boolean
      }
      delete_customer: {
        Args: { p_acting_merchant_id?: string; p_customer_id: string }
        Returns: undefined
      }
      delete_discount_coupon: {
        Args: { p_coupon_id: string }
        Returns: boolean
      }
      delete_merchant_cascade: {
        Args: { p_merchant_id: string }
        Returns: boolean
      }
      delete_notification: {
        Args: { p_notification_id: string }
        Returns: undefined
      }
      delete_organization_cascade: {
        Args: { p_organization_id: string }
        Returns: boolean
      }
      delete_organization_domain: {
        Args: { p_domain_id: string; p_organization_id: string }
        Returns: boolean
      }
      delete_organization_fee_type: {
        Args: {
          p_acting_merchant_id?: string
          p_fee_type_id: string
          p_organization_id: string
        }
        Returns: boolean
      }
      delete_organization_webhook: {
        Args: { p_merchant_id: string; p_webhook_id: string }
        Returns: undefined
      }
      delete_payout_method: {
        Args: { p_payout_method_id: string }
        Returns: undefined
      }
      delete_product: {
        Args: { p_merchant_id?: string; p_product_id: string }
        Returns: undefined
      }
      delete_product_file: {
        Args: { p_file_id: string; p_organization_id: string }
        Returns: boolean
      }
      delete_product_service: {
        Args: { p_merchant_id: string; p_product_id: string }
        Returns: undefined
      }
      delete_qr_code: { Args: { p_qr_code_id: string }; Returns: boolean }
      delete_shopify_session: { Args: { p_id: string }; Returns: boolean }
      delete_shopify_sessions: { Args: { p_ids: string[] }; Returns: boolean }
      delete_spi_qr_code: { Args: { p_qr_code_id: string }; Returns: undefined }
      delete_storage_object: {
        Args: { bucket: string; object: string }
        Returns: Record<string, unknown>
      }
      delete_webhook: {
        Args: { p_merchant_id: string; p_webhook_id: string }
        Returns: boolean
      }
      detect_product_or_price_id: { Args: { p_id: string }; Returns: string }
      disable_rate_limit_policy: {
        Args: { p_policy_id: string }
        Returns: boolean
      }
      disconnect_all_providers: {
        Args: { p_organization_id: string }
        Returns: undefined
      }
      disconnect_whatsapp_business_connection: {
        Args: { p_organization_id: string }
        Returns: Json
      }
      dispatch_notification: {
        Args: { p_channel: string; p_idempotency_key?: string; p_payload: Json }
        Returns: string
      }
      duplicate_customer_invoice: {
        Args: {
          p_invoice_id: string
          p_merchant_id?: string
          p_organization_id: string
        }
        Returns: Json
      }
      edge_function_url: { Args: { p_function_name: string }; Returns: string }
      edge_functions_base_url: { Args: never; Returns: string }
      edge_internal_http_headers_array: { Args: never; Returns: unknown[] }
      edge_internal_http_headers_jsonb: { Args: never; Returns: Json }
      enqueue_merchant_payment_webhook_delivery: {
        Args: { p_environment: string; p_transaction_id: string }
        Returns: undefined
      }
      enqueue_merchant_subscription_webhook: {
        Args: {
          p_context?: Json
          p_event: Database["public"]["Enums"]["webhook_event"]
          p_idempotency_key: string
          p_previous_attributes?: Json
          p_subscription_id: string
          p_transaction_id?: string
        }
        Returns: undefined
      }
      enqueue_merchant_webhook_outbox: {
        Args: {
          p_environment?: string
          p_event: Database["public"]["Enums"]["webhook_event"]
          p_idempotency_key: string
          p_organization_id: string
          p_payload: Json
        }
        Returns: string
      }
      enqueue_network_webhook_event: {
        Args: {
          p_event: Database["public"]["Enums"]["webhook_event"]
          p_idempotency_key: string
          p_operator_organization_id: string
          p_payload: Json
        }
        Returns: string
      }
      enqueue_purchase_fulfilled_webhook: {
        Args: { p_transaction_id: string }
        Returns: undefined
      }
      enqueue_radar_risk_webhook: {
        Args: {
          p_assessment_id: string
          p_environment?: string
          p_event: Database["public"]["Enums"]["webhook_event"]
          p_organization_id: string
        }
        Returns: undefined
      }
      enqueue_usage_event: {
        Args: {
          p_code: string
          p_created_by?: string
          p_customer_id: string
          p_environment?: string
          p_organization_id: string
          p_properties?: Json
          p_quantity?: number
          p_subscription_id?: string
          p_timestamp?: string
          p_transaction_id: string
        }
        Returns: string
      }
      ensure_bnpl_configuration: {
        Args: { p_organization_id: string }
        Returns: undefined
      }
      ensure_default_abandoned_cart_workflow: {
        Args: { p_organization_id: string }
        Returns: undefined
      }
      ensure_invoice_access_token: {
        Args: { p_invoice_id: string }
        Returns: string
      }
      ensure_merchant_account: {
        Args: {
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_merchant_id: string
          p_organization_id: string
        }
        Returns: string
      }
      ensure_merchant_for_invitation: {
        Args: { p_email: string; p_full_name?: string; p_merchant_id: string }
        Returns: undefined
      }
      ensure_organization_publishable_keys: {
        Args: { p_organization_id?: string }
        Returns: {
          live_key_created: boolean
          organization_id: string
          organization_name: string
          test_key_created: boolean
          total_keys_created: number
        }[]
      }
      ensure_organization_rbac_seed: {
        Args: { p_organization_id: string }
        Returns: undefined
      }
      ensure_organization_test_secret_keys: {
        Args: { p_organization_id?: string }
        Returns: {
          organization_id: string
          organization_name: string
          test_secret_key_created: boolean
        }[]
      }
      ensure_radar_meter_for_organization: {
        Args: { p_organization_id: string; p_product_id?: string }
        Returns: string
      }
      ensure_subscription_for_completed_transaction: {
        Args: { p_transaction_id: string }
        Returns: string
      }
      evaluate_fraud_for_payout: {
        Args: {
          p_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_merchant_id?: string
          p_metadata?: Json
          p_organization_id: string
        }
        Returns: Json
      }
      evaluate_radar_for_charge: {
        Args: {
          p_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_customer_id: string
          p_environment?: string
          p_metadata?: Json
          p_organization_id: string
          p_rail: string
          p_transaction_id?: string
        }
        Returns: Json
      }
      execute_merge_all_duplicates: { Args: never; Returns: string }
      execute_merge_all_duplicates_by_phone: { Args: never; Returns: string }
      expire_abandoned_gim_payments: {
        Args: { p_expiry_hours?: number }
        Returns: number
      }
      expire_pending_transactions_with_custom_status: {
        Args: {
          expiry_hours?: number
          new_status?: Database["public"]["Enums"]["transaction_status"]
        }
        Returns: number
      }
      expire_stale_checkout_sessions: {
        Args: { p_limit?: number }
        Returns: number
      }
      expire_stale_pending_bookings: { Args: never; Returns: number }
      expire_stale_subscription_renewal_sessions: {
        Args: { p_subscription_id: string }
        Returns: number
      }
      export_customers_by_criteria: {
        Args: {
          p_end_date?: string
          p_environment?: string
          p_export_type?: string
          p_merchant_id: string
          p_product_ids?: string[]
          p_start_date?: string
        }
        Returns: {
          customer_address: string
          customer_city: string
          customer_country: string
          customer_email: string
          customer_id: string
          customer_is_business: boolean
          customer_name: string
          customer_phone_number: string
          customer_postal_code: string
          item_name: string
          quantity: number
          transaction_amount: number
          transaction_currency: Database["public"]["Enums"]["currency_code"]
          transaction_date: string
          transaction_id: string
          transaction_status: Database["public"]["Enums"]["transaction_status"]
        }[]
      }
      fail_spi_payout: {
        Args: { p_error?: string; p_payout_id: string; p_spi_tx_id?: string }
        Returns: undefined
      }
      fallback_subscription_renewal_to_manual_checkout: {
        Args: { p_subscription_id: string }
        Returns: string
      }
      fetch_account_balance: {
        Args: {
          p_currency_code?: string
          p_merchant_id: string
          p_organization_id: string
        }
        Returns: {
          balance: number
          currency_code: string
          last_updated: string
        }[]
      }
      fetch_active_subscriptions_custom_range: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_merchant_id: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: {
          active_subscriptions: number
          date: string
        }[]
      }
      fetch_active_webhooks_for_organization: {
        Args: {
          p_environment?: string
          p_event: Database["public"]["Enums"]["webhook_event"]
          p_organization_id: string
        }
        Returns: {
          authorized_events: Database["public"]["Enums"]["webhook_event"][]
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
      fetch_admin_network_operators: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          active_members: number
          approved_at: string
          created_at: string
          gross_amount: number
          operator_fee_amount: number
          operator_profile_id: string
          organization_email: string
          organization_id: string
          organization_name: string
          pending_enrollments: number
          risk_tier: string
          status: Database["public"]["Enums"]["network_operator_status"]
          total_transactions: number
        }[]
      }
      fetch_admin_network_overview: {
        Args: {
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          active_memberships: number
          active_operators: number
          gross_amount: number
          operator_fee_amount: number
          pending_enrollments: number
          pending_operator_fee_amount: number
          total_member_accounts: number
          total_network_transactions: number
          total_operators: number
        }[]
      }
      fetch_admin_network_timeseries: {
        Args: {
          p_end_date: string
          p_start_date: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          bucket_date: string
          gross_amount: number
          new_memberships: number
          operator_fee_amount: number
          transaction_count: number
        }[]
      }
      fetch_aov_metrics_custom_range: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_merchant_id: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: {
          date: string
          order_count: number
          total_amount: number
        }[]
      }
      fetch_api_interactions: {
        Args: {
          p_end_date?: string
          p_environment?: string
          p_limit?: number
          p_offset?: number
          p_organization_id: string
          p_search_term?: string
          p_start_date?: string
          p_status_codes: string[]
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
          request_method: string
          request_payload: Json
          response_payload: Json
          response_status: number
          response_time: number
          target_organization_id: string
          total_count: number
        }[]
      }
      fetch_api_keys: {
        Args: { p_organization_id: string }
        Returns: {
          api_key: string
          created_at: string
          is_active: boolean
          key_type: string
          name: string
        }[]
      }
      fetch_assistant_tool_audit: {
        Args: { p_limit?: number; p_organization_id: string }
        Returns: {
          approval_source: string
          audit_id: string
          created_at: string
          merchant_id: string
          merchant_name: string
          result_summary: string
          success: boolean
          tool_id: string
        }[]
      }
      fetch_average_customer_lifetime_value: {
        Args: {
          p_currency?: Database["public"]["Enums"]["currency_code"][]
          p_end_date?: string
          p_environment?: string
          p_is_pos?: boolean
          p_organization_id: string
          p_start_date?: string
          p_status?: Database["public"]["Enums"]["transaction_status"][]
          p_type?: Database["public"]["Enums"]["transaction_type"][]
        }
        Returns: number
      }
      fetch_average_retention_rate: {
        Args: {
          p_currency?: Database["public"]["Enums"]["currency_code"][]
          p_end_date?: string
          p_environment?: string
          p_is_pos?: boolean
          p_organization_id: string
          p_start_date?: string
          p_status?: Database["public"]["Enums"]["transaction_status"][]
          p_type?: Database["public"]["Enums"]["transaction_type"][]
        }
        Returns: number
      }
      fetch_average_transaction_value: {
        Args: {
          p_currency?: Database["public"]["Enums"]["currency_code"][]
          p_end_date?: string
          p_environment?: string
          p_is_pos?: boolean
          p_organization_id: string
          p_start_date?: string
          p_status?: Database["public"]["Enums"]["transaction_status"][]
          p_type?: Database["public"]["Enums"]["transaction_type"][]
        }
        Returns: number
      }
      fetch_balance_breakdown: {
        Args: {
          p_merchant_id: string
          p_organization_id?: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          available_balance: number
          converted_available_balance: number
          converted_pending_balance: number
          converted_total_balance: number
          converted_unavailable_balance: number
          currency_code: Database["public"]["Enums"]["currency_code"]
          pending_balance: number
          target_currency: Database["public"]["Enums"]["currency_code"]
          total_balance: number
          unavailable_balance: number
        }[]
      }
      fetch_beneficiary_payouts: {
        Args: {
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_end_date?: string
          p_merchant_id: string
          p_organization_id?: string
          p_page_number?: number
          p_page_size?: number
          p_start_date?: string
          p_statuses?: string[]
        }
        Returns: {
          account_id: string
          amount: number
          created_at: string
          created_by: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          metadata: Json
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          payout_id: string
          payout_method_id: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          status: Database["public"]["Enums"]["payout_status"]
          updated_at: string
        }[]
      }
      fetch_beneficiary_payouts_by_bulk_instruction: {
        Args: { p_organization_id: string; p_spi_bulk_instruction_id: string }
        Returns: {
          account_id: string
          amount: number
          created_at: string
          created_by: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          metadata: Json
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          payout_id: string
          payout_method_id: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          spi_bulk_instruction_id: string
          status: Database["public"]["Enums"]["payout_status"]
          updated_at: string
        }[]
      }
      fetch_billing_statements: {
        Args: { p_merchant_id: string }
        Returns: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string
          metadata: Json
          monthly_fees: number
          organization_id: string
          outstanding_balance: number
          platform_invoice_id: string
          status: Database["public"]["Enums"]["invoice_status"]
          total_amount: number
        }[]
      }
      fetch_bookable_services: {
        Args: { p_organization_id: string }
        Returns: {
          buffer_minutes: number
          created_at: string
          currency_code: string
          deposit_type: Database["public"]["Enums"]["service_deposit_type"]
          deposit_value: number
          description: string
          display_on_storefront: boolean
          duration_minutes: number
          images: string[]
          is_active: boolean
          name: string
          organization_id: string
          payment_mode: Database["public"]["Enums"]["service_payment_mode"]
          price: number
          service_id: string
          updated_at: string
        }[]
      }
      fetch_checkout_processing_fee_rates: {
        Args: {
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_organization_id: string
        }
        Returns: {
          fixed_amount: number
          micro_threshold: number
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          percentage: number
          provider_code: Database["public"]["Enums"]["provider_code"]
        }[]
      }
      fetch_combined_revenue_metrics: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: Json
      }
      fetch_completion_rate: {
        Args: {
          p_currency?: Database["public"]["Enums"]["currency_code"][]
          p_end_date?: string
          p_environment?: string
          p_is_pos?: boolean
          p_organization_id: string
          p_start_date?: string
          p_status?: Database["public"]["Enums"]["transaction_status"][]
          p_type?: Database["public"]["Enums"]["transaction_type"][]
        }
        Returns: {
          completed: number
          failed: number
          refunded: number
        }[]
      }
      fetch_connected_provider_settings: {
        Args: { p_organization_id: string }
        Returns: {
          created_at: string
          is_connected: boolean
          is_phone_verified: boolean
          metadata: Json | null
          onboarding_status:
            | Database["public"]["Enums"]["onboarding_status"]
            | null
          organization_id: string
          phone_number: string | null
          provider_business_type:
            | Database["public"]["Enums"]["provider_business_type"]
            | null
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_merchant_id: string | null
          updated_at: string
          withdrawal_limit_max: number | null
          withdrawal_limit_min: number | null
          withdrawal_limit_monthly: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "organization_providers_settings"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      fetch_currency_conversion_history: {
        Args: {
          p_conversion_type?: string
          p_created_by: string
          p_from_date?: string
          p_to_date?: string
        }
        Returns: {
          conversion_rate: number
          conversion_type: Database["public"]["Enums"]["conversion_type"]
          converted_amount: number
          created_at: string
          created_by: string | null
          from_currency: Database["public"]["Enums"]["currency_code"]
          id: string
          organization_id: string
          original_amount: number
          payout_id: string | null
          refund_id: string | null
          to_currency: Database["public"]["Enums"]["currency_code"]
          transaction_id: string | null
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "currency_conversion_history"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      fetch_customer: {
        Args: { p_customer_id: string }
        Returns: {
          address: string
          city: string
          country: string
          customer_id: string
          email: string
          is_business: boolean
          name: string
          phone_number: string
          postal_code: string
          whatsapp_number: string
        }[]
      }
      fetch_customer_activity: {
        Args: {
          p_customer_id: string
          p_limit?: number
          p_organization_id: string
        }
        Returns: {
          activity_id: string
          actor_merchant_id: string
          created_at: string
          event_name: string
          payload: Json
          severity: string
          source: string
          title: string
        }[]
      }
      fetch_customer_api: {
        Args: { p_customer_id: string }
        Returns: {
          address: string
          city: string
          country: string
          created_at: string
          customer_id: string
          email: string
          is_business: boolean
          name: string
          phone_number: string
          postal_code: string
          updated_at: string
          whatsapp_number: string
        }[]
      }
      fetch_customer_subscriptions: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_organization_id: string
          p_status?: Database["public"]["Enums"]["subscription_status"]
        }
        Returns: {
          amount: number
          billing_interval: Database["public"]["Enums"]["billing_interval"]
          cancel_at_period_end: boolean
          cancelled_at: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          current_period_end: string
          current_period_start: string
          customer_email: string
          customer_name: string
          next_billing_date: string
          product_name: string
          product_type: Database["public"]["Enums"]["product_type"]
          status: Database["public"]["Enums"]["subscription_status"]
          subscription_id: string
          total_count: number
          usage_unit: string
        }[]
      }
      fetch_customer_subscriptions_detail: {
        Args: { p_customer_id: string; p_organization_id: string }
        Returns: {
          amount: number
          billing_interval: Database["public"]["Enums"]["billing_interval"]
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_email: string
          customer_id: string
          customer_name: string
          end_date: string
          environment: string
          metadata: Json
          next_billing_date: string
          organization_id: string
          price_id: string
          product_id: string
          product_name: string
          product_type: Database["public"]["Enums"]["product_type"]
          start_date: string
          status: Database["public"]["Enums"]["subscription_status"]
          subscription_id: string
          updated_at: string
          usage_unit: string
        }[]
      }
      fetch_customer_transactions: {
        Args: { p_customer_id: string; p_environment?: string }
        Returns: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string
          gross_amount: number
          gross_amount_xof: number
          metadata: Json
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          product_id: string
          product_name: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          refunded_amount: number
          refunded_amount_xof: number
          status: string
          subscription_id: string
          transaction_id: string
        }[]
      }
      fetch_customers: {
        Args: {
          p_customer_type?: string
          p_environment?: string
          p_limit?: number
          p_merchant_id: string
          p_offset?: number
          p_organization_id?: string
          p_search_term?: string
          p_segment?: string
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
          spend_currency: Database["public"]["Enums"]["currency_code"]
          total_count: number
          total_spend: number
          updated_at: string
          whatsapp_number: string
        }[]
      }
      fetch_customers_api: {
        Args: {
          p_customer_type?: string
          p_environment?: string
          p_merchant_id: string
          p_page?: number
          p_page_size?: number
          p_search_term?: string
        }
        Returns: {
          address: string
          city: string
          country: string
          created_at: string
          customer_id: string
          email: string
          is_business: boolean
          name: string
          phone_number: string
          postal_code: string
          updated_at: string
          whatsapp_number: string
        }[]
      }
      fetch_customers_with_status: {
        Args: {
          p_activity_status?: string
          p_customer_type?: string
          p_environment?: string
          p_limit?: number
          p_merchant_id: string
          p_offset?: number
          p_organization_id?: string
          p_search_term?: string
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
      fetch_daily_sales_grid_data: {
        Args: {
          p_days?: number
          p_environment?: string
          p_organization_id: string
        }
        Returns: {
          date: string
          reporting_currency: Database["public"]["Enums"]["currency_code"]
          sales_count: number
          total_revenue: number
        }[]
      }
      fetch_data_for_checkout: {
        Args: { p_link_id: string }
        Returns: {
          allow_coupon_code: boolean
          allow_quantity: boolean
          amount: number
          cancel_url: string
          connected_providers: Database["public"]["Enums"]["provider_code"][]
          continue_selling_when_out_of_stock: boolean
          created_by: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string
          environment: string
          inventory_quantity: number
          line_items: Json
          link_id: string
          maximum_amount: number
          metadata: Json
          minimum_amount: number
          organization_default_cancel_url: string
          organization_default_success_url: string
          organization_id: string
          organization_logo_url: string
          organization_name: string
          plan_amount: number
          plan_billing_frequency: Database["public"]["Enums"]["billing_interval"]
          plan_description: string
          plan_images: string[]
          plan_name: string
          price_id: string
          price_locked_mode: boolean
          pricing_model: Database["public"]["Enums"]["pricing_model"]
          product_description: string
          product_id: string
          product_images: string[]
          product_name: string
          product_price: number
          quantity: number
          require_billing_address: boolean
          require_email: boolean
          require_name: boolean
          require_phone: boolean
          success_url: string
          title: string
          track_inventory: boolean
          url: string
        }[]
      }
      fetch_developer_ids: {
        Args: { p_user_id: string }
        Returns: {
          merchant_id: string
          organization_id: string
        }[]
      }
      fetch_disputes: {
        Args: {
          p_end_date?: string
          p_organization_id: string
          p_page?: number
          p_page_size?: number
          p_start_date?: string
          p_status?: Database["public"]["Enums"]["dispute_status"]
        }
        Returns: {
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_email: string
          customer_id: string
          customer_name: string
          dispute_id: string
          fee_amount: number
          reason: string
          resolution_date: string
          resolution_details: string
          status: Database["public"]["Enums"]["dispute_status"]
          stripe_charge_id: string
          stripe_dispute_id: string
          transaction_id: string
          updated_at: string
        }[]
      }
      fetch_docs_test_secret_key: {
        Args: { p_organization_id?: string }
        Returns: {
          api_key: string
          organization_id: string
        }[]
      }
      fetch_failed_transactions: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_limit?: number
          p_merchant_id: string
          p_organization_id: string
          p_provider_code?: string
          p_start_date: string
        }
        Returns: {
          amount: number
          created_at: string
          currency_code: string
          customer_name: string
          error_message: string
          payment_method_code: string
          provider_code: string
          transaction_id: string
        }[]
      }
      fetch_fee_amount: {
        Args: {
          p_currency?: Database["public"]["Enums"]["currency_code"][]
          p_end_date?: string
          p_environment?: string
          p_is_pos?: boolean
          p_organization_id: string
          p_start_date?: string
          p_status?: Database["public"]["Enums"]["transaction_status"][]
          p_type?: Database["public"]["Enums"]["transaction_type"][]
        }
        Returns: number
      }
      fetch_fraud_alerts: {
        Args: {
          p_organization_id: string
          p_page?: number
          p_page_size?: number
          p_status?: Database["public"]["Enums"]["fraud_alert_status"]
        }
        Returns: {
          alert_id: string
          created_at: string
          metadata: Json
          organization_id: string
          payout_id: string
          rule_id: string
          rule_name: string
          status: Database["public"]["Enums"]["fraud_alert_status"]
          transaction_id: string
          triggering_value: string
        }[]
      }
      fetch_fraud_rules_for_org: {
        Args: { p_organization_id: string }
        Returns: {
          custom_action: Database["public"]["Enums"]["fraud_action"]
          custom_threshold: number
          default_action: Database["public"]["Enums"]["fraud_action"]
          default_threshold: number
          default_time_window_seconds: number
          description: string
          is_enabled: boolean
          rule_id: string
          rule_name: string
          type: Database["public"]["Enums"]["fraud_rule_type"]
        }[]
      }
      fetch_gross_amount: {
        Args: {
          p_currency?: Database["public"]["Enums"]["currency_code"][]
          p_end_date?: string
          p_environment?: string
          p_is_pos?: boolean
          p_organization_id: string
          p_start_date?: string
          p_status?: Database["public"]["Enums"]["transaction_status"][]
          p_type?: Database["public"]["Enums"]["transaction_type"][]
        }
        Returns: number
      }
      fetch_invoice_activity_events: {
        Args: { p_invoice_id: string }
        Returns: {
          created_at: string
          created_by: string
          customer_id: string
          event_data: Json
          event_id: string
          event_name: string
          merchant_avatar_url: string
          merchant_name: string
          metadata: Json
          organization_id: string
          product_id: string
        }[]
      }
      fetch_latest_conversion_rates: {
        Args: {
          p_from_currency?: Database["public"]["Enums"]["currency_code"]
          p_to_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          created_at: string
          from_currency: Database["public"]["Enums"]["currency_code"]
          inverse_rate: number
          rate: number
          to_currency: Database["public"]["Enums"]["currency_code"]
        }[]
      }
      fetch_logs: {
        Args: {
          p_end_date?: string
          p_event?: Database["public"]["Enums"]["event_type"]
          p_events?: Database["public"]["Enums"]["event_type"][]
          p_exclude_delivery_noise?: boolean
          p_limit?: number
          p_merchant_id: string
          p_offset?: number
          p_severities?: string[]
          p_severity?: string
          p_start_date?: string
        }
        Returns: {
          browser: string
          created_at: string
          details: Json
          event: Database["public"]["Enums"]["event_type"]
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
      fetch_ltv_by_acquisition_cohort: {
        Args: {
          p_end_date: string
          p_ltv_duration_days?: number
          p_merchant_id: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: {
          acquisition_month: string
          average_ltv: number
        }[]
      }
      fetch_member_connected_operators: {
        Args: { p_member_organization_id: string }
        Returns: {
          accepted_at: string
          activated_at: string
          granted_capabilities: string[]
          latest_consent_at: string
          network_account_id: string
          network_membership_id: string
          operator_logo_url: string
          operator_name: string
          operator_organization_id: string
          public_account_id: string
          status: Database["public"]["Enums"]["network_membership_status"]
          terms_version: string
        }[]
      }
      fetch_merchant_details: {
        Args: { p_user_id: string }
        Returns: {
          avatar_url: string
          email: string
          merchant_id: string
          name: string
          onboarded: boolean
          phone_number: string
          preferred_language: string
        }[]
      }
      fetch_merchant_org_permissions: {
        Args: { p_merchant_id: string; p_organization_id: string }
        Returns: string[]
      }
      fetch_merchant_organizations: {
        Args: { p_merchant_id: string }
        Returns: {
          allow_staff_impersonation: boolean
          is_current: boolean
          merchant_role: string
          organization_id: string
          organization_logo_url: string
          organization_name: string
          public_id: string
        }[]
      }
      fetch_merchant_preferences: { Args: never; Returns: Json }
      fetch_merchants_with_auto_withdrawal: {
        Args: { p_current_day: number }
        Returns: {
          account_name: string
          account_number: string
          auto_withdrawal_day: number
          auto_withdrawal_method: string
          bank_name: string
          merchant_id: string
          organization_id: string
          payout_method_id: string
        }[]
      }
      fetch_meters_dashboard: {
        Args: {
          p_is_active?: boolean
          p_merchant_id: string
          p_organization_id: string
          p_product_id?: string
        }
        Returns: {
          aggregation: Json
          created_at: string
          filter: Json
          is_active: boolean
          meter_id: string
          name: string
          organization_id: string
          product_id: string
          product_name: string
          updated_at: string
        }[]
      }
      fetch_mrr_metrics_custom_range: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_merchant_id: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: {
          date: string
          mrr: number
          reporting_currency: Database["public"]["Enums"]["currency_code"]
        }[]
      }
      fetch_network_customer_transactions_for_api: {
        Args: {
          p_customer_id: string
          p_environment?: string
          p_network_membership_id: string
        }
        Returns: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string
          gross_amount: number
          metadata: Json
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          provider_code: Database["public"]["Enums"]["provider_code"]
          refunded_amount: number
          status: string
          transaction_id: string
        }[]
      }
      fetch_network_customers: {
        Args: {
          p_environment?: string
          p_member_organization_id?: string
          p_operator_organization_id: string
          p_page?: number
          p_page_size?: number
          p_search_term?: string
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
          p_activity_status?: string
          p_customer_type?: string
          p_environment?: string
          p_limit?: number
          p_network_membership_id: string
          p_offset?: number
          p_search_term?: string
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
      fetch_network_enrollment_session: {
        Args: { p_enrollment_token: string }
        Returns: {
          completed_at: string
          enrollment_session_id: string
          enrollment_token: string
          expires_at: string
          intended_email: string
          metadata: Json
          operator_logo_url: string
          operator_name: string
          operator_organization_id: string
          requested_capabilities: string[]
          status: Database["public"]["Enums"]["network_enrollment_status"]
          terms_version: string
        }[]
      }
      fetch_network_enrollments: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_operator_organization_id: string
          p_status?: Database["public"]["Enums"]["network_enrollment_status"][]
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
          status: Database["public"]["Enums"]["network_enrollment_status"]
          terms_version: string
        }[]
      }
      fetch_network_members: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_operator_organization_id: string
          p_search_term?: string
          p_status?: Database["public"]["Enums"]["network_membership_status"][]
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
          public_account_id: string
          registry_identifier: string
          status: Database["public"]["Enums"]["network_membership_status"]
          tax_identifier: string
          terms_version: string
        }[]
      }
      fetch_network_operator_fee_entries: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_operator_organization_id: string
          p_status?: Database["public"]["Enums"]["network_fee_entry_status"][]
        }
        Returns: {
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string
          entry_type: Database["public"]["Enums"]["network_fee_entry_type"]
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
          status: Database["public"]["Enums"]["network_fee_entry_status"]
          transaction_id: string
        }[]
      }
      fetch_network_operator_fee_rules: {
        Args: { p_operator_organization_id: string }
        Returns: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          fee_rule_id: string
          fee_type: Database["public"]["Enums"]["network_operator_fee_type"]
          fixed_amount: number
          max_amount: number | null
          metadata: Json
          min_amount: number | null
          name: string
          operator_organization_id: string
          percent_bps: number
          status: Database["public"]["Enums"]["network_fee_rule_status"]
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
          connected_operator_count: number
          default_capabilities: string[]
          default_fee_rule_id: string
          default_terms_version: string
          is_member: boolean
          network_account_id: string
          operator_profile_id: string
          operator_status: string
          public_account_id: string
          risk_tier: string
        }[]
      }
      fetch_network_overview_metrics: {
        Args: { p_environment?: string; p_operator_organization_id: string }
        Returns: {
          active_members: number
          gross_amount: number
          net_amount: number
          operator_fee_amount: number
          pending_enrollments: number
          pending_fee_amount: number
          total_members: number
          total_transactions: number
        }[]
      }
      fetch_network_provider_settings_for_api: {
        Args: {
          p_environment?: string
          p_network_membership_id: string
          p_provider_code: Database["public"]["Enums"]["provider_code"]
        }
        Returns: {
          is_connected: boolean
          is_phone_verified: boolean
          metadata: Json
          onboarding_status: Database["public"]["Enums"]["onboarding_status"]
          organization_id: string
          phone_number: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_merchant_id: string
        }[]
      }
      fetch_network_refunds_for_api: {
        Args: {
          p_end_date?: string
          p_environment?: string
          p_limit?: number
          p_network_membership_id: string
          p_offset?: number
          p_read_scope?: string
          p_start_date?: string
          p_status?: Database["public"]["Enums"]["refund_status"]
        }
        Returns: {
          amount: number
          created_at: string
          fee_amount: number
          metadata: Json
          reason: string
          refund_id: string
          refunded_amount: number
          status: Database["public"]["Enums"]["refund_status"]
          transaction_id: string
          updated_at: string
        }[]
      }
      fetch_network_transaction_count: {
        Args: {
          p_currency?: Database["public"]["Enums"]["currency_code"][]
          p_end_date?: string
          p_environment?: string
          p_operator_organization_id: string
          p_search_term?: string
          p_start_date?: string
          p_status?: Database["public"]["Enums"]["transaction_status"][]
        }
        Returns: number
      }
      fetch_network_transaction_metrics: {
        Args: {
          p_end_date?: string
          p_environment?: string
          p_operator_organization_id: string
          p_start_date?: string
        }
        Returns: {
          completed_count: number
          failed_count: number
          gross_amount: number
          net_amount: number
          operator_fee_amount: number
          platform_fee_amount: number
          refunded_count: number
        }[]
      }
      fetch_network_transactions: {
        Args: {
          p_currency?: Database["public"]["Enums"]["currency_code"][]
          p_end_date?: string
          p_environment?: string
          p_operator_organization_id: string
          p_page?: number
          p_page_size?: number
          p_search_term?: string
          p_start_date?: string
          p_status?: Database["public"]["Enums"]["transaction_status"][]
        }
        Returns: {
          capability_key: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
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
          operator_fee_currency: Database["public"]["Enums"]["currency_code"]
          operator_organization_id: string
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          provider_checkout_id: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_transaction_id: string
          public_account_id: string
          refunded_amount: number
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }[]
      }
      fetch_network_transactions_for_api: {
        Args: {
          p_currency?: Database["public"]["Enums"]["currency_code"][]
          p_end_date?: string
          p_environment?: string
          p_is_pos?: boolean
          p_network_membership_id: string
          p_page?: number
          p_page_size?: number
          p_payment_method?: Database["public"]["Enums"]["payment_method_code"][]
          p_provider_code?: Database["public"]["Enums"]["provider_code"]
          p_read_scope?: string
          p_start_date?: string
          p_status?: Database["public"]["Enums"]["transaction_status"][]
          p_type?: Database["public"]["Enums"]["transaction_type"][]
        }
        Returns: {
          capability_key: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
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
          operator_fee_currency: Database["public"]["Enums"]["currency_code"]
          operator_organization_id: string
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          provider_checkout_id: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_transaction_id: string
          public_account_id: string
          refunded_amount: number
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }[]
      }
      fetch_new_customer_trend: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_merchant_id: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: {
          date: string
          new_customer_count: number
        }[]
      }
      fetch_new_customers: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_merchant_id: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: {
          growth_rate: number
          new_customers_count: number
          total_customers: number
        }[]
      }
      fetch_notifications: {
        Args: {
          p_environment?: string
          p_include_archived?: boolean
          p_merchant_id: string
        }
        Returns: {
          created_at: string
          event_key: string
          is_archived: boolean
          is_read: boolean
          message: string
          metadata: Json
          notification_id: string
          severity: string
          type: Database["public"]["Enums"]["notification_type"]
        }[]
      }
      fetch_oauth_merchant_connections: {
        Args: { p_merchant_id: string; p_organization_id: string }
        Returns: {
          access_level: string
          client_id: string
          client_name: string
          created_at: string
          environment: string
          expires_at: string
          is_active: boolean
          scope: string
          token_id: string
        }[]
      }
      fetch_organization_bookings: {
        Args: { p_from: string; p_organization_id: string; p_to: string }
        Returns: {
          booking_id: string
          created_at: string
          currency_code: string
          customer_email: string
          customer_name: string
          customer_phone: string
          deposit_amount: number
          ends_at: string
          notes: string
          payment_link_id: string
          payment_mode: Database["public"]["Enums"]["service_payment_mode"]
          service_id: string
          service_name: string
          starts_at: string
          status: Database["public"]["Enums"]["booking_status"]
          total_price: number
        }[]
      }
      fetch_organization_checkout_settings: {
        Args: { p_organization_id: string }
        Returns: Json
      }
      fetch_organization_data_and_members: {
        Args: { p_merchant_id: string; p_organization_id: string }
        Returns: {
          has_multiple_orgs: boolean
          is_admin: boolean
          organization_details: Json
          team_members: Json
        }[]
      }
      fetch_organization_details: {
        Args: { p_merchant_id: string; p_organization_id?: string }
        Returns: {
          arr: number
          city: string
          country: string
          default_currency: Database["public"]["Enums"]["currency_code"]
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
          verification_status: Database["public"]["Enums"]["organization_verification_status"]
          website_url: string
        }[]
      }
      fetch_organization_details_checkout: {
        Args: { p_organization_id: string }
        Returns: {
          logo_url: string
          organization_id: string
        }[]
      }
      fetch_organization_disputes: {
        Args: {
          p_organization_id: string
          p_page?: number
          p_page_size?: number
        }
        Returns: {
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_email: string
          customer_id: string
          customer_name: string
          dispute_id: string
          fee_amount: number
          reason: string
          resolution_date: string
          resolution_details: string
          status: Database["public"]["Enums"]["dispute_status"]
          transaction_id: string
          updated_at: string
        }[]
      }
      fetch_organization_fee_types: {
        Args: { p_organization_id: string }
        Returns: Json
      }
      fetch_organization_fees: {
        Args: { p_merchant_id: string }
        Returns: {
          fee_type_id: string
          fixed_amount: number
          is_enabled: boolean
          name: string
          percentage: number
        }[]
      }
      fetch_organization_member_role_assignments: {
        Args: { p_organization_id: string }
        Returns: {
          merchant_id: string
          merchant_org_id: string
          role_id: string
        }[]
      }
      fetch_organization_payment_parameters: {
        Args: { p_organization_id: string }
        Returns: Json
      }
      fetch_organization_payment_processing_fees: {
        Args: {
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_organization_id: string
        }
        Returns: {
          fee_category: Database["public"]["Enums"]["fee_category"]
          fee_subcategory: Database["public"]["Enums"]["fee_subcategory"]
          fixed_amount: number
          name: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          percentage: number
          provider_code: Database["public"]["Enums"]["provider_code"]
        }[]
      }
      fetch_organization_permissions: {
        Args: never
        Returns: {
          description: string
          domain: string
          permission_key: string
        }[]
      }
      fetch_organization_products: {
        Args: { p_organization_id: string; p_product_type?: string }
        Returns: {
          name: string
          prices: Json
          product_id: string
        }[]
      }
      fetch_organization_providers_settings: {
        Args: {
          p_organization_id: string
          p_provider_code?: Database["public"]["Enums"]["provider_code"]
        }
        Returns: {
          is_connected: boolean
          is_phone_verified: boolean
          metadata: Json
          onboarding_status: Database["public"]["Enums"]["onboarding_status"]
          organization_id: string
          phone_number: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_merchant_id: string
        }[]
      }
      fetch_organization_providers_settings_api: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_provider_code?: Database["public"]["Enums"]["provider_code"]
        }
        Returns: {
          is_connected: boolean
          is_phone_verified: boolean
          metadata: Json
          onboarding_status: Database["public"]["Enums"]["onboarding_status"]
          organization_id: string
          phone_number: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_merchant_id: string
        }[]
      }
      fetch_organization_role_detail: {
        Args: { p_role_id: string }
        Returns: {
          is_active: boolean
          is_system: boolean
          key: string
          organization_id: string
          permission_keys: string[]
          role_id: string
          title: string
        }[]
      }
      fetch_organization_roles: {
        Args: { p_organization_id: string }
        Returns: {
          is_active: boolean
          is_system: boolean
          key: string
          permission_count: number
          role_id: string
          title: string
        }[]
      }
      fetch_organization_support_requests: {
        Args: {
          p_organization_id: string
          p_page?: number
          p_page_size?: number
        }
        Returns: {
          category: Database["public"]["Enums"]["support_category"]
          created_at: string
          created_by: string
          image_url: string
          message: string
          organization_id: string
          priority: Database["public"]["Enums"]["support_priority"]
          resolution_message: string
          resolved_at: string
          status: Database["public"]["Enums"]["support_status"]
          subject: string
          support_requests_id: string
          updated_at: string
        }[]
      }
      fetch_organization_test_balances: {
        Args: { p_merchant_id: string; p_organization_id: string }
        Returns: {
          balance: number
          currency_code: Database["public"]["Enums"]["currency_code"]
        }[]
      }
      fetch_organization_webhooks: {
        Args: {
          p_environment?: string
          p_event?: Database["public"]["Enums"]["webhook_event"]
          p_is_active?: boolean
          p_merchant_id: string
          p_organization_id?: string
          p_search_term?: string
        }
        Returns: {
          authorized_events: Database["public"]["Enums"]["webhook_event"][]
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
      fetch_payment_links: {
        Args: {
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_environment?: string
          p_include_expired?: boolean
          p_is_active?: boolean
          p_link_type?: Database["public"]["Enums"]["link_type"]
          p_organization_id: string
          p_page?: number
          p_page_size?: number
        }
        Returns: {
          allow_coupon_code: boolean
          allow_quantity: boolean
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string
          expires_at: string
          is_active: boolean
          line_items: Json
          link_id: string
          link_type: Database["public"]["Enums"]["link_type"]
          metadata: Json
          organization_id: string
          organization_logo_url: string
          product_amount: number
          product_billing_interval: Database["public"]["Enums"]["billing_interval"]
          product_id: string
          product_images: string[]
          product_name: string
          public_id: string
          quantity: number
          success_url: string
          title: string
          updated_at: string
          url: string
        }[]
      }
      fetch_payout_count: {
        Args: {
          p_account_id: string
          p_end_date?: string
          p_start_date?: string
        }
        Returns: number
      }
      fetch_payout_method_details: {
        Args: { p_organization_id?: string; p_payout_method_id: string }
        Returns: {
          account_name: string
          account_number: string
          auto_withdrawal_enabled: boolean
          auto_withdrawal_method: string
          auto_withdrawal_mobile_provider: Database["public"]["Enums"]["provider_code"]
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
      fetch_payout_methods: {
        Args: never
        Returns: {
          account_name: string
          account_number: string
          auto_withdrawal_day: number
          auto_withdrawal_enabled: boolean
          auto_withdrawal_last_run: string
          auto_withdrawal_method: string
          auto_withdrawal_mobile_provider: Database["public"]["Enums"]["provider_code"]
          bank_code: string
          bank_name: string
          branch_code: string
          country: string
          created_at: string
          eligible_for_platform_withdrawal_at: string
          id: string
          is_default: boolean
          is_primary: boolean
          is_spi_enabled: boolean
          is_uemoa: boolean
          is_valid: boolean
          payout_method_type: string
          spi_account_number: string
          spi_alias_mbno: string
          spi_alias_shid: string
          spi_alias_type: string
          updated_at: string
        }[]
      }
      fetch_payout_methods_by_org: {
        Args: { p_organization_id: string }
        Returns: {
          account_name: string
          account_number: string
          auto_withdrawal_day: number
          auto_withdrawal_enabled: boolean
          auto_withdrawal_last_run: string
          auto_withdrawal_method: string
          auto_withdrawal_mobile_provider: Database["public"]["Enums"]["provider_code"]
          bank_code: string
          bank_name: string
          branch_code: string
          country: string
          created_at: string
          eligible_for_platform_withdrawal_at: string
          is_default: boolean
          is_primary: boolean
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
          updated_at: string
        }[]
      }
      fetch_payout_status: {
        Args: {
          p_currency_code?: string
          p_environment?: string
          p_merchant_id: string
          p_organization_id: string
          p_status?: string
        }
        Returns: {
          amount: number
          bank_account_name: string
          created_at: string
          currency_code: string
          payout_id: string
          status: string
          updated_at: string
        }[]
      }
      fetch_payouts: {
        Args: {
          p_end_date?: string
          p_environment?: string
          p_merchant_id: string
          p_organization_id?: string
          p_page_number?: number
          p_page_size?: number
          p_start_date?: string
          p_statuses?: Database["public"]["Enums"]["payout_status"][]
        }
        Returns: {
          account_id: string
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          merchant_id: string
          metadata: Json
          organization_id: string
          payout_id: string
          payout_method_id: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          status: Database["public"]["Enums"]["payout_status"]
          updated_at: string
        }[]
      }
      fetch_pending_notification_outbox_job: {
        Args: { p_outbox_id: string }
        Returns: {
          attempt_count: number
          channel: string
          outbox_id: string
          payload: Json
          status: string
        }[]
      }
      fetch_pending_webhook_outbox_jobs: {
        Args: { p_outbox_id: string }
        Returns: {
          authorized_events: Database["public"]["Enums"]["webhook_event"][]
          created_by: string
          dispatch_id: string
          event_type: Database["public"]["Enums"]["webhook_event"]
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
      fetch_product_fees: {
        Args: { p_product_id: string }
        Returns: {
          fee_type_id: string
          fixed_amount: number
          is_enabled: boolean
          name: string
          percentage: number
        }[]
      }
      fetch_product_performance: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_limit?: number
          p_merchant_id: string
          p_metric?: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: {
          average_sale_value: number
          product_id: string
          product_name: string
          sales_count: number
          total_revenue: number
        }[]
      }
      fetch_product_prices: {
        Args: { p_product_id: string }
        Returns: {
          amount: number
          billing_interval: Database["public"]["Enums"]["billing_interval"]
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          is_active: boolean
          is_default: boolean
          is_locked: boolean
          maximum_amount: number
          metadata: Json
          minimum_amount: number
          price_id: string
          pricing_model: Database["public"]["Enums"]["pricing_model"]
          updated_at: string
        }[]
      }
      fetch_product_transactions: {
        Args: { p_environment?: string; p_product_id: string }
        Returns: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string
          gross_amount: number
          refunded_amount: number
          refunded_amount_xof: number
          status: string
          transaction_id: string
        }[]
      }
      fetch_products: {
        Args: {
          p_environment?: string
          p_is_active?: boolean
          p_limit?: number
          p_merchant_id: string
          p_offset?: number
          p_organization_id?: string
          p_search?: string
        }
        Returns: {
          continue_selling_when_out_of_stock: boolean
          created_at: string
          created_by: string
          description: string
          display_on_storefront: boolean
          fees: Json
          file_count: number
          fulfillment_type: Database["public"]["Enums"]["product_fulfillment_type"]
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
          product_type: Database["public"]["Enums"]["product_type"]
          public_id: string
          sku: string
          total_count: number
          track_inventory: boolean
          updated_at: string
        }[]
      }
      fetch_products_with_transactions_for_export: {
        Args: { p_merchant_id: string }
        Returns: {
          name: string
          product_id: string
          product_type: Database["public"]["Enums"]["product_type"]
        }[]
      }
      fetch_provider_distribution_custom_range: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: {
          date: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          transaction_count: number
        }[]
      }
      fetch_provider_performance_metrics: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_merchant_id: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: {
          average_transaction_value: number
          provider_code: string
          success_rate: number
          successful_transactions: number
          total_revenue: number
          total_transactions: number
        }[]
      }
      fetch_public_transaction_details: {
        Args: { p_transaction_id: string }
        Returns: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_email: string
          customer_name: string
          customer_phone: string
          gross_amount: number
          metadata: Json
          net_amount: number
          organization_city: string
          organization_country: string
          organization_logo_url: string
          organization_name: string
          organization_postal_code: string
          organization_region: string
          organization_street: string
          plan_billing_frequency: string
          plan_name: string
          product_name: string
          product_price: number
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_transaction_id: string
          quantity: number
          status: Database["public"]["Enums"]["transaction_status"]
          stripe_amount_cents: number
          stripe_currency: string
          subscription_id: string
          subscription_next_billing_date: string
          subscription_status: string
          transaction_id: string
        }[]
      }
      fetch_qr_codes: {
        Args: {
          p_environment?: string
          p_is_active?: boolean
          p_organization_id: string
          p_page?: number
          p_page_size?: number
          p_qr_code_type?: Database["public"]["Enums"]["qr_code_type"]
        }
        Returns: {
          amount: number
          compte_paye: string
          created_at: string
          created_by: string
          created_by_name: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          is_active: boolean
          is_used: boolean
          name: string
          product_id: string
          product_name: string
          qr_code_data: string
          qr_code_id: string
          qr_code_image_data: string
          qr_code_image_url: string
          qr_code_type: Database["public"]["Enums"]["qr_code_type"]
          total_revenue: number
          transaction_count: number
        }[]
      }
      fetch_recent_orders: {
        Args: {
          p_environment?: string
          p_limit?: number
          p_organization_id: string
        }
        Returns: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_email: string
          customer_id: string
          customer_name: string
          net_amount: number
          product_name: string
          transaction_id: string
        }[]
      }
      fetch_recent_payouts: {
        Args: {
          p_merchant_id: string
          p_start_date: string
          p_statuses?: Database["public"]["Enums"]["payout_status"][]
        }
        Returns: {
          created_at: string
          payout_id: string
        }[]
      }
      fetch_recurring_customers_rate: {
        Args: {
          p_currency?: Database["public"]["Enums"]["currency_code"][]
          p_end_date?: string
          p_environment?: string
          p_is_pos?: boolean
          p_organization_id: string
          p_start_date?: string
          p_status?: Database["public"]["Enums"]["transaction_status"][]
          p_type?: Database["public"]["Enums"]["transaction_type"][]
        }
        Returns: number
      }
      fetch_refund_impact_summary: {
        Args: {
          p_currency?: Database["public"]["Enums"]["currency_code"][]
          p_end_date?: string
          p_environment?: string
          p_is_pos?: boolean
          p_organization_id: string
          p_start_date?: string
          p_status?: Database["public"]["Enums"]["transaction_status"][]
          p_type?: Database["public"]["Enums"]["transaction_type"][]
        }
        Returns: Json
      }
      fetch_renewed_subscriptions_custom_range: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_merchant_id: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: {
          date: string
          renewed_subscriptions: number
        }[]
      }
      fetch_renewed_subscriptions_revenue_custom_range: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_merchant_id: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: {
          date: string
          renewed_subscriptions_revenue: number
        }[]
      }
      fetch_revenue_analytics_custom_range: {
        Args: {
          p_currency_code?: string
          p_end_date: string
          p_environment?: string
          p_group_by?: string
          p_merchant_id: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: {
          average_transaction_value: number
          currency_code: string
          period: string
          revenue: number
          transaction_count: number
        }[]
      }
      fetch_revenue_custom_range: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: {
          date: string
          reporting_currency: Database["public"]["Enums"]["currency_code"]
          revenue: number
        }[]
      }
      fetch_revenue_pareto_custom_range: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_merchant_id: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: {
          cumulative_customer_percentage: number
          cumulative_revenue_percentage: number
        }[]
      }
      fetch_risk_assessments: {
        Args: {
          p_decision?: Database["public"]["Enums"]["radar_decision"]
          p_end_date?: string
          p_organization_id: string
          p_page?: number
          p_page_size?: number
          p_rail?: Database["public"]["Enums"]["radar_rail"]
          p_start_date?: string
        }
        Returns: {
          amount: number | null
          assessment_id: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"] | null
          customer_id: string | null
          decision: Database["public"]["Enums"]["radar_decision"]
          metadata: Json
          organization_id: string
          provider: Database["public"]["Enums"]["radar_signal_provider"]
          rail: Database["public"]["Enums"]["radar_rail"]
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
      fetch_service_availability_rules: {
        Args: { p_organization_id: string }
        Returns: {
          day_of_week: number
          end_time: string
          is_active: boolean
          organization_id: string
          rule_id: string
          start_time: string
        }[]
      }
      fetch_settlement_periods: {
        Args: {
          p_currency?: Database["public"]["Enums"]["currency_code"]
          p_end_date?: string
          p_environment?: string
          p_merchant_id?: string
          p_organization_id: string
          p_page?: number
          p_page_size?: number
          p_start_date?: string
        }
        Returns: {
          currency_code: Database["public"]["Enums"]["currency_code"]
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
          p_environment?: string
          p_merchant_id?: string
          p_organization_id: string
          p_page?: number
          p_page_size?: number
          p_settlement_id: string
        }
        Returns: {
          available_at: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          fee_amount: number
          gross_amount: number
          net_amount: number
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          provider_code: Database["public"]["Enums"]["provider_code"]
          status: Database["public"]["Enums"]["transaction_status"]
          subscription_id: string
          total_count: number
          transaction_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }[]
      }
      fetch_sidebar_data: {
        Args: { p_merchant_id: string; p_organization_id?: string }
        Returns: {
          merchant_name: string
          merchant_role: string
          organization_city: string
          organization_country: string
          organization_id: string
          organization_logo_url: string
          organization_name: string
          organization_postal_code: string
          organization_region: string
          organization_street: string
        }[]
      }
      fetch_spi_qr_codes: {
        Args: {
          p_environment?: string
          p_is_active?: boolean
          p_limit?: number
          p_offset?: number
          p_organization_id: string
          p_qr_code_type?: string
        }
        Returns: {
          amount: number
          categorie: string
          checkout_session_id: string
          compte_paye: string
          created_at: string
          created_by: string
          currency_code: string
          environment: string
          expires_at: string
          is_active: boolean
          is_used: boolean
          metadata: Json
          name: string
          organization_id: string
          payeur_alias: string
          payment_request_id: string
          product_id: string
          product_name: string
          qr_code_data: string
          qr_code_id: string
          qr_code_image_url: string
          qr_code_type: string
          total_count: number
          updated_at: string
        }[]
      }
      fetch_storefront_products: {
        Args: { p_organization_id: string }
        Returns: {
          description: string
          display_on_storefront: boolean
          image_url: string
          is_active: boolean
          name: string
          prices: Json
          product_id: string
        }[]
      }
      fetch_storefront_subscription_plans: {
        Args: { p_organization_id: string }
        Returns: {
          description: string
          display_on_storefront: boolean
          image_url: string
          is_active: boolean
          name: string
          prices: Json
          product_id: string
        }[]
      }
      fetch_subscription_data: {
        Args: { p_transaction_id: string }
        Returns: {
          plan_billing_frequency: Database["public"]["Enums"]["billing_interval"]
          plan_description: string
          plan_name: string
          subscription_end_date: string
          subscription_id: string
          subscription_next_billing_date: string
          subscription_status: string
        }[]
      }
      fetch_subscription_deep_link_snapshot: {
        Args: { p_organization_id: string; p_subscription_id: string }
        Returns: {
          customer_id: string
          customer_name: string
          product_name: string
          status: Database["public"]["Enums"]["subscription_status"]
          subscription_id: string
        }[]
      }
      fetch_subscription_metrics: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_merchant_id: string
          p_organization_id: string
          p_start_date: string
          p_status?: string
        }
        Returns: {
          active_subscriptions: number
          average_subscription_value: number
          cancelled_subscriptions: number
          churn_rate: number
          expired_subscriptions: number
          paused_subscriptions: number
          total_mrr: number
          total_subscriptions: number
        }[]
      }
      fetch_subscription_revenue_custom_range: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_merchant_id: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: {
          date: string
          subscription_revenue: number
        }[]
      }
      fetch_subscriptions: {
        Args: {
          p_environment?: string
          p_merchant_id?: string
          p_organization_id: string
          p_page?: number
          p_page_size?: number
        }
        Returns: {
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          customer_name: string
          end_date: string
          metadata: Json
          next_billing_date: string
          product_id: string
          product_name: string
          start_date: string
          status: Database["public"]["Enums"]["subscription_status"]
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
          product_type: Database["public"]["Enums"]["product_type"]
          subscription_end_date: string
          subscription_id: string
          subscription_next_billing_date: string
          subscription_status: Database["public"]["Enums"]["subscription_status"]
        }[]
      }
      fetch_support_requests: {
        Args: {
          p_merchant_id: string
          p_page?: number
          p_page_size?: number
          p_status?: Database["public"]["Enums"]["support_status"]
        }
        Returns: {
          category: Database["public"]["Enums"]["support_category"]
          created_at: string
          image_url: string
          message: string
          priority: Database["public"]["Enums"]["support_priority"]
          resolution_message: string
          resolved_at: string
          status: Database["public"]["Enums"]["support_status"]
          subject: string
          support_requests_id: string
          updated_at: string
        }[]
      }
      fetch_top_customers: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_limit?: number
          p_merchant_id: string
          p_metric?: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: {
          average_transaction_value: number
          customer_email: string
          customer_id: string
          customer_name: string
          last_transaction_date: string
          total_revenue: number
          transaction_count: number
        }[]
      }
      fetch_top_customers_by_spend: {
        Args: {
          p_environment?: string
          p_limit?: number
          p_organization_id: string
        }
        Returns: {
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          email: string
          name: string
          total_spend: number
          transaction_count: number
        }[]
      }
      fetch_top_performing_products: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_limit?: number
          p_merchant_id: string
          p_metric?: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: {
          date: string
          metric_value: number
          product_id: string
          product_name: string
        }[]
      }
      fetch_total_incoming_amount: {
        Args: {
          p_currency?: Database["public"]["Enums"]["currency_code"][]
          p_end_date?: string
          p_environment?: string
          p_is_pos?: boolean
          p_organization_id: string
          p_start_date?: string
          p_status?: Database["public"]["Enums"]["transaction_status"][]
          p_type?: Database["public"]["Enums"]["transaction_type"][]
        }
        Returns: number
      }
      fetch_transaction_activity: {
        Args: {
          p_limit?: number
          p_organization_id: string
          p_transaction_id: string
        }
        Returns: {
          activity_id: string
          actor_merchant_id: string
          created_at: string
          event_name: string
          payload: Json
          severity: string
          source: string
          title: string
        }[]
      }
      fetch_transaction_count: {
        Args: {
          p_currency?: Database["public"]["Enums"]["currency_code"][]
          p_end_date?: string
          p_environment?: string
          p_is_pos?: boolean
          p_organization_id: string
          p_start_date?: string
          p_status?: Database["public"]["Enums"]["transaction_status"][]
          p_type?: Database["public"]["Enums"]["transaction_type"][]
        }
        Returns: number
      }
      fetch_transaction_metrics: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_merchant_id: string
          p_organization_id: string
          p_payment_method_code?: string
          p_provider_code?: string
          p_start_date: string
          p_status?: string
        }
        Returns: {
          average_transaction_value: number
          completed_transactions: number
          failed_transactions: number
          pending_transactions: number
          refunded_transactions: number
          success_rate: number
          total_revenue: number
          total_transactions: number
        }[]
      }
      fetch_transaction_radar_hints: {
        Args: { p_organization_id: string; p_transaction_ids: string[] }
        Returns: {
          radar_decision: Database["public"]["Enums"]["radar_decision"]
          radar_risk_score: number
          transaction_id: string
        }[]
      }
      fetch_transaction_volume_custom_range: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_merchant_id: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: {
          date: string
          transaction_count: number
        }[]
      }
      fetch_transactions: {
        Args: {
          p_currency?: Database["public"]["Enums"]["currency_code"][]
          p_display_in_xof?: boolean
          p_end_date?: string
          p_environment?: string
          p_is_pos?: boolean
          p_merchant_id?: string
          p_organization_id: string
          p_page?: number
          p_page_size?: number
          p_payment_method?: Database["public"]["Enums"]["payment_method_code"][]
          p_product_linkage?: string[]
          p_provider_code?: Database["public"]["Enums"]["provider_code"]
          p_search_term?: string
          p_start_date?: string
          p_status?: Database["public"]["Enums"]["transaction_status"][]
          p_type?: Database["public"]["Enums"]["transaction_type"][]
        }
        Returns: {
          coupon_code: string
          coupon_usage_details: Json
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
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
          fee_category: Database["public"]["Enums"]["fee_category"]
          fee_name: string
          fee_structure_id: string
          fee_subcategory: Database["public"]["Enums"]["fee_subcategory"]
          gross_amount: number
          gross_amount_xof: number
          integration_source: Database["public"]["Enums"]["integration_source"]
          metadata: Json
          net_amount: number
          net_amount_xof: number
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          product_description: string
          product_id: string
          product_name: string
          product_price: number
          provider_checkout_id: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_transaction_id: string
          public_id: string
          qr_code_id: string
          qr_code_name: string
          qr_code_product_id: string
          qr_code_type: Database["public"]["Enums"]["qr_code_type"]
          quantity: number
          refunded_amount: number
          refunded_amount_xof: number
          spi_payment_category: Database["public"]["Enums"]["spi_payment_category"]
          spi_rejection_reason: Database["public"]["Enums"]["spi_rejection_reason"]
          status: Database["public"]["Enums"]["transaction_status"]
          subscription_id: string
          subscription_next_billing_date: string
          subscription_price_billing_interval: string
          subscription_product_description: string
          subscription_product_name: string
          subscription_status: string
          transaction_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }[]
      }
      fetch_transactions_for_subscription: {
        Args: { p_subscription_id: string }
        Returns: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string
          gross_amount: number
          status: string
          transaction_id: string
        }[]
      }
      fetch_usage_revenue_custom_range: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: {
          date: string
          usage_revenue: number
        }[]
      }
      fetch_user_avatar: { Args: { p_user_id: string }; Returns: string }
      fetch_wave_provider_settings: {
        Args: { p_organization_id: string }
        Returns: {
          is_connected: boolean
          is_phone_verified: boolean
          metadata: Json
          organization_id: string
          phone_number: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_merchant_id: string
        }[]
      }
      fetch_webhook_delivery_logs: {
        Args: {
          p_end_date?: string
          p_environment?: string
          p_limit?: number
          p_offset?: number
          p_organization_id: string
          p_start_date?: string
          p_status_codes: string[]
        }
        Returns: {
          amount: number
          attempt_number: number
          compte_paye: string
          compte_payeur: string
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
          spi_event_code: string
          spi_tx_id: string
          success: boolean
          total_count: number
          user_agent: string
          webhook_id: string
        }[]
      }
      finalize_bnpl_installment_spi_initiated: {
        Args: {
          p_payment_request_id: string
          p_spi_error_message?: string
          p_spi_init_success?: boolean
          p_spi_payment_status: Database["public"]["Enums"]["spi_payment_status"]
        }
        Returns: undefined
      }
      finalize_cancel_at_period_end_subscriptions: {
        Args: never
        Returns: number
      }
      finalize_gim_payment: {
        Args: {
          p_action_code?: string
          p_auth_code?: string
          p_gateway_message?: string
          p_merchant_reference: string
          p_network_reference?: string
          p_return_hash_valid?: boolean
          p_status: string
          p_system_reference?: number
          p_three_ds_required?: boolean
        }
        Returns: Json
      }
      finalize_invoice_spi_rtp_initiated: {
        Args: {
          p_metadata?: Json
          p_payment_request_id: string
          p_spi_payment_status?: Database["public"]["Enums"]["spi_payment_status"]
        }
        Returns: undefined
      }
      finalize_pos_spi_payment_initiated: {
        Args: {
          p_checkout_session_id: string
          p_qr_payload?: string
          p_spi_date_limite_paiement?: string
          p_spi_date_limite_reponse?: string
          p_spi_error_message?: string
          p_spi_init_success?: boolean
          p_spi_payment_status: Database["public"]["Enums"]["spi_payment_status"]
          p_spi_tx_id: string
        }
        Returns: Json
      }
      finalize_subscription_renewal_after_retries: {
        Args: { p_error?: string; p_subscription_id: string }
        Returns: string
      }
      finalize_usage_invoice: { Args: { p_invoice_id: string }; Returns: Json }
      find_duplicates_by_name_patterns: {
        Args: never
        Returns: {
          customer_ids: string[]
          customer_names: string[]
          duplicate_count: number
          emails: string[]
          name_pattern: string
          organization_id: string
          phones: string[]
        }[]
      }
      find_potential_duplicates_smart: {
        Args: { max_results?: number; similarity_threshold?: number }
        Returns: {
          combined_score: number
          customer_id: string
          customer_name: string
          email: string
          email_similarity: number
          match_reason: string
          name_similarity: number
          organization_id: string
          phone_number: string
          phone_similarity: number
          potential_match_email: string
          potential_match_id: string
          potential_match_name: string
          potential_match_phone: string
        }[]
      }
      find_potential_duplicates_smart_detailed: {
        Args: { max_results?: number; similarity_threshold?: number }
        Returns: {
          combined_score: number
          customer_id: string
          customer_name: string
          email: string
          email_similarity: number
          email_similarity_reason: string
          match_reason: string
          name_similarity: number
          organization_id: string
          phone_number: string
          phone_similarity: number
          phone_similarity_reason: string
          potential_match_email: string
          potential_match_id: string
          potential_match_name: string
          potential_match_phone: string
        }[]
      }
      find_shopify_session_by_id: {
        Args: { p_id: string }
        Returns: {
          accesstoken: string
          accountowner: boolean
          associated_user_scope: string
          collaborator: boolean
          email: string
          emailverified: boolean
          expires: string
          expires_in: number
          firstname: string
          id: string
          isonline: boolean
          lastname: string
          locale: string
          scope: string
          shop: string
          state: string
          userid: number
        }[]
      }
      find_shopify_sessions_by_shop: {
        Args: { p_shop: string }
        Returns: {
          accesstoken: string
          accountowner: boolean
          associated_user_scope: string
          collaborator: boolean
          email: string
          emailverified: boolean
          expires: string
          expires_in: number
          firstname: string
          id: string
          isonline: boolean
          lastname: string
          locale: string
          scope: string
          shop: string
          state: string
          userid: number
        }[]
      }
      find_subscriptions_due_for_renewal: {
        Args: { days_before_renewal?: number }
        Returns: {
          billing_frequency: Database["public"]["Enums"]["billing_interval"]
          business_name: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_email: string
          customer_id: string
          customer_name: string
          days_until_renewal: number
          merchant_email: string
          merchant_id: string
          merchant_name: string
          next_billing_date: string
          organization_id: string
          organization_logo_url: string
          plan_amount: number
          plan_name: string
          product_id: string
          subscription_id: string
        }[]
      }
      find_usage_subscriptions_due_for_billing: {
        Args: { p_as_of_date?: string }
        Returns: {
          billing_interval: Database["public"]["Enums"]["billing_interval"]
          created_by: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          environment: string
          next_billing_date: string
          organization_id: string
          price_amount: number
          price_id: string
          product_id: string
          product_name: string
          subscription_id: string
        }[]
      }
      find_wave_transaction_by_provider_txn_id: {
        Args: { p_wave_transaction_id: string }
        Returns: {
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_id: string
        }[]
      }
      fix_coupon_customer_validation: { Args: never; Returns: string }
      generate_api_key: {
        Args: {
          p_environment?: string
          p_expiration_date?: string
          p_key_type?: string
          p_merchant_id: string
          p_name: string
          p_organization_id: string
        }
        Returns: {
          api_key: string
        }[]
      }
      generate_monthly_statement: {
        Args: { p_merchant_id: string }
        Returns: string
      }
      generate_monthly_statements_for_all_merchants: {
        Args: never
        Returns: Json
      }
      generate_product_license_key: { Args: never; Returns: string }
      generate_provisioning_key: {
        Args: {
          p_daily_account_limit?: number
          p_environment?: string
          p_name: string
          p_partner_name: string
          p_rate_limit_per_minute?: number
        }
        Returns: {
          environment: string
          name: string
          partner_name: string
          provisioning_key: string
          provisioning_key_id: string
        }[]
      }
      generate_statement_for_specific_month: {
        Args: { p_merchant_id: string; p_target_month: string }
        Returns: string
      }
      generate_subscription_renewal_session: {
        Args: { p_subscription_id: string }
        Returns: string
      }
      generate_top_up_reference_code: { Args: never; Returns: string }
      generate_webhook_secret: {
        Args: { p_merchant_id: string; p_webhook_id: string }
        Returns: {
          verification_token: string
          webhook_id: string
        }[]
      }
      get_account: {
        Args: { p_account_id: string; p_organization_id: string }
        Returns: {
          account_id: string
          balance: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          is_spi_account: boolean
          organization_id: string
          spi_account_balance: number
          spi_account_balance_sync_error: string
          spi_account_balance_synced_at: string
          spi_account_number: string
          spi_account_status: Database["public"]["Enums"]["spi_account_status"]
          spi_account_type: Database["public"]["Enums"]["spi_account_type"]
          updated_at: string
        }[]
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
      get_active_qr_codes_count: {
        Args: { p_environment?: string; p_organization_id: string }
        Returns: number
      }
      get_active_subscriptions_by_product: {
        Args: { p_environment?: string; p_organization_id: string }
        Returns: {
          active_count: number
          product_id: string
          product_name: string
        }[]
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
          price_billing_interval: Database["public"]["Enums"]["billing_interval"]
          price_currency_code: string
          provider_customer_id: string
          provider_payment_method_id: string
          status: Database["public"]["Enums"]["subscription_status"]
          subscription_id: string
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
          event: Database["public"]["Enums"]["event_type"]
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
      get_admin_account_top_ups_list: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_organization_id?: string
          p_search?: string
          p_status?: string
        }
        Returns: {
          admin_notes: string
          amount: number
          bank_instructions: Json
          created_at: string
          created_by: string
          credited_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          expires_at: string
          matched_bank_reference: string
          organization_id: string
          organization_name: string
          reference_code: string
          status: Database["public"]["Enums"]["account_top_up_status"]
          top_up_id: string
          updated_at: string
        }[]
      }
      get_admin_balances_list: {
        Args: {
          p_environment?: string
          p_limit?: number
          p_offset?: number
          p_search?: string
        }
        Returns: {
          balance_eur: number
          balance_usd: number
          balance_xof: number
          email: string
          name: string
          organization_id: string
        }[]
      }
      get_admin_bank_payouts_list: {
        Args: {
          p_environment?: string
          p_limit?: number
          p_offset?: number
          p_organization_id?: string
          p_search?: string
          p_status?: string
        }
        Returns: {
          account_name: string
          account_number: string
          amount: number
          bank_name: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          metadata: Json
          organization_id: string
          organization_name: string
          payout_id: string
          payout_method_id: string
          status: Database["public"]["Enums"]["payout_status"]
          updated_at: string
        }[]
      }
      get_admin_bnpl_overview: {
        Args: { p_environment?: string }
        Returns: Json
      }
      get_admin_ci_prospect_orgs: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: {
          country_hint: string
          email: string
          kyc_status: Database["public"]["Enums"]["kyc_status"]
          name: string
          organization_id: string
          payment_channels: string[]
          phone_number: string
          total_revenue: number
          total_transactions: number
          verification_status: Database["public"]["Enums"]["organization_verification_status"]
        }[]
      }
      get_admin_customers: {
        Args: {
          p_end_date?: string
          p_environment?: string
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_start_date?: string
        }
        Returns: {
          country: string
          created_at: string
          customer_id: string
          email: string
          is_business: boolean
          name: string
          organization_name: string
        }[]
      }
      get_admin_dashboard_access: { Args: never; Returns: Json }
      get_admin_disputes: {
        Args: {
          p_environment?: string
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_statuses?: string[]
        }
        Returns: {
          amount: number
          created_at: string
          currency_code: string
          customer_email: string
          customer_id: string
          customer_name: string
          dispute_id: string
          fee_amount: number
          organization_email: string
          organization_id: string
          organization_name: string
          reason: string
          resolution_date: string
          resolution_details: string
          status: string
          stripe_dispute_id: string
          transaction_id: string
          updated_at: string
        }[]
      }
      get_admin_event_stats: {
        Args: {
          p_end_date?: string
          p_environment?: string
          p_start_date?: string
        }
        Returns: {
          actionable_errors: number
          api_events: number
          auth_events: number
          checkout_events: number
          checkout_sessions: number
          error_count: number
          payment_attempts: number
          payment_completions: number
          payment_events: number
          product_events: number
          total_events: number
          warning_count: number
        }[]
      }
      get_admin_feedback_overview: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_statuses?: string[]
        }
        Returns: {
          created_at: string
          feedback_type: string
          id: string
          message: string
          organization_email: string
          organization_id: string
          organization_name: string
          rating: number
          status: string
          updated_at: string
        }[]
      }
      get_admin_growth_agent_runs: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: {
          agent_name: string
          error: string
          finished_at: string
          id: string
          run_type: string
          started_at: string
          stats: Json
        }[]
      }
      get_admin_growth_contacts: {
        Args: {
          p_lead_id?: string
          p_limit?: number
          p_offset?: number
          p_watch_only?: boolean
        }
        Returns: {
          created_at: string
          email: string
          employer_changed_at: string
          employer_company: string
          full_name: string
          id: string
          lead_id: string
          lead_name: string
          linkedin_url: string
          phone: string
          role: Database["public"]["Enums"]["growth_contact_role"]
          title: string
          updated_at: string
          watch_enabled: boolean
        }[]
      }
      get_admin_growth_deals: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_stage?: Database["public"]["Enums"]["growth_deal_stage"]
        }
        Returns: {
          amount_xof: number
          buying_trigger: string
          churned: boolean
          closed_at: string
          created_at: string
          currency: string
          cycle_days: number
          id: string
          lead_id: string
          lead_name: string
          lead_score: number
          name: string
          notes: string
          owner_email: string
          pain_proxy: string
          source_channel: Database["public"]["Enums"]["growth_outbound_channel"]
          stage: Database["public"]["Enums"]["growth_deal_stage"]
          updated_at: string
          won_rank_score: number
        }[]
      }
      get_admin_growth_icp_active: {
        Args: never
        Returns: {
          anti_icp: Json
          created_at: string
          hard_filters: Json
          id: string
          is_active: boolean
          markdown: string
          soft_signals: Json
          updated_at: string
          verified_winner_pass_rate: number
          version: number
        }[]
      }
      get_admin_growth_leads: {
        Args: {
          p_country?: string
          p_limit?: number
          p_offset?: number
          p_source?: Database["public"]["Enums"]["growth_lead_source"]
          p_status?: Database["public"]["Enums"]["growth_lead_status"]
        }
        Returns: {
          city: string
          country: string
          created_at: string
          email: string
          external_place_id: string
          icp_tags: string[]
          id: string
          name: string
          notes: string
          organization_id: string
          phone: string
          score: number
          score_reasons: Json
          scored_at: string
          sector: string
          source: Database["public"]["Enums"]["growth_lead_source"]
          status: Database["public"]["Enums"]["growth_lead_status"]
          updated_at: string
          website: string
        }[]
      }
      get_admin_growth_lookalike_runs: {
        Args: { p_limit?: number }
        Returns: {
          candidates: Json
          created_at: string
          criteria: Json
          id: string
          seed_deal_id: string
          verified_pass_rate: number
        }[]
      }
      get_admin_growth_outbound_touches: {
        Args: {
          p_channel?: Database["public"]["Enums"]["growth_outbound_channel"]
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          channel: Database["public"]["Enums"]["growth_outbound_channel"]
          contact_id: string
          contacted_at: string
          created_at: string
          direction: Database["public"]["Enums"]["growth_outbound_direction"]
          id: string
          lead_id: string
          lead_name: string
          meeting_booked: boolean
          replied: boolean
          subject: string
          won: boolean
        }[]
      }
      get_admin_growth_reply_drafts: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_platform?: Database["public"]["Enums"]["growth_reply_platform"]
          p_status?: Database["public"]["Enums"]["growth_reply_status"]
        }
        Returns: {
          agent_name: string
          approved_at: string
          created_at: string
          draft_text: string
          error_message: string
          id: string
          metadata: Json
          original_text: string
          platform: Database["public"]["Enums"]["growth_reply_platform"]
          posted_at: string
          posted_external_id: string
          status: Database["public"]["Enums"]["growth_reply_status"]
          target_author: string
          target_url: string
          updated_at: string
        }[]
      }
      get_admin_growth_sequences: {
        Args: never
        Returns: {
          channels: Database["public"]["Enums"]["growth_outbound_channel"][]
          created_at: string
          id: string
          name: string
          status: Database["public"]["Enums"]["growth_sequence_status"]
          steps: Json
          updated_at: string
        }[]
      }
      get_admin_growth_signal_events: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_status?: Database["public"]["Enums"]["growth_signal_event_status"]
        }
        Returns: {
          company_name: string
          created_at: string
          fired_at: string
          id: string
          lead_id: string
          payload: Json
          signal_id: string
          signal_slug: string
          status: Database["public"]["Enums"]["growth_signal_event_status"]
        }[]
      }
      get_admin_growth_signals: {
        Args: { p_active_only?: boolean }
        Returns: {
          created_at: string
          id: string
          is_active: boolean
          lift: number
          metadata: Json
          name: string
          proven_angle: string
          slug: string
          updated_at: string
          window_days: number
        }[]
      }
      get_admin_growth_winners: {
        Args: { p_limit?: number }
        Returns: {
          amount_xof: number
          buying_trigger: string
          churned: boolean
          city: string
          closed_at: string
          company_name: string
          country: string
          cycle_days: number
          deal_id: string
          icp_tags: string[]
          lead_id: string
          pain_proxy: string
          raw_payload: Json
          score: number
          sector: string
          website: string
          won_rank_score: number
        }[]
      }
      get_admin_job_applications_overview: {
        Args: {
          p_department?: string
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_status?: string
        }
        Returns: {
          created_at: string
          email: string
          github_url: string
          id: string
          job_department: string
          job_id: string
          job_title: string
          linkedin_url: string
          name: string
          resume_url: string
          status: string
        }[]
      }
      get_admin_job_statistics: {
        Args: never
        Returns: {
          accepted_applications: number
          pending_applications: number
          rejected_applications: number
          reviewed_applications: number
          total_applications: number
        }[]
      }
      get_admin_kyc_overview: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_status?: Database["public"]["Enums"]["kyc_status"]
        }
        Returns: {
          address_proof_url: string
          ai_confidence: number
          ai_decision: string
          ai_model: string
          ai_reasons: Json
          ai_rejection_reason: string
          ai_reviewed_at: string
          authorized_signatory_email: string
          authorized_signatory_name: string
          business_registration_url: string
          date_submitted: string
          kyc_status: Database["public"]["Enums"]["kyc_status"]
          legal_representative_id_url: string
          org_verification_status: Database["public"]["Enums"]["organization_verification_status"]
          organization_email: string
          organization_id: string
          organization_name: string
          proof_of_business_url: string
        }[]
      }
      get_admin_live_activation_requests: {
        Args: { p_limit?: number; p_offset?: number; p_status?: string }
        Returns: {
          created_at: string
          is_starter_business: boolean
          kyc_status: Database["public"]["Enums"]["kyc_status"]
          merchant_approved_at: string
          merchant_email: string
          merchant_id: string
          organization_id: string
          organization_name: string
          platform_approved_at: string
          rejection_reason: string
          request_id: string
          status: Database["public"]["Enums"]["live_activation_request_status"]
          verification_status: Database["public"]["Enums"]["organization_verification_status"]
        }[]
      }
      get_admin_ltv_by_acquisition_cohort: {
        Args: {
          p_end_date: string
          p_ltv_duration_days?: number
          p_organization_id?: string
          p_start_date: string
        }
        Returns: {
          acquisition_month: string
          average_ltv: number
        }[]
      }
      get_admin_merchant_ltv: {
        Args: {
          p_environment?: string
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          active_months: number
          avg_monthly_margin: number
          email: string
          gross_platform_revenue: number
          last_active_month: string
          months_since_active: number
          name: string
          net_platform_margin: number
          organization_id: string
          projected_ltv: number
          provider_cost: number
          recency_factor: number
        }[]
      }
      get_admin_merchants_list: {
        Args: { p_limit?: number; p_offset?: number; p_search?: string }
        Returns: {
          created_at: string
          email: string
          merchant_id: string
          name: string
          onboarded: boolean
          organization_count: number
        }[]
      }
      get_admin_organization_settings: {
        Args: { p_organization_id: string }
        Returns: {
          provider_code: Database["public"]["Enums"]["provider_code"]
          withdrawal_limit_max: number
          withdrawal_limit_min: number
          withdrawal_limit_monthly: number
        }[]
      }
      get_admin_organizations_list: {
        Args: {
          p_environment?: string
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          created_at: string
          email: string
          name: string
          organization_id: string
          phone_number: string
          pricing_plan_type: Database["public"]["Enums"]["pricing_plan_type"]
          public_id: string
          status: Database["public"]["Enums"]["organization_status"]
          total_fees: number
          total_revenue: number
          total_transactions: number
          verification_status: Database["public"]["Enums"]["organization_verification_status"]
        }[]
      }
      get_admin_organizations_with_tiers: {
        Args: {
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_limit?: number
          p_offset?: number
          p_pricing_plan_type?: Database["public"]["Enums"]["pricing_plan_type"]
          p_search?: string
        }
        Returns: {
          currency_code: Database["public"]["Enums"]["currency_code"]
          current_month_revenue: number
          current_tier_id: string
          current_tier_name: string
          email: string
          last_calculated_at: string
          organization_id: string
          organization_name: string
          previous_month_revenue: number
          pricing_plan_type: Database["public"]["Enums"]["pricing_plan_type"]
          revenue_range: string
          tier_determination_revenue: number
          tier_effective_date: string
          tier_order: number
          total_revenue: number
          total_transactions: number
        }[]
      }
      get_admin_partners: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_status?: Database["public"]["Enums"]["platform_partner_status"]
        }
        Returns: {
          active_keys: number
          contact_email: string
          created_at: string
          default_daily_account_limit: number
          merchants_created: number
          name: string
          owner_user_id: string
          partner_id: string
          partner_type: Database["public"]["Enums"]["platform_partner_type"]
          slug: string
          status: Database["public"]["Enums"]["platform_partner_status"]
        }[]
      }
      get_admin_payout_methods_list: {
        Args: {
          p_is_valid?: boolean
          p_limit?: number
          p_offset?: number
          p_organization_id?: string
          p_search?: string
          p_type?: string
        }
        Returns: {
          account_name: string
          account_number: string
          bank_name: string
          country: string
          created_at: string
          is_default: boolean
          is_valid: boolean
          organization_id: string
          organization_name: string
          payout_method_id: string
          payout_method_type: string
        }[]
      }
      get_admin_payouts_list: {
        Args: {
          p_currency?: string[]
          p_end_date?: string
          p_environment?: string
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_start_date?: string
          p_status?: string[]
        }
        Returns: {
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          organization_email: string
          organization_name: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          payout_id: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          status: Database["public"]["Enums"]["payout_status"]
        }[]
      }
      get_admin_provisioning_audit: {
        Args: {
          p_action?: string
          p_limit?: number
          p_offset?: number
          p_partner_id?: string
        }
        Returns: {
          action: string
          audit_id: string
          created_at: string
          ip_address: string
          merchant_id: string
          metadata: Json
          organization_id: string
          partner_id: string
          partner_name: string
        }[]
      }
      get_admin_provisioning_keys: {
        Args: {
          p_active_only?: boolean
          p_limit?: number
          p_offset?: number
          p_partner_id?: string
        }
        Returns: {
          accounts_created_today: number
          created_at: string
          daily_account_limit: number
          environment: string
          external_user_ref: string
          is_active: boolean
          key_kind: Database["public"]["Enums"]["provisioning_key_kind"]
          name: string
          partner_id: string
          partner_name: string
          provisioning_key_id: string
        }[]
      }
      get_admin_provisioning_overview: { Args: never; Returns: Json }
      get_admin_refunds_list: {
        Args: {
          p_currency?: string[]
          p_end_date?: string
          p_environment?: string
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_start_date?: string
          p_status?: string[]
        }
        Returns: {
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_name: string
          organization_name: string
          reason: string
          refund_id: string
          refunded_amount: number
          status: Database["public"]["Enums"]["refund_status"]
          transaction_id: string
        }[]
      }
      get_admin_revenue_pareto: {
        Args: {
          p_end_date: string
          p_organization_id?: string
          p_start_date: string
        }
        Returns: {
          cumulative_customer_percentage: number
          cumulative_revenue_percentage: number
        }[]
      }
      get_admin_support_requests: {
        Args: {
          p_categories?: string[]
          p_limit?: number
          p_offset?: number
          p_priorities?: string[]
          p_search?: string
          p_statuses?: string[]
        }
        Returns: {
          category: string
          created_at: string
          created_by: string
          image_url: string
          message: string
          organization_email: string
          organization_id: string
          organization_name: string
          priority: string
          resolution_message: string
          resolved_at: string
          status: string
          subject: string
          support_requests_id: string
          updated_at: string
        }[]
      }
      get_admin_transactions_list: {
        Args: {
          p_currency?: string[]
          p_end_date?: string
          p_environment?: string
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_start_date?: string
          p_status?: string[]
          p_type?: string[]
        }
        Returns: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_name: string
          environment: string
          gross_amount: number
          held_at: string
          hold_reason: string
          organization_name: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          refunded_amount: number
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }[]
      }
      get_admin_user_activity_overview: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_organization_filter?: string
        }
        Returns: {
          active_team_members: number
          is_active_24h: boolean
          is_active_30d: boolean
          is_active_7d: boolean
          last_api_activity: string
          last_transaction_at: string
          organization_email: string
          organization_id: string
          organization_name: string
          total_api_requests: number
          total_team_members: number
        }[]
      }
      get_admin_wide_cart_funnel: {
        Args: {
          p_end_date?: string
          p_environment?: string
          p_start_date?: string
        }
        Returns: {
          event_count: number
          session_count: number
          step_name: string
          step_order: number
        }[]
      }
      get_admin_wide_checkout_funnel: {
        Args: {
          p_end_date?: string
          p_environment?: string
          p_start_date?: string
        }
        Returns: {
          abandoned: number
          payment_failed: number
          pct_abandoned: number
          pct_payment_failed: number
          pct_to_completion: number
          pct_to_customer: number
          pct_to_payment: number
          reached_completion: number
          reached_customer: number
          reached_payment: number
          total_sessions: number
        }[]
      }
      get_admin_wide_checkout_surfaces: {
        Args: {
          p_end_date?: string
          p_environment?: string
          p_start_date?: string
        }
        Returns: {
          event_count: number
          session_count: number
          surface: string
        }[]
      }
      get_admin_wide_error_breakdown: {
        Args: {
          p_end_date?: string
          p_environment?: string
          p_start_date?: string
        }
        Returns: {
          error_group: string
          event_count: number
        }[]
      }
      get_admin_wide_event_catalog: {
        Args: {
          p_end_date?: string
          p_environment?: string
          p_limit?: number
          p_start_date?: string
        }
        Returns: {
          category: Database["public"]["Enums"]["event_category"]
          event_count: number
          event_name: string
          pct_of_total: number
        }[]
      }
      get_admin_wide_event_sources: {
        Args: {
          p_end_date?: string
          p_environment?: string
          p_start_date?: string
        }
        Returns: {
          event_count: number
          session_count: number
          source: string
        }[]
      }
      get_admin_wide_event_volume: {
        Args: {
          p_end_date?: string
          p_environment?: string
          p_start_date?: string
        }
        Returns: {
          bucket: string
          category: Database["public"]["Enums"]["event_category"]
          error_count: number
          event_count: number
        }[]
      }
      get_admin_wide_events: {
        Args: {
          p_category?: string
          p_correlation_id?: string
          p_end_date?: string
          p_environment?: string
          p_event_name?: string
          p_limit?: number
          p_offset?: number
          p_organization_id?: string
          p_search?: string
          p_severity?: string
          p_start_date?: string
        }
        Returns: {
          attributes: Json
          category: Database["public"]["Enums"]["event_category"]
          correlation_id: string
          created_at: string
          customer_id: string
          environment: string
          event_id: string
          event_name: string
          message: string
          organization_id: string
          organization_name: string
          session_id: string
          severity: Database["public"]["Enums"]["event_severity"]
          source: string
          url: string
          user_agent: string
          user_id: string
        }[]
      }
      get_admin_wide_failure_reasons: {
        Args: {
          p_end_date?: string
          p_environment?: string
          p_limit?: number
          p_start_date?: string
        }
        Returns: {
          event_name: string
          last_seen: string
          occurrences: number
          reason: string
        }[]
      }
      get_admin_wide_merchant_activation: {
        Args: {
          p_end_date?: string
          p_environment?: string
          p_start_date?: string
        }
        Returns: {
          event_count: number
          org_count: number
          step_name: string
          step_order: number
        }[]
      }
      get_admin_wide_onboarding_funnel: {
        Args: {
          p_end_date?: string
          p_environment?: string
          p_start_date?: string
        }
        Returns: {
          event_count: number
          org_count: number
          step_name: string
          step_order: number
        }[]
      }
      get_admin_wide_payment_providers: {
        Args: {
          p_end_date?: string
          p_environment?: string
          p_start_date?: string
        }
        Returns: {
          completed_count: number
          conversion_rate_pct: number
          failed_count: number
          failure_rate_pct: number
          initiated_count: number
          provider: string
        }[]
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
      get_analytics_share: {
        Args: { p_share_id: string }
        Returns: {
          chart_type: string
          description: string
          image_url: string
          title: string
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
          p_end_date?: string
          p_limit?: number
          p_offset?: number
          p_organization_id: string
          p_severity?: string
          p_start_date?: string
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
          p_environment?: string
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
          p_end_date?: string
          p_environment?: string
          p_limit?: number
          p_offset?: number
          p_organization_id: string
          p_start_date?: string
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
      get_app_config_value: { Args: { p_key: string }; Returns: string }
      get_assistant_conversations: {
        Args: { p_limit?: number; p_merchant_id: string; p_offset?: number }
        Returns: {
          conversation_id: string
          created_at: string
          last_message_at: string
          metadata: Json
          title: string
        }[]
      }
      get_assistant_merchant_context: {
        Args: { p_merchant_id: string; p_organization_id: string }
        Returns: {
          default_currency: string
          is_admin: boolean
          is_starter_business: boolean
          merchant_email: string
          merchant_name: string
          onboarded: boolean
          onboarding_status: string
          organization_kyc_status: string
          organization_name: string
          organization_verification_status: string
          permissions: string[]
          website_url: string
        }[]
      }
      get_assistant_merchant_permissions: {
        Args: { p_merchant_id: string; p_organization_id: string }
        Returns: string[]
      }
      get_assistant_messages: {
        Args: {
          p_conversation_id: string
          p_limit?: number
          p_merchant_id: string
        }
        Returns: {
          content: string
          created_at: string
          message_id: string
          message_index: number
          metadata: Json
          role: string
        }[]
      }
      get_assistant_pending_run: {
        Args: { p_conversation_id: string; p_merchant_id: string }
        Returns: {
          conversation_id: string
          created_at: string
          environment: string
          merchant_id: string
          messages_snapshot: Json
          mode: string
          organization_id: string
          pending_gate: Json | null
          run_id: string
          session_approved_tools: string[]
          status: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "assistant_runs"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_assistant_run: {
        Args: { p_merchant_id: string; p_run_id: string }
        Returns: Json
      }
      get_assistant_settings: {
        Args: { p_merchant_id: string; p_organization_id: string }
        Returns: Json
      }
      get_average_monthly_growth_rate: {
        Args: {
          p_environment?: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: number
      }
      get_average_transaction_value_by_date: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_organization_id?: string
          p_start_date: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          avg_transaction_value: number
          date: string
          total_gross_amount: number
          transaction_count: number
        }[]
      }
      get_base_url: { Args: never; Returns: string }
      get_beneficiary_payout_api: {
        Args: { p_organization_id: string; p_payout_id: string }
        Returns: {
          account_id: string
          amount: number
          created_at: string
          created_by: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          metadata: Json
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          payout_id: string
          payout_method_id: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          status: Database["public"]["Enums"]["payout_status"]
          updated_at: string
        }[]
      }
      get_beneficiary_payout_by_wave_id: {
        Args: { p_wave_payout_id: string }
        Returns: {
          amount: number
          created_at: string
          created_by: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          metadata: Json
          payout_id: string
          status: Database["public"]["Enums"]["payout_status"]
          updated_at: string
        }[]
      }
      get_beneficiary_payout_count: {
        Args: {
          p_end_date?: string
          p_merchant_id: string
          p_start_date?: string
        }
        Returns: number
      }
      get_beneficiary_payout_fee_details: {
        Args: {
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_merchant_id: string
          p_provider_code?: Database["public"]["Enums"]["provider_code"]
        }
        Returns: {
          fee_name: string
          fee_percentage: number
          fixed_amount: number
          organization_id: string
        }[]
      }
      get_beneficiary_payout_metrics: {
        Args: {
          p_end_date?: string
          p_merchant_id: string
          p_start_date?: string
        }
        Returns: {
          failed_payouts: number
          pending_amount: number
          pending_payouts: number
          successful_amount: number
          successful_payouts: number
          total_amount: number
          total_payouts: number
        }[]
      }
      get_beneficiary_payout_success_rate: {
        Args: {
          p_end_date?: string
          p_merchant_id: string
          p_start_date?: string
        }
        Returns: number
      }
      get_blocking_customer_obligations: {
        Args: {
          p_customer_id?: string
          p_environment?: string
          p_organization_id: string
          p_product_id?: string
          p_subscription_id?: string
        }
        Returns: {
          amount_remaining: number
          checkout_url: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          due_date: string
          invoice_id: string
          invoice_number: string
          origin: string
          payment_url: string
          product_id: string
          subscription_id: string
        }[]
      }
      get_bnpl_checkout_display: {
        Args: {
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_installment_count: number
          p_organization_id: string
          p_product_amount: number
        }
        Returns: Json
      }
      get_bnpl_config_summary: {
        Args: { p_organization_id?: string }
        Returns: {
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_interest_rate: number
          is_active: boolean
          max_installments: number
          min_installments: number
          min_product_amount: number
          organization_id: string
          organization_name: string
          total_customers: number
          total_outstanding: number
          total_plans: number
        }[]
      }
      get_bnpl_merchant_eligibility: {
        Args: { p_organization_id: string }
        Returns: Json
      }
      get_bnpl_plan_fees: {
        Args: { p_plan_id: string }
        Returns: {
          collected_amount: number
          currency_code: Database["public"]["Enums"]["currency_code"]
          fee_payer: Database["public"]["Enums"]["fee_payer_type"]
          fee_type: Database["public"]["Enums"]["bnpl_fee_type"]
          pending_amount: number
          total_amount: number
        }[]
      }
      get_channel_balance_adjustments: {
        Args: {
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_limit?: number
          p_provider_code?: Database["public"]["Enums"]["provider_code"]
        }
        Returns: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string
          history_id: string
          is_manual_adjustment: boolean
          operation_type: string
          provider_code: Database["public"]["Enums"]["provider_code"]
        }[]
      }
      get_channel_mix_by_date: {
        Args: {
          p_active_merchant_min_gtv?: number
          p_active_merchants_only?: boolean
          p_end_date: string
          p_environment?: string
          p_organization_id?: string
          p_start_date: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          channel: string
          date: string
          gtv_amount: number
          gtv_pct: number
          transaction_count: number
          tx_pct: number
        }[]
      }
      get_checkout_colors: {
        Args: { p_organization_id: string }
        Returns: {
          pay_button_bg_color: string
        }[]
      }
      get_checkout_duration_distribution: {
        Args: {
          p_bucket_size_seconds?: number
          p_end_date: string
          p_environment?: string
          p_organization_id?: string
          p_start_date: string
        }
        Returns: {
          bucket_end_seconds: number
          bucket_start_seconds: number
          checkout_count: number
          duration_bucket: string
          percentage: number
        }[]
      }
      get_checkout_duration_stats: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_organization_id?: string
          p_start_date: string
        }
        Returns: {
          avg_checkout_duration_seconds: number
          completed_checkout_duration_seconds: number
          completion_rate: number
          date: string
          median_checkout_duration_seconds: number
          successful_checkouts: number
          total_checkouts: number
        }[]
      }
      get_checkout_session: {
        Args: { p_checkout_session_id: string }
        Returns: Json
      }
      get_checkout_session_api: {
        Args: { p_checkout_session_id: string; p_organization_id: string }
        Returns: {
          amount: number
          cancel_url: string
          checkout_session_id: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
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
          status: Database["public"]["Enums"]["checkout_session_status"]
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
      get_checkout_session_details: {
        Args: { p_checkout_session_id: string }
        Returns: Json
      }
      get_checkout_session_details_for_webhook: {
        Args: { p_checkout_session_id: string }
        Returns: {
          allow_coupon_code: boolean
          allow_quantity: boolean
          amount: number
          cancel_url: string
          checkout_session_id: string
          created_at: string
          created_by: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_email: string
          customer_id: string
          customer_name: string
          customer_phone: string
          description: string
          expires_at: string
          metadata: Json
          organization_id: string
          payment_link_id: string
          product_id: string
          quantity: number
          status: Database["public"]["Enums"]["checkout_session_status"]
          subscription_id: string
          success_url: string
          title: string
          updated_at: string
        }[]
      }
      get_checkout_session_line_items: {
        Args: { p_checkout_session_id: string }
        Returns: Json
      }
      get_checkout_spi_payment_status: {
        Args: { p_checkout_session_id: string }
        Returns: Json
      }
      get_cli_device_request: {
        Args: { p_device_code: string }
        Returns: {
          created_at: string
          device_code: string
          expires_at: string
          interval: number
          merchant_id: string | null
          organization_id: string | null
          status: Database["public"]["Enums"]["cli_device_request_status"]
          user_code: string
        }
        SetofOptions: {
          from: "*"
          to: "cli_device_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_cli_device_request_for_verification: {
        Args: { p_user_code: string }
        Returns: {
          device_code: string
          expires_at: string
          status: Database["public"]["Enums"]["cli_device_request_status"]
        }[]
      }
      get_cli_request_status_and_ids: {
        Args: { p_device_code: string }
        Returns: {
          expires_at: string
          merchant_id: string
          organization_id: string
          status: Database["public"]["Enums"]["cli_device_request_status"]
        }[]
      }
      get_client_info: {
        Args: never
        Returns: {
          browser: string
          ip_address: string
          operating_system: string
        }[]
      }
      get_coupon_details_for_management: {
        Args: {
          p_coupon_id?: string
          p_merchant_id?: string
          p_organization_id: string
        }
        Returns: {
          code: string
          coupon_id: string
          created_at: string
          current_uses: number
          customer_type: Database["public"]["Enums"]["customer_type"]
          description: string
          discount_fixed_amount: number
          discount_percentage: number
          discount_type: Database["public"]["Enums"]["discount_type"]
          expires_at: string
          is_active: boolean
          max_quantity_per_use: number
          max_uses: number
          organization_id: string
          plan_links: Json
          product_links: Json
          scope_type: string
          updated_at: string
          usage_frequency_limit: Database["public"]["Enums"]["usage_frequency"]
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
      get_coupon_preview: {
        Args: {
          p_base_amount?: number
          p_coupon_id: string
          p_quantity?: number
        }
        Returns: Json
      }
      get_currency_conversion_rate: {
        Args: {
          p_from_currency: Database["public"]["Enums"]["currency_code"]
          p_to_currency: Database["public"]["Enums"]["currency_code"]
        }
        Returns: number
      }
      get_current_merchant_email: {
        Args: { p_merchant_id: string }
        Returns: string
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
      get_customer_bnpl_schedule: {
        Args: { p_customer_id: string; p_plan_id: string }
        Returns: {
          due_date: string
          installment_number: number
          interest_amount: number
          paid_at: string
          principal_amount: number
          status: Database["public"]["Enums"]["transaction_status"]
          total_amount: number
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
      get_customer_card_details_from_transactions: {
        Args: { p_customer_ids: string[] }
        Returns: {
          card_brand: string
          card_last4: string
          customer_id: string
        }[]
      }
      get_customer_card_payment_methods: {
        Args: { p_customer_ids: string[]; p_type?: string }
        Returns: {
          card_brand: string
          customer_id: string
          is_default: boolean
          last4: string
          type: string
          updated_at: string
        }[]
      }
      get_customer_details_for_payment: {
        Args: { p_customer_id: string }
        Returns: {
          email: string
          name: string
          provider_customer_id: string
        }[]
      }
      get_customer_invoice_api: {
        Args: { p_invoice_id: string; p_organization_id: string }
        Returns: Json
      }
      get_customer_invoice_by_id: {
        Args: { p_invoice_id: string; p_merchant_id?: string }
        Returns: {
          amount: number
          created_at: string
          created_by: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer: Json
          customer_details: Json
          customer_id: string
          customer_invoice_id: string
          description: string
          due_date: string
          environment: string
          invoice_number: string
          line_items: Json
          organization_id: string
          payment_details: Json
          payment_request_id: string
          pdf_url: string
          status: Database["public"]["Enums"]["invoice_status"]
          template: Json
          updated_at: string
        }[]
      }
      get_customer_invoice_by_token: {
        Args: { p_token: string }
        Returns: Json
      }
      get_customer_mobile_money_payment_phones: {
        Args: { p_customer_ids: string[] }
        Returns: {
          customer_id: string
          payment_mobile: string
          provider_code: Database["public"]["Enums"]["provider_code"]
        }[]
      }
      get_customer_payment_method_variety_counts: {
        Args: { p_customer_ids: string[] }
        Returns: {
          customer_id: string
          variety_count: number
        }[]
      }
      get_customer_portal_org_url: {
        Args: { p_organization_id: string }
        Returns: string
      }
      get_customer_portal_organization_by_slug: {
        Args: { p_slug: string }
        Returns: {
          name: string
          organization_id: string
          slug: string
        }[]
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
          plan_billing_frequency: Database["public"]["Enums"]["billing_interval"]
          plan_currency_code: Database["public"]["Enums"]["currency_code"]
          plan_description: string
          plan_name: string
          product_id: string
          start_date: string
          status: Database["public"]["Enums"]["subscription_status"]
          subscription_id: string
          updated_at: string
        }[]
      }
      get_detailed_errors: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_error_type?: string
          p_limit?: number
          p_offset?: number
          p_organization_id?: string
          p_start_date: string
        }
        Returns: {
          context: Json
          created_at: string
          error_category: string
          error_id: string
          error_message: string
          error_type: string
          organization_name: string
        }[]
      }
      get_dispute_api: {
        Args: { p_dispute_id: string; p_organization_id: string }
        Returns: {
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_email: string
          customer_id: string
          customer_name: string
          dispute_id: string
          evidence_details: Json
          fee_amount: number
          reason: string
          resolution_date: string
          resolution_details: string
          status: Database["public"]["Enums"]["dispute_status"]
          stripe_charge_id: string
          stripe_dispute_id: string
          transaction_gross_amount: number
          transaction_id: string
          transaction_status: Database["public"]["Enums"]["transaction_status"]
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
      get_duplicate_customers_by_phone_report: {
        Args: never
        Returns: {
          count: number
          customer_ids: string[]
          organization_id: string
          phone_number: string
        }[]
      }
      get_duplicate_customers_report: {
        Args: never
        Returns: {
          count: number
          customer_ids: string[]
          email: string
          organization_id: string
        }[]
      }
      get_effective_other_fee_config: {
        Args: {
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_organization_id: string
          p_payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          p_provider_code?: Database["public"]["Enums"]["provider_code"]
          p_subcategory: Database["public"]["Enums"]["fee_subcategory"]
        }
        Returns: {
          fee_name: string
          fixed_amount: number
          percentage: number
          tier_name: string
        }[]
      }
      get_effective_payout_fee_config: {
        Args: {
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_organization_id: string
          p_payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          p_provider_code?: Database["public"]["Enums"]["provider_code"]
          p_subcategory?: Database["public"]["Enums"]["fee_subcategory"]
        }
        Returns: {
          fee_name: string
          fixed_amount: number
          percentage: number
          tier_name: string
        }[]
      }
      get_effective_processing_fee_params: {
        Args: {
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_is_pos?: boolean
          p_organization_id: string
          p_payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          p_provider_code: Database["public"]["Enums"]["provider_code"]
        }
        Returns: {
          fixed_amount: number
          micro_threshold: number
          percentage: number
        }[]
      }
      get_effective_rate_limit: {
        Args: {
          p_api_key: string
          p_endpoint: string
          p_organization_id: string
        }
        Returns: {
          environment: string
          matched_policy_id: string
          requests_per_day: number
          requests_per_minute: number
          used_configured_policy: boolean
        }[]
      }
      get_export_job_status: {
        Args: { p_job_id: string }
        Returns: {
          error_message: string
          job_id: string
          job_type: string
          organization_id: string
          progress: number
          progress_step: string
          result_filename: string
          result_path: string
          status: string
        }[]
      }
      get_fee_take_rate_by_date: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_organization_id?: string
          p_start_date: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          date: string
          take_rate: number
          total_fees: number
          total_gross: number
        }[]
      }
      get_global_revenue_by_date: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_organization_id?: string
          p_start_date: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          date: string
          revenue: number
        }[]
      }
      get_global_transaction_stats: {
        Args: {
          p_environment?: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          currency_code: Database["public"]["Enums"]["currency_code"]
          total_fee_amount: number
          total_gross_amount: number
          total_net_amount: number
          total_transactions: number
        }[]
      }
      get_global_transaction_volume_by_date: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_organization_id?: string
          p_start_date: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          amount: number
          count: number
          date: string
        }[]
      }
      get_gross_revenue_per_transaction_by_date: {
        Args: {
          p_active_merchant_min_gtv?: number
          p_active_merchants_only?: boolean
          p_end_date: string
          p_environment?: string
          p_organization_id?: string
          p_start_date: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          date: string
          gross_rev_per_tx: number
          net_rev_per_tx: number
          total_fees: number
          total_net_revenue: number
          total_provider_cost: number
          transaction_count: number
        }[]
      }
      get_gtv_concentration_by_date: {
        Args: {
          p_active_merchant_min_gtv?: number
          p_active_merchants_only?: boolean
          p_end_date: string
          p_environment?: string
          p_organization_id?: string
          p_start_date: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          active_merchants: number
          date: string
          top1_gtv: number
          top1_gtv_pct: number
          top3_gtv: number
          top3_gtv_pct: number
          total_gtv: number
        }[]
      }
      get_installed_integrations: {
        Args: { p_organization_id: string }
        Returns: Json
      }
      get_investor_performance_by_date: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_organization_id?: string
          p_start_date: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          completed_txns: number
          date: string
          gmv: number
          gross_profit: number
          platform_fees: number
          provider_cost: number
        }[]
      }
      get_invitation_details: {
        Args: { p_token: string }
        Returns: {
          invitation_email: string
          organization_id: string
          organization_name: string
          role: string
        }[]
      }
      get_invoice_base_url: { Args: never; Returns: string }
      get_invoice_spi_payment_status: {
        Args: { p_invoice_id: string; p_organization_id: string }
        Returns: Json
      }
      get_invoice_summary: {
        Args: { p_organization_id: string }
        Returns: Json
      }
      get_job_application_conversion_funnel: {
        Args: never
        Returns: {
          conversion_rate: number
          count: number
          percentage: number
          stage: string
        }[]
      }
      get_job_applications_by_department: {
        Args: never
        Returns: {
          acceptance_rate: number
          accepted_applications: number
          department: string
          pending_applications: number
          rejected_applications: number
          reviewed_applications: number
          total_applications: number
        }[]
      }
      get_job_applications_by_status: {
        Args: never
        Returns: {
          count: number
          percentage: number
          status: string
        }[]
      }
      get_job_applications_over_time: {
        Args: { p_end_date: string; p_start_date: string }
        Returns: {
          accepted_applications: number
          date: string
          pending_applications: number
          rejected_applications: number
          reviewed_applications: number
          total_applications: number
        }[]
      }
      get_live_activation_status: {
        Args: { p_merchant_id: string; p_provisioning_key_id: string }
        Returns: Json
      }
      get_location_from_ip: {
        Args: { p_ip_address: string }
        Returns: {
          city: string
          country: string
        }[]
      }
      get_mcp_device_request_for_verification: {
        Args: { p_user_code: string }
        Returns: {
          device_code: string
          expires_at: string
          status: Database["public"]["Enums"]["cli_device_request_status"]
        }[]
      }
      get_mcp_request_status_and_ids: {
        Args: { p_device_code: string }
        Returns: {
          expires_at: string
          merchant_id: string
          organization_id: string
          status: Database["public"]["Enums"]["cli_device_request_status"]
        }[]
      }
      get_merchant: {
        Args: { p_merchant_id: string }
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
      get_merchant_account_details: {
        Args: {
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_merchant_id: string
        }
        Returns: {
          account_id: string
          organization_id: string
        }[]
      }
      get_merchant_account_id: {
        Args: {
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_merchant_id: string
        }
        Returns: string
      }
      get_merchant_acquisition_metrics_by_date: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_start_date: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          active_merchants: number
          avg_net_revenue_per_merchant: number
          cac: number
          date: string
          marketing_spend: number
          new_merchants: number
          payback_months: number
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
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_merchant_id: string
          p_organization_id: string
        }
        Returns: {
          as_of_date: string
          balance: number
          currency_code: Database["public"]["Enums"]["currency_code"]
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
      get_merchant_details_for_wave: {
        Args: { p_merchant_id: string; p_organization_id: string }
        Returns: {
          business_description: string
          country: string
          email: string
          industry: string
          merchant_id: string
          merchant_name: string
          organization_id: string
          organization_name: string
          phone_number: string
          registration_number: string
          website_url: string
        }[]
      }
      get_merchant_email: { Args: { p_merchant_id: string }; Returns: string }
      get_merchant_from_organization: {
        Args: { p_organization_id: string }
        Returns: string
      }
      get_merchant_health_stats: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_organization_id?: string
          p_start_date: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          avg_fee_take_rate: number
          avg_transaction_value: number
          total_gtv: number
          total_npv: number
          total_transactions: number
        }[]
      }
      get_merchant_mrr: {
        Args: { p_merchant_id: string; p_organization_id?: string }
        Returns: {
          currency_code: string
          merchant_id: string
          mrr: number
        }[]
      }
      get_merchant_organization_id: {
        Args: { p_merchant_id: string }
        Returns: string
      }
      get_merchant_pipeline_stats: {
        Args: { p_environment?: string }
        Returns: {
          active_processing: number
          onboarding: number
          total_orgs: number
          verified_not_active: number
        }[]
      }
      get_merchant_platform_fees: {
        Args: { p_merchant_id: string }
        Returns: {
          last_month_fees: number
          month_to_date_fees: number
          organization_id: string
          outstanding_balance: number
        }[]
      }
      get_merchant_retention_by_date: {
        Args: {
          p_active_merchant_min_gtv?: number
          p_active_merchants_only?: boolean
          p_end_date: string
          p_environment?: string
          p_organization_id?: string
          p_start_date: string
        }
        Returns: {
          active_merchants: number
          churn_rate: number
          churned_merchants: number
          date: string
          previous_active_merchants: number
          retained_merchants: number
          retention_rate: number
        }[]
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
      get_most_popular_qr_code: {
        Args: {
          p_custom_end?: string
          p_custom_start?: string
          p_date_range?: string
          p_environment?: string
          p_organization_id: string
        }
        Returns: Json
      }
      get_mtn_refund_provider_ids: {
        Args: { p_transaction_id: string }
        Returns: Json
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
      get_network_customer_for_api: {
        Args: {
          p_customer_id: string
          p_environment?: string
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
          currency_code: Database["public"]["Enums"]["currency_code"]
        }[]
      }
      get_network_refund_for_api: {
        Args: {
          p_environment?: string
          p_network_membership_id: string
          p_read_scope?: string
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
          status: Database["public"]["Enums"]["refund_status"]
          transaction_id: string
          updated_at: string
        }[]
      }
      get_network_transaction_for_api: {
        Args: {
          p_environment?: string
          p_network_membership_id: string
          p_read_scope?: string
          p_transaction_id: string
        }
        Returns: {
          capability_key: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
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
          operator_fee_currency: Database["public"]["Enums"]["currency_code"]
          operator_organization_id: string
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          provider_checkout_id: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_transaction_id: string
          public_account_id: string
          refunded_amount: number
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }[]
      }
      get_network_webhook_enrichment: {
        Args: { p_member_organization_id: string; p_transaction_id: string }
        Returns: {
          customer_id: string
          member_organization_name: string
        }[]
      }
      get_next_message_index: {
        Args: { p_conversation_id: string; p_merchant_id: string }
        Returns: number
      }
      get_npv_by_date: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_organization_id?: string
          p_start_date: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          date: string
          fee_amount: number
          gross_amount: number
          npv: number
        }[]
      }
      get_or_create_bootstrap_partner: { Args: never; Returns: string }
      get_or_create_self_service_partner: {
        Args: { p_email: string; p_user_id: string }
        Returns: string
      }
      get_or_create_walk_in_customer: {
        Args: { p_merchant_id?: string; p_organization_id: string }
        Returns: string
      }
      get_organization_api_interactions: {
        Args: {
          p_environment?: string
          p_limit?: number
          p_offset?: number
          p_organization_id: string
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
          request_method: string
          request_payload: Json
          response_payload: Json
          response_status: number
          response_time: number
          target_organization_id: string
          total_count: number
        }[]
      }
      get_organization_api_usage_count: {
        Args: { p_organization_id: string }
        Returns: number
      }
      get_organization_api_usage_stats: {
        Args: { p_organization_id: string }
        Returns: {
          avg_response_time: number
          failed_requests: number
          last_request_at: string
          successful_requests: number
          total_requests: number
        }[]
      }
      get_organization_balance: {
        Args: {
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_organization_id: string
        }
        Returns: number
      }
      get_organization_by_custom_domain: {
        Args: { p_domain: string }
        Returns: {
          slug: string
        }[]
      }
      get_organization_checkout_urls: {
        Args: { p_organization_id: string }
        Returns: {
          cancel_url: string
          success_url: string
        }[]
      }
      get_organization_country_code: {
        Args: { p_organization_id: string }
        Returns: string
      }
      get_organization_coupons: {
        Args: { p_environment?: string; p_organization_id: string }
        Returns: {
          applies_to_product_types: Database["public"]["Enums"]["product_type"][]
          code: string
          completed_redemptions: number
          coupon_id: string
          created_at: string
          current_uses: number
          customer_type: Database["public"]["Enums"]["customer_type"]
          description: string
          discount_fixed_amount: number
          discount_percentage: number
          discount_type: Database["public"]["Enums"]["discount_type"]
          distinct_customers_completed: number
          expires_at: string
          is_active: boolean
          max_quantity_per_use: number
          max_uses: number
          product_links: Json
          scope_type: string
          updated_at: string
          usage_frequency_limit: Database["public"]["Enums"]["usage_frequency"]
          usage_limit_value: number
          valid_from: string
        }[]
      }
      get_organization_current_tier: {
        Args: {
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_organization_id: string
        }
        Returns: string
      }
      get_organization_customer_portal_policy_resolved: {
        Args: { p_merchant_id: string; p_organization_id: string }
        Returns: {
          allow_cancel: boolean
          allow_email_auth: boolean
          allow_email_change: boolean
          allow_invoice_edit: boolean
          allow_pause: boolean
          allow_payment_method_update: boolean
          allow_plan_change: boolean
          allow_resume: boolean
          allow_sms_auth: boolean
          allow_trusted_launch: boolean
          collect_cancellation_reason: boolean
          created_at: string
          organization_id: string
          portal_session_ttl_seconds: number
          return_url_allowlist: string[] | null
          show_metered_usage: boolean
          updated_at: string
          verification_max_attempts: number
        }[]
        SetofOptions: {
          from: "*"
          to: "organization_customer_portal_policies"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_organization_domains: {
        Args: { p_organization_id: string }
        Returns: Json
      }
      get_organization_fee_structure: {
        Args: {
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_organization_id: string
        }
        Returns: {
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string
          fee_category: Database["public"]["Enums"]["fee_category"]
          fee_structure_id: string
          fee_subcategory: Database["public"]["Enums"]["fee_subcategory"]
          fixed_amount: number
          formatted_amount: string
          is_free: boolean
          name: string
          percentage: number
          source: string
        }[]
      }
      get_organization_gross_transactions: {
        Args: { p_organization_id: string }
        Returns: number
      }
      get_organization_id_for_merchant: {
        Args: { p_merchant_id: string }
        Returns: string
      }
      get_organization_invoice_templates: {
        Args: { p_organization_id: string }
        Returns: {
          created_at: string | null
          from_details: Json | null
          is_default: boolean | null
          name: string
          note_details: Json | null
          organization_id: string
          payment_details: Json | null
          template: Json | null
          template_id: string
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "invoice_templates"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_organization_invoices: {
        Args: {
          p_organization_id: string
          p_page?: number
          p_page_size?: number
          p_status?: string
        }
        Returns: {
          amount: number
          created_at: string
          created_by: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer: Json
          customer_id: string
          customer_invoice_id: string
          description: string
          due_date: string
          environment: string
          invoice_number: string
          organization_id: string
          payment_request: Json
          pdf_url: string
          public_id: string
          status: Database["public"]["Enums"]["invoice_status"]
          total_count: number
          updated_at: string
        }[]
      }
      get_organization_kyc_status: {
        Args: { p_merchant_id: string; p_organization_id: string }
        Returns: {
          approved_at: string
          business_description: string
          created_at: string
          legal_representative_id_url: string
          status: Database["public"]["Enums"]["kyc_status"]
        }[]
      }
      get_organization_payment_availability_settings: {
        Args: { p_organization_id: string }
        Returns: {
          availability_delay_hours: number
          is_active: boolean
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          provider_code: Database["public"]["Enums"]["provider_code"]
          setting_type: string
        }[]
      }
      get_organization_radar_settings_api: {
        Args: { p_organization_id: string }
        Returns: {
          enabled: boolean
          mode: Database["public"]["Enums"]["radar_mode"]
          organization_id: string
          radar_meter_id: string
          stripe_radar_passthrough: boolean
        }[]
      }
      get_organization_spi_account: {
        Args: { p_organization_id: string }
        Returns: string
      }
      get_organization_starter_kyb_activation: {
        Args: { p_merchant_id: string; p_organization_id: string }
        Returns: {
          approved_at: string
          business_description: string
          created_at: string
          legal_representative_id_url: string
          live_gross_volume_xof: number
          should_show_activation_banner: boolean
          status: Database["public"]["Enums"]["kyc_status"]
          threshold_xof: number
        }[]
      }
      get_organization_stats: {
        Args: { p_environment?: string }
        Returns: {
          total_customers: number
          total_merchants: number
          total_organizations: number
          verified_organizations: number
        }[]
      }
      get_organization_uemoa_country_code: {
        Args: { p_organization_id: string }
        Returns: string
      }
      get_organization_volume_xof: {
        Args: {
          p_organization_id: string
          p_period_end: string
          p_period_start: string
        }
        Returns: number
      }
      get_organization_webhook_logs: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_organization_id: string
          p_status_codes?: number[]
        }
        Returns: {
          amount: number
          attempt_number: number
          compte_paye: string
          compte_payeur: string
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
          spi_event_code: Database["public"]["Enums"]["spi_webhook_event_code"]
          spi_tx_id: string
          success: boolean
          total_count: number
          user_agent: string
          webhook_id: string
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
      get_payment_availability_delay: {
        Args: {
          p_organization_id: string
          p_payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          p_provider_code: Database["public"]["Enums"]["provider_code"]
        }
        Returns: string
      }
      get_payment_link: {
        Args: {
          p_link_id: string
          p_merchant_id?: string
          p_organization_id?: string
        }
        Returns: {
          allow_coupon_code: boolean
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string
          expires_at: string
          is_active: boolean
          link_id: string
          link_type: Database["public"]["Enums"]["link_type"]
          merchant_id: string
          metadata: Json
          organization_id: string
          plan_amount: number
          plan_name: string
          price: number
          product_amount: number
          product_id: string
          product_name: string
          success_url: string
          title: string
          updated_at: string
          url: string
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
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string
          environment: string
          expires_at: string
          is_active: boolean
          line_items: Json
          link_id: string
          link_type: Database["public"]["Enums"]["link_type"]
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
      get_payment_link_available_providers: {
        Args: { p_organization_id: string }
        Returns: {
          code: Database["public"]["Enums"]["provider_code"]
          name: string
        }[]
      }
      get_payment_provider_fees: {
        Args: never
        Returns: {
          cost_fix: number
          cost_pct: number
          currency_code: Database["public"]["Enums"]["currency_code"]
          id: string
          is_active: boolean
          price_fix: number
          price_pct: number
          provider_code: Database["public"]["Enums"]["provider_code"]
        }[]
      }
      get_payment_request_api: {
        Args: { p_organization_id: string; p_request_id: string }
        Returns: {
          amount: number
          created_at: string
          created_by: string
          currency_code: Database["public"]["Enums"]["currency_code"]
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
      get_payment_success_rates_by_provider: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_organization_id?: string
          p_start_date: string
        }
        Returns: {
          expired_transactions: number
          failed_transactions: number
          pending_transactions: number
          provider_code: string
          success_rate: number
          successful_transactions: number
          total_transactions: number
        }[]
      }
      get_payout_api: {
        Args: { p_organization_id: string; p_payout_id: string }
        Returns: {
          account_id: string
          amount: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          metadata: Json
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          payout_id: string
          payout_method_id: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          status: Database["public"]["Enums"]["payout_status"]
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
      get_payout_processing_dashboard: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_organization_id?: string
          p_start_date: string
        }
        Returns: {
          avg_processing_time_hours: number
          date: string
          failed_payouts: number
          pending_payouts: number
          success_rate: number
          successful_payouts: number
          total_payouts: number
        }[]
      }
      get_payout_status: {
        Args: { p_payout_id: string }
        Returns: {
          status: Database["public"]["Enums"]["payout_status"]
          wave_payout_id: string
        }[]
      }
      get_payout_status_by_wave_id: {
        Args: { p_wave_payout_id: string }
        Returns: {
          payout_id: string
          status: Database["public"]["Enums"]["payout_status"]
        }[]
      }
      get_pending_beneficiary_payout_amount: {
        Args: {
          p_end_date?: string
          p_merchant_id: string
          p_start_date?: string
        }
        Returns: number
      }
      get_platform_channel_balances: {
        Args: { p_environment?: string }
        Returns: {
          currency_code: Database["public"]["Enums"]["currency_code"]
          current_balance: number
          funding_shortfall: number
          gross_inflow: number
          last_updated: string
          needs_funding: boolean
          outflow_total: number
          payout_count: number
          payout_outflow_total: number
          platform_revenue: number
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_cost_total: number
          refund_count: number
          refund_outflow_total: number
          required_float: number
          total_liability: number
          transaction_count: number
        }[]
      }
      get_platform_default_fees: {
        Args: { p_currency_code?: Database["public"]["Enums"]["currency_code"] }
        Returns: {
          currency_code: Database["public"]["Enums"]["currency_code"]
          default_fee_id: string
          description: string
          fee_category: Database["public"]["Enums"]["fee_category"]
          fee_payer: Database["public"]["Enums"]["fee_payer_type"]
          fee_subcategory: Database["public"]["Enums"]["fee_subcategory"]
          fixed_amount: number
          is_active: boolean
          is_visible: boolean
          name: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          percentage: number
          provider_code: Database["public"]["Enums"]["provider_code"]
        }[]
      }
      get_platform_error_rates: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_organization_id?: string
          p_start_date: string
        }
        Returns: {
          api_errors: number
          date: string
          payment_failures: number
          total_errors: number
          webhook_failures: number
        }[]
      }
      get_platform_expenses: {
        Args: never
        Returns: {
          amount: number
          apr_amount: number
          aug_amount: number
          category: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          dec_amount: number
          expense_id: string
          feb_amount: number
          frequency: string
          has_variable_months: boolean
          is_active: boolean
          jan_amount: number
          jul_amount: number
          jun_amount: number
          mar_amount: number
          may_amount: number
          monthly_equivalent: number
          name: string
          nov_amount: number
          oct_amount: number
          sep_amount: number
          yearly_average: number
        }[]
      }
      get_platform_first_transaction_date: {
        Args: { p_environment?: string }
        Returns: string
      }
      get_platform_growth_stats: {
        Args: { p_end_date: string; p_start_date: string }
        Returns: {
          date: string
          new_merchants: number
          new_organizations: number
        }[]
      }
      get_platform_investments: {
        Args: { p_end_date?: string; p_start_date?: string }
        Returns: {
          amount: number
          category: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          date: string
          description: string
          investment_id: string
          is_active: boolean
          name: string
        }[]
      }
      get_platform_setting: { Args: { p_key: string }; Returns: Json }
      get_platform_treasury_summary: {
        Args: {
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_environment?: string
        }
        Returns: {
          channels_needing_funding: number
          total_current_balance: number
          total_funding_shortfall: number
          total_gross_inflow: number
          total_outflow: number
          total_platform_revenue: number
          total_provider_cost: number
          total_required_float: number
        }[]
      }
      get_pos_completion_rate: {
        Args: {
          p_custom_end?: string
          p_custom_start?: string
          p_date_range?: string
          p_organization_id: string
        }
        Returns: Json
      }
      get_pos_spi_payment_status: {
        Args: { p_checkout_session_id: string; p_organization_id: string }
        Returns: Json
      }
      get_pos_total_revenue: {
        Args: {
          p_custom_end?: string
          p_custom_start?: string
          p_date_range?: string
          p_organization_id: string
        }
        Returns: number
      }
      get_pos_transaction_count: {
        Args: {
          p_custom_end?: string
          p_custom_start?: string
          p_date_range?: string
          p_organization_id: string
        }
        Returns: number
      }
      get_pos_transactions: {
        Args: { p_limit?: number; p_offset?: number; p_organization_id: string }
        Returns: {
          amount: number
          checkout_session_id: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_email: string
          customer_name: string
          customer_phone: string
          is_generic: boolean
          is_product_linked: boolean
          product_id: string
          spi_payment_category: Database["public"]["Enums"]["spi_payment_category"]
          spi_payment_status: Database["public"]["Enums"]["spi_payment_status"]
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_id: string
        }[]
      }
      get_post_checkout_details: {
        Args: { p_checkout_session_id: string }
        Returns: Json
      }
      get_price_api: {
        Args: { p_organization_id: string; p_price_id: string }
        Returns: {
          amount: number
          billing_interval: Database["public"]["Enums"]["billing_interval"]
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          is_default: boolean
          maximum_amount: number
          metadata: Json
          minimum_amount: number
          organization_id: string
          price_id: string
          pricing_model: Database["public"]["Enums"]["pricing_model"]
          product_id: string
          updated_at: string
        }[]
      }
      get_pricing_tiers: {
        Args: { p_currency_code?: Database["public"]["Enums"]["currency_code"] }
        Returns: {
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string
          fee_structures: Json
          max_monthly_revenue: number
          min_monthly_revenue: number
          tier_id: string
          tier_name: string
          tier_order: number
        }[]
      }
      get_product: {
        Args: { p_organization_id: string; p_product_id: string }
        Returns: {
          created_at: string
          created_by: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string
          is_active: boolean
          name: string
          organization_id: string
          price: number
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
          product_type: Database["public"]["Enums"]["product_type"]
          updated_at: string
        }[]
      }
      get_product_by_price_id: {
        Args: { p_environment?: string; p_price_id: string }
        Returns: {
          charge_day: number
          created_at: string
          description: string
          display_on_storefront: boolean
          failed_payment_action: Database["public"]["Enums"]["failed_payment_action"]
          first_payment_type: Database["public"]["Enums"]["first_payment_type"]
          images: string[]
          is_active: boolean
          metadata: Json
          name: string
          organization_id: string
          price_details: Json
          product_id: string
          product_type: Database["public"]["Enums"]["product_type"]
          trial_enabled: boolean
          trial_period_days: number
          updated_at: string
        }[]
      }
      get_product_by_product_id: {
        Args: { p_product_id: string }
        Returns: {
          currency_code: Database["public"]["Enums"]["currency_code"]
          is_active: boolean
          plan_billing_frequency: Database["public"]["Enums"]["billing_interval"]
          plan_charge_day: number
          plan_description: string
          plan_failed_payment_action: string
          plan_first_payment_type: string
          plan_fixed_charges: number
          plan_images: string[]
          plan_name: string
          plan_subscription_length: string
          plan_trial_enabled: boolean
          plan_trial_period_days: number
          prices: Json
          product_description: string
          product_id: string
          product_images: string[]
          product_name: string
          product_type: Database["public"]["Enums"]["product_type"]
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
          billing_interval: Database["public"]["Enums"]["billing_interval"]
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          is_default: boolean
          organization_id: string
          price_id: string
          product_id: string
          updated_at: string
        }[]
      }
      get_product_service: {
        Args: { p_merchant_id?: string; p_product_id: string }
        Returns: {
          created_at: string
          created_by: string
          description: string
          display_on_storefront: boolean
          images: string[]
          is_active: boolean
          metadata: Json
          name: string
          organization_id: string
          product_id: string
          product_type: Database["public"]["Enums"]["product_type"]
          updated_at: string
        }[]
      }
      get_profitability_baseline: {
        Args: {
          p_environment?: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: Json
      }
      get_profitability_baseline_for_month: {
        Args: {
          p_environment?: string
          p_month?: number
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
          p_year?: number
        }
        Returns: Json
      }
      get_provider_merchant_id: {
        Args: {
          p_organization_id: string
          p_provider_code: Database["public"]["Enums"]["provider_code"]
        }
        Returns: string
      }
      get_public_bookable_services_by_org_slug: {
        Args: { p_slug: string }
        Returns: {
          buffer_minutes: number
          currency_code: string
          deposit_amount: number
          deposit_type: string
          deposit_value: number
          description: string
          duration_minutes: number
          images: string[]
          name: string
          payment_mode: string
          price: number
          service_id: string
        }[]
      }
      get_public_checkout_session_url: {
        Args: { p_checkout_session_id: string }
        Returns: string
      }
      get_public_invoice_checkout_session_url: {
        Args: { p_checkout_session_id: string }
        Returns: string
      }
      get_public_invoice_url: { Args: { p_token: string }; Returns: string }
      get_public_organization_by_slug: {
        Args: { p_slug: string }
        Returns: {
          announcement_active: boolean
          announcement_text: string
          apple_pay_enabled: boolean
          connected_providers: string[]
          default_currency: string
          description: string
          google_pay_enabled: boolean
          logo_url: string
          merchant_id: string
          name: string
          organization_id: string
          pass_processing_fees_to_customer: boolean
          pay_button_bg_color: string
          shipping_config: Json
          storefront_enabled: boolean
          tax_config: Json
          website_url: string
          whatsapp_number: string
        }[]
      }
      get_public_product_by_id: {
        Args: { p_org_slug: string; p_product_id: string }
        Returns: {
          continue_selling_when_out_of_stock: boolean
          currency_code: string
          description: string
          display_on_storefront: boolean
          image_type: string
          images: string[]
          inventory_quantity: number
          is_active: boolean
          name: string
          price: number
          price_id: string
          product_id: string
          sku: string
          track_inventory: boolean
        }[]
      }
      get_public_products_by_org_slug: {
        Args: { p_slug: string }
        Returns: {
          continue_selling_when_out_of_stock: boolean
          currency_code: string
          description: string
          display_on_storefront: boolean
          file_count: number
          fulfillment_type: string
          image_type: string
          images: string[]
          inventory_quantity: number
          is_active: boolean
          maximum_amount: number
          minimum_amount: number
          name: string
          price: number
          price_id: string
          pricing_model: string
          product_id: string
          sku: string
          track_inventory: boolean
        }[]
      }
      get_public_subscription_plan_by_id: {
        Args: { p_org_slug: string; p_product_id: string }
        Returns: {
          billing_interval: string
          charge_day: number
          currency_code: string
          description: string
          display_on_storefront: boolean
          failed_payment_action: string
          first_payment_type: string
          image_type: string
          images: string[]
          is_active: boolean
          name: string
          price: number
          price_id: string
          prices: Json
          product_id: string
          sku: string
          trial_enabled: boolean
          trial_period_days: number
        }[]
      }
      get_public_subscription_plans_by_org_slug: {
        Args: { p_slug: string }
        Returns: {
          billing_interval: string
          currency_code: string
          description: string
          display_on_storefront: boolean
          image_type: string
          images: string[]
          is_active: boolean
          name: string
          price: number
          price_id: string
          product_id: string
          sku: string
          trial_enabled: boolean
          trial_period_days: number
        }[]
      }
      get_qr_code_statistics: {
        Args: { p_qr_code_id: string }
        Returns: {
          avg_transaction: number
          completed_count: number
          completed_revenue: number
          failed_count: number
          failed_revenue: number
          first_used: string
          last_used: string
          pending_count: number
          success_rate: number
          total_revenue: number
          total_transactions: number
        }[]
      }
      get_qr_code_transactions: {
        Args: { p_limit?: number; p_offset?: number; p_qr_code_id: string }
        Returns: {
          checkout_session_id: string
          created_at: string
          currency_code: string
          customer_email: string
          customer_id: string
          customer_name: string
          gross_amount: number
          net_amount: number
          refunded_amount: number
          refunded_amount_xof: number
          spi_payment_category: string
          spi_payment_status: string
          spi_rejection_reason: string
          status: string
          transaction_id: string
        }[]
      }
      get_raw_average_monthly_growth_rate: {
        Args: {
          p_environment?: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: number
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
          status: Database["public"]["Enums"]["refund_status"]
          transaction_id: string
          updated_at: string
        }[]
      }
      get_request_country_code: { Args: never; Returns: string }
      get_retryable_webhooks: {
        Args: { p_max_retries?: number }
        Returns: {
          authorized_events: Database["public"]["Enums"]["webhook_event"][]
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
      get_revenue_per_transaction_by_channel: {
        Args: {
          p_active_merchant_min_gtv?: number
          p_active_merchants_only?: boolean
          p_end_date: string
          p_environment?: string
          p_organization_id?: string
          p_start_date: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          channel: string
          date: string
          gross_revenue_per_tx: number
          net_revenue_per_tx: number
          total_gross_revenue: number
          total_net_revenue: number
          transaction_count: number
        }[]
      }
      get_risk_assessment_api: {
        Args: { p_assessment_id: string; p_organization_id: string }
        Returns: {
          amount: number | null
          assessment_id: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"] | null
          customer_id: string | null
          decision: Database["public"]["Enums"]["radar_decision"]
          metadata: Json
          organization_id: string
          provider: Database["public"]["Enums"]["radar_signal_provider"]
          rail: Database["public"]["Enums"]["radar_rail"]
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
      get_risk_assessment_for_transaction: {
        Args: { p_organization_id: string; p_transaction_id: string }
        Returns: {
          amount: number | null
          assessment_id: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"] | null
          customer_id: string | null
          decision: Database["public"]["Enums"]["radar_decision"]
          metadata: Json
          organization_id: string
          provider: Database["public"]["Enums"]["radar_signal_provider"]
          rail: Database["public"]["Enums"]["radar_rail"]
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
      get_sales_intensity_level: {
        Args: { p_sales_count: number }
        Returns: number
      }
      get_service_availability_slots: {
        Args: { p_from_date: string; p_service_id: string; p_to_date: string }
        Returns: {
          slot_end: string
          slot_start: string
        }[]
      }
      get_shopify_dashboard_stats: {
        Args: { p_shop: string }
        Returns: {
          currency: string
          failed_transactions: number
          is_configured: boolean
          successful_transactions: number
          total_revenue: number
          total_transactions: number
        }[]
      }
      get_shopify_pending_payment: {
        Args: { p_draft_order_id: string }
        Returns: {
          checkout_session_id: string
          draft_order_id: string
          lomi_transaction_id: string
          shop_domain: string
          status: string
        }[]
      }
      get_shopify_recent_transactions: {
        Args: { p_limit?: number; p_shop: string }
        Returns: {
          amount: number
          created_at: string
          currency: string
          customer_name: string
          status: string
          transaction_id: string
        }[]
      }
      get_shopify_shop_settings: {
        Args: { p_shop: string }
        Returns: {
          allow_coupon_code: boolean
          api_key: string
          api_secret: string
          flat_shipping_fee: number
          is_configured: boolean
          merchant_id: string
          organization_id: string
          require_billing_address: boolean
          shipping_mode: string
          webhook_secret: string
          webhook_url: string
        }[]
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
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
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
      get_spi_pos_payment_by_spi_tx_id: {
        Args: { p_spi_tx_id: string }
        Returns: Json
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
      get_starter_kyc_review_context: {
        Args: {
          p_idempotency_window_minutes?: number
          p_organization_id: string
        }
        Returns: Json
      }
      get_starter_tier_id: { Args: never; Returns: string }
      get_statement_data_for_pdf: {
        Args: { p_invoice_id: string }
        Returns: {
          adjustments: number
          currency_code: string
          fee_period_end: string
          fee_period_start: string
          invoice_date: string
          issuer_organization_city: string
          issuer_organization_country: string
          issuer_organization_logo_url: string
          issuer_organization_name: string
          issuer_organization_postal_code: string
          issuer_organization_region: string
          issuer_organization_street: string
          merchant_city: string
          merchant_country: string
          merchant_name: string
          merchant_organization_id: string
          merchant_organization_logo_url: string
          merchant_organization_name: string
          merchant_postal_code: string
          merchant_region: string
          merchant_street: string
          monthly_fees: number
          outstanding_balance: number
          platform_invoice_id: string
          status: string
          total_amount: number
        }[]
      }
      get_storefront: {
        Args: { org_id: string }
        Returns: {
          announcement_active: boolean
          announcement_text: string
          default_currency: Database["public"]["Enums"]["currency_code"]
          description: string
          donation_product: Json
          logo_url: string
          name: string
          organization_id: string
          products: Json
          shipping_config: Json
          slug: string
          storefront_enabled: boolean
          tax_config: Json
          website_url: string
        }[]
      }
      get_storefront_customers: {
        Args: { org_id: string }
        Returns: {
          customer_id: string
          email: string
          name: string
        }[]
      }
      get_storefront_transaction_confirmation: {
        Args: { p_customer_email: string; p_transaction_id: string }
        Returns: Json
      }
      get_stripe_provider_charge_id: {
        Args: { p_transaction_id: string }
        Returns: string
      }
      get_stripe_terminal_config: {
        Args: { p_organization_id: string }
        Returns: Json
      }
      get_subscription_currency: {
        Args: { p_subscription_id: string }
        Returns: Database["public"]["Enums"]["currency_code"]
      }
      get_subscription_plan: {
        Args: { p_organization_id: string; p_product_id: string }
        Returns: {
          amount: number
          billing_frequency: Database["public"]["Enums"]["billing_interval"]
          charge_day: number
          created_at: string
          created_by: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string
          failed_payment_action: Database["public"]["Enums"]["failed_payment_action"]
          first_payment_type: Database["public"]["Enums"]["first_payment_type"]
          is_active: boolean
          metadata: Json
          name: string
          organization_id: string
          product_id: string
          updated_at: string
        }[]
      }
      get_subscription_renewal_notification_config: {
        Args: { p_organization_id: string }
        Returns: {
          days_before: number
          email_enabled: boolean
          max_attempts: number
          whatsapp_enabled: boolean
        }[]
      }
      get_subscription_renewal_retry_config: {
        Args: { p_subscription_id: string }
        Returns: {
          retry_payment_every: number
          total_retries: number
        }[]
      }
      get_subscription_usage_api: {
        Args: { p_organization_id: string; p_subscription_id: string }
        Returns: Json
      }
      get_subscription_usage_dashboard: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_subscription_id: string
        }
        Returns: Json
      }
      get_support_email_org_context: {
        Args: { p_organization_id: string }
        Returns: Json
      }
      get_support_feedback_volume_by_date: {
        Args: {
          p_end_date: string
          p_organization_id?: string
          p_start_date: string
        }
        Returns: {
          date: string
          feedback_submissions: number
          support_requests: number
          total_interactions: number
        }[]
      }
      get_support_requests_by_status_date: {
        Args: {
          p_end_date: string
          p_organization_id?: string
          p_start_date: string
        }
        Returns: {
          closed_requests: number
          date: string
          in_progress_requests: number
          open_requests: number
          resolved_requests: number
          total_requests: number
        }[]
      }
      get_tier_fee_structure: {
        Args: { p_tier_id: string }
        Returns: {
          description: string
          fee_category: Database["public"]["Enums"]["fee_category"]
          fee_subcategory: Database["public"]["Enums"]["fee_subcategory"]
          fixed_amount: number
          name: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          percentage: number
          provider_code: Database["public"]["Enums"]["provider_code"]
          tier_fee_id: string
        }[]
      }
      get_tier_fees: {
        Args: { p_tier_id: string }
        Returns: {
          description: string
          fee_category: Database["public"]["Enums"]["fee_category"]
          fee_subcategory: Database["public"]["Enums"]["fee_subcategory"]
          fixed_amount: number
          is_active: boolean
          name: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          percentage: number
          provider_code: Database["public"]["Enums"]["provider_code"]
          tier_fee_id: string
        }[]
      }
      get_top_up_bank_instructions: { Args: never; Returns: Json }
      get_total_beneficiary_payout_amount: {
        Args: {
          p_end_date?: string
          p_merchant_id: string
          p_start_date?: string
        }
        Returns: number
      }
      get_transaction: {
        Args: { p_organization_id?: string; p_transaction_id: string }
        Returns: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          description: string
          environment: string
          fee_amount: number
          fee_category: Database["public"]["Enums"]["fee_category"]
          fee_name: string
          fee_structure_id: string
          fee_subcategory: Database["public"]["Enums"]["fee_subcategory"]
          gross_amount: number
          metadata: Json
          net_amount: number
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          product_id: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          refunded_amount: number
          status: Database["public"]["Enums"]["transaction_status"]
          subscription_id: string
          transaction_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
        }[]
      }
      get_transaction_by_stripe_intent: {
        Args: { p_payment_intent_id: string }
        Returns: Json
      }
      get_transaction_digital_deliverables:
        | {
            Args: { p_customer_email: string; p_transaction_id: string }
            Returns: Json
          }
        | { Args: { p_transaction_id: string }; Returns: Json }
      get_transaction_distribution_by_hour: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_organization_id?: string
          p_start_date: string
        }
        Returns: {
          day_of_week: number
          hour_of_day: number
          transaction_count: number
        }[]
      }
      get_transaction_fee_revenue_by_date: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_organization_id?: string
          p_start_date: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          date: string
          fee_revenue: number
          transaction_count: number
        }[]
      }
      get_transaction_status: {
        Args: { p_transaction_id: string }
        Returns: {
          error_code: string
          error_message: string
          provider_payment_status: string
          status: string
          transaction_id: string
        }[]
      }
      get_transactions_per_merchant_by_date: {
        Args: {
          p_active_merchant_min_gtv?: number
          p_active_merchants_only?: boolean
          p_end_date: string
          p_environment?: string
          p_organization_id?: string
          p_start_date: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          active_merchants: number
          avg_tx_per_merchant: number
          date: string
          period_avg_tx_per_merchant: number
          period_distinct_merchants: number
          total_transactions: number
        }[]
      }
      get_tryit_context_for_user: {
        Args: { p_user_id: string }
        Returns: {
          name: string
          organization_id: string
        }[]
      }
      get_uncaptured_revenue: {
        Args: {
          p_end_date: string
          p_environment?: string
          p_organization_id?: string
          p_start_date: string
          p_target_currency?: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          checkout_count: number
          date: string
          expired_amount: number
          failed_amount: number
          pending_amount: number
          total_uncaptured: number
        }[]
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
          processing_status: Database["public"]["Enums"]["event_processing_status"]
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
      get_user_activity_trends: {
        Args: {
          p_end_date: string
          p_organization_id?: string
          p_start_date: string
        }
        Returns: {
          active_organizations_24h: number
          active_organizations_30d: number
          active_organizations_7d: number
          date: string
          new_organizations: number
          total_api_requests: number
        }[]
      }
      get_wave_payment_status: {
        Args: { p_provider_checkout_id: string }
        Returns: {
          error_code: string
          error_message: string
          payment_status: Database["public"]["Enums"]["provider_payment_status"]
          status: Database["public"]["Enums"]["transaction_status"]
        }[]
      }
      get_wave_refund_provider_ids: {
        Args: { p_transaction_id: string }
        Returns: Json
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
          authorized_events: Database["public"]["Enums"]["webhook_event"][]
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
          authorized_events: Database["public"]["Enums"]["webhook_event"][]
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
          p_environment?: string
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
          p_failed_only?: boolean
          p_limit?: number
          p_merchant_id: string
          p_offset?: number
          p_success_only?: boolean
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
          p_end_date?: string
          p_environment?: string
          p_failed_only?: boolean
          p_limit?: number
          p_offset?: number
          p_organization_id: string
          p_start_date?: string
          p_success_only?: boolean
          p_webhook_id?: string
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
      get_whatsapp_commerce_status: {
        Args: { p_organization_id: string }
        Returns: Json
      }
      get_whatsapp_sender_mode: {
        Args: { p_organization_id: string }
        Returns: string
      }
      get_withdrawal_notification_emails: {
        Args: never
        Returns: {
          email: string
        }[]
      }
      grant_network_membership_default_capabilities: {
        Args: { p_granted_by?: string; p_network_membership_id: string }
        Returns: number
      }
      grant_purchase_entitlements: {
        Args: { p_transaction_id: string }
        Returns: number
      }
      grant_purchase_license_keys: {
        Args: { p_transaction_id: string }
        Returns: number
      }
      handle_stripe_dispute_created: {
        Args: {
          p_amount: number
          p_currency: string
          p_dispute_data?: Json
          p_payment_intent_id: string
          p_reason: string
          p_stripe_charge_id: string
          p_stripe_dispute_id: string
        }
        Returns: Json
      }
      handle_stripe_dispute_updated: {
        Args: {
          p_dispute_data?: Json
          p_status: string
          p_stripe_dispute_id: string
        }
        Returns: Json
      }
      handle_stripe_payment_failure: {
        Args: {
          p_checkout_session_id: string
          p_failure_code?: string
          p_failure_message?: string
          p_payment_intent_id: string
        }
        Returns: Json
      }
      handle_stripe_refund: {
        Args: {
          p_payment_intent_id: string
          p_reason?: string
          p_refund_amount: number
          p_refund_id: string
          p_stripe_charge_id: string
        }
        Returns: Json
      }
      handle_subscription_failed_payment: {
        Args: { p_subscription_id: string }
        Returns: string
      }
      handle_subscription_renewal_payment_failure: {
        Args: { p_error?: string; p_subscription_id: string }
        Returns: Json
      }
      has_org_permission: {
        Args: { p_organization_id: string; p_permission_key: string }
        Returns: boolean
      }
      hash_payout_pin: { Args: { p_pin: string }; Returns: string }
      hydrate_organization_tier_from_volume: {
        Args: { p_organization_id?: string }
        Returns: number
      }
      import_whatsapp_catalog_item: {
        Args: {
          p_action: string
          p_catalog_item_id: string
          p_product_id?: string
        }
        Returns: Json
      }
      increment_assistant_usage_counter: {
        Args: { p_organization_id: string }
        Returns: undefined
      }
      increment_coupon_usage_for_completed_transaction: {
        Args: { p_transaction_id: string }
        Returns: boolean
      }
      increment_provisioning_daily_usage: {
        Args: { p_provisioning_key_id: string }
        Returns: undefined
      }
      infer_country_from_phone: { Args: { p_phone: string }; Returns: string }
      init_pos_payment: {
        Args: {
          p_amount: number
          p_channel?: string
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_metadata?: Json
          p_organization_id: string
          p_product_ids?: string[]
        }
        Returns: Json
      }
      initialize_organization_fees: {
        Args: { p_organization_id: string }
        Returns: number
      }
      initiate_spi_payout: {
        Args: {
          p_amount: number
          p_bypass_payout_pin?: boolean
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_merchant_id: string
          p_organization_id: string
          p_payout_method_id: string
          p_payout_pin?: string
          p_payout_pin_session?: string
        }
        Returns: {
          message: string
          payout_id: string
          spi_tx_id: string
          status: Database["public"]["Enums"]["payout_status"]
        }[]
      }
      initiate_withdrawal: {
        Args: {
          p_amount: number
          p_bypass_payout_pin?: boolean
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_merchant_id: string
          p_payout_method_id: string
          p_payout_pin?: string
          p_payout_pin_session?: string
          p_provider_code?: Database["public"]["Enums"]["provider_code"]
        }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      initiate_withdrawal_api: {
        Args: {
          p_amount: number
          p_bypass_payout_pin?: boolean
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_merchant_id: string
          p_organization_id: string
          p_payout_method_id: string
          p_payout_pin?: string
          p_payout_pin_session?: string
          p_provider_code?: Database["public"]["Enums"]["provider_code"]
        }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      install_shopify_store: {
        Args: {
          p_access_token: string
          p_organization_id: string
          p_scope: string[]
          p_shop_domain: string
        }
        Returns: string
      }
      invite_team_member: {
        Args: {
          p_acting_merchant_id?: string
          p_email: string
          p_organization_id: string
          p_position: string
          p_role: Database["public"]["Enums"]["member_role"]
          p_role_id?: string
        }
        Returns: undefined
      }
      invoice_period_start: {
        Args: {
          p_billing_interval: Database["public"]["Enums"]["billing_interval"]
          p_period_end: string
        }
        Returns: string
      }
      is_excluded_orphan_auth_email: {
        Args: { p_email: string }
        Returns: boolean
      }
      is_organization_admin: {
        Args: { p_organization_id: string }
        Returns: boolean
      }
      is_orphan_auth_user: { Args: { p_user_id: string }; Returns: boolean }
      is_platform_admin: { Args: never; Returns: boolean }
      is_radar_enabled_for_org: {
        Args: { p_organization_id: string }
        Returns: boolean
      }
      is_rate_limit_policy_resolver_enabled: { Args: never; Returns: boolean }
      is_uemoa_country: { Args: { country_code: string }; Returns: boolean }
      is_whatsapp_commerce_connected: {
        Args: { p_organization_id: string }
        Returns: boolean
      }
      is_whatsapp_connected: {
        Args: { p_organization_id: string }
        Returns: boolean
      }
      is_whatsapp_platform_templates_ready: { Args: never; Returns: boolean }
      is_whatsapp_transactional_available: {
        Args: { p_organization_id: string }
        Returns: boolean
      }
      leave_organization: {
        Args: { p_organization_id: string }
        Returns: boolean
      }
      link_customer_to_provider: {
        Args: { p_customer_id: string; p_provider_customer_id: string }
        Returns: undefined
      }
      link_or_insert_coupon_usage_for_transaction: {
        Args: {
          p_checkout_session_id: string
          p_coupon_id: string
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_customer_id: string
          p_discount_amount: number
          p_final_amount: number
          p_organization_id: string
          p_original_amount: number
          p_transaction_id: string
        }
        Returns: undefined
      }
      link_stripe_payment_intent_to_transaction: {
        Args: {
          p_checkout_session_id?: string
          p_organization_id: string
          p_payment_intent_id: string
          p_transaction_id: string
        }
        Returns: boolean
      }
      link_subscription_payment_method: {
        Args: { p_stripe_payment_method_id: string; p_subscription_id: string }
        Returns: undefined
      }
      link_whatsapp_order_transaction: {
        Args: { p_checkout_session_id: string; p_transaction_id: string }
        Returns: boolean
      }
      list_account_top_ups: {
        Args: { p_limit?: number; p_offset?: number; p_organization_id: string }
        Returns: {
          amount: number
          bank_instructions: Json
          created_at: string
          credited_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          expires_at: string
          organization_id: string
          reference_code: string
          status: Database["public"]["Enums"]["account_top_up_status"]
          top_up_id: string
          updated_at: string
        }[]
      }
      list_accounts: {
        Args: { p_limit?: number; p_offset?: number; p_organization_id: string }
        Returns: {
          account_id: string
          balance: number
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          is_spi_account: boolean
          organization_id: string
          spi_account_balance: number
          spi_account_balance_sync_error: string
          spi_account_balance_synced_at: string
          spi_account_number: string
          spi_account_status: Database["public"]["Enums"]["spi_account_status"]
          spi_account_type: Database["public"]["Enums"]["spi_account_type"]
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
      list_billing_periods_api: {
        Args: {
          p_environment?: string
          p_limit?: number
          p_offset?: number
          p_organization_id: string
          p_subscription_id?: string
        }
        Returns: {
          billing_period_id: string
          created_at: string
          customer_id: string
          customer_invoice_id: string
          period_end: string
          period_start: string
          product_id: string
          status: Database["public"]["Enums"]["billing_period_status"]
          subscription_id: string
          total_count: number
        }[]
      }
      list_checkout_sessions: {
        Args: {
          p_limit?: number
          p_merchant_id: string
          p_offset?: number
          p_status?: Database["public"]["Enums"]["checkout_session_status"]
        }
        Returns: {
          amount: number
          cancel_url: string
          checkout_session_id: string
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
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
          status: Database["public"]["Enums"]["checkout_session_status"]
          subscription_id: string
          success_url: string
          title: string
          updated_at: string
        }[]
      }
      list_customer_invoices_api: {
        Args: {
          p_customer_id?: string
          p_environment?: string
          p_limit?: number
          p_merchant_id?: string
          p_offset?: number
          p_organization_id: string
          p_search?: string
          p_status?: Database["public"]["Enums"]["invoice_status"]
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
          currency_code: Database["public"]["Enums"]["currency_code"]
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
          status: Database["public"]["Enums"]["invoice_status"]
          subscription_id: string
          total_count: number
          transaction_id: string
          updated_at: string
        }[]
      }
      list_customer_library: {
        Args: { p_session_token: string }
        Returns: Json
      }
      list_customer_subscriptions: {
        Args: {
          p_customer_id?: string
          p_limit?: number
          p_merchant_id: string
          p_offset?: number
          p_status?: Database["public"]["Enums"]["subscription_status"]
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
          plan_billing_frequency: Database["public"]["Enums"]["billing_interval"]
          plan_currency_code: Database["public"]["Enums"]["currency_code"]
          plan_name: string
          product_id: string
          start_date: string
          status: Database["public"]["Enums"]["subscription_status"]
          subscription_id: string
          updated_at: string
        }[]
      }
      list_customers: {
        Args: {
          p_email?: string
          p_limit?: number
          p_merchant_id: string
          p_offset?: number
          p_phone_number?: string
        }
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
      list_installment_plans_api: {
        Args: {
          p_environment?: string
          p_limit?: number
          p_offset?: number
          p_organization_id: string
        }
        Returns: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          environment: string
          installment_count: number
          paid_installments: number
          pending_installments: number
          plan_id: string
          product_id: string
          status: Database["public"]["Enums"]["transaction_status"]
          total_amount: number
        }[]
      }
      list_meters_api: {
        Args: {
          p_is_active?: boolean
          p_organization_id: string
          p_product_id?: string
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
      list_organizations: {
        Args: { p_organization_id: string }
        Returns: {
          arr: number
          created_at: string
          default_currency: Database["public"]["Enums"]["currency_code"]
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
      list_orgs_missing_spi_account: {
        Args: never
        Returns: {
          currency_code: Database["public"]["Enums"]["currency_code"]
          organization_id: string
          organization_name: string
        }[]
      }
      list_orphan_signup_cleanup_candidates: { Args: never; Returns: Json }
      list_payment_links: {
        Args: {
          p_is_active?: boolean
          p_limit?: number
          p_link_type?: string
          p_offset?: number
          p_organization_id: string
        }
        Returns: {
          allow_coupon_code: boolean
          allow_quantity: boolean
          amount: number
          cancel_url: string
          created_at: string
          created_by: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string
          environment: string
          expires_at: string
          is_active: boolean
          link_id: string
          link_type: Database["public"]["Enums"]["link_type"]
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
          p_customer_id?: string
          p_limit?: number
          p_offset?: number
          p_organization_id: string
          p_status?: string
        }
        Returns: {
          amount: number
          created_at: string
          created_by: string
          currency_code: Database["public"]["Enums"]["currency_code"]
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
      list_product_files: {
        Args: { p_organization_id: string; p_product_id: string }
        Returns: Json
      }
      list_products: {
        Args: { p_limit?: number; p_offset?: number; p_organization_id: string }
        Returns: {
          created_at: string
          created_by: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string
          is_active: boolean
          name: string
          organization_id: string
          price: number
          product_id: string
          updated_at: string
        }[]
      }
      list_products_service: {
        Args: {
          p_is_active?: boolean
          p_limit?: number
          p_merchant_id: string
          p_offset?: number
        }
        Returns: {
          created_at: string
          created_by: string
          description: string
          display_on_storefront: boolean
          images: string[]
          is_active: boolean
          metadata: Json
          name: string
          organization_id: string
          product_id: string
          product_type: Database["public"]["Enums"]["product_type"]
          updated_at: string
        }[]
      }
      list_rate_limit_policies: {
        Args: { p_organization_id: string }
        Returns: {
          api_key: string
          created_at: string
          endpoint_pattern: string
          environment: string
          is_active: boolean
          organization_id: string
          policy_id: string
          priority: number
          requests_per_day: number
          requests_per_minute: number
          scope_type: string
          updated_at: string
        }[]
      }
      list_refunds: {
        Args: {
          p_end_date?: string
          p_limit?: number
          p_offset?: number
          p_organization_id: string
          p_start_date?: string
          p_status?: Database["public"]["Enums"]["refund_status"]
        }
        Returns: {
          amount: number
          created_at: string
          fee_amount: number
          metadata: Json
          reason: string
          refund_id: string
          refunded_amount: number
          status: Database["public"]["Enums"]["refund_status"]
          transaction_id: string
          updated_at: string
        }[]
      }
      list_refunds_for_transaction: {
        Args: { p_organization_id: string; p_transaction_id: string }
        Returns: {
          amount: number
          created_at: string
          fee_amount: number
          metadata: Json
          reason: string
          refund_id: string
          refunded_amount: number
          status: Database["public"]["Enums"]["refund_status"]
          transaction_id: string
          updated_at: string
        }[]
      }
      list_spi_accounts_for_balance_sync: {
        Args: never
        Returns: {
          currency_code: Database["public"]["Enums"]["currency_code"]
          organization_id: string
        }[]
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
      list_storefront_organization_slugs: {
        Args: never
        Returns: {
          slug: string
          updated_at: string
        }[]
      }
      list_subscription_plans: {
        Args: { p_limit?: number; p_offset?: number; p_organization_id: string }
        Returns: {
          amount: number
          billing_frequency: Database["public"]["Enums"]["billing_interval"]
          charge_day: number
          created_at: string
          created_by: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string
          failed_payment_action: Database["public"]["Enums"]["failed_payment_action"]
          first_payment_type: Database["public"]["Enums"]["first_payment_type"]
          is_active: boolean
          metadata: Json
          name: string
          organization_id: string
          product_id: string
          updated_at: string
        }[]
      }
      list_transactions: {
        Args: {
          p_end_date?: string
          p_limit?: number
          p_offset?: number
          p_organization_id: string
          p_provider?: Database["public"]["Enums"]["provider_code"]
          p_start_date?: string
          p_status?: Database["public"]["Enums"]["transaction_status"][]
        }
        Returns: {
          created_at: string
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_id: string
          description: string
          fee_amount: number
          fee_category: Database["public"]["Enums"]["fee_category"]
          fee_name: string
          fee_structure_id: string
          fee_subcategory: Database["public"]["Enums"]["fee_subcategory"]
          gross_amount: number
          metadata: Json
          net_amount: number
          organization_id: string
          payment_method_code: Database["public"]["Enums"]["payment_method_code"]
          product_id: string
          provider_code: Database["public"]["Enums"]["provider_code"]
          provider_transaction_id: string
          status: Database["public"]["Enums"]["transaction_status"]
          subscription_id: string
          transaction_id: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
        }[]
      }
      list_trusted_devices: {
        Args: never
        Returns: {
          created_at: string
          device_id: string
          device_name: string
          expires_at: string
          id: string
          last_used_at: string
        }[]
      }
      list_usage_events_api: {
        Args: {
          p_code?: string
          p_customer_id?: string
          p_environment?: string
          p_limit?: number
          p_offset?: number
          p_organization_id: string
          p_status?: string
        }
        Returns: {
          code: string
          created_at: string
          customer_id: string
          error_message: string
          event_id: string
          meter_id: string
          occurred_at: string
          processing_status: Database["public"]["Enums"]["event_processing_status"]
          quantity: number
          subscription_id: string
          total_count: number
          transaction_id: string
        }[]
      }
      list_whatsapp_catalog_imports: {
        Args: { p_organization_id: string }
        Returns: Json
      }
      list_whatsapp_orders: {
        Args: {
          p_organization_id: string
          p_page?: number
          p_page_size?: number
        }
        Returns: Json
      }
      list_whatsapp_template_pending_orgs: {
        Args: never
        Returns: {
          organization_id: string
        }[]
      }
      log_api_error: {
        Args: {
          p_api_key?: string
          p_context?: Json
          p_endpoint?: string
          p_error_message: string
          p_error_type: string
          p_organization_id?: string
          p_request_id?: string
          p_request_method?: string
          p_response_status?: number
          p_stack_trace?: string
        }
        Returns: string
      }
      log_api_interaction: {
        Args: {
          p_api_key: string
          p_endpoint: string
          p_organization_id: string
          p_request_method: string
          p_request_payload?: Json
          p_response_payload?: Json
          p_response_status?: number
          p_response_time?: number
        }
        Returns: string
      }
      log_api_interaction_context: {
        Args: {
          p_actor_organization_id: string
          p_api_key: string
          p_endpoint: string
          p_network_account_id?: string
          p_network_membership_id?: string
          p_request_id?: string
          p_request_method: string
          p_request_payload?: Json
          p_response_payload?: Json
          p_response_status?: number
          p_response_time?: number
          p_target_organization_id: string
        }
        Returns: string
      }
      log_assistant_tool_execution: {
        Args: {
          p_approval_source?: string
          p_conversation_id?: string
          p_merchant_id: string
          p_organization_id: string
          p_result_summary?: string
          p_run_id?: string
          p_success?: boolean
          p_tool_args?: Json
          p_tool_id: string
        }
        Returns: string
      }
      log_event: {
        Args: {
          p_details?: Json
          p_event: Database["public"]["Enums"]["event_type"]
          p_merchant_id: string
          p_organization_id?: string
          p_request_method?: string
          p_request_url?: string
          p_response_status?: number
          p_severity?: string
        }
        Returns: string
      }
      log_invoice_event: {
        Args: {
          p_created_by?: string
          p_event_name: string
          p_invoice_id: string
          p_metadata?: Json
        }
        Returns: string
      }
      log_merchant_funnel_event: {
        Args: {
          p_attributes?: Json
          p_event_name: string
          p_organization_id: string
          p_user_id?: string
        }
        Returns: string
      }
      log_provisioning_audit: {
        Args: {
          p_action: string
          p_ip_address?: string
          p_merchant_id?: string
          p_metadata?: Json
          p_organization_id?: string
          p_provisioning_key_id: string
        }
        Returns: string
      }
      log_webhook_delivery: {
        Args: {
          p_attempt_number?: number
          p_event_type: string
          p_headers?: Json
          p_ip_address?: string
          p_merchant_id: string
          p_organization_id: string
          p_payload: Json
          p_request_duration_ms?: number
          p_response_body: string
          p_response_status: number
          p_user_agent?: string
          p_webhook_id: string
        }
        Returns: string
      }
      log_wide_event: {
        Args: {
          p_attributes?: Json
          p_category?: Database["public"]["Enums"]["event_category"]
          p_correlation_id?: string
          p_customer_id?: string
          p_environment?: string
          p_event_name: string
          p_message?: string
          p_organization_id?: string
          p_session_id?: string
          p_severity?: Database["public"]["Enums"]["event_severity"]
          p_source?: string
          p_url?: string
          p_user_agent?: string
          p_user_id?: string
        }
        Returns: string
      }
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
      manage_organization_fee_type: {
        Args: {
          p_acting_merchant_id?: string
          p_apply_once_per_order?: boolean
          p_apply_to_direct_charges?: boolean
          p_fee_type_id?: string
          p_fixed_amount?: number
          p_is_enabled?: boolean
          p_name?: string
          p_organization_id: string
          p_percentage?: number
        }
        Returns: string
      }
      manage_platform_expense: {
        Args: {
          p_amount?: number
          p_apr_amount?: number
          p_aug_amount?: number
          p_category?: string
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_dec_amount?: number
          p_expense_id?: string
          p_feb_amount?: number
          p_frequency?: string
          p_is_active?: boolean
          p_jan_amount?: number
          p_jul_amount?: number
          p_jun_amount?: number
          p_mar_amount?: number
          p_may_amount?: number
          p_name?: string
          p_nov_amount?: number
          p_oct_amount?: number
          p_operation: string
          p_sep_amount?: number
        }
        Returns: Json
      }
      manage_platform_investment: {
        Args: {
          p_amount?: number
          p_category?: string
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_date?: string
          p_description?: string
          p_investment_id?: string
          p_is_active?: boolean
          p_name?: string
          p_operation: string
        }
        Returns: Json
      }
      manage_shopify_session: {
        Args: {
          p_access_token: string
          p_account_owner: boolean
          p_associated_user_scope: string
          p_collaborator: boolean
          p_email: string
          p_email_verified: boolean
          p_expires: string
          p_expires_in: number
          p_first_name: string
          p_id: string
          p_is_online: boolean
          p_last_name: string
          p_locale: string
          p_scope: string
          p_shop: string
          p_state: string
          p_user_id: number
        }
        Returns: string
      }
      manage_subscription: {
        Args: {
          p_action: string
          p_actor?: string
          p_cancellation_reason?: string
          p_merchant_id?: string
          p_new_price_id?: string
          p_session_token?: string
          p_source?: string
          p_subscription_id: string
        }
        Returns: Json
      }
      manual_adjust_channel_balance: {
        Args: {
          p_adjustment_amount: number
          p_adjustment_type: string
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_provider_code: Database["public"]["Enums"]["provider_code"]
          p_reason: string
          p_reference_number?: string
        }
        Returns: Json
      }
      manually_send_withdrawal_confirmation: {
        Args: { p_payout_id: string }
        Returns: string
      }
      map_spi_status_to_transaction_status: {
        Args: { spi_status: Database["public"]["Enums"]["spi_payment_status"] }
        Returns: Database["public"]["Enums"]["transaction_status"]
      }
      map_spi_webhook_event_to_webhook_event: {
        Args: {
          spi_event_code: Database["public"]["Enums"]["spi_webhook_event_code"]
        }
        Returns: Database["public"]["Enums"]["webhook_event"]
      }
      mark_all_notifications_read: {
        Args: { p_merchant_id: string }
        Returns: undefined
      }
      mark_customer_invoice_paid: {
        Args: { p_invoice_id: string; p_organization_id: string }
        Returns: Json
      }
      mark_integration_connected: {
        Args: {
          p_connection_metadata?: Json
          p_integration: string
          p_organization_id: string
        }
        Returns: Json
      }
      mark_integration_disconnected: {
        Args: { p_integration: string; p_organization_id: string }
        Returns: Json
      }
      mark_invoice_paid_from_transaction: {
        Args: { p_transaction_id: string }
        Returns: string
      }
      mark_merchant_mobile_ready: {
        Args: { p_merchant_id: string }
        Returns: undefined
      }
      mark_notification_outbox_completed: {
        Args: { p_outbox_id: string }
        Returns: undefined
      }
      mark_notification_outbox_failed: {
        Args: { p_dead_letter?: boolean; p_error: string; p_outbox_id: string }
        Returns: undefined
      }
      mark_notification_read: {
        Args: { p_notification_id: string }
        Returns: undefined
      }
      mark_overdue_invoices: { Args: never; Returns: number }
      mark_webhook_dispatch_dead_letter: {
        Args: { p_dispatch_id: string; p_reason: string }
        Returns: undefined
      }
      mark_webhook_dispatch_delivered: {
        Args: { p_dispatch_id: string }
        Returns: undefined
      }
      mark_whatsapp_order_payment_link_sent: {
        Args: { p_whatsapp_order_id: string }
        Returns: boolean
      }
      mask_api_key_for_log: { Args: { p_api_key: string }; Returns: string }
      maybe_apply_subscription_refund_action_after_refund: {
        Args: {
          p_initiated_by?: string
          p_refund_id: string
          p_subscription_action?: string
          p_transaction_id: string
        }
        Returns: Json
      }
      merchant_approve_live_activation: {
        Args: { p_merchant_id: string; p_request_id: string }
        Returns: Json
      }
      merchant_close_support_request: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_support_request_id: string
        }
        Returns: undefined
      }
      merchant_list_customer_portal_audit_events: {
        Args: {
          p_customer_id?: string
          p_event_type?: string
          p_limit?: number
          p_merchant_id: string
          p_offset?: number
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
      merchant_retrieve_live_secret_key: {
        Args: { p_merchant_id: string; p_request_id: string }
        Returns: Json
      }
      merge_all_duplicates_by_phone_dry_run: {
        Args: never
        Returns: {
          duplicates_to_merge: string[]
          organization_id: string
          phone_number: string
          primary_id: string
        }[]
      }
      merge_all_duplicates_dry_run: {
        Args: never
        Returns: {
          duplicates_to_merge: string[]
          email: string
          organization_id: string
          primary_id: string
        }[]
      }
      merge_customers: {
        Args: { p_duplicate_customer_id: string; p_primary_customer_id: string }
        Returns: undefined
      }
      merge_exact_name_matches: { Args: never; Returns: string }
      merge_high_confidence_smart_duplicates: { Args: never; Returns: string }
      merge_stripe_radar_signals: {
        Args: {
          p_stripe_risk_level: string
          p_stripe_risk_score?: number
          p_transaction_id: string
        }
        Returns: undefined
      }
      merge_transaction_whatsapp_metadata: {
        Args: { p_kind: string; p_patch: Json; p_transaction_id: string }
        Returns: undefined
      }
      merge_whatsapp_connection_settings: {
        Args: { p_organization_id: string; p_settings_patch: Json }
        Returns: Json
      }
      move_product_to_live: { Args: { p_product_id: string }; Returns: string }
      move_webhook_to_live: { Args: { p_webhook_id: string }; Returns: string }
      notify_notification_outbox_via_api: {
        Args: { p_outbox_id: string }
        Returns: undefined
      }
      notify_usage_invoice_paid: {
        Args: { p_invoice_id: string }
        Returns: undefined
      }
      notify_webhook_outbox_via_api: {
        Args: { p_outbox_id: string }
        Returns: undefined
      }
      notify_whatsapp_templates_ready: {
        Args: { p_organization_id: string }
        Returns: Json
      }
      oauth_create_authorization_code: {
        Args: {
          p_api_key?: string
          p_client_id: string
          p_code_challenge: string
          p_code_challenge_method: string
          p_grant_type?: string
          p_organization_id?: string
          p_provisioning_key_id?: string
          p_redirect_uri: string
          p_resource: string
          p_scope: string
          p_ttl_seconds?: number
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
          p_environment?: string
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
          p_grant_types?: string[]
          p_redirect_uris: string[]
          p_response_types?: string[]
          p_scopes?: string[]
          p_token_endpoint_auth_method?: string
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
      oauth_revoke_merchant_connection: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_token_id: string
        }
        Returns: boolean
      }
      oauth_revoke_token: { Args: { p_token: string }; Returns: boolean }
      oauth_verify_client_secret: {
        Args: { p_client_id: string; p_client_secret: string }
        Returns: boolean
      }
      organization_has_active_test_secret_key: {
        Args: { p_organization_id: string }
        Returns: boolean
      }
      organization_has_custom_fee_schedule: {
        Args: { p_organization_id: string }
        Returns: boolean
      }
      organization_has_payout_pin: {
        Args: { p_organization_id: string }
        Returns: boolean
      }
      organization_passes_processing_fees_to_customer: {
        Args: { p_organization_id: string }
        Returns: boolean
      }
      partner_list_provisioning_keys: {
        Args: {
          p_include_inactive?: boolean
          p_limit?: number
          p_offset?: number
          p_partner_id: string
        }
        Returns: {
          accounts_created_today: number
          created_at: string
          daily_account_limit: number
          environment: string
          external_user_ref: string
          is_active: boolean
          key_kind: Database["public"]["Enums"]["provisioning_key_kind"]
          key_prefix: string
          name: string
          provisioning_key_id: string
          rate_limit_per_minute: number
        }[]
      }
      partner_mint_provisioning_key: {
        Args: {
          p_daily_account_limit?: number
          p_environment?: string
          p_external_user_ref?: string
          p_key_kind?: Database["public"]["Enums"]["provisioning_key_kind"]
          p_name: string
          p_partner_id: string
          p_rate_limit_per_minute?: number
        }
        Returns: {
          environment: string
          external_user_ref: string
          key_kind: Database["public"]["Enums"]["provisioning_key_kind"]
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
      pending_beneficiary_payout_reserved: {
        Args: {
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_organization_id: string
        }
        Returns: number
      }
      ping_api: { Args: never; Returns: string }
      platform_setting_boolean: {
        Args: { p_default?: boolean; p_key: string }
        Returns: boolean
      }
      pre_apply_coupon_validation: {
        Args: {
          p_coupon_id: string
          p_customer_id: string
          p_organization_id: string
          p_quantity?: number
        }
        Returns: {
          is_valid: boolean
          message: string
        }[]
      }
      prepare_bnpl_installment_spi: {
        Args: { p_payment_request_id: string }
        Returns: Json
      }
      prepare_checkout_gim_payment: {
        Args: { p_checkout_session_id: string }
        Returns: Json
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
          p_checkout_session_id?: string
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_merchant_id: string
          p_metadata?: Json
          p_organization_id: string
          p_product_id?: string
        }
        Returns: Json
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
      price_has_commerce_usage: {
        Args: { p_price_id: string }
        Returns: boolean
      }
      process_bnpl_installment_payment: {
        Args: {
          p_payment_request_id: string
          p_payment_status: Database["public"]["Enums"]["spi_payment_status"]
          p_spi_tx_id: string
        }
        Returns: string
      }
      process_overdue_subscription_failures: {
        Args: { days_overdue?: number }
        Returns: number
      }
      process_payment: {
        Args: {
          p_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_customer_id: string
          p_metadata?: Json
          p_organization_id: string
          p_payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          p_provider_code: Database["public"]["Enums"]["provider_code"]
        }
        Returns: string
      }
      process_scheduled_invoices: { Args: never; Returns: number }
      process_subscription_renewal_notifications: {
        Args: never
        Returns: number
      }
      process_usage_billing_cycle: {
        Args: { p_as_of_date?: string }
        Returns: Json
      }
      process_usage_event: { Args: { p_event_id: string }; Returns: Json }
      process_usage_invoice_dunning: {
        Args: { p_grace_days?: number }
        Returns: number
      }
      process_whatsapp_catalog_order: {
        Args: {
          p_catalog_id: string
          p_customer_wa_id: string
          p_organization_id?: string
          p_phone_number_id: string
          p_provider_message_id: string
          p_raw_order: Json
        }
        Returns: Json
      }
      process_whatsapp_product_inquiry: {
        Args: {
          p_customer_wa_id: string
          p_inquiry_text?: string
          p_organization_id?: string
          p_phone_number_id: string
          p_product_retailer_id: string
          p_provider_message_id: string
          p_quantity?: number
        }
        Returns: Json
      }
      product_has_commerce_usage: {
        Args: { p_product_id: string }
        Returns: boolean
      }
      product_is_recurring: { Args: { p_product_id: string }; Returns: boolean }
      product_is_usage_based: {
        Args: { p_product_id: string }
        Returns: boolean
      }
      provision_default_api_keys: {
        Args: { p_merchant_id: string; p_organization_id: string }
        Returns: undefined
      }
      provision_spi_account: {
        Args: {
          p_account_number: string
          p_account_type?: Database["public"]["Enums"]["spi_account_type"]
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_organization_id: string
        }
        Returns: Json
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
      queue_invoice_email: {
        Args: { p_invoice_id: string; p_is_reminder?: boolean }
        Returns: undefined
      }
      read_subscription_webhook_context: { Args: never; Returns: Json }
      recalculate_all_organizations_mrr: {
        Args: never
        Returns: {
          arr: number
          mrr: number
          organization_id: string
        }[]
      }
      reconcile_channel_provider_costs: {
        Args: {
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_dry_run?: boolean
          p_provider_code?: Database["public"]["Enums"]["provider_code"]
        }
        Returns: Json
      }
      reconcile_organization_fee_rows: { Args: never; Returns: number }
      reconcile_stale_webhook_outbox_jobs: {
        Args: { p_limit?: number; p_stale_after_seconds?: number }
        Returns: number
      }
      reconcile_webhook_outbox_status: {
        Args: { p_outbox_id: string }
        Returns: undefined
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
      record_download_access: { Args: { p_token: string }; Returns: Json }
      record_free_transaction: {
        Args: {
          p_additional_coupon_ids?: string[]
          p_checkout_session_id?: string
          p_coupon_id?: string
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_customer_id: string
          p_description?: string
          p_discount_amount: number
          p_environment?: string
          p_link_id: string
          p_merchant_id: string
          p_organization_id: string
          p_original_amount: number
          p_product_id?: string
          p_quantity?: number
          p_skip_free_transaction_dedupe?: boolean
          p_subscription_id?: string
          p_suppress_confirmation_emails?: boolean
        }
        Returns: string
      }
      record_network_operator_fee_entry: {
        Args: {
          p_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_description?: string
          p_entry_type?: Database["public"]["Enums"]["network_fee_entry_type"]
          p_fee_rule_id?: string
          p_metadata?: Json
          p_network_membership_id: string
          p_network_transaction_context_id?: string
          p_refund_id?: string
          p_transaction_id?: string
        }
        Returns: string
      }
      record_network_operator_fee_reversal: {
        Args: {
          p_metadata?: Json
          p_network_membership_id: string
          p_refund_amount: number
          p_refund_id: string
          p_transaction_id: string
        }
        Returns: string
      }
      record_network_transaction_context: {
        Args: {
          p_actor_merchant_id?: string
          p_api_key?: string
          p_capability_key?: string
          p_checkout_session_id?: string
          p_environment?: string
          p_metadata?: Json
          p_network_membership_id: string
          p_operator_fee_amount?: number
          p_operator_fee_currency?: Database["public"]["Enums"]["currency_code"]
          p_refund_id?: string
          p_transaction_id?: string
        }
        Returns: string
      }
      record_orphan_signup_warning: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      record_pending_stripe_transaction: {
        Args: {
          p_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_customer_id: string
          p_description?: string
          p_environment?: string
          p_link_id: string
          p_merchant_id: string
          p_metadata?: Json
          p_organization_id: string
          p_product_id?: string
          p_provider_transaction_id: string
          p_quantity?: number
          p_subscription_id?: string
        }
        Returns: string
      }
      record_radar_screening_usage: {
        Args: {
          p_assessment_id: string
          p_customer_id: string
          p_environment?: string
          p_organization_id: string
        }
        Returns: undefined
      }
      record_stripe_checkout_failure: {
        Args: {
          p_error_code?: string
          p_error_message?: string
          p_stripe_payment_intent_id: string
        }
        Returns: Json
      }
      record_subscription_renewal: {
        Args: {
          p_amount_minor_units: number
          p_billing_period_end?: string
          p_currency: string
          p_status?: Database["public"]["Enums"]["transaction_status"]
          p_stripe_payment_intent_id: string
          p_subscription_id: string
        }
        Returns: string
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
          p_amount?: number
          p_client_reference: string
          p_currency?: string
          p_wave_session_id: string
          p_wave_transaction_id?: string
        }
        Returns: {
          r_organization_id: string
          r_status: Database["public"]["Enums"]["transaction_status"]
          r_transaction_id: string
          r_was_recovered: boolean
        }[]
      }
      redact_sensitive_log_context: { Args: { p_context: Json }; Returns: Json }
      refresh_all_organization_metrics: {
        Args: { p_environment?: string }
        Returns: {
          arr: number
          merchant_lifetime_value: number
          mrr: number
          organization_id: string
          total_customers: number
          total_merchants: number
          total_revenue: number
          total_transactions: number
          updated_at: string
        }[]
      }
      refresh_organization_metrics: {
        Args: { p_environment?: string; p_organization_id: string }
        Returns: {
          arr: number
          merchant_lifetime_value: number
          mrr: number
          organization_id: string
          total_customers: number
          total_merchants: number
          total_revenue: number
          total_transactions: number
          updated_at: string
        }[]
      }
      register_pos_device: {
        Args: {
          p_device_id: string
          p_nickname?: string
          p_organization_id: string
          p_platform?: string
        }
        Returns: string
      }
      register_product_file: {
        Args: {
          p_file_checksum?: string
          p_filename: string
          p_mime_type?: string
          p_organization_id: string
          p_product_id: string
          p_size_bytes?: number
          p_storage_path: string
        }
        Returns: string
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
      register_trusted_device: {
        Args: { p_device_id: string; p_device_name?: string }
        Returns: undefined
      }
      reject_manual_refund_request: {
        Args: {
          p_refund_id: string
          p_reject_reason?: string
          p_rejected_by?: string
        }
        Returns: Json
      }
      release_api_idempotency_record: {
        Args: {
          p_endpoint_route: string
          p_environment: string
          p_idempotency_key: string
          p_organization_id: string
        }
        Returns: undefined
      }
      remove_integration: {
        Args: { p_integration: string; p_organization_id: string }
        Returns: Json
      }
      remove_team_member: {
        Args: {
          p_acting_merchant_id?: string
          p_merchant_id: string
          p_organization_id: string
        }
        Returns: boolean
      }
      remove_withdrawal_notification_email: {
        Args: { p_email: string }
        Returns: boolean
      }
      reorder_product_files: {
        Args: {
          p_file_ids: string[]
          p_organization_id: string
          p_product_id: string
        }
        Returns: boolean
      }
      replace_service_availability_rules: {
        Args: { p_organization_id: string; p_rules: Json }
        Returns: undefined
      }
      request_live_activation: {
        Args: {
          p_merchant_id: string
          p_metadata?: Json
          p_provisioning_key_id: string
        }
        Returns: Json
      }
      resolve_checkout_catalog_amount: {
        Args: {
          p_organization_id: string
          p_price_id?: string
          p_product_id?: string
          p_quantity?: number
        }
        Returns: number
      }
      resolve_checkout_session_id: {
        Args: { p_identifier: string }
        Returns: string
      }
      resolve_checkout_subscription_id: {
        Args: {
          p_create_if_missing?: boolean
          p_customer_id: string
          p_merchant_id: string
          p_organization_id: string
          p_price_id?: string
          p_product_id?: string
          p_subscription_id?: string
          p_subscription_metadata?: Json
        }
        Returns: string
      }
      resolve_customer_display_name: {
        Args: {
          p_email?: string
          p_name?: string
          p_phone_number?: string
          p_whatsapp_number?: string
        }
        Returns: string
      }
      resolve_customer_email_locale: {
        Args: { p_organization_id: string }
        Returns: string
      }
      resolve_effective_api_rate_limits: {
        Args: {
          p_api_key: string
          p_endpoint: string
          p_organization_id: string
        }
        Returns: Record<string, unknown>
      }
      resolve_integration_source: {
        Args: {
          p_explicit?: Database["public"]["Enums"]["integration_source"]
          p_metadata?: Json
        }
        Returns: Database["public"]["Enums"]["integration_source"]
      }
      resolve_invoice_checkout_by_token: {
        Args: { p_token: string }
        Returns: Json
      }
      resolve_jumbo_message_limit: {
        Args: { p_organization_id: string }
        Returns: number
      }
      resolve_network_member_merchant_id: {
        Args: { p_network_membership_id: string }
        Returns: string
      }
      resolve_network_request_context: {
        Args: {
          p_actor_organization_id: string
          p_environment?: string
          p_lomi_account?: string
          p_required_capability?: string
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
      resolve_organization_currency: {
        Args: {
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_organization_id: string
        }
        Returns: Database["public"]["Enums"]["currency_code"]
      }
      resolve_organization_id: {
        Args: { p_identifier: string }
        Returns: string
      }
      resolve_organization_logo_url_for_email: {
        Args: { p_default_logo_url?: string; p_logo_url: string }
        Returns: string
      }
      resolve_payment_link_id: {
        Args: { p_identifier: string }
        Returns: string
      }
      resolve_product_id: { Args: { p_identifier: string }; Returns: string }
      resolve_subscription_refund_action: {
        Args: {
          p_explicit_action?: string
          p_is_full_refund: boolean
          p_transaction_id: string
        }
        Returns: string
      }
      resolve_subscription_signup_terms: {
        Args: {
          p_as_of_date?: string
          p_price_id: string
          p_product_id: string
        }
        Returns: {
          first_charge_amount: number
          first_payment_type: string
          next_billing_date: string
          requires_payment: boolean
          trial_enabled: boolean
          trial_period_days: number
        }[]
      }
      resolve_tier_id_for_volume_xof: {
        Args: { p_volume_xof: number }
        Returns: string
      }
      resolve_transaction_id: {
        Args: { p_identifier: string }
        Returns: string
      }
      resolve_transaction_product: {
        Args: {
          p_checkout_session_id: string
          p_product_id?: string
          p_quantity?: number
        }
        Returns: {
          product_id: string
          quantity: number
        }[]
      }
      resolve_whatsapp_order_line_items: {
        Args: { p_organization_id: string; p_raw_order: Json }
        Returns: Json
      }
      restore_merchant: {
        Args: { p_merchant_id: string }
        Returns: Json
      }
      retry_webhook_delivery: {
        Args: { p_log_id: string; p_merchant_id: string; p_webhook_id: string }
        Returns: boolean
      }
      revoke_all_trusted_devices: { Args: never; Returns: undefined }
      revoke_api_key: {
        Args: { p_api_key: string; p_merchant_id: string }
        Returns: boolean
      }
      revoke_provisioning_key: {
        Args: { p_provisioning_key_id: string }
        Returns: boolean
      }
      revoke_purchase_entitlements: {
        Args: { p_transaction_id: string }
        Returns: number
      }
      revoke_team_invitation: {
        Args: {
          p_acting_merchant_id?: string
          p_email: string
          p_organization_id: string
        }
        Returns: undefined
      }
      revoke_trusted_device: {
        Args: { p_device_id: string }
        Returns: undefined
      }
      rollback_mtn_refund: {
        Args: { p_reason?: string; p_refund_id: string }
        Returns: Json
      }
      rollback_wave_refund: {
        Args: { p_reason?: string; p_refund_id: string }
        Returns: Json
      }
      round_xof_amount: { Args: { p_amount: number }; Returns: number }
      safe_delete_payment_link: {
        Args: {
          p_link_id: string
          p_merchant_id?: string
          p_organization_id?: string
        }
        Returns: boolean
      }
      save_assistant_org_settings: {
        Args: {
          p_assistant_enabled?: boolean
          p_auto_approved_tool_ids?: string[]
          p_disabled_tool_ids?: string[]
          p_merchant_id: string
          p_organization_id: string
          p_write_tools_enabled?: boolean
        }
        Returns: undefined
      }
      save_assistant_user_preferences: {
        Args: {
          p_auto_approved_tool_ids?: string[]
          p_disabled_tool_ids?: string[]
          p_merchant_id: string
          p_organization_id: string
        }
        Returns: undefined
      }
      save_conversion_rates: {
        Args: {
          p_from_currency: Database["public"]["Enums"]["currency_code"]
          p_rate: number
          p_to_currency: Database["public"]["Enums"]["currency_code"]
        }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      save_integration_click: {
        Args: { p_integration: string; p_organization_id: string }
        Returns: Json
      }
      search_global: {
        Args: {
          p_environment?: string
          p_limit?: number
          p_organization_id: string
          p_query: string
        }
        Returns: {
          href: string
          id: string
          metadata: Json
          subtitle: string
          title: string
          type: string
        }[]
      }
      send_activation_request_notification: {
        Args: {
          business_description: string
          country: string
          legal_name: string
          merchant_id: string
          request_date: string
          signatory_email: string
          signatory_name: string
        }
        Returns: undefined
      }
      send_customer_payment_disruption_notification: {
        Args: {
          p_checkout_session_id: string
          p_extend_hours?: number
          p_force?: boolean
          p_payment_method_label?: string
        }
        Returns: boolean
      }
      send_digital_delivery_email: {
        Args: { p_transaction_id: string }
        Returns: undefined
      }
      send_digital_files_updated_email: {
        Args: { p_transaction_id: string }
        Returns: undefined
      }
      send_feedback_notification: {
        Args: {
          p_created_at: string
          p_merchant_email: string
          p_merchant_name: string
          p_message: string
          p_sentiment: string
        }
        Returns: undefined
      }
      send_invoice_payment_reminders: { Args: never; Returns: number }
      send_invoice_reminder: {
        Args: {
          p_invoice_id: string
          p_merchant_id?: string
          p_organization_id: string
        }
        Returns: Json
      }
      send_job_application_confirmation: {
        Args: {
          p_applicant_email: string
          p_applicant_name: string
          p_applied_at: string
          p_job_title: string
        }
        Returns: undefined
      }
      send_job_application_notification: {
        Args: {
          p_applicant_email: string
          p_applicant_name: string
          p_applied_at: string
          p_github_url: string
          p_job_title: string
          p_linkedin_url: string
          p_project_note: string
          p_resume_url: string
        }
        Returns: undefined
      }
      send_job_application_rejection: {
        Args: {
          p_applicant_email: string
          p_applicant_name: string
          p_job_title: string
        }
        Returns: undefined
      }
      send_manual_card_refund_request_admin_email: {
        Args: { p_merchant_id: string; p_refund_id: string }
        Returns: undefined
      }
      send_marketing_email: {
        Args: {
          p_email_key: string
          p_merchant_id: string
          p_organization_id: string
        }
        Returns: boolean
      }
      send_merchant_support_confirmation: {
        Args: {
          p_merchant_email: string
          p_organization_id?: string
          p_support_request_id: string
        }
        Returns: undefined
      }
      send_merchant_support_status_update: {
        Args: {
          p_merchant_email: string
          p_organization_id: string
          p_resolution_message: string
          p_status: Database["public"]["Enums"]["support_status"]
          p_subject: string
          p_support_request_id: string
        }
        Returns: undefined
      }
      send_onboarding_welcome_email: {
        Args: { user_email: string; user_name: string }
        Returns: undefined
      }
      send_payment_request_notification: {
        Args: { p_checkout_session_id: string }
        Returns: boolean
      }
      send_payout_method_lifecycle_email: {
        Args: { p_email_type: string; p_payout_method_id: string }
        Returns: undefined
      }
      send_signup_notification_email: {
        Args: {
          merchant_email: string
          merchant_name: string
          signup_date: string
        }
        Returns: undefined
      }
      send_subscription_renewal_email: {
        Args: {
          p_checkout_url?: string
          p_subscription_id: string
          p_template_type?: string
        }
        Returns: boolean
      }
      send_subscription_renewal_failed_notification: {
        Args: {
          p_error?: string
          p_is_final_failure?: boolean
          p_merchant_only?: boolean
          p_subscription_id: string
        }
        Returns: boolean
      }
      send_subscription_signup_notification: {
        Args: { p_subscription_id: string }
        Returns: boolean
      }
      send_subscription_status_change_notification: {
        Args: {
          p_change: string
          p_initiated_by?: string
          p_subscription_id: string
        }
        Returns: boolean
      }
      send_support_request_notification: {
        Args: {
          p_category: Database["public"]["Enums"]["support_category"]
          p_created_at: string
          p_image_url: string
          p_merchant_email: string
          p_merchant_name: string
          p_message: string
        }
        Returns: undefined
      }
      send_transaction_confirmation_email: {
        Args: { p_transaction_id: string }
        Returns: undefined
      }
      send_transaction_receipt_email: {
        Args: { p_transaction_id: string }
        Returns: string
      }
      send_whatsapp_order_payment_link: {
        Args: { p_whatsapp_order_id: string }
        Returns: boolean
      }
      send_withdrawal_confirmation_email: {
        Args: { p_payout_id: string }
        Returns: undefined
      }
      session_org_has_permission: {
        Args: { p_organization_id: string; p_permission_key: string }
        Returns: boolean
      }
      set_customer_invoice_pdf_url: {
        Args: {
          p_invoice_id: string
          p_organization_id: string
          p_pdf_url: string
        }
        Returns: Json
      }
      set_default_payout_method: {
        Args: { p_organization_id?: string; p_payout_method_id: string }
        Returns: undefined
      }
      set_default_price: {
        Args: { p_price_id: string; p_product_id: string }
        Returns: undefined
      }
      set_last_visited_organization: {
        Args: { p_organization_id: string }
        Returns: undefined
      }
      set_network_capability_grant: {
        Args: {
          p_capability_key: string
          p_environment: string
          p_granted_by?: string
          p_metadata?: Json
          p_network_membership_id: string
          p_status?: Database["public"]["Enums"]["network_capability_status"]
        }
        Returns: string
      }
      set_network_membership_status: {
        Args: {
          p_actor_merchant_id?: string
          p_metadata?: Json
          p_network_membership_id: string
          p_status: Database["public"]["Enums"]["network_membership_status"]
        }
        Returns: boolean
      }
      set_organization_api_access_suspended: {
        Args: { p_organization_id: string; p_suspended: boolean }
        Returns: undefined
      }
      set_primary_payout_method: {
        Args: { p_organization_id?: string; p_payout_method_id: string }
        Returns: undefined
      }
      set_rate_limit_policy: {
        Args: {
          p_api_key: string
          p_endpoint_pattern: string
          p_environment: string
          p_organization_id: string
          p_priority?: number
          p_requests_per_day: number
          p_requests_per_minute: number
          p_scope_type: string
        }
        Returns: string
      }
      set_subscription_webhook_context: {
        Args: { p_actor: string; p_source: string }
        Returns: undefined
      }
      should_emit_subscription_updated: {
        Args: {
          p_new: Database["public"]["Tables"]["subscriptions"]["Row"]
          p_old: Database["public"]["Tables"]["subscriptions"]["Row"]
        }
        Returns: boolean
      }
      should_send_customer_notification: {
        Args: { p_channel: string; p_organization_id: string; p_type: string }
        Returns: boolean
      }
      skip_onboarding: {
        Args: { p_merchant_id: string; p_org_name?: string }
        Returns: undefined
      }
      soft_delete_merchant: {
        Args: { p_merchant_id: string }
        Returns: undefined
      }
      soft_delete_organization: {
        Args: { p_merchant_id: string; p_organization_id: string }
        Returns: boolean
      }
      starter_kyb_volume_threshold_xof: { Args: never; Returns: number }
      subscription_cancel_at_period_end: {
        Args: { p_metadata: Json }
        Returns: boolean
      }
      subscription_renewal_already_processed: {
        Args: { p_billing_date: string; p_subscription_id: string }
        Returns: boolean
      }
      supabase_project_base_url: { Args: never; Returns: string }
      supabase_storage_public_base_url: { Args: never; Returns: string }
      switch_organization_pricing_plan: {
        Args: {
          p_organization_id: string
          p_plan_type: Database["public"]["Enums"]["pricing_plan_type"]
        }
        Returns: boolean
      }
      sync_digital_entitlements_for_product: {
        Args: { p_notify_buyers?: boolean; p_product_id: string }
        Returns: Json
      }
      sync_organization_fees_from_defaults: {
        Args: { p_organization_id?: string; p_overwrite_existing?: boolean }
        Returns: number
      }
      sync_organization_pricing_plan_from_fees: {
        Args: { p_organization_id: string }
        Returns: Database["public"]["Enums"]["pricing_plan_type"]
      }
      sync_product_whatsapp_catalog: {
        Args: {
          p_list_on_whatsapp: boolean
          p_product_id: string
          p_product_retailer_id?: string
        }
        Returns: Json
      }
      sync_team_link_role: {
        Args: { p_merchant_org_id: string }
        Returns: undefined
      }
      test_organization_webhook: {
        Args: { p_merchant_id: string; p_webhook_id: string }
        Returns: boolean
      }
      test_webhook: {
        Args: { p_merchant_id: string; p_webhook_id: string }
        Returns: boolean
      }
      test_withdrawal_notification_email: {
        Args: { p_payout_id: string }
        Returns: string
      }
      toggle_bnpl_for_organization: {
        Args: {
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_enable?: boolean
          p_organization_id: string
        }
        Returns: boolean
      }
      transaction_gross_in_xof: {
        Args: {
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_gross_amount: number
        }
        Returns: number
      }
      transaction_has_pending_dispute: {
        Args: { p_transaction_id: string }
        Returns: boolean
      }
      transaction_renewal_billing_period_end: {
        Args: { p_transaction_id: string }
        Returns: string
      }
      trigger_exists: {
        Args: { p_table_name: string; p_trigger_name: string }
        Returns: boolean
      }
      try_parse_uuid: { Args: { value: string }; Returns: string }
      unarchive_notification: {
        Args: { p_notification_id: string }
        Returns: undefined
      }
      unarchive_payment_link: {
        Args: {
          p_link_id: string
          p_merchant_id?: string
          p_organization_id?: string
        }
        Returns: boolean
      }
      unban_user: { Args: { user_id: string }; Returns: undefined }
      update_admin_dashboard_access_config: {
        Args: { p_config: Json }
        Returns: undefined
      }
      update_admin_organization_settings: {
        Args: {
          p_organization_id: string
          p_provider_code: Database["public"]["Enums"]["provider_code"]
          p_withdrawal_limit_max: number
          p_withdrawal_limit_min: number
          p_withdrawal_limit_monthly: number
        }
        Returns: undefined
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
      update_api_key_status: {
        Args: { p_api_key: string; p_is_active: boolean; p_merchant_id: string }
        Returns: undefined
      }
      update_assistant_conversation_metadata: {
        Args: {
          p_conversation_id: string
          p_merchant_id: string
          p_metadata: Json
        }
        Returns: boolean
      }
      update_assistant_conversation_title: {
        Args: {
          p_conversation_id: string
          p_merchant_id: string
          p_title: string
        }
        Returns: {
          conversation_id: string
          title: string
        }[]
      }
      update_assistant_run: {
        Args: {
          p_clear_pending_gate?: boolean
          p_merchant_id: string
          p_messages_snapshot?: Json
          p_run_id: string
          p_status: string
        }
        Returns: undefined
      }
      update_auto_withdrawal_settings: {
        Args: {
          p_day: number
          p_enabled: boolean
          p_method?: string
          p_mobile_money_provider?: Database["public"]["Enums"]["provider_code"]
          p_payout_method_id: string
        }
        Returns: undefined
      }
      update_balances_for_transaction: {
        Args: { p_transaction_id: string }
        Returns: boolean
      }
      update_beneficiary_payout_status: {
        Args: {
          p_payout_id: string
          p_status: Database["public"]["Enums"]["payout_status"]
          p_wave_data?: Json
        }
        Returns: boolean
      }
      update_bnpl_interest_rate: {
        Args: {
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_new_rate: number
          p_organization_id: string
        }
        Returns: boolean
      }
      update_bookable_service: {
        Args: {
          p_buffer_minutes?: number
          p_deposit_type?: Database["public"]["Enums"]["service_deposit_type"]
          p_deposit_value?: number
          p_description?: string
          p_display_on_storefront?: boolean
          p_duration_minutes?: number
          p_images?: string[]
          p_is_active?: boolean
          p_name?: string
          p_payment_mode?: Database["public"]["Enums"]["service_payment_mode"]
          p_price?: number
          p_service_id: string
        }
        Returns: undefined
      }
      update_booking_status: {
        Args: {
          p_booking_id: string
          p_status: Database["public"]["Enums"]["booking_status"]
        }
        Returns: undefined
      }
      update_checkout_session_amount: {
        Args: { p_amount: number; p_checkout_session_id: string }
        Returns: Json
      }
      update_checkout_session_customer: {
        Args: {
          p_checkout_session_id: string
          p_customer_email?: string
          p_customer_id: string
          p_customer_name?: string
          p_customer_phone?: string
        }
        Returns: boolean
      }
      update_checkout_session_pricing: {
        Args: {
          p_amount: number
          p_checkout_session_id: string
          p_price_id: string
        }
        Returns: undefined
      }
      update_cli_device_request_status: {
        Args: {
          p_device_code: string
          p_new_status: Database["public"]["Enums"]["cli_device_request_status"]
        }
        Returns: boolean
      }
      update_coupon_status: {
        Args: { p_coupon_id: string; p_is_active: boolean }
        Returns: undefined
      }
      update_customer: {
        Args: {
          p_acting_merchant_id?: string
          p_address?: string
          p_city?: string
          p_country?: string
          p_customer_id: string
          p_email: string
          p_is_business?: boolean
          p_name: string
          p_phone_number?: string
          p_postal_code?: string
          p_whatsapp_number?: string
        }
        Returns: undefined
      }
      update_customer_invoice: {
        Args: { p_invoice_id: string; p_update_data: Json }
        Returns: {
          amount: number | null
          amount_due: number | null
          amount_paid: number
          amount_remaining: number | null
          billing_period_end: string | null
          billing_period_start: string | null
          checkout_session_id: string | null
          created_at: string
          created_by: string | null
          currency_code: Database["public"]["Enums"]["currency_code"]
          customer_details: Json | null
          customer_id: string | null
          customer_invoice_id: string
          date: string | null
          description: string | null
          due_date: string
          environment: string
          file_path: string[] | null
          from_details: Json | null
          internal_note: string | null
          invoice_number: string | null
          line_items: Json | null
          metadata: Json | null
          note: string | null
          organization_id: string
          origin: string
          paid_at: string | null
          payment_details: Json | null
          payment_metadata: Json
          payment_request_id: string | null
          payment_url: string | null
          pdf_url: string | null
          price_id: string | null
          product_id: string | null
          public_id: string
          recurrence_rule_id: string | null
          recurring_sequence: number | null
          scheduled_at: string | null
          sent_at: string | null
          source_key: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          subscription_id: string | null
          template: Json | null
          token: string | null
          transaction_id: string | null
          updated_at: string
          viewed_at: string | null
        }
        SetofOptions: {
          from: "*"
          to: "customer_invoices"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_customer_invoice_api: {
        Args: {
          p_invoice_id: string
          p_merchant_id?: string
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
      update_customer_notifications: {
        Args: { p_notifications: Json; p_organization_id: string }
        Returns: undefined
      }
      update_customer_subscription: {
        Args: {
          p_end_date?: string
          p_merchant_id: string
          p_metadata?: Json
          p_next_billing_date?: string
          p_start_date?: string
          p_status?: Database["public"]["Enums"]["subscription_status"]
          p_subscription_id: string
        }
        Returns: boolean
      }
      update_domain_verification_status: {
        Args: {
          p_domain: string
          p_errors?: Json
          p_organization_id: string
          p_status: Database["public"]["Enums"]["domain_verification_status"]
        }
        Returns: boolean
      }
      update_export_job_progress: {
        Args: {
          p_error_message?: string
          p_job_id: string
          p_progress?: number
          p_progress_step?: string
          p_result_filename?: string
          p_result_path?: string
          p_status: string
        }
        Returns: undefined
      }
      update_feedback_status: {
        Args: {
          p_feedback_id: string
          p_status: Database["public"]["Enums"]["feedback_status"]
        }
        Returns: undefined
      }
      update_fraud_alert_status: {
        Args: {
          p_alert_id: string
          p_organization_id: string
          p_status: Database["public"]["Enums"]["fraud_alert_status"]
        }
        Returns: Json
      }
      update_invoice_payment_request: {
        Args: {
          p_invoice_id: string
          p_payment_request_id: string
          p_status: string
        }
        Returns: undefined
      }
      update_job_application_status: {
        Args: { p_application_id: string; p_status: string }
        Returns: undefined
      }
      update_mcp_device_request_status: {
        Args: {
          p_device_code: string
          p_new_status: Database["public"]["Enums"]["cli_device_request_status"]
        }
        Returns: boolean
      }
      update_merchant_account_balance: {
        Args: {
          p_amount: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_merchant_id: string
          p_organization_id: string
          p_record_history?: boolean
        }
        Returns: undefined
      }
      update_merchant_avatar: {
        Args: { p_avatar_url: string; p_merchant_id: string }
        Returns: undefined
      }
      update_merchant_details: {
        Args: {
          p_email: string
          p_merchant_id: string
          p_name: string
          p_phone_number: string
          p_preferred_language: string
        }
        Returns: undefined
      }
      update_merchant_preferences_communication: {
        Args: { p_receive_product_marketing_emails: boolean }
        Returns: Json
      }
      update_merchant_recipients: {
        Args: { p_organization_id: string; p_recipients: Json }
        Returns: undefined
      }
      update_meter_api: {
        Args: {
          p_aggregation?: Json
          p_filter?: Json
          p_is_active?: boolean
          p_meter_id: string
          p_organization_id: string
        }
        Returns: string
      }
      update_meter_dashboard: {
        Args: {
          p_aggregation?: Json
          p_filter?: Json
          p_is_active?: boolean
          p_merchant_id: string
          p_meter_id: string
          p_organization_id: string
        }
        Returns: string
      }
      update_mtn_provider_reference: {
        Args: { p_provider_reference_id: string; p_transaction_id: string }
        Returns: boolean
      }
      update_mtn_transaction_status: {
        Args: {
          p_error_code?: string
          p_error_message?: string
          p_external_id: string
          p_metadata?: Json
          p_payment_status: Database["public"]["Enums"]["provider_payment_status"]
          p_provider_reference_id: string
        }
        Returns: undefined
      }
      update_organization_address: {
        Args: {
          p_city: string
          p_country: string
          p_district: string
          p_organization_id: string
          p_postal_code: string
          p_region: string
          p_street: string
        }
        Returns: undefined
      }
      update_organization_balance_for_refund: {
        Args: {
          p_processing_fee_percentage?: number
          p_refund_amount: number
          p_transaction_id: string
        }
        Returns: {
          error_message: string
          success: boolean
        }[]
      }
      update_organization_checkout_settings: {
        Args: {
          p_acting_merchant_id?: string
          p_organization_id: string
          p_settings: Json
        }
        Returns: Json
      }
      update_organization_details: {
        Args: {
          p_default_currency: string
          p_email: string
          p_name: string
          p_organization_id: string
          p_verification_status: string
          p_website_url: string
        }
        Returns: undefined
      }
      update_organization_email: {
        Args: { p_email: string; p_organization_id: string }
        Returns: boolean
      }
      update_organization_fee: {
        Args: {
          p_fee_structure_id: string
          p_fixed_amount?: number
          p_percentage?: number
        }
        Returns: boolean
      }
      update_organization_kyc_status: {
        Args: {
          p_organization_id: string
          p_rejection_reason?: string
          p_status: Database["public"]["Enums"]["kyc_status"]
        }
        Returns: undefined
      }
      update_organization_logo: {
        Args: { p_logo_url: string; p_organization_id: string }
        Returns: undefined
      }
      update_organization_name: {
        Args: { p_name: string; p_organization_id: string }
        Returns: boolean
      }
      update_organization_operating_countries: {
        Args: { p_operating_countries: Json; p_organization_id: string }
        Returns: undefined
      }
      update_organization_payment_parameters: {
        Args: {
          p_acting_merchant_id?: string
          p_organization_id: string
          p_settings: Json
        }
        Returns: Json
      }
      update_organization_pin_code: {
        Args: {
          p_current_pin?: string
          p_merchant_id: string
          p_organization_id: string
          p_pin_code?: string
        }
        Returns: undefined
      }
      update_organization_provider_connection: {
        Args: {
          p_acting_merchant_id?: string
          p_is_connected: boolean
          p_metadata?: Json
          p_organization_id: string
          p_provider_code: Database["public"]["Enums"]["provider_code"]
          p_provider_merchant_id?: string
        }
        Returns: undefined
      }
      update_organization_provider_phone: {
        Args: {
          p_is_phone_verified?: boolean
          p_organization_id: string
          p_phone_number: string
          p_provider_code: Database["public"]["Enums"]["provider_code"]
        }
        Returns: undefined
      }
      update_organization_radar_settings_api: {
        Args: {
          p_enabled?: boolean
          p_mode?: Database["public"]["Enums"]["radar_mode"]
          p_organization_id: string
          p_stripe_radar_passthrough?: boolean
        }
        Returns: {
          enabled: boolean
          mode: Database["public"]["Enums"]["radar_mode"]
          organization_id: string
          radar_meter_id: string
          stripe_radar_passthrough: boolean
        }[]
      }
      update_organization_slug: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_slug: string
        }
        Returns: {
          organization_id: string
          slug: string
        }[]
      }
      update_organization_storefront: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_storefront_enabled: boolean
        }
        Returns: {
          organization_id: string
          storefront_enabled: boolean
        }[]
      }
      update_organization_tiers_monthly: {
        Args: never
        Returns: {
          currency_code: Database["public"]["Enums"]["currency_code"]
          new_tier_name: string
          organization_id: string
          organization_name: string
          previous_month_revenue: number
          tier_updated: boolean
        }[]
      }
      update_organization_webhook: {
        Args: {
          p_authorized_events: Database["public"]["Enums"]["webhook_event"][]
          p_is_active?: boolean
          p_merchant_id: string
          p_metadata?: Json
          p_url: string
          p_webhook_id: string
        }
        Returns: {
          authorized_events: Database["public"]["Enums"]["webhook_event"][]
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
        SetofOptions: {
          from: "*"
          to: "webhooks"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_organization_with_permissions: {
        Args: {
          p_default_currency: string
          p_email: string
          p_merchant_id: string
          p_name: string
          p_organization_id: string
          p_verification_status: string
          p_website_url: string
        }
        Returns: undefined
      }
      update_payment_availability_delay: {
        Args: {
          p_delay_hours?: number
          p_is_active?: boolean
          p_organization_id: string
          p_payment_method_code?: Database["public"]["Enums"]["payment_method_code"]
          p_provider_code?: Database["public"]["Enums"]["provider_code"]
        }
        Returns: boolean
      }
      update_payment_link: {
        Args: {
          p_allow_coupon_code?: boolean
          p_allow_quantity?: boolean
          p_cancel_url?: string
          p_description?: string
          p_expires_at?: string
          p_is_active?: boolean
          p_link_id: string
          p_merchant_id?: string
          p_metadata?: Json
          p_organization_id?: string
          p_price?: number
          p_require_billing_address?: boolean
          p_require_email?: boolean
          p_require_name?: boolean
          p_require_phone?: boolean
          p_success_url?: string
          p_title?: string
        }
        Returns: {
          allow_coupon_code: boolean
          allow_quantity: boolean
          amount: number | null
          cancel_url: string | null
          created_at: string
          created_by: string | null
          currency_code: Database["public"]["Enums"]["currency_code"]
          description: string | null
          environment: string
          expires_at: string | null
          is_active: boolean
          link_id: string
          link_type: Database["public"]["Enums"]["link_type"]
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
        SetofOptions: {
          from: "*"
          to: "payment_links"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_payment_provider_fee: {
        Args: {
          p_cost_fix: number
          p_cost_pct: number
          p_id: string
          p_price_fix: number
          p_price_pct: number
        }
        Returns: Json
      }
      update_payout_last_run: {
        Args: { p_last_run: string; p_payout_method_id: string }
        Returns: undefined
      }
      update_platform_channel_balance: {
        Args: {
          p_amount: number
          p_beneficiary_payout_id?: string
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_fee_amount?: number
          p_operation_type?: string
          p_payout_id?: string
          p_provider_code: Database["public"]["Enums"]["provider_code"]
          p_transaction_id?: string
        }
        Returns: undefined
      }
      update_platform_setting_json: {
        Args: { p_setting_key: string; p_setting_value: Json }
        Returns: undefined
      }
      update_price: {
        Args: {
          p_amount?: number
          p_clear_maximum?: boolean
          p_is_active?: boolean
          p_is_default?: boolean
          p_maximum_amount?: number
          p_metadata?: Json
          p_minimum_amount?: number
          p_price_id: string
          p_pricing_model?: Database["public"]["Enums"]["pricing_model"]
        }
        Returns: undefined
      }
      update_product: {
        Args: {
          p_continue_selling_when_out_of_stock?: boolean
          p_description?: string
          p_display_on_storefront?: boolean
          p_fee_type_ids?: string[]
          p_fulfillment_type?: Database["public"]["Enums"]["product_fulfillment_type"]
          p_images?: string[]
          p_inventory_quantity?: number
          p_is_active?: boolean
          p_license_key_enabled?: boolean
          p_merchant_id?: string
          p_metadata?: Json
          p_name?: string
          p_product_id: string
          p_product_type?: Database["public"]["Enums"]["product_type"]
          p_sku?: string
          p_track_inventory?: boolean
        }
        Returns: undefined
      }
      update_product_recurring_settings: {
        Args: {
          p_billing_frequency?: Database["public"]["Enums"]["billing_interval"]
          p_charge_day?: number
          p_failed_payment_action?: Database["public"]["Enums"]["failed_payment_action"]
          p_first_payment_type?: Database["public"]["Enums"]["first_payment_type"]
          p_product_id: string
          p_trial_enabled?: boolean
          p_trial_period_days?: number
        }
        Returns: undefined
      }
      update_product_service: {
        Args: {
          p_is_active?: boolean
          p_merchant_id: string
          p_product_id: string
        }
        Returns: undefined
      }
      update_qr_code: {
        Args: { p_is_active?: boolean; p_name?: string; p_qr_code_id: string }
        Returns: Json
      }
      update_refund_status: {
        Args: {
          p_organization_id: string
          p_refund_id: string
          p_status: Database["public"]["Enums"]["refund_status"]
          p_updated_by?: string
        }
        Returns: boolean
      }
      update_shopify_session_scope: {
        Args: { p_scope: string; p_session_id: string }
        Returns: boolean
      }
      update_spi_account_balance: {
        Args: {
          p_balance: number
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_organization_id: string
          p_synced_at?: string
        }
        Returns: undefined
      }
      update_spi_payout_status: {
        Args: {
          p_payout_id: string
          p_spi_tx_id: string
          p_status: Database["public"]["Enums"]["payout_status"]
        }
        Returns: undefined
      }
      update_spi_qr_code: {
        Args: {
          p_amount?: number
          p_is_active?: boolean
          p_metadata?: Json
          p_name?: string
          p_product_id?: string
          p_qr_code_id: string
        }
        Returns: undefined
      }
      update_staff_impersonation_consent: {
        Args: { p_allow: boolean; p_organization_id: string }
        Returns: undefined
      }
      update_starter_business_kyc: {
        Args: {
          p_address_proof_url?: string
          p_business_description?: string
          p_business_registration_url?: string
          p_identity_proof_url?: string
          p_merchant_id: string
          p_organization_id: string
          p_tax_number?: string
        }
        Returns: undefined
      }
      update_storefront_settings: {
        Args: {
          p_announcement_active?: boolean
          p_announcement_text?: string
          p_merchant_id: string
          p_organization_id: string
          p_shipping_config?: Json
          p_tax_config?: Json
        }
        Returns: {
          organization_id: string
          storefront_id: string
        }[]
      }
      update_stripe_checkout_status: {
        Args: {
          p_error_code?: string
          p_error_message?: string
          p_metadata?: Json
          p_payment_status?: Database["public"]["Enums"]["provider_payment_status"]
          p_stripe_charge_id?: string
          p_stripe_payment_intent_id: string
          p_stripe_payment_method_id?: string
        }
        Returns: Json
      }
      update_subscription_next_billing_date: {
        Args: { p_subscription_id: string }
        Returns: string
      }
      update_subscription_status: {
        Args: {
          p_acting_merchant_id?: string
          p_end_date?: string
          p_initiated_by?: string
          p_metadata?: string
          p_organization_id?: string
          p_status: Database["public"]["Enums"]["subscription_status"]
          p_subscription_id: string
        }
        Returns: undefined
      }
      update_support_request_priority: {
        Args: {
          p_priority: Database["public"]["Enums"]["support_priority"]
          p_support_request_id: string
        }
        Returns: undefined
      }
      update_support_request_status: {
        Args: {
          p_resolution_message?: string
          p_status: Database["public"]["Enums"]["support_status"]
          p_support_request_id: string
        }
        Returns: undefined
      }
      update_team_member_position: {
        Args: {
          p_invitation_email?: string
          p_merchant_id?: string
          p_organization_id: string
          p_position: string
        }
        Returns: boolean
      }
      update_team_member_role: {
        Args: {
          p_acting_merchant_id?: string
          p_merchant_id: string
          p_new_role: Database["public"]["Enums"]["member_role"]
          p_organization_id: string
        }
        Returns: boolean
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
          p_metadata?: Json
          p_status: Database["public"]["Enums"]["transaction_status"]
          p_transaction_id: string
        }
        Returns: boolean
      }
      update_wave_checkout_status: {
        Args: {
          p_error_code?: string
          p_error_message?: string
          p_metadata?: Json
          p_payment_status?: Database["public"]["Enums"]["provider_payment_status"]
          p_provider_checkout_id: string
          p_provider_transaction_id?: string
        }
        Returns: undefined
      }
      update_wave_payout_status: {
        Args: {
          p_transaction_id: string
          p_wave_data: Json
          p_wave_status: string
        }
        Returns: undefined
      }
      update_webhook: {
        Args: {
          p_authorized_events?: Database["public"]["Enums"]["webhook_event"][]
          p_is_active?: boolean
          p_merchant_id: string
          p_metadata?: Json
          p_url?: string
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
      upsert_network_customer_metadata_for_api: {
        Args: {
          p_customer_id: string
          p_metadata?: Json
          p_network_membership_id: string
          p_public_account_id?: string
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
          p_currency_code?: Database["public"]["Enums"]["currency_code"]
          p_fee_rule_id?: string
          p_fee_type?: Database["public"]["Enums"]["network_operator_fee_type"]
          p_fixed_amount?: number
          p_max_amount?: number
          p_metadata?: Json
          p_min_amount?: number
          p_name?: string
          p_operator_organization_id: string
          p_percent_bps?: number
          p_status?: Database["public"]["Enums"]["network_fee_rule_status"]
        }
        Returns: string
      }
      upsert_organization_customer_portal_policy: {
        Args: {
          p_allow_cancel?: boolean
          p_allow_email_auth?: boolean
          p_allow_email_change?: boolean
          p_allow_invoice_edit?: boolean
          p_allow_pause?: boolean
          p_allow_payment_method_update?: boolean
          p_allow_plan_change?: boolean
          p_allow_resume?: boolean
          p_allow_sms_auth?: boolean
          p_allow_trusted_launch?: boolean
          p_collect_cancellation_reason?: boolean
          p_merchant_id: string
          p_organization_id: string
          p_portal_session_ttl_seconds?: number
          p_return_url_allowlist?: string[]
          p_show_metered_usage?: boolean
          p_verification_max_attempts?: number
        }
        Returns: {
          allow_cancel: boolean
          allow_email_auth: boolean
          allow_email_change: boolean
          allow_invoice_edit: boolean
          allow_pause: boolean
          allow_payment_method_update: boolean
          allow_plan_change: boolean
          allow_resume: boolean
          allow_sms_auth: boolean
          allow_trusted_launch: boolean
          collect_cancellation_reason: boolean
          created_at: string
          organization_id: string
          portal_session_ttl_seconds: number
          return_url_allowlist: string[] | null
          show_metered_usage: boolean
          updated_at: string
          verification_max_attempts: number
        }[]
        SetofOptions: {
          from: "*"
          to: "organization_customer_portal_policies"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      upsert_organization_fraud_setting: {
        Args: {
          p_custom_action?: Database["public"]["Enums"]["fraud_action"]
          p_custom_threshold?: number
          p_is_enabled?: boolean
          p_organization_id: string
          p_rule_id: string
        }
        Returns: Json
      }
      upsert_organization_role: {
        Args: {
          p_key: string
          p_organization_id: string
          p_permission_keys: string[]
          p_role_id?: string
          p_title: string
        }
        Returns: string
      }
      upsert_price_tier: {
        Args: {
          p_flat_amount?: number
          p_from_units: number
          p_organization_id: string
          p_price_id: string
          p_to_units?: number
          p_unit_amount?: number
        }
        Returns: string
      }
      upsert_shopify_pending_payment: {
        Args: {
          p_checkout_session_id?: string
          p_draft_order_id: string
          p_shop_domain: string
        }
        Returns: boolean
      }
      upsert_shopify_shop_settings: {
        Args: {
          p_allow_coupon_code?: boolean
          p_api_key: string
          p_api_secret: string
          p_flat_shipping_fee?: number
          p_merchant_id: string
          p_require_billing_address?: boolean
          p_shipping_mode?: string
          p_shop: string
          p_webhook_secret: string
        }
        Returns: boolean
      }
      upsert_storefront: {
        Args: {
          p_description?: string
          p_merchant_id: string
          p_name: string
          p_organization_id: string
        }
        Returns: {
          description: string
          is_active: boolean
          name: string
          organization_id: string
          storefront_id: string
        }[]
      }
      upsert_whatsapp_business_connection: {
        Args: {
          p_catalog_id?: string
          p_display_phone_number?: string
          p_kapso_connection_id?: string
          p_organization_id: string
          p_phone_number_id: string
          p_settings?: Json
          p_waba_id: string
        }
        Returns: Json
      }
      upsert_whatsapp_catalog_pull_item: {
        Args: {
          p_meta_catalog_id: string
          p_meta_product_id?: string
          p_meta_snapshot?: Json
          p_organization_id: string
          p_product_retailer_id: string
        }
        Returns: string
      }
      upsert_whatsapp_platform_template_config: {
        Args: {
          p_approved_count: number
          p_missing_count: number
          p_pending_count: number
          p_phone_number_id: string
          p_ready: boolean
          p_rejected_count: number
          p_required_count: number
          p_summary: Json
          p_waba_id: string
        }
        Returns: undefined
      }
      user_has_verified_totp: { Args: { p_user_id: string }; Returns: boolean }
      validate_api_key: {
        Args: { p_api_key: string }
        Returns: {
          environment: string
          expiration_date: string
          is_active: boolean
          merchant_id: string
          organization_id: string
        }[]
      }
      validate_checkout_payment_amount: {
        Args: {
          p_amount: number
          p_checkout_session_id: string
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_organization_id: string
        }
        Returns: undefined
      }
      validate_checkout_product_amount: {
        Args: {
          p_currency_code: Database["public"]["Enums"]["currency_code"]
          p_organization_id: string
          p_price_id: string
          p_product_id: string
          p_quantity: number
          p_total_amount: number
        }
        Returns: undefined
      }
      validate_coupon_for_checkout: {
        Args: {
          p_coupon_code: string
          p_customer_id?: string
          p_organization_id: string
          p_product_id?: string
          p_quantity?: number
        }
        Returns: {
          coupon_id: string
          customer_eligible: boolean
          discount_fixed_amount: number
          discount_percentage: number
          discount_type: Database["public"]["Enums"]["discount_type"]
          is_valid: boolean
          max_quantity_per_use: number
          message: string
        }[]
      }
      validate_coupon_for_frontend: {
        Args: {
          p_coupon_code: string
          p_customer_id?: string
          p_organization_id: string
          p_product_id?: string
          p_quantity?: number
          p_subtotal?: number
        }
        Returns: Json
      }
      validate_coupon_for_price: {
        Args: {
          p_coupon_code: string
          p_customer_id: string
          p_organization_id: string
          p_price_id: string
        }
        Returns: {
          coupon_id: string
          discount_amount: number
          error_message: string
          is_valid: boolean
        }[]
      }
      validate_download_access_token: {
        Args: { p_token: string }
        Returns: Json
      }
      validate_resolved_line_items_stock: {
        Args: { p_resolved_items: Json }
        Returns: undefined
      }
      validate_team_invitation: {
        Args: { p_token: string }
        Returns: {
          invitation_email: string
          organization_id: string
          organization_name: string
          role: string
        }[]
      }
      verify_api_key: {
        Args: {
          p_api_key: string
          p_endpoint: string
          p_ip_address?: string
          p_request_method?: string
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
          p_ip_address?: string
          p_lomi_account?: string
          p_request_method?: string
          p_required_capability?: string
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
          p_permission_key?: string
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
          partner_status: Database["public"]["Enums"]["platform_partner_status"]
        }[]
      }
      verify_payout_pin: {
        Args: {
          p_merchant_id: string
          p_organization_id: string
          p_pin: string
        }
        Returns: string
      }
      verify_provisioning_key: {
        Args: {
          p_endpoint?: string
          p_ip_address?: string
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
          p_event_type: Database["public"]["Enums"]["webhook_event"]
          p_idempotency_key: string
          p_organization_id: string
          p_payload: Json
        }
        Returns: string
      }
    }
    Enums: {
      account_top_up_status:
        | "pending"
        | "processing"
        | "completed"
        | "rejected"
        | "cancelled"
        | "expired"
      aggregation_function: "count" | "sum" | "avg" | "min" | "max" | "unique"
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
      billing_period_status: "open" | "closing" | "closed" | "invoiced" | "void"
      bnpl_fee_type:
        | "merchant_processing"
        | "customer_interest"
        | "platform_risk"
        | "late_fee"
      bnpl_status: "pending" | "collected" | "waived" | "refunded"
      booking_status:
        | "pending_payment"
        | "confirmed"
        | "cancelled"
        | "completed"
        | "no_show"
      checkout_session_status: "open" | "completed" | "expired"
      cli_device_request_status:
        | "pending"
        | "approved"
        | "denied"
        | "expired"
        | "completed"
      conversion_type: "payment" | "withdrawal" | "refund" | "manual"
      currency_code: "XOF" | "USD" | "EUR"
      customer_type: "all" | "new" | "returning"
      discount_type: "percentage" | "fixed"
      dispute_status: "pending" | "resolved" | "closed"
      domain_payment_status: "paid" | "unpaid"
      domain_type:
        | "checkout"
        | "payment_link"
        | "storefront"
        | "invoice"
        | "general"
      domain_verification_status: "pending" | "verified" | "failed"
      entity_type: "merchant" | "organization" | "platform"
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
      event_processing_status: "pending" | "processed" | "failed"
      event_severity: "info" | "warning" | "error" | "critical"
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
      failed_payment_action: "cancel" | "pause" | "continue"
      fee_category: "payment_processing" | "payout" | "other"
      fee_payer_type: "merchant" | "customer" | "platform"
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
      fee_type: "platform" | "processing" | "conversion" | "payout" | "refund"
      feedback_status: "open" | "reviewed" | "implemented" | "closed"
      filter_operator:
        | "eq"
        | "ne"
        | "gt"
        | "gte"
        | "lt"
        | "lte"
        | "like"
        | "not_like"
      first_payment_type: "initial" | "non_initial" | "prorated"
      fraud_action: "flag" | "block"
      fraud_alert_status: "flagged" | "blocked" | "resolved" | "dismissed"
      fraud_rule_type: "velocity" | "threshold" | "watchlist"
      growth_contact_role:
        | "champion"
        | "decision_maker"
        | "influencer"
        | "other"
      growth_deal_stage:
        | "lead"
        | "qualified"
        | "meeting"
        | "proposal"
        | "won"
        | "lost"
      growth_lead_source:
        | "internal"
        | "google_places"
        | "exa"
        | "manual"
        | "lookalike"
        | "signal"
        | "champion"
        | "inbound"
      growth_lead_status:
        | "new"
        | "qualified"
        | "contacted"
        | "won"
        | "lost"
        | "skipped"
      growth_outbound_channel: "email" | "linkedin" | "whatsapp"
      growth_outbound_direction: "outbound" | "reply"
      growth_reply_platform: "twitter" | "telegram" | "linkedin" | "manual"
      growth_reply_status:
        | "pending"
        | "approved"
        | "rejected"
        | "posted"
        | "failed"
      growth_sequence_status: "draft" | "active" | "paused"
      growth_signal_event_status: "new" | "routed" | "dismissed" | "sequenced"
      integration_source:
        | "system"
        | "shopify"
        | "woocommerce"
        | "prestashop"
        | "magento"
        | "odoo"
        | "bubble"
      invoice_recurrence_end_type: "never" | "on_date" | "after_count"
      invoice_recurrence_frequency:
        | "weekly"
        | "biweekly"
        | "monthly_date"
        | "monthly_weekday"
        | "monthly_last_day"
        | "quarterly"
        | "semi_annual"
        | "annual"
        | "custom"
      invoice_recurrence_status: "active" | "paused" | "completed" | "canceled"
      invoice_status: "sent" | "paid" | "overdue" | "cancelled" | "draft"
      kyc_status:
        | "not_submitted"
        | "pending"
        | "not_authorized"
        | "approved"
        | "rejected"
        | "starter_business"
      link_type: "instant" | "product"
      live_activation_request_status:
        | "pending_merchant"
        | "pending_review"
        | "approved"
        | "rejected"
        | "expired"
      member_role: "Admin" | "Member"
      network_account_status:
        | "pending"
        | "active"
        | "restricted"
        | "suspended"
        | "closed"
      network_capability_status:
        | "requested"
        | "active"
        | "restricted"
        | "revoked"
      network_enrollment_status:
        | "created"
        | "opened"
        | "submitted"
        | "approved"
        | "completed"
        | "expired"
        | "cancelled"
      network_fee_entry_status: "pending" | "posted" | "reversed" | "voided"
      network_fee_entry_type: "charge" | "refund_reversal" | "adjustment"
      network_fee_rule_status: "active" | "inactive" | "archived"
      network_membership_status:
        | "invited"
        | "pending_member_acceptance"
        | "pending_review"
        | "active"
        | "restricted"
        | "suspended"
        | "terminated"
      network_operator_fee_type: "fixed" | "percentage" | "blended"
      network_operator_status:
        | "pending"
        | "active"
        | "restricted"
        | "suspended"
        | "closed"
      notification_type:
        | "onboarding"
        | "tip"
        | "transaction"
        | "payout"
        | "provider_status"
        | "alert"
        | "billing"
        | "compliance"
        | "update"
        | "security_alert"
        | "maintenance"
        | "dispute"
        | "refund"
        | "invoice"
        | "subscription"
        | "webhook"
        | "chargeback"
      onboarding_status:
        | "pending"
        | "completed"
        | "skipped"
        | "failed"
        | "in_progress"
      organization_status: "active" | "inactive" | "suspended"
      organization_verification_status: "unverified" | "starter" | "verified"
      payment_method_code:
        | "CARDS"
        | "MOBILE_MONEY"
        | "BANK_TRANSFER"
        | "BNPL"
        | "FREE"
      payout_status: "pending" | "processing" | "completed" | "failed"
      permission_action: "view" | "create" | "edit" | "delete" | "approve"
      permission_category:
        | "payments"
        | "accounts"
        | "products"
        | "subscriptions"
        | "customers"
      platform_partner_status: "pending" | "active" | "suspended"
      platform_partner_type: "partner" | "self_service" | "bootstrap"
      pricing_model: "standard" | "pay_what_you_want" | "tiered" | "volume"
      pricing_plan_type: "fixed" | "volume_tiered" | "custom"
      product_fulfillment_type: "digital" | "physical" | "hybrid"
      product_type: "one_time" | "recurring" | "usage_based"
      provider_business_type: "fintech" | "other"
      provider_code:
        | "WAVE"
        | "JUMBO"
        | "MTN"
        | "STRIPE"
        | "SPI"
        | "CYBERSOURCE"
        | "FREE"
        | "GIM"
      provider_payment_status:
        | "processing"
        | "cancelled"
        | "succeeded"
        | "expired"
        | "refunded"
      provisioning_key_kind:
        | "platform"
        | "partner_subkey"
        | "self_service"
        | "bootstrap"
      qr_code_type: "static" | "dynamic"
      radar_decision: "allow" | "flag" | "block"
      radar_mode: "monitor" | "block"
      radar_rail: "card" | "mtn" | "wave"
      radar_signal_provider: "lomi" | "stripe"
      reconciliation_status:
        | "pending"
        | "matched"
        | "partial_match"
        | "mismatch"
        | "resolved"
      refund_status: "pending" | "completed" | "failed"
      service_deposit_type: "fixed" | "percentage"
      service_payment_mode: "deposit" | "in_person"
      shopify_shipping_mode: "subtotal_only" | "subtotal_plus_flat_fee"
      spi_account_status: "OUVERT" | "BLOQUE" | "CLOTURE"
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
      spi_alias_type: "SHID" | "MBNO" | "MCOD"
      spi_document_type:
        | "CINV"
        | "CMCN"
        | "DISP"
        | "PUOR"
        | "CONT"
        | "INVC"
        | "PMNT"
        | "TPMT"
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
      spi_payment_flow_type:
        | "BANK_TO_BANK"
        | "BANK_TO_WALLET"
        | "WALLET_TO_BANK"
        | "WALLET_TO_WALLET"
        | "INTRA_ACCOUNT"
      spi_payment_request_category: "500" | "521" | "401"
      spi_payment_status: "INITIE" | "ENVOYE" | "IRREVOCABLE" | "REJETE"
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
      subscription_status:
        | "pending"
        | "active"
        | "paused"
        | "cancelled"
        | "expired"
        | "past_due"
        | "trial"
      support_category:
        | "account"
        | "billing"
        | "technical"
        | "feature"
        | "other"
      support_priority: "low" | "normal" | "high" | "urgent"
      support_status: "open" | "in_progress" | "resolved" | "closed"
      team_status: "active" | "invited" | "inactive"
      ticket_status: "open" | "resolved" | "closed"
      transaction_status:
        | "pending"
        | "completed"
        | "failed"
        | "refunded"
        | "expired"
        | "held"
      transaction_type: "payment" | "instalment"
      usage_aggregation: "sum" | "max" | "last_during_period" | "last_ever"
      usage_frequency:
        | "total"
        | "per_customer"
        | "per_day"
        | "per_week"
        | "per_month"
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
      whatsapp_catalog_item_sync_status:
        | "synced"
        | "pending_push"
        | "pending_pull"
        | "conflict"
        | "deleted"
        | "error"
      whatsapp_connection_status:
        | "pending"
        | "connected"
        | "disconnected"
        | "error"
      whatsapp_order_source: "catalog_order" | "product_inquiry"
      whatsapp_order_status:
        | "received"
        | "checkout_created"
        | "payment_link_sent"
        | "paid"
        | "failed"
        | "expired"
        | "ignored"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_top_up_status: [
        "pending",
        "processing",
        "completed",
        "rejected",
        "cancelled",
        "expired",
      ],
      aggregation_function: ["count", "sum", "avg", "min", "max", "unique"],
      billing_interval: [
        "day",
        "week",
        "bi-weekly",
        "month",
        "bi-monthly",
        "quarterly",
        "semi-annual",
        "year",
        "lifetime",
        "unit",
      ],
      billing_period_status: ["open", "closing", "closed", "invoiced", "void"],
      bnpl_fee_type: [
        "merchant_processing",
        "customer_interest",
        "platform_risk",
        "late_fee",
      ],
      bnpl_status: ["pending", "collected", "waived", "refunded"],
      booking_status: [
        "pending_payment",
        "confirmed",
        "cancelled",
        "completed",
        "no_show",
      ],
      checkout_session_status: ["open", "completed", "expired"],
      cli_device_request_status: [
        "pending",
        "approved",
        "denied",
        "expired",
        "completed",
      ],
      conversion_type: ["payment", "withdrawal", "refund", "manual"],
      currency_code: ["XOF", "USD", "EUR"],
      customer_type: ["all", "new", "returning"],
      discount_type: ["percentage", "fixed"],
      dispute_status: ["pending", "resolved", "closed"],
      domain_payment_status: ["paid", "unpaid"],
      domain_type: [
        "checkout",
        "payment_link",
        "storefront",
        "invoice",
        "general",
      ],
      domain_verification_status: ["pending", "verified", "failed"],
      entity_type: ["merchant", "organization", "platform"],
      event_category: [
        "checkout",
        "payment",
        "auth",
        "api",
        "webhook",
        "catalog",
        "customer",
        "subscription",
        "system",
        "onboarding",
      ],
      event_processing_status: ["pending", "processed", "failed"],
      event_severity: ["info", "warning", "error", "critical"],
      event_type: [
        "validate_api_key",
        "create_api_key",
        "edit_api_key",
        "remove_api_key",
        "user_login",
        "edit_user_password",
        "create_pin",
        "edit_pin",
        "edit_user_details",
        "authorize_user_2fa",
        "create_user_2fa",
        "remove_user_2fa",
        "edit_user_phone",
        "set_callback_url",
        "update_webhook",
        "add_bank_account",
        "remove_bank_account",
        "create_payout",
        "beneficiary_payout_created",
        "mass_beneficiary_payout_created",
        "payout_status_change",
        "process_payment",
        "payment_status_change",
        "create_refund",
        "refund_status_change",
        "create_dispute",
        "dispute_status_change",
        "list_checkout_sessions",
        "update_subscription_plan",
        "create_subscription",
        "cancel_subscription",
        "subscription_status_change",
        "subscription_payment_failed",
        "archive_plan",
        "create_product",
        "update_product",
        "delete_product",
        "archive_product",
        "provider_status_change",
        "provider_connection_error",
        "provider_integration_success",
        "system_maintenance",
        "system_update",
        "compliance_update",
        "api_status_change",
        "kyc_status_auto_updated",
        "kyc_documents_submitted",
        "customer_verification_required",
        "customer_verification_success",
        "customer_verification_failed",
        "subscription_update",
        "pause_subscription",
        "resume_subscription",
        "update_subscription_status",
      ],
      failed_payment_action: ["cancel", "pause", "continue"],
      fee_category: ["payment_processing", "payout", "other"],
      fee_payer_type: ["merchant", "customer", "platform"],
      fee_subcategory: [
        "pos",
        "bnpl",
        "cards",
        "mobile_money",
        "bank_transfer_local",
        "bank_transfer_international",
        "bank_transfer_beneficiary",
        "mobile_money_payout",
        "mobile_money_beneficiary",
        "refund",
        "partial_refund",
        "chargeback",
        "currency_conversion",
        "international_cards",
        "subscription_payments",
      ],
      fee_type: ["platform", "processing", "conversion", "payout", "refund"],
      feedback_status: ["open", "reviewed", "implemented", "closed"],
      filter_operator: [
        "eq",
        "ne",
        "gt",
        "gte",
        "lt",
        "lte",
        "like",
        "not_like",
      ],
      first_payment_type: ["initial", "non_initial", "prorated"],
      fraud_action: ["flag", "block"],
      fraud_alert_status: ["flagged", "blocked", "resolved", "dismissed"],
      fraud_rule_type: ["velocity", "threshold", "watchlist"],
      growth_contact_role: [
        "champion",
        "decision_maker",
        "influencer",
        "other",
      ],
      growth_deal_stage: [
        "lead",
        "qualified",
        "meeting",
        "proposal",
        "won",
        "lost",
      ],
      growth_lead_source: [
        "internal",
        "google_places",
        "exa",
        "manual",
        "lookalike",
        "signal",
        "champion",
        "inbound",
      ],
      growth_lead_status: [
        "new",
        "qualified",
        "contacted",
        "won",
        "lost",
        "skipped",
      ],
      growth_outbound_channel: ["email", "linkedin", "whatsapp"],
      growth_outbound_direction: ["outbound", "reply"],
      growth_reply_platform: ["twitter", "telegram", "linkedin", "manual"],
      growth_reply_status: [
        "pending",
        "approved",
        "rejected",
        "posted",
        "failed",
      ],
      growth_sequence_status: ["draft", "active", "paused"],
      growth_signal_event_status: ["new", "routed", "dismissed", "sequenced"],
      integration_source: [
        "system",
        "shopify",
        "woocommerce",
        "prestashop",
        "magento",
        "odoo",
        "bubble",
      ],
      invoice_recurrence_end_type: ["never", "on_date", "after_count"],
      invoice_recurrence_frequency: [
        "weekly",
        "biweekly",
        "monthly_date",
        "monthly_weekday",
        "monthly_last_day",
        "quarterly",
        "semi_annual",
        "annual",
        "custom",
      ],
      invoice_recurrence_status: ["active", "paused", "completed", "canceled"],
      invoice_status: ["sent", "paid", "overdue", "cancelled", "draft"],
      kyc_status: [
        "not_submitted",
        "pending",
        "not_authorized",
        "approved",
        "rejected",
        "starter_business",
      ],
      link_type: ["instant", "product"],
      live_activation_request_status: [
        "pending_merchant",
        "pending_review",
        "approved",
        "rejected",
        "expired",
      ],
      member_role: ["Admin", "Member"],
      network_account_status: [
        "pending",
        "active",
        "restricted",
        "suspended",
        "closed",
      ],
      network_capability_status: [
        "requested",
        "active",
        "restricted",
        "revoked",
      ],
      network_enrollment_status: [
        "created",
        "opened",
        "submitted",
        "approved",
        "completed",
        "expired",
        "cancelled",
      ],
      network_fee_entry_status: ["pending", "posted", "reversed", "voided"],
      network_fee_entry_type: ["charge", "refund_reversal", "adjustment"],
      network_fee_rule_status: ["active", "inactive", "archived"],
      network_membership_status: [
        "invited",
        "pending_member_acceptance",
        "pending_review",
        "active",
        "restricted",
        "suspended",
        "terminated",
      ],
      network_operator_fee_type: ["fixed", "percentage", "blended"],
      network_operator_status: [
        "pending",
        "active",
        "restricted",
        "suspended",
        "closed",
      ],
      notification_type: [
        "onboarding",
        "tip",
        "transaction",
        "payout",
        "provider_status",
        "alert",
        "billing",
        "compliance",
        "update",
        "security_alert",
        "maintenance",
        "dispute",
        "refund",
        "invoice",
        "subscription",
        "webhook",
        "chargeback",
      ],
      onboarding_status: [
        "pending",
        "completed",
        "skipped",
        "failed",
        "in_progress",
      ],
      organization_status: ["active", "inactive", "suspended"],
      organization_verification_status: ["unverified", "starter", "verified"],
      payment_method_code: [
        "CARDS",
        "MOBILE_MONEY",
        "BANK_TRANSFER",
        "BNPL",
        "FREE",
      ],
      payout_status: ["pending", "processing", "completed", "failed"],
      permission_action: ["view", "create", "edit", "delete", "approve"],
      permission_category: [
        "payments",
        "accounts",
        "products",
        "subscriptions",
        "customers",
      ],
      platform_partner_status: ["pending", "active", "suspended"],
      platform_partner_type: ["partner", "self_service", "bootstrap"],
      pricing_model: ["standard", "pay_what_you_want", "tiered", "volume"],
      pricing_plan_type: ["fixed", "volume_tiered", "custom"],
      product_fulfillment_type: ["digital", "physical", "hybrid"],
      product_type: ["one_time", "recurring", "usage_based"],
      provider_business_type: ["fintech", "other"],
      provider_code: [
        "WAVE",
        "JUMBO",
        "MTN",
        "STRIPE",
        "SPI",
        "CYBERSOURCE",
        "FREE",
        "GIM",
      ],
      provider_payment_status: [
        "processing",
        "cancelled",
        "succeeded",
        "expired",
        "refunded",
      ],
      provisioning_key_kind: [
        "platform",
        "partner_subkey",
        "self_service",
        "bootstrap",
      ],
      qr_code_type: ["static", "dynamic"],
      radar_decision: ["allow", "flag", "block"],
      radar_mode: ["monitor", "block"],
      radar_rail: ["card", "mtn", "wave"],
      radar_signal_provider: ["lomi", "stripe"],
      reconciliation_status: [
        "pending",
        "matched",
        "partial_match",
        "mismatch",
        "resolved",
      ],
      refund_status: ["pending", "completed", "failed"],
      service_deposit_type: ["fixed", "percentage"],
      service_payment_mode: ["deposit", "in_person"],
      shopify_shipping_mode: ["subtotal_only", "subtotal_plus_flat_fee"],
      spi_account_status: ["OUVERT", "BLOQUE", "CLOTURE"],
      spi_account_type: [
        "CACC",
        "CARD",
        "CASH",
        "CHAR",
        "CISH",
        "CURR",
        "DPST",
        "SVGS",
        "ULAA",
      ],
      spi_alias_type: ["SHID", "MBNO", "MCOD"],
      spi_document_type: [
        "CINV",
        "CMCN",
        "DISP",
        "PUOR",
        "CONT",
        "INVC",
        "PMNT",
        "TPMT",
      ],
      spi_payment_category: [
        "631",
        "000",
        "400",
        "733",
        "300",
        "999",
        "500",
        "521",
        "401",
      ],
      spi_payment_flow_type: [
        "BANK_TO_BANK",
        "BANK_TO_WALLET",
        "WALLET_TO_BANK",
        "WALLET_TO_WALLET",
        "INTRA_ACCOUNT",
      ],
      spi_payment_request_category: ["500", "521", "401"],
      spi_payment_status: ["INITIE", "ENVOYE", "IRREVOCABLE", "REJETE"],
      spi_rejection_reason: [
        "BE23",
        "DU03",
        "AC04",
        "AC06",
        "AEXR",
        "AG03",
        "AG10",
        "AG11",
        "ALAC",
        "AM02",
        "AM09",
        "AM14",
        "APAR",
        "RR07",
        "FR01",
        "AB03",
        "AB04",
        "AB08",
        "AB09",
        "AC03",
        "AG01",
        "AM04",
        "RR04",
        "CUST",
        "ARDT",
      ],
      spi_webhook_event_code: [
        "PAIEMENT_RECU",
        "PAIEMENT_ENVOYE",
        "PAIEMENT_REJETE",
        "RTP_RECU",
        "RTP_REJETE",
        "RETOUR_ENVOYE",
        "RETOUR_REJETE",
        "RETOUR_RECU",
        "ANNULATION_DEMANDE",
        "ANNULATION_REJETE",
      ],
      subscription_status: [
        "pending",
        "active",
        "paused",
        "cancelled",
        "expired",
        "past_due",
        "trial",
      ],
      support_category: ["account", "billing", "technical", "feature", "other"],
      support_priority: ["low", "normal", "high", "urgent"],
      support_status: ["open", "in_progress", "resolved", "closed"],
      team_status: ["active", "invited", "inactive"],
      ticket_status: ["open", "resolved", "closed"],
      transaction_status: [
        "pending",
        "completed",
        "failed",
        "refunded",
        "expired",
        "held",
      ],
      transaction_type: ["payment", "instalment"],
      usage_aggregation: ["sum", "max", "last_during_period", "last_ever"],
      usage_frequency: [
        "total",
        "per_customer",
        "per_day",
        "per_week",
        "per_month",
      ],
      webhook_event: [
        "PAYMENT_CREATED",
        "PAYMENT_SUCCEEDED",
        "PAYMENT_FAILED",
        "PURCHASE_FULFILLED",
        "REFUND_CREATED",
        "REFUND_COMPLETED",
        "REFUND_FAILED",
        "SUBSCRIPTION_CREATED",
        "SUBSCRIPTION_RENEWED",
        "SUBSCRIPTION_CANCELLED",
        "SUBSCRIPTION_UPDATED",
        "NETWORK_ENROLLMENT_CREATED",
        "NETWORK_ENROLLMENT_COMPLETED",
        "NETWORK_MEMBERSHIP_ACTIVE",
        "NETWORK_MEMBERSHIP_RESTRICTED",
        "NETWORK_MEMBERSHIP_TERMINATED",
        "NETWORK_PAYMENT_CREATED",
        "NETWORK_OPERATOR_FEE_CREATED",
        "NETWORK_OPERATOR_FEE_REVERSED",
        "USAGE_RECORDED",
        "USAGE_INVOICE_CREATED",
        "USAGE_INVOICE_PAID",
        "USAGE_INVOICE_OVERDUE",
        "SUBSCRIPTION_USAGE_PERIOD_CLOSED",
        "DISPUTE_CREATED",
        "DISPUTE_UPDATED",
        "DISPUTE_CLOSED",
        "PAYMENT_RISK_FLAGGED",
        "PAYMENT_RISK_BLOCKED",
        "PAYOUT_CREATED",
        "PAYOUT_COMPLETED",
        "PAYOUT_FAILED",
      ],
      whatsapp_catalog_item_sync_status: [
        "synced",
        "pending_push",
        "pending_pull",
        "conflict",
        "deleted",
        "error",
      ],
      whatsapp_connection_status: [
        "pending",
        "connected",
        "disconnected",
        "error",
      ],
      whatsapp_order_source: ["catalog_order", "product_inquiry"],
      whatsapp_order_status: [
        "received",
        "checkout_created",
        "payment_link_sent",
        "paid",
        "failed",
        "expired",
        "ignored",
      ],
    },
  },
} as const
