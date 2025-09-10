export const useShortAddress = (address: string) => {
	return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
};
