self.addEventListener("push", function (event) {
    if (!event.data) return;

    const data = event.data.json();

    const title = data.title || "Nuevo pedido";
    const options = {
        body: data.body || "Tienes un nuevo pedido en Ándale Socios.",
        icon: "/icon.png",
        badge: "/icon.png",
        tag: data.tag || "new-order",
        data: {
            url: data.url || "/"
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();

    const url = event.notification?.data?.url || "/";

    event.waitUntil(
        clients.openWindow(url)
    );
});