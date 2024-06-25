import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Colors from "../constants/Colors";
import MapOffer from "../components/MapOffer";
import BottomSheet from "@gorhom/bottom-sheet";
import Map from "../components/Map";
import HomeScreen from "./homeScreen";
import OfferInfo from "../components/OfferInfo";

export default HomeScreenWithSheet = ({ hideTab, navigation, setHideTab }) => {
  const [bottomPerc, setBottomPerc] = useState(1);
  const snapPoints = [`${hideTab ? 55 : bottomPerc}%`, "85%"];
  console.log("HomeScreenWithSheet", bottomPerc);
  const CustomHandler = useCallback(() => {}, []);
  const handleBack = () => {
    navigation.navigate("Home");
  };

  const BackgroundMap = () => {
    return (
      <HomeScreen
        navigation={navigation}
        setHideTab={setHideTab}
        setBottomPerc={setBottomPerc}
      />
    );
  };

  return (
    <BottomSheet
      index={0}
      backdropComponent={BackgroundMap}
      snapPoints={snapPoints}
      handleComponent={CustomHandler}
      style={styles.Sheet_container}
    >
      <View style={styles.offerContainer}>
        <View style={styles.tab} />
        <OfferInfo setHideTab={setHideTab} />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: Colors.primary,
  },
  Sheet_container: {
    zIndex: 1000000000,
  },
  button: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
    margin: 40,
  },
  tab: {
    backgroundColor: Colors.gray,
    height: 5,
    width: 200,
    marginTop: 20,
    alignSelf: "center",
  },
  offerContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 18,
  },
});
