import { Client } from '@azure-rest/core-client';
import { ClientOptions } from '@azure-rest/core-client';
import { HttpResponse } from '@azure-rest/core-client';
import { RequestParameters } from '@azure-rest/core-client';
import { StreamableMethod } from '@azure-rest/core-client';

export declare interface AccessTokenOutput {
    token: string;
    expiresOn: string;
}

export declare type AzureCommunicationIdentityClient = Client & {
    path: Routes;
    communicationIdentity: CommunicationIdentityOperations;
};

/** The request has succeeded. */
export declare interface CommunicationIdentityCreateUserAndToken200Response extends HttpResponse {
    status: "200";
    body: CommunicationUserIdentifierAndTokenOutput;
}

export declare interface CommunicationIdentityCreateUserAndTokenBodyParam {
    body?: CreateTokenWithScopes;
}

export declare type CommunicationIdentityCreateUserAndTokenParameters = CommunicationIdentityCreateUserAndTokenBodyParam & RequestParameters;

/** There is no content to send for this request, but the headers may be useful. */
export declare interface CommunicationIdentityDelete204Response extends HttpResponse {
    status: "204";
}

export declare type CommunicationIdentityDeleteParameters = RequestParameters;

/** There is no content to send for this request, but the headers may be useful. */
export declare interface CommunicationIdentityExchangeAccessToken204Response extends HttpResponse {
    status: "204";
}

export declare interface CommunicationIdentityExchangeAccessTokenBodyParam {
    body: ExchangeAccessTokenRequest;
}

export declare type CommunicationIdentityExchangeAccessTokenParameters = CommunicationIdentityExchangeAccessTokenBodyParam & RequestParameters;

/** There is no content to send for this request, but the headers may be useful. */
export declare interface CommunicationIdentityGetToken204Response extends HttpResponse {
    status: "204";
}

export declare type CommunicationIdentityGetTokenParameters = RequestParameters;

/** Contains operations for CommunicationIdentity operations */
export declare interface CommunicationIdentityOperations {
    createUserAndToken(options?: CommunicationIdentityCreateUserAndTokenParameters): StreamableMethod<CommunicationIdentityCreateUserAndToken200Response>;
    revoke(id: object, options?: CommunicationIdentityRevokeParameters): StreamableMethod<CommunicationIdentityRevoke204Response>;
    getToken(id: object, options?: CommunicationIdentityGetTokenParameters): StreamableMethod<CommunicationIdentityGetToken204Response>;
    delete(id: object, options?: CommunicationIdentityDeleteParameters): StreamableMethod<CommunicationIdentityDelete204Response>;
    exchangeAccessToken(options: CommunicationIdentityExchangeAccessTokenParameters): StreamableMethod<CommunicationIdentityExchangeAccessToken204Response>;
}

/** There is no content to send for this request, but the headers may be useful. */
export declare interface CommunicationIdentityRevoke204Response extends HttpResponse {
    status: "204";
}

export declare type CommunicationIdentityRevokeParameters = RequestParameters;

export declare interface CommunicationUserIdentifierAndTokenOutput {
    user: CommunicationUserIdentifierOutput;
    token: AccessTokenOutput;
}

export declare interface CommunicationUserIdentifierOutput {
    id: string;
}

/**
 * Initialize a new instance of the class AzureCommunicationIdentityClient class.
 *
 */
declare function createClient(options?: ClientOptions): AzureCommunicationIdentityClient;
export default createClient;

export declare interface CreateTokenWithScopes {
    createTokenWithScopes?: string[];
    expiresInMinutes?: number;
}

export declare interface CreateUserAndToken {
    post(options?: CommunicationIdentityCreateUserAndTokenParameters): StreamableMethod<CommunicationIdentityCreateUserAndToken200Response>;
}

export declare interface Delete {
    post(options?: CommunicationIdentityDeleteParameters): StreamableMethod<CommunicationIdentityDelete204Response>;
}

export declare interface ExchangeAccessToken {
    post(options: CommunicationIdentityExchangeAccessTokenParameters): StreamableMethod<CommunicationIdentityExchangeAccessToken204Response>;
}

export declare interface ExchangeAccessTokenRequest {
    appId: string;
    token: string;
    userId: string;
}

export declare interface GetToken {
    post(options?: CommunicationIdentityGetTokenParameters): StreamableMethod<CommunicationIdentityGetToken204Response>;
}

export declare interface Revoke {
    post(options?: CommunicationIdentityRevokeParameters): StreamableMethod<CommunicationIdentityRevoke204Response>;
}

export declare interface Routes {
    /** Resource for '/identities' has methods for the following verbs: post */
    (path: "/identities"): CreateUserAndToken;
    /** Resource for '/identities/\{id\}/:revokeAccessTokens' has methods for the following verbs: post */
    (path: "/identities/{id}/:revokeAccessTokens", id: object): Revoke;
    /** Resource for '/identities/\{id\}/:issueAccessToken' has methods for the following verbs: post */
    (path: "/identities/{id}/:issueAccessToken", id: object): GetToken;
    /** Resource for '/identities/\{id\}' has methods for the following verbs: post */
    (path: "/identities/{id}", id: object): Delete;
    /** Resource for '/teamsUser/:exchangeAccessToken' has methods for the following verbs: post */
    (path: "/teamsUser/:exchangeAccessToken"): ExchangeAccessToken;
}

export { }
