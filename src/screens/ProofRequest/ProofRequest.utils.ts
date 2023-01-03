import { Agent, ProofRecord } from '@aries-framework/core';

export const getRetrievedCredential = async (
  agent: Agent,
  proof: ProofRecord,
) => {
  const retrievedCredentials =
    await agent.proofs.getRequestedCredentialsForProofRequest(proof.id);
  return retrievedCredentials;
};

export default { getRetrievedCredential };
