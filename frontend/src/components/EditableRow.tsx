import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { extendedRecord } from "../features/record/issues";
import simpleRequest from "../features/simpleSend";

type RecordRowProps = { record: extendedRecord };

function EditableRow({
  record,
  onEdit,
}: RecordRowProps & { onEdit: () => void }) {
  const [isEdited, setIsEdited] = useState<boolean>(false);

  const handleWorkHoursSubmit = async () => {
    setIsEdited(false);

    const hoursInMilliseconds = parseInt(hours, 10) * 60 * 60 * 1000;
    const minutesInMilliseconds = parseInt(minutes, 10) * 60 * 1000;

    const countedTime = hoursInMilliseconds + minutesInMilliseconds;

    await simpleRequest.record.correctRecord({
      login: record.login,
      date: new Date(record.date).toISOString(),
      value: countedTime,
    });

    onEdit();

    return true;
  };

  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  const handleHoursChange = (event: { target: { value: any } }) => {
    const inputHours = event.target.value;

    if (inputHours === "" || (inputHours >= 0 && inputHours <= 23)) {
      setHours(inputHours);
      setIsEdited(true);
    }
  };

  const handleMinutesChange = (event: { target: { value: any } }) => {
    const inputMinutes = event.target.value;

    if (inputMinutes === "" || (inputMinutes >= 0 && inputMinutes <= 59)) {
      setMinutes(inputMinutes);
      setIsEdited(true);
    }
  };

  return (
    <tr key={record.login}>
      <td>{record.login}</td>
      <td>{record.name}</td>
      <td>
        {new Date(record.date).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        })}
      </td>
      <td>{record.start}</td>
      <td>
        <input
          type="text"
          placeholder="hours"
          value={hours}
          onChange={handleHoursChange}
        />
        :
        <input
          type="text"
          placeholder="minutes"
          value={minutes}
          onChange={handleMinutesChange}
        />
        {isEdited && <button onClick={handleWorkHoursSubmit}>Submit</button>}
      </td>
    </tr>
  );
}

export default EditableRow;
