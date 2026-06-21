import { notifications as initialNotifications } from './data';

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const STORAGE_KEY = 'cafe_notifications';

export function getNotifications(): NotificationItem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialNotifications));
    return initialNotifications;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return initialNotifications;
  }
}

export function saveNotifications(notifs: NotificationItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
  // Dispatch a local custom event for the current window/tab
  window.dispatchEvent(new CustomEvent('notifications-updated', { detail: notifs }));
}

export function addNotification(title: string, message: string, type: string = 'Order') {
  const notifs = getNotifications();
  const timeFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const newNotif: NotificationItem = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    message,
    time: timeFormatted,
    read: false,
  };
  const updated = [newNotif, ...notifs];
  saveNotifications(updated);
  return newNotif;
}

export function markAsRead(id: string) {
  const notifs = getNotifications();
  const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveNotifications(updated);
}

export function markAllRead() {
  const notifs = getNotifications();
  const updated = notifs.map((n) => ({ ...n, read: true }));
  saveNotifications(updated);
}
