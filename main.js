const readline = require('readline-sync')
const fetch = require('node-fetch')
const token = require('./env.js').token


function getUserID() {
    while (true) {
        let input = parseInt(readline.question('Input user id: '))
        if (isNaN(input) || input < 0) {
            printErrorMessage('Wrong id: expected non-negative number')
            continue
        }
        console.log()
        return input
    }
}


function getRequestDataPromise(url) {
    return fetch(url)
        .then((res) => res.json().then((data) => data)
            .catch((e) => printErrorMessage(e))
        )
        .catch((e) => printErrorMessage(e))
}


function printErrorMessage(errMessage) {
    console.log(getTextWithColor(errMessage, 31))
}


function printResult(albumsData, userInfo) {
    console.log(`Information about the albums of the user ${
        getTextWithColor(`${userInfo.first_name} ${userInfo.last_name}`, 36)}`)
    console.table(albumsData.map((data) => getAlbumDataWithFormatedDates(data)),
        ['id', 'title', 'size', 'created', 'updated', 'description'])
}


function getAlbumDataWithFormatedDates(data) {
    let updated = data.updated ? new Date(data.updated * 1000).toDateString() : "-"
    let created = data.created ? new Date(data.updated * 1000).toDateString() : "-"
    return {
        ...data,
        updated: updated,
        created: created
    }
}


function getTextWithColor(text, colorID) {
    return `\x1b[${colorID}m${text}\x1b[0m`
}


function main() {
    let id = getUserID()
    let albumsUrl = `https://api.vk.com/method/photos.getAlbums?access_token=${token}&owner_id=${id}&v=5.130&need_system=1`
    let userUrl = `https://api.vk.com/method/users.get?access_token=${token}&user_ids=${id}&v=5.130`

    getRequestDataPromise(userUrl).then((users) => {
        if (!users.error && users.response.length > 0) {
            getRequestDataPromise(albumsUrl)
                .then((albums) => {
                    if (albums.error) {
                        printErrorMessage(`ERROR: ${albums.error.error_code} ${albums.error.error_msg}`)
                    } else {
                        printResult(albums.response.items, users.response[0])
                    }
                })
        } else printErrorMessage('User isn\'t registered')
    })
}


main()