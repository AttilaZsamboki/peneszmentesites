// next.config.js
const nextConfig = {
	async headers() {
		return [
			{
				source: "/(.*)", // Apply the header to all routes
				headers: [
					{
						key: "Content-Security-Policy",
						value: "upgrade-insecure-requests",
					},
				],
			},
		];
	},
};

module.exports = nextConfig;
