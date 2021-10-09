import('./core/engine.js').then(module=>{
    module.default()
}).catch(err => {
    console.log(err)
})