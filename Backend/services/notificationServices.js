const { v4: uuidv4 } = require("uuid");
const { readData, writeData } = require("./fileService");
const realtimeService = require("./realtimeService");

function createNotification(userId, payload) {
    const notifications = readData("notifications.json");

    const notification = {
        id: uuidv4(),
        userId,
        type: payload.type || "notification",
        title: payload.title || "Notification",
        message: payload.message || "",
        level: payload.level || "info",
        data: payload.data || null,
        isRead: false,
        createdAt: new Date().toISOString()
    };

    notifications.push(notification);
    writeData("notifications.json", notifications);

    realtimeService.sendToUser(userId, {
        type: "notification",
        notification
    });

    return notification;
}

function getUserNotifications(userId) {
    return readData("notifications.json")
        .filter(x => x.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function markNotificationAsRead(userId, notificationId) {
    const notifications = readData("notifications.json");

    const notification = notifications.find(x =>
        x.id === notificationId &&
        x.userId === userId
    );

    if (!notification) {
        return null;
    }

    notification.isRead = true;
    notification.readAt = new Date().toISOString();

    writeData("notifications.json", notifications);

    return notification;
}

function markAllNotificationsAsRead(userId) {
    const notifications = readData("notifications.json");

    notifications.forEach(x => {
        if (x.userId === userId && !x.isRead) {
            x.isRead = true;
            x.readAt = new Date().toISOString();
        }
    });

    writeData("notifications.json", notifications);

    return getUserNotifications(userId);
}

module.exports = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
};