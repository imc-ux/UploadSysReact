import React from 'react';
import { UpSquareTwoTone } from '@ant-design/icons';

export function RendererShareTitleLink(props: any) {
  const { record } = props;

  function onLinkClickHandler() {
    const linkEvent = new CustomEvent('clickPop', {
      detail: {
        record: record,
      },
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(linkEvent);
  }

  return (
    <div onClick={onLinkClickHandler}>
      {record.toTop === 1 && <UpSquareTwoTone className="margin-right-5" />}
      <a>
        <label className="cursor-link">{record.shareTitle}</label>
      </a>
    </div>
  );
}
