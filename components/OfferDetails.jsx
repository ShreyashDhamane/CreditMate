import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import Colors from "../constants/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Entypo } from "@expo/vector-icons";

const OfferDetails = ({ offer }) => {
  console.log(offer);
  return (
    <View style={styles.NearbyOffers}>
      <View style={styles.profile_container}>
        <Image source={{ uri: offer?.image }} style={styles.image} />
        <Text style={styles.headText}>{offer?.company}</Text>
      </View>
      <View style={styles.desc_title}>
        <Text style={styles.head_title}>
          Up to {offer?.offer}% off on your first purchase from {offer?.company}{" "}
          near you
        </Text>
      </View>
      <View style={styles.expiry}>
        <Entypo name="back-in-time" size={20} color="green" />
        <Text style={styles.expire_text}>
          Hurry up! Offer expires in 1 hour
        </Text>
      </View>
      <Text style={styles.sub_head}>Details</Text>
      <Text style={styles.desc}>
        You get an extra 5% off and a Rs. 100 cashback when you make a purchase
        using a Credit card.
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Explore now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OfferDetails;

const styles = StyleSheet.create({
  NearbyOffers: {
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "column",
  },

  headText: {
    marginVertical: 15,
    textTransform: "capitalize",
    fontWeight: "500",
    fontSize: 20,
  },
  head_title: {
    marginVertical: 15,
    textTransform: "capitalize",
    fontWeight: "600",
    fontSize: 20,
  },
  expiry: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  expire_text: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 15,
    color: "green",
  },
  sub_head: {
    marginVertical: 15,
    textTransform: "capitalize",
    fontWeight: "600",
    fontSize: 18,
    color: "rgb(120,120,120)",
  },
  desc: {
    fontSize: 16,
  },

  profile_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 20,
    borderColor: "rgb(230,230,230)",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
