import { parseGwei, stringToHex, toBlobs } from 'viem';
import { NextResponse } from 'next/server'
import * as cKzg from "c-kzg"
import { setupKzg } from "viem"
import { mainnetTrustedSetupPath } from "viem/node"
import { createWalletClient, http,  } from "viem";
import { privateKeyToAccount } from "viem/accounts"
import { mainnet, sepolia } from "viem/chains"

export const account = privateKeyToAccount("0x4b1012dbed8a68b9fea640437d2d01a22d9b04ecedacb7188baecb6da1d66b4d")

export const client = createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
});

export const kzg = setupKzg(cKzg as any, mainnetTrustedSetupPath)

export async function POST(req: Request) {
    const body = await req.json()

    function stringToHex(jsonObject: any) {
        // Convert the object to a JSON string
        const jsonString = JSON.stringify(jsonObject);

        // Convert the JSON string to hex
        let hexString = '';
        for (let i = 0; i < jsonString.length; i++) {
            hexString += jsonString.charCodeAt(i).toString(16).padStart(2, '0');
        }

        return hexString;
    }

    const hexResult = stringToHex(body);

    try {
        // Convert the data to a hex string, create blobs, and send a transaction
        const blobs = toBlobs({ data: hexResult as any });

        console.log("blobs",blobs)

        const hash = await client.sendTransaction({
            blobs,
            kzg,
            maxFeePerBlobGas: parseGwei('300'),
            to: '0x0000000000000000000000000000000000000000',
        });


        return NextResponse.json({
            result: 'ok',
            hash
        })
    } catch (error: any) {
        console.error('Error:', error);
        NextResponse.json({
            result: 'ok',
            message: error.message
        })
    }
}
