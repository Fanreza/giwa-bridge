<script setup lang="ts">
import { useChainId, useConnect } from "@wagmi/vue";
import { toast } from "vue-sonner";

const chainId = useChainId();
const { connect, connectors, error, status } = useConnect();

watch(error, (newError) => {
	toast.error(newError?.message || "Failed to connect");
});
</script>

<template>
	<Dialog>
		<!-- Trigger button -->
		<DialogTrigger as-child>
			<!-- Kalau user gak kasih slot, fallback ke default button -->
			<slot name="trigger">
				<Button class="rounded-full px-5 bg-white text-black"> Connect Wallet </Button>
			</slot>
		</DialogTrigger>

		<!-- Modal content -->
		<DialogContent class="sm:max-w-md">
			<DialogHeader>
				<DialogTitle>Connect Wallet</DialogTitle>
				<DialogDescription> Choose your preferred wallet provider. </DialogDescription>
			</DialogHeader>

			<div class="flex flex-col gap-3 mt-4">
				<Button v-for="connector in connectors" :key="connector.id" variant="outline" class="w-full justify-start gap-2 py-5" @click="connect({ connector, chainId })">
					<!-- render icon default dari wagmi -->
					<img v-if="connector.icon" :src="connector.icon" alt="" class="w-5 h-5" />
					<span>{{ connector.name }}</span>
				</Button>
			</div>
		</DialogContent>
	</Dialog>
</template>
