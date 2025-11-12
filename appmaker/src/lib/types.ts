export type Role = "user" | "assistant" | "system";

export type MessageImage = {
  url: string;
  type: string;
  name?: string;
};

export type Message = {
  id: string;
  role: Role;
  content: string;
  createdAt: string;
  source?: "text" | "voice" | "system";
  images?: MessageImage[];
};

export type PersonInfo = {
  name: string;
  images: MessageImage[];
  videos: Array<{
    url: string;
    type: string;
    name?: string;
  }>;
  urls: string[];
  extraInfo: string;
};

export type Chat = {
  id: string;
  name: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
};
