import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["client.ts"],
	format: ["cjs", "esm"],
	dts: true,
});
