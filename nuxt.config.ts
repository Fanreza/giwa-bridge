// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	ssr: false,
	modules: ["@wagmi/vue/nuxt", "shadcn-nuxt", "@nuxt/icon", "@nuxt/fonts"],

	css: ["~/assets/css/tailwind.css"],
	vite: {
		plugins: [tailwindcss()],
	},

	shadcn: {
		/**
		 * Prefix for all the imported component
		 */
		prefix: "",
		/**
		 * Directory that the component lives in.
		 * @default "./components/ui"
		 */
		componentDir: "./app/components/ui",
	},

	fonts: {
		defaults: {
			weights: [400, 500, 600, 700, 800, 900],
		},
	},
});
