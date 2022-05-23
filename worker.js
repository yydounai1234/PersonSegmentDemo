const webWorker = self;


const init = () => {
    
}
webWorker.addEventListener("message", async (event) => {
  const { action, data } = event.data;
  switch (action) {
    case "init":
      webWorker.postMessage({ inited: "rubbish" });
      break;
  }
});
