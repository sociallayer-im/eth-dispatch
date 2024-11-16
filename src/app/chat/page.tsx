'use client'

import WagmiWrapper from "@/app/WagmiWrapper";
import Chat from "./Chat";

export default function ChatPage() {
    return <WagmiWrapper>
        <Chat />
    </WagmiWrapper>
}
