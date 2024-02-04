import { API, type RouteModifier } from "sveltekit-api";
import { version } from "../../package.json";

export const MainkeyAuth: RouteModifier = (c) => {
	c.security = [{ mainkey: [] }];
	return c;
};

export const TokenAuth: RouteModifier = (c) => {
	c.security = [{ token: [] }];
	return c;
};

export default new API(
	import.meta.glob("./**/*.ts"),
	{
		openapi: "3.0.0",
		info: {
			title: "Hermes Mail Service API",
			version,
			description:
				"Hermes is an open-source edge email sending service, which is designed to be easy to setup and use.",
		},
		servers: [
			{
				url: "{scheme}://{host}",
				variables: {
					scheme: { enum: ["http", "https"], default: "http" },
					host: { default: "localhost:5173" },
				},
			},
		],
	},
	undefined,
	(r) => {
		r.registerComponent("securitySchemes", "mainkey", {
			type: "http",
			scheme: "bearer",
			description: "The main key to use for configuration",
		});

		r.registerComponent("securitySchemes", "token", {
			type: "http",
			scheme: "bearer",
			description: "The issued token to use for authentication",
		});
	},
);
