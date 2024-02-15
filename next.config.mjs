const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "felmeres-note-images.s3.eu-central-1.amazonaws.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "r3.minicrm.hu",
				port: "",
				pathname: "/119/Download/S3/**",
			},
		],
	},
	reactStrictMode: false,
};

export default nextConfig;
