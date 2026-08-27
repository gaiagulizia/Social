// Questa schermata non viene mai mostrata: il tap sulla tab "+" viene
// intercettato in app/(tabs)/_layout.tsx e apre invece la modale create-post.
import { View } from "react-native";

export default function CreateTabPlaceholder() {
  return <View />;
}
