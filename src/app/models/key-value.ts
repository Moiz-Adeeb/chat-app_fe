export class KeyValue {
  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }

  key: string;
  value: string;
}

export class DropDownItem {
  constructor(
    public id: any,
    public value: string,
  ) {}
}
