import {
  ConnectionState,
  ConnectionRole,
  DidDoc,
  ConnectionInvitationMessage,
  ConnectionRecordProps,
  ConnectionRecord,
} from '@aries-framework/core'
import { DidCommService } from '@aries-framework/core/build/modules/dids/domain'

export default function getMockConnection({
  state = ConnectionState.Invited,
  role = ConnectionRole.Invitee,
  id = 'test',
  did = 'test-did',
  threadId = 'threadId',
  verkey = 'key-1',
  didDoc = new DidDoc({
    id: did,
    publicKey: [],
    authentication: [],
    service: [
      new DidCommService({
        id: `${did};indy`,
        serviceEndpoint: 'https://endpoint.com',
        recipientKeys: [verkey],
      }),
    ],
  }),
  tags = {},
  theirLabel,
  invitation = new ConnectionInvitationMessage({
    label: 'test',
    recipientKeys: [verkey],
    serviceEndpoint: 'https:endpoint.com/msg',
  }),
  theirDid = 'their-did',
  theirDidDoc = new DidDoc({
    id: theirDid,
    publicKey: [],
    authentication: [],
    service: [
      new DidCommService({
        id: `${did};indy`,
        serviceEndpoint: 'https://endpoint.com',
        recipientKeys: [verkey],
      }),
    ],
  }),
  multiUseInvitation = false,
}: Partial<ConnectionRecordProps> = {}) {
  return new ConnectionRecord({
    did,
    didDoc,
    threadId,
    theirDid,
    theirDidDoc,
    id,
    role,
    state,
    tags,
    verkey,
    invitation,
    theirLabel,
    multiUseInvitation,
  })
}
