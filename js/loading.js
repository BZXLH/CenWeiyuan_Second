const loading = document.querySelector(".loading");

function startLoading() {
  loading.style.display = "block";
}
function endLoading() {
  loading.style.display = "none";
}

export { startLoading, endLoading };
