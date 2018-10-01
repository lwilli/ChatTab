$(function () {
    var socket = io("https://chattab.herokuapp.com");

    $('form').submit(function(){
        // Add their own message to the list
        $('#messages').append($('<li>').text($('#m').val()).css('text-align', 'right'));
        window.scrollTo(0, document.body.scrollHeight);
        
        // Send the message to everyone else
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
        window.scrollTo(0, document.body.scrollHeight);
    });

    function setActiveUserCount(count) {
        $('#num-users').text(count);
    }
    
    socket.on('user count', function(count) {
        setActiveUserCount(count);
    });

    // When the user scrolls the page, execute myFunction 
    window.onscroll = function() {updateStickyHeader()};
    
    // Get the header
    var header = document.getElementById("user-count");

    // Get the offset position of the navbar
    var sticky = header.offsetTop;

    // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
    function updateStickyHeader() {
        if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        } else {
        header.classList.remove("sticky");
        }
    }
});