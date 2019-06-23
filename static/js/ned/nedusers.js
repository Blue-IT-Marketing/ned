

let isDevelopment = document.domain === "localhost";

let userCredentials = function () {
  this.names = "";
  this.email = "";
  this.photourl = "";
  this.userid = "";
  this.signedin = false;


  this.IsSignedIn = function () {
    try{
      this.signedin = (firebase.auth().currentUser.uid === this.userid);
    }catch (err){
     console.log(err.message);
    };

      return !isDevelopment ? this.signedin : isDevelopment;
  };

  this.Get_Userid = function () {
    try {
        this.userid = firebase.auth().currentUser.uid;
    }catch (err){
      return this.userid;
    }
    return this.userid;
  };

  this.Get_Names = function () {
    try{
      this.names = firebase.auth().currentUser.displayName;
    }catch(err){
      return this.names;
    }
    return this.names;
  };

  this.Get_Email = function () {
    try{
      this.email = firebase.auth().currentUser.email;
    }catch(err){
      return this.email;
    }

    return this.email;
  };
  this.Get_photourl = function () {
    try{
      this.photourl = firebase.auth().currentUser.photoURL;
    }catch(err){
      return this.photourl;
    }
    return this.photourl;
  };

  this.send_user_verification = function(user){

    user.sendEmailVerification().then(function () {
      console.log("verification email sent");
    }).catch(function (err) {
      console.log("error sending verification email " + err.message);
        /** consider removing this user **/
        //check if error is due to an invalid email address
        //if this is the case then delete the user
    });

  };

}

let UserCredentials = new userCredentials();
// Initialize Firebase Replace this with ned media variables



/***
 *
 * firebase initialize
 */

function initApp () {
  // Listening for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function (user) {
    // [START_EXCLUDE silent]

    // [END_EXCLUDE]
    if (user) {
      // User is signed in.
      UserCredentials.names = user.displayName;
      UserCredentials.email = user.email;
      UserCredentials.photourl = user.photoURL;
      UserCredentials.userid = user.uid;
      UserCredentials.signedin = true;
    }else {
      // User is signed out.
      UserCredentials.names = "";
      UserCredentials.email = "";
      UserCredentials.photourl = "";
      UserCredentials.userid = "";
      UserCredentials.signedin = isDevelopment;

    };
  });
};

initApp();

/**
 *
 * Handler for login a user
 */

let login_form = function(){
  this.email = document.getElementById("username");
  this.password = document.getElementById("password");

  this.get_email = function(){
    return (validateEmail(this.email.value)) ? this.email.value : "";
  };
  this.get_password = function(){
    return (validatePassword(this.password.value)) ? this.password.value : "";
  };

  this.isErrors = function(formresponse){
    let this_errors;
    this_errors = false;
    if (this.get_email() === ""){
      this.email.parentNode.classList.add("has-error");
      formresponse.innerHTML = `there is an error on the email / username field <br>`;
      this_errors = true;
    }
    if (this.get_password() === ""){
      this.password.parentNode.classList.add("has-error");
      formresponse.innerHTML += `there is an error on the password field <br>`;
      this_errors = true;
    }
    return this_errors;
  };

};


function loginUser () {
  this.formresponse = document.getElementById("loginresponseinf");
  this.loginform  = new login_form();

  if (!this.loginform.isErrors(this.formresponse)) {
    const auth = firebase.auth();
    const myrequest = auth.signInWithEmailAndPassword(this.loginform.get_email(), this.loginform.get_password());
    myrequest.then(function (response) {
        this.formresponse.innerHTML = `User successfully logged in`;
    }).catch(function (err) {
      this.formresponse.innerHTML = `There was an error login error : ` + err.message;
    });
  }else {
    this.formresponse.innerHTML = `<strong>Error with your username password</strong>`;
    console.log("Error with username and password");
  }
}

/***
 * Handler for creating new users
 *
 * @constructor
 */

let new_user_form = function (){
  this.names = document.getElementById("names");
  this.email = document.getElementById("username");
  this.password = document.getElementById("password");
  this.pass2 = document.getElementById("pass2");

  this.get_names = function (){
    return (!isEmpty(this.names.value)) ? this.names.value : "";
  };
  this.get_email = function (){
    return (validateEmail(this.email.value)) ? this.email.value: "";
  };
  this.get_password = function (){
    return (validatePassword(this.password.value) && (this.password.value === this.pass2.value)) ? this.password.value : "";
  };

  this.isErrors = function (formresponse){
    let this_errors = false;
    if (this.get_names() === ""){
        this.names.parentNode.classList.add("has-error");
        formresponse.innerHTML = `there is an error on the names field <br>`;
        this_errors = true;
    }

    if (this.get_email() === ""){
      this.email.parentNode.classList.add("has-error");
      formresponse.innerHTML += `there is an error on the email / username field <br>`;
      this_errors = true;
    }

     if (this.get_password() === ""){
      this.password.parentNode.classList.add("has-error");
      formresponse.innerHTML += `there is an error on the password field or passwords do not match <br>`;
      this_errors = true;
     }

     return this_errors;
  }
}


function CreateNewUser () {

  this.newuserform = new new_user_form();
  this.formresponse = document.getElementById("formresponseinf");

  if (!this.newuserform.isErrors(this.formresponse)) {

    const auth = firebase.auth();

    let thispromise = auth.createUserWithEmailAndPassword(this.newuserform.get_email(),this.newuserform.get_password());

    thispromise.then(function (user) {

        let userid = user.uid;
        let route = "new-user";
        let mydata = "&route=" + route + "&names=" + this.newuserform.get_names() + "&password=" + this.newuserform.get_password() + "&email=" + this.newuserform.get_email() + "&userid=" + userid;
        let myInit = {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                redirect: "follow",
                mode: "cors",
                credentials: "same-origin",
                cache: "no-cache",
                body: mydata
        };
        let myrequest = new Request("/nav/" + route,myInit);
        myFetch(myrequest,this.formresponse);

    }).catch(function (err) {
       this.formresponse.innerHTML += `error creating users, ` + err.message ;
    });

  let this_user = firebase.auth().currentUser;
  //updating user profile with the submitted names field
  this_user.updateProfile({
      displayName: this.newuserform.get_names(),
      photoURL: ""
  }).then(function() {
    console.log("user successfully updated")
  }).catch(function(error) {
  console.log("user cant be updated")
  });

  this_user.sendEmailVerification().then(function() {
      console.log("verification email sent")
    }).catch(function(error) {
      console.log("error sending verification email ");
      /**  - consider removing this user */
    });

  }else {
    // please add error indication here
    this.formresponse.innerHTML += "Error with username and password";
  }
}

/**
 *
 * singout user;
 * @constructor
 */

function Singout(){
    let formresponse  = document.getElementById("formresponseinf");

    firebase.auth().signOut().then(function(response){
        console.dir(response);
    }).catch(function(err){
        console.log("there was an error signing out : " + err.message)
    });

    formresponse.innerHTML = `User logged out`;

}

function deleteUser(this_user){

  this_user.delete().then(function() {
      return true;
  }).catch(function(error) {
    console.log("while deleting a user " + this_user + " there was an error : " +  error)
    return false;
  });

}


function sendPasswordResetEmail(emailAddress){
  let auth = firebase.auth()
  auth.sendPasswordResetEmail(emailAddress).then(function() {
    return true;
  }).catch(function(error) {
      console.log("error sending password resent email")
     return false;
  });

}



/**
 *
 *
 * Submit Contact Us Form Messages function
 */

let contactFormMessages = function () {
  this.names = document.getElementById("namesid");
  this.cell = document.getElementById("cellid");
  this.email = document.getElementById("emailid");
  this.subject = document.getElementById("subjectid");
  this.body = document.getElementById("bodyid");

  this.Get_Names = function () {
    return (!isEmpty(this.names.value)) ? this.names.value : "";
  }

  this.Get_Cell = function () {
    return isCell(this.cell.value) ? this.cell.value : "";
  }
  this.Get_Email = function () {
    return validateEmail(this.email.value) ? this.email.value : "";
  }
  this.Get_Subject = function () {
    return !isEmpty(this.subject.value) && (this.subject.value.length > 3) ? this.subject.value : "";
  }
  this.Get_Body = function () {
    return !isEmpty(this.body.value) && (this.body.value !== "Message") && (this.body.value.length > 3) ? this.body.value : "";
  }

  this.IsErrors = function (formresponse) {
    let thisError = false;

    if (this.Get_Names() === "") {
      thisError = true;
      this.names.parentNode.classList.add("has-error");
      formresponse.innerHTML = `there is an error on the names field <br>`;
    }else{
      this.names.parentNode.classList.remove("has-error");
    }
    if (this.Get_Cell() === "") {
      thisError = true;
      this.cell.parentNode.classList.add("has-error");
      formresponse.innerHTML += `there is an error on the cell field <br>`;
    }else{
      this.cell.parentNode.classList.remove("has-error");
    }
    if (this.Get_Email() === "") {
      thisError = true;
      this.email.parentNode.classList.add("has-error");
      formresponse.innerHTML += `there is an error on the email field <br>`;
    }else{
      this.email.parentNode.classList.remove("has-error");
    }

    if (this.Get_Subject() === "") {
      thisError = true;
      this.subject.parentNode.classList.add("has-error");
      formresponse.innerHTML += `there is an error on the subject field <br>`;
    }else{
      this.subject.parentNode.classList.remove("has-error");
    }

    if (this.Get_Body() === "") {
      thisError = true;
      this.body.parentNode.classList.add("has-error");
      formresponse.innerHTML += `there is an error on the body field <br>`;
    }else{
      this.body.parentNode.classList.remove("has-error");
    }

    return thisError;
  }
}

function submitcontacts () {
  let thisMessages = new contactFormMessages();
  let formresponse = document.getElementById("formresponseinf");

  if (thisMessages.IsErrors(formresponse) === false) {
    let route = "contacts";
    let mydata = "&names=" + thisMessages.Get_Names() + "&cell=" + thisMessages.Get_Cell() + "&email=" + thisMessages.Get_Email() + "&subject=" + thisMessages.Get_Subject() + "&body=" + thisMessages.Get_Body();
    let myInit = {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      redirect: "follow",
      mode: "cors",
      credentials: "same-origin",
      cache: "no-cache",
      body: mydata
    };
    let myrequest = new Request("/" + route, myInit);
    myFetch(myrequest, formresponse);
  }else {
    console.log("there where errors processing the form");
  }
}

/**
 *
 * Save Settings function
 *
 * @constructor
 */

let userSettings = function () {
  this.delivery_options = document.getElementById("deliveroptions");
  this.payment_options = document.getElementById("paymentoptions");

  this.noty_method_email = document.getElementById("email");
  this.noty_method_sms = document.getElementById("sms");
  this.noty_method_phone = document.getElementById("phone");

  this.noty_subject_projects = document.getElementById("noteprojects");
  this.noty_subject_delivery = document.getElementById("delivery");
  this.noty_subject_payments = document.getElementById("payments");
  this.noty_subject_promotions = document.getElementById("promotions");

  this.get_delivery_options = function () {
    if (UserCredentials.IsSignedIn() === true) {
      return this.delivery_options.value;
    }else {
      return undefined;
    }
  };

  this.get_payment_options = function () {
    if (UserCredentials.IsSignedIn() === true) {
      return this.payment_options.value;
    }else {
      return undefined;
    }
  };

  this.get_noty_method_email = function () {
    if (UserCredentials.IsSignedIn() === true) {
      return this.noty_method_email.checked;
    }else {
      return undefined;
    }
  };

  this.get_noty_method_sms = function () {
    if (UserCredentials.IsSignedIn() === true) {
      return this.noty_method_sms.checked;
    }else {
      return undefined;
    }
  };

  this.get_noty_method_phone = function () {
    if (UserCredentials.IsSignedIn() === true) {
      return this.noty_method_phone.checked;
    }else {
      return undefined;
    }
  };

  this.get_noty_subject_projects = function () {
    if (UserCredentials.IsSignedIn() === true) {
      return this.noty_subject_projects.checked;
    }else {
      return undefined;
    }
  };

  this.get_noty_subject_delivery = function () {
    if (UserCredentials.IsSignedIn() === true) {
      return this.noty_subject_delivery.checked;
    }else {
      return undefined;
    }
  };

  this.get_noty_subject_payments = function () {
    if (UserCredentials.IsSignedIn() === true) {
      return this.noty_subject_payments.checked;
    }else {
      return undefined;
    }
  };

  this.get_noty_subject_promotions = function () {
    if (UserCredentials.IsSignedIn() === true) {
      return this.noty_subject_promotions.checked;
    }else {
    }
  }
};

function SaveSettings () {
  let UserSettings = new userSettings();

  let route = "";
  let mydata = "";
  if (UserCredentials.IsSignedIn()) {
    route = "settings";
    let useraction = "save";
    mydata = "&useraction=" + useraction + "&route=" + route + "&userid=" + UserCredentials.userid + "&names=" + UserCredentials.names + "&email=" + UserCredentials.email +
    "&photourl=" + UserCredentials.photourl + "&deliveryoptions=" + UserSettings.get_delivery_options() + "&paymentoptions=" + UserSettings.get_payment_options() +
    "&methodemail=" + UserSettings.get_noty_method_email() + "&methodsms=" + UserSettings.get_noty_method_sms() + "&methodphone=" + UserSettings.get_noty_method_phone() +
    "&subjectprojects=" + UserSettings.get_noty_subject_projects() + "&subjectdelivery=" + UserSettings.get_noty_subject_delivery() + "&subjectpayments=" + UserSettings.get_noty_subject_payments() +
    "&subjectpromotions=" + UserSettings.get_noty_subject_promotions();
  }else {
    route = "login";
    mydata = "&route=" + route;
  }
  let myInit = {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    redirect: "follow",
    mode: "cors",
    credentials: "same-origin",
    cache: "no-cache",
    body: mydata
  };

  let myrequest = new Request("/nav/" + route, myInit);
  myFetch(myrequest, body);
}

/***
 *
 *
 * Profile functions and event handlers below
 *
 *
 *
 *
 */

let userDetails = function () {
  this.names = document.getElementById("names");
  this.cell = document.getElementById("cell");
  this.email = document.getElementById("email");
  this.website = document.getElementById("website");

  this.getNames = function () {
    return UserCredentials.IsSignedIn() === true ? (!isEmpty(this.names.value) && (this.names.value.length >= 3)) ? this.names.value : "" : undefined;
  };
  this.getCell = function () {
    return UserCredentials.IsSignedIn() === true ? !isEmpty(this.cell.value) && ((this.cell.value.length >= 10) && (this.cell.value.length <= 13)) ? this.cell.value : "" : undefined;
  };
  this.getEmail = function () {
    return UserCredentials.IsSignedIn() === true ? validateEmail(this.email.value) ? this.email.value : "" : undefined;
  };
  this.getWebsite = function () {
    return UserCredentials.IsSignedIn() === true ? isUrl(this.website.value) ? this.website.value : "" : undefined;
  };

  this.isErrors = function (formresponse) {
    let myerror = false;
    if ( (this.getNames() === "")) {
      this.names.parentNode.classList.add("has-error");
      formresponse.innerHTML += `<small>there is an error with names field</small> <br>`;
      this.names.classList.add("has-error");
      myerror = true;
    }
    if ( (this.getCell() === "")) {
      this.cell.parentNode.classList.add("has-error");
      formresponse.innerHTML += `<small>there is an error with cell field</small> <br>`;
      this.cell.classList.add("has-error");
      myerror = true;
    }

    if ( (this.getEmail() === "")) {
      this.email.parentNode.classList.add("has-error");
      formresponse.innerHTML += `<small>there is an error with email field</small> <br>`;
      this.email.classList.add("has-error");
      myerror = true;
    }

    return myerror;
  }
}

let postalAddress = function (formresponse) {
  this.box = document.getElementById("box");
  this.city = document.getElementById("city");
  this.province = document.getElementById("province");
  this.code = document.getElementById("postalcode");

  this.getBox = function () {
    if (UserCredentials.IsSignedIn() === true) {
      return !isEmpty(this.box.value) ? this.box.value : "";
    }else {
      return undefined;
    }
  };
  this.getCity = function () {
    if (UserCredentials.IsSignedIn() === true) {
      return (!isEmpty(this.city.value) && (this.city.value.length >= 2)) ? this.city.value : "";
    }else {
      return undefined;
    }
  };
  this.getProvince = function () {
    if (UserCredentials.IsSignedIn() === true) {
      return isProvince(this.province.value.toLowerCase()) ? this.province.value : "";
    }else {
      return undefined;
    }
  }
  this.getCode = function () {
    if (UserCredentials.IsSignedIn() === true) {
      return !isEmpty(this.code.value) ? this.code.value : "";
    }else {
      return undefined;
    }
  };

  this.isErrors = function (formresponse) {
    let myerror = false;
    if (this.getBox() === "") {
      this.box.parentNode.classList.add("has-error");
      formresponse.innerHTML += `<small>there is an error on the box field</small> <br>`;
      this.box.classList.add("has-error");
      myerror = true
    }

    if (this.getCity() === "") {
      this.city.parentNode.classList.add("has-error");
      formresponse.innerHTML += `<small> there is an error on the postal address city field</small><br>`;
      this.city.classList.add("has-error");
      myerror = true;
    }

    if (this.getProvince() === "") {
      this.province.parentNode.classList.add("has-error");
      formresponse.innerHTML += `<small>there is an error on the postal address province field</small><br>`;
      this.province.classList.add("has-error");
      myerror = true;
    }

    if (this.getCode() === "") {
      this.code.parentNode.classList.add("has-error");
      formresponse.innerHTML += `<small>there is an error on the postal address postal code field</small><br>`;
      this.code.classList.add("has-error");
      myerror = true;
    }
    return myerror;
  }
};

let physicalAddress = function () {
  this.stand = document.getElementById("standnumber");
  this.street = document.getElementById("streetname");
  this.city = document.getElementById("physicalcity");
  this.province = document.getElementById("physicalprovince");
  this.code = document.getElementById("physicalcode");

  this.getStand = function () {
    if (UserCredentials.IsSignedIn() === true) {

      return !isEmpty(this.stand.value) ? this.stand.value : "";
    }else {
      return undefined;
    }
  };

  this.getStreet = function () {
    if (UserCredentials.IsSignedIn() === true) {
      return ((!isEmpty(this.street.value)) && (this.street.value.length >= 2)) ? this.street.value : "";
    }else {
      return undefined;
    }
  };

  this.getCity = function () {
    if (UserCredentials.IsSignedIn() === true) {
      return ((!isEmpty(this.city.value)) && (this.city.value.length >= 2)) ? this.city.value : "";
    }else {
      return undefined;
    }
  };
  this.getProvince = function () {
    if (UserCredentials.IsSignedIn() === true) {
      return (isProvince(this.province.value.toLowerCase())) ? this.province.value : "";
    }else {
      return undefined;
    }
  };
  this.getCode = function () {
    if (UserCredentials.IsSignedIn() === true) {
      return (!isEmpty(this.code.value)) ? this.code.value : "";
    }else {
      return undefined;
    }
  };

  this.isErrors = function (formresponse) {
    let thiserror = false;

    if (this.getStand() === "") {
      this.stand.parentNode.classList.add("has-error");
      formresponse.innerHTML += `<small>there is an error on the stand field </small> <br>`;
      this.stand.classList.add("has-error");
      thiserror = true;
    }

    if (this.getStreet() === "") {
      this.street.parentNode.classList.add("has-error");
      formresponse.innerHTML += `<small> there is an error on the street name field</small><br>`;
      this.street.classList.add("has-error");
      thiserror = true;
    }

    if (this.getCity() === "") {
      this.city.parentNode.classList.add("has-error");
      formresponse.innerHTML += `<small> there is an error on the physical address city name field</small><br>`;
      this.city.classList.add("has-error");
      thiserror = true;
    }

    if (this.getProvince() === "") {
      this.province.parentNode.classList.add("has-error");
      formresponse.innerHTML += `<small>there is an error on the physical address province field</small><br>`;
      this.province.classList.add("has-error");
      thiserror = true;
    }

    if (this.getCode() === "") {
      this.code.parentNode.classList.add("has-error");
      formresponse.innerHTML += `<small>there is an error on the physical address postal code field</small><br>`;
      this.code.classList.add("has-error");
      thiserror = true;
    }
  }
}

function PersonalDetailForm () {
  let thiserror = false;
  let formresponse = document.getElementById("formresponseinf");
  let UserDetails = new userDetails();
  let PostalAddress = new postalAddress();
  let PhysicalAddress = new physicalAddress();

  let route = "";
  let mydata = "";
  let useraction = "save";

  formresponse.innerHTML = ``;
  if (UserCredentials.IsSignedIn()) {
    route = "profile";
    useraction = "save";
    mydata = "&useraction=" + useraction + "&route=" + route + "&userid=" + UserCredentials.userid + "&names=" + UserDetails.getNames() +
    "&email=" + UserDetails.getEmail() + "&cell=" + UserDetails.getCell() + "&photourl=" + UserCredentials.photourl + "&website=" + UserDetails.getWebsite() +
    "&box=" + PostalAddress.getBox() + "&city=" + PostalAddress.getCity() + "&province=" + PostalAddress.getProvince() +
    "&postalcode=" + PostalAddress.getCode() + "&stand=" + PhysicalAddress.getStand() + "&street=" + PhysicalAddress.getStreet() +
    "&physicalcity=" + PhysicalAddress.getCity() + "&physicalprovince=" + PhysicalAddress.getProvince() + "&physicalcode=" + PhysicalAddress.getCode();

  let myInit = {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    redirect: "follow",
    mode: "cors",
    credentials: "same-origin",
    cache: "no-cache",
    body: mydata
  };
  if (!UserDetails.isErrors(formresponse) && !PostalAddress.isErrors(formresponse) && !PhysicalAddress.isErrors(formresponse)) {
    let myrequest = new Request("/nav/" + route, myInit);
    myFetch(myrequest, formresponse);
  }else {
    formresponse.innerHTML += "there are errors on the form";
  }

  }else {
      formresponse.innerHTML += "You might not be currently logged in please login again";
  }

}

/**
 * run add funds this will return a panel with functionality for adding funds to the account
 *
 * @constructor
 */

function AddFunds () {
  /**
   * return add funds to body tag
   */
  console.log("add funds is clicked");
}

/***
 * functions that deals with two factor auth
 * @constructor
 */

function SendCode () {
  let route = "";
  let mydata = "";

  if (UserCredentials.IsSignedIn()) {
    route = "/create-two-factor";
    mydata = "&route=" + route;
  }else {
    route = "/login";
    mydata = "&route=" + route;
  }
  let myInit = {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    redirect: "follow",
    mode: "cors",
    credentials: "same-origin",
    cache: "no-cache",
    body: mydata
  };
  let formresponse = document.getElementById("twofactorinf");
  let myrequest = new Request(route, myInit);
  myFetch(myrequest, formresponse);
}

function ActivateCode () {
  let route = "";
  let mydata = "";
  let smscode = document.getElementById("smscode").value;

  if (UserCredentials.IsSignedIn()) {
    route = "/activate-two-factor";
    mydata = "&route=" + route + "&smscode=" + smscode;
  }else {
    route = "/login";
    mydata = "&route=" + route;
  }

  let myInit = {
    method: "post",
    headers:{
              "Content-Type": "application/x-www-form-urlencoded"
    },
    redirect: "follow",
    mode: "cors",
    credentials: "same-origin",
    cache: "no-cache",
    body: mydata
    };

  let formresponse = document.getElementById("twofactorinf");
  let myrequest = new Request(route, myInit);
  myFetch(myrequest, formresponse);
}
