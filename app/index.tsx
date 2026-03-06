import { Button, Text, View } from "react-native";
import { useSate, useEffect } from "react";

export default function Index() {

  useEffect(()=>{
    console.log("Console mounted");
    return () => {
      console.log("Component will unmount");
    }
  }, [])


  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center",}}>
      <Text>Count:</Text>
      <Button>INCREMENT</Button>
      <Button>DECREMENT</Button>
    </View>
  );
}
