export interface CommunicationUserIdentifierAndTokenOutput {
  user: CommunicationUserIdentifierOutput;
  token: AccessTokenOutput;
}

export interface CommunicationUserIdentifierOutput {
  id: string;
}

export interface AccessTokenOutput {
  token: string;
  expiresOn: string;
}
