'use client'

import {useEffect, useState} from "react";
import Cookies from "js-cookie";

export default function SetNamePage() {
    const [username, setUsername] = useState('')
    const [status, setStatus] = useState<'' | 'waiting'>('')

    useEffect(() => {
        const email = Cookies.get('email')
        if (!email) {
            location.href = '/'
        }

        setUsername(email!.split('@')[0])
    }, []);

    const handleConfirm = () => {
        Cookies.set('username', username, {expires: 365})

        setStatus('waiting')
        setTimeout(() => {
            location.href = '/chat'
        }, 5000)
    }

    return <div className="flex flex-row flex-nowrap w-full h-[100svh] justify-center items-center">
        {!status &&
            <div className="w-[360px]">
                <div className="cormorant-font text-[#00545D] text-3xl mb-4">
                    <b>Proof</b> successfully <br/> Generated!
                </div>

                <div className="badge border-0 rounded text-xs mb-4" style={{background: 'rgba(0, 84, 93, 0.3)'}}>
                    Display Name
                </div>
                <input type="email"
                       value={username}
                       onChange={e => setUsername(e.target.value)}
                       required={true}
                       placeholder="Input your username"
                       className="w-full input mb-4 bg-[rgba(255,255,255,.3)] border-2 border-[rgba(255,255,255,.7)]"/>

                <div className="cormorant-font  text-[#00545D] text-sm mb-4">Your name will be visible to the group, not
                    your email.
                </div>
                <button className="btn w-full" disabled={!username} onClick={handleConfirm}>Join Group Chat Now</button>
            </div>
        }


        {status === 'waiting' &&
            <div className="w-[360px]">
                <div className="cormorant-font text-[#00545D] text-3xl mb-4">
                    <b>Entering</b> the chatroom securely...
                </div>

                <progress className="progress w-full h-4 rounded mb-4"></progress>
                <div className="cormorant-font  text-[#00545D] text-sm mb-4">
                    This usually takes just a few seconds.
                </div>
            </div>
        }
    </div>
}
