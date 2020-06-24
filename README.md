# com.kychain

# KYCHAIN V1


# 1 Create the BNA archive
`composer archive create  --sourceType dir --sourceName ../`

# 2.1 Install the archive
`composer network install -a ./kychain@0.0.1.bna -c PeerAdmin@hlfv1`

# 2.2 Start the network
`composer network start -n kychain -c PeerAdmin@hlfv1 -V 0.0.1 -A admin -S adminpw`
- admin>> org.hyperledger.composer.system.NetworkAdmin#admin`

# 3 Import Network Admin card
`composer card delete -n admin@kychain`
`composer card import -f admin@kychain.card`

# Add Particapnts
## 4 Add a new participants (Banks Admin/RBZ Admin)

- Regulator user
`composer participant add -d {"$class": "com.kychain.participant.KychainRegulatorPersonnel","role": "REGULATOR","idNumber": "0122","firstName":"Panashe","surname": "Chelenje","phoneNumber":"0774242673"} -c admin@kychain`


- Will Smith (wills) is the RBZ Admin
`composer participant add -d '{"$class":"org.acme.airline.participant.ACMEPersonnel","participantKey":"wills","contact":{"$class":"org.acme.airline.participant.Contact","fName":"Will","lname":"Smith","email":"will.smith@acmeairline.com"}, "department":"Logistics"}' -c admin@kychain`

# Identity issuance
## 5 Issue the identities
`composer identity issue -u johnd -a org.acme.airline.participant.ACMENetworkAdmin#johnd -c admin@kychain`
`composer card delete -n johnd@kychain`
`composer card import -f johnd@kychain.card`

`composer identity issue -u 0122 -a com.kychain.participant.KychainRegulatorPersonnel#0122 -c admin@kychain`
`composer card delete -n wills@kychain`
`composer card import -f wills@kychain.card`

# Network Functions
## 6 Rebuild the archive
`composer archive create  --sourceType dir --sourceName ../`

# 7 Update the Network
`composer network upgrade -n <business-network-name> -V <business-network-version> -c <business-network-card>`
    
`composer network update -a ./kychain@0.0.1.bna -c admin@kychain`
