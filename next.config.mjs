const nextConfig = {
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
};

export default nextConfig;
