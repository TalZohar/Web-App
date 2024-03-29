'use strict';

function getUsersHTML(users) {
    if (!users) {
        return;
    }
    var ol = document.createElement('ol');

    users.forEach(function (user) {
        var li = document.createElement('li');
        li.innerHTML = user;
        ol.appendChild(li);
    });
    return ol;
}

function RoomInfo(props) {
    //get room info for display
    var roomId = props.roomId,
        users = props.users;

    var usersAndId = [];
    if (users) {
        for (var i = 0; i < users.length; i++) {
            usersAndId.push({ user: users[i], id: i });
        }
    }
    return React.createElement(
        'div',
        null,
        React.createElement(
            'h2',
            null,
            React.createElement(
                'b',
                null,
                'Room Id:'
            ),
            ' ',
            roomId
        ),
        React.createElement('hr', null),
        React.createElement(
            'h4',
            null,
            'Players: '
        ),
        users ? usersAndId.map(function (user) {
            return React.createElement(
                'li',
                { key: user.id },
                user.user
            );
        }) : React.createElement(
            'p',
            null,
            ' No players joined yet'
        )
    );
}

export default RoomInfo;