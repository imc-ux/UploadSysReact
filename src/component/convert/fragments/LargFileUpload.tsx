export default function LargFileUpload() {
  function onFileInputChangeHandler(e: any) {
    console.log("---->", e.target.files);
  }

  return (
    <div flex="~ col">
      Hello
      <div>
        <input type="file" onChange={onFileInputChangeHandler} />
      </div>
    </div>
  );
}
