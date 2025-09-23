import * as Notifications from 'expo-notifications';

// Atur handler notifikasi untuk menampilkan notifikasi saat aplikasi terbuka
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Meminta izin dari pengguna untuk mengirim notifikasi.
 * @returns {Promise<boolean>} Mengembalikan true jika izin diberikan, false jika tidak.
 */
export async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return false;
  }
  return true;
}

/**
 * Menjadwalkan notifikasi pengingat harian.
 */
export async function scheduleDailyReminder() {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'CekCuan Reminder!',
      body: 'Jangan lupa catat pengeluaran harianmu sekarang. 💸',
    },
    trigger: {
      hour: 20, // Remind at 8 PM (20:00)
      minute: 0,
      repeats: true, // This makes it a recurring local notification
    },
  });
}
