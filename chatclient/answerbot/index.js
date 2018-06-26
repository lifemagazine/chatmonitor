/* AnswerBot is a stupid bot created by Deni Spasovski */
var answerBot = function () {
    var _this = this;
    _this.processInput = function (text) {
        console.log('query => ' + query);
		// updateUrl(text);
        // var _result = "<p class='answerbot-input'>" + text + "</p>";
        text = text.replace(new RegExp("[^a-zA-Z ]", "g"), " ");
        text = text.replace(new RegExp("[ ]{2,}", "g"), " ");
        var _words = text.toLowerCase().split(" ");
        var _answers = [];
        // var _title = "";
        if (_words.length === 0 || _words.toString() === '') { //if the input is empty
            _answers = _this.specialContext.emptyInput;
            _title = _this.specialContext.emptyInput;
        } else {
            var _possibleAnswers = findMatches(_words);
            if (_possibleAnswers.length === 0) { //if no answer found
                _answers = _this.specialContext.wrongInput;
                // _title = _this.specialContext.wrongInput;
            }
            if (_possibleAnswers.length == 1) { //context recognized
                _answers = _this.answers[_possibleAnswers[0]].values;
                // _title = _this.answers[_possibleAnswers[0]].description;
            }
            if (_possibleAnswers.length > 1) {
                _result += formatText(_this.specialContext.rephrase, _this.specialContext.rephrase);
                for (var i = 0; i < _possibleAnswers.length; i++) {
                    _result += formatText(_this.answers[_possibleAnswers[i]].description, _this.answers[_possibleAnswers[i]].description);
                }
            }
        }
        // if (_answers.length > 0) {
        //     var _rand = Math.floor((Math.random() - 0.001) * _answers.length);
        //     _result += formatText(_answers[_rand], _title);
        // }
        return _result;
    };

    function formatText(text, title) {
        return text;
    }
    // function formatText(text, title) {
    //     return "<p class=\'answerbot-ai\' title=\'" + title + "\'>" + text + "</p>";
    // }

    function findMatches(words) {
        var foundKeywords = [];
        var _possibleAnswers = [];
        for (var i = 0; i < _this.keywords.length; i++) {
            foundKeywords[i] = 0;
            for (var j = 0; j < words.length; j++) {
                if (_this.keywords[i].keys.indexOf(words[j]) >= 0) {
                    foundKeywords[i]++;
                    if (foundKeywords[i] == _this.keywords[i].keys.length) {
                        return [_this.keywords[i].value];
                    }
                }
            }
            if (foundKeywords[i] * 2 > _this.keywords[i].keys.length) {
                _possibleAnswers.push(_this.keywords[i].value);
            }
        }
        return _possibleAnswers.filter(function (elem, pos) {
            return _possibleAnswers.indexOf(elem) == pos;
        });
    }
	
	// function updateUrl(text){
	// 	history.pushState(null, null, "#question=" + encodeURIComponent(text));
	// 	if(typeof ga === "function")//google analytics
	// 		ga('send', 'event', 'question', text);
	// }
};


if (answerBot) {
    answerBot.prototype.specialContext = {
        "wrongInput": ["I don't understand you.", "Could you rephrase the question?"],
        "emptyInput": ["Please say something", "Speak louder", "Well i can't read minds."],
        "rephrase": ["Can you tell me if your question was about one of the following things:"]
    };

    answerBot.prototype.keywords = [
        { "keys": ["hi"], "value": 0 },
        { "keys": ["hello"], "value": 0 },
        { "keys": ["life", "universe", "everything"], "value": 1 },
        { "keys": ["software", "development"], "value": 2 },
        { "keys": ["software", "engineering"], "value": 2 },
        { "keys": ["software", "sales"], "value": 3 },
        { "keys": ["whatever", "sales"], "value": 3 }];

    answerBot.prototype.answers = [
        {
            "description": "Did you mean hello?",
            "values": ["I'm good how are you?", "Hi how can I help you today?"]
        },
        {
            "description": "The answer to life the universe and everything?",
            "values": ["42!"]
        },
        {
            "description": "What is software development?",
            "values": ["Programming! Do you speak it?"]
        },
        {
            "description": "What is sales?",
            "values": ["Cashing out!"]
        }
    ];
}

if (answerBot) {
    answerBot.prototype.specialContext = {
        "wrongInput": ["I don't understand you.", "Could you rephrase the question?"],
        "emptyInput": ["Please say something", "Speak louder", "Well i can't read minds."],
        "rephrase": ["Can you tell me if your question was about one of the following things:"]
    };

    answerBot.prototype.keywords = [
        { "keys": ["hi"], "value": 0 },
        { "keys": ["hello"], "value": 0 },
        { "keys": ["life", "universe", "everything"], "value": 1 },
        { "keys": ["software", "development"], "value": 2 },
        { "keys": ["software", "engineering"], "value": 2 },
        { "keys": ["who", "made", "you"], "value": 3 },
        { "keys": ["who", "wrote", "you"], "value": 3 },
        { "keys": ["who", "coded", "you"], "value": 3 },
        { "keys": ["is", "this", "real", "life"], "value": 4 },
        { "keys": ["who", "is", "deni"], "value": 5 },
        { "keys": ["tell", "me", "about", "deni"], "value": 5 },
        { "keys": ["tell", "me", "about", "author"], "value": 5 },
        { "keys": ["show", "me", "author"], "value": 5 },
        { "keys": ["can", "see", "source"], "value": 6 },
        { "keys": ["can", "see", "sourcecode"], "value": 6 },
        { "keys": ["show", "me", "code"], "value": 6 },
        { "keys": ["how", "are", "you"], "value": 7 },
        { "keys": ["who", "is", "this"], "value": 8 }];

    answerBot.prototype.answers = [
        {
            "description": "Hi!",
            "values": ["Hello there!", "Hi how can I help you today", "Hi! What brings you here?"]
        },
        {
            "description": "What is the answer to life the universe and everything?",
            "values": ["42"]
        },
        {
            "description": "What is software development?",
            "values": ["Programming! Do you speak it?"]
        },
        {
            "description": "Who created me?",
            "values": ["I was created by another <a href='http://about.me/deni' target='_blank'>bot</a>.", "The question is who sent you here?"]
        },
        {
            "description": "Is this real life?",
            "values": ["No this is the internetz!", "Find out <a href='http://www.youtube.com/watch?v=txqiwrbYGrs' target='_blank'>yourself</a>!"]
        },
        {
            "description": "Who is Deni?",
            "values": ["This is his <a href='https://plus.google.com/+DeniSpasovski/' target='_blank'>G+ profile</a>.", "This is his <a href='www.linkedin.com/in/denispasovski' target='_blank'>Linkedin profile</a>."]
        },
        {
            "description": "Where is your source?",
            "values": ["Here is the <a href='https://github.com/denimf/Answer-bot' target='_blank'>source</a>."]
        },
        {
            "description": "How are you?",
            "values": ["I'm good how are you?"]
        },
        {
            "description": "Who is this?",
            "values": ["StackOverflow Exception occurred", "The question is who are you?"]
        }
        ];
}

var _answerBot = new answerBot();

exports.AnswerBot = _answerBot;