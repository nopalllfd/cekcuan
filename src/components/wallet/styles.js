import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  flexContainer: { flex: 1, backgroundColor: '#010923' },
  gradientContainer: { ...StyleSheet.absoluteFillObject },
  container: {
    paddingBottom: 120,
    paddingTop: 60,
    // alignItems: 'center', // <-- 1. HAPUS BARIS INI
    gap: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start', // Ini akan tetap membuat header di kiri
    paddingHorizontal: 20,
    marginBottom: 10,
    gap: 10,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },

  // STYLE KARTU
  card: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
    borderWidth: 0.8,
    borderColor: '#fff',
    backgroundColor: 'rgba(124, 124, 125, 0.24)',
    alignSelf: 'center', // <-- 2. TAMBAHKAN BARIS INI
  },

  // KONTEN KARTU
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 16 },
  amountText: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginTop: 8, letterSpacing: 1 },

  // KARTU PEMASUKAN
  incomeCardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  tagsContainer: { flexDirection: 'row', gap: 8 },
  tag: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: 15 },
  tagText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  tagIncome: { backgroundColor: 'rgba(56, 189, 117, 0.4)' },
  tagExpense: { backgroundColor: 'rgba(239, 68, 68, 0.4)' },
  historyLink: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  historyText: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 14, fontWeight: '500' },

  // TOMBOL TAMBAH PEMASUKAN (STATIS)
  updateIncomeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E3F',
    width: '90%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: -15,
    zIndex: -1,
    alignSelf: 'center', // <-- 2. TAMBAHKAN BARIS INI JUGA
  },

  // ... sisa style Anda tidak perlu diubah ...
  // KARTU BUDGET & SAVINGS (WARNA SOLID)
  solidCardBackground: {
    backgroundColor: '#1E1E3F',
  },
  budgetCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    alignItems: 'center',
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  // SEKSI TABUNGAN
  savingsContainer: {
    padding: 0,
    marginTop: 20,
    marginBottom: 40,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  addSavingButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingsCarousel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselArrow: {
    padding: 10,
  },
  savingCard: {
    width: width * 0.6, // Menggunakan lebar dinamis lebih baik
    height: 120,
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savingCardTitle: { marginStart: -6, color: '#fff', fontWeight: 'bold' },
  savingCardProgressText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  savingCardDetail: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  savingCardDetailText: { marginStart: 6, color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  viewAllButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, alignSelf: 'center', marginTop: 20, paddingBottom: 20 },
  viewAllText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // --- Style untuk Modal ---
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'rgba(4, 8, 36, 0.95)',
    borderRadius: 20,
    padding: 25,
    borderWidth: 0.8,
    borderColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalLabel: {
    color: '#d1d5db',
    fontSize: 14,
    marginBottom: 8,
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: '#374151',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 10,
    marginBottom: 20,
  },
  historyButton: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  modalSaveButton: {
    backgroundColor: 'rgba(139, 139, 139, 0.32)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalSaveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
