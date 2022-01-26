
# 1 Create the BNA archive
composer archive create  --sourceType dir --sourceName ../

# 2.1 Install the archive
composer network install -a ./kychain@1.0.0.bna -c PeerAdmin@hlfv1

# 2.2 Start the network
composer network start -n kychain -c PeerAdmin@hlfv1 -V 1.0.0 -A admin -S adminpw

# 3 Import Network Admin card
composer card delete -n admin@kychain
composer card import -f admin@kychain.card