



function DashMenu (id) {
  let dashboardbody = document.getElementById("dashboardbody");

  bodyrequest = new Request("/dashboard/" + id, initGet);
  myFetch(bodyrequest, dashboardbody);

  if (id === "dash-products") {
    // this allows me to run the table init procedure after the table has loaded
    setTimeout(InitProductsManager, 1000);
  // InitProductsManager()
  }else if (id === "dash-category") {
    setTimeout(InitCategoryManager, 1000);
  }else if (id === "dash-chat") {
    setTimeout(InitChannelsManager, 1000);
  }else if (id === "dash-contacts") {
    setTimeout(InitContactMessages, 1000);
  }else if (id === "dash-payments") {
    setTimeout(InitPaymentsList, 1000);
  }else if (id === "dash-orders") {
    setTimeout(InitOrdersList, 1000);
  }else if (id === "dash-clients") {
    setTimeout(InitClientsManager, 1000);
  }
}

/**
 * functions to build tables on forms
 * @param id
 * @constructor
 */
// payments-list-table, orders-list-table

function InitClientsManager () {
  $("#clients-list-table").DataTable({
    "paging": true,
    "lengthChange": true,
    "searching": true,
    "ordering": true,
    "info": true,
    "autoWidth": true
  })
}

function InitOrdersList () {
  $("#orders-list-table").DataTable({
    "paging": true,
    "lengthChange": true,
    "searching": true,
    "ordering": true,
    "info": true,
    "autoWidth": true
  })
}

function InitPaymentsList () {
  $("#payments-list-table").DataTable({
    "paging": true,
    "lengthChange": true,
    "searching": true,
    "ordering": true,
    "info": true,
    "autoWidth": true
  })
}
function InitContactMessages () {
  $("#contact-list-table").DataTable({
    "paging": true,
    "lengthChange": true,
    "searching": true,
    "ordering": true,
    "info": true,
    "autoWidth": true
  })
}

function InitProductsManager () {
  $("#products-list-table").DataTable({
    "paging": true,
    "lengthChange": true,
    "searching": true,
    "ordering": true,
    "info": true,
    "autoWidth": true
  })
}

function InitCategoryManager () {
  $("#category-list-table").DataTable({
    "paging": true,
    "lengthChange": true,
    "searching": true,
    "ordering": true,
    "info": true,
    "autoWidth": true
  })
}
// channel-list-table
function InitChannelsManager () {
  $("#channel-list-table").DataTable({
    "paging": true,
    "lengthChange": true,
    "searching": true,
    "ordering": true,
    "info": true,
    "autoWidth": true
  })
}

function SubDashMenu (id) {
  console.log(id);

  let dashboardbody = document.getElementById("dashboardbody");

  route_list = id.split("-");
  console.log(route_list[0]);
  console.log(route_list[1]);

  let mydata = "&route=" + route_list[0] + "&id=" + route_list[1];

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
  }

  let bodyrequest = new Request("/dashboard/" + route_list[0], myInit);
  myFetch(bodyrequest, dashboardbody);
}

/**
 *
 * used to resize images
 * @param settings
 * @returns {Promise}
 */

let resizeImage = function (settings) {
    let file = settings.file;
    let maxSize = settings.maxSize;
    let reader = new FileReader();
    let image = new Image();
    let canvas = document.createElement("canvas");
    let dataURItoBlob = function (dataURI) {
        let bytes = dataURI.split(",")[0].indexOf("base64") >= 0 ?
            atob(dataURI.split(",")[1]) :
            unescape(dataURI.split(",")[1]);
        let mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
        let max = bytes.length;
        let ia = new Uint8Array(max);
        for (let i = 0; i < max; i++)
            ia[i] = bytes.charCodeAt(i);
        return new Blob([ia], { type: mime });
    };
    let resize = function () {
        let width = image.width;
        let height = image.height;
        if (width > height) {
            if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
            }
        } else {
            if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
            }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(image, 0, 0, width, height);
        let dataUrl = canvas.toDataURL("image/jpeg");
        return dataURItoBlob(dataUrl);
    };
    return new Promise(function (ok, no) {
        if (!file.type.match(/image.*/)) {
            no(new Error("Not an image"));
            return;
        }
        reader.onload = function (readerEvent) {
            image.onload = function () { return ok(resize()); };
            image.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
    });
};



let admin_product_form = function ()
{
  this.product_name = document.getElementById("productnameid");
  this.description = document.getElementById("productdescriptionid");
  this.category = document.getElementById("productcategoryid");
  this.uom = document.getElementById("uomid");
  this.cost_price = document.getElementById("costpriceid");
  this.selling_price = document.getElementById("sellingpriceid");
  this.product_image = document.getElementById("file");


  this.get_product_name = function (){
    return (!isEmpty(this.product_name.value) && (this.product_name.value.length > 3)) ? this.product_name.value : "";
  };

  this.get_product_decription = function (){
    return  (!isEmpty(this.description.value) && (this.description.value.length > 12)) ? this.description.value : "";
  };

  this.get_product_category = function (){
    return (!isEmpty(this.category.value) && (this.category.value.length > 3)) ? this.category.value : "";
  };

  this.get_product_uom = function (){
    return isEmpty(this.uom.value) ? "": this.uom.value;
  };

  this.get_cost_price = function (){
    return !isEmpty(this.cost_price.value) &&  parseInt(this.cost_price.value) > 0 ? this.cost_price.value : "";
  };

  this.get_selling_price = function (){
    return !isEmpty(this.selling_price.value) && (parseInt(this.selling_price.value) > 0) ? this.selling_price.value : "";
  };

  this.get_product_image_data = function (){
    if (!isEmpty(this.product_image)){

      let imagefile = this.product_image.files[0];

      return imagefile;

    }

  };

  this.isErrors = function(formresponse){
    let this_error = false;
    if (this.get_product_name() === ""){
      this.product_name.parentNode.classList.add("has-error");
      this_error = true;
      formresponse.innerHTML = `there is an error on product name field <br>`;
    }
    if (this.get_product_decription() === ""){
      this.description.parentNode.classList.add("has-error");
      this_error = true;
      formresponse.innerHTML += `there is an error on the product description field <br>`;
    }

    if (this.get_product_category() === ""){
      this.category.parentNode.classList.add("has-error");
      this_error = true;
      formresponse.innerHTML += `there is an error on the product category field <br>`;
    }
    if (this.get_product_uom() === ""){
      this.uom.parentNode.classList.add("has-error");
      this_error = true;
      formresponse.innerHTML += `there is an error on the UOM field <br>`;
    }
    if (this.get_cost_price() === ""){
      this.cost_price.parentNode.classList.add("has-error");
      this_error = true;
      formresponse.innerHTML += `there is an error on the cost price field <br>`;
    }
    if (this.get_selling_price() === ""){
      this.selling_price.parentNode.classList.add("has-error");
      this_error = true;
      formresponse.innerHTML += `there is an error on the selling price field <br>`;
    }

    return this_error;

  };

};

function SaveProduct () {

  let product_form = new admin_product_form();
  let formresponse = document.getElementById("formresponseinf");

  if (!product_form.isErrors(formresponse)) {
      let image_url = "appdata/products/" + product_form.get_product_category() + "/" + product_form.get_product_name() + "." + product_form.get_product_image_data().name.split(".").pop();
      let storageRef = firebase.storage().ref(image_url);
      let uploader = document.getElementById("progressbar");

      resizeImage({
          file:product_form.get_product_image_data(),
          maxSize: 100
      }).then(function(resizedImage){

          let task = storageRef.put(resizedImage);

          task.on("state_changed",

              function progress(snapshot){
                uploader.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                image_url = snapshot.downloadURL;
              },

              function error(err){
                console.log(err);
                formresponse.innerHTML = err.message;
              },

              function complete(){
                formresponse.innerHTML = "product image successfully uploaded";
                uploader.value = 100;
                //image_url = snapshot.downloadURL;
                console.log("THIS IS AN IMAGE URL : " + image_url)

              }
              );


      });



      let route = "dash-save-product";
      let mydata = "&route=" + route + "&product-name=" + product_form.get_product_name() + "&product-description=" + product_form.get_product_decription() +
          "&product-filename=" + product_form.get_product_image_data().name + "&product-image-url=" + image_url + "&product-category=" + product_form.get_product_category() +
          "&product-price=" + product_form.get_selling_price() + "&product-cost=" + product_form.get_cost_price() + "&uom=" + product_form.get_product_uom();

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

      let myrequest = new Request("/dashboard/"+ route,myInit);
      myFetch(myrequest,formresponse);
  }else{
    formresponse.innerHTML += "there where errors processing the form <br>";
  }


}



let admin_category_form = function () {
  this.name = document.getElementById("categorynameid");
  this.description = document.getElementById("categorydescription");
  this.image_file = document.getElementById("categoryimageid");


  this.get_category_name = function (){
    return (!isEmpty(this.name.value)) ? this.name.value : "";
  };
  this.get_category_description = function (){
    return (!isEmpty(this.description.value)) ? this.description.value : "";
  };
  this.get_image_file = function (){
    return (!isEmpty(this.image_file.files[0].name)) ? this.image_file.files[0] : "";
  };

  this.isErrors = function(formresponse){
    let this_errors = false;
    if (this.get_category_name() === ""){
      this.name.parentNode.classList.add("has-error");
      this_errors = true;
      formresponse.innerHTML = `there is an error on category name field <br>`;
    }
    if (this.get_category_description() === ""){
      this.description.parentNode.classList.add("has-error");
      this_errors = true;
      formresponse.innerHTML += `there is an error on category description field <br>`;
    }

    if (this.get_image_file() === "") {
      this.image_file.parentNode.classList.add("has-error");
      this_errors = true;
      formresponse.innerHTML += `there is an error on category image field <br>`;
    }

    return this_errors

  }

}


function SaveCategory () {
  let category_form = new admin_category_form();
  let formresponse = document.getElementById("formresponseinf");


 if (!category_form.isErrors(formresponse)){
    let image_url = "appdata/categories" + "/" + category_form.get_category_name() + "." + category_form.get_image_file().name.split(".").pop();
    let storageRef = firebase.storage().ref(image_url);
    let uploader = document.getElementById("progressbarid");

    resizeImage({
        file:category_form.get_image_file(),
        maxSize: 100
    }).then(function(resizedImage){
        let task = storageRef.put(resizedImage).then(snapshot => {
          image_url = snapshot.downloadURL;
        });
        task.on("state_changed",

            function progress(snapshot){
              uploader.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              image_url = snapshot.downloadURL;
            },

            function error(err){
              console.log(err);
              formresponse.innerHTML = err.message;
            },

            function complete(){
              formresponse.innerHTML = "category image successfully uploaded";
              uploader.value = 100;
              console.log("uploaded image url : " + image_url)
            }

            )

    });

    let route = "dash-save-category";

    let mydata = "&route=" + route + "&category-name=" + category_form.get_category_name() +
        "&category-description=" + category_form.get_category_description() +
        "&image-url=" + thisdownloadURL;
    //note download url is now a complete url

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

      let myrequest = new Request("/dashboard/"+ route,myInit);
      myFetch(myrequest,formresponse);
  }else{
    formresponse.innerHTML += "there where errors processing the form <br>";
  }

}

function handleFileSelect(evt) {
  console.log(evt);
    let files = evt.files; // FileList object


    let output = [];
    for (let i = 0, f; f = files[i]; i++) {
      output.push("<li><strong>", escape(f.name), "</strong> (", f.type || "n/a", ") - ",
                  f.size, " bytes, last modified: ",
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : "n/a",
                  "</li>");
    }
    document.getElementById("list").innerHTML = "<ul>" + output.join("") + "</ul>";
  }
/**
 *
 * function to load a single category from a category list
  * @param image_url
 */

function loadThisCategory(myid){
  let route = "load-this-category";
  let mydata = "&route=" + route + "&id=" + myid;

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

  let formresponse = document.getElementById("dashboardbody");
  let myrequest = new Request("/dashboard/"+ route,myInit);
  myFetch(myrequest,formresponse);

}


/**
 * function to load product information on product list
 *
 * @param image_url
 */

function loadThisProduct(myid){
  let route = "load-this-product";
  let mydata = "&route=" + route + "&id=" + myid;

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

  let formresponse = document.getElementById("dashboardbody");
  let myrequest = new Request("/dashboard/"+ route,myInit);
  myFetch(myrequest,formresponse);
}


//used to display images on admin

function showCategoryImage(){
  image_url = document.getElementById("imageurl").value;
  console.log(image_url);

  let storage = firebase.storage();
  let storageRef = storage.ref();
  let tangRef = storageRef.child(image_url);
  console.log(image_url);
  tangRef.getDownloadURL().then(function(url)
        {
           console.log(url);
            let ctx = document.getElementById("categoryimageid").getContext("2d");
            let img = new Image();
            img.onload = function(){

              ctx.canvas.width = img.width;
              ctx.canvas.height = img.height;

              ctx.drawImage(img,0,0);
            };
            img.src = url;
        }).catch(function(error) {
          console.error(error.message);
        });
}

function showProductImage(){
  image_url = document.getElementById("imageurl").value;
  console.log(image_url);

  let storage = firebase.storage();
  let storageRef = storage.ref();
  let tangRef = storageRef.child(image_url);
  console.log(image_url);

  tangRef.getDownloadURL().then(function(url)
        {
           console.log(url);
            let ctx = document.getElementById("productimageid").getContext("2d");
            let img = new Image();
            img.onload = function(){

              ctx.canvas.width = img.width;
              ctx.canvas.height = img.height;

              ctx.drawImage(img,0,0);
            };
            img.src = url;
        }).catch(function(error) {
          console.error(error.message);
        });
}

