import React, { useState, useRef, useEffect, useContext } from 'react';
import { Input, Form, Tooltip } from 'antd';
import { PermissionInfo } from '@/vo/Permission';
import { EditableContext } from '@/component/permissionmgmt/PermissionInfoRow';
// import type { InputRef } from 'antd';

interface PermissionInfoCellProps {
  title: string;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof PermissionInfo;
  record: PermissionInfo;
  onInputEditSave: (record: PermissionInfo) => void;
}

export default function PermissionInfoCell(props: PermissionInfoCellProps) {
  const { title, editable, children, dataIndex, record, onInputEditSave, ...restProps } = props;
  const [editing, setEditing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [length, setLength] = useState(0);
  const inputRef = useRef<any>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
    isPermissionCellEditor();
  }, [editing]);

  function isPermissionCellEditor() {
    const editorEvent = new CustomEvent('permissionCellEditor', {
      detail: {
        isPermissionCellEditor: editing,
      },
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(editorEvent);
  }

  function onClickToggleEdit() {
    setVisible(false);
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    if (dataIndex === 'name') {
      setLength(255);
    } else if (dataIndex === 'code') {
      setLength(50);
    } else if (dataIndex === 'description') {
      setLength(500);
    }
  }

  async function onCellEditSave() {
    try {
      const newInfo = await form.validateFields();
      onClickToggleEdit();
      const saveInfo = { ...record, ...newInfo };
      if (saveInfo.name === record.name && saveInfo.code === record.code && saveInfo.description === record.description) {
        return;
      } else {
        onInputEditSave?.(saveInfo);
      }
    } catch (errInfo) {
      console.log('save failed!', errInfo);
    }
  }

  function onPreventEvent(event: React.DragEvent) {
    event.preventDefault();
  }

  function onShowTooltip(event: any) {
    let textLength = event.target.lastChild?.length;
    let contextWidth = event.target.parentNode.scrollWidth;
    if (contextWidth < 140 && textLength >= 10) {
      setVisible(!visible);
    } else if (textLength < 20 || textLength === undefined) {
      setVisible(false);
    } else {
      setVisible(!visible);
    }
  }

  function onCloseHandler() {
    setVisible(false);
  }

  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item name={dataIndex} style={{ margin: 0 }}>
        <Input
          ref={inputRef}
          required={true}
          onPressEnter={onCellEditSave}
          onBlur={onCellEditSave}
          allowClear
          autoComplete="off"
          maxLength={length}
          onDragOver={onPreventEvent}
        />
      </Form.Item>
    ) : (
      <Tooltip title={children} color={'cyan'} visible={visible} arrowPointAtCenter>
        <div
          className="editable-cell-value-wrap long-text"
          onMouseOver={onShowTooltip}
          onMouseLeave={onCloseHandler}
          onClick={onClickToggleEdit}
          style={{ height: 22, cursor: 'pointer' }}
        >
          {children}
        </div>
      </Tooltip>
    );
  }

  return <td {...restProps}>{childNode}</td>;
}
