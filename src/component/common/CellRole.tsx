import { useState, useRef, useContext, useEffect } from "react";
import type { InputRef } from "antd";
import { Form, Input } from "antd";
import { EditableContext } from "@/component/common/RowRole";
import { EditableCellProps } from "@/vo/Role";

export default function EditableCell(props: EditableCellProps) {
  const {
    title,
    editable,
    children,
    dataIndex,
    record,
    handlesave,
    ...restProps
  } = props;
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;
  const [maxlength, setMaxLength] = useState(0);

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
    isCellEditor();
  }, [editing]);

  function isCellEditor() {
    const editorEvent = new CustomEvent("cellEditor", {
      detail: {
        isCellEditor: editing,
      },
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(editorEvent);
  }

  function toggleEdit() {
    setEditing(!editing);

    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    if (dataIndex === "name") {
      setMaxLength(255);
    } else if (dataIndex === "code") {
      setMaxLength(50);
    } else if (dataIndex === "description") {
      setMaxLength(500);
    }
  }

  async function saveEdit() {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handlesave({ ...record, ...values });
    } catch (errInfo) {}
  }

  function onPreventDrop(e: React.DragEvent<HTMLInputElement>) {
    e.preventDefault();
  }

  let childNode = children;
  if (editable && record?.code !== "manager") {
    childNode = editing ? (
      <Form.Item
        name={dataIndex}
        style={{ height: 5, lineHeight: 5, marginLeft: 20, marginRight: 20 }}
      >
        <Form>
          <Input
            className="input-space"
            type="text"
            autoComplete="off"
            ref={inputRef}
            defaultValue={children as any[1]}
            onPressEnter={saveEdit}
            onBlur={saveEdit}
            onDrop={onPreventDrop}
            maxLength={maxlength}
          />
        </Form>
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ height: 22 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return (
    <td
      {...restProps}
      style={{ height: 73, padding: 0, margin: 0, textAlign: "center" }}
    >
      {childNode}
    </td>
  );
}
