import { Text } from "react-native";

const Header = ({ title }: any) => (
  <Text
    className="text-xl font-semibold"
    style={{ color: "#fff", fontWeight: "bold" }}
  >
    {title}
  </Text>
);
export default Header;
