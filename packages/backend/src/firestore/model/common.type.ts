import { Doc, Ref } from 'typesaurus';

export { Cursor } from 'typesaurus';

export type Districts = {
  [largeDistrict: string]: string[];
};

export type Identity<T> = string | T | Doc<T> | Ref<T>;
