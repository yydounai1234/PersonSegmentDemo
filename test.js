async function test () {
    const a = 3
    const b = 4
    const c = 7
    return c
}



Promise.all([test()]).then(res => {
    console.log(res)
})

