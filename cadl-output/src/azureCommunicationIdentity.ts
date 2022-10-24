import { getClient, ClientOptions } from "@azure-rest/core-client";
import { AzureCommunicationIdentityClient } from "./clientDefinitions";
import { KeyCredential, TokenCredential } from "@azure/core-auth";

/**
 * Initialize a new instance of the class AzureCommunicationIdentityClient class.
 *
 */
export default function createClient(Endpoint: string,
  credentials: TokenCredential | KeyCredential,
  options: ClientOptions = {}
): AzureCommunicationIdentityClient {
  const baseUrl = options.baseUrl ?? `${Endpoint}/personalizer/v1.1-preview.3`;

  options = {
    ...options,
    credentials: {
      scopes: ["https://cognitiveservices.azure.com/.default"],
      apiKeyHeaderName: "Ocp-Apim-Subscription-Key",
    },
  };

  const userAgentInfo = `azsdk-js-ai-personalizer-rest/1.0.0-beta.1`;
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

  const client = getClient(baseUrl, credentials, options) as AzureCommunicationIdentityClient;

  return client;

}
