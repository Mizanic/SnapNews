import { Share, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface ShareButtonProps {
    newsSourceUrl: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ newsSourceUrl }) => {
    const onShare = async () => {
        try {
            const result = await Share.share({
                message: `📰 *Top Story on SnapNews*\n\nRead more: ${newsSourceUrl}\n\nShared via SnapNews – Stay informed, stay ahead.`,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log("Shared with activity type: ", result.activityType);
                } else {
                    console.log("Shared");
                }
            } else if (result.action === Share.dismissedAction) {
                console.log("Share dismissed");
            }
        } catch (error: any) {
            console.error("Error while sharing: ", error.message);
        }
    };

    return (
        <TouchableOpacity onPress={onShare}>
            <MaterialIcons name="share" size={24} color="#555" />
        </TouchableOpacity>
    );
};

export default ShareButton;
