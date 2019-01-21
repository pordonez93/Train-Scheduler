var config = {
    apiKey: "AIzaSyDUYr4bUBa1ehEReyR-dQsXNCyy7rJSUiA",
    authDomain: "train-scheduler-1ef20.firebaseapp.com",
    databaseURL: "https://train-scheduler-1ef20.firebaseio.com",
    projectId: "train-scheduler-1ef20",
    storageBucket: "train-scheduler-1ef20.appspot.com",
    messagingSenderId: "632221294811"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  $("#submit").on("click", function(event){
        event.preventDefault();

        var trnName = $("#train-input").val().trim();
        var trnDestination= $("#destination-input").val().trim();
        var trnStart = moment($("#start-input").val().trim(), "HH:mm").format("HH:mm");
        var trnFrequency = $("#frequency-input").val().trim();
        var newTrain = {
            name: trnName,
            destination: trnDestination,
            start: trnStart,
            frequency: trnFrequency
        };
        database.ref().push(newTrain);

        $("#train-input").val("");
        $("#destination-input").val("");
        $("#start-input").val("");
        $("#frequency-input").val("");
  });

database.ref().on("child_added", function(childSnapshot){
    console.log(childSnapshot.val());

    var trnName = childSnapshot.val().name;
    var trnDestination = childSnapshot.val().destination;
    var trnStart = childSnapshot.val().start;
        trnStart = moment(trnStart, "HH:mm").subtract(1, "years");
    var trnFrequency = childSnapshot.val().frequency;
    var trnRemainder = moment().diff(moment(trnStart), "minutes") % trnFrequency;
    var minAway = trnFrequency - trnRemainder;
    // Calculate the arrival time
    var nxtArrival = moment().add(minAway, "minutes").format("hh:mm A");

    var newRow = $("<tr>").append(
        $("<td>").text(trnName),
        $("<td>").text(trnDestination),
        $("<td>").text(trnFrequency),
        $("<td>").text(nxtArrival),
        $("<td>").text(minAway),
    );
    $("#train-table > tbody").append(newRow);
});