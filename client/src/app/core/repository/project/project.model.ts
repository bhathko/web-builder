import { IDynamicElement } from '../../model/Config';

export type SaveProjectReq = {
  id?: string;
  name: string;
  component: IDynamicElement;
};

export type SaveProjectRes = {
  data: {
    _id: string;
    name: string;
    lastModifyDate: string;
    component: IDynamicElement;
  };
  message: string;
};
