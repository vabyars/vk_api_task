let fetch = require('node-fetch')
let token = require('./env.js').token


fetch(`https://api.vk.com/method/photos.getAlbums?access_token=${token}&owner_id=264989793&v=5.130&need_system=1`)
    .then((res) => res.json().
        then((data) => console.log(data))
        .catch((e) => console.log(e)))
    .catch((e) => console.log(e))