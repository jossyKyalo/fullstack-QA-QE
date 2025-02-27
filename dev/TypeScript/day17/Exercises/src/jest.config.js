module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom", // or "node" depending on your needs
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
  };
  