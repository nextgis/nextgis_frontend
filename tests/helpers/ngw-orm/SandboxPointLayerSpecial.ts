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
  @Column('STRING')
  ATTR_G!: string;
  @Column('STRING')
  ATTR_N!: string;
  @Column('STRING')
  ATTR_Z!: string;
  @Column('STRING')
  ATTR_S!: string;
  @Column('STRING')
  ATTR_K!: string;
  @Column('STRING')
  ATTR_P!: string;
}
