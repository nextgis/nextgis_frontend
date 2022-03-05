import { PointLayer, NgwResource, Column } from '../../../packages/ngw-orm/src';

export interface ISandboxPointLayerSpecial {
  ATTR_G: string;
  ATTR_N: string;
  ATTR_Z: string;
  ATTR_S: string;
  ATTR_K: string;
  ATTR_P: string;
}

@NgwResource({
  type: 'vector_layer',
  display_name: 'ngw-orm-point-layer-tests',
})
export class SandboxPointLayerSpecial
  extends PointLayer
  implements ISandboxPointLayerSpecial
{
  @Column()
  ATTR_G!: string;
  @Column()
  ATTR_N!: string;
  @Column()
  ATTR_Z!: string;
  @Column()
  ATTR_S!: string;
  @Column()
  ATTR_K!: string;
  @Column()
  ATTR_P!: string;
}
