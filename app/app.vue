<script setup>
import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css";

useSeoMeta({
	title: "æthereal",
	ogTitle: "æthereal",
	description: "æthereal an unique crypto collective since '21, based in Indonesia.",
	ogDescription: "æthereal an unique crypto collective since '21, based in Indonesia.",
	ogImage: "https://ogcdn.net/6064b869-74ed-4eb9-b76c-0b701ffe7e6b/v4/aethereal.my.id/%C3%A6thereal/https%3A%2F%2Faethereal.my.id%2Flogo.jpg/og.png",
	twitterCard: "summary_large_image",
	ogimageAlt: "æthereal",
	ogImageWidth: "226",
	ogImageHeight: "226",
	twitterImage: "https://ogcdn.net/6064b869-74ed-4eb9-b76c-0b701ffe7e6b/v4/aethereal.my.id/%C3%A6thereal/https%3A%2F%2Faethereal.my.id%2Flogo.jpg/og.png",
});

useHead({
	script: [
		{
			src: "https://platform.twitter.com/widgets.js",
			async: true,
			type: "text/javascript",
		},
	],
});
</script>

<template>
	<Toaster />

	<Html lang="en" class="dark">
		<div>
			<NuxtLayout>
				<NuxtLoadingIndicator color="#B68A62" />
				<NuxtPage />
			</NuxtLayout>
		</div>
	</Html>
</template>

<style lang="postcss">
.page-enter-active,
.page-leave-active {
	transition: all 0.1s;
}
.page-enter-from,
.page-leave-to {
	opacity: 0;
	filter: blur(1rem);
}
</style>
