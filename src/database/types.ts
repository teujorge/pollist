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
      Option: {
        Row: {
          id: string;
          pollId: string;
          text: string;
        };
        Insert: {
          id: string;
          pollId: string;
          text: string;
        };
        Update: {
          id?: string;
          pollId?: string;
          text?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Option_pollId_fkey";
            columns: ["pollId"];
            isOneToOne: false;
            referencedRelation: "Poll";
            referencedColumns: ["id"];
          },
        ];
      };
      Poll: {
        Row: {
          authorId: string;
          controversial: boolean;
          createdAt: string;
          description: string;
          id: string;
          title: string;
          updatedAt: string;
        };
        Insert: {
          authorId: string;
          controversial?: boolean;
          createdAt?: string;
          description: string;
          id: string;
          title: string;
          updatedAt: string;
        };
        Update: {
          authorId?: string;
          controversial?: boolean;
          createdAt?: string;
          description?: string;
          id?: string;
          title?: string;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Poll_authorId_fkey";
            columns: ["authorId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      User: {
        Row: {
          id: string;
          imageUrl: string | null;
          username: string | null;
        };
        Insert: {
          id: string;
          imageUrl?: string | null;
          username?: string | null;
        };
        Update: {
          id?: string;
          imageUrl?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      Vote: {
        Row: {
          createdAt: string;
          id: string;
          optionId: string;
          pollId: string;
          voterId: string;
        };
        Insert: {
          createdAt?: string;
          id: string;
          optionId: string;
          pollId: string;
          voterId: string;
        };
        Update: {
          createdAt?: string;
          id?: string;
          optionId?: string;
          pollId?: string;
          voterId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Vote_optionId_fkey";
            columns: ["optionId"];
            isOneToOne: false;
            referencedRelation: "Option";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Vote_pollId_fkey";
            columns: ["pollId"];
            isOneToOne: false;
            referencedRelation: "Poll";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Vote_voterId_fkey";
            columns: ["voterId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    keyof Database["public"]["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
