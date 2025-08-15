import { IRow } from '../JSON';

export function getRowProps(row: any): IRow {
  return {
    id: Math.round(Math.random() * 1000000000),
    showing: true,
    comma: false,
    ...row,
  };
}

export function loopObj(input: any, params: any, ref: any) {
  const array = Array.isArray(input);
  const header = getRowProps({
    propsKey: params?.propsKey,
    propsValue: array ? ' [' : '{',
    type: array ? 'array' : 'object',
    expand: true,
    parent: params?.parent ?? [],
    level: params.level,
  });
  ref.push(header);

  const subParams: any = {
    parent: [...header.parent, header.id],
    level: header.level + 1,
  };
  const tempLoopArray = Array.from(Object.keys(input));
  tempLoopArray.forEach((element, index) => {
    const key = element;
    const value = input[key];
    const type = typeof value;
    subParams.comma = index < tempLoopArray.length - 1;

    let propertiyName = '"' + key + '"' + ':' + '\xa0\xa0\xa0';
    if (header?.type === 'array') {
      propertiyName = '';
    } else {
      propertiyName = '"' + key + '"' + ':' + '\xa0\xa0\xa0';
    }

    console.log(value, typeof value);

    if (typeof value == 'object') {
      loopObj(value, { propsKey: propertiyName, ...subParams }, ref);
    } else {
      if (type !== 'number') {
        ref.push(
          getRowProps({
            propsKey: header?.type === 'array' ? '' : '"' + key + '"' + ':' + '\xa0\xa0\xa0',
            propsValue: '"' + value.toString() + '"',
            type,
            ...subParams,
          })
        );
      } else {
        ref.push(
          getRowProps({
            propsKey: header?.type === 'array' ? '' : `"${key}"` + ':' + '\xa0\xa0\xa0',
            propsValue: value.toString(),
            type,
            ...subParams,
          })
        );
      }
    }
  });

  const tail = getRowProps({
    propsKey: '',
    propsValue: array ? ' ]' : '}',
    type: header.type,
    parent: header.parent,
    level: header.level,
    partner: header.id,
    comma: params.comma,
  });
  ref.push(tail);
  header.partner = tail.id;
}
