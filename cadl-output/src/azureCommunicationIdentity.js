"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_client_1 = require("@azure-rest/core-client");
/**
 * Initialize a new instance of the class AzureCommunicationIdentityClient class.
 *
 */
function createClient(Endpoint, credentials, options = {}) {
    var _a;
    const baseUrl = (_a = options.baseUrl) !== null && _a !== void 0 ? _a : `${Endpoint}/personalizer/v1.1-preview.3`;
    options = Object.assign(Object.assign({}, options), { credentials: {
            scopes: ["https://cognitiveservices.azure.com/.default"],
            apiKeyHeaderName: "Ocp-Apim-Subscription-Key",
        } });
    const userAgentInfo = `azsdk-js-ai-personalizer-rest/1.0.0-beta.1`;
    const userAgentPrefix = options.userAgentOptions && options.userAgentOptions.userAgentPrefix
        ? `${options.userAgentOptions.userAgentPrefix} ${userAgentInfo}`
        : `${userAgentInfo}`;
    options = Object.assign(Object.assign({}, options), { userAgentOptions: {
            userAgentPrefix,
        } });
    const client = (0, core_client_1.getClient)(baseUrl, credentials, options);
    return client;
}
exports.default = createClient;
