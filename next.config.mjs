import { FlytrapTransformPlugin } from "useflytrap/transform";

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
	reactStrictMode: true,
	webpack(config) {
		config.plugins = config.plugins ?? [];
		// config.plugins.push(FlytrapTransformPlugin.webpack());
		return config;
	},
};

export default nextConfig;
