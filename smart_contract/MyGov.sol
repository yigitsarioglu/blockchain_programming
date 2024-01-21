// SPDX-License-Identifier: MIT
//  Implementation of autonomous decentralized governance token contract called MyGov.  

pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

// MyGovTokenLibrary
library MyGovTokenLibrary {
    struct Member {
        bool isMember;
        mapping(uint => uint) voteBalances;
        // uint voteCount;
        address delegate;
    }

    function setDelegate(Member storage member, address _delegate) internal {
        member.delegate = _delegate;
    }
}

// MyGovSurveyLibrary
library MyGovSurveyLibrary {
    struct Survey {
        address owner;
        string ipfshash;
        uint deadline;
        uint numChoices;
        uint atMostChoice;
        uint[] results;
        uint numTaken;
    }

    function createSurvey(Survey storage survey, address _owner, string memory _ipfshash, uint _deadline, uint _numChoices, uint _atMostChoice) internal {
        survey.owner = _owner;
        survey.ipfshash = _ipfshash;
        survey.deadline = _deadline;
        survey.numChoices = _numChoices;
        survey.atMostChoice = _atMostChoice;
        survey.results = new uint[](_numChoices);
    }

    function takeSurvey(Survey storage survey, uint[] memory choices) internal {
        for (uint i = 0; i < choices.length; i++) {
            require(choices[i] < survey.numChoices, "Invalid choice index");
            survey.results[choices[i]] += 1;
        }
        survey.numTaken += 1;
    }
  
}

// MyGovProjectLibrary
library MyGovProjectLibrary {
    struct ProjectProposal {
        string ipfshash;
        uint votedeadline;
        uint[] paymentamounts;
        uint[] payschedule;
        address projectOwner;
        uint yesVotes;
        uint noVotes;
        uint payedAmount;
       //  uint noVotesForPayments;
        uint nextPaymentIndex;
        bool funded;
        mapping(address => bool) hasVoted;
       // mapping(address => bool) hasPaymentVoted;
    }

    function createProjectProposal(ProjectProposal storage proposal, string memory _ipfshash, uint _votedeadline, uint[] memory _paymentamounts, uint[] memory _payschedule, address _projectOwner) internal {
        proposal.ipfshash = _ipfshash;
        proposal.votedeadline = _votedeadline;
        proposal.paymentamounts = _paymentamounts;
        proposal.payschedule = _payschedule;
        proposal.projectOwner = _projectOwner;
        
        // Initialize votes and fundings
        proposal.yesVotes = 0;
        proposal.noVotes = 0;
        proposal.funded = false;
        proposal.nextPaymentIndex = 0;
    }

    function isFunded(ProjectProposal storage proposal) internal view returns (bool) {
        return proposal.funded;
    }
    
    function setNextPayment (ProjectProposal storage proposal) internal {
        proposal.nextPaymentIndex += 1;
    }
    function getNextPayment (ProjectProposal storage proposal)  internal view returns(uint) {
        return proposal.nextPaymentIndex ;
    }
}

// MyGov contract
contract MyGov is ERC20 {
    //Constant Costs
    uint public constant MYGOV_SUPPLY = 20000000 ; // 20 million MyGov tokens
    uint public constant USD_SUPPLY = 5000000; // 5 million USD tokens

    uint public constant PROPOSAL_USD_COST = 50; // USD stable coin cost for project proposals
    uint public constant PROPOSAL_COST = 5; // MYGOV cost for Proposal

    uint public constant SURVEY_USD_COST = 5; // USD stable coin cost for surveys
    uint public constant SURVEY_COST = 2; // MYGOV cost for Survey

    // important addresses
    address public owner;
    address public usdStableCoin;
   // address public contract_adress;
    address [] public  member_adress;


    using MyGovTokenLibrary for MyGovTokenLibrary.Member;
    using MyGovSurveyLibrary for MyGovSurveyLibrary.Survey;
    using MyGovProjectLibrary for MyGovProjectLibrary.ProjectProposal;

    // Arrays to store members
    mapping(address => MyGovTokenLibrary.Member) public members;
    
    // Array to store surveys
    MyGovSurveyLibrary.Survey[] public surveys;

    // Array to store project proposal
    MyGovProjectLibrary.ProjectProposal [] public proposals;

    // Faucet mapping
    mapping(address => bool) public hasReceivedTokenFromFaucet;

    // Variables
  
    uint public numberoffundedprojects;
    uint public totalnumberoftokens;
    uint public totalGrantedMoney;

    USDStableCoin usdcoin;
    

    constructor(uint256 tokenSupply) ERC20("MyGov", "MG") {
     
         // The amount in circulation cannot exceed 20 million
        require(tokenSupply <= MYGOV_SUPPLY); 

        // Initialization logic
        owner = msg.sender;

        _mint(msg.sender, tokenSupply);
        totalnumberoftokens = tokenSupply; // I tracked the amount of tokens in circulation

        // total coin 5 million usd coin
        usdcoin = new USDStableCoin(USD_SUPPLY, msg.sender);

        member_adress.push(msg.sender);
        
    }

    function _onlyOwner() private view {
        require(msg.sender == owner, "Caller is not the owner");
    }

    
            
    function _onlyMember() private view {
        require(balanceOf(msg.sender) >= 1, "Not a MyGov member");  
        
    }

    function validProjects(uint projectid ) private view {
         require(projectid < proposals.length, "Invalid project ID"); 
         
    }

    modifier onlyOwner() {
        _onlyOwner();
        _;
    }

    modifier onlyMember() {
        _onlyMember();
        _;
    }
    function checkMembership() onlyMember public  view returns (string memory) {
        return "MyGov member";
    }
    
    modifier notReceivedTokenFromFaucet() {
        require(!hasReceivedTokenFromFaucet[msg.sender], "Address has already received a token from the faucet");
        _;
    }



    function getMembersLength() public view returns(uint ) {
        uint counter = 0;

        for (uint i = 0; i < member_adress.length; i++) {
            if ( balanceOf(member_adress[i] ) >= 1  ) {
                counter++ ;
            }
          
            
        }
       
        return counter;

    }

    function donateUSD(uint256 amount)  public   {
        require(amount > 0, "Invalid donation amount");
        require (usdcoin.balanceOf(msg.sender) > amount , "There is not enough USD in your account");


        usdcoin.transfer( msg.sender , address(this), amount);

    }

    function donateMyGovToken(uint256 amount) public {
        // Implement the logic to accept donations in MyGov tokens
        // This involves transferring MyGov tokens from the sender to this contract
        // Make sure to handle any necessary approvals
         require(amount > 0, "Invalid donation amount");
         require(balanceOf(msg.sender) >= amount, "There is not enough token in your account");


        // Handle donation logic (e.g., transfer tokens to contract, update balances)
        transfer(address(this), amount);
        
       

    }

     // Members and nonmembers could see their balances    
    function myBalance()  public  view returns (uint) {
        uint mybalance = balanceOf(msg.sender ); 
        return mybalance;
    }
 

     // Members and nonmembers could see their USD stable coin balances  
    function USDBalance() public  view returns (uint) {
       // uint mybalance = ERC20(usdStableCoin).balanceOf(msg.sender ); 
       uint mybalance =usdcoin.balanceOf(msg.sender);
        return mybalance;
    }

    // Return Donation Balance of MyGov token
    function donationMyGOVBalance() public  view returns (uint) {
        uint mybalance = balanceOf(address(this) ); 
        return mybalance;
    }

    // Return Donation Balance of USD 
    function donationUSDBalance()  public  view returns (uint) {
        // uint mybalance = ERC20(usdStableCoin).balanceOf( address(this)  ); 
        uint mybalance = usdcoin.balanceOf(address(this) ); 
        return mybalance;
    }

    //Faucet function
    function faucet() public notReceivedTokenFromFaucet {
        
        // Checks for the owner of the contract, owners could not receive faucet
        require( !( owner==msg.sender) ,  "Contract owners could not receive faucet");

        //checks for the already received or not
        require(!hasReceivedTokenFromFaucet[msg.sender], "Already received token from faucet");

        require(totalnumberoftokens <= MYGOV_SUPPLY ) ;  // The amount in circulation cannot exceed 20 million

        _mint(msg.sender, 1);
        hasReceivedTokenFromFaucet[msg.sender] = true;
        totalnumberoftokens = totalnumberoftokens+1;  // one more token minted

        members[msg.sender].isMember = true;
        member_adress.push(msg.sender);
        
        // Every new member has the right to vote
        for (uint i = 0; i < proposals.length; i++) {
            members[msg.sender].voteBalances[i] = 1;
        }    

    }

    //Survey submission 
    // Submitting a survey ,only members can do it
    //Submittting Survey costs 2 MyGov tokens and 5 USD stable coin.
    function submitSurvey(string memory ipfshash,uint surveydeadline,uint numchoices, uint atmostchoice) public onlyMember returns (uint surveyid){
        require(balanceOf(msg.sender) > 2 , "Incorrect MyGov payment for survey");
        require(usdcoin.balanceOf(msg.sender) > 5 , "Incorrect USD payment for survey");
        require(bytes(ipfshash).length > 0, "Empty survey data ");
        
        // transfer survey costs
        usdcoin.transfer( msg.sender , address(this), SURVEY_USD_COST );  // USD transfer 5 amounts
        transfer(address(this), SURVEY_COST );   // MYGOV transfer 2 amounts

       // Create a new survey using the library
        surveyid = surveys.length;
        surveys.push();
        surveys[surveyid].createSurvey(msg.sender, ipfshash, block.timestamp + surveydeadline, numchoices, atmostchoice);
        
        return surveyid;
    }
    
    // Taking the survey, only members can do it
    function takeSurvey(uint surveyid,uint [] memory choices) public onlyMember {

        require(choices.length > 0 && choices.length <= surveys[surveyid].atMostChoice, "Invalid number of choices");
        require(block.timestamp <= surveys[surveyid].deadline, "Survey deadline passed");
        

        // Handle survey taking logic
        // Take the survey using the library
        surveys[surveyid].takeSurvey(choices);
       
    }


    // Function returns the results of the specific survey
    // Returns the results of the survey with the given id
    function getSurveyResults(uint surveyid) public view returns(uint numtaken, uint [] memory results){
        require(surveyid < surveys.length);
       // require(surveyid < surveys.length, "Invalid survey ID");
        
        numtaken = surveys[surveyid].numTaken;
        results = surveys[surveyid].results;
      

    }

   

    // Functions returns the survey info 
    function getSurveyInfo(uint surveyid) public view returns (string memory ipfshash, uint surveydeadline, uint numchoices, uint atmostchoice) {
        
        require(surveyid < surveys.length);
        // require(surveyid < surveys.length, "Invalid survey ID");
         return (
            surveys[surveyid].ipfshash,
            surveys[surveyid].deadline,
            surveys[surveyid].numChoices,
            surveys[surveyid].atMostChoice
        );
    }

    // Function returns owner of the survey
    function getSurveyOwner(uint surveyid) public view returns(address surveyowner){
        require(surveyid < surveys.length);
        // require(surveyid < surveys.length, "Invalid survey ID");
        return surveys[surveyid].owner;

    }

    //Function returns total number of survey
    function getNoOfSurveys() public view returns(uint numsurveys){
        return (surveys.length);
    }




     // Project functionality
    // struct ProjectProposal { address proposer; uint voteCount; uint deadline , bool executed , uint [] paymentamounts , uint [] payschedule; }
    // Submitting Project Proposal costs 5 MyGov tokens and 50 USD stable coin
    // votedeadline : how many seconds does the voting survive
    function submitProjectProposal(string memory ipfshash, uint votedeadline , uint [] memory paymentamounts, uint [] memory payschedule) onlyMember public returns (uint projectid){

        require(bytes(ipfshash).length > 0 );
        
        // require(bytes(ipfshash).length > 0, "Empty proposal data");
        // require(balanceOf(msg.sender) > 0, "You must be a MyGov token holder to submit a proposal");

        // transfer project costs
        donateMyGovToken(5); // submit project proposal costs: 5 MyGov tokens 
        donateUSD(50);  // submit project proposal costs: 50 USD stable coin

        // if the requirements is ok, now we could create a proposal
        projectid = proposals.length;
        proposals.push();

        // Update payschedule with block.timestamp + payschedule[i]
        for (uint i = 0; i < payschedule.length; i++) {
            payschedule[i] = block.timestamp + payschedule[i];
        }

        proposals[projectid].createProjectProposal( ipfshash, block.timestamp + votedeadline, paymentamounts, payschedule, msg.sender );
        
        // Every member has one votes for each proposal
        resetVotingBalances(projectid);
       
    }

    function resetVotingBalances (uint projectid) internal{
         
         // Setting every member voting balance to 1
        for (uint i = 0; i < member_adress.length; i++) {
            members[member_adress[i]].voteBalances[projectid] = 1 ;
        }

    }

    function resetVotingCounts (uint projectid) internal {
         proposals[projectid].yesVotes =0;
         proposals[projectid].noVotes = 0;

         // Setting proposal member votes to false
        for (uint i = 0; i < member_adress.length; i++) {
            proposals[projectid].hasVoted[member_adress[i]] = false ;
            
        }

    }



    // Returns project infos
    function getProjectInfo(uint activityid) public view returns(string memory ipfshash, uint votedeadline,uint [] memory paymentamounts, uint [] memory payschedule)
    {   
         require(activityid < proposals.length);
        //require(activityid < proposals.length, "Invalid survey ID");
         return (
            proposals[activityid].ipfshash,
            proposals[activityid].votedeadline,
            proposals[activityid].paymentamounts,
            proposals[activityid].payschedule
        );

    }

    // Returns project results
    function getProjectResults (uint activityid) public view returns(uint yesVoting, uint noVoting, uint nextPayment, bool funded)
    {
        require(activityid < proposals.length) ;
        //require(activityid < proposals.length, "Invalid survey ID");
         return (
            proposals[activityid].yesVotes,
            proposals[activityid].noVotes,
            proposals[activityid].nextPaymentIndex,
            proposals[activityid].funded
        );

    }


    // returns the exact time
    function getTimeStamp() public view returns(uint time) {
        return block.timestamp ;
    }

    // returns the total number of project proposal
    function getNoOfProjectProposals() public view returns(uint numproposals) {

        return proposals.length;
    }

    // retunrs the total number of funded projects
    function getNoOfFundedProjects () public view returns(uint numfunded){
        return  numberoffundedprojects;
    }

    //Returns true or false, according to proposal funded or not
    function getIsProjectFunded(uint projectid) public view returns(bool funded){
        return proposals[projectid].isFunded();
    }

    // Returns the project owner of the project
    function getProjectOwner(uint projectid) public view returns(address projectowner){
        validProjects(projectid);
        // require( projectid < proposals.length , "Invalid proposal ID");
        
        return proposals[projectid].projectOwner;

    }

      // Function to delegate vote to another member for a specific project
    function delegateVoteTo(address memberaddr, uint projectid) onlyMember public {
        
        // require(balanceOf(msg.sender) > 0, "You must be a MyGov token holder to vote");
        require(balanceOf(memberaddr) > 0);
        // require(balanceOf(memberaddr) > 0, "Delegate must have a MyGov token holder to vote");
        
        // require(projectid < proposals.length, "Invalid project ID");  // if there is not exist project
        validProjects(projectid);

        require(msg.sender != memberaddr, "Cannot delegate vote to yourself");


        // Check if the sender has already voted for the project
        require(!proposals[projectid].hasVoted[msg.sender], "Sender has already voted for this project");

        // Update the delegate address for the sender
        members[msg.sender].delegate = memberaddr;

        // Mark that the sender has voted for the project
        proposals[projectid].hasVoted[msg.sender] = true;

        // If the sender already had a delegate, decrease the vote count for the previous delegate
        // if (members[msg.sender].delegate != address(0)) {
        //     members[members[msg.sender].delegate].voteCount--;
        // }

         // Update the vote count for the target member
        members[memberaddr].voteBalances[projectid]= members[memberaddr].voteBalances[projectid] + members[msg.sender].voteBalances[projectid] ; 
        
        //Update the vote count for the sender
        members[msg.sender].voteBalances[projectid] = 0 ;
       
    }


    function votingMechanism( uint projectid,bool choice ,address sender ) internal {
        // Check if the sender is the delegate, if so, get the delegated address
        // address voter = (members[msg.sender].delegate == address(0)) ? msg.sender : members[msg.sender].delegate;
        address voter;
        if (members[sender].delegate == address(0) ){
            voter = sender ;
        }
        else{
            voter =members[sender].delegate;

        }

        // checks if the voter already voted for thsi proposal
        require(!proposals[projectid].hasVoted[voter], "You have already voted for this proposal");

        

        // If the voter is the delegate, use their vote count, otherwise, use 1
        uint voteCount =  members[voter].voteBalances[projectid];

        if (choice) {
            proposals[projectid].yesVotes  += voteCount;
        } else {
            proposals[projectid].noVotes += voteCount;
        }

        proposals[projectid].hasVoted[voter] = true;
    }



     // Members could vote only one time since they have only one votes
    // choice : could be true/false 
    function voteForProjectProposal(uint projectid,bool choice) onlyMember public{
        
       // require(balanceOf(msg.sender) > 0, "You must be a MyGov token holder to vote");
        //require(projectid < proposals.length, "Invalid project ID");
        require(projectid < proposals.length);


        //Checks for the project deadline
        require(block.timestamp <= proposals[projectid].votedeadline, "Proposal voting deadline passed");

        // Ensure the proposal has not been funded already
        require(! proposals[projectid].funded, "Project proposal is already funded");
        votingMechanism( projectid,choice ,msg.sender );

    } 

    // Function to calculate the grant USD amount based on the project's payment schedule
    function calculateGrantAmount(uint projectid) internal view returns (uint) {
        uint totalGrantAmount = 0;

        // Iterate through the payment schedule and calculate the total grant amount
        for (uint i = 0; i < proposals[projectid].payschedule.length; i++) {
            totalGrantAmount += proposals[projectid].paymentamounts[i];
        }

        return totalGrantAmount;
    }

    // Reserves USD money
    function reserveProjectGrant(uint projectid) public{
        
        //Invalid project id
        require(projectid < proposals.length , "Invalid project ID");


        // Ensure the sender is the project proposer
        require(msg.sender == proposals[projectid].projectOwner, "Only the project proposer can reserve the grant");

        // Ensure the proposal has not been funded already
        require(!proposals[projectid].funded, "Project proposal is already funded");

        // Ensure the proposal deadline has passed or within the 1 minute range of passing ( i think this like within 60 secs, project owner could take the grant) 
        require( ( block.timestamp >= proposals[projectid].votedeadline)  &&  ( block.timestamp <= proposals[projectid].votedeadline + 60 ) );
      

        // Ensure at least 1/10 of the members have voted yes
        require(proposals[projectid].yesVotes >=  getMembersLength() / 10, "Insufficient yes votes for funding");

        // Ensure there is sufficient USD stable coin amount in the MyGov contract
        require(donationUSDBalance() >= calculateGrantAmount(projectid), "Insufficient USD stable coin balance");

        totalGrantedMoney = totalGrantedMoney + calculateGrantAmount(projectid);

        // Mark the project as funded
        proposals[projectid].funded = true;
        numberoffundedprojects++;

        // reset the voting balances
        resetVotingBalances (projectid);

    }

// Returns the index of the next payment
    function getProjectNextPayment(uint projectid) public view returns(uint next){
         //Checks if the valid project id
        require(projectid < proposals.length );
        // Ensure the project is funded
        require(proposals[projectid].funded, "Project is not funded");

        // Ensure there are remaining payments to be withdrawn
        if (proposals[projectid].nextPaymentIndex < proposals[projectid].payschedule.length) {
            next = proposals[projectid].payschedule[ proposals[projectid].nextPaymentIndex ];
            
        } 
        /*
        else {
            next = -1; // Indicate that there are no more payments
        }
        */

        return next;
    }


    function voteForProjectPayment(uint projectid,bool choice) onlyMember  public{
        
        require(projectid < proposals.length, "Invalid project ID");

        //Checks for the project deadline
        require(block.timestamp > proposals[projectid].votedeadline, "Proposal voting deadline has not passed");

        // Ensure the proposal has been funded 
        require(proposals[projectid].funded, "Project proposal is not funded");

        votingMechanism( projectid, choice , msg.sender );

    }

    // Project ownner could withdraw the project payments
    function withdrawProjectPayment(uint projectid) onlyMember public  {

        //Checks valid project id
        require(projectid < proposals.length);
        
        // Ensure the project is funded
        require(proposals[projectid].funded, "Project is not funded");

        //Checks for the project payment time
        // uint deadlines = proposals[projectid].payschedule[proposals[projectid].nextPaymentIndex];
        uint deadlines =  getProjectNextPayment(projectid);
         
        // Proposal voting for payment deadline has passed within 60 secs
        require( block.timestamp > deadlines  &&  block.timestamp <= deadlines +60 ,"passed");


        // Ensure the sender is the project owner
        require(msg.sender == proposals[projectid].projectOwner, "Only the project owner can withdraw payments");

        

        // Ensure at least 1/100 of the members have voted yes for project payments
        require(proposals[projectid].yesVotes >= getMembersLength()  / 100, "Insufficient yes votes for project payments");

        // Ensure there are remaining payments to be withdrawn
        
        require(proposals[projectid].nextPaymentIndex < proposals[projectid].payschedule.length, "No more payments to withdraw");
        

        // Calculate the amount to be withdrawn based on the payment schedule
        uint amountToWithdraw = proposals[projectid].paymentamounts[ proposals[projectid].nextPaymentIndex ];

        // Ensure there is sufficient USD stable coin amount in the MyGov contract
        require(donationUSDBalance() >= amountToWithdraw, "Insufficient USD stable coin balance for payment");

        // Transfer the payment amount to the project owner
        usdcoin.transfer( address(this), msg.sender , amountToWithdraw );

        proposals[projectid].payedAmount += amountToWithdraw;

         // Increment the next payment index
        proposals[projectid].nextPaymentIndex++ ;

    }

    // Returns the total payment to the project
    function getUSDReceivedByProject (uint projectid) public view returns(uint amount){
        return proposals[projectid].payedAmount;
    }

 



}





    



// USDStableCoin contract here
// USD STABLE COIN
contract USDStableCoin is ERC20 {

    address contractAdress;

    // Constructor: Initialize the USD stable coin with a name, symbol, and total supply
    constructor(uint256 totalSupply, address owner) ERC20("USD Stable Token", "USD" ) {
        _mint(owner , totalSupply);
    }

    function getContractAdress()  public view returns (address) {
           return address(this) ;
    }

    // Overriden transfer function
    function transfer(address sender, address to, uint256 value) public  returns(bool) {
        address owner = sender;
        _transfer(owner, to, value);
        return true;

    } 
      
}