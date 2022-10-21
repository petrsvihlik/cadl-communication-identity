export interface CreateTokenWithScopes {
  createTokenWithScopes?: string[];
  expiresInMinutes?: number;
}

export interface ExchangeAccessTokenRequest {
  appId: string;
  token: string;
  userId: string;
}
