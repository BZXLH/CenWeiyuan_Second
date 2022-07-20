//登录角色（默认为1），1-app用户，2-管理员，3-超管，4工作人员
const { setRole, getRole } = function () {
  let role = 1;

  //设置身份
  function setRole(_role) {
    role = _role;
  }
  // 查询身份
  function getRole() {
    return role;
  }
  return {
    setRole,
    getRole,
  };
};

f;

export { getRole, setRole };
