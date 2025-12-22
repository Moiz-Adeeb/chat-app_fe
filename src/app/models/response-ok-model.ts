export class ResponseOkModel {
  private _count?: number;
  private _data: any;

  get data(): any {
    return this._data;
  }

  set data(value: any) {
    this._data = value;
  }

  get count(): number {
    return this._count ?? 0;
  }

  set count(value: number) {
    this._count = value;
  }
}
