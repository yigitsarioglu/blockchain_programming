const ethers = require('ethers');

(async () => {
    try {
        console.log('Running Test Mygov script..');

        const contractName = 'MyGov';
        const constructorArgs = [100000];

        const artifactsPath = `browser/contracts/artifacts/${contractName}.json`;

        const metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath));

        const web3Provider = new ethers.providers.Web3Provider(ethereum);
        const signer = web3Provider.getSigner();

        const factory = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer);
        const contract = await factory.deploy(...constructorArgs);

        console.log('Contract Address: ', contract.address);

        // The contract is not deployed yet; we must wait until it is mined
        await contract.deployed();
        console.log('Deployment successful');

        // Basic tests for the donation function
        const donorAddress = await signer.getAddress();
        console.log('Donor Address:', donorAddress);

        // Check initial balances
        const initialDonorBalance = await contract.balanceOf(donorAddress);
        const initialContractBalance = await contract.balanceOf(contract.address);
        console.log('Initial Donor Balance:', initialDonorBalance.toString());
        console.log('Initial Contract Balance:', initialContractBalance.toString());

        // Donate tokens to the contract
        const donationAmount = 100;
        await contract.donateMyGovToken(donationAmount);

        // Check updated balances
        const updatedDonorBalance = await contract.balanceOf(donorAddress);
        const updatedContractBalance = await contract.balanceOf(contract.address);
        console.log('Updated Donor Balance:', updatedDonorBalance.toString());
        console.log('Updated Contract Balance:', updatedContractBalance.toString());

        // Basic test for submitting a survey
        const ipfsHash = 'Mysurvey1'; // Replace with a valid IPFS hash
        const surveyDeadline =  Math.floor(Date.now() / 1000) + 86400; // 1 day from now;
        const numChoices = 3;
        const atMostChoice = 2;
        const surveyId = await contract.submitSurvey(ipfsHash, surveyDeadline, numChoices, atMostChoice);

        // Basic test for get number of surveys
        const numberOfSurvey = await contract.getNoOfSurveys() ;
        console.log('Number of surveys : ', numberOfSurvey.toString()  );


        // Basic test for get number of project proposals
        const numberOfProposal = await contract.getNoOfProjectProposals() ;
        console.log('Number of proposals : ', numberOfProposal.toString()  );


      

        // Testing with 100 addresses

        const wallets = [];
        const numAddresses = 100;

        for (let i = 0; i < numAddresses; i++) {
            const wallet = ethers.Wallet.createRandom();
            wallets.push(wallet);

            console.log(`Testing with address: ${wallet.address}`);

            // Await the completion of the transfer function
            await contract.transfer(wallet.address, 10);
           
            const testBalance= await contract.balanceOf(wallet.address);
            console.log(`Test Balance ${i} after transfer function: ${testBalance.toString()}`);

            
        }

    } catch (e) {
        console.error(e.message);
    }
})();
