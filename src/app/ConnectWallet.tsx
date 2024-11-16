'use client'

import {useConnect, useAccount} from 'wagmi'
import {useEffect} from "react";

export default function ConnectWallet() {
    const {connectors, connect} = useConnect()
    const { address } = useAccount()

    useEffect(() => {
        if (!!address) {
            location.href = '/verify'
        }
    }, [address]);

    return <div className="flex flex-row flex-nowrap w-full h-[100svh] justify-center items-center">
        <div className="w-[360px]">
            <div className="cormorant-font text-[#00545D] text-3xl mb-4">Connect Wallet</div>
            <div className="flex flex-col">
                {
                    connectors.map((connector) => (
                        <button className='btn mb-2'
                                key={connector.uid}
                                onClick={() => connect({connector})}>
                            {connector.icon && <img src={connector.icon} className="w-[18px] h-[18px]" alt=""/>}
                            {connector.name}
                        </button>
                    ))
                }
            </div>

        </div>
    </div>
}
