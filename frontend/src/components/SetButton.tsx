import axios from "axios";
import { useAppSelector } from "../app/hooks";

function SetButton({ submit }: any) {
  const currentStatus = useAppSelector((state) => state.recordStatus);

  const handleSet = async (process: string) => {
    const login = localStorage.getItem("login");
    console.log("Sending request with process:", process);

    await axios.post(
      `http://localhost:8000/graphql`,
      {
        query: `
          mutation SetRecord($login: String!, $process: String!) {
            setRecord(login: $login, process: $process)
          }
        `,
        variables: { login, process },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    submit();
  };

  return (
    <div>
      {currentStatus.status.options === "start" && (
        <button onClick={() => handleSet("start")}>Start</button>
      )}

      {currentStatus.status.options === "start break or go home" && (
        <div>
          <button onClick={() => handleSet("startBreak")}>Start Break</button>
          <button onClick={() => handleSet("goHome")}>Go Home</button>
        </div>
      )}

      {currentStatus.status.options === "finish break or go home" && (
        <div>
          <button onClick={() => handleSet("finishBreak")}>Finish Break</button>
          <button onClick={() => handleSet("goHome")}>Go Home</button>
        </div>
      )}
    </div>
  );
}

export default SetButton;
