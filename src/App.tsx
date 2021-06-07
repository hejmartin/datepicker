import "./styles.css";
import { useDatePicker } from "./DatePicker";
import { isSaturday, isSunday } from "date-fns";

export default function App() {
  const firstDate = useDatePicker(new Date());
  const secondDate = useDatePicker(new Date());

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <input {...firstDate.inputProps} />
      <firstDate.DatePicker
        disabledDateFilter={(date) => isSaturday(date) || isSunday(date)}
      />
      <input {...secondDate.inputProps} />
      <secondDate.DatePicker
        disabledDateFilter={(date) => isSaturday(date) || isSunday(date)}
      />
    </div>
  );
}
