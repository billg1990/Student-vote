ElectionsReview = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    var activeElection = Election.getActive();
    var activeBallot = Ballot.getActive();
    //console.log(JSON.stringify(activeBallot));
    return {
      election: activeElection,
      ballot: activeBallot,
    };
  },
  render: function() {
    var election = this.data.election;
    var ballot = this.data.ballot;
    var questionNodes = [];
    var choiceMapFunction = function(choice, pick, last ) {
      if (pick){
        return(
          <div className="light-green-bg">
            <div className="green-bg">
              <h2 className="centered-container">{choice.name}</h2>
            </div>
            <div className="centered-container">
              <ElectionsChoiceImage choice={choice} />
              <p className="body-text">{choice.description}</p>
              <a className="large-button" href={Router.path("electionsVote", {slug: election.slug, questionIndex: i}) }>Change</a>
            </div>
          </div>
        );
      }
      else{
        return(
          <div className="light-green-bg">
            <div className="centered-container">
              <h2 className="rank-review-text" id="one">1.</h2>
              <RankReviewChoiceImage choice={choice} />
              <h2 className="rank-review-text" id="two">{choice.name}</h2>
              {last ? <a className="large-button" href={Router.path("electionsVote", {slug: election.slug, questionIndex: i}) }>Change</a> : null}
            </div>
          </div>
          )
      }
    };
    for (var i = 0, length = election.questions.length; i < length; i++) {
      var question = election.questions[i];
      var isValid = ballot.validate(i);
      var classNames = React.addons.classSet({
        valid: isValid,
        invalid: !isValid
      });
      var selectedChoices = ballot.selectedChoices(i);
      var selectedChoicesNodes = [];
      for (var j = 0; j < selectedChoices.length; j++){
        selectedChoicesNodes.push(choiceMapFunction(selectedChoices[j], question.options.type=="pick", j==selectedChoices.length-1));
      }
      // if (selectedChoicesNodes.length === 0)
      //   selectedChoicesNodes = (
      //     <div>
      //       <h3>No Option Selected</h3>
      //     </div>
      //   );
      questionNodes.push(
        <div className="light-blue-bg">
          <div className="centered-container" id="question-container">
            <h2>{question.name}</h2>
          </div>
          {isValid ?
            null :
            <div className="incomplete-bg">
              <div className="centered-container">
                <h2>question not complete</h2>
                <a className="large-button" href={Router.path("electionsVote", {slug: election.slug, questionIndex: i}) }>Change</a>
              </div>
            </div>
          }
          {selectedChoicesNodes}
        </div>
      );
    }
    return(
     <div id="review-screen">
        <div className="header white-bg">
          <a className="header-exit" href={Router.path("home")}>
            {"< "}Exit
          </a>
          {election.name}
          <a className="header-help" href={Router.path("help")}>
            Get Help
          </a>
        </div>
        <div className="deep-blue-bg">
          <h2>Please review your ballot</h2>
        </div>
        <div>
          {questionNodes}
        </div>
        <ElectionsFooter ballot={ballot} election={election} questionIndex={-1} />
      </div>
    );
  }
});
