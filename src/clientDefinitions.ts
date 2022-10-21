import {
  CommunicationIdentityCreateUserAndTokenParameters,
  CommunicationIdentityRevokeParameters,
  CommunicationIdentityIssueAccessTokenParameters,
  CommunicationIdentityDeleteParameters,
  CommunicationIdentityExchangeAccessTokenParameters,
} from "./parameters";
import {
  CommunicationIdentityCreateUserAndToken200Response,
  CommunicationIdentityRevoke204Response,
  CommunicationIdentityIssueAccessToken204Response,
  CommunicationIdentityDelete204Response,
  CommunicationIdentityExchangeAccessToken204Response,
} from "./responses";
import { Client, StreamableMethod } from "@azure-rest/core-client";

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

export interface IssueAccessToken {
  post(
    options?: CommunicationIdentityIssueAccessTokenParameters
  ): StreamableMethod<CommunicationIdentityIssueAccessToken204Response>;
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
  /** Resource for '/identities' has methods for the following verbs: post */
  (path: "/identities"): CreateUserAndToken;
  /** Resource for '/identities/\{id\}/:revokeAccessTokens' has methods for the following verbs: post */
  (path: "/identities/{id}/:revokeAccessTokens", id: object): Revoke;
  /** Resource for '/identities/\{id\}/:issueAccessToken' has methods for the following verbs: post */
  (path: "/identities/{id}/:issueAccessToken", id: object): IssueAccessToken;
  /** Resource for '/identities/\{id\}' has methods for the following verbs: post */
  (path: "/identities/{id}", id: object): Delete;
  /** Resource for '/identities/teamsUser/:exchangeAccessToken' has methods for the following verbs: post */
  (path: "/identities/teamsUser/:exchangeAccessToken"): ExchangeAccessToken;
}

export type AzureCommunicationIdentityClient = Client & {
  path: Routes;
};
