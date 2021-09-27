$(function(){ 
    $('#get-button').on('click', function() {  
       $.ajax({
         url: '/reviewajax',
         contentType: 'application/json',
         success: function(response) {
            var tbodyEl = $('tbody');

          tbodyEl.html('');
            console.log('success');
            
            console.log(response.comment[0]);
             response.comment.forEach(function(comment){
              console.log(comment['user']);
              comment['text'];
              document.getElementById('log').innerHTML += '<br>Some new content!          ' + comment['text'] + '             user   ' + comment['user'] ;
              //document.getElementById('log1').innerHTML +=   comment['text'];
    
              });

}
});

      

});
});

