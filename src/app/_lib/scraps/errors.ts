export class ScrapNotFoundError extends Error {
  constructor(message = "スクラップが見つかりません。") {
    super(message);
    this.name = "ScrapNotFoundError";
  }
}

export class ScrapConflictError extends Error {
  constructor(message = "同じslugのスクラップがすでに存在します。") {
    super(message);
    this.name = "ScrapConflictError";
  }
}
