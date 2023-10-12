"use client"
import styles from './page.module.css'
import Head from "next/head";

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import {Amplify, API, Auth} from "aws-amplify";

Amplify.configure({
    aws_project_region: 'us-east-1',
    aws_cognito_region: 'us-east-1', // (required) - Region where Amazon Cognito project was created
    aws_user_pools_id: 'us-east-1_HvhT2GIAC', // (optional) -  Amazon Cognito User Pool ID
    aws_user_pools_web_client_id: '4i0bcpt0fuv555r0kci5l32f7a', // (optional) - Amazon Cognito App Client ID (App client secret needs to be disabled)
    aws_mandatory_sign_in: 'enable',
    aws_cloud_logic_custom: [
        {
            name: 'mysls',
            endpoint: 'https://31yfb5qshf.execute-api.us-east-1.amazonaws.com/dev/hello',
            region: 'us-east-1'
        }
    ]
})

export default function Home() {
    const getUserData = async()=>{
        const user = await Auth.currentAuthenticatedUser();
        const idToken = user.signInUserSession.idToken.jwtToken
        const requestHeader = {
            headers: {
                "Authorization": idToken
            },
            body: {
                email: user.attributes.email,
                name: user.attributes.name,
                age: 17
            }
        }
        const data = await  API.post("mysls","", requestHeader)
        console.log("Data: ", data)
    }
  return (
    <div className={styles.container}>
      <Head>
        <title> My Next app</title>
        <meta name="description" content="Generated by yarn" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Serverless</h1>
        <Authenticator loginMechanisms={['email']} socialProviders={['amazon', 'apple', 'facebook', 'google']} signUpAttributes={[
            'name',
        ]}>
            {({ signOut, user }) => (
                <main>
                    <p>Secret message</p>
                    <h1>Hello {user.attributes.email}</h1>
                    <button onClick={getUserData}>Get API</button>
                    <br />
                    <button onClick={signOut}>Sign out</button>
                </main>
            )}
        </Authenticator>
    </div>
  )
}
