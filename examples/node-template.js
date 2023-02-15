// This is a Node.js example, send email with template
const jwt = process.env.JWT;
if (!jwt) {
	console.error("Please set JWT environment variable");
	process.exit(1);
}

const endpoint = "https://feat-template.mailing.pages.dev/api/send";

console.log("Sending email ...");

fetch(endpoint, {
	method: "POST",
	headers: {
		Authorization: `Bearer ${jwt}`,
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		from: {
			email: "hermes@csie.cool",
			name: "Hermes",
		},
		to: ["jacoblincool@gmail.com"],
		subject: "Greetings from Hermes",
		content: {
			template: "test",
			params: {
				name: "Jacob",
			},
		},
	}),
}).then(async (res) => {
	if (res.ok) {
		console.log("Email sent successfully!");
	} else {
		console.error("Failed to send email", res.status, await res.text());
	}
});
