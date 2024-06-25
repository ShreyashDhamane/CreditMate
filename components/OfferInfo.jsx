import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import gucci from "../assets/images/company/g.jpg";
import { Button } from "react-native-web";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../constants/Colors";

const OfferInfo = ({ setHideTab, setBottomPerc }) => {
  return (
    <View style={styles.offerContainer}>
      <View style={styles.header}>
        <Image source={gucci} style={styles.image} />
        <Text style={styles.companyName}>Gucci</Text>
      </View>
      <Text style={styles.offerText}>
        Up to 30% off when you buy sunglasses from Gucci near you
      </Text>

      <View style={styles.expireDate}>
        <FontAwesome5 name="clock" size={18} color={Colors.gray2} />
        <Text
          style={{
            marginLeft: 10,
            color: Colors.green,
            fontWeight: 500,
            fontSize: 16,
          }}
        >
          Hurry! Expires in 1 day
        </Text>
      </View>

      <Text style={styles.subTitle}>Details</Text>
      <Text style={styles.subText}>
        You get an extra 5% off and a Rs.100 cashback when you buy sunglasses
        using a Credit card.
      </Text>
      <TouchableOpacity
        style={styles.checkoutBtn}
        onPress={() => setHideTab(false)}
      >
        <Text style={styles.btnText}>Explore now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OfferInfo;

const styles = StyleSheet.create({
  offerContainer: {
    display: "flex",
    flexDirection: "column",
  },
  header: {
    marginVertical: 25,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 2,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    elevation: 5,
    borderColor: "#D3D3D3",
    borderWidth: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 400,
    marginLeft: 5,
  },
  offerText: {
    fontSize: 20,
    fontWeight: 500,
    color: "#000",
  },
  subText: {
    fontSize: 15,
    marginTop: 14,
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 500,
    marginTop: 30,
    color: Colors.gray2,
  },
  checkoutBtn: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    color: "#fff",
  },
  expireDate: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 500,
    textAlign: "center",
  },
});
