"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_client_1 = require("@azure-rest/core-client");
/**
 * Initialize a new instance of the class AzureCommunicationIdentityClient class.
 *
 */
function createClient(options = {}) {
    var _a, _b;
    const baseUrl = (_a = options.baseUrl) !== null && _a !== void 0 ? _a : `https://example.com`;
    options.apiVersion = (_b = options.apiVersion) !== null && _b !== void 0 ? _b : "2022-10-01";
    const userAgentInfo = `azsdk-js-acs-identity-rest/1.0.0-alpha.0`;
    const userAgentPrefix = options.userAgentOptions && options.userAgentOptions.userAgentPrefix
        ? `${options.userAgentOptions.userAgentPrefix} ${userAgentInfo}`
        : `${userAgentInfo}`;
    options = Object.assign(Object.assign({}, options), { userAgentOptions: {
            userAgentPrefix,
        } });
    const client = (0, core_client_1.getClient)(baseUrl, options);
    return Object.assign(Object.assign({}, client), { communicationIdentity: {
            createUserAndToken: (options) => {
                return client.path("/identities").post(options);
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
        } });
}
exports.default = createClient;
