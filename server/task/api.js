// 用于发起服务端对于api的请求
const rp = require('request-promise-native')

async function fetchMovie(item) {
    const url = `http://api.douban.com/v2/movie/${item.doubanId}`
    let res = await rp(url)

    try {
        res = JSON.parse(res)
    } catch (err) {
        res = null
    }

    return res
}


;
(async () => {
    let movies = [{
        doubanId: '25719258',
        title: '战神',
        poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2207925508.webp'
    },
    {
        doubanId: '3878007',
        title: '海王 潜水侠 水行侠',
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2370038514.webp'
    }
    ]
    movies.map(async movie => {
        let movieData = await fetchMovie(movie)
        try {
            movieData = JSON.parse(movieData)
        }
        catch (err) {
            console.log(err)
        }
        console.log(movieData)
    })

})()