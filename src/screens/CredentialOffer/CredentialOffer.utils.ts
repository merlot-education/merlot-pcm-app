import { Agent, CredentialRecord } from '@aries-framework/core'
import { useAgent } from '@aries-framework/react-hooks'

export const acceptCredential = async (
  agent: Agent,
  credential: CredentialRecord,
) => {
  const credentialrecord = await agent.credentials.acceptOffer(credential.id)
  return credentialrecord
}

export default { acceptCredential }
