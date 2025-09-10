import { http, createConfig } from "@wagmi/vue";
import { mainnet, optimism, sepolia } from "@wagmi/vue/chains";
import { injected } from "@wagmi/vue/connectors";

import { giwaSepolia } from "./chain";

export const config = createConfig({
	chains: [sepolia, giwaSepolia],
	connectors: [injected()],
	transports: {
		[sepolia.id]: http(),
		[giwaSepolia.id]: http(),
	},
});

declare module "@wagmi/vue" {
	interface Register {
		config: typeof config;
	}
}
