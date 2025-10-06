import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // --- PERUBAHAN UTAMA UNTUK POP-UP ---
  modalOverlay: {
    flex: 1,
    // Menengahkan konten secara vertikal dan horizontal
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#010923', // Warna tema Anda dipertahankan
    // Mengubah radius hanya di atas menjadi di semua sisi
    borderRadius: 24,
    // Mengubah lebar agar tidak penuh layar
    width: width * 0.9,
    // Menambahkan tinggi maksimal untuk keamanan
    maxHeight: height * 0.85,
    // Menggunakan padding yang lebih seimbang untuk pop-up
    padding: 18,
    // Menambahkan bayangan agar terlihat melayang
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },

  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#404060',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    color: 'white',
  },
  headerButton: {
    padding: 5,
    width: 40,
    alignItems: 'center',
    color: 'white',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    flex: 1,
  },
  modalBody: {
    width: '100%',
    alignItems: 'center',
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
  },
  modalSubText: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 20,
    color: '#ffffff',
    fontWeight: '500',
    width: '100%',
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#52526B',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#404060',
    width: '100%',
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
  },
  inputIcon: {
    marginLeft: 10,
  },
  inputCurrency: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  categoryGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'start',
    width: '100%',
    marginTop: 10,
  },
  categoryGridButton: {
    alignItems: 'center',
    marginBottom: 20,
    width: width / 5,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4E6691',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  addCategoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#4E6691',
    borderStyle: 'dashed',
  },
  selectedCategoryContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#404060',
    width: '100%',
  },
  selectedCategoryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  categoryIconContainerActive: {
    backgroundColor: '#091E5C',
    transform: [{ scale: 1.1 }],
  },
  categoryGridText: {
    color: '#ddd',
    fontSize: 12,
    textAlign: 'center',
  },
  iconGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '120%',
  },
  iconGridButton: {
    margin: 8,
  },
  buttonBase: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonTextBase: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#FFF',
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
  },
  nextButtonText: {
    color: '#1B2F6D',
  },
});
