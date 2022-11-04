import {
  CommunicationIdentityCreateUserAndTokenParameters,
  CommunicationIdentityRevokeParameters,
  CommunicationIdentityGetTokenParameters,
  CommunicationIdentityDeleteParameters,
  CommunicationIdentityExchangeAccessTokenParameters,
} from "./parameters";
import {
  CommunicationIdentityCreateUserAndToken200Response,
  CommunicationIdentityRevoke204Response,
  CommunicationIdentityGetToken204Response,
  CommunicationIdentityDelete204Response,
  CommunicationIdentityExchangeAccessToken204Response,
} from "./responses";
import { Client, StreamableMethod } from "@azure-rest/core-client";

/** Contains operations for CommunicationIdentity operations */
export interface CommunicationIdentityOperations {
  createUserAndToken(
    options?: CommunicationIdentityCreateUserAndTokenParameters
  ): StreamableMethod<CommunicationIdentityCreateUserAndToken200Response>;
  revoke(
    id: object,
    options?: CommunicationIdentityRevokeParameters
  ): StreamableMethod<CommunicationIdentityRevoke204Response>;
  getToken(
    id: object,
    options?: CommunicationIdentityGetTokenParameters
  ): StreamableMethod<CommunicationIdentityGetToken204Response>;
  delete(
    id: object,
    options?: CommunicationIdentityDeleteParameters
  ): StreamableMethod<CommunicationIdentityDelete204Response>;
  exchangeAccessToken(
    options: CommunicationIdentityExchangeAccessTokenParameters
  ): StreamableMethod<CommunicationIdentityExchangeAccessToken204Response>;
}

export interface CreateUserAndToken {
  post(
    options?: CommunicationIdentityCreateUserAndTokenParameters
  ): StreamableMethod<CommunicationIdentityCreateUserAndToken200Response>;
}

export interface Revoke {
  post(
    options?: CommunicationIdentityRevokeParameters
  ): StreamableMethod<CommunicationIdentityRevoke204Response>;
}

export interface GetToken {
  post(
    options?: CommunicationIdentityGetTokenParameters
  ): StreamableMethod<CommunicationIdentityGetToken204Response>;
}

export interface Delete {
  post(
    options?: CommunicationIdentityDeleteParameters
  ): StreamableMethod<CommunicationIdentityDelete204Response>;
}

export interface ExchangeAccessToken {
  post(
    options: CommunicationIdentityExchangeAccessTokenParameters
  ): StreamableMethod<CommunicationIdentityExchangeAccessToken204Response>;
}

export interface Routes {
  /** Resource for '/' has methods for the following verbs: post */
  (path: "/"): CreateUserAndToken;
  /** Resource for '/identities/\{id\}/:revokeAccessTokens' has methods for the following verbs: post */
  (path: "/identities/{id}/:revokeAccessTokens", id: object): Revoke;
  /** Resource for '/identities/\{id\}/:issueAccessToken' has methods for the following verbs: post */
  (path: "/identities/{id}/:issueAccessToken", id: object): GetToken;
  /** Resource for '/identities/\{id\}' has methods for the following verbs: post */
  (path: "/identities/{id}", id: object): Delete;
  /** Resource for '/teamsUser/:exchangeAccessToken' has methods for the following verbs: post */
  (path: "/teamsUser/:exchangeAccessToken"): ExchangeAccessToken;
}

export type AzureCommunicationIdentityClient = Client & {
  path: Routes;
  communicationIdentity: CommunicationIdentityOperations;
};
