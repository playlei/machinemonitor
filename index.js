const config = require('./config');
const os = require('os-utils');
const axios = require('axios');
const getRate = () => {
    return new Promise(resolve => {
        os.cpuUsage((v) => {
            resolve({
                cpuRate: parseInt(v * 100),
                memRate: parseInt((1 - os.freememPercentage()) * 100)
            })
        })
    })
}
setInterval(async () => {
    let data = await getRate();
    let time = parseInt(new Date().getTime() / 1000);
    axios({
        method: 'post',
        baseURL: config.tsdbUrl,
        url: '/api/put',
        data: [
            {
                metric: 'sys.cpu', timestamp: time,
                value: data.cpuRate, tags: { myType: 'cpu' }
            },
            {
                metric: 'sys.mem',timestamp: time,
                value: data.memRate,tags: { myType: 'mem' }
            },
        ]
    }).then(res => {
        console.log('succ');
    }, err => {
        console.log('fail');
    })
}, config.interval);
