import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { addBookmark, removeBookmark } from "../../dux/action/bookmark/bookmarkActions";
import { NewsItem } from "../../model/newsItem";
import { useDispatch, useSelector } from "react-redux";


interface BookmarkButtonProps {
    news : NewsItem;
    isBookmarked : boolean,
}

const BookmarkButton = ({ news, isBookmarked }: BookmarkButtonProps) => {
    const dispatch = useDispatch();
  
    const toggleBookmark = () => {
      if (!isBookmarked) {
        dispatch(addBookmark(news));
      } else {
        dispatch(removeBookmark(news.item_hash));
      }
    };
  
    return (
      <TouchableOpacity onPress={toggleBookmark}>
        <MaterialIcons
          name={isBookmarked ? "bookmark-added" : "bookmark-add"}
          size={24}
          color="#555"
        />
      </TouchableOpacity>
    );
  };
  

export default BookmarkButton;
