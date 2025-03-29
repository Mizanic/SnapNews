import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: "#000",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <MaterialIcons name="cruelty-free" size={24} color="#ff007f" />
        <Text style={{ color: "#fff", marginLeft: 8, fontSize: 18 }}>
          BlinkFeed
        </Text>
      </View>

      <TouchableOpacity onPress={toggleMenu}>
        <MaterialIcons name="menu" size={28} color="#fff" />
      </TouchableOpacity>

      {menuVisible && (
        <Modal transparent={true} animationType="fade" visible={menuVisible}>
          <View
            style={{
              position: "absolute",
              top: 50,
              right: 0,
              backgroundColor: "#000",
              padding: 20,
              elevation: 5,
              width: "50%",
              height: "auto",
            }}
          >
            <TouchableOpacity
              onPress={toggleMenu}
              style={{ alignSelf: "flex-end" }}
            >
              <MaterialIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Header;
