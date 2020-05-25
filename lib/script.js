/**
 * UploadKyc Transaction
 * @param {com.kychain.kyc.UploadKyc} kycData
 * @transaction
 * 
 */
function uploadKyc(kycData) {
    // Get the Asset Registry
    return getAssetRegistry('com.kychain.kyc.Kyc')
        .then(function (kycRegistry) {
            var factory = getFactory();
            var NS = 'com.kychain.kyc';
            var documentContainer = [];

            // 2.1 Set the idNumber, address, dateOfBirth ... 
            var kyc = factory.newResource(NS, 'Kyc', kycData.ownerId);
            kyc.kycId = kycData.kycId;
            kyc.address = kycData.address;
            kyc.dateOfBirth = kycData.dateOfBirth;
            kyc.gender = kycData.gender;
            kyc.assetStatus = kycData.assetStatus;
            kyc.approvalCount = kycData.approvalCount;

            // Kyc asset has an instance of the concept
            // 2.2 Use the factory to create an instance of concept
            var doc = factory.newConcept(NS, "Document");

            // 2.3 Set the data in the concept 'doc'
            kycData.document.forEach(element => {
                doc.documentLink = element.documentLink;
                doc.documentType = element.documentType;
                documentContainer.push(doc);
            });

            // 2.4 Set the documents attribute on the asset
            kyc.documents = documentContainer;
            kyc.banks = [];

            // var owner = factory.newRelationship('com.kychain.participant', 'KychainCustomer', kycData.idNumber);
            var owner = factory.newRelationship('com.kychain.participant', 'KychainCustomer', kycData.ownerId);
            kyc.owner = owner;

            // 3 Emit the event KycCreated
            var event = factory.newEvent(NS, 'KycCreated');
            event.kycId = kycData.kycId;
            event.idNumber = kycData.ownerId;
            event.status = kyc.assetStatus;
            
            emit(event);

            // 4. Add to registry
            return kycRegistry.add(kyc);

        }).catch(function (error) {
            throw new Error(error);
        });
}

/**
 * ApproveKyc Transaction
 * @param {com.kychain.kyc.ApproveKyc} approveKycData
 * @transaction
 * 
 * **/
function approveKyc(approveKycData) {
    var factory = getFactory();
    var kycRegistry = {};
    return getAssetRegistry('com.kychain.kyc.Kyc').then(function (registry) {
        kycRegistry = registry;
        return kycRegistry.get(approveKycData.kycId);
    }).then(function (kyc) {
        var bank = factory.newRelationship('com.kychain.bank', 'Bank', approveKycData.bankId);
        if (!kyc) throw new Error("KYC : " + approveKycData.kycId, " Not Found!!!");
        kyc.assetStatus = approveKycData.status;
        kyc.approvalCount = kyc.approvalCount + 1;
        kyc.banks.push(bank);
        return kycRegistry.update(kyc);
    }).then(function () {
        // Successful update
        var event = getFactory().newEvent('com.kychain.kyc', 'KycCreated');
        event.idNumber = approveKycData.kycId;
        event.status = approveKycData.status;
        emit(event);
    }).catch(function (error) {
        throw new Error(error);
    });
}

/**
 * UpdateKyc Transaction
 * @param {com.kychain.kyc.UpdateKyc} updateKycData
 * @transaction
 * 
 * **/
function updateKyc(updateKycData) {
    var factory = getFactory();
    var kycRegistry = {};
    var NS = 'com.kychain.kyc';
    return getAssetRegistry('com.kychain.kyc.Kyc').then(function (registry) {
        kycRegistry = registry;
        return kycRegistry.get(updateKycData.kycId);
    }).then(function (kyc) {
        if (!kyc) throw new Error("KYC : " + updateKycData.kycId, " Not Found!!!");
        kyc.address = updateKycData.address;
        kyc.assetStatus = updateKycData.status;

        for (var i = 0; i < kyc.documents.length; i++) {
            if (kyc.documents[i]['documentType'] == updateKycData.type){
              kyc.documents[i]['documentLink'] = updateKycData.documentLink;
              return kycRegistry.update(kyc);
            }
        }

        return kycRegistry.update(kyc);
    }).then(function () {
        var event = getFactory().newEvent('com.kychain.kyc', 'KycUpdated');
        event.idNumber = updateKycData.kycId;
        event.status = updateKycData.status;
        emit(event);
    }).catch(function (error) {
        throw new Error(error);
    });
}

/**
 * CreateBank Transaction
 * @param {com.kychain.bank.CreateBank} bankData
 * @transaction
 * 
 */
function addBank(bankData) {
    return getAssetRegistry('com.kychain.bank.Bank')
        .then(function (bankRegistry) {
            var factory = getFactory();
            var NS = 'com.kychain.bank';
            var bank = factory.newResource(NS, 'Bank', bankData.bankId);
            var event = factory.newEvent(NS, 'BankCreated');

            bank.bankId = bankData.bankId;
            bank.bankName = bankData.bankName;
            bank.address = bankData.address;

            event.bankId = bankData.bankId;
            emit(event);

            return bankRegistry.add(bank);

        }).catch(function (error) {
            throw new Error(error);
        });
}