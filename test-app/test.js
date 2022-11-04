

const createClient = require("../cadl-output/dist/index");
const { createCommunicationAuthPolicy, parseConnectionString } = require('@azure/communication-common');

require('dotenv').config()

const main = async () => {
    //console.log(process.env)
    let credential = parseConnectionString(process.env.CONNECTION_STRING);
    let authPolicy = createCommunicationAuthPolicy(credential.credential);



    let client = createClient({ baseUrl: credential.endpoint, additionalPolicies: [{ position: "perCall", policy: authPolicy }] });
    let result = await client.communicationIdentity.createUserAndToken({ body: { scopes: ["chat"] } });
    console.log(result);
};

main().catch((error) => {
    console.log("Encountered an error");
    console.log(error);
})