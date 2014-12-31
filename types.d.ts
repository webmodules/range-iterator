/// <reference path="require.d.ts" />

declare module "debug" {
  function debug(namespace: string): (format: string, ...args: any[]) => void;
  export = debug;
}

declare module "dom-iterator" {
  class Iterator {
    constructor(node: Node, root?: Node);
    public reset(node?: Node): Iterator;
    public revisit(revisit?: boolean): Iterator;
    public opening(): Iterator;
    public atOpening(): Iterator;
    public closing(): Iterator;
    public atClosing(): Iterator;
    public next(type: number): Node;
    public prev(type: number): Node;
    public previous(type: number): Node;
    public select(expr: any): Iterator;
    public selects(node: Node, peek: boolean): boolean;
    public reject(expr: any): Iterator;
    public rejects(node: Node, peek: boolean): boolean;
    public higher(node: Node): boolean;
    public compile(expr: any): (node?: Node) => boolean;
    public peak(expr?: any, n?: number): Node;
    public peek(expr?: any, n?: number): Node;
    public use(fn: (iterator: Iterator) => void ): Iterator;
  }
  export = Iterator;
}

declare module "node-contains" {
  function contains(node: Node, other: Node): boolean;
  export = contains;
}
