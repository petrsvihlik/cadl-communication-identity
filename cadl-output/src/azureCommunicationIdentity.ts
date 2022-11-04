import { getClient, ClientOptions } from "@azure-rest/core-client";
import { AzureCommunicationIdentityClient } from "./clientDefinitions";

/**
 * Initialize a new instance of the class AzureCommunicationIdentityClient class.
 *
 */
export default function createClient(
  options: ClientOptions = {}
): AzureCommunicationIdentityClient {
  const baseUrl = options.baseUrl ?? `https://example.com`;
  options.apiVersion = options.apiVersion ?? "2022-10-01";
  const userAgentInfo = `azsdk-js-acs-identity-rest/1.0.0-alpha.0`;
  const userAgentPrefix =
    options.userAgentOptions && options.userAgentOptions.userAgentPrefix
      ? `${options.userAgentOptions.userAgentPrefix} ${userAgentInfo}`
      : `${userAgentInfo}`;
  options = {
    ...options,
    userAgentOptions: {
      userAgentPrefix,
    },
  };

  const client = getClient(
    baseUrl,
    options
  ) as AzureCommunicationIdentityClient;

  return {
    ...client,
    communicationIdentity: {
      createUserAndToken: (options) => {
        return client.path("/").post(options);
      },
      revoke: (id, options) => {
        return client
          .path("/identities/{id}/:revokeAccessTokens", id)
          .post(options);
      },
      getToken: (id, options) => {
        return client
          .path("/identities/{id}/:issueAccessToken", id)
          .post(options);
      },
      delete: (id, options) => {
        return client.path("/identities/{id}", id).post(options);
      },
      exchangeAccessToken: (options) => {
        return client.path("/teamsUser/:exchangeAccessToken").post(options);
      },
    },
  };
}
