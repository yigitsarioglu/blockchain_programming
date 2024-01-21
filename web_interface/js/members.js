
 // Assume you have the contract ABI and address defined
 //var contractABI = [...];  // Replace with your contract ABI
 var contractAddress = "0xeCB3F760e64eCDf5260746118cEafFdA259De19a";  // Replace with your contract address
 
 // Create a contract instance
 var contract = web3.eth.contract(mygovabi).at(contractAddress);



// Function returns members length
function getMembersLength() {
    try {

        contract.getMembersLength.call(function(error, res) {
            if (!error) {
                // Update the UI or handle the result as needed
                console.log("Total number of members :", res.toNumber()  );

                document.getElementById("totalmembernumber").innerHTML = "Total Member Amount : " + res.toNumber();
            } else {
                console.error("Error getting member amount:", error);
                document.getElementById("totalmemberamount").innerHTML = "Could not get data" ;
            }
        });

    } catch (error) {
        console.error("Error getting members length:", error);

        // Handle the error or return a default value
        return 0;
    }
}
