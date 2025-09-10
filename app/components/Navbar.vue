<template>
	<header class="p-6 flex justify-between items-center border-b border-b-muted">
		<!-- Logo -->
		<div class="logo flex items-center">
			<img src="/logo.jpg" alt="æthereal" class="h-10 w-h-10 rounded-full" />
			<span class="ml-2 font-bold">æthereal</span>
		</div>

		<!-- Account -->
		<div class="account">
			<!-- Kalau belum connect -->
			<ConnectWalletModal v-if="status === 'disconnected'">
				<template #trigger>
					<Button class="bg-white text-black rounded-full px-5"> Connect Wallet </Button>
				</template>
			</ConnectWalletModal>

			<!-- Kalau sudah connect -->
			<DropdownMenu v-else>
				<DropdownMenuTrigger as-child>
					<Button variant="outline" class="flex items-center !bg-white !text-black rounded-full px-5 cursor-pointer">
						{{ useShortAddress(address) }}
						<Icon name="mdi:chevron-down" class="ml-2 w-5 h-5" />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent class="w-40">
					<DropdownMenuItem @click="disconnect"> Disconnect </DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	</header>
</template>

<script setup>
import { useAccount, useDisconnect } from "@wagmi/vue";
const { address, status } = useAccount();
const { disconnect } = useDisconnect();
</script>
