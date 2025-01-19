import { Tabs } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHouse as faHouseRegular,
  faSearch as faSearchRegular,
  faHeart as faHeartRegular,
  faUser as faUserRegular,
} from "@fortawesome/pro-regular-svg-icons";
import {
  faHouse as faHouseSolid,
  faSearch as faSearchSolid,
  faHeart as faHeartSolid,
  faUser as faUserSolid,
} from "@fortawesome/pro-solid-svg-icons";
import { HapticTab } from "@/components/HapticTab";
import BlurTabBarBackground from "@/components/ui/TabBarBackground.ios";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: BlurTabBarBackground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <FontAwesomeIcon
              icon={focused ? faHouseSolid : faHouseRegular}
              size={24}
              color={focused ? "#000" : "#666"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ focused }) => (
            <FontAwesomeIcon
              icon={focused ? faSearchSolid : faSearchRegular}
              size={24}
              color={focused ? "#000" : "#666"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          tabBarLabel: "Likes",
          tabBarIcon: ({ focused }) => (
            <FontAwesomeIcon
              icon={focused ? faHeartSolid : faHeartRegular}
              size={24}
              color={focused ? "#000" : "#666"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <FontAwesomeIcon
              icon={focused ? faUserSolid : faUserRegular}
              size={24}
              color={focused ? "#000" : "#666"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
