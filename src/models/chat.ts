
export interface ChatMessage {
  id: string;
  content: string;
  isAi: boolean;
  timestamp: Date;
}

export interface ChatSpace {
  id: string;
  name: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Canvas {
  id: string;
  name: string;
  imageData: string;
  spaceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Journal {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
