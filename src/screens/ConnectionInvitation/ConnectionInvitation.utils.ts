import { Agent, ConnectionRecord } from '@aries-framework/core';

export const getInvitationFromUrl = async (
  agent: Agent,
  url: string,
): Promise<ConnectionRecord> => {
  const { connectionRecord } = await agent.oob.receiveInvitationFromUrl(url, {
    autoAcceptInvitation: true,
  });
  return connectionRecord as ConnectionRecord;
};
export default getInvitationFromUrl;
