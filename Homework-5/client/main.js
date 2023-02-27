if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((registration) => {
        console.log("ServiceWorker registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("ServiceWorker registration failed: ", registrationError);
      });
  });

  navigator.serviceWorker.addEventListener('message', (event) => {
    notifyMe(event.data)
  });
}

const pushNotification = (label, message) => {
  return new Notification(label, {
    body: message,
    icon: './icon.svg'
  });
}

function notifyMe(data) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    pushNotification('Сообщение от сервера', data.message)
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        pushNotification('Сообщение от сервера', data.message)
      }
    });
  }
}