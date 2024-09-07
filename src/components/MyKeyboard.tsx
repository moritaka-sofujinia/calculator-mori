import * as React from "react";
import Button from "./Button";
import { View, Text } from "react-native";
import { Styles } from "../styles/GlobalStyles";
import { myColors } from "../styles/Colors";

export default function MyKeyboard() {
  const [firstLine, setFirstLine] = React.useState("");
  const [secondLine, setSecondLine] = React.useState("");
  
  // 4 biến lưu trữ giá trị
  const [firstNumber, setFirstNumber] = React.useState<string | null>(null);
  const [operator, setOperator] = React.useState<string | null>(null);
  const [secondNumber, setSecondNumber] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<number | null>(null);

  const handleNumberPress = (buttonValue: string) => {
    if (result !== null) {
      // Nếu có kết quả, reset và bắt đầu phép tính mới
      setResult(null);
      setFirstNumber(buttonValue);
      setOperator(null);
      setSecondNumber(null);
      setFirstLine(buttonValue);
      setSecondLine("");
    } else if (operator === null) {
      // Nếu chưa có dấu, thêm vào số đầu tiên
      if ((firstNumber && firstNumber.length < 10) || firstNumber === null) {
        const updatedFirst = (firstNumber || "") + buttonValue;
        setFirstNumber(updatedFirst);
        setFirstLine(updatedFirst);  // Hiển thị số đầu tiên
      }
    } else {
      // Nếu đã có dấu, thêm vào số thứ hai
      if ((secondNumber && secondNumber.length < 10) || secondNumber === null) {
        const updatedSecond = (secondNumber || "") + buttonValue;
        setSecondNumber(updatedSecond);
        setFirstLine(`${firstNumber} ${operator} ${updatedSecond}`);  // Hiển thị đầy đủ
      }
    }
  };
  

  const handleOperationPress = (buttonValue: string) => {
    if (result !== null) {
      // Nếu có kết quả, reset và bắt đầu phép tính mới với dấu mới
      setResult(null);
      setFirstNumber(secondLine);  // Số đầu tiên là kết quả của phép tính trước
      setOperator(buttonValue);
      setSecondNumber(null);
      setFirstLine(`${secondLine} ${buttonValue}`);
      setSecondLine("");
    } else if (firstNumber) {
      setOperator(buttonValue);
      setFirstLine(`${firstNumber} ${buttonValue}`);  // Hiển thị số đầu và dấu
    }
  };

  const clear = () => {
    setFirstLine("");
    setSecondLine("");
    setFirstNumber(null);
    setOperator(null);
    setSecondNumber(null);
    setResult(null);
  };

  const getResult = () => {
    if (firstNumber && secondNumber && operator) {
      let computedResult: number | null = null;
      switch (operator) {
        case "+":
          computedResult = parseFloat(firstNumber) + parseFloat(secondNumber);
          break;
        case "-":
          computedResult = parseFloat(firstNumber) - parseFloat(secondNumber);
          break;
        case "*":
          computedResult = parseFloat(firstNumber) * parseFloat(secondNumber);
          break;
        case "/":
          computedResult = parseFloat(firstNumber) / parseFloat(secondNumber);
          break;
        default:
          computedResult = 0;
          break;
      }
      // Làm tròn đến 2 chữ số sau dấu thập phân
      if (computedResult !== null) {
        computedResult = parseFloat(computedResult.toFixed(2));
      }
      setResult(computedResult);
      setSecondLine(computedResult !== null ? computedResult.toString() : "");  // Hiển thị kết quả ở secondLine
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
        {/* Hiển thị firstLine */}
        <Text style={Styles.screenFirstNumber}>{firstLine}</Text>
        {/* Hiển thị secondLine (kết quả) với màu xanh blue */}
        <Text style={[Styles.screenSecondNumber, { color: myColors.blue }]}>
          {secondLine}
        </Text>
      </View>
      <View style={Styles.row}>
        <Button title="C" isGray onPress={clear} />
        <Button title="( )" isGray onPress={() => {}} />
        <Button title="％" isGray onPress={() => {}} />
        <Button title="÷" isBlue onPress={() => handleOperationPress("/")} />
      </View>
      <View style={Styles.row}>
        <Button title="7" onPress={() => handleNumberPress("7")} />
        <Button title="8" onPress={() => handleNumberPress("8")} />
        <Button title="9" onPress={() => handleNumberPress("9")} />
        <Button title="×" isBlue onPress={() => handleOperationPress("*")} />
      </View>
      <View style={Styles.row}>
        <Button title="4" onPress={() => handleNumberPress("4")} />
        <Button title="5" onPress={() => handleNumberPress("5")} />
        <Button title="6" onPress={() => handleNumberPress("6")} />
        <Button title="-" isBlue onPress={() => handleOperationPress("-")} />
      </View>
      <View style={Styles.row}>
        <Button title="1" onPress={() => handleNumberPress("1")} />
        <Button title="2" onPress={() => handleNumberPress("2")} />
        <Button title="3" onPress={() => handleNumberPress("3")} />
        <Button title="+" isBlue onPress={() => handleOperationPress("+")} />
      </View>
      <View style={Styles.row}>
        <Button title="." onPress={() => handleNumberPress(".")} />
        <Button title="0" onPress={() => handleNumberPress("0")} />
        <Button title="⌫" onPress={() => setFirstLine(firstLine.slice(0, -1))} />
        <Button title="=" isBlue onPress={getResult} />
      </View>
    </View>
  );
}
