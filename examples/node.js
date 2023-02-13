// This is a Node.js example for sending email using Hermes API
const jwt = process.env.JWT;
if (!jwt) {
	console.error("Please set JWT environment variable");
	process.exit(1);
}

const endpoint = "https://hermes.csie.cool/api/send";

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
		to: ["jacob@csie.cool", "jacoblincool@gmail.com"],
		subject: "Greetings from Hermes",
		content: `
            <h1>Hello!</h1>

            <p>This is a test email sent from Hermes.</p>

            <p>Regards,</p>
            <p>Hermes</p>

            <p><small>This email is sent from Hermes API.</small></p>

            <p><small>Powered by <a href="https://github.com/JacobLinCool/hermes-mail-service">Hermes</a>.</small></p>
        `,
	}),
}).then(() => {
	console.log("Email sent successfully!");
});
