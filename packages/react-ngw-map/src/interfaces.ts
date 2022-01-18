import type { CSSProperties, ReactNode } from 'react';

import type { MapAdapter } from '@nextgis/webmap';

import type { NgwMap, NgwMapOptions } from '@nextgis/ngw-map';

import type NgwConnector from '@nextgis/ngw-connector';

export interface ReactNgwMapData<M = any> {
  ngwMap: NgwMap<M>;
  ready: boolean;
}

export interface ReactNgwMapProps {
  mapAdapter: MapAdapter;
  fullFilling: boolean;
  connector: NgwConnector;
  baseUrl: string;
  qmsId: string;
  webMapId: string;
  mapOptions: NgwMapOptions;
}

export interface MapContainerProps extends NgwMapOptions {
  children?: ReactNode;
  className?: string;
  id?: string;
  placeholder?: ReactNode;
  style?: CSSProperties;
  whenCreated?: (map: NgwMap) => void;
}
