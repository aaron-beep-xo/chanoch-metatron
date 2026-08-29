import next from "eslint-config-next";

const config = [
  { ignores: [".next/**", "node_modules/**", "content-source/**"] },
  ...next,
];

export default config;
