import { type JestConfigWithTsJest, createDefaultPreset } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  // preset: "ts-jest",
  // testEnvironment: "node",
  // testMatch: ["**/*.test.ts"],
  // globals: {
  //   "ts-jest": {
  //     tsconfig: "tsconfig.json",
  //   },
  // },
  ...createDefaultPreset(),
};

export default jestConfig;
