self.addEventListener("notificationclick", (event) => {
  console.log("[Service Worker] Notification Clicked");

  event.notification.close();

  const url = event.notification.data.url;

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus().then(() => client.navigate(url));
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      }),
  );
});

self.addEventListener("push", function (event) {
  console.log("[Service Worker] Push Received");

  const { title, body, url, reminderId, origin } = JSON.parse(
    event.data.text(),
  );

  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    self.registration.showNotification(title, {
      tag: reminderId,
      body,
      vibrate: [200, 100, 200, 100, 200, 100, 200],
      icon: origin + "/android-chrome-192x192.png",
      actions: [
        {
          action: "Detail",
          title: "View",
          icon: origin + "/android-chrome-192x192.png",
        },
      ],
      data: { url },
    }),
  );
});
