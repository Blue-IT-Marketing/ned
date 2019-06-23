try {
  let config =
  {
    apiKey: "AIzaSyB5JgHEyb8grbjNzhVYuQJZ1RgGfV4WmME",
    authDomain: "ned-media.firebaseapp.com",
    databaseURL: "https://ned-media.firebaseio.com",
    projectId: "ned-media",
    storageBucket: "ned-media.appspot.com",
    messagingSenderId: "712381800707"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }else {
  }
} catch (err) {
  console.log(err.message);
}




let headerrequest = new Request("/nav/header", initGet);
let sidebarrequest = new Request("/nav/sidebar", initGet);
let bodyrequest = new Request("/nav/home", initGet);
let header = document.getElementById("headernavid");
let sidebar = document.getElementById("sidebarnavid");
let body = document.getElementById("pageid");
/** fetch the header **/
myFetch(headerrequest, header);
/** fetch the sidebar **/
myFetch(sidebarrequest, sidebar);
/** fetch the footer **/
myFetch(bodyrequest, body);

/**
 * fetch Menu Items that can be accessed without auth
 * @param id
 * @constructor
 */

function Menu (id) {
  console.log(id);

  if (id === "home"){
    setInterval(image_triggers(),2000);
  }

  let menubodyrequest = new Request("/nav/" + id, initGet);

  myFetch(menubodyrequest, body);
}

/**
 *
 * Menu handlers for urls requiring Auth
 * @param id
 * @constructor
 */

function OnAuthMenu (id) {
  /***
   * load the auth parameters and then send them with the request
   * or respond with a login screen if user not logged in
   */
  let mydata = "";
  let useraction = "read";
  if (UserCredentials.signedin) {
    mydata = "&useraction=" + useraction + "&route=" + id + "&userid=" + UserCredentials.userid + "&names=" + UserCredentials.names +
    "&email=" + UserCredentials.email + "&photourl=" + UserCredentials.photourl;
  }else {
    mydata = "&route=" + "login";
    id = "login";

  }

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

  // console.log(mydata)
  // console.log(myInit)
  // console.log(id)



  let bodyrequest = new Request("/nav/" + id, myInit);
  myFetch(bodyrequest, body);
}



function showCategoryImagePublic(image_url,tag_id){
    let storage = firebase.storage();
    let storageRef = storage.ref();
    let tangRef = storageRef.child(image_url);

    // First we sign in the user anonymously
    firebase.auth().signInAnonymously().then(function() {
      // Once the sign in completed, we get the download URL of the image
      tangRef.getDownloadURL().then(function(url)                             {
        // Once we have the download URL, we set it to our img element

        document.getElementById(tag_id).src = url;

      }).catch(function(error) {
        // If anything goes wrong while getting the download URL, log the error
        console.error(error.message);
      });
    });
}

function showProductImagePublic(tag){
    let imageid = "imageurl-" + tag.id;
    let image_url = document.getElementById(imageid).value;
    let storage = firebase.storage();
    let storageRef = storage.ref();
    let tangRef = storageRef.child(image_url);

    // First we sign in the user anonymously
    firebase.auth().signInAnonymously().then(function() {
      // Once the sign in completed, we get the download URL of the image
      tangRef.getDownloadURL().then(function(url)                             {
        // Once we have the download URL, we set it to our img element
        //
        //     //let ctx = document.getElementById(tag_id).getContext("2d");
        //     let img = new Image();
        //     // img.onload = function(){
        //     //
        //     //   ctx.canvas.width = img.width;
        //     //   ctx.canvas.height = img.height;
        //     //
        //     //   ctx.drawImage(img,0,0);
        //     // };
        //     img.src = url;
        //

        document.getElementById(tag.id).src = url;
      }).catch(function(error) {
        // If anything goes wrong while getting the download URL, log the error
        console.error(error.message);
      });
    });
}
function image_triggers(){
  my_images = document.getElementsByTagName("img");

  for (i = 0; i < my_images.length; i++){
    if (my_images[i].src.indexOf("ned") !== -1){
      console.log(my_images[i]);
      my_images[i].click();
    }
  }

  console.log("ITS RUNNING");
}
document.body.style.zoom = "80%";
