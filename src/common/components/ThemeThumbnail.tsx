interface ThemeThumbnailProps {
  selected: boolean;
  themeInfo: any;
}

export default function ThemeThumbnail(props: ThemeThumbnailProps) {
  const { selected, themeInfo } = props;

  return (
    <div w-170px h-130px mb-35px cursor-pointer flex items-end>
      <div h-full mr-6px>
        <img
          w-144px
          h-full
          rounded-3px
          border-solid
          border-3px
          style={{ borderColor: themeInfo.color }}
          src={themeInfo.img}
        />
      </div>
      <div
        flex
        items-center
        justify-center
        border-1
        style={{ backgroundColor: themeInfo.color }}
        w-20px
        h-20px
        border="~ solid rounded-1/2 blue"
      >
        {selected && <span c-white className="i-mdi-check-bold" />}
      </div>
    </div>
  );
}
