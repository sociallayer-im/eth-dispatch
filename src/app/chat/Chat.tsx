// 'use client'

// import {useAccount, useSignMessage} from 'wagmi'
// import {Client, type Signer} from "@xmtp/browser-sdk";
// import {useEffect, useRef, useState} from "react";
// import {toBytes} from "viem/utils";
// import {getAvatar} from "@/utils/getAvatar";
// import Cookies from "js-cookie";

// export default function Chat() {
//     const {address} = useAccount()
//     const {signMessageAsync} = useSignMessage()
//     const [ready, setReady] = useState(false)
//     const [error, setError] = useState<string | null>(null)

//     const [email, setEmail] = useState('')
//     const [username, setUsername] = useState('')

//     useEffect(() => {
//         if (address) {
//             const email = Cookies.get('email')
//             const username = Cookies.get('username')
//             // if (!email || !username) {
//             //     location.href = '/'
//             // }

//             setEmail(email!)
//             setUsername(username!)
//         }
//     }, [address]);

//     const clientRef = useRef<Client | null>(null)

//     // useEffect(() => {
//     //     ;(async () => {
//     //         try {
//     //             if (address && typeof window !== 'undefined') {
//     //                 const signer: Signer = {
//     //                     getAddress: async () => address,
//     //                     signMessage: async (message: string) => {
//     //                         const signature = await signMessageAsync({message, account: address})
//     //                         return toBytes(signature)
//     //                     }
//     //                 }

//     //                 const encryptionKey = window.crypto.getRandomValues(new Uint8Array(32))
//     //                 clientRef.current = await Client.create(
//     //                     signer,
//     //                     encryptionKey,
//     //                     {env: "dev"}
//     //                 );
//     //                 console.log('clientRef.current', clientRef.current)
//     //                 setReady(true)
//     //             }
//     //         } catch (e: any) {
//     //             console.error('create error:', e)
//     //             setError(e.message)
//     //         }
//     //     })()
//     // }, [address]);

//     return <div className="flex flex-row flex-nowrap w-full h-[100svh] justify-center items-center">
//         <div className="w-[360px] bg-white min-h-[500px] rounded p-4">
//             <div className="cormorant-font text-[#00545D] text-3xl mb-4 font-semibold">@ETH-Dispatch</div>

//             <div className="flex flex-col max-h-[70svh] overflow-auto">
//                 {
//                     Array.from({length: 10}).map((_, index) => {
//                         return <div className="flex flex-row mb-6" key={index}>
//                             <img src={getAvatar()} className="w-[50px] h-[50px] rounded-full mr-4" alt=""/>
//                             <div className="text-[#00545D] text-sm">
//                                 <div className="font-semibold">Selene</div>
//                                 <div>Hey team, let’s finalize the email verification flow. Thoughts?</div>
//                             </div>
//                         </div>
//                     })
//                 }
//             </div>

//             <div className="flex felx-row p-2">
//                 <input type="text" placeholder="Type a message" className="w-full input input-md border-none focus:outline-none bg-[#F5F5F5]"/>
//                 <button className="btn ml-4 text-white font-normal" style={{background: 'linear-gradient(118.4deg, #D9ECC7 11.69%, #07A3B2 88.31%)'}}>Send</button>
//             </div>
//         </div>
//     </div>
// }


'use client'

import {useAccount, useSignMessage} from 'wagmi'
import {Client, type Signer} from "@xmtp/browser-sdk";
import {useEffect, useRef, useState} from "react";
import {toBytes} from "viem/utils";
import {getAvatar} from "@/utils/getAvatar";
import Cookies from "js-cookie";

export default function Chat() {
    const {address} = useAccount()
    const {signMessageAsync} = useSignMessage()
    const [ready, setReady] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [typing, setTyping] = useState(false)

    useEffect(() => {
        if (address) {
            const email = Cookies.get('email')
            const username = Cookies.get('username')
            // if (!email || !username) {
            //     location.href = '/'
            // }

            setEmail(email!)
            setUsername(username!)
        }
    }, [address]);

    const clientRef = useRef<Client | null>(null)

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        setMessages(prevMessages => [
            ...prevMessages,
            { sender: username || 'You', text: newMessage }
        ]);
        setNewMessage('');
        setTyping(true);

        // Simulate typing delay
        setTimeout(() => {
            setTyping(false);
            // Optionally add a bot response
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: 'Bot', text: 'Got it! Let me look into it.' }
            ]);
        }, 1000); // Adjust delay as needed
    }

    return <div className="flex flex-row flex-nowrap w-full h-[100svh] justify-center items-center">
        <div className="w-[360px] bg-white min-h-[500px] rounded p-4">
            <div className="cormorant-font text-[#00545D] text-3xl mb-4 font-semibold">@ETH-Dispatch</div>

            <div className="flex flex-col max-h-[70svh] overflow-auto">
                {
                    messages.map((message, index) => (
                        <div className="flex flex-row mb-6" key={index}>
                            <img src={getAvatar()} className="w-[50px] h-[50px] rounded-full mr-4" alt=""/>
                            <div className="text-[#00545D] text-sm">
                                <div className="font-semibold">{message.sender}</div>
                                <div>{message.text}</div>
                            </div>
                        </div>
                    ))
                }
                {typing && (
                    <div className="flex flex-row mb-6">
                        <img src={getAvatar()} className="w-[50px] h-[50px] rounded-full mr-4" alt=""/>
                        <div className="text-[#00545D] text-sm">
                            <div className="font-semibold">Bot</div>
                            <div>Typing...</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-row p-2">
                <input 
                    type="text" 
                    placeholder="Type a message" 
                    className="w-full input input-md border-none focus:outline-none bg-[#F5F5F5]" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                    className="btn ml-4 text-white font-normal" 
                    style={{background: 'linear-gradient(118.4deg, #D9ECC7 11.69%, #07A3B2 88.31%)'}}
                    onClick={handleSendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    </div>
}




