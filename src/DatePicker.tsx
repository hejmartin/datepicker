// https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/datepicker-dialog.html

import {
  DetailedHTMLProps,
  FC,
  FocusEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  useEffect,
  useRef,
  useState
} from "react";
import {
  startOfMonth,
  startOfWeek,
  getMonth,
  addWeeks,
  addDays,
  isSameDay,
  getDate,
  subDays,
  format,
  subMonths,
  subYears,
  addMonths,
  addYears,
  parse,
  isValid
} from "date-fns";

function getAllWeeksInMonth(date: Date): Date[][] {
  const firstDayOfMonth = startOfMonth(date);
  const weeks: Date[][] = [];

  let firstDayOfWeek = startOfWeek(firstDayOfMonth);
  do {
    weeks.push([
      firstDayOfWeek,
      addDays(firstDayOfWeek, 1),
      addDays(firstDayOfWeek, 2),
      addDays(firstDayOfWeek, 3),
      addDays(firstDayOfWeek, 4),
      addDays(firstDayOfWeek, 5),
      addDays(firstDayOfWeek, 6)
    ]);
    firstDayOfWeek = addWeeks(firstDayOfWeek, 1);
  } while (getMonth(firstDayOfWeek) === getMonth(date));

  return weeks;
}

const Day: FC<{
  focused: boolean;
  date: Date;
  focusable: boolean;
  current: boolean;
  onClick: () => void;
  disabled?: boolean;
}> = ({
  focused,
  date,
  focusable,
  current = false,
  onClick,
  disabled = false
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (focused) {
      buttonRef.current?.focus();
    }
  }, [focused]);

  return (
    <td aria-selected={current}>
      <button
        ref={buttonRef}
        tabIndex={focusable ? 0 : -1}
        onClick={!disabled ? onClick : undefined}
        aria-disabled={disabled}
      >
        {current && ">"} {getDate(date)} {current && "<"} {disabled && "x"}
      </button>
    </td>
  );
};

type DatePickerProps = {
  value: Date | null;
  onChange: (date: Date) => void;
  disabledDateFilter?: (date: Date) => boolean;
};

const DatePicker: FC<DatePickerProps> = ({
  value: selectedDate = new Date(),
  onChange,
  disabledDateFilter
}) => {
  const [focusedDate, setFocusedDate] = useState(selectedDate ?? new Date());
  const [shouldFocus, setShouldFocus] = useState(false);
  const weeks = getAllWeeksInMonth(focusedDate);

  function isFocused(date: Date) {
    return isSameDay(date, focusedDate);
  }

  function isSelected(date: Date) {
    return selectedDate == null ? false : isSameDay(date, selectedDate);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTableSectionElement>) {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        setFocusedDate(addDays(focusedDate, 1));
        break;
      case "ArrowLeft":
        e.preventDefault();
        setFocusedDate(subDays(focusedDate, 1));
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocusedDate(addDays(focusedDate, 7));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedDate(subDays(focusedDate, 7));
        break;
    }
  }

  function selectDate(date: Date) {
    setFocusedDate(date);
    onChange?.(date);
  }

  return (
    <div>
      <div>
        <button
          aria-label="Previous year"
          onClick={() => setFocusedDate(subYears(focusedDate, 1))}
        >
          &lt;&lt;
        </button>
        <button
          aria-label="Previous month"
          onClick={() => setFocusedDate(subMonths(focusedDate, 1))}
        >
          &lt;
        </button>
        <h2 aria-live="polite" id="title">
          {format(focusedDate, "LLLL y")}
        </h2>
        <button
          aria-label="Next month"
          onClick={() => setFocusedDate(addMonths(focusedDate, 1))}
        >
          &gt;
        </button>
        <button
          aria-label="Next year"
          onClick={() => setFocusedDate(addYears(focusedDate, 1))}
        >
          &gt;&gt;
        </button>
      </div>
      <table role="grid" aria-labelledby="title">
        <thead>
          <tr>
            <th>
              <abbr title={format(startOfWeek(new Date()), "cccc")}>
                {format(startOfWeek(new Date()), "ccccc")}
              </abbr>
            </th>
            <th>
              <abbr title={format(addDays(startOfWeek(new Date()), 1), "cccc")}>
                {format(addDays(startOfWeek(new Date()), 1), "ccccc")}
              </abbr>
            </th>
            <th>
              <abbr title={format(addDays(startOfWeek(new Date()), 2), "cccc")}>
                {format(addDays(startOfWeek(new Date()), 2), "ccccc")}
              </abbr>
            </th>
            <th>
              <abbr title={format(addDays(startOfWeek(new Date()), 3), "cccc")}>
                {format(addDays(startOfWeek(new Date()), 3), "ccccc")}
              </abbr>
            </th>
            <th>
              <abbr title={format(addDays(startOfWeek(new Date()), 4), "cccc")}>
                {format(addDays(startOfWeek(new Date()), 4), "ccccc")}
              </abbr>
            </th>
            <th>
              <abbr title={format(addDays(startOfWeek(new Date()), 5), "cccc")}>
                {format(addDays(startOfWeek(new Date()), 5), "ccccc")}
              </abbr>
            </th>
            <th>
              <abbr title={format(addDays(startOfWeek(new Date()), 6), "cccc")}>
                {format(addDays(startOfWeek(new Date()), 6), "ccccc")}
              </abbr>
            </th>
          </tr>
        </thead>
        <tbody
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            setShouldFocus(true);
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as HTMLElement)) {
              setShouldFocus(false);
            }
          }}
        >
          {weeks.map((dates) => (
            <tr>
              {dates.map((date) => (
                <Day
                  current={isSelected(date)}
                  date={date}
                  disabled={disabledDateFilter?.(date) ?? false}
                  focusable={isFocused(date)}
                  focused={shouldFocus && isFocused(date)}
                  key={date.toString()}
                  onClick={() => selectDate(date)}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DatePicker;

const FocusTrap: FC = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as HTMLElement)) {
      ref.current
        ?.querySelector<HTMLElement>(
          "a, button, input, textarea, select, details, [tabindex]:not([tabindex='-1']"
        )
        ?.focus();
    }
  };

  return (
    <div ref={ref} onBlur={handleBlur}>
      {children}
    </div>
  );
};

type UseDatePickerOptions = {};

export function useDatePicker(
  initialValue = new Date(),
  options?: UseDatePickerOptions
) {
  const [value, setValue] = useState(initialValue);
  const [inputValue, setInputValue] = useState(format(value, "P"));

  useEffect(() => {
    setInputValue(format(value, "P"));
  }, [value]);

  useEffect(() => {
    try {
      const parsedDate = parse(inputValue, "P", new Date());
      if (isValid(parsedDate)) {
        setValue(parsedDate);
      }
    } catch {}
  }, [inputValue]);

  const inputProps: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > = {
    value: inputValue,
    onChange: (e) => setInputValue(e.target.value)
  };

  return {
    inputProps,
    value,
    DatePicker: (props: Omit<DatePickerProps, "value" | "onChange">) => (
      <div
        // Identifies the element as a dialog
        role="dialog"
        // Indicates the dialog is modal
        aria-modal="true"
        aria-labelledby="title"
      >
        <FocusTrap>
          <DatePicker
            value={value}
            onChange={(date) => setValue(date)}
            {...props}
          />
        </FocusTrap>
      </div>
    )
  };
}
