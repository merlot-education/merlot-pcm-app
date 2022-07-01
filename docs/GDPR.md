# GDPR Compliance Document

The objective of this document is to detail, the data being stored and processed by the Personal Credential Manager.

## What information is stored

### Source User Information

The Open Id connect claims that MAY contain all sorts of personal data (like email, name, age and others), are received from any external source.

### Technical User Information (Public)

Connection Information - The list of connections with different OCM agents, connection history with respect to the available connections.
Verifiable Credential Specific Information - The various VC's held by the user.  
Proof Presentation Specific Information - Information with respect to the proof presentations shared by the user.

### DID Information

DID of holder is stored on the PCM agent itself.

## How is the information stored

Source User Information and Technical User Information are encrypted using the Private Key of the Individual PCM's SSI Agent and stored internally (on the agent) on PostgreSQL.

## Who can access the information

The Source User Information and Technical User Information both are accessible only locally on the PCM device after user authentication.

## How long will the information stay

Source User Information and Technical User Information is wiped out by the user.
