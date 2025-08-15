import React from 'react';

export function RendererShareLink(props: any) {
  const { record } = props;

  function onOpenEventClickHandler() {
    const openEvent = new CustomEvent('open', {
      detail: {
        id: record.nid,
        link: record.shareLink,
      },
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(openEvent);
  }

  if (record?.type === 'A') {
    return (
      <div className="cursor-link" onClick={onOpenEventClickHandler}>
        <a>{record.shareLinkShow}</a>
      </div>
    );
  } else {
    return <div>{record.shareContent}</div>;
  }
}
