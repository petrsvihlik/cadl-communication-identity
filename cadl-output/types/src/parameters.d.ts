import { RequestParameters } from "@azure-rest/core-client";
import { CreateTokenWithScopes, ExchangeAccessTokenRequest } from "./models";
export interface CommunicationIdentityCreateUserAndTokenBodyParam {
    body?: CreateTokenWithScopes;
}
export declare type CommunicationIdentityCreateUserAndTokenParameters = CommunicationIdentityCreateUserAndTokenBodyParam & RequestParameters;
export declare type CommunicationIdentityRevokeParameters = RequestParameters;
export declare type CommunicationIdentityGetTokenParameters = RequestParameters;
export declare type CommunicationIdentityDeleteParameters = RequestParameters;
export interface CommunicationIdentityExchangeAccessTokenBodyParam {
    body: ExchangeAccessTokenRequest;
}
export declare type CommunicationIdentityExchangeAccessTokenParameters = CommunicationIdentityExchangeAccessTokenBodyParam & RequestParameters;
//# sourceMappingURL=parameters.d.ts.map