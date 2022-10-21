import { HttpResponse } from "@azure-rest/core-client";
import { CommunicationUserIdentifierAndTokenOutput } from "./outputModels";

/** The request has succeeded. */
export interface CommunicationIdentityCreateUserAndToken200Response
  extends HttpResponse {
  status: "200";
  body: CommunicationUserIdentifierAndTokenOutput;
}

/** There is no content to send for this request, but the headers may be useful. */
export interface CommunicationIdentityRevoke204Response extends HttpResponse {
  status: "204";
}

/** There is no content to send for this request, but the headers may be useful. */
export interface CommunicationIdentityDelete204Response extends HttpResponse {
  status: "204";
}
