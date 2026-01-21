# Lab 1

**Objective:** Build a user profile card component

**Requirements:**
1. Display user avatar (circular image)
2. Show name and bio
3. Display follower/following counts
4. Add "Follow" button

**Starter Code:**
```javascript
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

function ProfileCard() {
  const user = {
    name: "DAUSTIAN",
    avatar: "https://i.pravatar.cc/150?img=12",
    bio: "Mobile developer | React Native enthusiast",
    followers: 1234,
    following: 567
  };
  
  return (
    <View style={styles.container}>
      {/* Your code here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Your styles
  }
});
```
## Expected Result

The profile card should include:
- Circular avatar image (100x100)
- Name (bold, 24px)
- Bio text (gray, 14px)
- Stats row with followers/following counts
- Blue "Follow" button with white text
- Proper spacing and shadows
- Centered layout