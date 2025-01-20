export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      movie_translations: {
        Row: {
          created_at: string
          language: Database['public']['Enums']['language_iso_type']
          overview: string | null
          title: string
          tmdb_id: number
        }
        Insert: {
          created_at?: string
          language: Database['public']['Enums']['language_iso_type']
          overview?: string | null
          title: string
          tmdb_id?: number
        }
        Update: {
          created_at?: string
          language?: Database['public']['Enums']['language_iso_type']
          overview?: string | null
          title?: string
          tmdb_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'movie_translations_tmdb_id_fkey'
            columns: ['tmdb_id']
            isOneToOne: false
            referencedRelation: 'movies'
            referencedColumns: ['tmdb_id']
          }
        ]
      }
      movies: {
        Row: {
          created_at: string
          poster_path: string | null
          release_date: string | null
          runtime: number | null
          tmdb_id: number
        }
        Insert: {
          created_at?: string
          poster_path?: string | null
          release_date?: string | null
          runtime?: number | null
          tmdb_id?: number
        }
        Update: {
          created_at?: string
          poster_path?: string | null
          release_date?: string | null
          runtime?: number | null
          tmdb_id?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          color_mode: Database['public']['Enums']['color_mode_type']
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          language: Database['public']['Enums']['language_type'] | null
          last_name: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          color_mode?: Database['public']['Enums']['color_mode_type']
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          language?: Database['public']['Enums']['language_type'] | null
          last_name?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          color_mode?: Database['public']['Enums']['color_mode_type']
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          language?: Database['public']['Enums']['language_type'] | null
          last_name?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      user_movie_lists: {
        Row: {
          added_at: string
          status: Database['public']['Enums']['movie_list_status']
          tmdb_id: number
          user_id: string
        }
        Insert: {
          added_at?: string
          status?: Database['public']['Enums']['movie_list_status']
          tmdb_id: number
          user_id: string
        }
        Update: {
          added_at?: string
          status?: Database['public']['Enums']['movie_list_status']
          tmdb_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_movie_lists_tmdb_id_fkey'
            columns: ['tmdb_id']
            isOneToOne: false
            referencedRelation: 'movies'
            referencedColumns: ['tmdb_id']
          },
          {
            foreignKeyName: 'user_movie_lists_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fetch_and_store_translation: {
        Args: {
          p_tmdb_id: number
          p_language: string
        }
        Returns: {
          created_at: string
          language: Database['public']['Enums']['language_iso_type']
          overview: string | null
          title: string
          tmdb_id: number
        }
      }
      get_movie_data: {
        Args: {
          p_tmdb_id: number
        }
        Returns: Json
      }
      get_tmdb_api_key: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      sync_missing_translations: {
        Args: {
          p_tmdb_ids: number[]
          p_language: Database['public']['Enums']['language_iso_type']
        }
        Returns: undefined
      }
    }
    Enums: {
      color_mode_type: 'light' | 'dark' | 'system'
      language_iso_type: 'fr-FR' | 'en-US'
      language_type: 'fr' | 'us'
      movie_list_status: 'recommended' | 'to_watch' | 'watched'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never
