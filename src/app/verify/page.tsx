'use client'

import {useEffect, useState} from "react";
import {OauthClient} from "@zk-email/oauth-sdk"
import {Address, createPublicClient, http} from 'viem'
import {baseSepolia} from 'viem/chains'
import Cookies from 'js-cookie'

export default function Login() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'' | 'sending' | 'waiting'>('')

    const [error, setError] = useState('')
    const [emailError, setEmailError] = useState('')

    useEffect(() => {
        const email = Cookies.get('email')
        if (email) {
            location.href = '/set-name'
        }
    }, []);

    const handleCheckEmail = () => {
        if (!email) {
            setEmailError('Please input email')
            return
        }

        if (!email.includes('@') || !email.includes('.')) {
            setEmailError('Invalid email')
            return
        }

        setEmailError('')
    }

    const handleZkEmailSign = async () => {
        if (emailError) return

        setStatus('waiting')
        try {
            const publicClient: any = createPublicClient({
                chain: baseSepolia, // Chain ID
                transport: http("https://sepolia.base.org"), // Transport URL
            })

            const coreAddress: Address = '0x3C0bE6409F828c8e5810923381506e1A1e796c2F'
            const oauthAddress: Address = '0x8bFcBe6662e0410489d210416E35E9d6B62AF659'
            const relayerHost: string = "https://oauth-api.emailwallet.org"
            const oauthClient = new OauthClient(publicClient, coreAddress, oauthAddress, relayerHost)

            const _email = email.trim()
            const username = _email.split('@')[0]
            const requestId = await oauthClient.setup(_email, username || 'solar_user', null, null)
            const isActivated = await oauthClient.waitEpheAddrActivated(requestId)
            if (!isActivated) {
                setError('Email not activated')
                return
            }

            Cookies.set('email', _email, {expires: 365})
            location.href = '/set-name'
        } catch (e: any) {
           console.error()
           setError(e.message)
        } finally {
            setStatus('')
        }
    }

    return <div className="flex flex-row flex-nowrap w-full h-[100svh] justify-center items-center">
        <div className="w-[360px]">
            <div className="cormorant-font text-[#00545D] text-3xl mb-4">Verify your email</div>

            {status !== 'waiting' &&
                <div className="cormorant-font  text-[#00545D] text-sm mb-4">Enter your email address to get started.
                    We'll
                    send you an email to verify your ownership. Your email is never shared or displayed to others.
                </div>
            }

            {!status &&
                <>
                    <input type="email"
                           value={email}
                           onChange={e => setEmail(e.target.value)}
                           onBlur={handleCheckEmail}
                           required={true}
                           readOnly={!!status}
                           placeholder="Input your email"
                           className="w-full input mb-4 bg-[rgba(255,255,255,.3)] border-2 border-[rgba(255,255,255,.7)]"/>
                    <div className="text-red-500">{emailError}</div>
                    <button className="btn w-full" onClick={handleZkEmailSign} disabled={!!status}>Next</button>
                </>
            }


            { status === 'waiting' &&
                <div className="cormorant-font  text-[#00545D] text-sm mb-4">
                    Check your email to complete the verification process.
                </div>
            }

            {!!status &&
                <>
                    <div className="items-center mb-4">
                        <progress className="progress w-full h-4 rounded"></progress>
                        <div className="ml-2 text-sm">
                            <div>{
                                status === 'sending' ? 'Sending email...' : 'Waiting for email verification...'
                            }</div>
                        </div>
                    </div>
                    <button className='btn w-full' onClick={e => {setError('');setStatus('')}}>Cancel</button>
                </>
            }

            <div className="text-red-500">{error}</div>
        </div>
    </div>
}
