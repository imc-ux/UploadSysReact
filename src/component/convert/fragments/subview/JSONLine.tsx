import { useContext } from "react";
import { IRow, jsonContext } from "../JSON";

export interface ILine extends IRow {
  index: number;
}

export default function Line(props: ILine) {
  const { type, index, expand } = props;
  const { onToggleClick } = useContext(jsonContext);

  function buttonClasses() {
    return expand ? "triangle-button-open" : "triangle-button-close";
  }

  return (
    <div className="JSONLine-div">
      <div className="JSONLine-index-div">
        <span className="JSONLine-index-span">{index + 1}</span>
      </div>
      {(type === "object" || "Array") && typeof expand === "boolean" && (
        <div className="JSONLine-button-div">
          <button
            style={{ height: "20px", width: "20px" }}
            onClick={() => onToggleClick(props)}
            className={buttonClasses()}
          ></button>
        </div>
      )}
    </div>
  );
}
