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
            var kyc = factory.newResource(NS, 'Kyc', kycData.idNumber);
            kyc.idNumber = kycData.idNumber;
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
            event.idNumber = idNumber;
            emit(event);

            // 4. Add to registry
            return kycRegistry.add(kyc);

        }).catch(function (error) {
            throw new Error(error);
        });
}

/**
 * GrantAccess Transaction
 * @param {com.kychain.kyc.GrantAccess} grantAccessData
 * @transaction
 * 
 * **/
function grantAccess(grantAccessData) {
    var factory = getFactory();
    var kycRegistry = {}
        getAssetRegistry('com.kychain.kyc.Kyc').then(function (registry) {
        kycRegistry = registry
        return kycRegistry.get(grantAccessData.idNumber);
    }).then(function (kyc) {
        if (!kyc) throw new Error("KYC linked to : " + grantAccessData.idNumber, " Not Found!!!");
        var bank = factory.newRelationship('com.kychain.bank', 'Bank', grantAccessData.bankId);
        kyc.banks.push(bank);

        return kycRegistry.update(kyc);
    }).then(function () {
        // Successful update
        var event = getFactory().newEvent('com.kychain.kyc', 'AccessGranted');
        event.idNumber = grantAccessData.idNumber;
        event.kycStat = grantAccessData.bankId;
        emit(event);
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
    var kycRegistry = {}
    return getAssetRegistry('com.kychain.kyc.Kyc').then(function (registry) {
        kycRegistry = registry
        return kycRegistry.get(approveKycData.idNumber);
    }).then(function (kyc) {
        if (!kyc) throw new Error("KYC : " + approveKycData.idNumber, " Not Found!!!");
        kyc.assetStatus = approveKycData.status;
        kyc.approvalCount = kyc.approvalCount + 1;
        return kycRegistry.update(kyc);
    }).then(function () {
        // Successful update
        var event = getFactory().newEvent('com.kychain.kyc', 'KycCreated');
        event.idNumber = approveKycData.idNumber;
        event.kycStat = approveKycData.status;
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
    var kycRegistry = {}
    return getAssetRegistry('com.kychain.kyc.Kyc').then(function (registry) {
        kycRegistry = registry
        return kycRegistry.get(updateKycData.idNumber);
    }).then(function (kyc) {
        if (!kyc) throw new Error("KYC : " + updateKycData.idNumber, " Not Found!!!");
        kyc.assetStatus = updateKycData.status;
        var document = factory.newConcept(NS, "Document");
        document.documentLink = updateKycData.documentLink;
        document.documentType = updateKycData.documentType;
        kyc.documents.push(document);
        return kycRegistry.update(kyc);
    }).then(function () {
        var event = getFactory().newEvent('com.kychain.kyc', 'KycUpdated');
        event.idNumber = updateKycData.idNumber;
        event.kycStat = updateKycData.status;
        emit(event);
    }).catch(function (error) {
        throw new Error(error);
    });
}