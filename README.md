# Azure Communication Services Identity SDK [CADL+AutoRest]

## Setting up the code generation
```
npm install -g @cadl-lang/compiler
cadl install
cadl compile .
```

optionally
```
cadl code install
```
More at https://microsoft.github.io/cadl/docs/setup/installation/

## Compiling the client lib

```
cd cadl-output
npm run build
```

## Running the test app

- Requires .env file with CONNECTION_STRING set to an ACS resource in the test-app folder

```
cd test-app
npm i
node .\test.js
```

## Resources


CADL lang
- https://microsoft.github.io/cadl/docs/standard-library/rest/resource-routing/
- https://github.com/microsoft/cadl/blob/main/docs/cadl-for-openapi-dev.md#parameter-object

CADL Azure
- repo https://github.com/Azure/cadl-azure
- docs https://github.com/Azure/cadl-azure/blob/main/packages/cadl-azure-core/README.md
- azure playground: https://cadlplayground.z22.web.core.windows.net/cadl-azure/
- examples https://github.com/Azure/azure-rest-api-specs-pr/blob/generate-cadl-with-typescript-emitter/specification/adp/data-plane/cadl/cadl-project.yaml

