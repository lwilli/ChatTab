$(function () {
    var socket = io("https://chattab.herokuapp.com");
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    $('form').submit(function(){
        // Add their own message to the list
        var msg = $('#m').val();
        const sentTime = moment().tz(timezone).format("LT L");
        updateUiWithMyMessage(msg, "Anon", sentTime);
        
        const data = {"message": msg, 
                      "sender": "Anon",
                      "sentTime": sentTime};
        // Send the message to everyone else
        socket.emit('chat message', data);

        // Clear the message from the chat box
        $('#m').val('');
        return false;
    });

    function updateUiWithMessage(message, myOrTheir, sender, sentTime) {
        const headerCssClass = myOrTheir + "message-header";
        const messageHeaderElement = '<div class="' + headerCssClass + '">' + sender + ' - ' + sentTime + '</div>';
        $('#chat').append($(messageHeaderElement));
        
        const messageCssClass = myOrTheir + "-message";
        const messageElement = '<div class="' + messageCssClass + '">'
        $('#chat').append($(messageElement).text(message));

        window.scrollTo(0, document.body.scrollHeight);
    }

    function updateUiWithMyMessage(msg, sender, sentTime) {
        updateUiWithMessage(msg, "my", sender, sentTime);
    }

    function updateUiWithTheirMessage(msg, sender, sentTime) {
        updateUiWithMessage(msg, "their", sender, sentTime);
    }

    socket.on('chat message', function(data){
        updateUiWithTheirMessage(data.message, data.sender, data.sentTime);
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