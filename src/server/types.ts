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
      Comment: {
        Row: {
          authorId: string;
          createdAt: string;
          id: string;
          parentId: string | null;
          pollId: string;
          text: string;
          updatedAt: string;
        };
        Insert: {
          authorId: string;
          createdAt?: string;
          id: string;
          parentId?: string | null;
          pollId: string;
          text: string;
          updatedAt: string;
        };
        Update: {
          authorId?: string;
          createdAt?: string;
          id?: string;
          parentId?: string | null;
          pollId?: string;
          text?: string;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Comment_authorId_fkey";
            columns: ["authorId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Comment_parentId_fkey";
            columns: ["parentId"];
            isOneToOne: false;
            referencedRelation: "Comment";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Comment_pollId_fkey";
            columns: ["pollId"];
            isOneToOne: false;
            referencedRelation: "Poll";
            referencedColumns: ["id"];
          },
        ];
      };
      CommentLike: {
        Row: {
          authorId: string;
          commentId: string;
          createdAt: string;
          id: string;
        };
        Insert: {
          authorId: string;
          commentId: string;
          createdAt?: string;
          id: string;
        };
        Update: {
          authorId?: string;
          commentId?: string;
          createdAt?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "CommentLike_authorId_fkey";
            columns: ["authorId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "CommentLike_commentId_fkey";
            columns: ["commentId"];
            isOneToOne: false;
            referencedRelation: "Comment";
            referencedColumns: ["id"];
          },
        ];
      };
      Follow: {
        Row: {
          accepted: boolean;
          createdAt: string;
          followeeId: string;
          followerId: string;
          id: string;
          notificationFollowAcceptedId: string | null;
          notificationFollowPendingId: string | null;
          updatedAt: string;
        };
        Insert: {
          accepted?: boolean;
          createdAt?: string;
          followeeId: string;
          followerId: string;
          id: string;
          notificationFollowAcceptedId?: string | null;
          notificationFollowPendingId?: string | null;
          updatedAt: string;
        };
        Update: {
          accepted?: boolean;
          createdAt?: string;
          followeeId?: string;
          followerId?: string;
          id?: string;
          notificationFollowAcceptedId?: string | null;
          notificationFollowPendingId?: string | null;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Follow_followeeId_fkey";
            columns: ["followeeId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Follow_followerId_fkey";
            columns: ["followerId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      NotificationComment: {
        Row: {
          commentId: string;
          createdAt: string;
          id: string;
          notifyeeId: string;
          updatedAt: string;
        };
        Insert: {
          commentId: string;
          createdAt?: string;
          id: string;
          notifyeeId: string;
          updatedAt: string;
        };
        Update: {
          commentId?: string;
          createdAt?: string;
          id?: string;
          notifyeeId?: string;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "NotificationComment_commentId_fkey";
            columns: ["commentId"];
            isOneToOne: false;
            referencedRelation: "Comment";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "NotificationComment_notifyeeId_fkey";
            columns: ["notifyeeId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      NotificationCommentLike: {
        Row: {
          commentLikeId: string;
          createdAt: string;
          id: string;
          notifyeeId: string;
        };
        Insert: {
          commentLikeId: string;
          createdAt?: string;
          id: string;
          notifyeeId: string;
        };
        Update: {
          commentLikeId?: string;
          createdAt?: string;
          id?: string;
          notifyeeId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "NotificationCommentLike_commentLikeId_fkey";
            columns: ["commentLikeId"];
            isOneToOne: false;
            referencedRelation: "CommentLike";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "NotificationCommentLike_notifyeeId_fkey";
            columns: ["notifyeeId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      NotificationFollowAccepted: {
        Row: {
          createdAt: string;
          followId: string;
          id: string;
          notifyeeId: string;
          updatedAt: string;
        };
        Insert: {
          createdAt?: string;
          followId: string;
          id: string;
          notifyeeId: string;
          updatedAt: string;
        };
        Update: {
          createdAt?: string;
          followId?: string;
          id?: string;
          notifyeeId?: string;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "NotificationFollowAccepted_followId_fkey";
            columns: ["followId"];
            isOneToOne: false;
            referencedRelation: "Follow";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "NotificationFollowAccepted_notifyeeId_fkey";
            columns: ["notifyeeId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      NotificationFollowPending: {
        Row: {
          createdAt: string;
          followId: string;
          id: string;
          notifyeeId: string;
          updatedAt: string;
        };
        Insert: {
          createdAt?: string;
          followId: string;
          id: string;
          notifyeeId: string;
          updatedAt: string;
        };
        Update: {
          createdAt?: string;
          followId?: string;
          id?: string;
          notifyeeId?: string;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "NotificationFollowPending_followId_fkey";
            columns: ["followId"];
            isOneToOne: false;
            referencedRelation: "Follow";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "NotificationFollowPending_notifyeeId_fkey";
            columns: ["notifyeeId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      NotificationPollLike: {
        Row: {
          createdAt: string;
          id: string;
          notifyeeId: string;
          pollLikeId: string;
        };
        Insert: {
          createdAt?: string;
          id: string;
          notifyeeId: string;
          pollLikeId: string;
        };
        Update: {
          createdAt?: string;
          id?: string;
          notifyeeId?: string;
          pollLikeId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "NotificationPollLike_notifyeeId_fkey";
            columns: ["notifyeeId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "NotificationPollLike_pollLikeId_fkey";
            columns: ["pollLikeId"];
            isOneToOne: false;
            referencedRelation: "PollLike";
            referencedColumns: ["id"];
          },
        ];
      };
      Option: {
        Row: {
          id: string;
          imagePath: string | null;
          pollId: string;
          text: string;
        };
        Insert: {
          id: string;
          imagePath?: string | null;
          pollId: string;
          text: string;
        };
        Update: {
          id?: string;
          imagePath?: string | null;
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
      PollLike: {
        Row: {
          authorId: string;
          createdAt: string;
          id: string;
          pollId: string;
        };
        Insert: {
          authorId: string;
          createdAt?: string;
          id: string;
          pollId: string;
        };
        Update: {
          authorId?: string;
          createdAt?: string;
          id?: string;
          pollId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "PollLike_authorId_fkey";
            columns: ["authorId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "PollLike_pollId_fkey";
            columns: ["pollId"];
            isOneToOne: false;
            referencedRelation: "Poll";
            referencedColumns: ["id"];
          },
        ];
      };
      User: {
        Row: {
          bio: string | null;
          id: string;
          imageUrl: string | null;
          username: string | null;
        };
        Insert: {
          bio?: string | null;
          id: string;
          imageUrl?: string | null;
          username?: string | null;
        };
        Update: {
          bio?: string | null;
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
