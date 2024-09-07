import * as React from "react";
import Button from "./Button";
import { View, Text } from "react-native";
import { Styles } from "../styles/GlobalStyles";
import { myColors } from "../styles/Colors";

export default function MyKeyboard() {
  const [input, setInput] = React.useState("");  // Chuỗi input lưu biểu thức
  const [result, setResult] = React.useState<string | null>(null);
  const [openBrackets, setOpenBrackets] = React.useState(0);  // Theo dõi số lượng ngoặc mở
  const [isResultDisplayed, setIsResultDisplayed] = React.useState(false);  // Theo dõi trạng thái sau khi hiển thị kết quả

  // Hàm xử lý nhập số hoặc toán tử
  const handlePress = (buttonValue: string) => {
    if (isResultDisplayed) {
      // Nếu kết quả đã được hiển thị, reset và bắt đầu lại phép tính mới
      setInput(buttonValue);
      setResult(null);
      setOpenBrackets(0);
      setIsResultDisplayed(false);
    } else if (input.length < 10) {  // Giới hạn chuỗi nhập vào 10 ký tự
      setInput((prevInput) => prevInput + buttonValue);
    }
  };

  // Hàm xử lý ngoặc mở và đóng
  const handleBracketPress = () => {
    if (isResultDisplayed) {
      // Reset nếu kết quả đã hiển thị
      setInput("(");
      setResult(null);
      setOpenBrackets(1);
      setIsResultDisplayed(false);
    } else if (input === "" || "+-*/(".includes(input.slice(-1))) {
      setInput((prevInput) => prevInput + "(");
      setOpenBrackets(openBrackets + 1);
    } else if (openBrackets > 0 && !"+-*/(".includes(input.slice(-1))) {
      setInput((prevInput) => prevInput + ")");
      setOpenBrackets(openBrackets - 1);
    }
  };

  // Hàm xử lý nút phần trăm
  const handlePercentPress = () => {
    if (isResultDisplayed) {
      // Nếu kết quả đã hiển thị, reset và bắt đầu phép tính mới với phần trăm
      setInput("0.01");
      setResult(null);
      setOpenBrackets(0);
      setIsResultDisplayed(false);
    } else {
      // Cho phép người dùng nhập dấu phần trăm
      if (input.length < 10 && !input.endsWith("%")) {
        setInput((prevInput) => prevInput + "%");
      }
    }
  };

  // Hàm xóa tất cả
  const clear = () => {
    setInput("");
    setResult(null);
    setOpenBrackets(0);
    setIsResultDisplayed(false);  // Reset trạng thái hiển thị kết quả
  };

  // Hàm tính toán kết quả
  const calculateResult = () => {
    try {
      if (openBrackets === 0) {
        // Xử lý phần trăm trước khi tính toán
        const computedInput = input.replace(/(\d+(\.\d+)?)%/g, (match) => {
          const number = parseFloat(match.replace("%", ""));
          return (number / 100).toString();
        });

        const computedResult = eval(computedInput);  // Cẩn thận khi dùng eval
        let resultString: string;

        // Kiểm tra nếu kết quả là số thực với phần thập phân
        if (computedResult % 1 !== 0) {
          resultString = parseFloat(computedResult.toFixed(2)).toString();  // Làm tròn và chuyển đổi thành chuỗi
        } else {
          resultString = computedResult.toString();  // Chỉ chuyển đổi thành chuỗi nếu là số nguyên
        }

        setResult(resultString);
        setIsResultDisplayed(true); // Đặt isResultDisplayed thành false sau khi tính toán
      } else {
        setResult("Error");
      }
    } catch (error) {
      setResult("Error");
    }
  };

  return (
    <View style={Styles.viewBottom}>
      <View
        style={{
          height: 120,
          width: "90%",
          justifyContent: "flex-end",
          alignSelf: "center",
        }}
      >
        {/* Hiển thị biểu thức input */}
        <Text style={Styles.screenFirstNumber}>{input}</Text>
        {/* Hiển thị kết quả */}
        <Text style={[Styles.screenSecondNumber, { color: myColors.blue }]}>
          {result}
        </Text>
      </View>
      <View style={Styles.row}>
        <Button title="C" isGray onPress={clear} />
        <Button title="( )" isGray onPress={handleBracketPress} />
        <Button title="%" isGray onPress={handlePercentPress} />
        <Button title="÷" isBlue onPress={() => handlePress("/")} />
      </View>
      <View style={Styles.row}>
        <Button title="7" onPress={() => handlePress("7")} />
        <Button title="8" onPress={() => handlePress("8")} />
        <Button title="9" onPress={() => handlePress("9")} />
        <Button title="×" isBlue onPress={() => handlePress("*")} />
      </View>
      <View style={Styles.row}>
        <Button title="4" onPress={() => handlePress("4")} />
        <Button title="5" onPress={() => handlePress("5")} />
        <Button title="6" onPress={() => handlePress("6")} />
        <Button title="-" isBlue onPress={() => handlePress("-")} />
      </View>
      <View style={Styles.row}>
        <Button title="1" onPress={() => handlePress("1")} />
        <Button title="2" onPress={() => handlePress("2")} />
        <Button title="3" onPress={() => handlePress("3")} />
        <Button title="+" isBlue onPress={() => handlePress("+")} />
      </View>
      <View style={Styles.row}>
        <Button title="." onPress={() => handlePress(".")} />
        <Button title="0" onPress={() => handlePress("0")} />
        <Button title="⌫" onPress={() => setInput(input.slice(0, -1))} />
        <Button title="=" isBlue onPress={calculateResult} />
      </View>
    </View>
  );
}
