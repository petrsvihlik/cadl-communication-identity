import { Context } from "mocha";
import { Recorder } from "@azure-tools/test-recorder";
import "./env";
/**
 * creates the recorder and reads the environment variables from the `.env` file.
 * Should be called first in the test suite to make sure environment variables are
 * read before they are being used.
 */
export declare function createRecorder(context: Context): Promise<Recorder>;
//# sourceMappingURL=recordedClient.d.ts.map