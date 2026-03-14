export type Database = {
  public: {
    CompositeTypes: Record<string, never>;
    Enums: Record<string, never>;
    Functions: {
      find_project_by_join_code: {
        Args: {
          input_join_code: string;
        };
        Returns: string | null;
      };
      ping: {
        Args: Record<string, never>;
        Returns: number;
      };
    };
    Tables: {
      project_members: {
        Insert: {
          id?: string;
          joined_at?: string;
          project_id: string;
          role: "member" | "owner";
          user_id: string;
        };
        Relationships: [
          {
            columns: ["project_id"];
            foreignKeyName: "project_members_project_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "projects";
          },
          {
            columns: ["user_id"];
            foreignKeyName: "project_members_user_id_fkey";
            isOneToOne: true;
            referencedColumns: ["id"];
            referencedRelation: "users";
          }
        ];
        Row: {
          id: string;
          joined_at: string;
          project_id: string;
          role: "member" | "owner";
          user_id: string;
        };
        Update: {
          id?: string;
          joined_at?: string;
          project_id?: string;
          role?: "member" | "owner";
          user_id?: string;
        };
      };
      projects: {
        Insert: {
          created_at?: string;
          created_by_user_id: string;
          demo_url?: string | null;
          description?: string;
          github_url?: string | null;
          id?: string;
          join_code: string;
          name: string;
          tagline?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            columns: ["created_by_user_id"];
            foreignKeyName: "projects_created_by_user_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "users";
          }
        ];
        Row: {
          created_at: string;
          created_by_user_id: string;
          demo_url: string | null;
          description: string;
          github_url: string | null;
          id: string;
          join_code: string;
          name: string;
          tagline: string;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          created_by_user_id?: string;
          demo_url?: string | null;
          description?: string;
          github_url?: string | null;
          id?: string;
          join_code?: string;
          name?: string;
          tagline?: string;
          updated_at?: string;
        };
      };
      users: {
        Insert: {
          created_at?: string;
          display_name?: string | null;
          email: string;
          id: string;
          updated_at?: string;
        };
        Relationships: [];
        Row: {
          created_at: string;
          display_name: string | null;
          email: string;
          id: string;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          display_name?: string | null;
          email?: string;
          id?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
  };
};
