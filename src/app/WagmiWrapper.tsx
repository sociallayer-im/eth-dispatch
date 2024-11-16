import {createConfig, http, useConnect, WagmiProvider} from 'wagmi'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {mainnet, sepolia} from 'wagmi/chains'
import {injected} from 'wagmi/connectors'
import {ReactNode} from "react";

const queryClient = new QueryClient()

export const config = createConfig({
    ssr: true,
    chains: [sepolia, mainnet],
    connectors: [
        injected()
    ],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
    },
})

export default function WagmiWrapper(props: {children: ReactNode}) {
    return <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            {props.children}
        </QueryClientProvider>
    </WagmiProvider>
}

