<script setup lang="ts">
import { Check, Loader, Clock } from "lucide-vue-next";
import { computed, defineProps } from "vue";
import { Stepper, StepperItem, StepperSeparator, StepperTitle, StepperDescription } from "@/components/ui/stepper";

interface StepperBridgeProps {
	stepStatus: "idle" | "sending" | "l1Confirmed" | "l2Confirmed";
	txHashL1?: string | null;
	txHashL2?: string | null;
	from: "L1" | "L2";
}

const props = defineProps<StepperBridgeProps>();

// computed steps
const steps = computed(() => [
	{
		step: 1,
		title: props.txHashL1,
		description: props.stepStatus === "sending" ? "Sending transaction..." : props.stepStatus === "l1Confirmed" ? "L1 confirmed" : props.stepStatus === "l2Confirmed" ? "✅ Done" : "Pending",
		state: props.stepStatus === "idle" ? "inactive" : props.stepStatus === "sending" ? "active" : props.stepStatus === "l1Confirmed" ? "completed" : props.stepStatus === "l2Confirmed" ? "completed" : "inactive",
		iconState: props.stepStatus === "sending" ? "loading" : props.stepStatus === "l1Confirmed" || props.stepStatus === "l2Confirmed" ? "check" : "pending",
	},
	{
		step: 2,
		title: props.txHashL2,
		description: props.stepStatus === "l2Confirmed" ? "✅ Done" : props.stepStatus === "l1Confirmed" ? "Waiting L2..." : "Pending",
		state: props.stepStatus === "l2Confirmed" ? "completed" : "inactive",
		iconState: props.stepStatus === "sending" ? "loading" : props.stepStatus === "l2Confirmed" ? "check" : "pending",
	},
]);

const sepoliaExplorer = "https://sepolia.etherscan.io/tx/";
const giwaExplorer = "https://sepolia-explorer.giwa.io/tx/";
</script>

<template>
	<Stepper class="flex w-full lg:w-[50%] mx-auto items-start gap-2 mt-15">
		<StepperItem v-for="step in steps" :key="step.step" class="relative flex w-full flex-col items-center justify-center" :step="step.step">
			<StepperSeparator
				v-if="step.step !== steps[steps.length - 1]?.step"
				class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full"
				:class="{
					'bg-primary': steps[step.step - 1]?.state === 'completed',
					'bg-muted': steps[step.step - 1]?.state !== 'completed',
				}"
			/>
			<div class="z-10 relative">
				<div class="relative w-10 h-10 flex items-center justify-center rounded-full">
					<Loader v-if="step.iconState === 'loading'" class="h-5 w-5 animate-spin text-white" />
					<Check v-else-if="step.iconState === 'check'" class="h-5 w-5 text-white" />
					<Clock v-else-if="step.iconState === 'pending'" class="h-5 w-5 text-yellow-400" />
				</div>
			</div>

			<div class="mt-5 flex flex-col items-center text-center">
				<StepperTitle :class="[step.state === 'active' && 'text-primary']" class="text-sm font-semibold transition lg:text-base break-all">
					<NuxtLink :href="(from === 'L1' && step.step === 1 ? sepoliaExplorer : giwaExplorer) + step.title" target="_blank" rel="noopener noreferrer" class="hover:underline">
						{{ useShortAddress(step.title || "") }}
					</NuxtLink>
				</StepperTitle>
				<StepperDescription :class="[step.state === 'active' && 'text-primary']" class="text-xs text-muted-foreground transition md:not-sr-only lg:text-sm">
					{{ step.description }}
				</StepperDescription>
			</div>
		</StepperItem>
	</Stepper>
</template>
