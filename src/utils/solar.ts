const api = 'https://sails-dev.sola.day'

export const getNonce = async () => {
    const response = await fetch(`${api}/siwe/nonce`)
    const {nonce} = await response.json()
    return nonce
}

export const sendPinCode = async (props: { email: string}) => {
    const response = await fetch(`${api}/service/send_email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({...props, context: 'email-signin'})
    })

    if (!response.ok) {
        throw new Error('Fail to send pin code: ' + response.statusText)
    }

    const data = await response.json()
    if (data.result !== 'ok') {
        throw new Error(data.message)
    }

    return data as { result: "ok", email: string }
}
