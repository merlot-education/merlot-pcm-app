import { ProofRecord } from '@aries-framework/core'

export const getRetrievedCredential = async (
  agent: any,
  proof: ProofRecord,
) => {
  const creds = await agent.proofs.getRequestedCredentialsForProofRequest(
    proof.id,
  )
  return creds
}

export default { getRetrievedCredential }
