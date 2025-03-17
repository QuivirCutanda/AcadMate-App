import React, { useEffect, useState } from "react";
import { Drawer } from "react-native-drawer-layout";
import { useRouter } from "expo-router";
import Header from "@/src/AI/component/AIHeader";
import ChatComponent from "@/src/AI/component/ChatComponent";
import ChatHistory from "@/src/AI/component/DrawerComponent";
import { View, Text, ScrollView, Image } from "react-native";
import CustomModal from "@/src/components/CustomModal";
import useInternetStatus from "@/src/hooks/useInternetStatus";
import { chatHistorySample } from "@/constant/chatHistorySample.json";
import LottieView from "lottie-react-native";

export default function ChatScreen() {
  const router = useRouter();
  const isConnected = useInternetStatus();
  const [open, setOpen] = useState(false);
  const [clearChat, setClearChat] = useState<() => void>(() => () => {});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isConnected==true) {
      setVisible(false);
    } else if(isConnected==false) {
      setVisible(true);
    }
  }, [isConnected]);

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderDrawerContent={() => (
        <View className="flex-1">
          <View className="bg-secondary p-4 rounded-b-2xl justify-center items-center">
            <Text className="text-lg font-bold text-primary">AcadMate AI</Text>
          </View>
          <Text className="text-base font-bold text-secondary border-b border-secondary m-4">
            Chats
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            {/* {chatHistorySample.map((history: any, index: number) => (
              <ChatHistory title={history} key={index}/>
            ))} */}
            <Text className="text-center text-secondary font-normal">
              No data available
            </Text>
          </ScrollView>
        </View>
      )}
    >
      <Header
        onPress={() => router.back()}
        onPressEdit={() => {
          console.log("Press edit");
          clearChat();
        }}
        onPressMenu={() => setOpen(true)}
      />
      <CustomModal
        onOk={() => {
          setVisible(false);
            router.back();
          }}
          onCancel={()=>{
            setVisible(false);
          }}
          visible={visible}
          >
          <View className="px-20">
          <Image
            source={require("@/assets/images/no-internet.png")}
            style={{ width: 90, height: 90 }}
          />
          </View>
        <Text className="text-lg text-red-500 font-bold">No Internet</Text>
      </CustomModal>
      <ChatComponent onClearChat={setClearChat} />
    </Drawer>
  );
}
