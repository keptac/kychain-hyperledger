# Create the archive
composer archive create  --sourceType dir --sourceName ../ -a kychain.bna

# Install the archive
composer network install -a ./kychain.bna -c PeerAdmin@hlfv1

# Start the network
composer network start -n kychain -c PeerAdmin@hlfv1 -V 0.0.1 -A admin -S adminpw

# Use the card generated
composer card import -f admin@kychain.card