#!/usr/bin/env node

require("dotenv").config();

var tsconfig =
  process.env.ENV === "local" ? "tsconfig.local.json" : "tsconfig.json";

require("ts-node").register({
  project: require("path").join(__dirname, "..", tsconfig),
});

require("../src");
