import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { api } from "@/utils/api";
import type { RouterOutputs } from "@/utils/api";

type Post = RouterOutputs["post"]["feed"][0];

const PostItem = ({ item }: { item: Post }) => (
  <View className="p-4 bg-white border-b border-gray-200">
    <View className="flex-row items-center gap-2 mb-2">
      {item.author.profile?.picture?.url && (
        <Image
          source={{ uri: item.author.profile.picture.url }}
          className="w-8 h-8 rounded-full"
        />
      )}
      <Text className="font-bold">{item.author.username}</Text>
    </View>

    {item.media[0]?.url && (
      <Image
        source={{ uri: item.media[0].url }}
        className="w-full aspect-square"
      />
    )}

    <Text className="mt-2">{item.caption}</Text>

    <View className="flex-row items-center gap-2 mt-2">
      <Text>{item.likes.length} likes</Text>
    </View>
  </View>
);

const HomeScreen = () => {
  const { data: posts, isLoading } = api.post.feed.useQuery();

  if (isLoading) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!posts?.length) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-600">No posts found</Text>
        <Text className="text-sm text-gray-500 mt-2">
          Follow some users to see their posts
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlashList
        data={posts}
        renderItem={({ item }) => <PostItem item={item} />}
        estimatedItemSize={400}
        keyExtractor={(item: Post) => item.id}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
