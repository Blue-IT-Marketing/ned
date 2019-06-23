
function isUrl(url){
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name and extension
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?'+ // port
    '(\\/[-a-z\\d%@_.~+&:]*)*'+ // path
    '(\\?[;&a-z\\d%@_.,~+&:=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(url);    
}

function isEmpty(a){
    return a === null || a === '';
}

function isProvince(province){
    let province_list = ['limpopo','mpumalanga','north west','gauteng','kwazulu natal','eastern cape','western cape','northern cape','orange free state'];
    for (let i = 0; i < province_list.length; i++){
        if (province === province_list[i]){
            return true;
        }
    }
    return false;
}


function validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);

}

function validatePassword(password){
    let re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return re.test(password);
}

function validateUsername(username){
    let re = /^\w+$/;
    return res.test(username);
}

function isNumber(n){
    return typeof(n) !== "boolean" && !isNaN(n);
}

function isCell(n){
    return !isEmpty(n) && ((n.length === 10) || (n.length === 13))
}

function isTel(n){
    return isCell(n)
}

function isFax(n){
    return isCell(n)
}

function getAge(dateString) {

    let dates = dateString.split("-");
    let d = new Date();

    let userday = dates[2];
    let usermonth = dates[1];
    let useryear = dates[0];

    let curday = d.getDate();
    let curmonth = d.getMonth()+1;
    let curyear = d.getFullYear();

    let age = curyear - useryear;

    if((curmonth < usermonth) || ( (curmonth === usermonth) && curday < userday   )){
        age--;
    }
    return age;
}

function isIDNumber(n){
    return (isNumber(n)) && (n.length === 13);
}

let myHeaders = new Headers();

let myFormHeaders = myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

let initGet = {
               method: 'GET',
               headers: myHeaders,
               redirect: "follow",
               mode: 'cors',
               credentials: 'same-origin',
               cache: 'no-cache' };

let initNewsAPI = {
               method: 'post',
               headers: myFormHeaders,
               redirect: "follow",
               mode: 'cors',
               cache: 'no-cache'
};

function myFetch(myrequest,formresponse)
{
    fetch(myrequest).then(function(response){
        if (!response.ok){
            myStatus = response.statusText;
            /**console.log(myStatus);**/
            formresponse.innerHTML = myStatus;
        }else{
            return response.text();
        }
    }).then(function (data) {
        /**console.log(data);**/
        let parser = new DOMParser();
        //let doc =  parser.parseFromString(data, 'text/html').body.innerHTML;
        //formresponse.insertAdjacentHTML('afterbegin',data);
         formresponse.innerHTML = parser.parseFromString(data, 'text/html').body.innerHTML;

    }).catch(function (error) {
        //console.log(error);
        formresponse.innerHTML = error;
    })
}
