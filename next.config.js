const withBuilderDevTools = require("@builder.io/dev-tools/next")();

/** @type {import('next').NextConfig} */
const nextConfig = withBuilderDevTools({
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "felmeres-note-images.s3.eu-central-1.amazonaws.com",
				port: "",
				pathname: "/**",
			},
		],
	},
});

module.exports = nextConfig;
