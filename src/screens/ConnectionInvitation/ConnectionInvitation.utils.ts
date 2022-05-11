export const getInvitationFromUrl = async (agent, url): Promise<string[]> => {
  const data = await agent?.connections.receiveInvitationFromUrl(url, {
    autoAcceptConnection: true,
  })
  return data
}
export default getInvitationFromUrl
