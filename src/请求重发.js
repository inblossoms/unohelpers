class ReSend {
  reqList = [];
  reqMapList = []

  constructor(list,  options = {}) {
    this.reqList = list;
    this.options = options;
    this.bindEvent(this.options);
  }

  bindEvent(options){
    this.eventPool(options)
  }
  eventPool({ tryMaxTimer }){
    let uid;
    this.reqList.forEach((fn, idx) =>{
      uid = Number.parseInt(String(idx), 16);
      this.reqMapList[uid] = fn;
      fn.id = uid
      fn.tryMaxTimer = tryMaxTimer
      fn.tryTimer = 0
    })
  }

  wrapToPromise(fn){
    return new Promise((resolve, reject)=>{
      fn().then((result)=>{
        resolve({
          id: fn.id,
          result: result
        })
      }).catch((result)=>{
        reject({
          id: fn.id,
          result: result
        })
      })
    })
  }

  failed = []
  success = []
  sendAllSettled(){
      return Promise.allSettled(this.reqQueue)
      .then((r) => {
        this.reqQueue = [];
        r.forEach((request)=>{
          if(request.status === "fulfilled"){
            this.success.push(request.value.result);
          }
          else if (request.status === "rejected"){
            let reqFn = this.reqMapList[request.reason.id];
            if(reqFn.tryTimer < reqFn.tryMaxTimer)
            {
              this.reqQueue.push(this.wrapToPromise(reqFn));
              reqFn.tryTimer += 1;
            }
            else {
              this.failed.push(request.reason.result);
            }
          }
        })
        if(this.reqQueue.length === 0) {
          return ({
            succeed: this.success,
            failed: this.failed
          })
        } else {
          // console.log("sendAllSettled")
          return this.sendAllSettled()
        }
      })
  }


  reqQueue = []
  send() {
    return new Promise(async (resolve) => {
      this.reqMapList.forEach(fn => {
        this.reqQueue.push(this.wrapToPromise(fn))
      })
      const result = await this.sendAllSettled()
      resolve(result)
    })
  }
}

function fn1(params) {
  return new Promise((resolve, reject) => {
    return resolve("fn1 resolve.");
  });
}
function fn2(params) {
  return new Promise((resolve, reject) => {
    return resolve("fn2 resolve.");
  });
}
function fn3(params) {
  return new Promise((resolve, reject) => {
    return reject("fn3 reject.");
  });
}
function fn4(params) {
  return new Promise((resolve, reject) => {
    return resolve("fn4 resolve.");
  });
}

new ReSend([fn1, fn2, fn3, fn4], {tryMaxTimer: 3}).send().then(r => console.log(r));
