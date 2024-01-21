
 // Assume you have the contract ABI and address defined
 //var contractABI = [...];  // Replace with your contract ABI
 var contractAddress = "0xeCB3F760e64eCDf5260746118cEafFdA259De19a";  // Replace with your contract address
 
 // Create a contract instance
 var contract = web3.eth.contract(mygovabi).at(contractAddress);


 // Assume you have the contract instance named 'contract' and web3 available

function getTotalSurveys() {
    try {

        contract.getNoOfSurveys.call(function(error, res) {
            if (!error) {
                // Update the UI or handle the result as needed
                console.log("Total number of surveys :", res.toNumber()  );

                document.getElementById("totalsurveyamount").innerHTML = "Total Survey Amount : " + res.toNumber();
            } else {
                console.error("Error getting donation balance:", error);
                document.getElementById("totalsurveyamount").innerHTML = "Could not get data" ;
            }
        });

    } catch (error) {
        console.error("Error getting total number of surveys:", error);

        // Handle the error or return a default value
        return 0;
    }
}



function getSurveyInfos() {

      // Use the `call` method asynchronously
      try {
        var surveyId = document.getElementById('surveyId').value;

        var userAddress = web3.eth.accounts[0];  // Assuming MetaMask is used

        console.log("Survey ID : " + surveyId );

        contract.getSurveyInfo(surveyId, { from: userAddress, gas: 3000000 }, function(error, result) {
            if (!error) {
                console.log("Survey Info for Survey ID", surveyId);
                console.log("IPFS Hash:", result[0]);
                console.log("Survey Deadline:", result[1].toNumber());
                console.log("Number of Choices:", result[2].toNumber());
                console.log("At Most Choices:", result[3].toNumber());
    
                document.getElementById("surveyInfo").innerHTML = `
                    <strong>Survey Info for Survey ID ${surveyId}:</strong><br>
                    IPFS Hash: ${result[0]}<br>
                    Survey Deadline: ${result[1].toNumber()}<br>
                    Number of Choices: ${result[2].toNumber()}<br>
                    At Most Choices: ${result[3].toNumber()}<br>
                `;
            } else {
                console.error("Error getting survey info:", error);
                document.getElementById("surveyInfo").innerHTML = "Could not get survey info";
            }
        });


    } 

    catch (error) {
        console.error("Error getting survey info: ", error);
        // Handle the error, update the UI, or display an error message
        document.getElementById("surveyInfo").innerHTML = "Could not get survey info";
    }


}



async function getSurveyOwner() {
       // Use the `call` method asynchronously
       try {
            var surveyId = document.getElementById('surveyId2').value;

            var userAddress = web3.eth.accounts[0];  // Assuming MetaMask is used

            console.log("Survey ID : " + surveyId );

            contract.getSurveyOwner(surveyId, { from: userAddress, gas: 3000000 }, function(error, result) {
                if (!error) {
                    console.log(`Owner of Survey ID ${surveyId}: ${result}`);
                    // Do something with the owner, such as updating the UI
                
                    document.getElementById("surveyOwner").innerHTML = `Owner of Survey ID ${surveyId}: ${result}` ;
                } else {
                    console.error("Error :", error);
                    document.getElementById("surveyOwner").innerHTML = "Error at taking survey owner, not available survey id";
                }
            });


        } 

        catch (error) {
            console.error("Error getting survey owner:", error);
            // Handle the error, update the UI, or display an error message
            document.getElementById("surveyOwner").innerHTML = "Could not get survey owner";
        }
}




async function getSurveyResult() {
    // Use the `call` method asynchronously
    try {
         var surveyId = document.getElementById('surveyId3').value;

         var userAddress = web3.eth.accounts[0];  // Assuming MetaMask is used

         console.log("Survey ID : " + surveyId );

         contract.getSurveyResults (surveyId, { from: userAddress, gas: 3000000 }, function(error, result) {
             if (!error) {
                 console.log(`Survey Results ${surveyId}: ${result}`);
                 // Do something with the owner, such as updating the UI
             
                 document.getElementById("surveyResult").innerHTML = 
                 `Numtaken of Survey ${surveyId} is as follows : ${ result[0] } <br>
                  Results of Survey ${surveyId} is as follows  : ${result[1]}<br>
                 `;
             } else {
                 console.error("Error :", error);
                 document.getElementById("surveyResult").innerHTML = "Error at taking survey results, not available survey id";
             }
         });


     } 

     catch (error) {
         console.error("Error getting survey owner:", error);
         // Handle the error, update the UI, or display an error message
         document.getElementById("surveyOwner").innerHTML = "Could not get survey owner";
     }
}



// Function to take a survey

async function takeSurvey(surveyId, choices) {
    // Assuming you have the contract instance named 'contract' and web3 available



    // Use the `call` method asynchronously
    try {
        var surveyId = document.getElementById('surveyId').value;
        var choicesInput = document.getElementById('choices').value;
        

        console.log("surveyıd : " + surveyId);
        console.log("choices"  + choices);

        var userAddress = web3.eth.accounts[0];  // Assuming MetaMask is used

        
        // Convert comma-separated choices to an array
        var choices = choicesInput.split(',').map(choice => parseInt(choice.trim()));

        contract.takeSurvey(surveyId, choices , { from: userAddress, gas: 3000000 }, function(error, result) {
            if (!error) {

                console.log("Survey taken successfully. Transaction hash:", result.transactionHash );
                // Update the UI or display a success message
                
                document.getElementById("surveyStatus").innerHTML = "Survey taken successfully.";
                
            } else {
                
                console.error("Error :", error);
                document.getElementById("surveyStatus").innerHTML = "Error at taking survey ";
            }
        });


    } 

    catch (error) {
        console.error("Error taking survey:", error);
        // Handle the error or display an error message
        document.getElementById("surveyStatus").innerHTML = "Error taking survey. See console for details.";
    }


}