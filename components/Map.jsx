import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Colors from "../constants/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import MapOffer from "../components/MapOffer";
import BottomSheet from "@gorhom/bottom-sheet";
import { StackActions, withNavigation } from "@react-navigation/native";
import MapView, { Circle, Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { allGeoFences } from "../utils/ApiResponse";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Can use this function below OR use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken, notify) {
  console.log("sending notification", notify);
  const message = {
    to: expoPushToken,
    sound: "default",
    title: notify.title,
    body: notify.body,
  };

  try {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.log("err -> ", error);
  }
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d * 1000;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const BackgroundMap = ({ pin, setPin, getNewOffers }) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [isAnyIntersecting, setIsAnyIntersecting] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [geoFences, setGeoFences] = useState(allGeoFences);
  const [currGeoFencesActiveIdx, setCurrGeoFencesActiveIdx] = useState([]);

  const pushNotifyMe = async (notify) => {
    await sendPushNotification(expoPushToken, notify);
  };
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setPin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: pin.latitude,
          longitude: pin.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        onUserLocationChange={(e) => {
          setPin({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
          });
        }}
      >
        <Marker
          coordinate={pin}
          title="My Position"
          description="My Position"
          draggable={true}
          onDragStart={(e) => {
            // console.log('dragStart', e.nativeEvent.coordinate);
            setPin({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            });
          }}
          onDragEnd={(e) => {
            console.log("dragEnd", e.nativeEvent.coordinate);

            setPin({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            });
            let anyIntersecting = false;

            // add the elements according to the length of the geoFences array
            const currFencesActiveIdx = [...Array(geoFences.length).keys()];
            const newGeofences = geoFences.map((geoFence, index) => {
              let dist = getDistanceFromLatLonInKm(
                geoFence.latitude,
                geoFence.longitude,
                e.nativeEvent.coordinate.latitude,
                e.nativeEvent.coordinate.longitude
              );
              if (dist < geoFence.radius) {
                anyIntersecting = true;
                !currFencesActiveIdx.includes(index) &&
                  currFencesActiveIdx.push(index);
                return {
                  ...geoFence,
                  intersecting: true,
                };
              } else {
                currFencesActiveIdx.splice(
                  currFencesActiveIdx.indexOf(index),
                  1
                );
                return {
                  ...geoFence,
                  intersecting: false,
                };
              }
            });
            setCurrGeoFencesActiveIdx(currFencesActiveIdx);
            getNewOffers(true, currFencesActiveIdx);
            // get the top 2 offers and pushNotifyMe using the newGeofences array and notifyCounter if anyIntersecting is true
            if (anyIntersecting) {
              let notifyCount = 0;
              for (let i = 0; i < newGeofences.length; i++) {
                const currFence = newGeofences[i];
                if (currFence.intersecting) {
                  pushNotifyMe(
                    currFence.notifications[currFence.currNotifyIdx]
                  );
                  currFence.currNotifyIdx =
                    (currFence.currNotifyIdx + 1) %
                    currFence.notifications.length;
                  notifyCount++;
                }
                if (notifyCount === 2) {
                  break;
                }
              }
            }

            setIsAnyIntersecting(anyIntersecting);
            setGeoFences(newGeofences);
          }}
        ></Marker>
        <Circle
          center={pin}
          radius={500}
          fillColor={
            isAnyIntersecting ? "rgba(255, 0, 0, 0.2)" : "rgba(0, 255, 0, 0.2)"
          }
        ></Circle>
        {geoFences.map((geoFence) => {
          return (
            <Circle
              center={{
                latitude: geoFence.latitude,
                longitude: geoFence.longitude,
              }}
              fillColor={
                geoFence.intersecting
                  ? "rgba(0, 255, 0, 0.2)"
                  : "rgba(255, 0, 0, 0.2)"
              }
              radius={geoFence.radius}
            ></Circle>
          );
        })}
      </MapView>
    </View>
  );
};

export default BackgroundMap;

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
    paddingHorizontal: 18,
    elevation: 2,
  },
});
