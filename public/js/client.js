const socket= io();

var username;
var chats= document.querySelector(".chats");
var users_list= document.querySelector(".userslist");
var users_count= document.querySelector(".users-count");
var message_send= document.querySelector("#user-send");
var user_message= document.querySelector("#user-msg");

do{
    username= prompt("Enter your username: ");
}while(!username);


//it will be called when user joins
socket.emit("new-user-joined", username);

//receive event from server for broadcast when user joins
socket.on('user-connected',(socket_name)=>{
    userJoinLeft(socket_name, 'joined'); 
});
//function to create joined/left div
function userJoinLeft(name, status)
{
    let div= document.createElement("div");
    div.classList.add('user-join');
    let content= `<p><b>${name}</b> ${status} the chat</p>`; 
    div.innerHTML=content;
    chats.appendChild(div); //a div is created and appended everytime someone joins

}
//receive event from server for broadcast when user disconnects
socket.on('user-disconnected', (user)=>{
    userJoinLeft(user,'left');
});

//updating user list
socket.on('user-list', (users)=>{
    users_list.innerHTML=""; //vanish the static user list
    users_arr= Object.values(users); //get dynamic user names

    for(i=0; i<users_arr.length; i++)
    {
        let p= document.createElement('p');
        p.innerText=users_arr[i];  //new p tag with name
        users_list.appendChild(p);
    }
    users_count.innerHTML=users_arr.length;

});

//for sending message
message_send.addEventListener('click', ()=>{
    let data={
        user: username,
        msg: user_message.value
    };

    if(user_message.value!='')
    {
        appendMessage(data, 'outgoing');
        socket.emit('message', data);
        user_message.value='';
    }
});

function appendMessage(data, status)
{
    let div= document.createElement('div');
    div.classList.add('message', status);
    let content=`
    <h5>${data.user}</h5>
    <p>${data.msg}</p>
    `;

    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop= chats.scrollHeight;
}


socket.on('message', (data)=>{
    appendMessage(data, 'incoming')
})