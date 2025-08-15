import React, { useState, useEffect } from 'react';
import { WarningTwoTone, CloseOutlined } from '@ant-design/icons';

interface ComponentProps {
  alertText: string;
  isShow: boolean[];
}

export default function Alert(props: ComponentProps) {
  const [rotatex, setRotatex] = useState('');
  const [block, setBlock] = useState('none');
  const [delaytime, setDelaytime] = useState('1s');
  const [durationtime, setDurationtime] = useState('0.5s');
  const { isShow, alertText } = props;
  const transitionStyle = { transform: rotatex, transitionDelay: delaytime, transitionDuration: durationtime };
  const warndisplay = { display: block };

  useEffect(() => {
    if (isShow[0]) {
      setBlock('block');
      rotate();
    }
  }, [isShow]);

  function rotate(state: boolean = true) {
    if (state) {
      setRotatex('scale(0.3) rotateX(990deg) translateZ(10px)');
      setDelaytime('2s');
      setDurationtime('0.5s');
    } else {
      setRotatex('');
      setDelaytime('0s');
      setDurationtime('0s');
    }
  }

  function onAlertHideHandler() {
    setBlock('none');
    rotate(false);
  }

  function onCloseWarnClickHandler() {
    onAlertHideHandler();
  }

  return (
    <div className="alert-box" onTransitionEnd={onAlertHideHandler} style={transitionStyle}>
      <div className="alert-content-box" style={warndisplay}>
        <WarningTwoTone twoToneColor="#f1b53b" className="warnpicture" />
        <div className="warntip">{alertText}</div>
        <CloseOutlined twoToneColor="blue" className="alert-close" onClick={onCloseWarnClickHandler}>
          关闭
        </CloseOutlined>
      </div>
    </div>
  );
}
