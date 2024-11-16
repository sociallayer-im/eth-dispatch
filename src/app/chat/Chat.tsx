'use client'

import {useAccount, useSignMessage} from 'wagmi'
import {Client, type Signer} from "@xmtp/browser-sdk";
import {useEffect, useRef, useState} from "react";
import {toBytes} from "viem/utils";

export default function Chat() {
    const {address} = useAccount()
    const {signMessageAsync} = useSignMessage()
    const [ready, setReady] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const clientRef = useRef<Client | null>(null)

    useEffect(() => {
        ;(async () => {
            try {
                if (address && typeof window !== 'undefined') {
                    const signer: Signer = {
                        getAddress: async () => address,
                        signMessage: async (message: string) => {
                            console.log('messagemessagemessagemessage', message)
                            const signature = await signMessageAsync({message, account: address})
                            return toBytes(signature)
                        }
                    }

                    const encryptionKey = window.crypto.getRandomValues(new Uint8Array(32))
                    clientRef.current = await Client.create(
                        signer,
                        encryptionKey,
                        {env: "dev"}
                    );
                    console.log('clientRef.current', clientRef.current)
                    setReady(true)
                }
            } catch (e: any) {
                console.error('create error:', e)
                setError(e.message)
            }
        })()
    }, [address]);

    return <div>
        <div>chat</div>
        <div>{address}</div>
        <div>{error}</div>
    </div>
}
