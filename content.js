console.log("Content script loaded");

setInterval(() => {
  chrome.runtime.sendMessage({ data: document.title }, function (response) {
    console.log((response.sumOfIdle - response.sumOfUsed) / 100);
  });
}, 5000);
