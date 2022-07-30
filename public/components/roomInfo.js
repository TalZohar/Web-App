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
            'p',
            null,
            'id: ',
            roomId
        ),
        React.createElement(
            'p',
            null,
            'users: '
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