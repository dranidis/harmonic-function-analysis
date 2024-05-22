interface Equatable<T> {
  equals(other: T): boolean;
}

class UserId implements Equatable<UserId> {
  private _userId: void = undefined;
  private value = 0;
  equals(other: UserId): boolean {
    return this.value === other.value;
  }

  constructor(value: number) {  
    this.value = value;
  }
}

class ProductId implements Equatable<ProductId> {
  private _productId: void = undefined;
  private value = 0;
  equals(other: ProductId): boolean {
    return this.value === other.value;
  }

  constructor(value: number) {
    this.value = value;
  }
}

class IdSet<T extends Equatable<T>> {
  private items: Set<string> = new Set();

  private serializeKey(key: T): string {
    return JSON.stringify(key);
  }

  public add(item: T): void {
      this.items.add(this.serializeKey(item));
  }

  public contains(item: T): boolean {
    return this.items.has(this.serializeKey(item));
  }

  public delete(item: T): boolean {
    return this.items.delete(this.serializeKey(item));
  }

}

class IdMap<K extends Equatable<K>, V> {
  private items: Map<string, [K, V]> = new Map();

  private serializeKey(key: K): string {
    return JSON.stringify(key);
  }

  public set(key: K, value: V): void {
    const serializedKey = this.serializeKey(key);
    this.items.set(serializedKey, [key, value]);
  }

  public get(key: K): V | undefined {
    const serializedKey = this.serializeKey(key);
    const entry = this.items.get(serializedKey);
    return entry ? entry[1] : undefined;
  }

  public has(key: K): boolean {
    const serializedKey = this.serializeKey(key);
    return this.items.has(serializedKey);
  }

  public delete(key: K): boolean {
    const serializedKey = this.serializeKey(key);
    return this.items.delete(serializedKey);
  }

  public values(): [K, V][] {
    return Array.from(this.items.values());
  }

  public keys(): K[] {
    return Array.from(this.items.values()).map(entry => entry[0]);
  }  
}


// CLIENT CODE

const uIda = new UserId(555);
const uIdb= new UserId(555);
const pId = new ProductId(555);


function functionForUserIds(uid: UserId) {
  console.log(uid)
}

functionForUserIds(pId);

const setUserIds = new IdSet<UserId>();

setUserIds.add(uIda)
setUserIds.add(uIdb)

console.log("Set of ids", setUserIds);

const userIdMap = new IdMap<UserId, string>();

userIdMap.set(uIda, "value for user 1");
userIdMap.set(uIdb, "update value for user 1");
userIdMap.set(new UserId(666), "value for user3");

// userIdMap.set(pId, "some value");

console.log(userIdMap.get(uIda));
console.log(userIdMap.get(uIdb));

console.log(userIdMap.values());
console.log(userIdMap.keys());



