// Assume you have the contract ABI and address defined
 //var contractABI = [...];  // Replace with your contract ABI
 var contractAddress = "0xeCB3F760e64eCDf5260746118cEafFdA259De19a";  // Replace with your contract address
 
 // Create a contract instance
 var contract = web3.eth.contract(mygovabi).at(contractAddress);


 // Assume you have the contract instance named 'contract' and web3 available

function getNoOfProjectProposals() {
    try {

        contract.getNoOfProjectProposals.call(function(error, res) {
            if (!error) {
                // Update the UI or handle the result as needed
                console.log("Total number of proposal :", res.toNumber()  );

                document.getElementById("totalproposalamount").innerHTML = "Total Proposal Amount : " + res.toNumber();
            } else {
                console.error("Error getting proposal number: ", error);
                document.getElementById("totalproposalamount").innerHTML = "Could not get data" ;
            }
        });

    } catch (error) {
        console.error("Error getting total number of proposal. ", error);

        // Handle the error or return a default value
        return 0;
    }
}




async function submitProjectProposal() {
    try {
        // Get the user's address from MetaMask or other wallet provider
        var userAddress = web3.eth.accounts[0];  // Assuming MetaMask is used

        // Check balances before submission
        var govBalance = await returnGovBalance();
        var usdBalance = await returnUSDBalance();

        var ipfshash = document.getElementById("ipfshash").value;
        var votedeadline = document.getElementById("votedeadline").value;
        var paymentamountsInput = document.getElementById("paymentamounts").value;
        var payscheduleInput = document.getElementById("payschedule").value;



        console.log("Project parameter ipfshash :", ipfshash );
        console.log("Project parameter deadline :", votedeadline );

        // Convert comma-separated choices to an array
        var paymentamounts = paymentamountsInput.split(',').map(choice => parseInt(choice.trim()));
        var payschedule = payscheduleInput.split(',').map(choice => parseInt(choice.trim()));

        if (govBalance >= 5 && usdBalance >= 50) {
            // Call the submitSurvey function from the smart contract using await
            contract.submitProjectProposal(ipfshash,votedeadline, paymentamounts, payschedule, { from: userAddress, gas: 3000000 }, function(error, result) {
                if (!error) {
                    // Update the UI or handle the result as needed
                    document.getElementById("submissionStatus").innerHTML = "Submission successs " + result;
                } else {
                    console.error("Error :", error);
                    document.getElementById("submissionStatus").innerHTML = "Error at submission at project function";
                }
            });

        } else {
            console.error("Insufficient balance for project proposal");
            document.getElementById("submissionStatus").innerHTML = "Insufficient balance for project proposal";
        }
    } catch (error) {
        console.error("Error submitting project:", error);
        document.getElementById("submissionStatus").innerHTML = "Error submitting project. See console for details.";
    }
}



async function getProjectOwner() {
    // Use the `call` method asynchronously
    try {
         var projectId = document.getElementById('projectId').value;

         var userAddress = web3.eth.accounts[0];  // Assuming MetaMask is used

         console.log("Project ID : " + projectId );

         contract.getProjectOwner(projectId, { from: userAddress, gas: 3000000 }, function(error, result) {
             if (!error) {
                 console.log(`Owner of Project Proposal ID ${projectId}: ${result}`);
                 // Do something with the owner, such as updating the UI
             
                 document.getElementById("projectOwner").innerHTML = `Owner of Project ID ${projectId}: ${result}` ;
             } else {
                 console.error("Error :", error);
                 document.getElementById("projectOwner").innerHTML = "Error at taking project owner, not available project id";
             }
         });


     } 

     catch (error) {
         console.error("Error getting project owner:", error);
         // Handle the error, update the UI, or display an error message
         document.getElementById("projectOwner").innerHTML = "Could not get survey owner";
     }
}




function getProjectInfo() {

    // Use the `call` method asynchronously
    try {
      var projectId = document.getElementById('projectId').value;

      var userAddress = web3.eth.accounts[0];  // Assuming MetaMask is used

      console.log("Project ID : " + projectId );

      contract.getProjectInfo(projectId, { from: userAddress, gas: 3000000 }, function(error, result) {
          if (!error) {
              console.log("Proposal Info for Project ID", projectId);
              console.log("IPFS Hash:", result[0]);
              console.log("Project Deadline: ", result[1].toNumber());
              console.log("Payment Amounts: ", result[2]);
              console.log("Payment Schedule: ", result[3] );
  
              document.getElementById("projectInfo").innerHTML = `
                  <strong>Proposal Info for Project ID ${projectId}:</strong><br>
                  IPFS Hash: ${result[0]}<br>
                  Project Deadline: ${result[1].toNumber()}<br>
                  Payment Amounts:  ${result[2]}<br>
                  Payment Schedule: ${result[3]}<br>
              `;
          } else {
              console.error("Error getting project info:", error);
              document.getElementById("projectInfo").innerHTML = "Could not get project info";
          }
      });


  } 

  catch (error) {
      console.error("Error getting project info: ", error);
      // Handle the error, update the UI, or display an error message
      document.getElementById("projectInfo").innerHTML = "Could not get project info";
  }


}


async function getProjectResult() {
    // Use the `call` method asynchronously
    try {
         var projectId = document.getElementById('projectID').value;

         var userAddress = web3.eth.accounts[0];  // Assuming MetaMask is used

         console.log("Project ID : " + projectId  );

         contract.getProjectResults(projectId , { from: userAddress, gas: 3000000 }, function(error, result) {
             if (!error) {
                 console.log(`Project Results ${projectId}: ${result}`);
                 // Do something with the owner, such as updating the UI
             
                 document.getElementById("projectResult").innerHTML = 
                 `Project Yes Votes ${projectId} is as follows : ${ result[0] } <br>
                  Project No Votes ${projectId} is as follows  : ${result[1]}<br>
                  Project NextPaymentIndex ${projectId} is as follows  : ${result[2]} <br>
                  Project IsFunded ${projectId} is as follows  : ${result[3]} <br>
                 `;
             } else {
                 console.error("Error :", error);
                 document.getElementById("projectResult").innerHTML = "Error at taking project results, not available project id";
             }
         });


     } 

     catch (error) {
         console.error("Error getting project result data:", error);
         // Handle the error, update the UI, or display an error message
         document.getElementById("projectResult").innerHTML = "Could not get project results...";
     }
}






// Function to vote for a project proposal
function voteForProjectProposal() {
    try {
        var userAddress = web3.eth.accounts[0];  // Assuming MetaMask is used

        // Get the project ID and vote choice from the form
        var projectId = document.getElementById('projectId').value;
        var voteChoice = document.getElementById('voteChoice').value.toLowerCase(); // Convert to lowercase for case-insensitivity

        // Validate the vote choice
        if (voteChoice !== 'true' && voteChoice !== 'false') {
            console.error("Invalid vote choice. Please enter 'true' or 'false'.");
            document.getElementById("voteStatus").innerHTML = "Invalid vote choice. Please enter 'true' or 'false'.";
            return;
        }

        // Convert the string vote choice to a boolean
        var choice = (voteChoice === 'true');

        // Call the voteForProjectProposal function from the smart contract
        contract.voteForProjectProposal(projectId, choice, { from: userAddress, gas: 3000000 }, function(error, result) {
            if (!error) {
                // Update the UI or handle the result as needed
                console.log("Vote for project proposal successful. Transaction hash: " + result);
                document.getElementById("voteStatus").innerHTML = "Vote for project proposal successful. Transaction hash: " + result;
            } else {
                console.error("Error voting for project proposal:", error);
                document.getElementById("voteStatus").innerHTML = "Error voting for project proposal. See console for details.";
            }
        });

    } catch (error) {
        console.error("Error voting for project proposal:", error);

        // Handle the error or return a default value
        document.getElementById("voteStatus").innerHTML = "Error voting for project proposal. See console for details.";
    }
}    




// JavaScript function for delegateVoteTo
function delegateVoteTo() {
    try {
        // Get the user's address from MetaMask or other wallet provider
        var userAddress = web3.eth.accounts[0];  // Assuming MetaMask is used


        // Get the project ID and vote choice from the form
        var projectId = document.getElementById('projectId').value;
        var memberAddress = document.getElementById('memberAddress').value;


        console.log("Delegating vote to member: " + memberAddress + " for project ID: " + projectId);

        // Call the delegateVoteTo function from the smart contract
        contract.delegateVoteTo(memberAddress, projectId, { from: userAddress, gas: 3000000 }, function(error, result) {
            if (!error) {
                console.log("Vote delegated successfully. Transaction hash: " + result);
                // Update the UI or handle the result as needed
                document.getElementById("delegateVoteStatus").innerHTML = "Vote delegated successfully. Transaction hash: " + result;
            } else {
                console.error("Error delegating vote:", error);
                document.getElementById("delegateVoteStatus").innerHTML = "Error delegating vote. See console for details.";
            }
        });
    } catch (error) {
        console.error("Error delegating vote:", error);
        // Handle the error or return a default value
    }
}


function getNoOfFundedProjects() {
    try {

        contract.getNoOfFundedProjects.call(function(error, res) {
            if (!error) {
                // Update the UI or handle the result as needed
                console.log("Number of Funded project proposal :", res.toNumber()  );

                document.getElementById("totalfundedproject").innerHTML = "Funded Project Number : " + res.toNumber();
            } else {
                console.error("Error getting proposal number: ", error);
                document.getElementById("totalfundedproject").innerHTML = "Could not get data" ;
            }
        });

    } catch (error) {
        console.error("Error getting total number of proposal. ", error);

        // Handle the error or return a default value
        return 0;
    }
}



     // JavaScript function for reserveProjectGrant
function reserveProjectGrant() {
    try {
        var projectId = document.getElementById('projectId').value;

        // Get the user's address from MetaMask or other wallet provider
        var userAddress = web3.eth.accounts[0];  // Assuming MetaMask is used

        console.log("Reserving grant for project ID: " + projectId);

            // Call the reserveProjectGrant function from the smart contract
        contract.reserveProjectGrant(projectId, { from: userAddress, gas: 3000000 }, function(error, result) {
            if (!error) {
                console.log("Grant reserved successfully. Transaction hash: " + result);
                    // Update the UI or handle the result as needed
                document.getElementById("reserveGrantStatus").innerHTML = "Grant reserved successfully. Transaction hash: " + result;
            } else {
                console.error("Error reserving grant:", error);
                document.getElementById("reserveGrantStatus").innerHTML = "Error reserving grant. See console for details.";
            }
        });
        
    } catch (error) {
        console.error("Error reserving grant:", error);
                   // Handle the error or return a default value
    }
}



// Function to vote for a project proposal
function voteForProjectPayment() {
    try {
        var userAddress = web3.eth.accounts[0];  // Assuming MetaMask is used

        // Get the project ID and vote choice from the form
        var projectId = document.getElementById('projectId').value;
        var voteChoice = document.getElementById('voteChoices').value.toLowerCase(); // Convert to lowercase for case-insensitivity

        // Validate the vote choice
        if (voteChoice !== 'true' && voteChoice !== 'false') {
            console.error("Invalid vote choice. Please enter 'true' or 'false'.");
            document.getElementById("votingStatus").innerHTML = "Invalid vote choice. Please enter 'true' or 'false'.";
            return;
        }

        // Convert the string vote choice to a boolean
        var choice = (voteChoice === 'true');

        // Call the voteForProjectProposal function from the smart contract
        contract.voteForProjectPayment(projectId, choice, { from: userAddress, gas: 3000000 }, function(error, result) {
            if (!error) {
                // Update the UI or handle the result as needed
                console.log("Vote for project payment successful. Transaction hash: " + result);
                document.getElementById("votingStatus").innerHTML = "Vote for project ppayment successful. Transaction hash: " + result;
            } else {
                console.error("Error voting for project proposal:", error);
                document.getElementById("votingStatus").innerHTML = "Error voting for project payment. See console for details.";
            }
        });

    } catch (error) {
        console.error("Error voting for project payment:", error);

        // Handle the error or return a default value
        document.getElementById("votingStatus").innerHTML = "Error voting for project proposal. See console for details.";
    }
}    




// JavaScript function for withdrawProjectPayment
function withdrawProjectPayment() {
    try {
        var projectId = document.getElementById('projectId').value;

        // Get the user's address from MetaMask or other wallet provider
        var userAddress = web3.eth.accounts[0];  // Assuming MetaMask is used

        console.log("Withdrawing payment for project ID: " + projectId);

        // Call the withdrawProjectPayment function from the smart contract
        contract.withdrawProjectPayment(projectId, { from: userAddress, gas: 3000000 }, function(error, result) {
            if (!error) {
                console.log("Payment withdrawn successfully. Transaction hash: " + result);
                // Update the UI or handle the result as needed
                document.getElementById("withdrawPaymentStatus").innerHTML = "Payment withdrawn successfully. Transaction hash: " + result;
            } else {
                console.error("Error withdrawing payment:", error);
                document.getElementById("withdrawPaymentStatus").innerHTML = "Error withdrawing payment. See console for details.";
            }
        });
    } catch (error) {
        console.error("Error withdrawing payment:", error);
        // Handle the error or return a default value
    }

}