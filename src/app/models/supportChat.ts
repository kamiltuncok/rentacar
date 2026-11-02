/** Backend sözleşmesi: CarProject Entities/DTOs/SupportChat*Dto.cs — alan adlarını birlikte değiştirin. */
export type SupportChatStatus =
  | 'answered'
  | 'no_reliable_answer'
  | 'refused'
  | 'invalid_request'
  | 'session_not_found'
  | 'model_timeout'
  | 'model_unavailable';

export interface SupportChatRequest {
  message: string;
  sessionId: string | null;
  locale: string;
}

export interface SupportSource {
  id: string;
  title: string;
  url: string;
  isSample: boolean;
}

export interface SupportChatResponse {
  sessionId: string | null;
  answer: string;
  status: SupportChatStatus;
  sources: SupportSource[];
  notice: string | null;
}

export interface SupportArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  isSample: boolean;
}
