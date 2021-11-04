import { PointLayer, NgwResource, Column } from '../../../packages/ngw-orm/src';

export interface ISandboxPointLayer {
  test: string;
  number: number;
}

@NgwResource({
  type: 'vector_layer',
  display_name: 'ngw-orm-point-layer-tests',
})
export class SandboxPointLayer
  extends PointLayer
  implements ISandboxPointLayer
{
  @Column()
  test!: string;
  @Column()
  number!: number;
}
