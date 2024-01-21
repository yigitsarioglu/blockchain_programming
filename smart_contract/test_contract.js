// Right click on the script name and hit "Run" to execute

(async () =>{
    try{
        console.log('Running Test Contract script..')
        const contractName = 'MyGov'
        const constructorArgs = [10000]

        const artifactsPath = `browser/contracts/artifacts/${contractName}.json`

        const metadata = JSON.parse (await remix.call('fileManager','getFile', artifactsPath))
        
        const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()
        
        let factory =new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer);
        let contract =await factory.deploy(...constructorArgs);

        console.log ('Contract Adress : ' ,contract.address);

        //The contract is not deployed yet; we must until it is mined
        await contract.deployed()
        console.log('Deployments succcessful')

    } catch(e){
        console.log(e.message)
    }

} ) ()

