const connectionArray = [];


const sendToOneUser = (target, msgString) => {
  const isUnique = true;
  const i; 

  connectionArray.forEach((wsObj, i) => {
    if (wsObj.userName === target) {
      wsObj.send(msgString);
    }
  })
}