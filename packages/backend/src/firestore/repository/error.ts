/* eslint-disable max-classes-per-file */
export class OfferAlreadyExist extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = 'OfferAlreadyExist';
  }
}

export class ApplicationAlreadyExist extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = 'ApplicationAlreadyExist';
  }
}

export class ContractAlreadyExist extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = 'ContractAlreadyExist';
  }
}
