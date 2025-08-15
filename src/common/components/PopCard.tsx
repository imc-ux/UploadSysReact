import { useEffect, useState } from "react";

interface PopCardProps {
  open: boolean;
  content: any;
  children: any;
  onClose: () => void;
}

export default function PopCard(props: PopCardProps) {
  const [showCard, setShowCard] = useState(props.open);

  useEffect(() => {
    setShowCard(props.open ?? false);
  }, [props.open]);

  function onLanguageModalClickHandler() {
    setShowCard(false);
    props.onClose();
  }

  return (
    <div className="relative">
      {props.content}
      <div
        className={`absolute z-2 pop-card-bg rounded-md top-full left-50% -translate-x-50% mt-20px ${
          showCard ? "" : "hidden"
        }`}
      >
        <div className="relative">
          <div className="absolute pop-card-bg h-10px w-10px rotate-45 -top-5px left-50% -translate-x-50% z-2"></div>
          {props.children}
        </div>
      </div>
      {showCard && (
        <div
          className="fixed w-screen h-screen z-1 inset-0"
          onClick={onLanguageModalClickHandler}
        ></div>
      )}
    </div>
  );
}
