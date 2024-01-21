
 // Assume you have the contract ABI and address defined
 //var contractABI = [...];  // Replace with your contract ABI
 var contractAddress = "0xeCB3F760e64eCDf5260746118cEafFdA259De19a";  // Replace with your contract address
 
 // Create a contract instance
 var contract = web3.eth.contract(mygovabi).at(contractAddress);



function gettokenbalance() {
   // var contract = web3.eth.contract(mygovabi).at("0x440cd2b2ff0e45c8597a89e8359252123e54b06f");
    var fromaddr = document.getElementById("fromaddr").value ;
    var mypromise = new Promise(function(resolve, reject) {
       contract.balanceOf(fromaddr,function(error, response) {
       //web3.eth.getBalance(fromaddr,function(error, response) {
           if (error) { 
               reject(error); 
           } 
           else { 
               resolve(response); 
           }
        }) ; 
    });
    mypromise.then(
        function(result) {
          document.getElementById("status").innerHTML = "Balance:" + result ;  
        }, 
        function(err) {
          console.log(err); 
    });
 } 





// Function to get USD stable coin balance for the connected user
function getUSDBalance() {
    // Get the user's address from MetaMask or other wallet provider
    var userAddress = document.getElementById("useraddr").value ;
    // var userAddress = web3.eth.accounts[0];  // Assuming MetaMask is used

    // Call the USDBalance method from the smart contract
    contract.USDBalance.call({ from: userAddress }, function(error, result) {
        if (!error) {
            // Update the UI with the balance result
            document.getElementById("usdBalance").innerHTML = "USD Balance: " + result.toNumber();
        } else {
            console.error(error);
            document.getElementById("usdBalance").innerHTML = "Message:  " + error.message;
        }
    });
}






// Function to call the faucet method from the smart contract
function callFaucet() {
    // Get the user's address from MetaMask or other wallet provider
    var userAddress = web3.eth.accounts[0];  // Assuming MetaMask is used

    // Call the faucet method from the smart contract
    contract.faucet({ from: userAddress, gas: 3000000 }, function(error, result) {
        if (!error) {
            // Update the UI or handle the result as needed
            console.log("Faucet transaction successful:", result);
            document.getElementById("faucets").innerHTML = "Faucet is successfull " ;
        } else {
            console.error("Error calling faucet:", error);
            document.getElementById("faucets").innerHTML = "Faucet is unsuccessfull " + error.message ;
        }
    });
}


// Function to donate MyGov tokens to the smart contract
function donateMyGovToken() {
    // Get the user's address from MetaMask or other wallet provider
    var userAddress = web3.eth.accounts[0];  // Assuming MetaMask is used

    // Get the donation amount from the input field
    var donationAmount = document.getElementById("donationAmount").value;

    // Check if the donation amount is valid
    if (donationAmount <= 0) {
        console.error("Invalid donation amount");
        return;
    }

    // Call the donateMyGovToken function from the smart contract
    contract.donateMyGovToken(donationAmount, { from: userAddress, gas: 3000000 }, function(error, result) {
        if (!error) {
            // Update the UI or handle the result as needed
            document.getElementById("donationStatus").innerHTML = "Donation successful. Transaction hash: " + result;
        } else {
            console.error("Error donating MyGov tokens:", error);
            document.getElementById("donationStatus").innerHTML = "Error donating MyGov tokens. See console for details.";
        }
    });
}


// Function to get the donation balance of MyGov token from the smart contract
function getDonationBalance() {
    // Call the donationMyGOVBalance method from the smart contract
    contract.donationMyGOVBalance.call(function(error, result) {
        if (!error) {
            // Update the UI or handle the result as needed
            console.log("Donation Balance:", result.toNumber()  );
            document.getElementById("donationStatusbalance").innerHTML = "Donation Balance : " + result.toNumber();
        } else {
            console.error("Error getting donation balance:", error);
            document.getElementById("donationStatusbalance").innerHTML = "Could not get data" ;
        }
    });
}


// Function to get the donation balance of MyGov token from the smart contract
function getUSDDonationBalance() {
    // Call the donationMyGOVBalance method from the smart contract
    contract.donationUSDBalance.call(function(error, res) {
        if (!error) {
            // Update the UI or handle the result as needed
            console.log("Donation USD Balance:", res.toNumber()  );
            document.getElementById("donationStatusUSDbalance").innerHTML = "Donation Balance : " + res.toNumber();
        } else {
            console.error("Error getting donation balance:", error);
            document.getElementById("donationStatusUSDbalance").innerHTML = "Could not get data" ;
        }
    });
}



// Function to donate USD tokens to the smart contract
function donateUSD() {
    // Get the user's address from MetaMask or other wallet provider
    var userAddress = web3.eth.accounts[0];  // Assuming MetaMask is used

    // Get the donation amount from the input field
    var donationAmount = document.getElementById("donationAmount").value;

    // Check if the donation amount is valid
    if (donationAmount <= 0) {
        console.error("Invalid donation amount");
        return;
    }

    // Call the USDBalance method from the smart contract
    contract.USDBalance.call( { from: userAddress },function(error, usdBalance) {
        if (!error) {
            // Check if the user has enough USD tokens
            if (usdBalance.toNumber() >= donationAmount) {
                // Call the donateUSD function from the smart contract
                contract.donateUSD(donationAmount, { from: userAddress, gas: 3000000 }, function(error, result) {
                    if (!error) {
                        // Update the UI or handle the result as needed
                        document.getElementById("donationStatus").innerHTML = "USD Donation successful. Transaction hash: " + result;
                    } else {
                        console.error("Error donating USD tokens:", error);
                        document.getElementById("donationStatus").innerHTML = "Error donating USD tokens. See console for details.";
                    }
                });
            } else {
                console.error("Insufficient USD balance for donation");
            }
        } else {
            console.error("Error getting USD balance:", error);
            document.getElementById("donationStatus").innerHTML = "Error getting USD balance. See console for details.";
        }
    });
}


// Function to return MyGov token balance asynchronously
async function returnGovBalance() {
    // Get the user's address from MetaMask or other wallet provider
    var userAddress = web3.eth.accounts[0];  // Assuming MetaMask is used

    // Use the `call` method asynchronously
    return new Promise(function(resolve, reject) {
        contract.balanceOf.call(userAddress, function(error, result) {
            if (!error) {
                resolve(result.toNumber());
            } else {
                reject(error);
            }
        });
    });
}


// Function to return USD Stable Coin balance asynchronously
async function returnUSDBalance() {
    // Get the user's address from MetaMask or other wallet provider
    var userAddress = web3.eth.accounts[0];  // Assuming MetaMask is used

    // Use the `call` method asynchronously
    return new Promise(function(resolve, reject) {
        contract.USDBalance.call({ from: userAddress }, function(error, result) {
            if (!error) {
                resolve(result.toNumber());
            } else {
                reject(error);
            }
        });
    });
}



async function submitSurvey() {
    try {
        // Get the user's address from MetaMask or other wallet provider
        var userAddress = web3.eth.accounts[0];  // Assuming MetaMask is used

        // Check balances before submission
        var govBalance = await returnGovBalance();
        var usdBalance = await returnUSDBalance();
        var ipfshash = document.getElementById("ipfshash").value;
        var surveydeadline = document.getElementById("surveydeadline").value;
        var numchoices = document.getElementById("numchoices").value;
        var atmostchoice = document.getElementById("atmostchoice").value;


        console.log("Survey parameter ipfshash :", ipfshash );
        console.log("Survey parameter deadline :", surveydeadline );

        if (govBalance >= 2 && usdBalance >= 5) {
            // Call the submitSurvey function from the smart contract using await
            contract.submitSurvey(ipfshash, surveydeadline, numchoices, atmostchoice, { from: userAddress, gas: 3000000 }, function(error, result) {
                if (!error) {
                    // Update the UI or handle the result as needed
                    document.getElementById("submissionStatus").innerHTML = "Submission successs " + result;
                } else {
                    console.error("Error :", error);
                    document.getElementById("submissionStatus").innerHTML = "Error at submission at survey function";
                }
            });


           // var surveyId = await contract.submitSurvey(ipfshash, surveydeadline, numchoices, atmostchoice, { from: userAddress, gas: 3000000 });
            
            // Update the UI or handle the result as needed
            // console.log("Survey submitted successfully. Survey ID:", surveyId.toNumber());
            // document.getElementById("submissionStatus").innerHTML = "Survey submitted successfully. Survey ID: " + surveyId.toNumber();
            // document.getElementById("submissionStatus").innerHTML = "Survey submitted successfully.... " ;
        } else {
            console.error("Insufficient balance for survey submission");
            document.getElementById("submissionStatus").innerHTML = "Insufficient balance for survey submission";
        }
    } catch (error) {
        console.error("Error submitting survey:", error);
        document.getElementById("submissionStatus").innerHTML = "Error submitting survey. See console for details.";
    }
}



// Function returns timestamp
function getTimeStamp() {
    try {

        contract.getTimeStamp.call(function(error, res) {
            if (!error) {
                // Update the UI or handle the result as needed
                console.log("Block Timestamp : ", res.toNumber()  );

                document.getElementById("timestamp").innerHTML = "Block Timestamp : " + res.toNumber();
            } else {
                console.error("Error getting block timestamp ", error);
                document.getElementById("timestamp").innerHTML = "Could not get data" ;
            }
        });

         // Forcing a cache refresh by setting a timeout
        setTimeout(function() {
            location.reload(true);
        }, 1000);

    } catch (error) {
        console.error("Error getting block timestamp ", error);
        document.getElementById("timestamp").innerHTML = "Error getting block timestamp. See console for details.";
        // Handle the error or return a default value
        return 0;
    }
}















