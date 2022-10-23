import { RequestParameters } from "@azure-rest/core-client";
import { CreateTokenWithScopes, ExchangeAccessTokenRequest } from "./models";

export interface CommunicationIdentityCreateUserAndTokenBodyParam {
  body?: CreateTokenWithScopes;
}

export type CommunicationIdentityCreateUserAndTokenParameters =
  CommunicationIdentityCreateUserAndTokenBodyParam & RequestParameters;
export type CommunicationIdentityRevokeParameters = RequestParameters;
export type CommunicationIdentityGetTokenParameters = RequestParameters;
export type CommunicationIdentityDeleteParameters = RequestParameters;

export interface CommunicationIdentityExchangeAccessTokenBodyParam {
  body: ExchangeAccessTokenRequest;
}

export type CommunicationIdentityExchangeAccessTokenParameters =
  CommunicationIdentityExchangeAccessTokenBodyParam & RequestParameters;
