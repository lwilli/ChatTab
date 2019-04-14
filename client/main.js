$(function () {
    var socket = io("https://chattab.herokuapp.com");

    $('form').submit(function(){
        // Add their own message to the list
        var msg = $('#m').val();
        updateUiWithMyMessage(msg);
        
        // Send the message to everyone else
        socket.emit('chat message', msg);
        // Clear the message from the chat box
        $('#m').val('');
        return false;
    });

    function updateUiWithMessage(message, messageClass) {
        var elementToAdd = '<div class="' + messageClass + '">';
        $('#chat').append($(elementToAdd).text(message));
        window.scrollTo(0, document.body.scrollHeight);
    }

    function updateUiWithMyMessage(msg) {
        updateUiWithMessage(msg, "my-message");
    }

    function updateUiWithTheirMessage(msg) {
        updateUiWithMessage(msg, "their-message");
    }

    socket.on('chat message', function(msg){
        updateUiWithTheirMessage(msg);
    });

    function setActiveUserCount(count) {
        $('#num-users').text(count);
    }
    
    socket.on('user count', function(count) {
        setActiveUserCount(count);
    });

    // When the user scrolls the page, update the sticky header 
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