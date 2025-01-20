import { main } from "./index";
import { addComment } from "./addComment";
import { addDescr } from "./addDecription";
import { getDiff } from "./getDiff_2";
import { getBooleanInput } from "@actions/core";
import { context } from "@actions/github";

jest.mock("./addComment");
jest.mock("./addDecription");
jest.mock("./getDiff_2");
jest.mock("@actions/core");
jest.mock("@actions/github");
jest.mock("./aiClient", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue("AI response content"),
}));

describe("main", () => {
  let consoleErrorSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error");
  });
  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should not call any actions if both shouldComment and shouldDescrCreate are false", async () => {
    (getBooleanInput as jest.Mock).mockReturnValue(false);
    context.payload.pull_request = { body: "not auto", number: 1 };

    await main();

    expect(getBooleanInput).toHaveBeenCalledWith("with-comment");
    expect(context.payload.pull_request?.body).toBe("not auto");
    expect(getDiff).not.toHaveBeenCalled();
    expect(addComment).not.toHaveBeenCalled();
    expect(addDescr).not.toHaveBeenCalled();
  });

  it("should call getDiff and addComment if shouldComment is true", async () => {
    (getBooleanInput as jest.Mock).mockReturnValue(true);
    context.payload.pull_request = { body: "not auto", number: 1 };
    (getDiff as jest.Mock).mockResolvedValue("diff content");

    await main();

    expect(getBooleanInput).toHaveBeenCalledWith("with-comment");
    expect(context.payload.pull_request?.body).toBe("not auto");
    expect(getDiff).toHaveBeenCalledWith("./diff.txt");
    expect(addComment).toHaveBeenCalledWith("AI response content");
    expect(addDescr).not.toHaveBeenCalled();
  });

  it("should call getDiff and addDescr if shouldDescrCreate is true", async () => {
    (getBooleanInput as jest.Mock).mockReturnValue(false);
    context.payload.pull_request = { body: "auto", number: 1 };
    (getDiff as jest.Mock).mockResolvedValue("diff content");

    await main();

    expect(getBooleanInput).toHaveBeenCalledWith("with-comment");
    expect(context.payload.pull_request?.body).toBe("auto");
    expect(getDiff).toHaveBeenCalledWith("./diff.txt");
    expect(addComment).not.toHaveBeenCalled();
    expect(addDescr).toHaveBeenCalledWith("AI response content");
  });

  it("should handle errors gracefully", async () => {
    (getBooleanInput as jest.Mock).mockReturnValue(true);
    context.payload.pull_request = { body: "not auto", number: 1 };
    (getDiff as jest.Mock).mockRejectedValue(new Error("Failed to get diff"));

    await main();

    expect(getBooleanInput).toHaveBeenCalledWith("with-comment");
    expect(context.payload.pull_request?.body).toBe("not auto");
    expect(getDiff).toHaveBeenCalledWith("./diff.txt");
    expect(console.error).toHaveBeenCalledWith(
      "Error in main function:",
      "Failed to get diff"
    );
    expect(addComment).not.toHaveBeenCalled();
    expect(addDescr).not.toHaveBeenCalled();
  });
});
