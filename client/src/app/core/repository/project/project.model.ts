import { IDynamicElement } from '../../model/Config.type';

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

export type AllProjectData = {
  data: ProjectData[];
  message: string;
};

export type ProjectData = {
  id: string;
  name: string;
  lastModifyDate: string;
};
