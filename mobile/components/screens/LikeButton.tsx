import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { addLike, removeLike } from "@/dux/action/like/likeActions";
import { useDispatch } from "react-redux";

interface LikeButtonProps {
    url_hash : string;
    isLiked : boolean,
}

const LikeButton = ({url_hash,isLiked} : LikeButtonProps) => {
    const dispatch = useDispatch();
  
  const toggleLike = () => {
        if (!isLiked) {
          dispatch(addLike(url_hash));
        } else {
          dispatch(removeLike(url_hash));
        }
      };

  return (
    <TouchableOpacity onPress={toggleLike}>
      <MaterialIcons
        name={isLiked ? "thumb-up-alt" : "thumb-up-off-alt"}
        size={24}
        color="#555"
      />
    </TouchableOpacity>
  );
};

export default LikeButton;
