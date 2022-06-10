import { Agent, CredentialExchangeRecord } from '@aries-framework/core'

export const acceptCredential = async (
  agent: Agent,
  credential: CredentialExchangeRecord,
) => {
  const credentialRecord = await agent.credentials.acceptOffer({
    credentialRecordId: credential.id,
  })
  return credentialRecord
}

export default { acceptCredential }
