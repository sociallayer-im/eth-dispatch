'use client'

import WagmiWrapper from "@/app/WagmiWrapper";
import ConnectWallet from "@/app/ConnectWallet";

export default function Home() {
    return <WagmiWrapper>
        <ConnectWallet/>
    </WagmiWrapper>
}

