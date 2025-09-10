<script setup lang="ts">
import { useAccount, useChainId, useSwitchChain, useBalance } from "@wagmi/vue";
import { sepolia } from "viem/chains";
import { getL2TransactionHashes } from "viem/op-stack";
import { parseEther } from "viem";
import { getWalletClient } from "@wagmi/core";

import { giwaSepolia, publicClientL1, publicClientL2 } from "~/core/chain";
import { config } from "~/core/wagmi";
import { bridgeAbi } from "~/core/bridgeAbi";
import { toast } from "vue-sonner";

// state FROM - TO
const fromChain = ref(sepolia);
const toChain = ref(giwaSepolia);
const amount = ref("");

const isBridging = ref(false);
const isStartBridge = ref(false);

// === GIWA Portal Contract ===
const GIWA_PORTAL_ADDRESS = "0x956962C34687A954e611A83619ABaA37Ce6bC78A";
const GIWA_PORTAL_ABI = bridgeAbi;

// wagmi hooks
const { status, address } = useAccount();
const chainId = useChainId();
const { switchChain } = useSwitchChain();

// fetch balance (native token di fromChain)
const { data: balanceData } = useBalance({
	address, // reactive ref dari useAccount
	chainId: computed(() => fromChain.value.id),
});

// status check
const isConnected = computed(() => status.value === "connected");

// helper
const balanceFormatted = computed(() => (balanceData.value?.formatted ? Number(balanceData.value.formatted).toFixed(4) : "0.0000"));

// swap FROM <-> TO
function swapChains() {
	const temp = fromChain.value;
	// @ts-ignore
	fromChain.value = toChain.value;
	// @ts-ignore
	toChain.value = temp;
	switchChain({ chainId: fromChain.value.id });
}

// set max
function setMax() {
	if (balanceData.value?.formatted) {
		amount.value = balanceData.value.formatted;
	}
}

watch(
	[status, chainId],
	async ([newStatus, newChain]) => {
		if (newStatus === "connected") {
			if (newChain === giwaSepolia.id) {
				// @ts-ignore
				fromChain.value = giwaSepolia;
				// @ts-ignore
				toChain.value = sepolia;
			} else if (newChain === sepolia.id) {
				fromChain.value = sepolia;
				toChain.value = giwaSepolia;
			} else {
				// ❌ bukan sepolia / giwa → paksa switch ke sepolia
				try {
					await switchChain({ chainId: sepolia.id });
					fromChain.value = sepolia;
					toChain.value = giwaSepolia;
				} catch (err) {
					console.error("❌ gagal auto switch ke Sepolia:", err);
				}
			}
		}
	},
	{ immediate: true }
);

const bridgeStep = ref<"idle" | "sending" | "l1Confirmed" | "l2Confirmed">("idle");
const txHashL1 = ref<string | null>(null);
const txHashL2 = ref<string | null>(null);

async function bridgeToGiwa() {
	if (!isConnected.value || !address.value) return;
	if (!amount.value || Number(amount.value) <= 0) return;

	try {
		isStartBridge.value = true;

		const walletClient = await getWalletClient(config);
		if (!walletClient) throw new Error("No wallet client");

		// Step 1: Sending TX
		const txHash = await walletClient.writeContract({
			address: GIWA_PORTAL_ADDRESS,
			abi: GIWA_PORTAL_ABI,
			functionName: "depositTransaction",
			args: [
				address.value,
				parseEther(amount.value),
				300_000, // gas limit
				false, // _isCreation
				"0x", // _data
			],
			value: parseEther(amount.value),
		});
		isBridging.value = true;
		bridgeStep.value = "sending";
		txHashL1.value = txHash;

		// Wait L1 confirmation
		const receiptL1 = await publicClientL1.waitForTransactionReceipt({ hash: txHash });
		console.log("L1 confirmed:", receiptL1);
		bridgeStep.value = "l1Confirmed";

		// Step 2: Waiting L2 confirmation
		const [l2Hash] = getL2TransactionHashes(receiptL1);
		txHashL2.value = l2Hash!;

		const receiptL2 = await publicClientL2.waitForTransactionReceipt({ hash: l2Hash! });
		console.log("L2 confirmed:", receiptL2);
		bridgeStep.value = "l2Confirmed";

		toast.success("Bridge successful!");
		amount.value = "";
	} catch (err) {
		console.log(err);

		if (!txHashL1.value) {
			isBridging.value = false;
			isStartBridge.value = false;
			bridgeStep.value = "idle";
			txHashL1.value = null;
			txHashL2.value = null;
		}

		toast.error((err as Error).message || "Bridge failed");
	} finally {
		if (txHashL1.value) {
			isBridging.value = false;
			isStartBridge.value = false;
		}
	}
}
</script>

<template>
	<Card class="w-[400px] mx-auto mt-10">
		<CardHeader>
			<CardTitle class="text-center">Bridge</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			<!-- From / To -->
			<div class="flex items-center justify-between gap-2">
				<div class="flex-1 text-center p-3 bg-muted rounded-xl">
					<p class="text-sm text-muted-foreground">From</p>
					<p class="font-bold">{{ fromChain.name }}</p>
				</div>

				<Button size="icon" variant="outline" class="rounded-full" @click="swapChains"> ⇄ </Button>

				<div class="flex-1 text-center p-3 bg-muted rounded-xl">
					<p class="text-sm text-muted-foreground">To</p>
					<p class="font-bold">{{ toChain.name }}</p>
				</div>
			</div>

			<!-- Amount input -->
			<div class="relative">
				<input v-model="amount" type="tel" placeholder="0.0" class="w-full text-right text-2xl font-semibold p-4 bg-transparent outline-none focus:ring-0" />
			</div>

			<div class="flex justify-end">
				<Button variant="outline" size="sm" class="rounded-full text-right" @click="setMax"> Max </Button>
			</div>

			<p class="text-xs text-muted-foreground text-right">
				Balance: {{ balanceFormatted }}
				{{ balanceData?.symbol }}
			</p>

			<!-- Action -->
			<div v-if="!isConnected">
				<ConnectWalletModal>
					<template #trigger>
						<Button class="w-full">Connect Wallet</Button>
					</template>
				</ConnectWalletModal>
			</div>

			<div v-else-if="fromChain.id !== sepolia.id && isConnected">
				<Button class="w-full" disabled> Under Construction </Button>
			</div>

			<div v-else>
				<Button class="w-full" @click="bridgeToGiwa" :disabled="!amount || isStartBridge"> Bridge </Button>
			</div>
		</CardContent>

		<CardFooter class="text-zinc-200 text-xs"> Disclaimer: This app runs on a testnet. All funds and transactions are for testing purposes only. The developers are not responsible for any loss or damage. Use at your own risk. </CardFooter>
	</Card>

	<BridgeStatus v-if="isBridging || bridgeStep !== 'idle'" :stepStatus="bridgeStep" :txHashL1="txHashL1" :txHashL2="txHashL2" :from="fromChain.id === sepolia.id ? 'L1' : 'L2'" />
</template>
