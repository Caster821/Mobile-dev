import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user?.charAt(0)}</Text>
      </View>
      <Text style={styles.username}>{user}</Text>
      <Text style={styles.role}>Administrator</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="Sign Out" color="#FF3B30" onPress={signOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 50, backgroundColor: '#fff' },
  avatar: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: '#007AFF', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 20
  },
  avatarText: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  username: { fontSize: 22, fontWeight: 'bold' },
  role: { fontSize: 16, color: 'gray', marginBottom: 40 },
  buttonContainer: { width: '80%' }
});