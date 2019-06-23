


function UserMenu(id){
    console.log(id);
    headerrequest = new Request('/nav/' + id,initGet);
    myFetch(headerrequest,body);

}



// function sidebarMenu(id){
//     console.log(id);
//     bodyrequest = new Request('/nav/' + id,initGet);
//     myFetch(bodyrequest,body);
// }
