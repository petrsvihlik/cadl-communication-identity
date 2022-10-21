import {
  CommunicationIdentityCreateUserAndTokenParameters,
  CommunicationIdentityRevokeParameters,
  CommunicationIdentityDeleteParameters,
} from "./parameters";
import {
  CommunicationIdentityCreateUserAndToken200Response,
  CommunicationIdentityRevoke204Response,
  CommunicationIdentityDelete204Response,
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
  get(
    options?: CommunicationIdentityDeleteParameters
  ): StreamableMethod<CommunicationIdentityDelete204Response>;
}

export interface Routes {
  /** Resource for '/identities' has methods for the following verbs: post */
  (path: "/identities"): CreateUserAndToken;
  /** Resource for '/identities/\{id\}' has methods for the following verbs: post, get */
  (path: "/identities/{id}", id: object): Revoke;
}

export type AzureCommunicationIdentityClient = Client & {
  path: Routes;
};
