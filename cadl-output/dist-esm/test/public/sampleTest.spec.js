import { assert } from "chai";
import { createRecorder } from "./utils/recordedClient";
describe("My test", () => {
    let recorder;
    beforeEach(async function () {
        recorder = await createRecorder(this);
    });
    afterEach(async function () {
        await recorder.stop();
    });
    it("sample test", async function () {
        assert.equal(1, 1);
    });
});
//# sourceMappingURL=sampleTest.spec.js.map