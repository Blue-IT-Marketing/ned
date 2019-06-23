
//*****************************************************

// Checkout Payments Processings

let CheckoutPayments = function (){

    this.present_event_handler = undefined;
    this.deposit_amount = undefined;
    this.payment_method = undefined;
    this.document_response = undefined;



    this.load_company_account = function(){
        const route = "load-company-account-details";
        let mydata = "&route=" + route + "&userid=" + UserCredentials.Get_Userid();

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

        let company_account_request = new Request("/cart", myInit);
        let company_account_response_form = document.getElementById('companyaccountdetailsform');

        myFetch(company_account_request,company_account_response_form);
    };

    this.load_bank_account = function(){
        const route = "select-bank";
        const bank = document.getElementById('select-bank').value;
        let mydata = "&route=" + route + "&bank=" + bank + "&userid=" + UserCredentials.Get_Userid();
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
        let bank_details_request = new Request('/cart', myInit);
        let bank_details_form_response = document.getElementById('bank-details-form-response');
        myFetch(bank_details_request,bank_details_form_response);
    };

    this.change_addfunds_form_route = function () {
        this.payment_method = document.getElementById('paymentmethod');
        this.document_response = document.getElementById('addfundsresponseform');


        if (this.present_event_handler){
            document.getElementById('getpaymentdetailsbutt').removeEventListener("click",this.present_event_handler);
        }
        if (this.payment_method.value === "eft"){
            document.getElementById('getpaymentdetailsbutt').addEventListener("click",Payments.eft_route);
            //language=HTML
            document.getElementById('getpaymentdetailsbutt').innerHTML = `<strong>Make EFT Payment</strong>`;
            document.getElementById('getpaymentdetailsbutt').classList.remove('hidden');

            this.present_event_handler = Payments.eft_route;

            //Launch EFT Payment Form

            //language=HTML
            this.document_response.innerHTML = `
                <div class="panel-default">
                    <div class="panel-heading">
                        <h4 class="panel-title"> <strong> <i class="fa fa-bank"> </i> EFT Payments</strong></h4>
                    </div>
                    
                    <div class="panel-body">
                        
                        <div id="companyaccountdetailsform"></div>
                        
                    </div>
                </div>
                                       
            `;

            this.load_company_account();


        }else if (this.payment_method.value === "directdeposit"){
            document.getElementById('getpaymentdetailsbutt').addEventListener("click",Payments.direct_deposit_route);
            document.getElementById('getpaymentdetailsbutt').innerHTML = `<strong>Make Direct Deposit Payment</strong>`;
            document.getElementById('getpaymentdetailsbutt').classList.remove('hidden');
            //hidden

            this.present_event_handler = Payments.direct_deposit_route;

            //Launch Direct Deposit Payment Form
            //language=HTML
            this.document_response.innerHTML = `
                <div class="panel-default">
                    <div class="panel-heading">
                        <h4 class="panel-title"> <strong> <i class="fa fa-bank"> </i> Direct Deposits</strong></h4>
                    </div>
                    
                    <div class="panel-body">
                        
                        <div id="companyaccountdetailsform"></div>
                        
                    </div>
                </div>
                                       
            `;

            this.load_company_account();


        }else if (this.payment_method.value === "paypal"){
            document.getElementById('getpaymentdetailsbutt').addEventListener("click",Payments.paypal_route);
            document.getElementById('getpaymentdetailsbutt').innerHTML = `<strong> <i class="fa fa-paypal"> </i> Pay with PayPal</strong>`;
            document.getElementById('getpaymentdetailsbutt').classList.remove('hidden');
            document.getElementById('getpaymentdetailsbutt').setAttribute("type","submit");
            let nextElem = document.getElementById('getpaymentdetailsbutt').nextElementSibling;
            nextElem.insertBefore('</form');



            this.present_event_handler = Payments.paypal_route;

            //Launch PayPal Payment Form
            //language=HTML
            this.document_response.innerHTML = `
                <div class="panel-default">
                    <div class="panel-heading">
                        <h4 class="panel-title"> <strong> <i class="fa fa-cc-paypal"> </i> PayPal </strong></h4>
                    </div>
                        <div class="panel-body with-border">
                            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                                <input type="hidden" name="cmd" value="_s-xclick">
                                <input type="hidden" name="hosted_button_id" value="VSQQ2JGXPP8F2">
                                
                                
                                
                                <input type="hidden" name="on0" value="Deposit Amounts">
                                <div class="form-group input-group">
                                    <span class="input-group-addon"> <strong>Deposit Amount R</strong> </span>      
                                    <input type="number" name="os0" class="form-control" value="">
                                    <span class="input-group-addon">.00</span>
                                </div>    
                                    
                                <input type="hidden" name="currency_code" id="currency_code" value="ZAR">
   
                                
                                
                          
                            
                            
                            <script>
                            </script>
                        
                        </div>
                                         
                        
                    
                    
                </div>
            `;


        }else if(this.payment_method.value === "payfast"){
            document.getElementById('getpaymentdetailsbutt').addEventListener("click",Payments.payfast_route);
            document.getElementById('getpaymentdetailsbutt').innerHTML = `<strong>Pay with PayFast</strong>`;
            document.getElementById('getpaymentdetailsbutt').classList.remove('hidden');

            this.present_event_handler = Payments.payfast_route;
            //Launch PayFast Payment Form
            //language=HTML
            this.document_response.innerHTML = `
                <div class="panel-default">
                    <div class="panel-heading">
                        <h4 class="panel-title"> <strong> <i class="fa fa-cc-amex"> </i> PayFast</strong></h4>
                    </div>
                </div>
            `;
        }
    };

    // route handlers

    this.verify_deposit_amount = function(){
        this.document_response = document.getElementById('addfundsresponseform');
        this.deposit_amount = document.getElementById('depositamount');
        if ((this.deposit_amount.value > mycart.total_price()) && (this.deposit_amount.value < 100) ){
            this.document_response = `Deposit Amount is not acceptable`;
            return false;
        }
        return true;
    };

    this.eft_route = function(){
        console.log("EFT event handler");
        if (this.verify_deposit_amount()){
            //send sms with account information
            //send email with account information
            //display account information on page in printable format...
            console.log("display account information on page in printable format...");
        }
    };

    this.direct_deposit_route = function(){
        console.log("Direct Deposit Event Handler");
        if (this.verify_deposit_amount()){
            //send sms with account information
            //send email with account information
            //display account information on page in printable format...
            console.log("display account information on page in printable format...");
        }

    };
    this.paypal_route = function(){
        console.log("PayPal Event Handler");
        if (this.verify_deposit_amount()) {
            //redirect user to paypal payment processing screen
            //setup redirect handler for paypal callback
            console.log("display paypal payment screen");
        }
    };

    this.payfast_route = function(){
        console.log("Payfast Event Handler");
        this.deposit_amount = document.getElementById('depositamount');
    };
};


let Payments = new CheckoutPayments();



// ***************************************************
// Shopping Cart functions

let ItemDimensions = function(product_code,width,height)
    {
        this.product_code = product_code;
        this.width = width;
        this.height = height;
    };


let item_paper = function (product_code,paper_type,paper_size) {
    /**
     * standard type
     * gloss
     *
     */
        this.product_code = product_code;
        this.paper_type = paper_type;
        this.paper_size = paper_size;

    };


let Cartitem = function (product_code,name,price,count){

    this.product_code = product_code;
    this.name = name;
    this.price = price;
    this.count = count;

    this.has_dimensions = false;
    this.dimensions = undefined;

    this.paper_properties = false;
    this.paper = undefined;
};

Cartitem.prototype.add_product_dimensions = function (width,height) {

    this.dimensions = new ItemDimensions(this.product_code,width,height);
    this.has_dimensions = true;
    return true;

};

Cartitem.prototype.add_paper = function(paper_type,paper_size){
    this.paper = new item_paper(this.product_code,paper_type,paper_size);
    this.paper_properties = true;
    return true;
};




Cartitem.prototype.update_item_price_with_dimensions = function(){
  /** taking dimensions into account update item price*/

  /** unit dimension 100 X 100 = 1000 **/


    if (!this.has_dimensions){return false;}

    this.price = this.price *  ((this.dimensions.width * this.dimensions.height)/1000);

    return true;

  /** - ok now please recalculate the price taking into account the extra dimensions **/
};

Cartitem.prototype.update_item_price_with_papersize = function(){
    /** paper sizes
     * A0,A1,A2,A3,A4,A5,A6,A7,A8,A9,A10,A11,A12
     */

    if (!this.paper_properties){return false;}

    let multiplier = this.paper.paper_size.replace("A","");
    multiplier = parseInt(multiplier) - 12;

    this.price = this.price * multiplier;
};


Cartitem.prototype.update_item_price_with_paper_type = function(){
    /***
     * Standard Paper
     * Gloss
     */

    if (!this.paper_properties){return false}

    let paper_properties_list = ["standard","hard","gloss"];

    let multiplier = paper_properties_list.indexOf(this.paper.paper_type);

    multiplier += 1;

    this.price = this.price * multiplier;

};


let Shoppingcart = function (){

    this.cart = [];
    this.cart_name = "ned-media-cart";

    this.userid = ""; // to enable system to save more than one cart in one system


    this.savecart = function(){
        localStorage.setItem(this.cart_name,JSON.stringify(this.cart));
    };

    this.loadcart = function () {
        this.cart = JSON.parse(localStorage.getItem(this.cart_name));
        if (this.cart === null){
            this.cart = [];
        }

    };

    //i need to make sure loadcart is called on initialization

    this.add_item_to_cart = function(product_code,name,price,count){

        let added = false;

        count = parseInt(count);
        price = parseInt(price);

        if (!(count > 0) || !(price > 0)){
            return false;
        }

        this.cart.forEach(function(item){
            if (item.product_code === product_code){
                item.count = parseInt(item.count) + count;
                this.savecart();
                added = true;
            }
        },this);


        if (added){return added}


        let item = new Cartitem(product_code,name,price,count);
        this.cart.push(item);
        this.savecart();

        return true;
    };


    this.item_set_count = function(product_code,count){
        this.cart.forEach(function (item) {
            if (item.product_code === product_code){
                item.count = parseInt(count);
            }
        });
        this.savecart();
    };

    this.remove_one_item_from_cart = function (product_code) {


            this.cart.forEach(function (item) {
                if (item.product_code === product_code){
                    item.count = parseInt(item.count) - 1;
                    if (item.count === 0){
                        this.cart.splice(i,1);

                    }
                }
            },this);
        this.savecart();
    };


    this.remove_item_from_cart = function(product_code){

        this.cart.forEach(function(item){
            if (item.product_code === product_code){
                this.cart.splice(i,1);
            }
        },this);

        this.savecart();
    };


    this.clear_cart = function(){
        this.cart = [];
        this.savecart();

        return true;
    };

    this.total_count = function(){
        let total_count = 0;
        this.cart.forEach(function(item){
            total_count = total_count + parseInt(item.count);
        });
        return total_count;
    };

    this.total_price = function(){
        let total_price = 0;
        this.cart.forEach(function(item){
            total_price += item.price * item.count;
        });

        return total_price.toFixed(2);
    };

    this.return_cart_list = function(){
        // language=HTML
        let cart_list = `
        <table class="table table-bordered table-hover table-striped">  
            <thead>
                <tr>
                    <td>Product</td>
                    <td>Items</td>
                    <td>Price</td>
                    <td>Total</td>
                </tr>
            </thead>
            <tbody>    
            `;

        this.cart.forEach(function(item){
            // language=HTML
            cart_list += `<tr>
                            <td><a id="${item.product_code}" onclick="EditCartItem(this.id)" role="button"><small><strong title="Edit Cart Items to set dimensions Quantity and Paper Size">${item.name}</strong></small></a></td>  
                            <td> <small>${item.count}</small></td> 
                            <td><small>R ${item.price}</small></td> 
                            <td><small>R ${item.count * item.price}</small></td>
                          </tr>`;
        });
        // language=HTML
        cart_list += `
        </tbody>
        </table>
        `;

        return cart_list;
    };

    this.return_main_cart_list = function (){
        let cart_list = `<div class="panel-default" id="accordion">`;

        this.cart.forEach(function(item){

            // language=HTML
            cart_list += `<div class="panel panel-default">  
                            <div class="panel-heading">
                                <h4 class="panel-title"> <a data-toggle="collapse" data-parent="#accordion" href="#${item.product_code}" role="button" class="fa-external-link-square"> <strong>${item.name }</strong></a></h4>
                            </div>                    
                                <div id="${item.product_code}" class="panel-collapse collapse">
                                    <div class="panel-body">                        
                                        <table class="table table-bordered table-hover table-striped">  
                                            <thead>
                                                <tr>
                                                    <td><strong>Product</strong></td>
                                                    <td><strong>Items</strong></td>
                                                    <td><strong>Price</strong></td>
                                                    <td><strong>Total</strong></td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>${item.name}</td>
                                                    <td>${item.count}</td>
                                                    <td>${item.price}</td>
                                                    <td>${item.count * item.price}</td>                                               
                                                </tr>                                           
                                            </tbody>                                               
                                        </table>    
                                        
                                        <div class="panel-body">
                                            <div class="panel-heading">
                                                <h4 class="panel-title"> <strong> Settings &amp; Paper Sizes </strong></h4>
                                            </div>
                                            <form class="form-horizontal" role="form">
                                                <div class="form-group">
                                                    <input type="text" class="form-control" id="papersize" value="A1">                                                    
                                                </div>
                                            
                                            </form>
                                        </div>                                                              
                                </div>                
                          </div>                                                    
            `

        });

        cart_list += `</div>`;
        return cart_list;




    }
};

let mycart = new Shoppingcart();

function Addtocart(id){
  id = id.toString();
  const product_code = id.replace("_cart","");
  const item_quantity_id = product_code + "_quantity";
  const item_quantity = document.getElementById(item_quantity_id).value;

  const price = document.getElementById(product_code+"_price").value;
  const name = document.getElementById(product_code+"_name").value;


  mycart.loadcart();
  mycart.add_item_to_cart(product_code,name,price,item_quantity);

  document.getElementById(item_quantity_id).value = 0;

  showCartItems();
}

function clearCart(){
  showCartItems();
  // language=HTML
  document.getElementById("cartresponseinf").innerHTML = `
      <div class="alert alert-danger">
        <strong>Warning!</strong> You are about to clear contents of your cart !
            <form onsubmit="showCartItems()" id="clearCartForm">
                <button type="submit" class="btn btn-danger btn-block" onclick="mycart.clear_cart()">
                    <strong>Proceed</strong></button>
            </form>
        </div>`;
 //consider setting focus to the clear cart form
};

function showCartItems(){
  mycart.loadcart();

  let default_delivery = 3 * mycart.total_count();

  let overall_tota1 = default_delivery + parseInt(mycart.total_price());

  let cartdiplay = document.getElementById("cartdisplayid");
  // language=HTML
    cartdiplay.innerHTML = `
    <div class="panel-footer">
        <div class="panel-heading">
            <h2 class="panel-title"> <strong><i class="fa fa-shopping-basket"> </i> Shopping Cart</strong></h2>
        </div>

      <ul class="list-group">                    
          <li class="list-group-item"> <strong>Cart Contents</strong> ${mycart.return_cart_list() }</li>
          <li class="list-group-item"><strong>Total Items : ${mycart.total_count()}</strong></li>
          <li class="list-group-item"><strong>Sub Total : R ${mycart.total_price()} </strong></li>
          <li class="list-group-item"><strong>Delivery : R ${default_delivery} </strong></li>
          <li class="list-group-item"><strong>Total : R ${overall_tota1} </strong></li>
          <li class="list-group-item"><button id="maincheckout" type="button" class="btn btn-success btn-block" onclick="CartMenu(this.id)"> <strong> <i class="fa fa-shopping-bag"> </i> Checkout </strong></button> </li>
          <li class="list-group-item"><button type="button" class="btn btn-warning btn-block" onclick="clearCart()"> <strong> <i class="fa fa-cut"> </i> Clear Cart </strong></button> </li>
          <li class="list-group-item"><div id="cartresponseinf"></div></li>
      </ul>    
    </div>  
  `;

 // to header menu display upated
 document.getElementById("headercartTotalID").innerHTML = `<small title="Total number of items in cart">Items : ${mycart.total_count()}</small>`;
 //headercartSubID
  document.getElementById("headercartSubID").innerHTML = `<small title="Sub Total Excluding Delivery">Sub : R ${mycart.total_price()}</small>`;
}

function load_delivery_address (){

    const route = 'load-physical-address';

    let mydata = '&route=' + route + '&userid='+ UserCredentials.Get_Userid();

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

  let physical_address_request = new Request("/cart", myInit);
  let responseform = document.getElementById('deliveryAddress');
  myFetch(physical_address_request,responseform);
}

function load_postal_address(){
    const route = "load-postal-address";
    let mydata = '&route=' + route + '&userid='+ UserCredentials.Get_Userid();

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

  let postal_address_request = new Request("/cart", myInit);
  let responseform = document.getElementById('deliveryAddress');
  myFetch(postal_address_request,responseform);
}

function show_our_physical_address(){
    const route = "company-physical-address";
    let mydata = "&route=" + route + "&userid=" + UserCredentials.Get_Userid();

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

  let company_physical_address_request = new Request("/cart", myInit);
  let company_physical_response_form = document.getElementById('deliveryAddress');
  myFetch(company_physical_address_request,company_physical_response_form);
}

function load_payment_options(){

    const route = "load-payment-options";
    let mydata = '&route=' + route + '&userid='+ UserCredentials.Get_Userid();

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

    let payment_options_request = new Request('/cart', myInit);
    let paymentOptionsResponse = document.getElementById('paymentOptionsform');
    myFetch(payment_options_request,paymentOptionsResponse);

}

function load_project_art_drive(){
    const route = 'load-project-art-drive';
    let mydata = '&route=' + route + '&userid=' + UserCredentials.Get_Userid();

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

    let project_art_drive_request = new Request('/cart', myInit);
    let project_art_response = document.getElementById('projectartdrive');
    myFetch(project_art_drive_request,project_art_response);
}

function init_project_files_table(){
  $("#previous-files-table").DataTable({
    "paging": true,
    "lengthChange": true,
    "searching": true,
    "ordering": true,
    "info": true,
    "autoWidth": true
  })

}

function load_user_delivery_settings(){

    const route = "load_user_delivery_settings";
    let mydata = "&route=" + route + "&userid=" + UserCredentials.Get_Userid();

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

    let user_delivery_settings_request = new Request("/cart", myInit);
    let user_delivery_settings_response = document.getElementById('userdeliverysettings');

    myFetch(user_delivery_settings_request,user_delivery_settings_response);

}

function switchDeliveryForm(){
    let delivery_option = document.getElementById('deliveroptions');
    if (delivery_option.value === "postal" ){
       load_postal_address();
    }else if (delivery_option.value === "courier"){
        load_delivery_address();
    }else if(delivery_option.value === "pickup"){
        show_our_physical_address();
    }
}









function LoadMainCartItems(){
  mycart.loadcart();

  document.getElementById("showcartitemsbutton").classList.add("hidden");
  let cartdiplay = document.getElementById("LoadCartItemsInf");


    // language=HTML
  cartdiplay.innerHTML = `
      <div class="nav-tabs-custom">
        <ul class="nav nav-tabs">
          <li class="active"><a href="#shoppingcart" data-toggle="tab"><strong>Checkout</strong></a></li>
          <li><a href="#designs" data-toggle="tab"><strong>Designs</strong></a></li>
          <li><a href="#deliveryaddress" data-toggle="tab"><strong>Delivery</strong></a></li>
          <li><a href="#paymentoptions" data-toggle="tab"><strong>Payment Options</strong></a></li>
        </ul>
        <div class="tab-content">
          <div class="active tab-pane" id="shoppingcart">          
              <div class="panel-footer">
                  <div class="panel-heading">
                      <h2 class="panel-title"> <strong><i class="fa fa-shopping-basket"> </i> Checkout </strong></h2>
                  </div>
                <ul class="list-group">                    
                    <li class="list-group-item"> ${mycart.return_main_cart_list() }</li>
                </ul>
                
                    
              </div>
          </div>   
          <div class="tab-pane" id="designs">
                <div class="panel-default">
                    <div id="projectartdrive"></div>
                </div>
                
         </div>       
          <div class="tab-pane" id="deliveryaddress">
                <div class="panel-default">
                <div class="panel panel-body">
                    <div class="panel-heading">
                        <h4 class="panel-title"><strong> <i class="fa fa-truck"> </i> Delivery Options</strong></h4>
                    </div>
                    <div class="panel-body">
                        <div id="userdeliverysettings"></div>
                    </div>
                </div>
                
                    <div id="deliveryAddress"></div> 
                                                                               
                </div>
          </div>          
          <div class="tab-pane" id="paymentoptions">
                    <div id="paymentOptionsform"></div>
          </div>
        </div>
      </div>  
  
  `;



load_user_delivery_settings();

load_payment_options();
load_project_art_drive();
setTimeout(init_project_files_table,1000);
}


function EditCartItem(id){
  // with an item product code edit product options
  // options include paper type size , batch sizes and more
  console.log("called Edit Cart Item" + id);
}


function showProductTotal(myid){
  console.log(myid);

  let item_quantity = document.getElementById(myid).value;

  myid = myid.replace("_quantity","_totalid");
  let ProductSubTotal = document.getElementById(myid);

  myid = myid.replace("_totalid","_price");
  let item_price = document.getElementById(myid).value;

  ProductSubTotal.innerHTML =` Sub Total R ${parseInt(item_quantity) * parseInt(item_price)}
  
  `
}

function Pageload(){
  showCartItems();
  image_triggers();
}



function CartMenu(myid){
  // if ((myid === "checkout") || (myid === "maincheckout") ){
  // }

    let route = "cart";
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

  let formresponse = document.getElementById("innerHomeBodyID");
  let myrequest = new Request("/"+ route,myInit);
  myFetch(myrequest,formresponse);
}
