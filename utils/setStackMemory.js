let stackMemory = {
  idList: [],
  detailList: [],
  followsStack: [],
  fansStack: [],
  lAcStack: [],
  SidList: [],
};

function setStack(key, val) {
  if (sessionStorage.getItem("stackMemory")) {
    stackMemory = JSON.parse(sessionStorage.getItem("stackMemory"));
  }
  stackMemory[key] = val;
  sessionStorage.setItem("stackMemory", JSON.stringify(stackMemory));
}

export { setStack };
