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
      campaign: {
        Row: {
          company_id: number | null
          description: string | null
          end_date: string | null
          id: number
          meta: Json | null
          name: string
          start_date: string | null
          state: string | null
        }
        Insert: {
          company_id?: number | null
          description?: string | null
          end_date?: string | null
          id?: never
          meta?: Json | null
          name: string
          start_date?: string | null
          state?: string | null
        }
        Update: {
          company_id?: number | null
          description?: string | null
          end_date?: string | null
          id?: never
          meta?: Json | null
          name?: string
          start_date?: string | null
          state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_creator: {
        Row: {
          assigned_budget: number | null
          campaign_id: number | null
          creator_id: number | null
          current_state: string | null
          id: number
          last_state_change_at: string | null
          meta: Json | null
          notes: string | null
        }
        Insert: {
          assigned_budget?: number | null
          campaign_id?: number | null
          creator_id?: number | null
          current_state?: string | null
          id?: never
          last_state_change_at?: string | null
          meta?: Json | null
          notes?: string | null
        }
        Update: {
          assigned_budget?: number | null
          campaign_id?: number | null
          creator_id?: number | null
          current_state?: string | null
          id?: never
          last_state_change_at?: string | null
          meta?: Json | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_creator_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_creator_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_creator_audit: {
        Row: {
          campaign_creator_id: number | null
          changed_at: string | null
          changed_by: string | null
          id: number
          meta: Json | null
          new_state: string | null
          notes: string | null
          previous_state: string | null
        }
        Insert: {
          campaign_creator_id?: number | null
          changed_at?: string | null
          changed_by?: string | null
          id?: never
          meta?: Json | null
          new_state?: string | null
          notes?: string | null
          previous_state?: string | null
        }
        Update: {
          campaign_creator_id?: number | null
          changed_at?: string | null
          changed_by?: string | null
          id?: never
          meta?: Json | null
          new_state?: string | null
          notes?: string | null
          previous_state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_creator_audit_campaign_creator_id_fkey"
            columns: ["campaign_creator_id"]
            isOneToOne: false
            referencedRelation: "campaign_creator"
            referencedColumns: ["id"]
          },
        ]
      }
      company: {
        Row: {
          category: string | null
          description: string | null
          id: number
          meta: Json | null
          name: string
          owner_name: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          category?: string | null
          description?: string | null
          id?: never
          meta?: Json | null
          name: string
          owner_name?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          category?: string | null
          description?: string | null
          id?: never
          meta?: Json | null
          name?: string
          owner_name?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      content_analytics: {
        Row: {
          comments: number | null
          delivered_content_id: number | null
          engagement_rate: number | null
          fetched_at: string | null
          id: number
          likes: number | null
          meta: Json | null
          reach: number | null
          shares: number | null
          views: number | null
        }
        Insert: {
          comments?: number | null
          delivered_content_id?: number | null
          engagement_rate?: number | null
          fetched_at?: string | null
          id?: never
          likes?: number | null
          meta?: Json | null
          reach?: number | null
          shares?: number | null
          views?: number | null
        }
        Update: {
          comments?: number | null
          delivered_content_id?: number | null
          engagement_rate?: number | null
          fetched_at?: string | null
          id?: never
          likes?: number | null
          meta?: Json | null
          reach?: number | null
          shares?: number | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_analytics_delivered_content_id_fkey"
            columns: ["delivered_content_id"]
            isOneToOne: false
            referencedRelation: "delivered_content"
            referencedColumns: ["id"]
          },
        ]
      }
      contract: {
        Row: {
          campaign_creator_id: number | null
          id: number
          meta: Json | null
          pdf_url: string | null
          sent_at: string | null
          signed_by_brand_at: string | null
          signed_by_creator_at: string | null
          status: string | null
        }
        Insert: {
          campaign_creator_id?: number | null
          id?: never
          meta?: Json | null
          pdf_url?: string | null
          sent_at?: string | null
          signed_by_brand_at?: string | null
          signed_by_creator_at?: string | null
          status?: string | null
        }
        Update: {
          campaign_creator_id?: number | null
          id?: never
          meta?: Json | null
          pdf_url?: string | null
          sent_at?: string | null
          signed_by_brand_at?: string | null
          signed_by_creator_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_campaign_creator_id_fkey"
            columns: ["campaign_creator_id"]
            isOneToOne: false
            referencedRelation: "campaign_creator"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_audit: {
        Row: {
          actor: string | null
          contract_id: number | null
          event_at: string | null
          event_type: string | null
          id: number
          meta: Json | null
          notes: string | null
        }
        Insert: {
          actor?: string | null
          contract_id?: number | null
          event_at?: string | null
          event_type?: string | null
          id?: never
          meta?: Json | null
          notes?: string | null
        }
        Update: {
          actor?: string | null
          contract_id?: number | null
          event_at?: string | null
          event_type?: string | null
          id?: never
          meta?: Json | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_audit_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contract"
            referencedColumns: ["id"]
          },
        ]
      }
      creator: {
        Row: {
          age: number | null
          category: string | null
          email: string | null
          engagement_rate: number | null
          gender: string | null
          id: number
          language: string | null
          location: string | null
          meta: Json | null
          name: string
          phone: string | null
          platform: string | null
          tier: string | null
        }
        Insert: {
          age?: number | null
          category?: string | null
          email?: string | null
          engagement_rate?: number | null
          gender?: string | null
          id?: never
          language?: string | null
          location?: string | null
          meta?: Json | null
          name: string
          phone?: string | null
          platform?: string | null
          tier?: string | null
        }
        Update: {
          age?: number | null
          category?: string | null
          email?: string | null
          engagement_rate?: number | null
          gender?: string | null
          id?: never
          language?: string | null
          location?: string | null
          meta?: Json | null
          name?: string
          phone?: string | null
          platform?: string | null
          tier?: string | null
        }
        Relationships: []
      }
      delivered_content: {
        Row: {
          campaign_creator_id: number | null
          caption: string | null
          content_type: string | null
          content_url: string | null
          id: number
          meta: Json | null
          posted_at: string | null
          verified_at: string | null
        }
        Insert: {
          campaign_creator_id?: number | null
          caption?: string | null
          content_type?: string | null
          content_url?: string | null
          id?: never
          meta?: Json | null
          posted_at?: string | null
          verified_at?: string | null
        }
        Update: {
          campaign_creator_id?: number | null
          caption?: string | null
          content_type?: string | null
          content_url?: string | null
          id?: never
          meta?: Json | null
          posted_at?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivered_content_campaign_creator_id_fkey"
            columns: ["campaign_creator_id"]
            isOneToOne: false
            referencedRelation: "campaign_creator"
            referencedColumns: ["id"]
          },
        ]
      }
      negotiation_attempt: {
        Row: {
          agreed_price: number | null
          call_recording_url: string | null
          campaign_creator_id: number | null
          contract_id: number | null
          deliverables: string | null
          ended_at: string | null
          id: number
          meta: Json | null
          negotiation_type: string | null
          outcome: string | null
          started_at: string | null
          summary: string | null
          timeline: string | null
          transcript: string | null
        }
        Insert: {
          agreed_price?: number | null
          call_recording_url?: string | null
          campaign_creator_id?: number | null
          contract_id?: number | null
          deliverables?: string | null
          ended_at?: string | null
          id?: never
          meta?: Json | null
          negotiation_type?: string | null
          outcome?: string | null
          started_at?: string | null
          summary?: string | null
          timeline?: string | null
          transcript?: string | null
        }
        Update: {
          agreed_price?: number | null
          call_recording_url?: string | null
          campaign_creator_id?: number | null
          contract_id?: number | null
          deliverables?: string | null
          ended_at?: string | null
          id?: never
          meta?: Json | null
          negotiation_type?: string | null
          outcome?: string | null
          started_at?: string | null
          summary?: string | null
          timeline?: string | null
          transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "negotiation_attempt_campaign_creator_id_fkey"
            columns: ["campaign_creator_id"]
            isOneToOne: false
            referencedRelation: "campaign_creator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "negotiation_attempt_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contract"
            referencedColumns: ["id"]
          },
        ]
      }
      payment: {
        Row: {
          amount: number | null
          campaign_creator_id: number | null
          contract_id: number | null
          currency: string | null
          id: number
          meta: Json | null
          paid_at: string | null
          payment_type: string | null
          receipt_url: string | null
          status: string | null
        }
        Insert: {
          amount?: number | null
          campaign_creator_id?: number | null
          contract_id?: number | null
          currency?: string | null
          id?: never
          meta?: Json | null
          paid_at?: string | null
          payment_type?: string | null
          receipt_url?: string | null
          status?: string | null
        }
        Update: {
          amount?: number | null
          campaign_creator_id?: number | null
          contract_id?: number | null
          currency?: string | null
          id?: never
          meta?: Json | null
          paid_at?: string | null
          payment_type?: string | null
          receipt_url?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_campaign_creator_id_fkey"
            columns: ["campaign_creator_id"]
            isOneToOne: false
            referencedRelation: "campaign_creator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contract"
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
