import axios from "axios";
import { useAppSelector } from "../app/hooks";

function SetButton({ submit }: any) {
  const currentStatus = useAppSelector((state) => state.recordStatus);

  const fetchingProps = {
    login: currentStatus.status.recordData.login,
    process: currentStatus.status.options,
  };

  const handleSet = async () => {
    console.log("wfwefe");
    await axios.post(
      `http://localhost:8000/graphql`,
      {
        query: `
            mutation SetRecord($login: String!, $process: String!) {
                setRecord(login: $login, process: $process)
              }
              `,
        variables: fetchingProps,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    submit();
  };

  return <button onClick={handleSet}>{currentStatus.status.options}</button>;
}

export default SetButton;
