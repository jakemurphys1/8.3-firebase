var $ = require("jquery");
var Firebase = require("firebase")
  //$(".messageContainer").hide();

$(function(){

  $.fn.serializeObject = function() {
  return this.serializeArray().reduce(function(acum, i) {
    acum[i.name] = i.value;
    return acum;
  }, {});
};

//set up accounts
var ref = new Firebase("https://jakeinput.firebaseio.com/");
$("#signin").submit(function(event){
event.preventDefault();

ref.createUser({
  email    : $("#signupEmail").val(),
  password : $("#signupPassword").val()
}, function(error, userData) {
  if (error) {
    console.log("Error creating user:", error);
  } else {
    $("#signupPassword").val("");
    $("#signupEmail").val("");
    console.log("Successfully created user account with uid:", userData.uid);
  }
});
});
var auth;
var name="";

//log in
$("#login").submit(function(event){
  event.preventDefault();
      var $form = $(this);
      var formData = $form.serializeObject();

      ref.authWithPassword(formData, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
          $("#loginPassword").val("");
          $("#loginEmail").val("");
        } else {
          console.log("Authenticated successfully with payload:", authData);
          name=$("#loginEmail").val()
          $("#loginPassword").val("");
          $("#loginEmail").val("");
          auth = authData.token;
          $(".messageContainer").show();
            $("#login").hide();
              $("#signin").hide();
        }
      });
});

//enter message

$("#messageForm").submit(function(event){
  event.preventDefault();
  var text=$("#message").val();
  if(name=="" || text==""){
    console.log("no name")
    return;
  }

//ref.set('User ' + name + ' says ' + text);
ref.push({name: name, text: text,auth:auth});
});


//receieve message
ref.on('child_added', function(snapshot) {

  var message = snapshot.val();
$(".textContainer").append("<p class='emailName'>Name: " + message.name + "</p><p class='msgtext'>" + message.text + "</p>")
});


})
